
import PropTypes from "prop-types";
import "./TaskForm.css";

const TaskForm = ({ getData }) => {
    const addTask = async (obj) => {
        try {
            const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tasks`, {
                method: "POST",
                body: JSON.stringify({
                    ...obj,
                    status: "todo"  // Adding default status
                }),
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const respObj = await resp.json();
            console.log("Response:", respObj); // Debug log

            if (respObj.status === "success") {
                getData();
            } else {
                throw new Error(respObj.message || "Failed to add task");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to add task");
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
            priority: form.priority.value
        };

        console.log("Sending data:", dataObj); // Debug log
        addTask(dataObj);
        form.reset();
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