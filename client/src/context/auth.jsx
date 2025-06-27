import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const BASE_URL = process.env.REACT_APP_API_SERVER_URL;

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken !== token) {
      setToken(storedToken || "");
    }
  }, [token]);


  const storeTokenInLS = (serverToken) => {
    setToken(serverToken);
    localStorage.setItem("token", serverToken);
  };

  const isLoggedIn = !!token;

  const LogoutUser = () => {
    setToken("");
    localStorage.removeItem("token");
  };

  // JWT AUTHENTICATION - to get the data of the user that is currently logged in

  const userAuthentication = async () => {
    try {
      setIsFetching(true);

      const response = await fetch(`${BASE_URL}/api/getCurrentUser`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.userData);
        setIsFetching(false);
      } else {
        setUser(null); // Handle case when the user is not logged in
        setIsFetching(false);
      }
    } catch (error) {
      console.error("Error fetching User data", error);
    }

    // Check if token is expired
    try {
      setIsFetching(true);
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Convert milliseconds to seconds
      if (decodedToken.exp < currentTime) {
        LogoutUser();
        toast.error("Session Timed Out! Please Login again");
      }
      setIsFetching(false);
    } catch (error) {
      // console.error("Error decoding token");
    }
  };

  useEffect(() => {
    userAuthentication();
  }, [token]);
  return (
    <AuthContext.Provider
      value={{
        token,
        isLoggedIn,
        storeTokenInLS,
        LogoutUser,
        user,
        BASE_URL,
        isFetching,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) {
    throw new Error("useAuth is used outside of the Provider");
  }
  return authContextValue;
};
