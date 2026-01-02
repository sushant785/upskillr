import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // This state holds the user info
  const [auth, setAuth] = useState({
    user: null,
    accessToken: null,
    role: null, 
  });

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// This is the hook we will use in your button
export const useAuth = () => useContext(AuthContext);