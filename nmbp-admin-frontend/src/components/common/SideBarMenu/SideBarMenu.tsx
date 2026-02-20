import React, { useEffect, useState } from "react";
import { Box, Flex } from "@mantine/core";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth, useLogger } from "../../../hooks";
// import {
//   UserImage,
//   RoleImage,
//   SevaImage,
//   DevoteeImage,
//   BookingImage,
//   ReceiptImage,
//   EventImage,
//   SupportImage,
//   NotificationImage,
//   BlogImage,
//   CategoryImage,
// } from "../../../assets/Menu_Images"; // Assuming index file exports these icons
import { LogLevel, MenuAccess } from "../../../enums";
import { IMenu } from "./sideBarMenuTypes";
import sideBarMenuService from "./sideBarMenuService";

const SideBarMenu: React.FC = () => {
  const location = useLocation();
  const { setSideMenuOpen, accessDetails, setAccessDetailsToContext } =
    useAuth();
  const [selectedMenu, setSelectedMenu] = useState<IMenu | null>(null);
  const navigate = useNavigate();
  const { log } = useLogger();

  const getCombinedAccess = async () => {
    try {
      const response = await sideBarMenuService.getCombinedAccess();
      log(LogLevel.INFO, "SideBarMenu :: Combined Access", response.data.data);

      // Add static Tenant Management menu item (Commented out - to be managed by backend)
      // const tenantManagementMenu: IMenu = {
      //   menu_name: "Tenant Management",
      //   route_url: "/tenant-management",
      //   icon_class: "mdi mdi-office-building",
      //   access: MenuAccess.READ
      // };

      // const menuWithTenant = [...response.data.data, tenantManagementMenu];
      // setAccessDetailsToContext(menuWithTenant as any);

      setAccessDetailsToContext(response.data.data);
    } catch (error) {
      log(LogLevel.ERROR, "SideBarMenu :: Combined Access", error);
    }
  };

  useEffect(() => {
    if (!accessDetails) {
      getCombinedAccess();
    }
    // Commented out: Hardcoded tenant management menu item for cached data
    // else {
    //   // Check if Tenant Management is already in the menu
    //   const hasTenantManagement = accessDetails.some(
    //     (menu: IMenu) => menu.route_url === "/tenant-management"
    //   );

    //   // If not, add it
    //   if (!hasTenantManagement) {
    //     const tenantManagementMenu: IMenu = {
    //       menu_name: "Tenant Management",
    //       route_url: "/tenant-management",
    //       icon_class: "mdi mdi-office-building",
    //       access: MenuAccess.READ
    //     };
    //     const menuWithTenant = [...accessDetails, tenantManagementMenu];
    //     setAccessDetailsToContext(menuWithTenant as any);
    //   }
    // }
  }, [accessDetails]);

  useEffect(() => {
    if (accessDetails && accessDetails.length > 0 && !selectedMenu) {
      setSelectedMenu(accessDetails[0]);
      // Only auto-navigate on initial landing (root). Don't override explicit routes like /tenant-management
      if (location.pathname === "/" || location.pathname === "") {
        navigate(accessDetails[0].route_url);
      }
    }
  }, [accessDetails, selectedMenu, location.pathname, navigate]);
  return (
    <Box
      bg={"#fff"}
      className="w-full md:w-[20%] text-black h-screen fixed border-e border-gray-300 top-[85px] overflow-y-auto"
    >
      <Flex className="flex-col space-y-0.5">
        {accessDetails?.map((menu, index) => (
          <Link
            key={`menu-${index}`}
            onClick={() => setSideMenuOpen(false)}
            to={menu.route_url}
            state={{ access: menu.access, menu_name: menu.menu_name }}
            className={`flex items-center p-2 text-gray-900 transition-colors duration-300 !mt-0
              hover:bg-gray-100 active:bg-gray-200 border-b border-gray-300 ${location.pathname.includes(menu.route_url)
                ? "border-l-[6px] border-l-[#0000FF]"
                : "border-l-[6px] border-l-[#ffffff]"
              }`}
          >
            <i className={menu.icon_class + " text-lg"}></i>
            <span
              className={`ml-2 text-sm ${location.pathname.includes(menu.route_url)
                ? "text-[#0000FF] font-bold"
                : ""
                }`}
            >
              {menu.menu_name}
            </span>
          </Link>
        ))}
      </Flex>
    </Box>
  );
};

export default SideBarMenu;
