import { createContext, useContext, useState } from "react";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    try {
      const s = localStorage.getItem("cinebook_admin");
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });

  const adminLogin = (data) => {
    setAdmin(data);
    localStorage.setItem("cinebook_admin", JSON.stringify(data));
  };

  const adminLogout = () => {
    setAdmin(null);
    localStorage.removeItem("cinebook_admin");
  };

  return (
    <AdminContext.Provider value={{ admin, adminLogin, adminLogout }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
