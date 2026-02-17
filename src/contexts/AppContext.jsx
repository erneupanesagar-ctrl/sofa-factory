import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
  user: { username: 'admin', role: 'admin', name: 'System Admin' },
  isAuthenticated: true,
  loading: false,
  error: null,
  sidebarOpen: true,
  company: { name: 'Sofa Factory', id: 1 },
  selectedFactory: null,
  filters: {}
};

function appReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload, isAuthenticated: true, loading: false, error: null };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'SET_SIDEBAR':
      return { ...state, sidebarOpen: action.payload };
    case 'SET_SELECTED_FACTORY':
      return { ...state, selectedFactory: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const login = async (username, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const mockAdmin = { username: 'admin', role: 'admin', name: 'System Admin' };
      dispatch({ type: 'LOGIN_SUCCESS', payload: mockAdmin });
      return mockAdmin;
    } catch (err) {
      console.error('Login error:', err);
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  };

  const logout = () => dispatch({ type: 'LOGOUT' });
  
  const toggleSidebar = () => dispatch({ type: 'TOGGLE_SIDEBAR' });
  
  const setSidebar = (open) => dispatch({ type: 'SET_SIDEBAR', payload: open });
  
  const setSelectedFactory = (factory) => dispatch({ type: 'SET_SELECTED_FACTORY', payload: factory });
  
  const setFilters = (filters) => dispatch({ type: 'SET_FILTERS', payload: filters });

  return (
    <AppContext.Provider value={{ 
      ...state, 
      login, 
      logout, 
      toggleSidebar, 
      setSidebar, 
      setSelectedFactory, 
      setFilters,
      dispatch 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
