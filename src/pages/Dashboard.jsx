import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getBoards, createBoard, deleteBoard } from '../utils/api';
import './Dashboard.css';

function Dashboard() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newBoardDesc, setNewBoardDesc] = useState('');
  const [newBoardContext, setNewBoardContext] = useState('');

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    try {
      const data = await getBoards();
      setBoards(data);
    } catch (error) {
      console.error('Failed to load boards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    
    if (!newBoardContext.trim()) {
      alert('Project context is required for AI suggestions!');
      return;
    }
    
    try {
      await createBoard({ 
        title: newBoardTitle, 
        description: newBoardDesc,
        context: newBoardContext 
      });
      setNewBoardTitle('');
      setNewBoardDesc('');
      setNewBoardContext('');
      setShowModal(false);
      loadBoards();
    } catch (error) {
      console.error('Failed to create board:', error);
    }
  };

  const handleDeleteBoard = async (id) => {
    if (window.confirm('Delete this board?')) {
      try {
        await deleteBoard(id);
        loadBoards();
      } catch (error) {
        console.error('Failed to delete board:', error);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <nav className="dashboard-navbar">
        <h1 className="dashboard-logo">TaskFlow</h1>
        <div className="dashboard-nav-right">
          <span className="dashboard-username">Hello, {user?.name}!</span>
          <button onClick={() => navigate('/profile')} className="dashboard-profile-btn">
            Profile
            </button>
            <button onClick={handleLogout} className="dashboard-logout-btn">
              Logout
              </button>
              </div>
              </nav>

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2 className="dashboard-page-title">My Boards</h2>
          <button onClick={() => setShowModal(true)} className="dashboard-create-btn">
            + New Board
          </button>
        </div>

        <div className="dashboard-grid">
          {boards.length === 0 ? (
            <p className="dashboard-empty-state">No boards yet. Create one to get started!</p>
          ) : (
            boards.map((board) => (
              <div key={board._id} className="dashboard-card">
                <h3 className="dashboard-card-title">{board.title}</h3>
                <p className="dashboard-card-desc">{board.description || 'No description'}</p>
                <div className="dashboard-card-footer">
                  <button
                    onClick={() => navigate(`/board/${board._id}`)}
                    className="dashboard-open-btn"
                  >
                    Open
                  </button>
                  <button
                    onClick={() => handleDeleteBoard(board._id)}
                    className="dashboard-delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className="dashboard-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="dashboard-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="dashboard-modal-title">Create New Board</h3>
            <form onSubmit={handleCreateBoard} className="dashboard-form">
              <input
                type="text"
                placeholder="Board Title *"
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
                required
                className="dashboard-input"
              />
              <textarea
                placeholder="Description (optional)"
                value={newBoardDesc}
                onChange={(e) => setNewBoardDesc(e.target.value)}
                rows="2"
                className="dashboard-textarea"
              />
              <textarea
                placeholder="Project Context/Summary - What is this project about? Goals? Tech stack? * (Required for AI suggestions)"
                value={newBoardContext}
                onChange={(e) => setNewBoardContext(e.target.value)}
                rows="4"
                required
                className="dashboard-textarea"
              />
              <div className="dashboard-modal-buttons">
                <button type="submit" className="dashboard-submit-btn">
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="dashboard-cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;