import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { debounce } from "lodash";
import searchIcon from "../../../../assets/search-icon.svg";
import { useNavigate } from "react-router-dom";

interface Document {
  id: string;
  documentName: string;
  uploadedOn: string;
  uploadedBy: string;
  type: string;
}

const ImportantDocumentsList = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const navigate = useNavigate();

  const pageSize = 200;

  // Mock data - Replace with actual API call
  const mockDocuments: Document[] = [
    {
      id: "1",
      documentName: "DO Letter to DNOs",
      uploadedOn: "09-10-2025 02:10 PM",
      uploadedBy: "Deepshikha Goel (Admin)",
      type: "letter",
    },
    {
      id: "2",
      documentName: "SOP for the MyGov Competitions",
      uploadedOn: "09-10-2025 02:10 PM",
      uploadedBy: "Deepshikha Goel (Admin)",
      type: "sop",
    },
    {
      id: "3",
      documentName: "DO Letter Regarding the Competitions on MyGov",
      uploadedOn: "09-10-2025 02:10 PM",
      uploadedBy: "Deepshikha Goel (Admin)",
      type: "letter",
    },
    {
      id: "4",
      documentName: "DO Letters to States and UTs",
      uploadedOn: "09-10-2025 02:10 PM",
      uploadedBy: "Deepshikha Goel (Admin)",
      type: "letter",
    },
    {
      id: "5",
      documentName: "PPT for SNOs and DNOs regarding Dashboard",
      uploadedOn: "09-10-2025 02:10 PM",
      uploadedBy: "Deepshikha Goel (Admin)",
      type: "presentation",
    },
  ];

  useEffect(() => {
    try {
      // Simulate API call - Replace with actual API
      setDocuments(mockDocuments);
      setTotalCount(1500); // Mock total count
    } catch (error) {
      console.error("Error loading documents:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const endIndex = Math.min(startIndex + pageSize, documents.length);
  const paginatedDocuments = documents.slice(startIndex, endIndex);

  const handleViewDocument = () => {
    alert("View Document functionality to be implemented");
  };

  const handleAddDocument = () => {
    navigate("/important-documents/add");
  };

  return (
    <div className="w-full h-full p-2 overflow-y-auto">
      <div className="">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-[#374151]">
            Important Documents
          </h2>
          <button
            onClick={handleAddDocument}
            className="bg-[#003366] ml-2 text-nowrap px-4 py-2 text-sm text-white font-[500] rounded-lg hover:opacity-90 transition"
          >
            Add Document +
          </button>
        </div>

        <div className="bg-white rounded-md p-5 border border-[#E5E7EB]">
          <div className="grid grid-cols-12 gap-4 mb-6">
            {/* Search Bar */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-6 border border-[#E5E7EB] rounded-md px-4 py-2 flex items-center bg-white">
              <input
                type="search"
                className="w-full outline-none text-[#6B7280] placeholder-[#6B7280] text-sm"
                placeholder="Search for Document Name"
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
                    Document Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Uploaded On
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Uploaded By
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedDocuments.length > 0 ? (
                  paginatedDocuments.map((document, index) => (
                    <tr
                      key={index}
                      className="bg-white hover:bg-[#F9FAFB] border-b border-[#E5E7EB] last:border-b-0"
                    >
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">📄</span>
                          {document.documentName}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {document.uploadedOn}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {document.uploadedBy}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151] text-center">
                        <button
                          className="text-[#003366] font-[500]"
                          onClick={handleViewDocument}
                        >
                          View <span>↗</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
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

export default ImportantDocumentsList;
