import React, { useState, useEffect } from "react";
import { debounce } from "lodash";
import DeleteIcon from "../../../../assets/delete.svg";
import EyeIcon from "../../../../assets/eye-icon.svg";

interface ForumQuestion {
  id: string;
  name: string;
  email: string;
  contact: string;
  question: string;
  answer: string;
  postedAt: string;
  assignTo: string;
  status: "approved" | "pending" | "none";
}

const ForumQuestionsList = () => {
  const [questions, setQuestions] = useState<ForumQuestion[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    null,
  );
  const [checkedStatuses, setCheckedStatuses] = useState<{
    [key: string]: boolean;
  }>({});

  // Mock data - Replace with actual API call
  const mockQuestions: ForumQuestion[] = [
    {
      id: "1",
      name: "Kafi",
      email: "sa@28576858.com",
      contact: "9728576858",
      question: "Referals Bana can...",
      answer: "",
      postedAt: "11 Nov 2025 06:45 AM",
      assignTo: "Dr Krishan Sony",
      status: "approved",
    },
    {
      id: "2",
      name: "SANGADA DINESHBHAI SOMABHAI",
      email: "dineshsangada033@gmail.com",
      contact: "7990598543",
      question: "Nasha Muktl...",
      answer: "",
      postedAt: "10 Nov 2025 07:31 PM",
      assignTo: "--Please Assign--",
      status: "pending",
    },
    {
      id: "3",
      name: "Dinesh Devidas Rathod",
      email: "dinabanjara88@gmail.com",
      contact: "8999537262",
      question: "My name is Dinesh rathod...",
      answer: "",
      postedAt: "8 Nov 2025 11:12 AM",
      assignTo: "--Please Assign--",
      status: "pending",
    },
    {
      id: "4",
      name: "Dinesh Devidas Rathod",
      email: "dinabanjara88@gmail.com",
      contact: "8999537262",
      question: "My name is Dinesh devidas rathod...",
      answer: "",
      postedAt: "8 Nov 2025 11:11 AM",
      assignTo: "--Please Assign--",
      status: "pending",
    },
    {
      id: "5",
      name: "Sandeep Kaur",
      email: "sandeepkaur082007@gmail.com",
      contact: "8146254790",
      question: "URZ6rj...",
      answer: "",
      postedAt: "7 Nov 2025 03:27 PM",
      assignTo: "--Please Assign--",
      status: "pending",
    },
    {
      id: "6",
      name: "Sandeep Kaur",
      email: "sandeepkaur082007@gmail.com",
      contact: "8146254790",
      question: "Vpem9t...",
      answer: "",
      postedAt: "7 Nov 2025 03:20 PM",
      assignTo: "--Please Assign--",
      status: "pending",
    },
    {
      id: "7",
      name: "ESAKIAMMAL",
      email: "indhu309398@gmail.com",
      contact: "8015567313",
      question: "xxs link...",
      answer: "xxs link des xxs link des...",
      postedAt: "7 Nov 2025 06:39 AM",
      assignTo: "Dr Seema P Uthaman",
      status: "approved",
    },
    {
      id: "8",
      name: "Lucky Mandoli",
      email: "luckymandloi683@gmail.com",
      contact: "6264658163",
      question: ">alert(document.domain)...",
      answer: "",
      postedAt: "6 Nov 2025",
      assignTo: "Dr Seema P Uthaman",
      status: "pending",
    },
  ];

  useEffect(() => {
    try {
      // Simulate API call - Replace with actual API
      setQuestions(mockQuestions);
      setTotalCount(150); // Mock total count
    } catch (error) {
      console.error("Error loading questions:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchQuery, pageSize]);

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

  const handleDelete = (id: string) => {
    setSelectedQuestionId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    console.log("Deleting question:", selectedQuestionId);
    // Add delete API call here
    setShowDeleteModal(false);
    setSelectedQuestionId(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedQuestionId(null);
  };

  const handleCheckboxChange = (id: string) => {
    setCheckedStatuses((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, questions.length);
  const paginatedQuestions = questions.slice(startIndex, endIndex);

  return (
    <div className="w-full h-full p-2 overflow-y-auto">
      <div className="p-5">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#374151]">
            Forum Questions List
          </h2>
        </div>

        <div className="bg-white rounded-md border border-[#E5E7EB]">
          {/* Search Bar */}
          <div className="flex items-center gap-2 p-5 max-w-2xl">
            <div className="w-full border border-[#E5E7EB] rounded px-3 py-2 flex items-center bg-white max-w-3xl">
              <input
                type="search"
                className="w-full outline-none text-[#6B7280] placeholder-[#6B7280] text-sm"
                placeholder="Search..."
                onChange={(e) => debouncedHandleSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-max border-collapse">
              <thead style={{ backgroundColor: "#F9FAFB" }}>
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    S.No
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Question
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Answer
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Posted at
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Assign to
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedQuestions.length > 0 ? (
                  paginatedQuestions.map((question, index) => (
                    <tr
                      key={question.id}
                      className="bg-white hover:bg-[#F9FAFB] border-b border-[#E5E7EB] last:border-b-0]"
                    >
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {question.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {question.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {question.contact}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151] truncate">
                        {question.question}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151] truncate">
                        {question.answer || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151] whitespace-nowrap">
                        {question.postedAt}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <select
                          defaultValue={question.assignTo}
                          className="px-2 py-1 border border-gray-300 rounded text-sm outline-none focus:border-[#003366] bg-white w-full"
                        >
                          <option value="--Please Assign--">
                            --Please Assign--
                          </option>
                          <option value="Dr Krishan Sony">
                            Dr Krishan Sony
                          </option>
                          <option value="Dr Seema P Uthaman">
                            Dr Seema P Uthaman
                          </option>
                          <option value="Dr Other">Dr Other</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={checkedStatuses[question.id] || false}
                            onChange={() => handleCheckboxChange(question.id)}
                            className="w-5 h-5 cursor-pointer !border-2 !border-[#27AE60] bg-white rounded outline-none transition !accent-[#27AE60]"
                            style={{
                              accentColor: "#27AE60",
                            }}
                          />
                        </label>
                      </td>
                      <td className="px-6 py-4 text-sm flex gap-3">
                        <button
                          onClick={() => handleDelete(question.id)}
                          className="text-[#E91E63] hover:text-[#C2185B] transition"
                        >
                          <img src={EyeIcon} alt="Delete" className="" />
                        </button>
                        <button
                          onClick={() => handleDelete(question.id)}
                          className="text-[#E91E63] hover:text-[#C2185B] transition"
                        >
                          <img src={DeleteIcon} alt="Delete" className="" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-6 py-8 text-center text-[#374151] font-semibold"
                    >
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-5 flex justify-between items-center border-t border-[#E5E7EB]">
            <div className="flex gap-1 items-center">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-7 h-7 flex items-center justify-center text-sm font-bold text-[#9161FF] hover:text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                +
              </button>

              {Array.from(
                { length: Math.min(5, Math.ceil(totalCount / pageSize)) },
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

              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-7 h-7 flex items-center justify-center text-sm font-bold text-[#9161FF] hover:text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                +
              </button>
            </div>
            <div className="text-sm text-[#6B7280]">
              Showing{" "}
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="text-[#374151] mx-1 px-2 py-1 border border-gray-300 rounded text-sm font-semibold cursor-pointer bg-white"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
              of{" "}
              <span className="font-medium text-[#374151]">{totalCount}</span>{" "}
              items
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
              <h3 className="text-lg font-semibold text-[#374151] mb-4">
                Confirm Delete
              </h3>
              <p className="text-sm text-[#6B7280] mb-6">
                Are you sure you want to delete this forum question? This action
                cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCancelDelete}
                  className="px-6 py-2 border border-[#6B7280] text-[#6B7280] font-medium rounded-lg hover:bg-gray-50 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-6 py-2 bg-[#E91E63] text-white font-medium rounded-lg hover:opacity-90 transition text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumQuestionsList;
