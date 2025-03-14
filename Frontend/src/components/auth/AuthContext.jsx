import { createContext, useState, useEffect } from "react";
const server = import.meta.env.VITE_SERVER_URL;
import { toast } from "react-toastify";
import { api } from "../../helpers/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = () => {
    loadUser();
  };

  const logout = () => {
    api
      .post(`/auth/logout`)
      .then((res) => {
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
            ...prevUser,
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
