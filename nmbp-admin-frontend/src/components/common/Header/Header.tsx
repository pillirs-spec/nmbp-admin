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
      {/* Mobile Sidebar Drawer */}
      {sideMenuOpen ? (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setSideMenuOpen(false)}
          />
          <div className="fixed top-0 left-0 bottom-0 w-[75%] bg-white z-50 md:hidden overflow-y-auto shadow-lg">
            <div
              className="flex justify-between items-center p-4 border-b border-gray-200"
              onClick={() => setSideMenuOpen(false)}
            >
              <h3 className="font-semibold text-[#374151]">Menu</h3>
              <FontAwesomeIcon
                icon={faXmark}
                className="cursor-pointer text-gray-600"
              />
            </div>
            <div className="p-4">
              <SideBarMenu />
            </div>
          </div>
        </>
      ) : null}

      {/* Top Navigation Bar */}
      {isAuthenticated && (
        <div className="w-full bg-[#003366] text-white px-4 md:px-6 py-2 flex flex-col items-start md:flex-row md:justify-between md:items-center text-sm gap-4 md:gap-0">
          {/* Left: Logo and Hamburger */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button
              className="md:hidden p-1 hover:opacity-80 transition"
              onClick={() => setSideMenuOpen(true)}
            >
              <FontAwesomeIcon icon={faBars} size="lg" />
            </button>
            <button className="hover:opacity-80 transition">
              <img
                src={GovernmentOfIndia}
                alt="Government of India"
                className="hover:opacity-80 transition"
              />
            </button>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center divide-x divide-[#F9FAFB] px-2 md:px-3 ">
            <button className="px-2 md:px-4 hover:opacity-80 transition text-xs md:text-sm whitespace-nowrap">
              Skip to Main Content
            </button>

            <button className="px-2 md:px-4 hover:opacity-80 transition text-[#F9FAFB] text-xs md:text-sm">
              A<sup>-</sup>
            </button>

            <button className="px-2 md:px-4 hover:opacity-80 transition text-[#F9FAFB] text-xs md:text-sm">
              A
            </button>

            <button className="px-2 md:px-4 hover:opacity-80 transition text-[#F9FAFB] text-xs md:text-sm">
              A<sup>+</sup>
            </button>

            <button className="px-2 md:px-4 hover:opacity-80 transition">
              <img src={Constrast} alt="Contrast" className="h-3 md:h-4" />
            </button>

            <button className="px-2 md:px-4 hover:opacity-80 transition">
              <img
                src={Accessiblity}
                alt="Accessibility"
                className="h-3 md:h-4"
              />
            </button>

            <button className="px-2 md:px-4 !text-xs md:!text-sm hover:opacity-80 transition flex items-center whitespace-nowrap gap-1">
              <img src={Globe} alt="Globe" className="h-3 md:h-4" />
              English
              <img src={ArrowDropDown} alt="Arrow" className="h-3 md:h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Header */}
      {isAuthenticated && (
        <div className="w-full bg-white border-b border-gray-300 px-6 py-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
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
          <div className="flex items-center justify-start sm:justify-end gap-8">
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
                    <div className="flex items-center  gap-4 cursor-pointer hover:opacity-80 transition">
                      <div className="order-2">
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
                      <div className="order-1 flex items-center justify-center w-12 h-12 rounded-lg bg-[#C8DBF0] text-[#001933] font-bold text-lg">
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
