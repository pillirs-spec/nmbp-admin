import React, { useEffect, useRef, useState } from "react";
import { Button, Pagination } from "@mantine/core";
import { debounce } from "lodash";
import searchIcon from "../../../../assets/search-icon.svg";
import { useLogger } from "../../../../hooks";
import { LogLevel } from "../../../../enums";
import UploadIcon from "../../../../assets/upload-icon.png";
import { Link } from "react-router-dom";

interface Activity {
  id: number;
  state_name: string;
  district_name: string;
  activity_name: string;
  total_activity: number;
  completed_activity: number;
  total_participants: number;
  males_females: string;
  date_of_activity: string;
  total_educational_institutes: number;
  department: string;
  location: string;
  media: string;
}

const StatesList = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [filterActivity, setFilterActivity] = useState<string>("All Activity");
  const [filterDistrict, setFilterDistrict] = useState<string>("All District");
  const [filterState, setFilterState] = useState<string>("Uttar Pradesh");
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const { log } = useLogger();

  const pageSize = 200;

  const mockActivities: Activity[] = [
    {
      id: 1,
      state_name: "Uttar Pradesh",
      district_name: "Amroha",
      activity_name: "Drawing Competition",
      total_activity: 44,
      completed_activity: 44,
      total_participants: 100,
      males_females: "60/40",
      date_of_activity: "2024-05-01",
      total_educational_institutes: 20,
      department: "Education",
      location: "Amroha City Park",
      media: "image1.jpg",
    },
    {
      id: 2,
      state_name: "Uttar Pradesh",
      district_name: "Auraiya",
      activity_name: "Slogan Writing",
      total_activity: 11,
      completed_activity: 11,
      total_participants: 50,
      males_females: "30/20",
      date_of_activity: "2024-05-03",
      total_educational_institutes: 10,
      department: "Education",
      location: "Auraiya Community Hall",
      media: "image2.jpg",
    },
    {
      id: 3,
      state_name: "Uttar Pradesh",
      district_name: "Ayodhya",
      activity_name: "Nukkad Natak",
      total_activity: 22,
      completed_activity: 22,
      total_participants: 80,
      males_females: "50/30",
      date_of_activity: "2024-05-05",
      total_educational_institutes: 15,
      department: "Culture",
      location: "Ayodhya Main Square",
      media: "image3.jpg",
    },
    {
      id: 4,
      state_name: "Uttar Pradesh",
      district_name: "Azamgarh",
      activity_name: "Marathon Run",
      total_activity: 45,
      completed_activity: 45,
      total_participants: 200,
      males_females: "120/80",
      date_of_activity: "2024-05-10",
      total_educational_institutes: 25,
      department: "Sports",
      location: "Azamgarh Stadium",
      media: "image4.jpg",
    },
    {
      id: 5,
      state_name: "Uttar Pradesh",
      district_name: "Badaun",
      activity_name: "Drawing Competition",
      total_activity: 66,
      completed_activity: 66,
      total_participants: 150,
      males_females: "90/60",
      date_of_activity: "2024-05-12",
      total_educational_institutes: 30,
      department: "Education",
      location: "Badaun Art Gallery",
      media: "image5.jpg",
    },
    {
      id: 6,
      state_name: "Uttar Pradesh",
      district_name: "Baghpat",
      activity_name: "Marathon Run",
      total_activity: 37,
      completed_activity: 37,
      total_participants: 120,
      males_females: "70/50",
      date_of_activity: "2024-05-15",
      total_educational_institutes: 18,
      department: "Sports",
      location: "Baghpat City Park",
      media: "image6.jpg",
    },

    {
      id: 7,
      state_name: "Uttar Pradesh",
      district_name: "Baghpat",
      activity_name: "Marathon Run",
      total_activity: 37,
      completed_activity: 37,
      total_participants: 120,
      males_females: "70/50",
      date_of_activity: "2024-05-15",
      total_educational_institutes: 18,
      department: "Sports",
      location: "Baghpat City Park",
      media: "image6.jpg",
    },
    {
      id: 8,
      state_name: "Uttar Pradesh",
      district_name: "Baghpat",
      activity_name: "Marathon Run",
      total_activity: 37,
      completed_activity: 37,
      total_participants: 120,
      males_females: "70/50",
      date_of_activity: "2024-05-15",
      total_educational_institutes: 18,
      department: "Sports",
      location: "Baghpat City Park",
      media: "image6.jpg",
    },

    {
      id: 9,
      state_name: "Uttar Pradesh",
      district_name: "Baghpat",
      activity_name: "Marathon Run",
      total_activity: 37,
      completed_activity: 37,
      total_participants: 120,
      males_females: "70/50",
      date_of_activity: "2024-05-15",
      total_educational_institutes: 18,
      department: "Sports",
      location: "Baghpat City Park",
      media: "image6.jpg",
    },

    {
      id: 10,
      state_name: "Uttar Pradesh",
      district_name: "Baghpat",
      activity_name: "Marathon Run",
      total_activity: 37,
      completed_activity: 37,
      total_participants: 120,
      males_females: "70/50",
      date_of_activity: "2024-05-15",
      total_educational_institutes: 18,
      department: "Sports",
      location: "Baghpat City Park",
      media: "image6.jpg",
    },

    {
      id: 11,
      state_name: "Uttar Pradesh",
      district_name: "Baghpat",
      activity_name: "Marathon Run",
      total_activity: 37,
      completed_activity: 37,
      total_participants: 120,
      males_females: "70/50",
      date_of_activity: "2024-05-15",
      total_educational_institutes: 18,
      department: "Sports",
      location: "Baghpat City Park",
      media: "image6.jpg",
    },
  ];

  const handleListActivities = () => {
    try {
      let filtered = mockActivities;

      if (filterState !== "Uttar Pradesh") {
        filtered = filtered.filter((item) => item.state_name === filterState);
      }

      if (filterDistrict !== "All District") {
        filtered = filtered.filter(
          (item) => item.district_name === filterDistrict,
        );
      }

      if (filterActivity !== "All Activity") {
        filtered = filtered.filter(
          (item) => item.activity_name === filterActivity,
        );
      }

      if (searchQuery) {
        filtered = filtered.filter(
          (item) =>
            item.state_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.district_name
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            item.activity_name
              .toLowerCase()
              .includes(searchQuery.toLowerCase()),
        );
      }

      setTotalCount(filtered.length);
      setActivities(filtered);

      log(LogLevel.INFO, "StatesList :: handleListActivities", filtered);
    } catch (error) {
      log(LogLevel.ERROR, "StatesList :: handleListActivities", error);
    }
  };

  const handleExport = () => {
    try {
      setIsExporting(true);

      const headers = [
        "State/UT Name",
        "District Name",
        "Activity",
        "Total Activity",
        "Completed Activity",
      ];
      const rows = activities.map((activity) => [
        activity.state_name,
        activity.district_name,
        activity.activity_name,
        activity.total_activity.toString(),
        activity.completed_activity.toString(),
      ]);

      const csvContent = [headers, ...rows]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "activity_report.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      log(LogLevel.INFO, "StatesList :: handleExport", "Export successful");
      setIsExporting(false);
    } catch (error) {
      log(LogLevel.ERROR, "StatesList :: handleExport", error);
      setIsExporting(false);
    }
  };

  const handleAddActivity = () => {
    try {
      log(
        LogLevel.INFO,
        "StatesList :: handleAddActivity",
        "Add Activity clicked",
      );
    } catch (error) {
      log(LogLevel.ERROR, "StatesList :: handleAddActivity", error);
    }
  };

  useEffect(() => {
    handleListActivities();
  }, [currentPage, searchQuery, filterActivity, filterDistrict, filterState]);

  const handleSearch = (value: string) => {
    if (value.length > 0) {
      setSearchQuery(value);
      setCurrentPage(1);
    } else {
      setSearchQuery("");
      setCurrentPage(1);
    }
  };

  const debouncedHandleSearch = debounce(handleSearch, 300);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, activities.length);
  const paginatedActivities = activities.slice(startIndex, endIndex);

  return (
    <div className="w-full h-full p-2 overflow-y-auto">
      <div className="">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-[#374151]">
            Activity Report
          </h2>
          <div className="flex gap-4">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="px-6 py-2 flex items-center border-[1px] border-[#003366] text-sm text-[#003366] font-[500] rounded-lg hover:bg-gray-100 transition"
            >
              Export
              <img src={UploadIcon} alt="upload-icon" className="ml-1" />
            </button>
            {/* <button
              onClick={handleAddActivity}
              className="bg-[#003366] px-4 py-2 text-sm text-white font-[500] rounded-lg hover:opacity-90 transition"
            >
              Add Activity +
            </button> */}
          </div>
        </div>

        <div className="bg-white rounded-md p-5 border border-[#E5E7EB]">
          <div className="grid grid-cols-12 gap-4 mb-6">
            {/* Search Bar */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-6 border border-[#E5E7EB] rounded-md px-4 py-2 flex items-center bg-white">
              <input
                type="search"
                className="w-full outline-none text-[#6B7280] placeholder-[#6B7280] text-sm"
                placeholder="Search for State, District or Activity"
                onChange={(e) => debouncedHandleSearch(e.target.value)}
              />
              <img
                src={searchIcon}
                alt="search-icon"
                className="w-4 h-4 flex-shrink-0"
              />
            </div>

            <div className="relative col-span-12 sm:col-span-6 lg:col-span-2">
              <select
                value={filterActivity}
                onChange={(e) => {
                  setFilterActivity(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 outline-none border border-[#E5E7EB] rounded-md  bg-white text-[#6B7280] cursor-pointer text-sm"
              >
                <option>All Activity</option>
                <option>Drawing Competition</option>
                <option>Slogan Writing</option>
                <option>Nukkad Natak</option>
                <option>Marathon Run</option>
              </select>
            </div>

            <div className="relative col-span-12 sm:col-span-6 lg:col-span-2">
              <select
                value={filterDistrict}
                onChange={(e) => {
                  setFilterDistrict(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 outline-none border border-[#E5E7EB] rounded-md  bg-white text-[#6B7280] cursor-pointer text-sm"
              >
                <option>All District</option>
                <option>Amroha</option>
                <option>Auraiya</option>
                <option>Ayodhya</option>
                <option>Azamgarh</option>
                <option>Badaun</option>
                <option>Baghpat</option>
              </select>
            </div>

            <div className="relative col-span-12 sm:col-span-6 lg:col-span-2">
              <select
                value={filterState}
                onChange={(e) => {
                  setFilterState(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 outline-none border border-[#E5E7EB] rounded-md  bg-white text-[#6B7280] cursor-pointer text-sm"
              >
                <option>Uttar Pradesh</option>
                <option>Maharashtra</option>
                <option>Karnataka</option>
                <option>Tamil Nadu</option>
                <option>West Bengal</option>
              </select>
            </div>
          </div>

          <div className="max-h-[500px] mb-6 overflow-x-scroll overflow-y-auto rounded-lg border border-[#E5E7EB]">
            <table className="w-full min-w-max border-collapse">
              <thead style={{ backgroundColor: "#F9FAFB" }}>
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    State/UT Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    District Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Activity
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Total Activity
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Completed Activity
                  </th>

                  <th className="px-6 py-4 text-center text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Total Participants
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Males/Females
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Date of Activity
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Total Educational Institutes
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Department
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Location
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Media
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedActivities.length > 0 ? (
                  paginatedActivities.map((activity, index) => (
                    <tr
                      key={index}
                      className="bg-white hover:bg-[#F9FAFB] border-b border-[#E5E7EB] last:border-b-0"
                    >
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {activity.state_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {activity.district_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {activity.activity_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151] text-center">
                        {activity.total_activity}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151] text-center">
                        {activity.completed_activity}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151] text-center">
                        {activity.total_participants}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151] text-center">
                        {activity.males_females}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151] text-center">
                        {activity.date_of_activity}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151] text-center">
                        {activity.total_educational_institutes}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151] text-center">
                        {activity.department}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151] text-center">
                        {activity.location}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151] text-center">
                        <Link
                          to={activity.media}
                          target="_blank"
                          className="text-[#003366] hover:underline font-[500]"
                        >
                          View ↗
                        </Link>
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
                    Math.min(Math.ceil(totalCount / pageSize), currentPage + 1),
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
              <select className="text-[#374151] mx-1 px-2 py-1 border border-gray-300 rounded text-sm font-semibold cursor-pointer bg-white">
                <option>2</option>
                <option>50</option>
                <option>200</option>
              </select>
              of <span className="font-semibold">{totalCount}</span> items
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatesList;
