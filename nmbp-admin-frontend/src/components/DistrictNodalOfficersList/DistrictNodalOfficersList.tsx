import React, { useState, useEffect } from "react";
import { debounce } from "lodash";
import searchIcon from "../../assets/search-icon.svg";
import ExcelIcon from "../../assets/excel.svg";
import PrintIcon from "../../assets/print.svg";
import CopyIcon from "../../assets/copy.svg";
import PDFIcon from "../../assets/pdf.svg";

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

const DistrictNodalOfficersList = () => {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [filterState, setFilterState] = useState<string>("Uttar Pradesh");
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

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

  return (
    <div className="w-full h-full p-2 overflow-y-auto">
      <div className="">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-[#374151]">
            List of DNO's
          </h2>
          <button
            onClick={handleExport}
            className="px-6 py-2 flex items-center gap-2 bg-[#003366] text-white font-[500] rounded-lg hover:opacity-90 transition text-sm"
          >
            <span>Export</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2V14M12 14L7 9M12 14L17 9"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 16V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V16"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Selected Officer Info Card */}
        {selectedOfficer && (
          <div className="bg-white rounded-md p-5 border border-[#E5E7EB] mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-[#6B7280] font-medium mb-1">
                  State Name
                </p>
                <p className="text-sm text-[#374151]">
                  {selectedOfficer.stateName}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] font-medium mb-1">
                  District Name
                </p>
                <p className="text-sm text-[#374151]">
                  {selectedOfficer.districtName}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] font-medium mb-1">
                  Officer Name
                </p>
                <p className="text-sm text-[#374151]">
                  {selectedOfficer.officerName}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] font-medium mb-1">Email</p>
                <p className="text-sm text-[#374151]">
                  {selectedOfficer.contactEmail}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] font-medium mb-1">
                  Contact Number
                </p>
                <p className="text-sm text-[#374151]">
                  {selectedOfficer.mobileNo}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Table Container */}
        <div className="bg-white rounded-md p-5 border border-[#E5E7EB]">
          <div className="grid grid-cols-12 gap-4 mb-6">
            {/* Search Bar */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-6 border border-[#E5E7EB] rounded-md px-4 py-2 flex items-center bg-white">
              <input
                type="search"
                className="w-full outline-none text-[#6B7280] placeholder-[#6B7280] text-sm"
                placeholder="Search for DNO / District"
                onChange={(e) => debouncedHandleSearch(e.target.value)}
              />
              <img
                src={searchIcon}
                alt="search-icon"
                className="w-4 h-4 flex-shrink-0"
              />
            </div>

            {/* State Filter */}
            <div className="relative col-span-12 sm:col-span-6 lg:col-span-6 flex justify-end">
              <select
                value={filterState}
                onChange={(e) => {
                  setFilterState(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 outline-none border border-[#E5E7EB] rounded-md  bg-white text-[#6B7280] cursor-pointer text-sm w-full md:w-48"
              >
                <option>Uttar Pradesh</option>
                <option>Maharashtra</option>
                <option>Karnataka</option>
                <option>Tamil Nadu</option>
                <option>West Bengal</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="max-h-[500px] mb-6 overflow-x-scroll overflow-y-auto rounded-lg border border-[#E5E7EB]">
            <table className="w-full min-w-max border-collapse">
              <thead style={{ backgroundColor: "#F9FAFB" }}>
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    District Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Nodal Officer Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Designation
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Mobile No
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedOfficers.length > 0 ? (
                  paginatedOfficers.map((officer, index) => (
                    <tr
                      key={index}
                      onClick={() => setSelectedOfficer(officer)}
                      className="bg-white hover:bg-[#F9FAFB] border-b border-[#E5E7EB] last:border-b-0 cursor-pointer"
                    >
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {officer.districtName}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {officer.officerName}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {officer.designation}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {officer.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {officer.mobileNo}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-[#374151] font-semibold"
                    >
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Section */}
          <div className="flex justify-between items-center pt-6">
            <div className="flex gap-1 items-center">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-7 h-7 flex items-center justify-center text-sm font-bold text-[#9161FF] hover:text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                &lt;
              </button>

              {Array.from(
                { length: Math.min(6, Math.ceil(totalCount / pageSize)) },
                (_, i) => i + 1,
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-6 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition ${
                    currentPage === page
                      ? "border border-[#003366] text-[#374151]"
                      : "border border-gray-300 text-[#374151] hover:border-gray-400"
                  }`}
                >
                  {page}
                </button>
              ))}

              {Math.ceil(totalCount / pageSize) > 6 && (
                <>
                  <span className="text-gray-500 text-sm">...</span>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.ceil(totalCount / pageSize))
                    }
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-300 text-sm font-medium text-[#374151] hover:border-gray-400 transition"
                  >
                    {Math.ceil(totalCount / pageSize)}
                  </button>
                </>
              )}

              <button
                onClick={() =>
                  setCurrentPage(
                    Math.min(Math.ceil(totalCount / pageSize), currentPage + 1),
                  )
                }
                disabled={currentPage === Math.ceil(totalCount / pageSize)}
                className="w-7 h-7 flex items-center justify-center text-sm font-bold text-[#9161FF] hover:text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                &gt;
              </button>
            </div>
            <div className="text-sm text-[#6B7280]">
              Showing{" "}
              <select className="text-[#374151] mx-1 px-2 py-1 border border-gray-300 rounded text-sm font-semibold cursor-pointer bg-white">
                <option>200</option>
                <option>50</option>
                <option>100</option>
              </select>
              of <span className="font-semibold">{totalCount}</span> items
            </div>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6">
              <h3 className=" font-medium text-[#334155]">Export</h3>
              <button
                onClick={handleCloseExportModal}
                className="text-[#6B7280] hover:text-[#374151] transition"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="white"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-3 px-6 pb-6">
              <div className="grid grid-cols-4 gap-6">
                {/* Copy Option */}
                <button
                  onClick={handleExportCopy}
                  className="flex flex-col items-center justify-center hover:bg-[#F9FAFB] transition"
                >
                  <img src={CopyIcon} alt="copy" />
                </button>

                {/* PDF Option */}
                <button
                  onClick={handleExportPDF}
                  className="flex flex-col items-center justify-center hover:bg-[#F9FAFB] transition"
                >
                  <img src={PDFIcon} alt="pdf" />
                </button>

                {/* Print Option */}
                <button
                  onClick={handleExportPrint}
                  className="flex flex-col items-center justify-center hover:bg-[#F9FAFB] transition"
                >
                  <img src={PrintIcon} alt="print" />
                </button>

                {/* Excel Option */}
                <button
                  onClick={handleExportExcel}
                  className="flex flex-col items-center justify-center hover:bg-[#F9FAFB] transition"
                >
                  <img src={ExcelIcon} alt="excel" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistrictNodalOfficersList;
