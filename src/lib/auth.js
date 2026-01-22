// Authentication and user management for Sofa Factory Manager
import db from './database';

export const USER_ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
  LABOUR_MANAGER: 'labour_manager'
};

export const PERMISSIONS = {
  VIEW_PROFITS: 'view_profits',
  MANAGE_COSTS: 'manage_costs',
  APPROVE_SALES: 'approve_sales',
  MANAGE_USERS: 'manage_users',
  MANAGE_COMPANY: 'manage_company',
  MANAGE_LABOUR: 'manage_labour',
  VIEW_ALL_LOCATIONS: 'view_all_locations',
  SEND_NOTIFICATIONS: 'send_notifications'
};

class AuthManager {
  constructor() {
    this.currentUser = null;
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return;
    await db.init();
    this.currentUser = await db.getCurrentUser();
    this.isInitialized = true;
  }

  async isFirstTimeSetup() {
    const users = await db.getAll('users');
    return users.length === 0;
  }

  async resetDatabase() {
    try {
      await db.resetDatabase();
      this.currentUser = null;
      return true;
    } catch (error) {
      console.error('Failed to reset database:', error);
      throw error;
    }
  }

  async createAdminAccount(userData) {
    // Check if username already exists
    const users = await db.getAll('users');
    const existing = users.find(u => u.username === userData.username || u.email === userData.email);
    
    if (existing) {
      // If it exists, just update it and make it current
      existing.isCurrentUser = true;
      await db.update('users', existing);
      this.currentUser = existing;
      return existing;
    }

    const adminData = {
      ...userData,
      role: USER_ROLES.ADMIN,
      isCurrentUser: true,
      isActive: true,
      permissions: this.getPermissionsForRole(USER_ROLES.ADMIN),
      createdAt: new Date().toISOString()
    };

    const adminId = await db.add('users', adminData);
    this.currentUser = await db.get('users', adminId);
    return this.currentUser;
  }

  async login(username, password) {
    const users = await db.getAll('users');
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
      throw new Error('Invalid username or password');
    }

    // Update current user flags
    for (const u of users) {
      u.isCurrentUser = (u.id === user.id);
      await db.update('users', u);
    }

    user.lastLogin = new Date().toISOString();
    await db.update('users', user);
    
    this.currentUser = user;
    return user;
  }

  async logout() {
    if (this.currentUser) {
      this.currentUser.isCurrentUser = false;
      await db.update('users', this.currentUser);
      this.currentUser = null;
    }
  }

  getPermissionsForRole(role) {
    switch (role) {
      case USER_ROLES.ADMIN:
        return Object.values(PERMISSIONS);
      case USER_ROLES.LABOUR_MANAGER:
        return [PERMISSIONS.MANAGE_LABOUR, PERMISSIONS.MANAGE_COSTS];
      case USER_ROLES.STAFF:
        return [];
      default:
        return [];
    }
  }

  hasPermission(permission) {
    if (!this.currentUser) return false;
    return this.currentUser.permissions?.includes(permission) || this.currentUser.role === USER_ROLES.ADMIN;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isAdmin() {
    return this.currentUser && this.currentUser.role === USER_ROLES.ADMIN;
  }
}

const auth = new AuthManager();
export default auth;
