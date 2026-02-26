import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, MessageSquare, CheckCircle, XCircle, Edit2, Trash2 } from 'lucide-react';
import '../../styles/interviews.css';

export default function InterviewManagement({ data = {} }) {
  const [interviews, setInterviews] = useState(data.interviews || [
    {
      id: 1,
      studentName: 'John Doe',
      company: 'Google',
      position: 'SDE',
      date: '2024-01-15',
      time: '10:00 AM',
      type: 'Technical',
      status: 'scheduled',
      feedback: '',
      interviewer: 'Jane Smith'
    },
    {
      id: 2,
      studentName: 'Alice Johnson',
      company: 'Microsoft',
      position: 'Senior Developer',
      date: '2024-01-16',
      time: '2:00 PM',
      type: 'HR Round',
      status: 'completed',
      feedback: 'Excellent communication skills',
      interviewer: 'Bob Wilson'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    studentName: '',
    company: '',
    position: '',
    date: '',
    time: '',
    type: 'Technical',
    status: 'scheduled',
    feedback: '',
    interviewer: ''
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setInterviews(prev => prev.map(int => int.id === editingId ? { ...formData, id: editingId } : int));
      setEditingId(null);
    } else {
      setInterviews(prev => [...prev, { ...formData, id: Date.now() }]);
    }
    setFormData({
      studentName: '',
      company: '',
      position: '',
      date: '',
      time: '',
      type: 'Technical',
      status: 'scheduled',
      feedback: '',
      interviewer: ''
    });
    setShowForm(false);
  };

  const handleEdit = (interview) => {
    setFormData(interview);
    setEditingId(interview.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setInterviews(prev => prev.filter(int => int.id !== id));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      scheduled: { class: 'badge-info', icon: Calendar },
      completed: { class: 'badge-success', icon: CheckCircle },
      cancelled: { class: 'badge-danger', icon: XCircle }
    };
    return statusConfig[status] || { class: 'badge-info', icon: Calendar };
  };

  const groupedInterviews = {
    upcoming: interviews.filter(int => int.status === 'scheduled'),
    completed: interviews.filter(int => int.status === 'completed'),
    cancelled: interviews.filter(int => int.status === 'cancelled')
  };

  return (
    <div className="interview-management">
      <div className="interview-header">
        <h2>Interview Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              studentName: '',
              company: '',
              position: '',
              date: '',
              time: '',
              type: 'Technical',
              status: 'scheduled',
              feedback: '',
              interviewer: ''
            });
          }}
        >
          {showForm ? 'Cancel' : '+ Schedule Interview'}
        </button>
      </div>

      {showForm && (
        <form className="interview-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Student Name</label>
              <input type="text" name="studentName" value={formData.studentName} onChange={handleFormChange} required />
            </div>
            <div className="form-group">
              <label>Company</label>
              <input type="text" name="company" value={formData.company} onChange={handleFormChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Position</label>
              <input type="text" name="position" value={formData.position} onChange={handleFormChange} required />
            </div>
            <div className="form-group">
              <label>Interview Type</label>
              <select name="type" value={formData.type} onChange={handleFormChange}>
                <option value="Technical">Technical Round</option>
                <option value="HR Round">HR Round</option>
                <option value="Final">Final Round</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleFormChange} required />
            </div>
            <div className="form-group">
              <label>Time</label>
              <input type="time" name="time" value={formData.time} onChange={handleFormChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Interviewer</label>
              <input type="text" name="interviewer" value={formData.interviewer} onChange={handleFormChange} />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleFormChange}>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Feedback (if completed)</label>
            <textarea name="feedback" value={formData.feedback} onChange={handleFormChange} rows="3"></textarea>
          </div>

          <button type="submit" className="btn btn-success">
            {editingId ? 'Update Interview' : 'Schedule Interview'}
          </button>
        </form>
      )}

      <div className="interviews-tabs">
        {Object.entries(groupedInterviews).map(([status, list]) => (
          <div key={status} className={`interview-section ${status}`}>
            <h3>{status.charAt(0).toUpperCase() + status.slice(1)} Interviews ({list.length})</h3>
            {list.length === 0 ? (
              <p className="no-interviews">No {status} interviews</p>
            ) : (
              <div className="interviews-list">
                {list.map(interview => {
                  const StatusIcon = getStatusBadge(interview.status).icon;
                  return (
                    <div key={interview.id} className={`interview-card ${interview.status}`}>
                      <div className="interview-header-card">
                        <div className="interview-title">
                          <h4>{interview.company}</h4>
                          <p>{interview.position}</p>
                        </div>
                        <span className={`badge ${getStatusBadge(interview.status).class}`}>
                          <StatusIcon size={16} />
                          {interview.status}
                        </span>
                      </div>

                      <div className="interview-details">
                        <div className="detail">
                          <User size={16} />
                          <span>{interview.studentName}</span>
                        </div>
                        <div className="detail">
                          <Calendar size={16} />
                          <span>{interview.date}</span>
                        </div>
                        <div className="detail">
                          <Clock size={16} />
                          <span>{interview.time}</span>
                        </div>
                        <div className="detail">
                          <MessageSquare size={16} />
                          <span>{interview.type}</span>
                        </div>
                      </div>

                      {interview.interviewer && (
                        <div className="interviewer">
                          <strong>Interviewer:</strong> {interview.interviewer}
                        </div>
                      )}

                      {interview.feedback && (
                        <div className="feedback">
                          <strong>Feedback:</strong> {interview.feedback}
                        </div>
                      )}

                      <div className="interview-actions">
                        <button 
                          className="btn-icon edit"
                          onClick={() => handleEdit(interview)}
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          className="btn-icon delete"
                          onClick={() => handleDelete(interview.id)}
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
