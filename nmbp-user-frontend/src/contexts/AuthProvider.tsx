import React, { useState, useEffect, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { appPreferences } from "../utils";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [sideMenuOpen, setSideMenuOpen] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<unknown>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [accessDetails, setAccessDetails] = useState<unknown[] | null>(null);

  const login = async () => {
    setIsAuthenticated(true);
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setUserDetails(null);
    setUserToken(null);
    setAccessDetails(null);
    await appPreferences.clearItems();
  };

  const setUserDetailsToContext = async (userDetails: unknown) => {
    setUserDetails(userDetails);
    await appPreferences.setItem("userDetails", JSON.stringify(userDetails));
  };

  const setUserTokenToContext = async (userToken: string) => {
    setUserToken(userToken);
    await appPreferences.setItem("userToken", userToken);
  };

  const setAccessDetailsToContext = async (accessDetails: unknown[]) => {
    setAccessDetails(accessDetails);
    await appPreferences.setItem(
      "accessDetails",
      JSON.stringify(accessDetails),
    );
  };

  useEffect(() => {
    (async () => {
      const storedToken = await appPreferences.getItem("userToken");
      const storedUserDetails = await appPreferences.getItem("userDetails");
      const storedAccessDetails = await appPreferences.getItem("accessDetails");

      setIsAuthenticated(!!storedToken);
      setUserToken(storedToken);
      setUserDetails(storedUserDetails ? JSON.parse(storedUserDetails) : null);
      setAccessDetails(
        storedAccessDetails ? JSON.parse(storedAccessDetails) : null,
      );
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userDetails,
        userToken,
        accessDetails,
        login,
        logout,
        setUserDetailsToContext,
        setUserTokenToContext,
        setAccessDetailsToContext,
        sideMenuOpen,
        setSideMenuOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
