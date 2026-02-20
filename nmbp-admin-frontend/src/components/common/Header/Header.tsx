import React, { useEffect, useState } from "react";
import HeaderLogo from "../../../assets/logo.png";

import SideBarMenu from "../SideBarMenu/SideBarMenu";
import { useAuth, useLogger } from "../../../hooks";
import { Text, Image, HoverCard } from "@mantine/core";
import CommonDrawer from "../Drawer/CommonDrawer";
import { IconX } from "@tabler/icons-react";
import ProfileManagement from "../../../pages/Admin/ProfileManagement/ProfileManagement";
import ProfileImage from "../../../assets/images/profile_image.svg";
import headerService from "./headerService";
import { LogLevel } from "../../../enums";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars , faXmark} from "@fortawesome/free-solid-svg-icons";

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
        <div className="absolute top-0 right-0 bg-white border-l border-l-gray-500 h-screen w-[90%] z-50 sm:w-3/4">
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

      <div className="bg-[#0000FF] px-5 py-2 flex items-center justify-between fixed top-0 w-full z-10">
        <div className="flex items-center space-x-3">
          <img src={HeaderLogo} alt="logo" className="w-[70px] h-[70px]" />
          {/* <h1 className="font-[600] text-base text-[#ffffff]">
            Demo
          </h1> */}
        </div>

        <div className="flex">
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

              <HoverCard width={200} shadow="md">
                <HoverCard.Target>
                  <div className="flex items-center space-x-4 cursor-pointer">
                    <div className="flex items-center px-3 py-1">
                      <Image
                        src={
                          userDetails?.profile_pic_url
                            ? userDetails?.profile_pic_url
                            : userData?.profile_pic_url
                            ? userData?.profile_pic_url
                            : ProfileImage
                        }
                        alt="User Avatar"
                        radius="xl"
                        className="!w-10 h-10"
                      />
                      <Text className="!ml-2 !text-white !font-medium !text-sm !tracking-wide">
                        {userDetails?.display_name
                          ? userDetails?.display_name
                          : userData?.display_name}
                      </Text>
                    </div>
                    <div
                      className="block md:hidden"
                      onClick={() => setSideMenuOpen(true)}
                    >
                      <FontAwesomeIcon stroke="25" icon={faBars} />
                    
                    </div>
                  </div>
                </HoverCard.Target>
                <HoverCard.Dropdown className="z-[-1]">
                  <div
                    className="cursor-pointer text-base pb-2"
                    onClick={() => setOpenedProfile(true)}
                  >
                    Profile Settings
                  </div>
                  <div className="border-t border-slate-800"></div>
                  <div
                    className="cursor-pointer text-base pt-2"
                    onClick={handleLogout}
                  >
                    Logout
                  </div>
                </HoverCard.Dropdown>
              </HoverCard>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Header;
