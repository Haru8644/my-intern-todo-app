import React, { useState } from "react";
import { useHandleTasks , Task , Category, CATEGORIES } from "./useHandleTasks";
import "./App.css";

const App: React.FC = () => {
  const { tasks, addTask, removeTask, setTaskDone } = useHandleTasks();
  const [title, setTitle] = useState("");
  const [IsDeadlineEnabled, setIsDeadlineEnabled] = useState(false);
  const [deadline, setDeadline] = useState("");
  const [newCategory, setNewCategory] = useState<Category>(CATEGORIES[0]);
  const [filterCategory, setFilterCategory] = useState<Category | "すべて">("すべて");
  return (
    <>
      <div className="form">
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="button"
            value="追加"
            onClick={() => {
              if(title==="")return;
              const newTask:Task = {
                title:title,
                done:false,
                deadline: IsDeadlineEnabled?deadline:undefined,
                category: newCategory,
              };
              addTask(newTask);
              setTitle("");
              setDeadline("");
              setIsDeadlineEnabled(false);
            }}
          />
        </div>
        <div>
          <label>
            <input type="checkbox"
                   checked={IsDeadlineEnabled}
                   onChange={(e)=>setIsDeadlineEnabled(e.target.checked)}
            />
            期限を設定
          </label>
          {IsDeadlineEnabled && (
            <input type="date" 
                   value={deadline} 
                   onChange={(e)=>setDeadline(e.target.value)}
            />
          )}
       </div>
       <div>
        <label>
          カテゴリ:
        </label>
          <select value={newCategory} onChange={(e) => setNewCategory(e.target.value as Category)}>
            {CATEGORIES.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
          </select>
       </div>
      </div>
      <div className="filter">
        <label>
          カテゴリで絞り込む:
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value as Category | "すべて")}>
            <option value="すべて">すべて表示</option>
            {CATEGORIES.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
          </select>
        </label>
      </div>
      <ul>
        {(() => { 
          const today = new Date().toISOString().split('T')[0];

          const filterdTasks = tasks.filter((task) => {
            if(filterCategory === "すべて")return true;
            return task.category === filterCategory; 
          });

          const sortedTasks = filterdTasks.slice().sort((a, b) => {
            if (!a.deadline) return 1; 
            if (!b.deadline) return -1; 
            return a.deadline.localeCompare(b.deadline);
          });

          return sortedTasks.map((task, i) => {
            const isExpired = task.deadline ? task.deadline < today : false;

            return (
              <li key={i} className={isExpired ? "expired" : ""}>
                <label> 
                  <input type="checkbox" checked={task.done} onChange={(e) => setTaskDone(task, e.target.checked)}/>
                  <span>[{task.category}]</span>
                  {task.title}
                  {task.deadline && (<p>期限: {task.deadline}</p>)}
                </label>
                <button onClick={() => removeTask(task)}>×</button>
              </li>
            );
          });
        })()}
      </ul>
    </>
  );
};

export default App;
