import React, { useState, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import '../../styles/advanced-search.css';

export default function AdvancedSearch({ jobs, onSearch }) {
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    minSalary: 0,
    maxSalary: 2000000,
    experience: '',
    skills: '',
    dateRange: 'all'
  });
  
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const searchMatch = job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.company.toLowerCase().includes(filters.search.toLowerCase());
      
      const deptMatch = !filters.department || job.department === filters.department;
      
      const salaryMatch = job.salary >= filters.minSalary && job.salary <= filters.maxSalary;
      
      const expMatch = !filters.experience || job.experience === filters.experience;
      
      const skillsMatch = !filters.skills || 
        filters.skills.split(',').some(skill => 
          job.skills.some(jobSkill => jobSkill.toLowerCase().includes(skill.toLowerCase()))
        );

      return searchMatch && deptMatch && salaryMatch && expMatch && skillsMatch;
    });
  }, [jobs, filters]);

  const handleReset = () => {
    setFilters({
      search: '',
      department: '',
      minSalary: 0,
      maxSalary: 2000000,
      experience: '',
      skills: '',
      dateRange: 'all'
    });
  };

  return (
    <div className="advanced-search">
      <div className="search-header">
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            name="search"
            placeholder="Search jobs by title or company..."
            value={filters.search}
            onChange={handleFilterChange}
          />
          <button 
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} />
            Filters
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filters-container">
            <div className="filter-group">
              <label>Department</label>
              <select name="department" value={filters.department} onChange={handleFilterChange}>
                <option value="">All Departments</option>
                <option value="IT">IT</option>
                <option value="CS">Computer Science</option>
                <option value="ECE">Electronics</option>
                <option value="MECH">Mechanical</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Experience Level</label>
              <select name="experience" value={filters.experience} onChange={handleFilterChange}>
                <option value="">All Levels</option>
                <option value="Entry">Entry Level</option>
                <option value="Mid">Mid Level</option>
                <option value="Senior">Senior Level</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Salary Range</label>
              <div className="salary-range">
                <input 
                  type="number" 
                  name="minSalary"
                  placeholder="Min"
                  value={filters.minSalary}
                  onChange={handleFilterChange}
                />
                <span>-</span>
                <input 
                  type="number"
                  name="maxSalary"
                  placeholder="Max"
                  value={filters.maxSalary}
                  onChange={handleFilterChange}
                />
              </div>
              <small>₹{filters.minSalary.toLocaleString()} - ₹{filters.maxSalary.toLocaleString()}</small>
            </div>

            <div className="filter-group">
              <label>Skills (comma-separated)</label>
              <input
                type="text"
                name="skills"
                placeholder="e.g., React, Node.js, Python"
                value={filters.skills}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-actions">
              <button className="btn btn-primary" onClick={() => {
                onSearch(filteredJobs);
                setShowFilters(false);
              }}>
                Apply Filters ({filteredJobs.length})
              </button>
              <button className="btn btn-outline" onClick={handleReset}>
                <X size={18} />
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="search-results">
        <p className="results-count">
          Found {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
          {filters.search && ` matching "${filters.search}"`}
        </p>
      </div>
    </div>
  );
}
