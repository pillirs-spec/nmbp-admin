import React, { useState, useEffect } from "react";
import { debounce } from "lodash";
import searchIcon from "../../assets/search-icon.svg";
import ExcelIcon from "../../assets/excel.svg";
import PrintIcon from "../../assets/print.svg";
import CopyIcon from "../../assets/copy.svg";
import PDFIcon from "../../assets/pdf.svg";
import nodalOfficersService from "../../pages/Admin/NodalOfficersManagement/NodalOfficersList/nodalOfficersService";
import { LogLevel } from "../../enums";
import { useLogger } from "../../hooks";

interface Officer {
  id: string;
  state_name: string;
  district_name: string;
  display_name: string;
  role_name: string;
  email_id: string;
  mobile_number: string;
}

interface IStates {
  state_id: string;
  state_name: string;
}

const StateNodalOfficersList = () => {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [selectedState, setSelectedState] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [stateList, setStateList] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const { log } = useLogger();

  // useEffect(() => {
  //   try {
  //     // Simulate API call - Replace with actual API
  //     setOfficers(mockOfficers ? mockOfficers : []);
  //     setTotalCount(1500); // Mock total count
  //     if (mockOfficers.length > 0) {
  //       setSelectedOfficer(mockOfficers[3]); // Set Azamgarh as default
  //     }
  //   } catch (error) {
  //     console.error("Error loading officers:", error);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [currentPage, searchQuery, filterState]);

  const handleSearch = (value: string) => {
    if (value.length > 0) {
      setSearchFilter(value);
      setCurrentPage(1);
    } else {
      setSearchFilter("");
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

  const getSnoList = async () => {
    // Simulate API call - Replace with actual API
    //  setOfficers(mockOfficers);
    //  setTotalCount(1500); // Mock total count
    //  if (mockOfficers.length > 0) {
    //    setSelectedOfficer(mockOfficers[3]); // Set Azamgarh as default
    //  }

    try {
      const payload = {
        pageSize,
        currentPage,
        selectedState,
        searchFilter,
      };
      const response =
        await nodalOfficersService.getStateNodalOfficersList(payload);
      log(LogLevel.INFO, "StateNodalOfficersList :: getSnoList", response.data);
      if (response.status === 200) {
        setOfficers(response.data.data.snoList);
        setTotalCount(response.data.data.snoCount);
      }
    } catch (error) {
      log(
        LogLevel.ERROR,
        "StateNodalOfficersList :: getSnoList :: Error fetching sno list",
        error,
      );
    }
  };

  const getStatesList = async () => {
    try {
      const response = await nodalOfficersService.getStatesList();
      log(
        LogLevel.INFO,
        "StateNodalOfficersList :: getStatesList",
        response.data,
      );
      if (response.status === 200) {
        setStateList(response.data.data);
      }
    } catch (error) {
      log(
        LogLevel.ERROR,
        "StateNodalOfficersList :: getStatesList :: Error fetching states list",
        error,
      );
    }
  };

  useEffect(() => {
    getSnoList();
  }, [currentPage, searchFilter, pageSize, selectedState]);

  useEffect(() => {
    getStatesList();
  }, []);

  return (
    <div className="w-full h-full p-2 overflow-y-auto">
      <div className="">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-[#374151]">
            List of SNO's
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
        {/* {selectedOfficer && (
          <div className="bg-white rounded-md p-5 border border-[#E5E7EB] mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-[#6B7280] font-medium mb-1">
                  State Name
                </p>
                <p className="text-sm text-[#374151]">
                  {selectedOfficer.state_name}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] font-medium mb-1">
                  District Name
                </p>
                <p className="text-sm text-[#374151]">
                  {selectedOfficer.district_name}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] font-medium mb-1">
                  Officer Name
                </p>
                <p className="text-sm text-[#374151]">
                  {selectedOfficer.display_name}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] font-medium mb-1">Email</p>
                <p className="text-sm text-[#374151]">
                  {selectedOfficer.email_id}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] font-medium mb-1">
                  Contact Number
                </p>
                <p className="text-sm text-[#374151]">
                  {selectedOfficer.mobile_number}
                </p>
              </div>
            </div>
          </div>
        )} */}

        {/* Table Container */}
        <div className="bg-white rounded-md p-5 border border-[#E5E7EB]">
          <div className="grid grid-cols-12 gap-4 mb-6">
            {/* Search Bar */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-6 border border-[#E5E7EB] rounded-md px-4 py-2 flex items-center bg-white">
              <input
                type="search"
                className="w-full outline-none text-[#6B7280] placeholder-[#6B7280] text-sm"
                placeholder="Search for SNO by name or state or district"
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
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 outline-none border border-[#E5E7EB] rounded-md  bg-white text-[#6B7280] cursor-pointer text-sm w-full md:w-48"
              >
                {stateList && stateList.length > 0 && (
                  <>
                    <option value="">All States</option>
                    {stateList.map((state: any, index) => (
                      <option key={index} value={state.state_id}>
                        {state.state_name}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="max-h-[500px] mb-6 overflow-x-scroll overflow-y-auto rounded-lg border border-[#E5E7EB]">
            <table className="w-full min-w-max border-collapse">
              <thead style={{ backgroundColor: "#F9FAFB" }}>
                <tr>
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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    State Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    District Name
                  </th>
                </tr>
              </thead>
              <tbody>
                {officers.length > 0 ? (
                  officers.map((officer, index) => (
                    <tr
                      key={index}
                      onClick={() => setSelectedOfficer(officer)}
                      className="bg-white hover:bg-[#F9FAFB] border-b border-[#E5E7EB] last:border-b-0 cursor-pointer"
                    >
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {officer.display_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {officer.role_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {officer.email_id}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {officer.mobile_number}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {officer.state_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {officer.district_name}
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
              <select
                className="text-[#374151] mx-1 px-2 py-1 border border-gray-300 rounded text-sm font-semibold cursor-pointer bg-white"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                <option>10</option>
                <option>50</option>
                <option>100</option>
              </select>
              of <span className="font-semibold">{officers?.length}</span> items
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

export default StateNodalOfficersList;
