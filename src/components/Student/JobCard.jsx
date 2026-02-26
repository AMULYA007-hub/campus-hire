import React, { useState } from 'react';
import { MapPin, DollarSign, Users, Calendar, Send, Check } from 'lucide-react';
import { useData } from '../../hooks/useData';

export default function JobCard({ job, user }) {
  const { applications, applyJob } = useData();
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [resume, setResume] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);

  const alreadyApplied = applications.some(app => app.jobId === job.id && app.studentId === user?.id);

  const handleApply = async () => {
    setApplying(true);
    try {
      await applyJob(job.id, { id: user?.id, resume, coverLetter });
      setShowApplyForm(false);
      setResume('');
      setCoverLetter('');
      alert('Application submitted successfully!');
    } catch (err) {
      alert('Failed to apply. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="job-card">
      <div className="job-header">
        <div className="company-info">
          <img src={job.logo} alt={job.company} className="company-logo" />
          <div>
            <h3>{job.title}</h3>
            <p className="company-name">{job.company}</p>
          </div>
        </div>
        {alreadyApplied && (
          <span className="badge badge-success">
            <Check size={16} /> Applied
          </span>
        )}
      </div>

      <div className="job-meta">
        <span className="meta-item">
          <MapPin size={16} />
          {job.location}
        </span>
        <span className="meta-item">
          <DollarSign size={16} />
          {job.salary}
        </span>
        <span className="meta-item">
          <Users size={16} />
          {job.applicants} applicants
        </span>
        <span className="meta-item">
          <Calendar size={16} />
          {job.posted}
        </span>
      </div>

      <p className="job-description">{job.description}</p>

      <div className="skills-section">
        <h4>Required Skills:</h4>
        <div className="skills-list">
          {job.skills.map(skill => (
            <span key={skill} className="skill-tag">{skill}</span>
          ))}
        </div>
      </div>

      <div className="job-deadline">
        <strong>Deadline:</strong> {job.deadline}
      </div>

      {!alreadyApplied ? (
        <>
          <button
            className="btn btn-primary"
            onClick={() => setShowApplyForm(true)}
            style={{ width: '100%', marginTop: '1rem' }}
          >
            <Send size={18} />
            Apply Now
          </button>

          {showApplyForm && (
            <div className="apply-form-overlay">
              <div className="apply-form">
                <h4>Apply for {job.title}</h4>
                
                <div className="form-group">
                  <label>Resume URL</label>
                  <input
                    type="text"
                    placeholder="Link to your resume"
                    value={resume}
                    onChange={(e) => setResume(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Cover Letter</label>
                  <textarea
                    placeholder="Tell us why you're interested..."
                    rows="4"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                  />
                </div>

                <div className="form-actions">
                  <button
                    className="btn btn-primary"
                    onClick={handleApply}
                    disabled={applying || !resume}
                  >
                    {applying ? 'Submitting...' : 'Submit Application'}
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => setShowApplyForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="applied-badge">Already applied on {applications.find(app => app.jobId === job.id)?.date}</div>
      )}
    </div>
  );
}
