import { useState , useEffect } from "react";

export const CATEGORIES = ["生活", "仕事"] as const;
export type Category = typeof CATEGORIES[number];

export type Task = {
  title: string;
  done: boolean;
  deadline?: string;
  category: Category;
};

const STORAGE_KEY = "todo-tasks";

const getDefaultTasks = (): Task[] =>{
  return [
    {
      title: "買い物",
      done: true,
      deadline: "2025-10-31",
      category: "生活",
    },
    {
      title: "メール返信",
      done: false,
      deadline: "2025-11-05",
      category: "仕事",
    },
    {
      title: "レポート提出",
      done: false,
      category: "仕事",
    },
  ]
}

export const useHandleTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if(savedData){
      try{
        return JSON.parse(savedData) as Task[];
      }
      catch(e){
        return getDefaultTasks();
      }
    }
    else{
      return getDefaultTasks();
    }
  }); 

  useEffect(() => {localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));}, [tasks]);

  const addTask = (task: Task) => {
    setTasks([...tasks, task]);
  };

  const removeTask = (task: Task) => {
    setTasks(tasks.filter((_) => _ !== task));
  };

  const setTaskDone = (task: Task, done: boolean) => {
    setTasks(tasks.map((_) =>_ !== task ? _: {...task,done,}));
  };

  return {
    tasks,
    addTask,
    removeTask,
    setTaskDone,
  };
};
