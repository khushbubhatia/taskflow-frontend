import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBoard, getTasks, createTask, moveTask, deleteTask, getSuggestion } from '../utils/api';
import './BoardView.css';

function BoardView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [draggedTask, setDraggedTask] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState(null);

  useEffect(() => {
    loadBoardData();
  }, [id]);

  const loadBoardData = async () => {
    try {
      const [boardData, tasksData] = await Promise.all([
        getBoard(id),
        getTasks(id)
      ]);
      setBoard(boardData);
      setTasks(tasksData);
    } catch (error) {
      console.error('Failed to load board:', error);
      alert('Failed to load board');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const newTask = await createTask({
        title: newTaskTitle,
        description: newTaskDesc,
        board: id
      });
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      setNewTaskDesc('');
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to create task:', error);
      alert('Failed to create task');
    }
  };

  const handleDeleteTask = async () => {
    try {
      await deleteTask(deleteTaskId);
      setTasks(tasks.filter(t => t._id !== deleteTaskId));
      setDeleteTaskId(null);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    
    if (!draggedTask || draggedTask.status === newStatus) {
      setDraggedTask(null);
      return;
    }

    try {
      const updatedTasks = tasks.map(t =>
        t._id === draggedTask._id ? { ...t, status: newStatus } : t
      );
      setTasks(updatedTasks);
      await moveTask(draggedTask._id, { status: newStatus });
    } catch (error) {
      console.error('Failed to move task:', error);
      loadBoardData();
    }

    setDraggedTask(null);
  };

  const handleMobileMove = async (taskId, newStatus) => {
    const task = tasks.find(t => t._id === taskId);
    if (!task || task.status === newStatus) return;

    try {
      const updatedTasks = tasks.map(t =>
        t._id === taskId ? { ...t, status: newStatus } : t
      );
      setTasks(updatedTasks);
      await moveTask(taskId, { status: newStatus });
    } catch (error) {
      console.error('Failed to move task:', error);
      loadBoardData();
    }
  };

  const handleGetSuggestion = async () => {
    setLoadingSuggestion(true);
    try {
      const data = await getSuggestion(id);
      setSuggestion(data.suggestion);
    } catch (error) {
      console.error('Failed to get suggestion:', error);
      alert('Failed to get AI suggestion');
    } finally {
      setLoadingSuggestion(false);
    }
  };

  const handleAddSuggestion = async () => {
    try {
      const newTask = await createTask({
        title: suggestion,
        description: 'Suggested by AI',
        board: id
      });
      setTasks([...tasks, newTask]);
      setSuggestion(null);
    } catch (error) {
      console.error('Failed to add suggestion:', error);
    }
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(t => t.status === status);
  };

  if (loading) {
    return <div className="loading">Loading board...</div>;
  }

  const columns = [
    { id: 'todo', title: 'TO DO', status: 'todo' },
    { id: 'inprogress', title: 'IN PROGRESS', status: 'inprogress' },
    { id: 'done', title: 'DONE', status: 'done' }
  ];

  return (
    <div className="board-container">
      <nav className="board-navbar">
        <div className="board-nav-left">
          <button onClick={() => navigate('/dashboard')} className="board-back-btn">
            ← Back
          </button>
          <h1 className="board-title">{board?.title}</h1>
        </div>
        <button 
          onClick={handleGetSuggestion} 
          disabled={loadingSuggestion}
          className="board-ai-btn"
        >
          {loadingSuggestion ? 'Getting suggestion...' : 'AI Suggest Task'}
        </button>
      </nav>

      <div className="board-content">
        <div className="board-columns">
          {columns.map(column => {
            const columnTasks = getTasksByStatus(column.status);
            
            return (
              <div 
                key={column.id} 
                className="board-column"
                data-status={column.status}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.status)}
              >
                <div className="board-column-header">
                  <h3 className="board-column-title">{column.title}</h3>
                  <span className="board-task-count">{columnTasks.length}</span>
                </div>

                <div className="board-tasks-list">
                  {columnTasks.length === 0 ? (
                    <div className="board-empty-state">No tasks</div>
                  ) : (
                    columnTasks.map(task => (
                      <div
                        key={task._id}
                        className="board-task-card"
                        draggable
                        onDragStart={(e) => handleDragStart(e, task)}
                      >
                        <div className="board-task-title">{task.title}</div>
                        {task.description && (
                          <div className="board-task-desc">{task.description}</div>
                        )}
                        
                        {/* Mobile Move Buttons */}
                        <div className="board-task-mobile-actions">
                          {task.status !== 'todo' && (
                            <button
                              onClick={() => handleMobileMove(task._id, 'todo')}
                              className="board-move-btn board-move-todo"
                            >
                              ← To Do
                            </button>
                          )}
                          {task.status !== 'inprogress' && (
                            <button
                              onClick={() => handleMobileMove(task._id, 'inprogress')}
                              className="board-move-btn board-move-progress"
                            >
                              → Progress
                            </button>
                          )}
                          {task.status !== 'done' && (
                            <button
                              onClick={() => handleMobileMove(task._id, 'done')}
                              className="board-move-btn board-move-done"
                            >
                              ✓ Done
                            </button>
                          )}
                        </div>

                        <div className="board-task-footer">
                          <button
                            onClick={() => setDeleteTaskId(task._id)}
                            className="board-task-delete-btn"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {column.status === 'todo' && (
                  <button 
                    onClick={() => setShowAddModal(true)}
                    className="board-add-task-btn"
                  >
                    + Add Task
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showAddModal && (
        <div className="board-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="board-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="board-modal-title">Add New Task</h3>
            <form onSubmit={handleAddTask} className="board-form">
              <input
                type="text"
                placeholder="Task Title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                required
                className="board-input"
              />
              <textarea
                placeholder="Description (optional)"
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
                rows="3"
                className="board-textarea"
              />
              <div className="board-modal-buttons">
                <button type="submit" className="board-submit-btn">
                  Add Task
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="board-cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTaskId && (
        <div className="board-modal-overlay" onClick={() => setDeleteTaskId(null)}>
          <div className="board-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="board-modal-title">Delete Task?</h3>
            <p style={{ marginBottom: '24px', color: '#64748b', fontSize: '15px' }}>
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="board-modal-buttons">
              <button 
                onClick={handleDeleteTask} 
                className="board-submit-btn" 
                style={{ background: '#DC2626' }}
              >
                Delete Task
              </button>
              <button onClick={() => setDeleteTaskId(null)} className="board-cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {suggestion && (
        <div className="board-suggestion-toast">
          <div className="board-suggestion-title">AI Suggestion</div>
          <div className="board-suggestion-text">{suggestion}</div>
          <div className="board-suggestion-buttons">
            <button onClick={handleAddSuggestion} className="board-suggestion-add-btn">
              Add as Task
            </button>
            <button onClick={() => setSuggestion(null)} className="board-suggestion-close-btn">
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BoardView;