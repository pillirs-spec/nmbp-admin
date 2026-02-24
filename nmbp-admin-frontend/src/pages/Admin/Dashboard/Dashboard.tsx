import React from "react";
import DistrictDashboard from "../../../components/DistrictDashboard/DistrictDashboard";
import { useAuth } from "../../../hooks";
import StateDashboard from "../../../components/StateDashboard/StateDashboard";

const Dashboard: React.FC = () => {
  const { userDetails } = useAuth();
  return (
    <div className="p-5">
      {userDetails?.role_name?.toLowerCase().includes("district") ? (
        <DistrictDashboard />
      ) : (
        <StateDashboard />
      )}
    </div>
  );
};

export default Dashboard;
