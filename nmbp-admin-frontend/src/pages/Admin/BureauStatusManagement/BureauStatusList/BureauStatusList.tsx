import React, { useEffect, useState } from "react";
import { debounce } from "lodash";
import searchIcon from "../../../../assets/search-icon.svg";
import { useLogger } from "../../../../hooks";
import { LogLevel } from "../../../../enums";

interface BureauStatus {
  id: number;
  name: string;
  email: string;
  date: string;
  designation: string;
  work_allocated: string;
  work_done: string;
}

const BureauStatusList = () => {
  const [statuses, setStatuses] = useState<BureauStatus[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const { log } = useLogger();

  const pageSize = 200;

  const mockStatuses: BureauStatus[] = [
    {
      id: 1,
      name: "Shubham",
      email: "Email.com",
      date: "11/10/2026",
      designation: "Nodal Office",
      work_allocated: "Work",
      work_done: "Done",
    },
    {
      id: 2,
      name: "Shubham",
      email: "Email.com",
      date: "11/10/2026",
      designation: "Nodal Office",
      work_allocated: "Work",
      work_done: "Done",
    },
    {
      id: 3,
      name: "Shubham",
      email: "Email.com",
      date: "11/10/2026",
      designation: "Nodal Office",
      work_allocated: "Work",
      work_done: "Done",
    },
    {
      id: 4,
      name: "Shubham",
      email: "Email.com",
      date: "11/10/2026",
      designation: "Nodal Office",
      work_allocated: "Work",
      work_done: "Done",
    },
    {
      id: 5,
      name: "Shubham",
      email: "Email.com",
      date: "11/10/2026",
      designation: "Nodal Office",
      work_allocated: "Work",
      work_done: "Done",
    },
    {
      id: 6,
      name: "Shubham",
      email: "Email.com",
      date: "11/10/2026",
      designation: "Nodal Office",
      work_allocated: "Work",
      work_done: "Done",
    },
    {
      id: 7,
      name: "Shubham",
      email: "Email.com",
      date: "11/10/2026",
      designation: "Nodal Office",
      work_allocated: "Work",
      work_done: "Done",
    },
    {
      id: 8,
      name: "Shubham",
      email: "Email.com",
      date: "11/10/2026",
      designation: "Nodal Office",
      work_allocated: "Work",
      work_done: "Done",
    },
    {
      id: 9,
      name: "Shubham",
      email: "Email.com",
      date: "11/10/2026",
      designation: "Nodal Office",
      work_allocated: "Work",
      work_done: "Done",
    },
    {
      id: 10,
      name: "Shubham",
      email: "Email.com",
      date: "11/10/2026",
      designation: "Nodal Office",
      work_allocated: "Work",
      work_done: "Done",
    },
  ];

  const handleListStatuses = () => {
    try {
      let filtered = mockStatuses;

      if (searchQuery) {
        filtered = filtered.filter(
          (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.designation.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      }

      setTotalCount(filtered.length);
      setStatuses(filtered);

      log(LogLevel.INFO, "BureauStatusList :: handleListStatuses", filtered);
    } catch (error) {
      log(LogLevel.ERROR, "BureauStatusList :: handleListStatuses", error);
    }
  };

  useEffect(() => {
    handleListStatuses();
  }, [currentPage, searchQuery]);

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
  const endIndex = Math.min(startIndex + pageSize, statuses.length);
  const paginatedStatuses = statuses.slice(startIndex, endIndex);

  return (
    <div className="w-full h-full p-2 overflow-y-auto">
      <div className="">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-[#374151]">
            Bureau Status Report
          </h2>
        </div>

        <div className="bg-white rounded-md p-5 border border-[#E5E7EB]">
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
          </div>

          <div className="max-h-[500px] mb-6 overflow-x-scroll overflow-y-auto rounded-lg border border-[#E5E7EB]">
            <table className="w-full min-w-max border-collapse">
              <thead style={{ backgroundColor: "#F9FAFB" }}>
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Designation
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Work Allocated
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Work Done
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedStatuses.length > 0 ? (
                  paginatedStatuses.map((status, index) => (
                    <tr
                      key={index}
                      className="bg-white hover:bg-[#F9FAFB] border-b border-[#E5E7EB] last:border-b-0"
                    >
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {status.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {status.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {status.date}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {status.designation}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {status.work_allocated}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {status.work_done}
                      </td>
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
                -
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
              of <span className="font-semibold">{totalCount}</span> items
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BureauStatusList;
