import React, { useState } from 'react';
import './TaskFilters.css'; 

const TaskFilters = ({ setFiltersObj }) => {
    const [activeFilters, setActiveFilters] = useState({});
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    const handleFilter = (key, value) => {
        setFiltersObj((prev) => {
            const newObj = { ...prev };
            if (value === '') {
                delete newObj[key];
            } else {
                newObj[key] = value;
            }
            setActiveFilters(newObj);
            return newObj;
        });
    };

    const clearFilters = () => {
        setFiltersObj({});
        setActiveFilters({});
        setDateRange({ start: '', end: '' });
    };

    return (
        <div className="task-filters-container">
            <h3>Filter Tasks</h3>
            
            <div className="filters-grid">
                {/* Priority Filter */}
                <div className="filter-group">
                    <label>Priority</label>
                    <select
                        name="priority"
                        onChange={(e) => handleFilter("priority", e.target.value)}
                        value={activeFilters.priority || ''}
                        className="filter-select"
                    >
                        <option value="">All Priorities</option>
                        <option value="urgent">⚡ Urgent</option>
                        <option value="high">🔴 High</option>
                        <option value="normal">🟡 Normal</option>
                        <option value="low">🟢 Low</option>
                    </select>
                </div>

                {/* Status Filter */}
                <div className="filter-group">
                    <label>Status</label>
                    <select
                        name="status"
                        onChange={(e) => handleFilter("status", e.target.value)}
                        value={activeFilters.status || ''}
                        className="filter-select"
                    >
                        <option value="">All Statuses</option>
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                {/* Date Range Filter */}
                <div className="filter-group">
                    <label>Due Date Range</label>
                    <div className="date-range-inputs">
                        <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => {
                                setDateRange(prev => ({ ...prev, start: e.target.value }));
                                handleFilter("startDate", e.target.value);
                            }}
                            className="date-input"
                        />
                        <span>to</span>
                        <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => {
                                setDateRange(prev => ({ ...prev, end: e.target.value }));
                                handleFilter("endDate", e.target.value);
                            }}
                            className="date-input"
                        />
                    </div>
                </div>

                {/* Tags Filter */}
                <div className="filter-group">
                    <label>Tags</label>
                    <div className="tags-container">
                        {['Work', 'Personal', 'Important', 'Project'].map(tag => (
                            <label key={tag} className="tag-checkbox">
                                <input
                                    type="checkbox"
                                    checked={activeFilters.tags?.includes(tag)}
                                    onChange={(e) => {
                                        const currentTags = activeFilters.tags || [];
                                        const newTags = e.target.checked
                                            ? [...currentTags, tag]
                                            : currentTags.filter(t => t !== tag);
                                        handleFilter("tags", newTags);
                                    }}
                                />
                                {tag}
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Active Filters Display */}
            <div className="active-filters">
                {Object.keys(activeFilters).length > 0 && (
                    <>
                        <div className="active-filters-list">
                            <span>Active Filters: </span>
                            {Object.entries(activeFilters).map(([key, value]) => (
                                <span key={key} className="filter-tag">
                                    {key}: {Array.isArray(value) ? value.join(', ') : value}
                                    <button
                                        onClick={() => handleFilter(key, '')}
                                        className="remove-filter"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                        <button onClick={clearFilters} className="clear-filters-btn">
                            Clear All Filters
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default TaskFilters;