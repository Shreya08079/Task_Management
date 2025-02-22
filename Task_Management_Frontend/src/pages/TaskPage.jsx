import { useEffect, useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import TaskFilters from "../components/TaskFilters";
import "./TaskPage.css";

const TaskPage = () => {
    const [list, setList] = useState([]); 
    const [filtersObj, setFiltersObj] = useState({
        priority: "",
    });
   

    const getData = async () => {
        const query = [];
        if (filtersObj.priority) {
            query.push(`priority=${filtersObj.priority}`);
        }
        console.log(query);
        const resp = await fetch(`
            ${import.meta.env.VITE_BACKEND_URL}/tasks?${query}
        `,{
            credentials: 'include'
        });
        const respBody = await resp.json();
        const arrayOfTaskList = respBody.data.tasks;
        setList(arrayOfTaskList);
    };

    useEffect(() => {
        getData();
    }, [filtersObj]);

    return (
        <div>
            <h2>Welcome to Task Management Tool!</h2>
            <TaskForm getData={getData} />
            <TaskFilters setFiltersObj={setFiltersObj} />
            <div className="multi-task-lists-container">
                <TaskList list={list} getData={getData} filterObj={{ status: "todo" }} title="Todo List" />
                <TaskList list={list} getData={getData} filterObj={{ status: "done" }} title="Done List" />
            </div>
        </div>
    );
};

export default TaskPage;