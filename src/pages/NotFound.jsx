import { useNavigate } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1 className="notfound-title">404</h1>
        <h2 className="notfound-subtitle">Page Not Found</h2>
        <p className="notfound-text">
          The page you're looking for doesn't exist.
        </p>
        <button onClick={() => navigate('/dashboard')} className="notfound-btn">
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

export default NotFound;