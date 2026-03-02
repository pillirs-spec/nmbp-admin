import React, { useState, useEffect } from "react";
import { debounce } from "lodash";
import DeleteIcon from "../../../../assets/delete.svg";
import CopyIcon from "../../../../assets/copy.svg";
import ExcelIcon from "../../../../assets/excel.svg";
import PdfIcon from "../../../../assets/pdf.svg";
import PrintIcon from "../../../../assets/print.svg";

interface Feedback {
  id: string;
  email: string;
  websiteHelpful: string;
  feedbackText: string;
  category: string;
  issueDetails: string;
  satisfaction: string;
  createdAt: string;
}

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(25);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<string | null>(
    null,
  );

  // Mock data - Replace with actual API call
  const mockFeedbacks: Feedback[] = [
    {
      id: "1",
      email: "shishpalmandali974@mail.com",
      websiteHelpful: "Yes",
      feedbackText: "Appreciate work",
      category: "Others",
      issueDetails: "H.No.262 Sector 33 U.E. Karnal Haryana pin code 132001",
      satisfaction: "Satisfied",
      createdAt: "27 Oct 2025 10:43 AM",
    },
    {
      id: "2",
      email: "shivakumari8221@gmail.com",
      websiteHelpful: "Yes",
      feedbackText: "Thankyou",
      category: "Others",
      issueDetails: "Icds Narsapur",
      satisfaction: "Satisfied",
      createdAt: "26 Oct 2025 02:14 PM",
    },
    {
      id: "3",
      email: "anjaligolkar8@gmail.com",
      websiteHelpful: "Yes",
      feedbackText: "pm distic khargone tah zirniya plase rufata",
      category: "Civil Society Organisation Level",
      issueDetails: "Mp distic khargone tah zirniya place rufata",
      satisfaction: "Very Dissatisfied",
      createdAt: "6 Oct 2025 06:53 PM",
    },
    {
      id: "4",
      email: "venkatadri.divyala@gmail.com",
      websiteHelpful: "Yes",
      feedbackText:
        "I am r/o Hyd. I messaged you about my grand son's addiction to Alcohol & Drug. Write to me or Call",
      category: "Others",
      issueDetails:
        "I am r/o Hyd. I messaged you about my grand son's addiction to Alcohol & Drug. Write to me or Call me and help me please.",
      satisfaction: "Satisfied",
      createdAt: "3 Oct 2025 04:29 PM",
    },
    {
      id: "5",
      email: "somnath7791@gmail.com",
      websiteHelpful: "Maybe",
      feedbackText: "ok",
      category: "Others",
      issueDetails:
        "how can the dashboard show that they have covered more than 5 lakh + educational institutes while we only have approximately 139,936 much.",
      satisfaction: "Neutral",
      createdAt: "26 Sep 2025 01:07 PM",
    },
  ];

  useEffect(() => {
    try {
      // Simulate API call - Replace with actual API
      setFeedbacks(mockFeedbacks);
      setTotalCount(150); // Mock total count
    } catch (error) {
      console.error("Error loading feedbacks:", error);
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
    setSelectedFeedbackId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    console.log("Deleting feedback:", selectedFeedbackId);
    // Add delete API call here
    setShowDeleteModal(false);
    setSelectedFeedbackId(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedFeedbackId(null);
  };

  const handleExport = (type: string) => {
    console.log(`Exporting as ${type}`);
    // Add export logic here
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, feedbacks.length);
  const paginatedFeedbacks = feedbacks.slice(startIndex, endIndex);

  return (
    <div className="w-full h-full p-2 overflow-y-auto">
      <div className="p-5">
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <h2 className="text-2xl font-semibold text-[#374151]">
            Feedback & Grievance Redressal
          </h2>
          <div className="flex flex-wrap items-center gap-2 justify-start md:justify-end">
            <button onClick={() => handleExport("copy")} className="">
              <img src={CopyIcon} alt="copy" className="w-16 h-16" />
            </button>
            <button onClick={() => handleExport("excel")} className="">
              <img src={ExcelIcon} alt="excel" className="w-16 h-16" />
            </button>
            <button onClick={() => handleExport("pdf")} className="">
              <img src={PdfIcon} alt="pdf" className="w-16 h-16" />
            </button>
            <button onClick={() => handleExport("print")} className="">
              <img src={PrintIcon} alt="print" className="w-16 h-16" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-md border border-[#E5E7EB]">
          {/* Export Buttons and Controls */}

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
                    S.No.
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Did you find the website/dashboard helpful?
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Please provide your valuable feedback on the
                    website/dashboard?
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Details of the issues to be addressed
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    How satisfied are you with the website/dashboard
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Created At
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedFeedbacks.length > 0 ? (
                  paginatedFeedbacks.map((feedback, index) => (
                    <tr
                      key={feedback.id}
                      className="bg-white hover:bg-[#F9FAFB] border-b border-[#E5E7EB] last:border-b-0]"
                    >
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {feedback.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {feedback.websiteHelpful}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {feedback.feedbackText}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {feedback.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {feedback.issueDetails}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {feedback.satisfaction}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {feedback.createdAt}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        <button
                          onClick={() => handleDelete(feedback.id)}
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
                      colSpan={9}
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

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
              <h3 className="text-lg font-semibold text-[#374151] mb-4">
                Confirm Delete
              </h3>
              <p className="text-sm text-[#6B7280] mb-6">
                Are you sure you want to delete this feedback? This action
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

export default FeedbackList;
