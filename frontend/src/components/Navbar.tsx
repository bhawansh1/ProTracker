import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layout, LogOut, CheckSquare, BarChart2 } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Layout size={24} color="var(--primary)" />
        <span>ProTrack</span>
      </div>
      <div className="nav-links">
        <Link to="/"><BarChart2 size={18} /> Dashboard</Link>
        <Link to="/projects"><CheckSquare size={18} /> Projects</Link>
      </div>
      <div className="nav-user">
        <span className="user-name">{user?.name}</span>
        <button onClick={handleLogout} className="btn-logout">
          <LogOut size={18} />
        </button>
      </div>
      <style>{`
        .navbar {
          height: 64px;
          background: white;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .nav-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 700;
          font-size: 1.25rem;
          color: var(--text-main);
        }
        .nav-links {
          display: flex;
          gap: 2rem;
        }
        .nav-links a {
          text-decoration: none;
          color: var(--text-muted);
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: color 0.2s;
        }
        .nav-links a:hover {
          color: var(--primary);
        }
        .nav-user {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .user-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-muted);
        }
        .btn-logout {
          background: transparent;
          color: var(--text-muted);
          padding: 0.5rem;
        }
        .btn-logout:hover {
          color: var(--danger);
          background: #fee2e2;
        }
        .content {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
