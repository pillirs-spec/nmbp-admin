import React, { useState, useEffect } from "react";
import { debounce } from "lodash";
import DeleteIcon from "../../../../assets/delete.svg";
import CopyIcon from "../../../../assets/copy.svg";
import ExcelIcon from "../../../../assets/excel.svg";
import PdfIcon from "../../../../assets/pdf.svg";
import PrintIcon from "../../../../assets/print.svg";
import { useNavigate } from "react-router-dom";
import feedbackService from "./feedbackService";
import { LogLevel, ToastType } from "../../../../enums";
import { useLogger, useToast } from "../../../../hooks";

interface Feedback {
  feedback_id: string;
  feedback: string;
  date_updated: string;
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
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { log } = useLogger();

  const handleSearch = (value: string) => {
    if (value.length >= 3) {
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

  const handleAddFeedback = () => {
    console.log("Navigating to Add Feedback form");
    navigate("/feedback/add");
    // Add navigation logic here (e.g., using React Router)
  };

  const getAllFeedbacksList = async () => {
    try {
      const payload = {
        pageSize,
        currentPage,
        searchFilter: searchQuery,
      };

      const response = await feedbackService.getAllFeedbacks(payload);
      if (response.status === 200) {
        setFeedbacks(response.data.data);
        setTotalCount(response.data.totalFeedbackCount);
      }
    } catch (error) {
      log(LogLevel.ERROR, "FeedbackList :: getAllFeedbacksList", error);
    }
  };

  console.log(feedbacks);

  useEffect(() => {
    getAllFeedbacksList();
  }, [pageSize, currentPage, searchQuery]);

  return (
    <div className="w-full h-full p-2 overflow-y-auto">
      <div className="p-5">
        <div className="mb-8 flex flex-col sm:flex-row sm:justify-between gap-4 items-center">
          <h2 className="text-2xl font-semibold text-[#374151]">
            Feedback & Grievance Redressal
          </h2>
          <button
            onClick={handleAddFeedback}
            className="bg-[#003366] ml-2 text-nowrap px-4 py-2 text-sm text-white font-[500] rounded-lg hover:opacity-90 transition"
          >
            Add Feedback +
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2 justify-start md:justify-end mb-5">
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
                    Feedback
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Posted On
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {feedbacks && feedbacks.length > 0 ? (
                  feedbacks.map((feedback, index) => (
                    <tr
                      key={feedback.feedback_id}
                      className="bg-white hover:bg-[#F9FAFB] border-b border-[#E5E7EB] last:border-b-0]"
                    >
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {index + 1}
                      </td>

                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {feedback.feedback}
                      </td>

                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {feedback.date_updated
                          .split("T")[0]
                          .split("-")
                          .reverse()
                          .join("-")}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        <button
                          onClick={() => handleDelete(feedback.feedback_id)}
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
                className="text-[#374151] mx-1 px-2 py-1 border border-gray-300 rounded text-sm font-semibold cursor-pointer bg-white"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={10}>10</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
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
