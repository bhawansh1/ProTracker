import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Plus, Users, Layout } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  owner: { name: string };
  _count: { tasks: number };
}

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/projects', { name: newName, description: newDesc });
      setShowModal(false);
      setNewName('');
      setNewDesc('');
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading Projects...</div>;

  return (
    <div className="project-list fade-in">
      <header className="page-header">
        <div>
          <h1>Projects</h1>
          <p>Manage your team projects and workspaces</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> New Project
        </button>
      </header>

      <div className="project-grid">
        {projects.map((project) => (
          <Link to={`/projects/${project.id}`} key={project.id} className="project-card card">
            <div className="project-icon"><Layout size={24} color="var(--primary)" /></div>
            <h3 className="project-name">{project.name}</h3>
            <p className="project-desc">{project.description || 'No description provided'}</p>
            <div className="project-footer">
              <span className="owner">By {project.owner.name}</span>
              <span className="task-count">{project._count.tasks} Tasks</span>
            </div>
          </Link>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create New Project</h2>
            <form onSubmit={handleCreate}>
              <div className="input-group">
                <label>Project Name</label>
                <input value={newName} onChange={(e) => setNewName(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} rows={3} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; }
        .page-header h1 { font-size: 1.875rem; font-weight: 700; }
        .page-header p { color: var(--text-muted); }
        .btn-primary { display: flex; align-items: center; gap: 0.5rem; }

        .project-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        .project-card {
          text-decoration: none;
          color: inherit;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .project-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
          border-color: var(--primary);
        }
        .project-icon { margin-bottom: 1rem; }
        .project-name { font-size: 1.125rem; font-weight: 700; margin-bottom: 0.5rem; }
        .project-desc { font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1.5rem; height: 3rem; overflow: hidden; }
        .project-footer { display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 600; color: var(--text-muted); border-top: 1px solid var(--border); padding-top: 1rem; }
        
      `}</style>
    </div>
  );
};

export default ProjectList;
