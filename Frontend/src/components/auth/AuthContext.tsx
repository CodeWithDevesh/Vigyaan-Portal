import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { api } from "../../helpers/api";

interface AuthContextType {
  user: any;
  login: () => void;
  logout: () => void;
  loadUser: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  loadUser: () => {},
});

import { ReactNode } from "react";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);

  const login = () => {
    loadUser();
  };

  const logout = () => {
    api
      .post(`/auth/logout`)
      .then(() => {
        toast("Logged out successfully!");
        setUser(null);
      })
      .catch((err) => {
        toast.error("Error logging out. Please try again.");
        console.error(err);
      })
      .finally(() => {});
  };

  const loadUser = async () => {
    api
      .get(`/users/me`)
      .then((res) => {
        console.log(res.data); // TODO: Remove this line in Production
        if (res.data.ok && res.data.response) {
          setUser((prevUser) => ({
            ...(prevUser || {}),
            ...res.data.response,
          }));
        }
      })
      .catch((err) => {
        setUser(null);
        console.error(err);
      });
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};
