import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { Plus, UserPlus, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  dueDate: string;
  assignee?: { name: string; email: string };
}

interface Member {
  id: string;
  user: { id: string; name: string; email: string };
  role: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
  members: Member[];
}

const ProjectDetail: React.FC = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  
  // Form states
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskDue, setTaskDue] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('');
  const [memberEmail, setMemberEmail] = useState('');

  const fetchProject = async () => {
    try {
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/tasks', { 
        title: taskTitle, 
        description: taskDesc, 
        dueDate: taskDue, 
        projectId: id, 
        assigneeId: taskAssignee || null 
      });
      setShowTaskModal(false);
      fetchProject();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${id}/members`, { email: memberEmail });
      setShowMemberModal(false);
      fetchProject();
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (taskId: string, status: string) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status });
      fetchProject();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading Project...</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div className="project-detail fade-in">
      <header className="page-header">
        <div>
          <h1>{project.name}</h1>
          <p>{project.description}</p>
        </div>
        <div className="header-actions">
          <button className="btn-outline" onClick={() => setShowMemberModal(true)}>
            <UserPlus size={18} /> Add Member
          </button>
          <button className="btn-primary" onClick={() => setShowTaskModal(true)}>
            <Plus size={18} /> New Task
          </button>
        </div>
      </header>

      <div className="detail-grid">
        <section className="tasks-section">
          <div className="section-header">
            <h3>Tasks ({project.tasks.length})</h3>
          </div>
          <div className="task-list">
            {project.tasks.map(task => (
              <div key={task.id} className="task-item card">
                <div className="task-main">
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>
                  <div className="task-meta">
                    {task.dueDate && <span><Calendar size={14} /> {format(new Date(task.dueDate), 'MMM d, yyyy')}</span>}
                    {task.assignee && <span className="assignee">@ {task.assignee.name}</span>}
                  </div>
                </div>
                <div className="task-status-control">
                  <span className={`badge badge-${task.status.toLowerCase().replace('_', '-')}`}>
                    {task.status}
                  </span>
                  <select 
                    value={task.status} 
                    onChange={(e) => updateStatus(task.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="members-section">
          <h3>Team Members</h3>
          <div className="member-list card">
            {project.members.map(member => (
              <div key={member.id} className="member-item">
                <div className="member-avatar">{member.user.name[0]}</div>
                <div className="member-info">
                  <div className="member-name">{member.user.name}</div>
                  <div className="member-role">{member.role}</div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="input-group">
                <label>Title</label>
                <input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Due Date</label>
                <input type="date" value={taskDue} onChange={(e) => setTaskDue(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Assignee</label>
                <select value={taskAssignee} onChange={(e) => setTaskAssignee(e.target.value)}>
                  <option value="">Select Assignee</option>
                  {project.members.map(m => (
                    <option key={m.user.id} value={m.user.id}>{m.user.name}</option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setShowTaskModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Member Modal */}
      {showMemberModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add Team Member</h2>
            <form onSubmit={handleAddMember}>
              <div className="input-group">
                <label>User Email</label>
                <input type="email" value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} placeholder="user@example.com" required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setShowMemberModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .header-actions { display: flex; gap: 1rem; }
        .detail-grid { display: grid; grid-template-columns: 1fr 300px; gap: 2rem; margin-top: 2rem; }
        
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .task-list { display: flex; flex-direction: column; gap: 1rem; }
        .task-item { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem; }
        .task-main h4 { margin-bottom: 0.25rem; }
        .task-main p { font-size: 0.875rem; color: var(--text-muted); margin-bottom: 0.75rem; }
        .task-meta { display: flex; gap: 1rem; font-size: 0.75rem; color: var(--text-muted); font-weight: 600; }
        .task-meta span { display: flex; align-items: center; gap: 0.25rem; }
        
        .task-status-control { display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem; }
        .status-select { font-size: 0.75rem; padding: 0.25rem 0.5rem; width: auto; }

        .member-list { padding: 0; overflow: hidden; }
        .member-item { display: flex; align-items: center; gap: 1rem; padding: 1rem; border-bottom: 1px solid var(--border); }
        .member-item:last-child { border-bottom: none; }
        .member-avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.875rem; }
        .member-name { font-size: 0.875rem; font-weight: 600; }
        .member-role { font-size: 0.75rem; color: var(--text-muted); }
      `}</style>
    </div>
  );
};

export default ProjectDetail;
