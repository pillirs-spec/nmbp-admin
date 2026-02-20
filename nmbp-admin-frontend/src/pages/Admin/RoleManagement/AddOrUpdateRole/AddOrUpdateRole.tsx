import React, { useEffect, useState } from "react";
import { TextInput, Button, Checkbox, MantineProvider } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import addOrUpdateRoleValidation from "./addOrUpdateRoleValidation";
import { AddOrUpdateRoleProps, IDefaultAccess } from "./addOrUpdateRoleTypes";
import { LogLevel, MenuAccess, ToastType } from "../../../../enums";
import { addOrUpdateRoleService } from "./addOrUpdateRoleService";
import { useLogger, useToast } from "../../../../hooks";

const AddOrUpdateRole: React.FC<AddOrUpdateRoleProps> = ({ roleId, close }) => {
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [level, setLevel] = useState("");
  const { log } = useLogger();
  const { showToast } = useToast();
  const [admin, setAdmin] = useState("");

  const form = useForm({
    initialValues: {
      role_name: "",
      role_description: "",
      // level: "",
      permissions: [] as { menu_id: number; permission_id: number }[],
    },
    validate: yupResolver(addOrUpdateRoleValidation.validateAddOrUpdateRole()),
  });

  const [defaultAccessList, setDefaultAccessList] = useState<IDefaultAccess[]>(
    []
  );
  const [levels, setLevels] = useState<{ value: string; label: string }[]>([]);

  const handleChange = (name: string, value: string | number | boolean) => {
    form.setValues({
      ...form.values,
      [name]: value,
    });
  };

  const getDefaultAccessList = async () => {
    try {
      const response = await addOrUpdateRoleService.getDefaultAccessList();
      log(LogLevel.INFO, "RoleList :: getDefaultAccessList", response.data);
      if (response.data && response.data.data) {
        setDefaultAccessList(response.data.data);
      }
    } catch (error) {
      log(LogLevel.ERROR, "RoleList :: getDefaultAccessList", error);
    }
  };


  const getAccessList = async (roleId: number) => {
    try {
      const response = await addOrUpdateRoleService.getAccessList(roleId);
      log(LogLevel.INFO, "RoleList :: getAccessList", response.data);
      if (response.data && response.data.data) {
        const permissions: { menu_id: number; permission_id: number }[] = [];
        for (const access of response.data.data) {
          if (
            access.display_permission === 1 &&
            access.read_permission === "1"
          ) {
            permissions.push({ menu_id: access.menu_id, permission_id: 2 });
          } else if (
            access.display_permission === 1 &&
            access.write_permission === "1"
          ) {
            permissions.push({ menu_id: access.menu_id, permission_id: 1 });
          }
        }
        form.setValues((prevValues) => ({
          ...prevValues,
          permissions,
        }));
      }
    } catch (error) {
      log(LogLevel.ERROR, "RoleList :: getAccessList", error);
    }
  };

  const getRole = async (roleId: number) => {
    try {
      const response = await addOrUpdateRoleService.getRole(roleId);
      log(LogLevel.INFO, "RoleList :: getRole", response.data);
      if (response.data && response.data.data) {
        form.setValues({
          role_name: response.data.data.role_name,
          role_description: response.data.data.role_description,
          // level: response.data.data.level,
          permissions: response.data.data.permissions || [],
        });
      }
    } catch (error) {
      log(LogLevel.ERROR, "RoleList :: getRole", error);
    }
  };

  const listLevels = async () => {
    try {
      const response = await addOrUpdateRoleService.listLevels();
      log(LogLevel.INFO, "RoleList :: listLevels", response.data);
      if (response.data && response.data.data) {
        const transformedLevels = response.data.data.map((level: string) => ({
          label: level,
          value: level,
        }));
        setLevels(transformedLevels);
      }
    } catch (error) {
      log(LogLevel.ERROR, "RoleList :: listLevels", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        await getDefaultAccessList();
        await listLevels();

        if (roleId) {
          const [roleResponse, accessResponse] = await Promise.all([
            addOrUpdateRoleService.getRole(roleId),
            addOrUpdateRoleService.getAccessList(roleId),
          ]);

          log(LogLevel.INFO, "RoleList :: getRole", roleResponse.data);
          log(LogLevel.INFO, "RoleList :: getAccessList", accessResponse.data);

          if (roleResponse.data && roleResponse.data.data) {
            form.setValues({
              role_name: roleResponse.data.data.role_name,
              role_description: roleResponse.data.data.role_description,
              // level: roleResponse.data.data.level,
              permissions: roleResponse.data.data.permissions || [],
            });
          }

          if (accessResponse.data && accessResponse.data.data) {
            const permissions: { menu_id: number; permission_id: number }[] =
              [];
            for (const access of accessResponse.data.data) {
              if (
                access.display_permission === 1 &&
                access.read_permission === "1"
              ) {
                permissions.push({ menu_id: access.menu_id, permission_id: 2 });
              } else if (
                access.display_permission === 1 &&
                access.write_permission === "1"
              ) {
                permissions.push({ menu_id: access.menu_id, permission_id: 1 });
              }
            }

            form.setValues((prevValues) => ({
              ...prevValues,
              permissions,
            }));
          }
        }
      } catch (error) {
        log(LogLevel.ERROR, "AddOrUpdateRole :: fetchData", error);
      }
    };

    fetchData();
  }, [roleId]); 

  

  const getPermissions = (menuId: number) => {
    const access = form.values.permissions.find((p) => p.menu_id === menuId);
    return {
      read: access?.permission_id === 2,
      write: access?.permission_id === 1,
    };
  };

  const handlePermissionChange = (
    menuId: number,
    permission: MenuAccess,
    checked: boolean
  ) => {
    const permissionId = permission === MenuAccess.READ ? 2 : 1;
    const updatedPermissions = checked
      ? [
          ...form.values.permissions.filter((p) => p.menu_id !== menuId),
          { menu_id: menuId, permission_id: permissionId },
        ]
      : form.values.permissions.filter(
          (p) => !(p.menu_id === menuId && p.permission_id === permissionId)
        );

    form.setValues((prevValues) => ({
      ...prevValues,
      permissions: updatedPermissions,
    }));
  };

  const groupedAccessList = defaultAccessList.reduce(
    (acc: Record<number, IDefaultAccess[]>, item: IDefaultAccess) => {
      if (!acc[item.menu_id]) {
        acc[item.menu_id] = [];
      }
      acc[item.menu_id].push(item);
      return acc;
    },
    {}
  );

  const handleSubmit = async (values: {
    role_name: string;
    role_description: string;
    // level: string;
    permissions: { menu_id: number; permission_id: number }[];
  }) => {
    try {
      console.log(values);

      if (roleId) {
        const response = await addOrUpdateRoleService.updateRole(
          roleId,
          values.role_name,
          values.role_description,
          // values.level,
          values.permissions
        );
        if (response.status === 200)
          showToast("Role Updated", "Success", ToastType.SUCCESS);
      } else {
        const response = await addOrUpdateRoleService.addRole(
          values.role_name,
          values.role_description,
          // values.level,
          values.permissions
        );
        if (response.status === 200)
          showToast("Role Added", "Success", ToastType.SUCCESS);
        form.reset();
      }
      setTimeout(async () => {
        close();
      }, 1000);
    } catch (error) {
      log(LogLevel.ERROR, "AddOrUpdateRole :: handleSubmit", error);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div
        className="overflow-y-auto h-[calc(100vh-4rem)] p-4"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#ccc transparent",
        }}
      >
        <div className="mb-6">
          <label className="text-base">Role Name</label>
          <TextInput
            radius="md"
            placeholder="Enter Role Name"
            className="mt-2"
            {...form.getInputProps("role_name")}
          />
        </div>
        <div className="mb-6">
          <label className="text-base">Role Description</label>
          <TextInput
            radius="md"
            placeholder="Enter Role Description"
            className="mt-2"
            {...form.getInputProps("role_description")}
          />
        </div>
        {/* <div className="mb-6">
          <label className="text-base">Level</label>
          <TextInput
            radius="md"
            placeholder="Enter Level"
            className="mt-2"
            {...form.getInputProps("level")}
           
          />
        </div> */}
        <div className="mt-14">
          <div className="mb-6 relative border rounded-xl p-5 border-gray-300">
            <div className="absolute -top-3.5 left-32 bg-white px-2 ">
              Role Permissions
            </div>
            <div className="mb-6">
              {Object.entries(groupedAccessList).map(
                ([menuId, permissions]) => (
                  <div key={menuId} className="mb-4">
                    <div className="mb-2">{permissions[0]?.menu_name}</div>
                    <div key={menuId}>
                      <div className="flex justify-between mr-6">
                        <Checkbox
                          label={MenuAccess.READ}
                          checked={getPermissions(Number(menuId)).read}
                          onChange={(e) =>
                            handlePermissionChange(
                              Number(menuId),
                              MenuAccess.READ,
                              e.currentTarget.checked
                            )
                          }
                        />
                        <Checkbox
                          label={MenuAccess.WRITE}
                          checked={getPermissions(Number(menuId)).write}
                          onChange={(e) =>
                            handlePermissionChange(
                              Number(menuId),
                              MenuAccess.WRITE,
                              e.currentTarget.checked
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-5 w-[25.5rem] justify-center">
        <MantineProvider
          theme={{
            colors: {
              customRed: [
                "#ffe6e6",
                "#ffcccc",
                "#ff9999",
                "#ff6666",
                "#ff3333",
                "#ff1a1a",
                "#e60000",
                "#b30000",
                "#800000",
                "#4d0000",
              ],
            },
            primaryColor: "customRed",
          }}
        >
          <Button
            color="#0000FF"
            onClick={() => handleSubmit(form.values)}
            fullWidth
          >
            {roleId ? "Update Role" : "Add Role"}
          </Button>
        </MantineProvider>
      </div>
    </div>
  );
};

export default AddOrUpdateRole;