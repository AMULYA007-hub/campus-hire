import React, { useMemo } from 'react';
import { BarChart, PieChart, LineChart, TrendingUp, Users, Briefcase, CheckCircle } from 'lucide-react';
import '../../styles/analytics.css';

export default function AnalyticsDashboard({ data } = {}) {
  const defaultData = {
    applications: data?.applications || [
      { id: 1, status: 'applied' },
      { id: 2, status: 'shortlisted' },
      { id: 3, status: 'rejected' },
      { id: 4, status: 'applied' },
      { id: 5, status: 'shortlisted' }
    ],
    placements: data?.placements || [
      { id: 1, salary: 800000 },
      { id: 2, salary: 1200000 },
      { id: 3, salary: 950000 }
    ],
    jobs: data?.jobs || [
      { salary: 800000 },
      { salary: 1200000 },
      { salary: 950000 },
      { salary: 700000 },
      { salary: 1100000 }
    ]
  };

  const stats = useMemo(() => {
    const appStats = {
      total: defaultData.applications.length,
      applied: defaultData.applications.filter(a => a.status === 'applied').length,
      shortlisted: defaultData.applications.filter(a => a.status === 'shortlisted').length,
      rejected: defaultData.applications.filter(a => a.status === 'rejected').length
    };

    const avgSalary = defaultData.placements.length > 0
      ? Math.round(defaultData.placements.reduce((sum, p) => sum + p.salary, 0) / defaultData.placements.length)
      : 0;

    const placementRate = ((defaultData.placements.length / defaultData.applications.length) * 100).toFixed(1);

    const salaryStats = {
      min: Math.min(...defaultData.jobs.map(j => j.salary)),
      max: Math.max(...defaultData.jobs.map(j => j.salary)),
      avg: Math.round(defaultData.jobs.reduce((sum, j) => sum + j.salary, 0) / defaultData.jobs.length)
    };

    return { appStats, avgSalary, placementRate, salaryStats };
  }, [defaultData]);

  const SimpleBarChart = ({ data, title }) => (
    <div className="chart-container">
      <h4>{title}</h4>
      <div className="simple-chart">
        {data.map((item, i) => (
          <div key={i} className="chart-bar">
            <div className="bar" style={{ height: `${(item.value / Math.max(...data.map(d => d.value))) * 100}%` }}></div>
            <span className="label">{item.label}</span>
            <span className="value">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const SimplePieChart = ({ data, title }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let rotation = 0;
    
    return (
      <div className="chart-container">
        <h4>{title}</h4>
        <div className="pie-chart-wrapper">
          <svg viewBox="0 0 100 100" className="pie-chart">
            {data.map((item, i) => {
              const sliceAngle = (item.value / total) * 360;
              const startAngle = rotation;
              const endAngle = rotation + sliceAngle;
              rotation = endAngle;

              const startRad = (startAngle * Math.PI) / 180;
              const endRad = (endAngle * Math.PI) / 180;
              const x1 = 50 + 40 * Math.cos(startRad);
              const y1 = 50 + 40 * Math.sin(startRad);
              const x2 = 50 + 40 * Math.cos(endRad);
              const y2 = 50 + 40 * Math.sin(endRad);
              const largeArc = sliceAngle > 180 ? 1 : 0;

              const path = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;

              return <path key={i} d={path} fill={item.color} />;
            })}
          </svg>
          <div className="pie-legend">
            {data.map((item, i) => (
              <div key={i} className="legend-item">
                <span style={{ backgroundColor: item.color }}></span>
                <span>{item.label}: {item.value} ({((item.value/total)*100).toFixed(1)}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h2>Analytics Dashboard</h2>
        <p>Comprehensive placement statistics and insights</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon applications">
            <Briefcase size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.appStats.total}</h3>
            <p>Total Applications</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon shortlisted">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.appStats.shortlisted}</h3>
            <p>Shortlisted</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon placements">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>{defaultData.placements.length}</h3>
            <p>Placed Students</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon salary">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>₹{(stats.avgSalary / 100000).toFixed(1)}L</h3>
            <p>Avg Package</p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <SimplePieChart
          data={[
            { label: 'Applied', value: stats.appStats.applied, color: '#3b82f6' },
            { label: 'Shortlisted', value: stats.appStats.shortlisted, color: '#10b981' },
            { label: 'Rejected', value: stats.appStats.rejected, color: '#ef4444' }
          ]}
          title="Application Status Distribution"
        />

        <SimpleBarChart
          data={[
            { label: 'Min', value: stats.salaryStats.min / 100000 },
            { label: 'Avg', value: stats.salaryStats.avg / 100000 },
            { label: 'Max', value: stats.salaryStats.max / 100000 }
          ]}
          title="Salary Range (LPA)"
        />
      </div>

      <div className="insights-section">
        <div className="insight-card">
          <h4>Placement Rate</h4>
          <p className="insight-number">{stats.placementRate}%</p>
          <p className="insight-text">{defaultData.placements.length} out of {stats.appStats.total} students placed</p>
        </div>

        <div className="insight-card">
          <h4>Package Range</h4>
          <p className="insight-number">₹{(stats.salaryStats.min / 100000).toFixed(1)}L - ₹{(stats.salaryStats.max / 100000).toFixed(1)}L</p>
          <p className="insight-text">Highest paying: {(stats.salaryStats.max / 100000).toFixed(1)} LPA</p>
        </div>

        <div className="insight-card">
          <h4>Application Conversion</h4>
          <p className="insight-number">{stats.appStats.shortlisted}</p>
          <p className="insight-text">{((stats.appStats.shortlisted / stats.appStats.total) * 100).toFixed(1)}% of total applications shortlisted</p>
        </div>
      </div>
    </div>
  );
}
