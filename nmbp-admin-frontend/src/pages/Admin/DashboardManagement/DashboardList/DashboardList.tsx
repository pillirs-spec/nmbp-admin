import React, { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import searchIcon from "../../../../assets/search-icon.svg";
import { useNavigate } from "react-router-dom";
import { LogLevel } from "../../../../enums";
import { useLogger, useToast } from "../../../../hooks";
import dashboardListService from "./dashboardListService";
import addEventService from "../../../../components/AddEvent/addEventService";
import { ToastType } from "../../../../enums";
import DeleteIcon from "../../../../assets/delete.svg";

interface Submission {
  event_id: string;
  state_name: string;
  district_name: string;
  activity_title: string;
  activity_date: string;
  number_of_participants: number;
  number_of_male: number;
  number_of_female: number;
  coordinating_department_name: string;
  number_of_educational_institutions: number;
  location: string;
  date_updated: string;
}

interface DashboardListProps {
  role: string;
}

const DashboardList: React.FC<DashboardListProps> = ({ role }) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    eventId: string;
    eventTitle: string;
  }>({ show: false, eventId: "", eventTitle: "" });
  const navigate = useNavigate();
  const { log } = useLogger();
  const { showToast } = useToast();

  const handleSearch = (value: string) => {
    if (value.length >= 3) {
      setSearchQuery(value);
      setCurrentPage(1);
    } else {
      setSearchQuery("");
      setCurrentPage(1);
    }
  };

  const handleAddEvent = () => {
    navigate("/dashboard/add-event");
  };

  const debouncedHandleSearch = debounce(handleSearch, 300);

  const handleDeleteClick = (eventId: string, eventTitle: string) => {
    setDeleteConfirm({ show: true, eventId, eventTitle });
  };

  const handleConfirmDelete = async () => {
    try {
      await addEventService.deleteEvent(deleteConfirm.eventId);
      showToast("Event deleted successfully", ToastType.SUCCESS);
      setDeleteConfirm({ show: false, eventId: "", eventTitle: "" });
      getAllEvents();
    } catch (error) {
      log(LogLevel.ERROR, "DashboardList :: handleConfirmDelete", error);
      showToast("Failed to delete event", ToastType.ERROR);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirm({ show: false, eventId: "", eventTitle: "" });
  };

  const getAllEvents = useCallback(async () => {
    try {
      const payload = {
        currentPage,
        pageSize,
        search: searchQuery,
      };
      const response = await dashboardListService.getAllEventsList(payload);
      if (response.status === 200) {
        setSubmissions(response.data.data.events);
        setTotalCount(response.data.data.totalCount);
      }
      log(LogLevel.INFO, "DashboardList :: getAllEvents", response);
    } catch (error) {
      log(LogLevel.ERROR, "DashboardList :: getAllEvents", error);
    }
  }, [currentPage, pageSize, searchQuery, log]);

  useEffect(() => {
    getAllEvents();
  }, [getAllEvents]);

  return (
    <div>
      {role}

      <div className="w-full h-full p-2 overflow-y-auto">
        <div className="">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-[#374151]">
                Dashboard
              </h2>
              {/* <p className="text-sm text-[#6B7280] mt-1 text-wrap">
                Last updated: 27 Aug 2024, 02:00 PM
              </p> */}
            </div>
            <button
              onClick={handleAddEvent}
              className="bg-[#003366] ml-2 text-nowrap px-4 py-2 text-sm text-white font-[500] rounded-lg hover:opacity-90 transition"
            >
              Add Event +
            </button>
          </div>

          {/* KPI Cards */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold text-[#6B7280] mb-2">
                    Activities Completed
                  </p>
                  <p className="text-3xl font-semibold text-[#003366]">252</p>
                  <p className="text-xs text-green-600 mt-2">
                    ↑ 14.5%{" "}
                    <span className="font-medium text-xs text-[#6B7280]">
                      vs last month
                    </span>
                  </p>
                </div>
                <img
                  src={AnnouncementIcon}
                  alt="announcement-icon"
                  className=""
                />
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold text-[#6B7280] mb-2">
                    Locations Covered
                  </p>
                  <p className="text-3xl font-semibold text-[#003366]">110</p>
                  <p className="text-xs text-red-600 mt-2">
                    ↓ 11.5%{" "}
                    <span className="font-medium text-xs text-[#6B7280]">
                      vs last month
                    </span>
                  </p>
                </div>
                <img src={LocationIcon} alt="location-icon" className="" />
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold text-[#6B7280] mb-2">
                    Total People Reached
                  </p>
                  <p className="text-3xl font-semibold text-[#003366]">
                    13,723
                  </p>
                  <p className="text-xs text-green-600 mt-2">
                    ↑ 14.5%{" "}
                    <span className="font-medium text-xs text-[#6B7280]">
                      vs last month
                    </span>
                  </p>
                </div>
                <img src={PrizeIcon} alt="prize-icon" className="" />
              </div>
            </div>
          </div> */}

          {/* My Submissions Section */}
          <div className="bg-white rounded-md p-5 border border-[#E5E7EB]">
            {/* <h3 className="text-lg font-semibold text-[#374151] mb-6">
              My Submissions
            </h3> */}

            <div className="grid grid-cols-12 gap-6 mb-6">
              {/* Search Bar */}
              <div className="col-span-6 border border-[#E5E7EB] rounded-md px-4 py-2 flex items-center bg-[#F9FAFB]">
                <input
                  type="search"
                  className="w-full outline-none text-[#6B7280] placeholder-[#6B7280] bg-[#F9FAFB] text-sm"
                  placeholder="Search by State, District, Activity..."
                  onChange={(e) => debouncedHandleSearch(e.target.value)}
                />
                <img
                  src={searchIcon}
                  alt="search-icon"
                  className="w-4 h-4 flex-shrink-0"
                />
              </div>

              {/* <div className="relative col-span-3">
                <select
                  value={filterLocation}
                  onChange={(e) => {
                    setFilterLocation(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2 outline-none border border-[#E5E7EB] rounded-md  bg-white text-[#6B7280] cursor-pointer text-sm"
                >
                  <option>All Location</option>
                  <option>Location 1</option>
                  <option>Location 2</option>
                  <option>Location 3</option>
                </select>
              </div> */}

              {/* <div className="relative col-span-6">
                <select
                  value={filterActivity}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2 outline-none border border-[#E5E7EB] rounded-md  bg-white text-[#6B7280] cursor-pointer text-sm"
                >
                  {submissions.length > 0 && (
                    <option value="">All Activity</option>
                  )}
                </select>
              </div> */}
            </div>

            <div className="max-h-[500px] mb-6 overflow-x-scroll overflow-y-auto rounded-lg border border-[#E5E7EB]">
              <table className="w-full min-w-max border-collapse">
                <thead style={{ backgroundColor: "#F9FAFB" }}>
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                      State
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                      District
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                      Activity
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                      Activity Date
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                      Participants
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                      Male Participants
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                      Female Participants
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                      Cordinating Department
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                      No. of Educational Institutions
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                      Location
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                      Created At
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.length > 0 ? (
                    submissions.map((submission, index) => (
                      <tr
                        key={index}
                        className="bg-white hover:bg-[#F9FAFB] border-b border-[#E5E7EB] last:border-b-0"
                      >
                        <td className="px-6 py-4 text-sm text-[#374151]">
                          {submission.state_name}
                        </td>

                        <td className="px-6 py-4 text-sm text-[#374151]">
                          {submission.district_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#374151]">
                          {submission.activity_title}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#374151]">
                          {submission.activity_date
                            .split("T")[0]
                            .split("-")
                            .reverse()
                            .join("-")}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#374151] text-center">
                          {submission.number_of_participants}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#374151] text-center">
                          {submission.number_of_male}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#374151] text-center">
                          {submission.number_of_female}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#374151] text-center">
                          {submission.coordinating_department_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#374151] text-center">
                          {submission.number_of_educational_institutions}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#374151] text-center">
                          {submission.district_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#374151] text-center">
                          {submission.date_updated
                            .split("T")[0]
                            .split("-")
                            .reverse()
                            .join("-")}
                        </td>
                        <td
                          className="px-6 py-4 text-sm text-[#003366] font-semibold cursor-pointer hover:text-[#002244]"
                          onClick={() =>
                            handleDeleteClick(
                              submission.event_id,
                              submission.activity_title,
                            )
                          }
                        >
                          <img
                            src={DeleteIcon}
                            alt="delete-icon"
                            className="w-4 h-4"
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={12}
                        className="px-6 py-2 text-center text-red-500 font-semibold animate-pulse"
                      >
                        No data found
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
                  +
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
                      Math.min(
                        Math.ceil(totalCount / pageSize),
                        currentPage + 1,
                      ),
                    )
                  }
                  disabled={currentPage === Math.ceil(totalCount / pageSize)}
                  className={`w-7 h-7 flex items-center justify-center text-sm font-bold transition ${
                    currentPage === Math.ceil(totalCount / pageSize)
                      ? " text-[#9161FF] cursor-not-allowed"
                      : "  hover:bg-pink-50"
                  }`}
                >
                  +
                </button>
              </div>
              <div className="text-sm text-[#6B7280]">
                Showing{" "}
                <select
                  value={pageSize}
                  className="text-[#374151] mx-1 px-2 py-1 border border-gray-300 rounded text-sm font-semibold cursor-pointer bg-white"
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={10}>10</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                of <span className="font-semibold">{totalCount}</span> items
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 p-6">
            <h2 className="text-xl font-semibold text-[#374151] mb-2">
              Delete Event
            </h2>
            <p className="text-sm text-[#6B7280] mb-6">
              Are you sure you want to delete the event{" "}
              <span className="font-bold text-red-500">
                {deleteConfirm.eventTitle}
              </span>
              <span className="ml-1">this action cannot be undone.</span>
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                className="p-2 border border-[#E5E7EB] text-[#374151] text-sm font-medium rounded hover:bg-[#F9FAFB] transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="p-2 bg-red-600 text-white font-medium text-sm rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardList;
