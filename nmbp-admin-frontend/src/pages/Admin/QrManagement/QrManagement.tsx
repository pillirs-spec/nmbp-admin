import React, { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { MenuAccess } from "../../../enums";
import QrList from "./QrList/QrList";

const QrManagement = () => {
  const location = useLocation();
  const access = location.state ? location.state.access : MenuAccess.READ;
  const userListRef = useRef<{ refresh: () => void } | null>(null);

  const [userId, setUserId] = useState<number | null>(null);

  return (
    <div className="p-5 mt-40 md:mt-0">
      <QrList />
    </div>
  );
};

export default QrManagement;
