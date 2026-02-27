import React, { useEffect, useState } from "react";
import { debounce } from "lodash";
import searchIcon from "../../../../assets/search-icon.svg";
import AnnouncementIcon from "../../../../assets/announcement.svg";
import LocationIcon from "../../../../assets/location.svg";
import PrizeIcon from "../../../../assets/prize.svg";
import { useNavigate } from "react-router-dom";
import { LogLevel } from "../../../../enums";
import { useLogger } from "../../../../hooks";

interface Submission {
  id: number;
  state_name: string;
  district_name: string;
  activity: string;
  activity_date: string;
  participants: number;
  male_participants: number;
  female_participants: number;
  cordinating_department: string;
  no_of_educational_institutions: number;
  location: string;
  created_at: string;
}

interface DashboardListProps {
  role: string;
}

const DashboardList: React.FC<DashboardListProps> = ({ role }) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [filterLocation, setFilterLocation] = useState<string>("All Location");
  const [filterActivity, setFilterActivity] = useState<string>("All Activity");
  const navigate = useNavigate();
  const { log } = useLogger();

  const pageSize = 150;

  const mockSubmissions: Submission[] = [
    {
      id: 1,
      state_name: "Uttar Pradesh",
      district_name: "Lucknow",
      activity: "Community Awareness",
      activity_date: "2024-01-15",
      participants: 45,
      male_participants: 28,
      female_participants: 17,
      cordinating_department: "Department of Social Welfare",
      no_of_educational_institutions: 5,
      location: "Community Center, Lucknow",
      created_at: "2024-01-16T10:30:00Z",
    },
    {
      id: 2,
      state_name: "Maharashtra",
      district_name: "Pune",
      activity: "Training Program",
      activity_date: "2024-02-20",
      participants: 62,
      male_participants: 35,
      female_participants: 27,
      cordinating_department: "Department of Health",
      no_of_educational_institutions: 3,
      location: "Training Hall, Pune",
      created_at: "2024-02-21T14:45:00Z",
    },
    {
      id: 3,
      state_name: "Tamil Nadu",
      district_name: "Chennai",
      activity: "Health Camp",
      activity_date: "2024-03-10",
      participants: 38,
      male_participants: 22,
      female_participants: 16,
      cordinating_department: "Department of Health",
      no_of_educational_institutions: 4,
      location: "Community Hall, Chennai",
      created_at: "2024-03-11T09:15:00Z",
    },
    {
      id: 4,
      state_name: "West Bengal",
      district_name: "Kolkata",
      activity: "Educational Workshop",
      activity_date: "2024-04-05",
      participants: 55,
      male_participants: 31,
      female_participants: 24,
      cordinating_department: "Department of Education",
      no_of_educational_institutions: 6,
      location: "Education Center, Kolkata",
      created_at: "2024-04-06T11:00:00Z",
    },
    {
      id: 5,
      state_name: "Rajasthan",
      district_name: "Jaipur",
      activity: "Women Empowerment",
      activity_date: "2024-05-12",
      participants: 78,
      male_participants: 28,
      female_participants: 50,
      cordinating_department: "Department of Social Welfare",
      no_of_educational_institutions: 2,
      location: "Community Center, Jaipur",
      created_at: "2024-05-13T13:30:00Z",
    },
  ];

  const handleListSubmissions = () => {
    try {
      let filtered = mockSubmissions;

      if (searchQuery) {
        filtered = filtered.filter((item) =>
          item.activity.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      }

      setTotalCount(filtered.length);
      setSubmissions(filtered);

      log(
        LogLevel.INFO,
        "DistrictDashboard :: handleListSubmissions",
        filtered,
      );
    } catch (error) {
      log(LogLevel.ERROR, "DistrictDashboard :: handleListSubmissions", error);
    }
  };

  useEffect(() => {
    handleListSubmissions();
  }, [currentPage, searchQuery, filterLocation, filterActivity]);

  const handleSearch = (value: string) => {
    if (value.length > 0) {
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

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, submissions.length);
  const paginatedSubmissions = submissions.slice(startIndex, endIndex);

  const totalSubmissions = submissions.length;
  const totalLocations = 110;
  const totalPeopleReached = 13723;

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
                  placeholder="Search"
                  onChange={(e) => debouncedHandleSearch(e.target.value)}
                />
                <img
                  src={searchIcon}
                  alt="search-icon"
                  className="w-4 h-4 flex-shrink-0"
                />
              </div>

              <div className="relative col-span-3">
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
              </div>

              <div className="relative col-span-3">
                <select
                  value={filterActivity}
                  onChange={(e) => {
                    setFilterActivity(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2 outline-none border border-[#E5E7EB] rounded-md  bg-white text-[#6B7280] cursor-pointer text-sm"
                >
                  <option>All Activity</option>
                  <option>Community Awareness</option>
                  <option>Training Program</option>
                  <option>Health Camp</option>
                  <option>Educational Workshop</option>
                  <option>Women Empowerment</option>
                </select>
              </div>
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
                  {paginatedSubmissions.length > 0 ? (
                    paginatedSubmissions.map((submission, index) => (
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
                          {submission.activity}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#374151]">
                          {submission.activity_date}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#374151] text-center">
                          {submission.participants}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#374151] text-center">
                          {submission.male_participants}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#374151] text-center">
                          {submission.female_participants}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#374151] text-center">
                          {submission.cordinating_department}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#374151] text-center">
                          {submission.no_of_educational_institutions}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#374151] text-center">
                          {submission.location}
                        </td>
                        <td>{submission.created_at}</td>
                        {/* <td className="px-6 py-4 text-sm text-[#003366] font-semibold cursor-pointer hover:text-[#002244]">
                          View
                        </td> */}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
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
    </div>
  );
};

export default DashboardList;
