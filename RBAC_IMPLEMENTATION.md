# Role-Based Access Control (RBAC) Implementation

## Overview
Implemented comprehensive role-based access control (RBAC) system to restrict student access to unauthorized portals while maintaining appropriate access for other roles (admin, employer, officer).

## What Was Implemented

### 1. **Role-Based Access Control Utility** (`src/utils/roleBasedAccess.js`)
**Key Features:**
- **ROLE_PERMISSIONS Object** - Defines what each role can access:
  - **Student**: Can access dashboard, explore jobs, applications, profile, notifications, job search
  - **Student Cannot Access**: Admin, teacher, academic/officer portals, user management, analytics, settings
  - **Employer**: Can access dashboard, post jobs, manage jobs, view applications, company profile
  - **Officer**: Can access dashboard, placements, tracking, reports, interactions, analytics
  - **Admin**: Full access to all areas ("all" permission)

**Helper Functions:**
- `RoleBasedRoute` - Component wrapper for route-based access control
- `ViewAccessControl` - Component for view-level access control
- `filterSidebarItemsByRole()` - Filters sidebar menu items based on user role
- `canUserAccess(role, viewId)` - Checks if a user can access a specific view
- `getAllowedRolesForView(viewId)` - Returns list of roles allowed to access a view

### 2. **Access Denied Component** (`src/components/Common/AccessDenied.jsx`)
**Features:**
- User-friendly error page when access is denied
- Shows lock icon (🔒) and clear message
- Two action buttons: "Go Back" and "Go to Dashboard"
- Includes error code: ACCESS_DENIED_403
- Fully responsive design with gradient background
- Animated entrance with shake effect

**Styling** (`src/components/Common/AccessDenied.css`):
- Professional card-based layout
- Purple gradient background
- Hover animations on buttons
- Mobile-responsive design
- Clear visual hierarchy

### 3. **App.jsx Updates**
**Changes Made:**
- Imported `AccessDenied` component and RBAC utilities
- Updated `DashboardLayout` component to:
  - Add `accessDeniedView` state to track unauthorized access attempts
  - Filter sidebar items using `filterSidebarItemsByRole()` to hide restricted menu items
  - Implement `handleSidebarClick()` with access control check
  - Show `AccessDenied` component when user tries to access unauthorized view
  - Log access denial attempts for security

**How It Works:**
1. When user clicks a sidebar item, `handleSidebarClick()` is triggered
2. Function calls `canUserAccess()` to check permissions
3. If user has permission → view changes normally
4. If user lacks permission → shows AccessDenied component with error message

### 4. **Student Profile Photo Upload** (`src/components/Student/StudentProfile.jsx`)
**Features Added:**
- File upload handler with validation:
  - Verifies file is an image type
  - Checks file size doesn't exceed 5MB
  - Provides user feedback for invalid files
- `uploadAvatar()` function to send file to server:
  - Uses FormData for multipart upload
  - Includes user ID in request
  - Sends authorization token in headers
  - Handles upload success/failure with appropriate messages
- Visual feedback during upload:
  - Shows loading spinner while uploading
  - Disables input during upload
  - Updates profile avatar after successful upload

**CSS Updates** (`src/styles/profile.css`):
- Improved avatar upload button styling:
  - Better hover effects with scale animation
  - Spinner animation for loading state
  - "Upload" label on button for clarity
  - Border and shadow for better visibility
  - Disabled state styling

## Security Features Implemented

### 1. **Access Control**
- Permissions enforced on the UI layer (sidebar filtering)
- Access checks before view changes
- Prevents students from clicking admin/teacher/academic menu items
- Shows AccessDenied page if unauthorized access is attempted

### 2. **Logging**
- All access denial attempts are logged with:
  - User role
  - Requested view
  - Timestamp and component name
- Helps identify unauthorized access attempts or suspicious activity

### 3. **File Upload Security**
- File type validation (images only)
- File size limit (5MB max)
- Authorization header with token in upload requests
- User ID verification in upload payload

## User Access Scenarios

### Scenario 1: Student Tries to Access Admin Area
1. Student logs in
2. Sidebar shows only student-allowed items (no admin/teacher/academic options)
3. If student somehow accesses restricted view → AccessDenied page shown
4. Student clicks "Go to Dashboard" to return to allowed area

### Scenario 2: Student Updates Profile Photo
1. Student clicks camera icon on profile avatar
2. Selects image file from computer
3. System validates file (must be image, <5MB)
4. Shows spinner while uploading
5. Avatar updates on success, error message on failure

### Scenario 3: Employer Views Jobs
1. Employer logs in
2. Sees only employer-relevant menu items
3. Can access post job, my jobs, applications, company profile
4. Cannot see student or admin sections

## Configuration

To modify role permissions, edit `ROLE_PERMISSIONS` in `src/utils/roleBasedAccess.js`:

```javascript
const ROLE_PERMISSIONS = {
  student: {
    allowedDashboards: ['student'],
    allowedViews: ['dashboard', 'explore-jobs', ...],
    deniedViews: ['admin', 'teacher', ...],
  },
  // ... other roles
};
```

## Testing the Implementation

### Test 1: Verify Sidebar Filtering
- Login as student
- Check sidebar shows only student items
- Login as admin
- Check sidebar shows all items

### Test 2: Test Access Denial
- Login as student
- Try to manually navigate to admin view
- Should see AccessDenied page
- Click "Go to Dashboard" → returns to student dashboard

### Test 3: Test Photo Upload
- Login as student
- Go to profile section
- Click camera icon on avatar
- Select a JPG/PNG file
- Verify upload completes and avatar updates
- Try uploading file >5MB → should show error
- Try uploading non-image → should show error

## Files Modified/Created

**Created:**
- `src/utils/roleBasedAccess.js` - RBAC configuration and utilities
- `src/components/Common/AccessDenied.jsx` - Access denied component
- `src/components/Common/AccessDenied.css` - Access denied styling

**Modified:**
- `src/App.jsx` - Added RBAC integration to DashboardLayout
- `src/components/Student/StudentProfile.jsx` - Added photo upload functionality
- `src/styles/profile.css` - Enhanced upload button styling

## Backend API Requirements

For profile photo upload to work, backend needs:
- Endpoint: `POST /api/upload`
- Accepts: FormData with 'avatar' file and 'userId'
- Returns: `{ avatarUrl: "path/to/uploaded/image" }`
- Requires: Authorization header with bearer token

## Notes

- All access control checks are logged for security auditing
- UI-layer permissions prevent students from accessing restricted views
- Profile photo upload includes client-side validation for better UX
- AccessDenied component provides clear feedback and easy navigation back
- Role permissions are centralized for easy management and updates
