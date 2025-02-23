import { useEffect, useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import "./TaskPage.css";

const TaskPage = () => {
    const [tasks, setTasks] = useState([]);
    const [filters, setFilters] = useState({
        priority: "all",
        status: "all",
    });

    // Fetch all tasks
    const getData = async () => {
        try {
          const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tasks`, {
            credentials: 'include'
          });
          const data = await resp.json();
          console.log("Fetched data:", data);  // Log response for debugging
      
          if (data.status === "success") {
            setTasks(data.data.tasks);  // Correctly set tasks based on the response
          }
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
      };
      

    useEffect(() => {
        getData();  // Fetch tasks when the component mounts
    }, []);

    return (
        <div className="task-page">
            <div className="task-page-container">
                {/* Left Panel - Task Form */}
                <div className="left-panel">
                    <TaskForm getData={getData} /> {/* Pass getData to TaskForm */}
                </div>

                {/* Right Panel - Task Lists */}
                <div className="right-panel">
                    {/* All Tasks Section */}
                    <div className="task-section">
                        <h2>All Tasks</h2>
                        <TaskList 
                            title="All Tasks"
                            tasks={tasks}
                            getData={getData}
                            type="all"
                        />
                    </div>

                    {/* Task Status Sections */}
                    <div className="task-status-sections">
                        <TaskList 
                            title="Pending Tasks"
                            tasks={tasks.filter(task => task.status === "todo")}
                            getData={getData}
                            type="pending"
                        />
                        <TaskList 
                            title="Completed Tasks"
                            tasks={tasks.filter(task => task.status === "done")}
                            getData={getData}
                            type="completed"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskPage;
