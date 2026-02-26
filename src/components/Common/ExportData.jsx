import React from 'react';
import { Download, FileText, File } from 'lucide-react';
import '../../styles/export.css';

export default function ExportData({ data, dataType = 'applications', fileName = 'export' }) {
  
  const exportToCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    
    if (dataType === 'applications' && data.length > 0) {
      const headers = ['ID', 'Student Name', 'Job Title', 'Company', 'Applied Date', 'Status'];
      csvContent += headers.join(',') + '\n';
      
      data.forEach(app => {
        const row = [
          app.id,
          app.studentName || 'N/A',
          app.jobTitle || 'N/A',
          app.company || 'N/A',
          app.appliedDate || 'N/A',
          app.status || 'N/A'
        ];
        csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
      });
    } else if (dataType === 'placements' && data.length > 0) {
      const headers = ['ID', 'Student Name', 'Company', 'Job Title', 'Salary', 'Placement Date'];
      csvContent += headers.join(',') + '\n';
      
      data.forEach(placement => {
        const row = [
          placement.id,
          placement.studentName || 'N/A',
          placement.company || 'N/A',
          placement.jobTitle || 'N/A',
          placement.salary || 'N/A',
          placement.placementDate || 'N/A'
        ];
        csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
      });
    } else if (dataType === 'jobs' && data.length > 0) {
      const headers = ['ID', 'Job Title', 'Company', 'Department', 'Salary', 'Experience', 'Posted Date'];
      csvContent += headers.join(',') + '\n';
      
      data.forEach(job => {
        const row = [
          job.id,
          job.title || 'N/A',
          job.company || 'N/A',
          job.department || 'N/A',
          job.salary || 'N/A',
          job.experience || 'N/A',
          job.postedDate || 'N/A'
        ];
        csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
      });
    }
    
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `${fileName}-${new Date().toISOString().slice(0, 10)}.csv`);
    link.click();
  };

  const generatePDF = () => {
    let pdfContent = `
      <html>
        <head>
          <title>${dataType.charAt(0).toUpperCase() + dataType.slice(1)} Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #2563eb; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #2563eb; color: white; padding: 10px; text-align: left; }
            td { padding: 10px; border-bottom: 1px solid #ddd; }
            tr:last-child td { border-bottom: none; }
            .footer { margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <h1>${dataType.charAt(0).toUpperCase() + dataType.slice(1)} Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          <table>
            <tbody>
              ${generatePDFContent()}
            </tbody>
          </table>
          <div class="footer">
            <p>This is an auto-generated report from Campus Hire Platform</p>
          </div>
        </body>
      </html>
    `;

    const newWindow = window.open('', '', 'width=800,height=600');
    newWindow.document.write(pdfContent);
    newWindow.document.close();
    setTimeout(() => newWindow.print(), 250);
  };

  const generatePDFContent = () => {
    if (dataType === 'applications' && data.length > 0) {
      return `
        <tr>
          <th>ID</th>
          <th>Student Name</th>
          <th>Job Title</th>
          <th>Company</th>
          <th>Status</th>
        </tr>
        ${data.map(app => `
          <tr>
            <td>${app.id}</td>
            <td>${app.studentName || 'N/A'}</td>
            <td>${app.jobTitle || 'N/A'}</td>
            <td>${app.company || 'N/A'}</td>
            <td>${app.status || 'N/A'}</td>
          </tr>
        `).join('')}
      `;
    } else if (dataType === 'placements' && data.length > 0) {
      return `
        <tr>
          <th>ID</th>
          <th>Student Name</th>
          <th>Company</th>
          <th>Salary</th>
          <th>Date</th>
        </tr>
        ${data.map(placement => `
          <tr>
            <td>${placement.id}</td>
            <td>${placement.studentName || 'N/A'}</td>
            <td>${placement.company || 'N/A'}</td>
            <td>₹${placement.salary || 'N/A'}</td>
            <td>${placement.placementDate || 'N/A'}</td>
          </tr>
        `).join('')}
      `;
    }
    return '<tr><td colspan="5">No data available</td></tr>';
  };

  return (
    <div className="export-section">
      <h3>Export Data</h3>
      <div className="export-buttons">
        <button 
          className="btn btn-export csv"
          onClick={exportToCSV}
          disabled={!data || data.length === 0}
        >
          <File size={18} />
          Download CSV
        </button>
        <button 
          className="btn btn-export pdf"
          onClick={generatePDF}
          disabled={!data || data.length === 0}
        >
          <FileText size={18} />
          Print as PDF
        </button>
      </div>
      <p className="export-info">
        {data && data.length > 0 
          ? `Ready to export ${data.length} records` 
          : 'No data available to export'}
      </p>
    </div>
  );
}
