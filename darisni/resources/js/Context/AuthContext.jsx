import React, { createContext, useContext, useState } from "react";
import { router } from '@inertiajs/react';

export const AuthContext = createContext();

export const AuthProvider = ({ children, auth }) => {
  // Get initial user from Inertia's shared data
  const [user, setUser] = useState(auth?.user || null);
  const [loading, setLoading] = useState(false);

  // Login helper - uses Inertia to handle authentication
  const login = async (data, options = {}) => {
    setLoading(true);
    console.log("AuthContext login called:", data);
    return new Promise((resolve, reject) => {
      router.post('/login', data, {
        onSuccess: (page) => {
          console.log("AuthContext login onSuccess:", page);
          setUser(page.props.auth?.user || null);
          setLoading(false);
          resolve(true);
        },
        onError: (errors) => {
          console.log("AuthContext login onError:", errors);
          setLoading(false);
          reject(errors);
        },
        ...options
        });
    });
  };

  // Logout helper - uses Inertia to handle logout
  const logout = async (options = {}) => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      router.post('/logout', {}, {
        onSuccess: () => {
          setUser(null);
          setLoading(false);
          resolve(true);
        },
        onError: (errors) => {
          setLoading(false);
          reject(errors);
        },
        ...options
      });
    });
  };

  // Register helper - uses Inertia to handle registration
  const register = async (data, options = {}) => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      router.post('/register', data, {
        onSuccess: (page) => {
          setUser(page.props.auth?.user || null);
          setLoading(false);
          resolve(true);
        },
        onError: (errors) => {
          setLoading(false);
          reject(errors);
        },
        ...options
      });
    });
  };

  // Update user when Inertia page props change
  const updateUser = (newUser) => {
    setUser(newUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        setUser: updateUser,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
