// import React, { createContext, useState, useEffect, type ReactNode } from "react";
// import { appPreferences } from "../utils";
// // import { IMenu } from "../components/common/SideBarMenu/sideBarMenuTypes";
// // import { IUser } from "../pages/Admin/UserManagement/UserList/usersListTypes";

// interface AuthContextProps {
//   isAuthenticated: boolean;
//   sideMenuOpen: boolean;
//   setSideMenuOpen: (open: boolean) => void;
//   userDetails: unknown;
//   userToken: string | null;
//   accessDetails: unknown[] | null;
//   login: () => void;
//   logout: () => void;
//   setUserDetailsToContext: (userDetails: "") => void;
//   setUserTokenToContext: (userToken: string) => void;
//   setAccessDetailsToContext: (accessDetails: []) => void;
// }

// export const AuthContext = createContext<AuthContextProps | undefined>(
//   undefined
// );

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
//   const [sideMenuOpen, setSideMenuOpen] = useState<boolean>(false);
//   const [userDetails, setUserDetails] = useState<unknown>(null);
//   const [userToken, setUserToken] = useState<string | null>(null);
//   const [accessDetails, setAccessDetails] = useState<unknown[] | null>(null);

//   const login = async () => {
//     setIsAuthenticated(true);
//   };

//   const logout = async () => {
//     setIsAuthenticated(false);
//     setUserDetails(null);
//     setUserToken(null);
//     setAccessDetails(null);
//     await appPreferences.clearItems();
//   };

//   const setUserDetailsToContext = async (userDetails: unknown) => {
//     setUserDetails(userDetails);
//     await appPreferences.setItem("userDetails", JSON.stringify(userDetails));
//   };

//   const setUserTokenToContext = async (userToken: string) => {
//     setUserToken(userToken);
//     await appPreferences.setItem("userToken", userToken);
//   };

//   const setAccessDetailsToContext = async (accessDetails: any) => {
//     setAccessDetails(accessDetails);
//     await appPreferences.setItem(
//       "accessDetails",
//       JSON.stringify(accessDetails)
//     );
//   };

//   useEffect(() => {
//     (async () => {
//       const storedToken = await appPreferences.getItem("userToken");
//       const storedUserDetails = await appPreferences.getItem("userDetails");
//       const storedAccessDetails = await appPreferences.getItem("accessDetails");

//       setIsAuthenticated(() => {
//         return storedToken ? true : false;
//       });
//       setUserToken(storedToken);
//       setUserDetails(() => {
//         return storedUserDetails ? JSON.parse(storedUserDetails) : null;
//       });
//       setAccessDetails(() => {
//         return storedAccessDetails ? JSON.parse(storedAccessDetails) : null;
//       });
//     })();
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{
//         isAuthenticated,
//         userDetails,
//         userToken,
//         accessDetails,
//         login,
//         logout,
//         setUserDetailsToContext,
//         setUserTokenToContext,
//         setAccessDetailsToContext,
//         sideMenuOpen,
//         setSideMenuOpen,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

import { createContext } from "react";

export interface AuthContextProps {
  isAuthenticated: boolean;
  sideMenuOpen: boolean;
  setSideMenuOpen: (open: boolean) => void;
  userDetails: unknown;
  userToken: string | null;
  accessDetails: unknown[] | null;
  login: () => void;
  logout: () => void;
  setUserDetailsToContext: (userDetails: unknown) => void;
  setUserTokenToContext: (userToken: string) => void;
  setAccessDetailsToContext: (accessDetails: unknown[]) => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined,
);
