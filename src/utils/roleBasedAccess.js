/**
 * Role-Based Route Protection
 * Enforces access control based on user role
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { logger } from '../utils/logger';

/**
 * Role-Based Access Control (RBAC) configuration
 * Defines which roles can access which features
 */
const ROLE_PERMISSIONS = {
  student: {
    allowedDashboards: ['student'],
    allowedViews: ['dashboard', 'explore-jobs', 'my-applications', 'profile', 'notifications', 'advanced-search'],
    deniedViews: ['admin', 'teacher', 'academic', 'officer', 'users', 'analytics', 'settings', 'post-job', 'my-jobs', 'applications', 'company'],
  },
  employer: {
    allowedDashboards: ['employer'],
    allowedViews: ['dashboard', 'post-job', 'my-jobs', 'applications', 'company'],
    deniedViews: ['admin', 'teacher', 'academic', 'officer', 'users', 'analytics', 'settings', 'explore-jobs', 'my-applications', 'notifications'],
  },
  officer: {
    allowedDashboards: ['officer'],
    allowedViews: ['dashboard', 'placements', 'tracking', 'reports', 'interactions', 'analytics'],
    deniedViews: ['admin', 'teacher', 'academic', 'users', 'settings', 'explore-jobs', 'my-applications', 'post-job', 'my-jobs', 'applications', 'company'],
  },
  admin: {
    allowedDashboards: ['admin', 'student', 'employer', 'officer'],
    allowedViews: ['all'],
    deniedViews: [],
  },
};

/**
 * RoleBasedRoute Component
 * Checks if user has permission to access the requested view/dashboard
 */
export const RoleBasedRoute = ({ children, requiredRole, user, deniedComponent = null }) => {
  if (!user) {
    return <Navigate to="/" replace />;
  }

  const userRole = user.role;
  const permissions = ROLE_PERMISSIONS[userRole];

  // Check if user's role is allowed to access this
  if (requiredRole && !permissions?.allowedDashboards.includes(requiredRole)) {
    logger.warn('Access denied - insufficient permissions', { userRole, requiredRole }, 'RoleBasedRoute');
    
    if (deniedComponent) {
      return deniedComponent;
    }
    
    return <Navigate to="/access-denied" replace />;
  }

  return children;
};

/**
 * ViewAccessControl Component
 * Checks if user can access a specific view
 */
export const ViewAccessControl = ({ viewId, user, children, fallback = null }) => {
  if (!user) {
    return <Navigate to="/" replace />;
  }

  const userRole = user.role;
  const permissions = ROLE_PERMISSIONS[userRole];

  // Check if view is allowed
  const isAllowed = permissions?.allowedViews.includes('all') || 
                   permissions?.allowedViews.includes(viewId);

  if (!isAllowed) {
    logger.warn('Access denied to view', { userRole, viewId }, 'ViewAccessControl');
    return fallback || <Navigate to="/access-denied" replace />;
  }

  return children;
};

/**
 * Sidebar Item Filter
 * Filters sidebar items based on user role
 */
export const filterSidebarItemsByRole = (items, userRole) => {
  const permissions = ROLE_PERMISSIONS[userRole];
  
  if (!permissions) {
    return [];
  }

  return items.filter(item => {
    const isAllowed = permissions.allowedViews.includes('all') || 
                     permissions.allowedViews.includes(item.id);
    
    if (!isAllowed) {
      logger.debug(`Filtering out sidebar item: ${item.id}`, null, 'filterSidebarItemsByRole');
    }

    return isAllowed;
  }).map(item => {
    // Filter submenu items as well
    if (item.submenu) {
      return {
        ...item,
        submenu: item.submenu.filter(sub => {
          return permissions.allowedViews.includes('all') || 
                permissions.allowedViews.includes(sub.id);
        })
      };
    }
    return item;
  });
};

/**
 * Check if user can perform action
 */
export const canUserAccess = (userRole, viewId) => {
  const permissions = ROLE_PERMISSIONS[userRole];
  return permissions?.allowedViews.includes('all') || 
         permissions?.allowedViews.includes(viewId);
};

/**
 * Get allowed roles for a specific view
 */
export const getAllowedRolesForView = (viewId) => {
  const allowedRoles = [];
  
  Object.entries(ROLE_PERMISSIONS).forEach(([role, permissions]) => {
    if (permissions.allowedViews.includes('all') || 
        permissions.allowedViews.includes(viewId)) {
      allowedRoles.push(role);
    }
  });

  return allowedRoles;
};

export default RoleBasedRoute;
