import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { deleteAccount } from '../utils/api';
import './Profile.css';

function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to delete account:', error);
      alert('Failed to delete account');
    }
  };

  return (
    <div className="profile-container">
      <nav className="profile-navbar">
        <h1 className="profile-logo">TaskFlow</h1>
        <button onClick={() => navigate('/dashboard')} className="profile-back-btn">
          ← Back to Dashboard
        </button>
      </nav>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h2 className="profile-name">{user?.name}</h2>
            <p className="profile-email">{user?.email}</p>
          </div>

          <div className="profile-section">
            <h3 className="profile-section-title">Account Information</h3>
            <div className="profile-info-grid">
              <div className="profile-info-item">
                <span className="profile-info-label">Name</span>
                <span className="profile-info-value">{user?.name}</span>
              </div>
              <div className="profile-info-item">
                <span className="profile-info-label">Email</span>
                <span className="profile-info-value">{user?.email}</span>
              </div>
              <div className="profile-info-item">
                <span className="profile-info-label">Account ID</span>
                <span className="profile-info-value">{user?.id}</span>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3 className="profile-section-title">Actions</h3>
            <button onClick={handleLogout} className="profile-logout-btn">
              Logout
            </button>
          </div>

          <div className="profile-section profile-danger-zone">
            <h3 className="profile-section-title">Danger Zone</h3>
            <p className="profile-danger-text">
              Deleting your account is permanent and cannot be undone. All your boards and tasks will be deleted.
            </p>
            <button 
              onClick={() => setShowDeleteModal(true)} 
              className="profile-delete-btn"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="profile-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="profile-modal-title">Delete Account?</h3>
            <p className="profile-modal-text">
              This action is <strong>permanent</strong> and cannot be undone. All your boards, tasks, and data will be permanently deleted.
            </p>
            <p className="profile-modal-text">
              Are you absolutely sure you want to delete your account?
            </p>
            <div className="profile-modal-buttons">
              <button 
                onClick={handleDeleteAccount} 
                className="profile-modal-delete-btn"
              >
                Yes, Delete My Account
              </button>
              <button 
                onClick={() => setShowDeleteModal(false)} 
                className="profile-modal-cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;