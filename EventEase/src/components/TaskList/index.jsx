import { useState } from 'react';
import TodoItem from '../TodoItem';
import './styles.css';

const TaskList = () => {
  const [categories, setCategories] = useState([
    { 
      id: 1, 
      name: 'Planning', 
      tasks: [
        { id: 1, text: 'Create event proposal', completed: false, priority: 'high' },
        { id: 2, text: 'Set event date', completed: true, priority: 'medium' },
        { id: 3, text: 'Book venue', completed: false, priority: 'high' }
      ] 
    },
    { 
      id: 2, 
      name: 'Marketing', 
      tasks: [
        { id: 4, text: 'Design event flyer', completed: false, priority: 'medium' },
        { id: 5, text: 'Create social media campaign', completed: true, priority: 'high' },
        { id: 6, text: 'Send out invitations', completed: false, priority: 'low' }
      ] 
    },
    { 
      id: 3, 
      name: 'Logistics', 
      tasks: [
        { id: 7, text: 'Arrange transportation', completed: false, priority: 'high' },
        { id: 8, text: 'Order catering', completed: false, priority: 'medium' }
      ] 
    }
  ]);

  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [slidePosition, setSlidePosition] = useState(0);
  
  // Add state for editing
  const [editingTask, setEditingTask] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const toggleTaskCompletion = (categoryId, taskId) => {
    setCategories(categories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          tasks: category.tasks.map(task => {
            if (task.id === taskId) {
              return { ...task, completed: !task.completed };
            }
            return task;
          })
        };
      }
      return category;
    }));
  };

  const addNewTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    const highestTaskId = Math.max(...categories.flatMap(cat => cat.tasks.map(task => task.id)), 0);
    
    setCategories(categories.map(category => {
      if (category.id === newTaskCategory) {
        return {
          ...category,
          tasks: [
            ...category.tasks,
            {
              id: highestTaskId + 1,
              text: newTaskText,
              completed: false,
              priority: 'medium'
            }
          ]
        };
      }
      return category;
    }));
    
    setNewTaskText('');
  };

  const slideRight = () => {
    setSlidePosition(prev => Math.max(prev - 1, -categories.length + 1));
  };

  const slideLeft = () => {
    setSlidePosition(prev => Math.min(prev + 1, 0));
  };

  // Handle deleting a task
  const handleDeleteTask = (categoryId, taskId) => {
    setCategories(categories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          tasks: category.tasks.filter(task => task.id !== taskId)
        };
      }
      return category;
    }));
  };

  // Open edit modal with task data
  const handleEditTask = (categoryId, task) => {
    setEditingTask({
      categoryId,
      ...task
    });
    setShowEditModal(true);
  };

  // Save edited task
  const saveEditedTask = () => {
    if (!editingTask.text.trim()) return;
    
    setCategories(categories.map(category => {
      if (category.id === editingTask.categoryId) {
        return {
          ...category,
          tasks: category.tasks.map(task => {
            if (task.id === editingTask.id) {
              return {
                id: task.id,
                text: editingTask.text,
                completed: task.completed,
                priority: editingTask.priority
              };
            }
            return task;
          })
        };
      }
      return category;
    }));
    
    setShowEditModal(false);
    setEditingTask(null);
  };

  // Filter tasks based on selected category
  const filteredCategories = selectedCategory === 'all' 
    ? categories 
    : categories.filter(category => category.name.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="task-list-container">
      <h2>Event Management Tasks</h2>
      
      <div className="category-filter">
        <button 
          className={selectedCategory === 'all' ? 'active' : ''} 
          onClick={() => setSelectedCategory('all')}
        >
          All
        </button>
        {categories.map(category => (
          <button 
            key={category.id} 
            className={selectedCategory === category.name.toLowerCase() ? 'active' : ''} 
            onClick={() => setSelectedCategory(category.name.toLowerCase())}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      <div className="task-slider-container">
        <button 
          className="slider-button" 
          onClick={slideLeft}
          disabled={slidePosition >= 0}
        >
          &lt;
        </button>
        
        <div className="tasks-slider">
          <div 
            className="slider-content" 
            style={{ transform: `translateX(${slidePosition * 300}px)` }}
          >
            {filteredCategories.map(category => (
              <div key={category.id} className="category-column">
                <h3>{category.name}</h3>
                <div className="task-items">
                  {category.tasks.map(task => (
                    <TodoItem 
                      key={task.id}
                      task={task}
                      onToggle={() => toggleTaskCompletion(category.id, task.id)}
                      onEdit={() => handleEditTask(category.id, task)}
                      onDelete={() => handleDeleteTask(category.id, task.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <button 
          className="slider-button"
          onClick={slideRight}
          disabled={slidePosition <= -categories.length + 1}
        >
          &gt;
        </button>
      </div>
      
      {/* Edit Task Modal */}
      {showEditModal && (
        <div className="task-modal-overlay">
          <div className="task-modal">
            <h3>Edit Task</h3>
            <div className="form-group">
              <label>Task Description:</label>
              <input
                type="text"
                value={editingTask.text}
                onChange={(e) => setEditingTask({...editingTask, text: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Priority:</label>
              <select
                value={editingTask.priority}
                onChange={(e) => setEditingTask({...editingTask, priority: e.target.value})}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="modal-actions">
              <button onClick={saveEditedTask} className="save-btn">Save Changes</button>
              <button onClick={() => setShowEditModal(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
      
      <div className="add-task-form">
        <h3>Add New Task</h3>
        <form onSubmit={addNewTask}>
          <input
            type="text"
            placeholder="Enter task description"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
          />
          <select 
            value={newTaskCategory}
            onChange={(e) => setNewTaskCategory(Number(e.target.value))}
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <button type="submit">Add Task</button>
        </form>
      </div>
    </div>
  );
};

export default TaskList;