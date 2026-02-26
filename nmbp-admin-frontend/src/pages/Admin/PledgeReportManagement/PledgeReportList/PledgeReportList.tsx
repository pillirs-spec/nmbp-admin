import React, { useEffect, useState } from "react";
import { debounce } from "lodash";
import searchIcon from "../../../../assets/search-icon.svg";
import { useLogger } from "../../../../hooks";
import { LogLevel } from "../../../../enums";
import PledgeContributionIcon from "../../../../assets/total_pledge.svg";

interface Pledge {
  id: number;
  pledge_type: string;
  name: string;
  age: number;
  mobile: string;
  email: string;
  state: string;
  district: string;
  pledge_date: string;
}

const PledgeReportList = () => {
  const [pledges, setPledges] = useState<Pledge[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [filterDistrict, setFilterDistrict] = useState<string>("All District");
  const [filterState, setFilterState] = useState<string>("Uttar Pradesh");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });
  const { log } = useLogger();

  const pageSize = 200;

  const mockPledges: Pledge[] = [
    {
      id: 1,
      pledge_type: "e-Pledge",
      name: "Shubham Sharma",
      age: 44,
      mobile: "9721947314",
      email: "Shubham@example.com",
      state: "Uttar Pradesh",
      district: "Lucknow",

      pledge_date: "2024-01-15",
    },
    {
      id: 2,
      pledge_type: "e-Pledge",
      name: "Ayush Yadav",
      age: 34,
      mobile: "9723171929",
      email: "Ayush@example.com",
      state: "Uttar Pradesh",
      district: "Kanpur",

      pledge_date: "2024-02-20",
    },
    {
      id: 3,
      pledge_type: "e-Pledge",
      name: "Ruchi Singh",
      age: 54,
      mobile: "9631618713",
      email: "Ruchi@example.com",
      state: "Uttar Pradesh",
      district: "Lucknow",

      pledge_date: "2024-03-10",
    },
    {
      id: 4,
      pledge_type: "e-Pledge",
      name: "Deepika Sharma",
      age: 42,
      mobile: "9971747134",
      email: "Deepika@example.com",
      state: "Uttar Pradesh",
      district: "Kanpur",

      pledge_date: "2024-04-05",
    },
    {
      id: 5,
      pledge_type: "e-Pledge",
      name: "Amarjit Sarkar",
      age: 45,
      mobile: "8891737145",
      email: "Amarjit@example.com",
      state: "Uttar Pradesh",
      district: "Lucknow",

      pledge_date: "2024-05-12",
    },
    {
      id: 6,
      pledge_type: "e-Pledge",
      name: "Govid Puri",
      age: 37,
      mobile: "8831983914",
      email: "Govind@example.com",
      state: "Uttar Pradesh",
      district: "Kanpur",

      pledge_date: "2024-06-18",
    },
    {
      id: 7,
      pledge_type: "e-Pledge",
      name: "Priya Verma",
      age: 28,
      mobile: "9876543210",
      email: "Priya@example.com",
      state: "Uttar Pradesh",
      district: "Lucknow",

      pledge_date: "2024-07-22",
    },
    {
      id: 8,
      pledge_type: "e-Pledge",
      name: "Rajesh Kumar",
      age: 52,
      mobile: "9111223344",
      email: "Rajesh@example.com",
      state: "Uttar Pradesh",
      district: "Kanpur",

      pledge_date: "2024-08-30",
    },
    {
      id: 9,
      pledge_type: "e-Pledge",
      name: "Neha Singh",
      age: 35,
      mobile: "8822334455",
      email: "Neha@example.com",
      state: "Uttar Pradesh",
      district: "Lucknow",

      pledge_date: "2024-09-14",
    },
    {
      id: 10,
      pledge_type: "e-Pledge",
      name: "Vikas Patel",
      age: 48,
      mobile: "9933445566",
      email: "Vikas@example.com",
      state: "Uttar Pradesh",
      district: "Kanpur",

      pledge_date: "2024-10-01",
    },
  ];

  const handleListPledges = () => {
    try {
      let filtered = mockPledges;

      if (searchQuery) {
        filtered = filtered.filter(
          (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.mobile.includes(searchQuery),
        );
      }

      setTotalCount(filtered.length);
      setPledges(filtered);

      log(LogLevel.INFO, "PledgeReportList :: handleListPledges", filtered);
    } catch (error) {
      log(LogLevel.ERROR, "PledgeReportList :: handleListPledges", error);
    }
  };

  useEffect(() => {
    handleListPledges();
  }, [currentPage, searchQuery, filterDistrict, filterState]);

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
  const endIndex = Math.min(startIndex + pageSize, pledges.length);
  const paginatedPledges = pledges.slice(startIndex, endIndex);

  return (
    <div className="w-full h-full p-2 overflow-y-auto">
      <div className="">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-[#374151]">
            All Pledge Report
          </h2>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-[#6B7280] mb-2">
                  Total Pledge
                </p>
                <p className="text-3xl font-semibold text-[#003366]">1000</p>
              </div>
              <img
                src={PledgeContributionIcon}
                alt="pledge-contribution-icon"
              />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-[#6B7280] mb-2">
                  Total e-Pledge
                </p>
                <p className="text-3xl font-semibold text-[#003366]">500</p>
              </div>
              <img
                src={PledgeContributionIcon}
                alt="pledge-contribution-icon"
              />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-[#6B7280] mb-2">
                  Total Recovered Pledge
                </p>
                <p className="text-3xl font-semibold text-[#003366]">500</p>
              </div>
              <img
                src={PledgeContributionIcon}
                alt="pledge-contribution-icon"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-md p-5 border border-[#E5E7EB]">
          <div className="grid grid-cols-12 gap-6 mb-6">
            {/* Search Bar */}
            <div className="col-span-12 md:col-span-6 lg:col-span-6 border border-[#E5E7EB] rounded-md px-4 py-2 flex items-center bg-[#F9FAFB]">
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

            <div className="relative col-span-12 md:col-span-6 lg:col-span-2">
              <select
                value={filterDistrict}
                onChange={(e) => {
                  setFilterDistrict(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 outline-none border border-[#E5E7EB] rounded-md appearance-none bg-white text-[#6B7280] cursor-pointer text-sm"
              >
                <option>All District</option>
                <option>Amroha</option>
                <option>Auraiya</option>
                <option>Ayodhya</option>
              </select>
            </div>

            <div className="relative col-span-12 md:col-span-6 lg:col-span-2">
              <select
                value={filterState}
                onChange={(e) => {
                  setFilterState(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 outline-none border border-[#E5E7EB] rounded-md appearance-none bg-white text-[#6B7280] cursor-pointer text-sm"
              >
                <option>Uttar Pradesh</option>
                <option>Maharashtra</option>
                <option>Karnataka</option>
              </select>
            </div>
            <div className="relative col-span-12 md:col-span-6 lg:col-span-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange({ ...dateRange, start: e.target.value })
                }
                className="w-full px-4 py-2 outline-none border border-[#E5E7EB] rounded-md bg-white text-[#6B7280] cursor-pointer text-sm focus:border-[#003366] transition"
                placeholder="Start Date"
              />
            </div>
          </div>

          <div className="max-h-[500px] mb-6 overflow-x-scroll overflow-y-auto rounded-lg border border-[#E5E7EB]">
            <table className="w-full min-w-max border-collapse">
              <thead style={{ backgroundColor: "#F9FAFB" }}>
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Pledge Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Name
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Age
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Mobile
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    State
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    District
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Pledge Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedPledges.length > 0 ? (
                  paginatedPledges.map((pledge, index) => (
                    <tr
                      key={index}
                      className="bg-white hover:bg-[#F9FAFB] border-b border-[#E5E7EB] last:border-b-0"
                    >
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {pledge.pledge_type}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {pledge.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151] text-center">
                        {pledge.age}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151] text-center">
                        {pledge.mobile}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {pledge.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {pledge.state}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {pledge.district}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {pledge.pledge_date}
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
                <option>200</option>
                <option>50</option>
                <option>100</option>
              </select>
              of{" "}
              <span className="font-medium text-[#374151]">{totalCount}</span>{" "}
              items
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PledgeReportList;
