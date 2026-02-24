import React, { useEffect, useState } from "react";
import HeaderLogo from "../../../assets/national-emblem.svg";

import SideBarMenu from "../SideBarMenu/SideBarMenu";
import { useAuth, useLogger } from "../../../hooks";
import { HoverCard } from "@mantine/core";
import CommonDrawer from "../Drawer/CommonDrawer";
import { IconX } from "@tabler/icons-react";
import ProfileManagement from "../../../pages/Admin/ProfileManagement/ProfileManagement";
import headerService from "./headerService";
import { LogLevel } from "../../../enums";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import Globe from "../../../assets/globe.png";
import Constrast from "../../../assets/contrast.png";
import Accessiblity from "../../../assets/accessibility_new.png";
import ArrowDropDown from "../../../assets/arrow_drop_down.png";
import GovernmentOfIndia from "../../../assets/govt-of-india.svg";

const Header: React.FC = () => {
  const { sideMenuOpen, setSideMenuOpen } = useAuth();
  const [openedProfile, setOpenedProfile] = useState(false);
  const { isAuthenticated, setUserDetailsToContext, userDetails } = useAuth();
  const { log } = useLogger();
  const { logout } = useAuth();
  const [userData, setUserData] = useState<any>([]);

  const getLoggedInUserInfo = async () => {
    try {
      const response = await headerService.getLoggedInUserInfo();
      if (response.data && response.data.data) {
        log(LogLevel.INFO, "Header :: Logged In User Info", response.data.data);
        setUserDetailsToContext(response.data.data);
        setUserData(response.data.data);
      }
    } catch (error) {
      log(LogLevel.ERROR, "Header :: Logged In User Info", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (!userDetails) getLoggedInUserInfo();
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      await headerService.logout();
      await logout();
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (error) {
      log(LogLevel.ERROR, "ProfileOptions :: handleLogout", error);
    }
  };

  return (
    <>
      {sideMenuOpen ? (
        <div className=" bg-white border-l border-l-gray-500 h-screen w-[90%] z-50 sm:w-3/4 overflow-y-auto">
          <div
            className="flex justify-end items-center shadow p-3"
            onClick={() => setSideMenuOpen(false)}
          >
            <FontAwesomeIcon icon={faXmark} />
          </div>
          <div className="p-3">
            <SideBarMenu />
          </div>
        </div>
      ) : null}

      {/* Top Navigation Bar */}
      {isAuthenticated && (
        <div className=" w-full bg-[#003366] text-white px-6 py-2 flex flex-col md:flex-row md:justify-between items-center text-sm z-40">
          <button className="hover:opacity-80 transition">
            <img
              src={GovernmentOfIndia}
              alt="Government of India"
              className="hover:opacity-80 transition"
            />
          </button>
          <div className="flex items-center divide-x divide-[#F9FAFB] px-3">
            <button className="px-4 hover:opacity-80 transition">
              Skip to Main Content
            </button>

            <button className="px-4 hover:opacity-80 transition text-[#F9FAFB]">
              A<sup>-</sup>
            </button>

            <button className="px-4 hover:opacity-80 transition text-[#F9FAFB]">
              A
            </button>

            <button className="px-4 hover:opacity-80 transition text-[#F9FAFB]">
              A<sup>+</sup>
            </button>

            <button className="px-4 hover:opacity-80 transition">
              <img src={Constrast} alt="Contrast" className="h-4" />
            </button>

            <button className="px-4 hover:opacity-80 transition">
              <img src={Accessiblity} alt="Accessibility" className="h-4" />
            </button>

            <button className="px-4 !text-sm hover:opacity-80 transition flex items-center">
              <img src={Globe} alt="Globe" className="h-4 mr-1" />
              English
              <img src={ArrowDropDown} alt="Arrow" className="h-4 ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* Main Header */}
      {isAuthenticated && (
        <div className="w-full bg-white border-b border-gray-300 px-6 py-2 flex items-center justify-between z-40">
          {/* Left Section */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <img src={HeaderLogo} alt="national-emblem" className="h-20" />

            {/* Organization Details */}
            <div className="flex flex-col">
              <span className="bg-[#FFD323] text-[#000000] px-2 py-0.5 rounded font-bold w-fit mb-1 text-[10px]">
                BETA
              </span>

              <span className="text-[#374151] font-[500] text-xs">
                Government of India
              </span>

              <h1 className="text-lg md:text-xl font-bold text-[#374151] mt-1">
                Ministry of Social Justice & Empowerment
              </h1>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-8">
            {isAuthenticated ? (
              <>
                <CommonDrawer
                  opened={openedProfile}
                  onClose={() => setOpenedProfile(false)}
                  closeButtonProps={{
                    icon: <IconX size={20} stroke={2} />,
                  }}
                  title={"Profile Settings"}
                >
                  <ProfileManagement
                    closeSlider={() => setOpenedProfile(false)}
                  />
                </CommonDrawer>

                <HoverCard width={250} shadow="md">
                  <HoverCard.Target>
                    <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition">
                      <div className="text-right">
                        <div className="font-semibold text-[#374151]">
                          {userDetails?.display_name
                            ? userDetails?.display_name
                            : userData?.display_name}
                        </div>
                        <div className="text-xs text-[#6B7280]">
                          {userDetails?.role_name
                            ? userDetails?.role_name
                            : userData?.role_name || "District Nodal Officer"}
                        </div>
                      </div>
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#C8DBF0] text-[#001933] font-bold text-lg">
                        {userDetails?.display_name
                          ? userDetails.display_name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .substring(0, 2)
                          : userData?.display_name
                            ? userData.display_name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .substring(0, 2)
                            : "SM"}
                      </div>
                    </div>
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <div
                      className="cursor-pointer text-sm pb-2 hover:text-blue-600 transition"
                      onClick={() => setOpenedProfile(true)}
                    >
                      Profile Settings
                    </div>
                    <div className="border-t border-gray-300 my-2"></div>
                    <div
                      className="cursor-pointer text-sm pt-2 hover:text-blue-600 transition"
                      onClick={handleLogout}
                    >
                      Logout
                    </div>
                  </HoverCard.Dropdown>
                </HoverCard>

                <div
                  className="hidden md:hidden lg:hidden"
                  onClick={() => setSideMenuOpen(true)}
                >
                  <FontAwesomeIcon
                    icon={faBars}
                    size="lg"
                    className="text-gray-900 cursor-pointer"
                  />
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
