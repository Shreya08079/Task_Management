
import PropTypes from "prop-types";
import "./TaskForm.css";

const TaskForm = ({ getData }) => {
    const addTask = async (dataObj) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tasks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataObj),  // Send dataObj as the request body
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create task");
            }
    
            const createdTask = await response.json();  // Get the created task data
            console.log("Task created successfully:", createdTask); // Debug log
            getData();  // Refresh the task list
            alert("Task created successfully!");
        } catch (error) {
            console.error("Error creating task:", error);
            alert("Error creating task: " + error.message);
        }
    };
    

    const handleAddTask = (e) => {
        e.preventDefault();
        const form = e.target;
    
        // Basic validation
        if (form.taskTitle.value.trim().length === 0) {
            alert("Task title is required");
            return;
        }
    
        if (form.assignee.value.trim().length === 0) {
            alert("Assignee is required");
            return;
        }
    
        const dataObj = {
            taskTitle: form.taskTitle.value.trim(),
            assignee: form.assignee.value.trim(),
            deadline: form.deadline.value,
            priority: form.priority.value,
        };
    
        console.log("Sending data:", dataObj); // Debug log
        addTask(dataObj);  // Send data to addTask function
        form.reset();  // Reset the form after submission
        getData();
    };
    

    return (
        <div className="task-form-container">
            <form onSubmit={handleAddTask} className="task-form">
                <div className="form-group">
                    <label>Task Title</label>
                    <input 
                        type="text" 
                        name="taskTitle" 
                        className="form-input"
                        placeholder="Enter task title"
                        required 
                    />
                </div>

                <div className="form-group">
                    <label>Assignee</label>
                    <input 
                        type="text" 
                        name="assignee" 
                        className="form-input"
                        placeholder="Enter assignee name"
                        required 
                    />
                </div>

                <div className="form-group">
                    <label>Deadline</label>
                    <input 
                        type="datetime-local" 
                        name="deadline" 
                        className="form-input"
                        required 
                    />
                </div>

                <div className="form-group">
                    <label>Priority</label>
                    <select name="priority" className="form-select" required>
                        <option value="normal">Normal</option>
                        <option value="low">Low</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                    </select>
                </div>

                <button type="submit" className="add-task-btn">
                    Add Task
                </button>
            </form>
        </div>
    );
};

TaskForm.propTypes = {
    getData: PropTypes.func.isRequired,
};

export default TaskForm;