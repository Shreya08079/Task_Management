import PropTypes from "prop-types";
import "./TaskForm.css"; // Create this CSS file for styling

const TaskForm = ({ getData }) => {
    const addTask = async (obj) => {
        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tasks`, {
            method: "POST",
            body: JSON.stringify(obj),
            credentials: "include",
            headers: {
                "content-type": "application/json",
            },
        });
        const respObj = await resp.json();
        if (respObj.status === "success") {
            console.log("success");
            getData();
        } else {
            alert(respObj.message);
        }
    };

    const handleAddTask = (e) => {
        e.preventDefault();
        if (e.target.assignee.value.length > 3) {
            const dataObj = {
                taskTitle: e.target.taskTitle.value,
                assignee: e.target.assignee.value,
                deadline: e.target.deadline.value,
                priority: e.target.priority.value,
                assignor: "Shreya Singh",
            };

            addTask(dataObj);
        } else {
            alert("Task Title and assignee is required");
        }
    };

    return (
        <div className="task-form-container">
            {/* <h1>Welcome to Task Management Tool!</h1> */}
            <form onSubmit={handleAddTask} className="task-form">
                <div className="form-group">
                    <label><b>Task Title</b></label>
                    <input type="text" name="taskTitle" className="form-input" />
                </div>
                <div className="form-group">
                    <label>Assignee</label>
                    <input type="text" name="assignee" required className="form-input" />
                </div>
                <div className="form-group">
                    <label>Deadline</label>
                    <input type="datetime-local" name="deadline" className="form-input" />
                </div>
                <div className="form-group">
                    <label>Priority</label>
                    <select name="priority" className="form-select">
                        <option value="normal">Normal</option>
                        <option value="low">Low</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                    </select>
                </div>
                <button type="submit" className="add-task-btn">Add Task</button>
            </form>
        </div>
    );
};

TaskForm.propTypes = {
    getData: PropTypes.func.isRequired,
};

export default TaskForm;