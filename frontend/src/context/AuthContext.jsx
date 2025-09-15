import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("❌ Failed to parse user:", err);
        localStorage.removeItem("user");
      }
    }
    if (storedToken && storedToken !== "undefined") {
      setToken(storedToken);
    }
  }, []);

  const login = (data) => {
    // ✅ Handle backend response (token + user fields in same object)
    const { token, ...userInfo } = data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userInfo));

    setUser(userInfo);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
