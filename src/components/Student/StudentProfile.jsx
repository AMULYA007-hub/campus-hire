import React, { useState } from 'react';
import { Edit2, Save, X, Camera, Award, BookOpen, Briefcase } from 'lucide-react';
import '../../styles/profile.css';

export default function StudentProfile({ user, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: user?.department || 'Computer Science',
    gpa: user?.gpa || 3.8,
    skills: user?.skills?.join(', ') || 'React, Node.js, Python',
    bio: user?.bio || 'Aspiring software developer',
    linkedin: user?.linkedin || '',
    github: user?.github || '',
    portfolio: user?.portfolio || '',
    certifications: user?.certifications?.join(', ') || 'AWS Cloud, MERN Stack',
    resume: user?.resume || 'resume.pdf'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onUpdate({
      ...user,
      ...profile,
      skills: profile.skills.split(',').map(s => s.trim()),
      certifications: profile.certifications.split(',').map(c => c.trim())
    });
    setIsEditing(false);
  };

  return (
    <div className="student-profile">
      <div className="profile-header">
        <div className="profile-cover"></div>
        <div className="profile-card">
          <div className="profile-avatar">
            <img src={user?.avatar} alt={user?.name} />
            <label className="avatar-upload">
              <Camera size={20} />
              <input type="file" accept="image/*" hidden />
            </label>
          </div>
          <div className="profile-info">
            <h1>{profile.name}</h1>
            <p className="role">{profile.department}</p>
            <div className="profile-meta">
              <span className="gpa-badge">GPA: {profile.gpa}</span>
              <span className="email-badge">{profile.email}</span>
            </div>
          </div>
          {!isEditing && (
            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
              <Edit2 size={18} />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="profile-content">
        {isEditing ? (
          <form className="profile-form">
            <div className="form-section">
              <h3>Personal Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" name="name" value={profile.name} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={profile.email} onChange={handleChange} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" name="phone" value={profile.phone} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <input type="text" name="department" value={profile.department} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea name="bio" value={profile.bio} onChange={handleChange} rows="3"></textarea>
              </div>
            </div>

            <div className="form-section">
              <h3>Academic Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>GPA</label>
                  <input type="number" name="gpa" step="0.1" min="0" max="4" value={profile.gpa} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Skills (comma-separated)</label>
                  <input type="text" name="skills" value={profile.skills} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label>Certifications (comma-separated)</label>
                <input type="text" name="certifications" value={profile.certifications} onChange={handleChange} />
              </div>
            </div>

            <div className="form-section">
              <h3>Social Links</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>LinkedIn URL</label>
                  <input type="url" name="linkedin" value={profile.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." />
                </div>
                <div className="form-group">
                  <label>GitHub URL</label>
                  <input type="url" name="github" value={profile.github} onChange={handleChange} placeholder="https://github.com/..." />
                </div>
              </div>
              <div className="form-group">
                <label>Portfolio URL</label>
                <input type="url" name="portfolio" value={profile.portfolio} onChange={handleChange} placeholder="https://yourportfolio.com" />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-primary" onClick={handleSave}>
                <Save size={18} />
                Save Changes
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)}>
                <X size={18} />
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-view">
            <div className="profile-section">
              <h3><Award size={20} /> Skills</h3>
              <div className="skills-grid">
                {profile.skills.split(',').map((skill, i) => (
                  <span key={i} className="skill-badge">{skill.trim()}</span>
                ))}
              </div>
            </div>

            <div className="profile-section">
              <h3><BookOpen size={20} /> Certifications</h3>
              <ul className="certifications-list">
                {profile.certifications.split(',').map((cert, i) => (
                  <li key={i}>{cert.trim()}</li>
                ))}
              </ul>
            </div>

            <div className="profile-section">
              <h3><Briefcase size={20} /> Social Links</h3>
              <div className="social-links">
                {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">LinkedIn</a>}
                {profile.github && <a href={profile.github} target="_blank" rel="noopener noreferrer" className="social-link">GitHub</a>}
                {profile.portfolio && <a href={profile.portfolio} target="_blank" rel="noopener noreferrer" className="social-link">Portfolio</a>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
