import React, { forwardRef, useEffect, useRef, useState } from "react";
import CommonDrawer from "../../../../components/common/Drawer/CommonDrawer";
import { IconX } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { Button, Switch, Tooltip } from "@mantine/core";
import CommonDataTable from "../../../../components/common/DataTable/CommonDataTable";
import { Column } from "../../../../components/common/DataTable/commonDataTableTypes";
import editIcon from "../../../../assets/User_List_Icons/edit.svg";
import deleteIcon from "../../../../assets/User_List_Icons/delete.svg";
import searchIcon from "../../../../assets/search-icon.svg";
import AddOrUpdateUser from "../AddOrUpdateUser/AddOrUpdateUser";
import usersListService from "./usersListService";
import { useLogger } from "../../../../hooks";
import { LogLevel } from "../../../../enums";
import { IUser, UsersListProps } from "./usersListTypes";
import { encDec } from "../../../../utils";
import { UserStatus } from "./usersListEnum";
import { debounce } from "lodash";

const UserList = forwardRef<
  {
    refresh: () => void;
  },
  UsersListProps
>(({ handleUpdateUser, access }, ref) => {
  const [opened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [usersCount, setUsersCount] = useState<number>(0);
  const [userId, setUserId] = useState<number | null>(null);
  const userListRef = useRef<{ refresh: () => void } | null>(null);

  const pageSize = 11;
  const { log } = useLogger();

  const handleEdit = (userId: number) => {
    openDrawer();
    setUserId(userId);
  };

  const closeSlider = () => {
    closeDrawer();
    setUserId(null);
    handleListUsers();
  };

  const handleClose = () => {
    setUserId(null);
    closeDrawer();
    userListRef.current?.refresh();
  };

  const columns: Column[] = [
    { label: "Name", key: "display_name" },
    { label: "Mobile Number", key: "mobile_number" },
    { label: "Email Address", key: "email_id" },
    { label: "Role", key: "role_name" },
    { label: "Actions", key: "actions" },
  ];

  const handleListUsers = async (defaultPage?: number) => {
    try {
      const response = await usersListService.listUsers(
        defaultPage || currentPage,
        pageSize,
        searchQuery,
      );
      log(LogLevel.INFO, "UsersList :: handleListUsers", response.data);

      setUsers(response.data.data.usersList);
      setUsersCount(response.data.data.usersCount);
    } catch (error) {
      log(LogLevel.ERROR, "UsersList :: handleListUsers", error);
    }
  };

  const handleUpdateUserStatus = async (userId: number, status: UserStatus) => {
    try {
      const encryptedUserId = encDec.encrypt(userId.toString());

      const response = await usersListService.updateUserStatus(
        encryptedUserId,
        status,
      );
      log(LogLevel.INFO, "UsersList :: handleUpdateUserStatus", response.data);
      // handleListUsers(1);
      setUsers((prevUsers) => {
        if (status === UserStatus.DELETED) {
          return prevUsers.filter((user) => user.user_id !== userId);
        } else {
          return prevUsers.map((user) =>
            user.user_id === userId ? { ...user, status } : user,
          );
        }
      });
    } catch (error) {
      log(LogLevel.ERROR, "UsersList :: handleUpdateUserStatus", error);
    }
  };

  useEffect(() => {
    handleListUsers();
  }, [currentPage, searchQuery]);

  const handleSearch = (value: string) => {
    if (value.length > 3) {
      setSearchQuery(value);
    } else if (value.length === 0) {
      setSearchQuery("");
    }
  };

  const debouncedHandleSearch = debounce(handleSearch, 300);

  return (
    <div className="">
      <CommonDrawer
        opened={opened}
        onClose={() => closeSlider()}
        closeButtonProps={{
          icon: <IconX size={20} stroke={2} />,
        }}
        title={userId ? "Update User" : "Add User"}
      >
        <AddOrUpdateUser user_id={userId} close={closeSlider} />
      </CommonDrawer>
      <h5 className="text-2xl font-bold text-[#374151]">User Management</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-0 mt-5">
        <div className="border border-[#C2C2C2] rounded-full px-3 py-1 flex items-center">
          <input
            type="search"
            className="w-full outline-none"
            placeholder="Search for Users"
            onChange={(e) => debouncedHandleSearch(e.target.value)}
          />
          <img src={searchIcon} alt="search-icon" />
        </div>
        <div className="flex justify-end">
          <Button style={{ background: "#003366" }} onClick={openDrawer}>
            Add User
          </Button>
        </div>
      </div>
      <CommonDataTable
        columns={columns}
        data={users}
        totalCount={usersCount}
        renderActions={(user: any) => (
          <div className="flex space-x-2">
            <Switch
              color="#14B584"
              size="sm"
              onChange={() =>
                handleUpdateUserStatus(
                  user.user_id,
                  [
                    UserStatus.ACTIVE,
                    UserStatus.LOGGED_IN,
                    UserStatus.LOGGED_OUT,
                  ].includes(user.status)
                    ? UserStatus.INACTIVE
                    : UserStatus.ACTIVE,
                )
              }
              checked={[
                UserStatus.ACTIVE,
                UserStatus.LOGGED_IN,
                UserStatus.LOGGED_OUT,
              ].includes(user.status)}
            />{" "}
            <Tooltip
              label="Edit"
              withArrow
              arrowPosition="center"
              color="#0000FF"
            >
              <img
                src={editIcon}
                alt="Edit"
                className="cursor-pointer"
                onClick={() => handleEdit(user.user_id)}
              />
            </Tooltip>
            <Tooltip
              label="Delete"
              withArrow
              arrowPosition="center"
              color="#0000FF"
              onClick={() =>
                handleUpdateUserStatus(user.user_id, UserStatus.DELETED)
              }
            >
              <img
                src={deleteIcon}
                alt="Delete"
                className="cursor-pointer"
                onClick={() =>
                  handleUpdateUserStatus(user.user_id, UserStatus.DELETED)
                }
              />
            </Tooltip>
          </div>
        )}
        pageSize={pageSize}
        isPagination={true}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
});
export default UserList;
