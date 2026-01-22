// Initialize default admin and staff accounts if none exist
import db from './database';

export async function initDefaultAdmin() {
  try {
    const users = await db.getAll('users');
    
    // 1. Ensure Admin exists
    const adminExists = users.some(u => u.username === 'admin');
    if (!adminExists) {
      const defaultAdmin = {
        id: 'admin-account',
        name: 'Administrator',
        email: 'admin@sofafactory.com',
        phone: '9800000000',
        role: 'admin',
        username: 'admin',
        password: 'admin123',
        isActive: true,
        permissions: ['view_profits', 'manage_costs', 'approve_sales', 'manage_users', 'manage_company', 'manage_labour', 'view_all_locations', 'send_notications'],
        createdAt: new Date().toISOString()
      };
      await db.add('users', defaultAdmin);
      console.log('Default admin account created');
    }

    // 2. Ensure Staff exists
    const staffExists = users.some(u => u.username === 'staff');
    if (!staffExists) {
      const defaultStaff = {
        id: 'staff-account',
        name: 'Factory Staff',
        email: 'staff@sofafactory.com',
        phone: '9811111111',
        role: 'staff',
        username: 'staff',
        password: 'staff123',
        isActive: true,
        permissions: [], // Staff have limited permissions
        createdAt: new Date().toISOString()
      };
      await db.add('users', defaultStaff);
      console.log('Default staff account created');
    }

    // 3. Ensure Company Profile exists
    const company = await db.get('company', 'profile');
    if (!company) {
      const defaultCompany = {
        id: 'profile',
        name: 'Sofa Factory',
        address: 'Kathmandu, Nepal',
        phone: '9851234567',
        email: 'info@sofafactory.com',
        createdAt: new Date().toISOString()
      };
      await db.add('company', defaultCompany);
      console.log('Default company profile created');
    }

    // 4. Ensure at least one Location exists
    const locations = await db.getAll('locations');
    if (locations.length === 0) {
      const defaultLocation = {
        id: 'main-factory',
        name: 'Main Factory',
        address: 'Kathmandu',
        createdAt: new Date().toISOString()
      };
      await db.add('locations', defaultLocation);
      console.log('Default location created');
    }

    return true;
  } catch (error) {
    console.error('Failed to initialize default data:', error);
    return false;
  }
}
