import React, { useState, useEffect } from "react";
import { debounce } from "lodash";
import searchIcon from "../../../../assets/search-icon.svg";
import ExcelIcon from "../../../../assets/excel.svg";
import PrintIcon from "../../../../assets/print.svg";
import CopyIcon from "../../../../assets/copy.svg";
import PDFIcon from "../../../../assets/pdf.svg";
import { useLocation } from "react-router-dom";
import StateNodalOfficersList from "../../../../components/StateNodalOfficersList/SateNodalOfficersList";
import DistrictNodalOfficersList from "../../../../components/DistrictNodalOfficersList/DistrictNodalOfficersList";

interface Officer {
  id: string;
  stateName: string;
  districtName: string;
  officerName: string;
  designation: string;
  email: string;
  mobileNo: string;
  contactEmail: string;
}

interface NodalOfficersListProps {
  role: string | undefined;
}

const NodalOfficersList: React.FC<NodalOfficersListProps> = ({ role }) => {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [filterState, setFilterState] = useState<string>("Uttar Pradesh");
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const location = useLocation();

  const pageSize = 200;

  // Mock data - Replace with actual API call
  const mockOfficers: Officer[] = [
    {
      id: "1",
      stateName: "Uttar Pradesh",
      districtName: "Amroha",
      officerName: "Smt. Pankhuri Jain",
      designation: "N/A",
      email: "dswjpnagar@dirsamajkalyan.in",
      mobileNo: "9151935247",
      contactEmail: "dsawazamgarh@dirsamajkalyan.in",
    },
    {
      id: "2",
      stateName: "Uttar Pradesh",
      districtName: "Auraiya",
      officerName: "Ms. Indra Singh",
      designation: "N/A",
      email: "dswauraiya@dirsamajkalyan.in",
      mobileNo: "9151935183",
      contactEmail: "dswauraiya@dirsamajkalyan.in",
    },
    {
      id: "3",
      stateName: "Uttar Pradesh",
      districtName: "Ayodhya",
      officerName: "Shri Ramvijay Singh",
      designation: "N/A",
      email: "dswazamgarh@dirsama jkalyan.in",
      mobileNo: "9151935227",
      contactEmail: "dswazamgarh@dirsamajkalyan.in",
    },
    {
      id: "4",
      stateName: "Uttar Pradesh",
      districtName: "Azamgarh",
      officerName: "Shri Moti Lal",
      designation: "N/A",
      email: "dswazamgarh@dirsamajkalyan.in",
      mobileNo: "9151935167",
      contactEmail: "dswazamgarh@dirsamajkalyan.in",
    },
    {
      id: "5",
      stateName: "Uttar Pradesh",
      districtName: "Badaun",
      officerName: "Ms. Minakshi Verma",
      designation: "N/A",
      email: "dswbadaun@dirsamajkalyan.in",
      mobileNo: "9151935235",
      contactEmail: "dswbadaun@dirsamajkalyan.in",
    },
    {
      id: "6",
      stateName: "Uttar Pradesh",
      districtName: "Baghpat",
      officerName: "Smt. Rashmi Yadav",
      designation: "N/A",
      email: "dswbaghpat@dirsamajkalyan.in",
      mobileNo: "9151935263",
      contactEmail: "dswbaghpat@dirsamajkalyan.in",
    },
  ];

  useEffect(() => {
    try {
      // Simulate API call - Replace with actual API
      setOfficers(mockOfficers);
      setTotalCount(1500); // Mock total count
      if (mockOfficers.length > 0) {
        setSelectedOfficer(mockOfficers[3]); // Set Azamgarh as default
      }
    } catch (error) {
      console.error("Error loading officers:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchQuery, filterState]);

  const handleSearch = (value: string) => {
    if (value.length > 0) {
      setSearchQuery(value);
      setCurrentPage(1);
    } else {
      setSearchQuery("");
      setCurrentPage(1);
    }
  };

  const handleExport = () => {
    setShowExportModal(true);
  };

  const handleCloseExportModal = () => {
    setShowExportModal(false);
  };

  const handleExportCopy = () => {
    console.log("Copy data");
    setShowExportModal(false);
  };

  const handleExportPDF = () => {
    console.log("Export to PDF");
    setShowExportModal(false);
  };

  const handleExportPrint = () => {
    console.log("Print data");
    setShowExportModal(false);
  };

  const handleExportExcel = () => {
    console.log("Export to Excel");
    setShowExportModal(false);
  };

  const debouncedHandleSearch = debounce(handleSearch, 300);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, officers.length);
  const paginatedOfficers = officers.slice(startIndex, endIndex);

  useEffect(() => {
    console.log("Route changed to:", location.pathname);
    // Reset your state or fetch new data here
  }, [location]);

  return (
    <div className="">
      {location?.pathname === "/state-nodal-officers-list" ? (
        <StateNodalOfficersList />
      ) : (
        <DistrictNodalOfficersList />
      )}
    </div>
  );
};

export default NodalOfficersList;
