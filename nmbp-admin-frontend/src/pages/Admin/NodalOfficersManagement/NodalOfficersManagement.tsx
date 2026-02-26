import React from "react";
import NodalOfficersList from "./NodalOfficersList/NodalOfficersList";
import { useAuth } from "../../../hooks";

const NodalOfficersManagement = () => {
  const { userDetails } = useAuth();

  const role = userDetails?.role_name?.toLowerCase();
  return (
    <div className="p-5 mt-40 md:mt-0">
      <NodalOfficersList role={role} />
    </div>
  );
};

export default NodalOfficersManagement;
