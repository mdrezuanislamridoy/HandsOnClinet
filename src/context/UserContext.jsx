import { createContext, useEffect, useState } from "react";
import axiosInstance from "../utilities/AxiosInstance";

export const context = createContext();

export default function UserContext({ children }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get("/auth/profile", {
          withCredentials: true,
        });
        if (response.data.user) {
          setUser(response.data.user);
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
        setLoading(false);
      } catch (error) {
        console.error("Fetch Profile Error:", error);
        setLoggedIn(false);
        setLoading(false);
      }
    };

    fetchUser();
  }, [loggedIn]);

  const logout = () => {
    setLoggedIn(false);
    setUser(null); // Clear user data on logout
  };

  return (
    <context.Provider value={{ loggedIn, setLoggedIn, user, loading, logout }}>
      {children}
    </context.Provider>
  );
}
