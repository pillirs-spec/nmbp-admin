import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { debounce } from "lodash";
import searchIcon from "../../../../assets/search-icon.svg";
import UploadIcon from "../../../../assets/upload.svg";
import { useNavigate } from "react-router-dom";

interface Activity {
  id: string;
  activity_type: string;
  activity_date: string;
  location: string;
  participants: number;
  media: string;
}

const DistrictActivityList = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [filterLocation, setFilterLocation] = useState<string>("All Location");
  const [filterActivity, setFilterActivity] = useState<string>("All Activity");
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const navigate = useNavigate();

  const pageSize = 200;

  // Mock data - Replace with actual API call
  const mockActivities: Activity[] = [
    {
      id: "1",
      activity_type: "Drawing Competition",
      activity_date: "15/01/2024",
      location: "Delhi Central District",
      participants: 152,
      media: "#",
    },
    {
      id: "2",
      activity_type: "Slogan Writing",
      activity_date: "18/01/2024",
      location: "Mumbai South",
      participants: 89,
      media: "#",
    },
    {
      id: "3",
      activity_type: "Rangoli Making",
      activity_date: "20/01/2024",
      location: "Bangalore North",
      participants: 203,
      media: "#",
    },
    {
      id: "4",
      activity_type: "Nukkad Natak",
      activity_date: "22/01/2024",
      location: "Chennai East",
      participants: 95,
      media: "#",
    },
    {
      id: "5",
      activity_type: "Marathon Run",
      activity_date: "25/01/2024",
      location: "Kolkata Central",
      participants: 320,
      media: "#",
    },
    {
      id: "6",
      activity_type: "Painting Exhibition",
      activity_date: "28/01/2024",
      location: "Pune West",
      participants: 145,
      media: "#",
    },
    {
      id: "7",
      activity_type: "Essay Writing",
      activity_date: "30/01/2024",
      location: "Hyderabad South",
      participants: 178,
      media: "#",
    },
    {
      id: "8",
      activity_type: "Cultural Program",
      activity_date: "02/02/2024",
      location: "Ahmedabad East",
      participants: 267,
      media: "#",
    },
  ];

  useEffect(() => {
    const handleListActivities = () => {
      try {
        // Simulate API call - Replace with actual API
        setActivities(mockActivities);
        setTotalCount(1500); // Mock total count
      } catch (error) {
        console.error("Error loading activities:", error);
      }
    };

    handleListActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchQuery, filterActivity, filterLocation]);

  const handleExport = () => {
    try {
      setIsExporting(true);
      // Add export logic here
      setTimeout(() => setIsExporting(false), 1000);
    } catch (error) {
      console.error("Error exporting:", error);
      setIsExporting(false);
    }
  };

  const handleSubmitActivity = () => {
    // Navigate to submit activity page
    window.location.href = "/admin/district/add-event";
  };

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

  const handleEventView = () => {
    navigate("/district-activities/view");
  };

  return (
    <div className="w-full h-full p-2 overflow-y-auto">
      <div className="">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-[#374151]">
            State/UT/ District Activity
          </h2>
          <div className="flex gap-4">
            {/* <button
              onClick={handleSubmitActivity}
              className="bg-[#003366] px-6 py-2 text-sm text-white font-[500] rounded-lg hover:opacity-90 transition"
            >
              Submit Activity
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
                value={filterLocation}
                onChange={(e) => {
                  setFilterLocation(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-3 outline-none border border-[#E5E7EB] rounded-md appearance-none bg-white text-[#6B7280] cursor-pointer text-sm"
              >
                <option>All Location</option>
                <option>Delhi Central District</option>
                <option>Mumbai South</option>
                <option>Bangalore North</option>
                <option>Chennai East</option>
                <option>Kolkata Central</option>
                <option>Pune West</option>
              </select>
            </div>

            <div className="relative col-span-12 sm:col-span-6 lg:col-span-2">
              <select
                value={filterActivity}
                onChange={(e) => {
                  setFilterActivity(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 !py-3 outline-none border border-[#E5E7EB] rounded-md appearance-none bg-white text-[#6B7280] cursor-pointer text-sm"
              >
                <option>All Activity</option>
                <option>Drawing Competition</option>
                <option>Slogan Writing</option>
                <option>Rangoli Making</option>
                <option>Nukkad Natak</option>
                <option>Marathon Run</option>
                <option>Painting Exhibition</option>
                <option>Essay Writing</option>
                <option>Cultural Program</option>
              </select>
            </div>
            <div className="relative col-span-12 sm:col-span-6 lg:col-span-2">
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="w-full px-6 py-2 flex items-center justify-center border-[1px] border-[#003366] text-sm text-[#003366] font-[500] rounded-lg hover:bg-gray-100 transition"
              >
                Export
                <img src={UploadIcon} alt="upload-icon" className="ml-1" />
              </button>
            </div>
          </div>

          <div className="max-h-[500px] mb-6 overflow-x-scroll overflow-y-auto rounded-lg border border-[#E5E7EB]">
            <table className="w-full min-w-max border-collapse">
              <thead style={{ backgroundColor: "#F9FAFB" }}>
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Activity Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Activity Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Location
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Participants
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    View
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
                        {activity.activity_type}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {activity.activity_date}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {activity.location}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151] text-center">
                        {activity.participants}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151] text-center">
                        <button
                          className="text-[#003366] text-sm font-medium"
                          onClick={handleEventView}
                        >
                          View ↗
                        </button>
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
    </div>
  );
};

export default DistrictActivityList;
