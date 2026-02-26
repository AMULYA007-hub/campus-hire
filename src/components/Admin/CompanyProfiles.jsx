import React, { useState } from 'react';
import { Building2, MapPin, Users, Globe, Mail, Phone, Edit2, Save, X } from 'lucide-react';
import '../../styles/company-profiles.css';

export default function CompanyProfiles() {
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: 'Google',
      logo: '🔍',
      description: 'Google LLC is an American multinational technology company',
      industry: 'Technology',
      location: 'Mountain View, California',
      website: 'www.google.com',
      email: 'careers@google.com',
      phone: '+1-800-GOOGLE',
      employees: '190,000+',
      founded: 1998,
      activeJobs: 15,
      visits: 2543,
      verified: true
    },
    {
      id: 2,
      name: 'Microsoft',
      logo: '⊞',
      description: 'Microsoft Corporation is an American technology company',
      industry: 'Technology',
      location: 'Redmond, Washington',
      website: 'www.microsoft.com',
      email: 'careers@microsoft.com',
      phone: '+1-425-882-8080',
      employees: '220,000+',
      founded: 1975,
      activeJobs: 12,
      visits: 2103,
      verified: true
    },
    {
      id: 3,
      name: 'Amazon',
      logo: '📦',
      description: 'Amazon.com, Inc. is an American technology and e-commerce company',
      industry: 'E-commerce',
      location: 'Seattle, Washington',
      website: 'www.amazon.com',
      email: 'careers@amazon.com',
      phone: '+1-206-266-1000',
      employees: '1,500,000+',
      founded: 1994,
      activeJobs: 18,
      visits: 1856,
      verified: true
    }
  ]);

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry: '',
    location: '',
    website: '',
    email: '',
    phone: '',
    employees: '',
    founded: new Date().getFullYear()
  });

  const handleEdit = (company) => {
    setFormData(company);
    setEditingId(company.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (editingId) {
      setCompanies(prev => prev.map(comp =>
        comp.id === editingId ? { ...formData, id: editingId } : comp
      ));
      setEditingId(null);
    } else {
      setCompanies(prev => [...prev, {
        ...formData,
        id: Date.now(),
        activeJobs: 0,
        visits: 0,
        verified: false,
        logo: '🏢'
      }]);
    }
    resetForm();
  };

  const handleDelete = (id) => {
    setCompanies(prev => prev.filter(comp => comp.id !== id));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      industry: '',
      location: '',
      website: '',
      email: '',
      phone: '',
      employees: '',
      founded: new Date().getFullYear()
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="company-profiles">
      <div className="profiles-header">
        <div className="header-content">
          <h2>Company Profiles</h2>
          <p>Directory of recruiting companies</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Company'}
        </button>
      </div>

      {showForm && (
        <form className="company-form">
          <div className="form-row">
            <div className="form-group">
              <label>Company Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleFormChange} required />
            </div>
            <div className="form-group">
              <label>Industry</label>
              <input type="text" name="industry" value={formData.industry} onChange={handleFormChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleFormChange} />
            </div>
            <div className="form-group">
              <label>Founded Year</label>
              <input type="number" name="founded" value={formData.founded} onChange={handleFormChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleFormChange} rows="3"></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Website</label>
              <input type="url" name="website" value={formData.website} onChange={handleFormChange} placeholder="https://example.com" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleFormChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleFormChange} />
            </div>
            <div className="form-group">
              <label>Employees</label>
              <input type="text" name="employees" value={formData.employees} onChange={handleFormChange} placeholder="e.g., 1000+" />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-success" onClick={handleSave}>
              <Save size={18} />
              Save Company
            </button>
            <button type="button" className="btn btn-outline" onClick={resetForm}>
              <X size={18} />
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="companies-grid">
        {companies.map(company => (
          <div key={company.id} className="company-card">
            <div className="company-header">
              <div className="logo">{company.logo}</div>
              <div className="company-title">
                <h3>{company.name}</h3>
                {company.verified && <span className="verified-badge">✓ Verified</span>}
              </div>
              <div className="company-actions">
                <button className="btn-icon" onClick={() => handleEdit(company)} title="Edit">
                  <Edit2 size={18} />
                </button>
                <button className="btn-icon delete" onClick={() => handleDelete(company.id)} title="Delete">
                  <X size={18} />
                </button>
              </div>
            </div>

            <p className="company-description">{company.description}</p>

            <div className="company-info-grid">
              <div className="info-item">
                <Building2 size={16} />
                <span>{company.industry}</span>
              </div>
              <div className="info-item">
                <MapPin size={16} />
                <span>{company.location}</span>
              </div>
              <div className="info-item">
                <Users size={16} />
                <span>{company.employees}</span>
              </div>
              <div className="info-item">
                <span>📅</span>
                <span>Est. {company.founded}</span>
              </div>
            </div>

            <div className="company-contact">
              <div className="contact-item">
                <Globe size={16} />
                <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer">
                  {company.website}
                </a>
              </div>
              <div className="contact-item">
                <Mail size={16} />
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </div>
              <div className="contact-item">
                <Phone size={16} />
                <a href={`tel:${company.phone}`}>{company.phone}</a>
              </div>
            </div>

            <div className="company-stats">
              <div className="stat">
                <strong>{company.activeJobs}</strong>
                <span>Active Jobs</span>
              </div>
              <div className="stat">
                <strong>{company.visits}</strong>
                <span>Profile Views</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {companies.length === 0 && !showForm && (
        <div className="empty-state">
          <Building2 size={64} />
          <h3>No Companies Yet</h3>
          <p>Add companies to view their profiles</p>
        </div>
      )}
    </div>
  );
}
