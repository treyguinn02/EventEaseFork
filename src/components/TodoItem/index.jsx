import { useState } from 'react';
import './styles.css';

const TodoItem = ({ task, onToggle, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getPriorityClass = () => {
    switch (task.priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return '';
    }
  };

  return (
    <div 
      className={`todo-item ${task.completed ? 'completed' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="checkbox-container">
        <input 
          type="checkbox" 
          checked={task.completed} 
          onChange={onToggle} 
          id={`task-${task.id}`}
        />
        <label htmlFor={`task-${task.id}`} className="checkbox-label">
          <span className="checkbox-custom"></span>
        </label>
      </div>
      
      <div className="todo-content">
        <div className="todo-text">{task.text}</div>
        <span className={`priority-tag ${getPriorityClass()}`}>
          {task.priority}
        </span>
      </div>
      
      {isHovered && (
        <div className="todo-actions">
          <button className="action-button edit" onClick={() => onEdit(task)}>
            <i className="icon">✏️</i>
          </button>
          <button className="action-button delete" onClick={() => onDelete(task.id)}>
            <i className="icon">🗑️</i>
          </button>
        </div>
      )}
    </div>
  );
};

export default TodoItem;
