# CampusHire - Placement Interaction System

A comprehensive full-stack placement management system designed for colleges and universities to facilitate job placements, applications tracking, and placement analytics.

## 🎯 Overview

CampusHire is a sophisticated placement interaction platform that bridges students, employers, placement officers, and administrators. The system enables efficient job posting, application management, placement tracking, and comprehensive analytics.

## 👥 User Roles

### 1. **Student** 👨‍🎓
- Explore job opportunities with advanced search and filtering
- Apply for positions with resume and cover letter
- Track application status in real-time
- View placement opportunities from various companies
- Manage profile and skills

**Demo Credentials:**
- Email: `student@campus.com`
- Password: `password`

### 2. **Employer** 🏢
- Post job openings with detailed descriptions
- Manage job listings and update postings
- Review and shortlist applications
- Communicate with candidates
- Track hiring progress

**Demo Credentials:**
- Email: `recruiter@techcorp.com`
- Password: `password`

### 3. **Placement Officer** 👔
- Track placement records and statistics
- Monitor the placement pipeline
- Generate comprehensive placement reports
- View analytics and insights
- Facilitate employer-student interactions

**Demo Credentials:**
- Email: `officer@campus.com`
- Password: `password`

### 4. **Admin** ⚙️
- Manage system users and roles
- Monitor platform analytics
- Configure system settings
- Generate system-wide reports
- Manage data and settings

**Demo Credentials:**
- Email: `admin@campus.com`
- Password: `password`

## ✨ Key Features

### Student Dashboard
- **Job Exploration**: Search and filter jobs by title, company, location, and required skills
- **Application Management**: Apply for jobs with resume and cover letter
- **Status Tracking**: Real-time tracking of application status (Applied, Shortlisted, Rejected)
- **Statistics**: View total applications, shortlisted positions, and open opportunities

### Employer Dashboard
- **Job Posting**: Post new job opportunities with detailed information
- **Job Management**: Edit and delete job postings
- **Application Review**: Review all applications for posted jobs
- **Candidate Management**: Shortlist or reject candidates
- **Statistics**: Track active jobs, total applications, and shortlisted candidates

### Placement Officer Dashboard
- **Placement Records**: Add and manage student placement records
- **Analytics Dashboard**: View placement metrics and key performance indicators
- **Report Generation**: Download placement reports in JSON format
- **Pipeline Tracking**: Monitor the application to placement pipeline
- **Salary Analytics**: Track salary distributions and company-wise hiring

### Admin Dashboard
- **User Management**: Add, view, and manage all system users
- **User Roles**: Manage roles and permissions
- **Analytics**: View comprehensive system analytics
- **Settings**: Configure system-wide settings
- **User Breakdown**: Monitor student, employer, and officer counts

## 🎨 UI/UX Design

The system features:
- **Modern Design**: Clean, professional interface with gradient headers
- **Responsive Layout**: Fully responsive design for mobile, tablet, and desktop
- **Interactive Components**: Cards, charts, tables, and forms with smooth animations
- **Dark/Light Elements**: Professional color scheme with good contrast
- **Accessibility**: Semantic HTML and proper ARIA labels
- **Performance**: Optimized rendering and smooth transitions

## 🛠️ Technical Stack

### Frontend
- **React 18+**: Modern UI library with hooks
- **React Router**: Client-side routing and navigation
- **Vite**: Fast build tool and development server
- **CSS3**: Custom styling with CSS variables and flexbox/grid
- **Lucide React**: Beautiful icon library

### State Management
- **React Context API**: Global state management for auth and data
- **Custom Hooks**: useAuth and useData hooks for data management

### Architecture
- **Component-Based**: Modular, reusable components
- **Context Providers**: AuthProvider and DataProvider for global state
- **Protected Routes**: Route protection based on user roles
- **Mock API**: Simulated backend with realistic data

## 📁 Project Structure

```
campus-hire/
├── src/
│   ├── components/
│   │   ├── Common/
│   │   │   ├── Login.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── Student/
│   │   │   ├── StudentDashboard.jsx
│   │   │   └── JobCard.jsx
│   │   ├── Employer/
│   │   │   └── EmployerDashboard.jsx
│   │   ├── Admin/
│   │   │   └── AdminDashboard.jsx
│   │   └── PlacementOfficer/
│   │       └── PlacementOfficerDashboard.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── DataContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useData.js
│   ├── styles/
│   │   ├── global.css
│   │   ├── navbar.css
│   │   ├── sidebar.css
│   │   ├── login.css
│   │   ├── student-dashboard.css
│   │   ├── employer-dashboard.css
│   │   ├── admin-dashboard.css
│   │   └── officer-dashboard.css
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── public/
│   └── index.html
├── package.json
└── README.md
```

## 🚀 Getting Started

### Installation

1. Navigate to the project directory:
```bash
cd campus-hire
```

2. Install dependencies:
```bash
npm install
```

3. Install additional packages (if needed):
```bash
npm install react-router-dom axios zustand recharts lucide-react
```

### Running the Application

Start the development server:
```bash
npm run dev
```

The application will run at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## 🔐 Authentication

The system uses mock authentication with predefined demo accounts. Each role has a dedicated demo account:

- **Password**: `password` for all accounts
- **Email**: Role-specific email addresses (see User Roles section)

For production, integrate with a real authentication system (JWT, OAuth, etc.)

## 📊 Data Management

The system uses React Context API for state management:

### AuthContext
- Handles user authentication and login/logout
- Stores user session information
- Provides authentication hooks

### DataContext
- Manages jobs, applications, placements, and users
- Provides data mutation functions (add, update, delete)
- Simulates API calls with realistic delays

## 🎓 Features Details

### Job Management
- Post jobs with title, salary, location, and skills
- Search and filter jobs by multiple criteria
- Track applicant count and posting deadlines
- Manage job status (active, closed, etc.)

### Application Tracking
- Apply for jobs with resume
- Track application status through pipeline
- Shortlist or reject candidates
- View application history

### Placement Records
- Record student placements with company and salary info
- Track placement statistics and metrics
- Generate placement reports
- View placement timeline

### Analytics
- Placement rate calculation
- Average package tracking
- Application status distribution
- Company-wise hiring analytics
- Student-wise placement status

## 🎯 Future Enhancements

- Real backend API integration
- Advanced search with filters
- Email notifications
- Video interview integration
- Resume parsing AI
- Chatbot for candidate support
- Two-factor authentication
- Audit trails
- Advanced analytics with graphs
- Bulk import/export functionality

## 📝 Notes

- All data is stored in browser localStorage (session persistence)
- The system uses mock data for demonstration
- Real backend would handle persistent storage
- Email addresses and notifications are simulated
- File uploads are mocked in the frontend

## 🤝 Contributing

This is a full-stack course project. Feel free to extend and modify features as needed for your use case.

## 📄 License

This project is open for educational use.

## 👨‍💻 Developer Notes

- The system is built with a focus on user experience and responsive design
- Each dashboard is role-specific and tailored to user needs
- The code uses modern React patterns with hooks and context
- CSS is organized modularly for easy maintenance
- The architecture supports easy addition of new features

## 🎉 Getting Help

For any questions or issues:
1. Check the component comments
2. Review the context providers
3. Check the CSS for styling issues
4. Verify the data flow in the respective hooks

---

**Made with ❤️ for Campus Placements**
