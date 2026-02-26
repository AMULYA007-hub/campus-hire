# CampusHire - Quick Start Guide

## 🚀 Starting the Application

### Step 1: Navigate to the project folder
```bash
cd "c:\Users\Amulya\OneDrive\Desktop\REACT\campus-hire"
```

### Step 2: Start the development server
```bash
npm run dev
```

The application will start at: **http://localhost:5173**

## 👨‍💼 Demo Login Accounts

Try these credentials to explore different features:

### 1. Student Dashboard
- **Email**: `student@campus.com`
- **Password**: `password`
- **Features**: Explore jobs, apply, track applications

### 2. Employer Dashboard
- **Email**: `recruiter@techcorp.com`
- **Password**: `password`
- **Features**: Post jobs, review applications, shortlist candidates

### 3. Placement Officer Dashboard  
- **Email**: `officer@campus.com`
- **Password**: `password`
- **Features**: Track placements, generate reports, view analytics

### 4. Admin Dashboard
- **Email**: `admin@campus.com`
- **Password**: `password`
- **Features**: Manage users, view analytics, configure settings

## 🎯 Key Features by Role

### For Students 👨‍🎓
1. **Explore Jobs**
   - Search jobs by title, company, or location
   - Filter by required skills
   - View job details and salary ranges
   
2. **Apply for Jobs**
   - Click "Apply Now" on any job card
   - Upload resume and write cover letter
   - Track application status

3. **Track Applications**
   - View all your applications in one place
   - Check status: Applied, Shortlisted, or Rejected
   - Track submission dates

### For Employers 🏢
1. **Post Jobs**
   - Click "Post New Job" button
   - Fill in job details (title, salary, location, skills)
   - Set application deadline automatically

2. **Manage Applications**
   - View all applications for your jobs
   - Shortlist promising candidates
   - Reject unsuitable candidates

3. **Track Hiring**
   - Monitor application statistics
   - See active job count
   - Track shortlisted candidates

### For Placement Officers 👔
1. **Record Placements**
   - Click "Record Placement"
   - Enter student name, company, position, salary
   - Automatic date tracking

2. **View Analytics**
   - Placement rate calculation
   - Average package statistics
   - Company-wise hiring insights
   - Application pipeline status

3. **Generate Reports**
   - Download placement reports
   - Get comprehensive statistics
   - Track trends and metrics

### For Admins ⚙️
1. **Manage Users**
   - Add new users
   - Assign roles (Student, Employer, Officer, Admin)
   - View user activity

2. **View Analytics**
   - Total user count
   - Job posting statistics
   - Application metrics
   - Placement data

3. **System Settings**
   - Configure maintenance mode
   - Manage application deadlines
   - Set file upload limits
   - Enable/disable notifications

## 📊 Dashboard Layout

Each dashboard has:
- **Top Header**: With statistics cards showing key metrics
- **Tab Navigation**: To switch between different sections
- **Main Content Area**: Dynamic content based on selected tab
- **Sidebar Navigation**: Quick access to different sections
- **Responsive Design**: Works on mobile, tablet, and desktop

## 💡 Tips & Tricks

### Exploring Features
1. **Hover Effects**: Notice smooth animations on cards
2. **Form Validation**: All forms validate before submission
3. **Real-time Feedback**: Status updates appear instantly
4. **Search & Filters**: Use to find specific jobs or records

### Data Persistence
- Your login session is saved in browser localStorage
- Refresh the page to see your session persists
- Logout to clear your session

### Mock Data
- All data is example/demo data in localStorage
- No real backend API (can be integrated later)
- Changes persist during your session

## 🎨 UI Features

### Interactive Elements
- **Animated Buttons**: Hover for smooth transforms
- **Card Shadows**: Cards lift on hover for depth
- **Smooth Transitions**: All interactions are animated
- **Gradient Headers**: Beautiful gradient backgrounds
- **Status Badges**: Color-coded status indicators

### Responsive Design
- **Desktop**: Full sidebar + content layout
- **Tablet**: Collapse some elements, keep functionality
- **Mobile**: Hamburger menu sidebar, stacked layout

## 🆘 Troubleshooting

### Application Won't Load
1. Make sure Node.js and npm are installed
2. Run `npm install --legacy-peer-deps` again
3. Clear browser cache and reload

### Styling Issues
1. Check browser console for CSS errors
2. Make sure global.css is imported
3. Reload the page with `Ctrl+Shift+R` (hard refresh)

### Data Not Persisting
1. Data by default uses localStorage (session-based)
2. Try a private/incognito window to test
3. Clear localStorage and restart

### Port Already in Use
If port 5173 is busy, Vite will use the next available port

## 📁 Project Structure Quick Reference

```
campus-hire/
├── src/
│   ├── components/        # React components
│   ├── context/          # Global state (Auth, Data)
│   ├── hooks/            # Custom hooks
│   ├── styles/           # CSS files
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
├── package.json          # Dependencies
└── DOCUMENTATION.md      # Full documentation
```

## 🔧 Available Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## 📈 Next Steps

1. **Explore Each Dashboard**: Login as each role to see differences
2. **Test Workflows**: Try complete workflows:
   - Student: Search → Apply → Track
   - Employer: Post → Review → Shortlist
   - Officer: Record → View Analytics
   - Admin: Manage → Monitor

3. **Experiment**: Try searching, filtering, and modifying data

## 🎓 Learning Outcomes

By exploring this project, you'll learn:
- React component architecture
- React Context for state management
- React Router for navigation
- CSS Grid and Flexbox
- Responsive design patterns
- Form handling and validation
- Component composition

## ✅ Features Checklist

- ✅ Student Dashboard with job exploration
- ✅ Job application system
- ✅ Employer job posting and management
- ✅ Application shortlisting system
- ✅ Placement officer tracking dashboard
- ✅ Admin user management
- ✅ Analytics and reports
- ✅ Responsive design
- ✅ Login system with role-based access
- ✅ Data persistence

## 📞 Support

If you encounter any issues:
1. Check the console for error messages
2. Review the DOCUMENTATION.md file
3. Check component code comments
4. Verify all dependencies are installed

## 🎉 You're All Set!

The campus-hire placement system is ready to use. Have fun exploring!

---

**Happy Coding! 🚀**
