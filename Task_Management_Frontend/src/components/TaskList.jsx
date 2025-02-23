
import PropTypes from "prop-types";
import "./TaskList.css";

const TaskList = ({ title, tasks, getData, type }) => {
    const handleStatusChange = async (taskId, newStatus) => {
        try {
            const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tasks/${taskId}`, {
                method: "PATCH",
                body: JSON.stringify({ status: newStatus }),
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            });
            const data = await resp.json();
            if (data.status === "success") {
                getData();
            }
        } catch (error) {
            alert("Error updating task status");
        }
    };

    const handleDelete = async (taskId) => {
        if (!confirm("Are you sure you want to delete this task?")) return;
        
        try {
            const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tasks/${taskId}`, {
                method: "DELETE",
                credentials: "include"
            });
            if (resp.status === 204) {
                getData();
            }
        } catch (error) {
            alert("Error deleting task");
        }
    };

    const getPriorityColor = (priority) => {
        const colors = {
            urgent: "#EF4444",
            high: "#F97316",
            normal: "#EAB308",
            low: "#22C55E"
        };
        return colors[priority] || colors.normal;
    };

    const getPriorityIcon = (priority) => {
        const icons = {
            urgent: "🔴",
            high: "🟠",
            normal: "🟡",
            low: "🟢"
        };
        return icons[priority] || "🟡";
    };

    const formatDate = (dateString) => {
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit', 
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <div className="task-list-container">
            <div className="task-list-header">
                <h3>{title}</h3>
                <span className="task-count">{tasks.length}</span>
            </div>

            <div className="tasks-wrapper">
                {tasks.length === 0 ? (
                    <div className="empty-state">
                        <p>No tasks found</p>
                        <span className="empty-icon">📝</span>
                    </div>
                ) : (
                    <div className="task-grid">
                        {tasks.map(task => (
                            <div key={task._id} className="task-card">
                                <div className="task-card-header">
                                    <span className="priority-badge" style={{
                                        backgroundColor: getPriorityColor(task.priority),
                                        opacity: 0.1
                                    }}>
                                        {getPriorityIcon(task.priority)} {task.priority.toUpperCase()}
                                    </span>
                                    <div className="task-status">
                                        {task.status === "todo" ? (
                                            <span className="status-badge pending">Pending</span>
                                        ) : (
                                            <span className="status-badge completed">Completed</span>
                                        )}
                                    </div>
                                </div>

                                <div className="task-card-content">
                                    <h4 className="task-title">{task.taskTitle}</h4>
                                    
                                    <div className="task-info">
                                        <div className="info-item">
                                            <span className="info-label">👤 Assignee:</span>
                                            <span className="info-value">{task.assignee}</span>
                                        </div>
                                        
                                        <div className="info-item">
                                            <span className="info-label">⏰ Deadline:</span>
                                            <span className="info-value">{formatDate(task.deadline)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="task-card-actions">
                                    {task.status === "todo" && (
                                        <button
                                            className="action-btn complete-btn"
                                            onClick={() => handleStatusChange(task._id, "done")}
                                        >
                                            ✓ Mark Complete
                                        </button>
                                    )}
                                    <button
                                        className="action-btn delete-btn"
                                        onClick={() => handleDelete(task._id)}
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

TaskList.propTypes = {
    title: PropTypes.string.isRequired,
    tasks: PropTypes.array.isRequired,
    getData: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
};

export default TaskList;