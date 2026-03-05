import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { debounce } from "lodash";
import searchIcon from "../../../../assets/search-icon.svg";
import { useNavigate } from "react-router-dom";
import { importantDocumentService } from "./importantDocumentService";
import {
  IconFileTypePdf,
  IconFileTypeCsv,
  IconFileExcel,
  IconFileTypeJpg,
  IconFileTypePng,
  IconVideo,
  IconEdit,
  IconEye,
} from "@tabler/icons-react";
import { useLogger, useToast } from "../../../../hooks";
import { LogLevel, ToastType } from "../../../../enums";

interface Document {
  document_id: string;
  document_name: string;
  file_type: string;
  date_updated: string;
  updated_by: string;
  is_published: boolean;
}

const ImportantDocumentsList = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
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

  // const startIndex = (currentPage - 1) * pageSize;
  // const endIndex = Math.min(startIndex + pageSize, documents.length);
  // const paginatedDocuments = documents.slice(startIndex, endIndex);

  const handleViewDocument = () => {
    showToast(
      "View Document functionality to be implemented",
      "info",
      ToastType.INFO,
    );
  };

  const handleEditDocument = (documentId: string) => {
    navigate(`/important-documents/add`, { state: { documentId } });
  };

  const handleAddDocument = () => {
    navigate("/important-documents/add");
  };

  const getAllDocumentsList = async () => {
    try {
      const payload = {
        pageSize,
        currentPage,
        searchFilter: searchQuery,
      };
      const response =
        await importantDocumentService.getAllDocumentsList(payload);
      if (response.status === 200) {
        // showToast(response.data.message, "success", ToastType.SUCCESS);
        setDocuments(response.data.data.documentsList);
        setTotalCount(response.data.data.totalDocumentsCount);
      }
    } catch (error) {
      log(LogLevel.ERROR, "PledgeReportList :: getPledgesList", error);
    }
  };

  useEffect(() => {
    getAllDocumentsList();
  }, [pageSize, currentPage, searchQuery]);

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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Published
                  </th>

                  <th className="px-6 py-4 text-center text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {documents.length > 0 ? (
                  documents.map((document) => (
                    <tr
                      key={document.document_id}
                      className="bg-white hover:bg-[#F9FAFB] border-b border-[#E5E7EB] last:border-b-0"
                    >
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {document.file_type.includes("pdf") ? (
                              <IconFileTypePdf color="red" />
                            ) : document.file_type.includes("csv") ? (
                              <IconFileTypeCsv color="green" />
                            ) : document.file_type.includes("excel") ||
                              document.file_type.includes("spreadsheet") ? (
                              <IconFileExcel color="green" />
                            ) : document.file_type.includes("jpeg") ? (
                              <IconFileTypeJpg color="blue" />
                            ) : document.file_type.includes("jpg") ? (
                              <IconFileTypeJpg color="blue" />
                            ) : document.file_type.includes("png") ? (
                              <IconFileTypePng color="blue" />
                            ) : document.file_type.includes("mp4") ||
                              document.file_type.includes("video") ? (
                              <IconVideo color="pink" />
                            ) : (
                              <IconFileTypePdf />
                            )}
                          </span>
                          {document.document_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {document.date_updated
                          .split("T")[0]
                          .split("-")
                          .reverse()
                          .join("-")}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {document.updated_by}
                      </td>

                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {document.is_published ? (
                          <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded">
                            Published
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-yellow-100 text-red-600 text-xs font-semibold rounded">
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151] text-center flex items-center justify-center gap-4">
                        <button
                          className="text-[#003366] font-[500]"
                          onClick={handleViewDocument}
                        >
                          <IconEye size={20} color="red" />
                        </button>
                        <button
                          className="text-[#003366] font-[500]"
                          onClick={() =>
                            handleEditDocument(document.document_id)
                          }
                        >
                          <IconEdit size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={12}
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
              <select
                className="text-[#374151] mx-1 px-2 py-1 border border-gray-300 rounded text-sm font-semibold cursor-pointer bg-white"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                <option>10</option>
                <option>50</option>
                <option>100</option>
              </select>
              of <span className="font-semibold">{documents?.length}</span>{" "}
              items
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportantDocumentsList;
