import React, { useEffect, useState } from "react";
import { debounce } from "lodash";
import searchIcon from "../../../../assets/search-icon.svg";
import { useLogger } from "../../../../hooks";
import { LogLevel } from "../../../../enums";
import PledgeContributionIcon from "../../../../assets/total_pledge.svg";
import { pledgeReportService } from "./pledgeReportService";

interface Pledge {
  id: number;
  pledge_type: string;
  full_name: string;
  age: number;
  mobile_number: string;
  email_id: string;
  state_name: string;
  district_name: string;
  date_updated: string;
}

const PledgeReportList = () => {
  const [pledges, setPledges] = useState<Pledge[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPledgeCount, setTotalPledgeCount] = useState<number>(0);
  const [totalPledgeTodayCount, setTotalPledgeTodayCount] = useState<number>(0);
  // const [totalRecoveredPledgeCount, setTotalRecoveredPledgeCount] =
  //   useState<number>(0);
  const [filterDistrict, setFilterDistrict] = useState<string>("All District");
  const [filterState, setFilterState] = useState<string>("Uttar Pradesh");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });
  const { log } = useLogger();

  const [pageSize, setPageSize] = useState<number>(10);

  const handleSearch = (value: string) => {
    if (value.length >= 3) {
      setSearchQuery(value);
      setCurrentPage(1);
    } else if (value.length === 0) {
      setSearchQuery("");
      setCurrentPage(1);
    }
  };

  const debouncedHandleSearch = debounce(handleSearch, 300);

  const getPledgesList = async () => {
    try {
      const payload = {
        pageSize,
        currentPage,
        searchFilter: searchQuery,
      };
      const response = await pledgeReportService.getAllPledgesList(payload);
      log(LogLevel.INFO, "PledgeReportList :: getPledgesList", response.data);
      if (response.status === 200) {
        setPledges(response.data.data.pledgesList);
        setTotalCount(
          Number(
            response.data.data.pledgesCount.replace(/,/g, "").replace(/"/g, ""),
          ),
        );
        setTotalPledgeCount(
          Number(
            response.data.data.totalPledgeCount
              .replace(/,/g, "")
              .replace(/"/g, ""),
          ),
        );
        setTotalPledgeTodayCount(
          Number(
            response.data.data.totalPledgeTodayCount
              .replace(/,/g, "")
              .replace(/"/g, "") || 0,
          ),
        );
        // setTotalRecoveredPledgeCount(
        //   Number(response.data.data.totalRecoveredPledgeCount || 0),
        // );
      }
    } catch (error) {
      log(LogLevel.ERROR, "PledgeReportList :: getPledgesList", error);
    }
  };

  useEffect(() => {
    getPledgesList();
  }, [pageSize, currentPage, searchQuery]);

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
                <p className="text-3xl font-semibold text-[#003366]">
                  {totalPledgeCount}
                </p>
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
                  Total Pledge Today
                </p>
                <p className="text-3xl font-semibold text-[#003366]">
                  {totalPledgeTodayCount}
                </p>
              </div>
              <img
                src={PledgeContributionIcon}
                alt="pledge-contribution-icon"
              />
            </div>
          </div>
          {/* <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-[#6B7280] mb-2">
                  Total Recovered Pledge
                </p>
                <p className="text-3xl font-semibold text-[#003366]">
                  {totalRecoveredPledgeCount}
                </p>
              </div>
              <img
                src={PledgeContributionIcon}
                alt="pledge-contribution-icon"
              />
            </div>
          </div> */}
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
                className="w-full px-4 py-2 outline-none border border-[#E5E7EB] rounded-md  bg-white text-[#6B7280] cursor-pointer text-sm"
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
                className="w-full px-4 py-2 outline-none border border-[#E5E7EB] rounded-md  bg-white text-[#6B7280] cursor-pointer text-sm"
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
                {pledges && pledges.length > 0 ? (
                  pledges.map((pledge, index) => (
                    <tr
                      key={index}
                      className="bg-white hover:bg-[#F9FAFB] border-b border-[#E5E7EB] last:border-b-0"
                    >
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {pledge.pledge_type ? pledge.pledge_type : "e-pledge"}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {pledge.full_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151] text-center">
                        {pledge.age}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151] text-center">
                        {pledge.mobile_number}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {pledge.email_id}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {pledge.state_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {pledge.district_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {pledge.date_updated
                          .split("T")[0]
                          .split("-")
                          .reverse()
                          .join("-")}
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
              <select
                className="text-[#374151] mx-1 px-2 py-1 border border-gray-300 rounded text-sm font-semibold cursor-pointer bg-white"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
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
