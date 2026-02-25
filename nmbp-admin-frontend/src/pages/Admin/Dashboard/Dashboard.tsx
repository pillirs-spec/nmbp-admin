import React from "react";
import DistrictDashboard from "../../../components/DistrictDashboard/DistrictDashboard";
import { useAuth } from "../../../hooks";
import StateDashboard from "../../../components/StateDashboard/StateDashboard";
import AdminDashboard from "../../../components/AdminDashboard/AdminDashboard";

const Dashboard: React.FC = () => {
  const { userDetails } = useAuth();
  return (
    <div className="p-5 mt-40 md:mt-0">
      {userDetails?.role_name?.toLowerCase().includes("district") ? (
        <DistrictDashboard />
      ) : userDetails?.role_name?.toLowerCase().includes("state") ? (
        <StateDashboard />
      ) : (
        <AdminDashboard />
      )}
    </div>
  );
};

export default Dashboard;
