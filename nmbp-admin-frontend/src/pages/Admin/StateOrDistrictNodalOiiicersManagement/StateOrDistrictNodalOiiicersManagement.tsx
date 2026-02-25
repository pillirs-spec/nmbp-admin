import React from "react";
import { useAuth } from "../../../hooks";
import DistrictNodalOfficersList from "../../../components/DistrictNodalOfficersList/DistrictNodalOfficersList";
import SateNodalOfficersList from "../../../components/SateNodalOfficersList/SateNodalOfficersList";
import AllOfficersList from "../../../components/AllOfficersList/AllOfficersList";

const StateOrDistrictNodalOiiicersManagement = () => {
  const { userDetails } = useAuth();
  return (
    <div className="p-5 mt-40 md:mt-0">
      {userDetails?.role_name?.toLowerCase().includes("district") ? (
        <DistrictNodalOfficersList />
      ) : userDetails?.role_name?.toLowerCase().includes("state") ? (
        <SateNodalOfficersList />
      ) : (
        <AllOfficersList />
      )}
    </div>
  );
};

export default StateOrDistrictNodalOiiicersManagement;
