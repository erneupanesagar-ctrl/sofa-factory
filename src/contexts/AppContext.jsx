import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const initialState = {
  user: { username: 'admin', role: 'admin', name: 'System Admin' },
  isAuthenticated: true,
  loading: false,
  error: null
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
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const login = async (username, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Force login as admin for local testing
      const mockAdmin = { username: 'admin', role: 'admin', name: 'System Admin' };
      dispatch({ type: 'LOGIN_SUCCESS', payload: mockAdmin });
      return mockAdmin;
    } catch (err) {
      console.error('Login error:', err);
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  };

  const logout = () => dispatch({ type: 'LOGOUT' });

  return (
    <AppContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
