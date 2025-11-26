import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      checkUserLoggedIn();
   }, []);

   const checkUserLoggedIn = async () => {
      try {
         const response = await fetch('http://localhost:8080/api/user/me', { credentials: 'include' });
         if (response.ok) {
            const data = await response.json();
            setUser(data);
         } else {
            setUser(null);
         }
      } catch (error) {
         console.error("Error checking login status", error);
         setUser(null);
      } finally {
         setLoading(false);
      }
   };

   const login = async (username, password) => {
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('password', password);

      const response = await fetch('http://localhost:8080/api/auth/login', {
         method: 'POST',
         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
         body: params,
         credentials: 'include',
      });

      if (response.ok) {
         await checkUserLoggedIn();
         return true;
      }
      return false;
   };

   const logout = async () => {
      await fetch('http://localhost:8080/api/auth/logout', { method: 'POST', credentials: 'include' });
      setUser(null);
   };

   return (
      <AuthContext.Provider value={{ user, login, logout, loading, checkUserLoggedIn }}>
         {children}
      </AuthContext.Provider>
   );
};

export const useAuth = () => useContext(AuthContext);
