import React from "react";
import { useAuth } from "../../../hooks";
import DashboardList from "./DashboardList/DashboardList";

const DashboardManagement: React.FC = () => {
  const { userDetails } = useAuth();
  const role = userDetails?.role_name?.toLowerCase();
  return (
    <div className="p-5 mt-40 md:mt-0">
      <DashboardList role={role} />
    </div>
  );
};

export default DashboardManagement;
