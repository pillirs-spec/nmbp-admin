import React, { useState, useEffect } from "react";
import { debounce } from "lodash";
import EditIcon from "../../../../assets/edit.svg";
import { useNavigate } from "react-router-dom";

interface WebFacebookPost {
  id: string;
  postType: string;
  title: string;
  link: string;
  eventDate: string;
  eventTime: string;
}

const WebexFacebookList = () => {
  const [posts, setPosts] = useState<WebFacebookPost[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const navigate = useNavigate();

  // Mock data - Replace with actual API call
  const mockPosts: WebFacebookPost[] = [
    {
      id: "1",
      postType: "Webex",
      title: "trr",
      link: "gfff",
      eventDate: "02-Dec-25",
      eventTime: "14:39",
    },
    {
      id: "2",
      postType: "Facebook",
      title:
        "Sharing Stories of People Across the Gender Spectrum Towards a Nasha Mukt Lifestyle",
      link: "https://www.facebook.com/share/l9ihdWNj4/",
      eventDate: "24-Dec-24",
      eventTime: "10:45",
    },
    {
      id: "3",
      postType: "Facebook",
      title: "NMBA organises Pledge against Drug Abuse",
      link: "https://www.facebook.com/share/lZgiITUjs5X27Ens/",
      eventDate: "12-Aug-24",
      eventTime: "09:00",
    },
    {
      id: "4",
      postType: "Facebook",
      title:
        "NMBA commemorates International Day Against Drug Abuse and Illicit Trafficking",
      link: "https://www.facebook.com/share/oDjjKck5FxSx8F8F/",
      eventDate: "26-Jun-24",
      eventTime: "17:00",
    },
    {
      id: "5",
      postType: "Facebook",
      title: "Leading from margins: Role of women in making Drug-free India",
      link: "https://www.facebook.com/share/SxSCihUuvWUpxEmz/",
      eventDate: "26-Jun-24",
      eventTime: "11:00",
    },
    {
      id: "6",
      postType: "Facebook",
      title: "Engaging university students to lead the Drug-free campaign",
      link: "https://www.facebook.com/events/1ll7895999307324/",
      eventDate: "25-Jun-24",
      eventTime: "11:00",
    },
    {
      id: "7",
      postType: "Facebook",
      title: "Showcasing best practices under NMBA",
      link: "https://www.facebook.com/share/DhxPP3p6RCyLNcCr/",
      eventDate: "24-Jun-24",
      eventTime: "12:00",
    },
    {
      id: "8",
      postType: "Facebook",
      title:
        "Promoting Yoga, Meditation and, Mindfulness for a Drug-Free Lifestyle",
      link: "https://www.facebook.com/share/AjlPqPElZSlfetbq/",
      eventDate: "21-Jun-24",
      eventTime: "11:00",
    },
    {
      id: "9",
      postType: "Facebook",
      title:
        "Launch of NMBA Awareness Vehicle by DOSJE, in convergence with Brahma Kumaris",
      link: "https://fb.me/e/3v5M5rvmK",
      eventDate: "14-Feb-24",
      eventTime: "12:00",
    },
  ];

  useEffect(() => {
    try {
      // Simulate API call - Replace with actual API
      setPosts(mockPosts);
      setTotalCount(9); // Mock total count
    } catch (error) {
      console.error("Error loading posts:", error);
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

  const handleEdit = (id: string) => {
    navigate("/webex-facebook/add/", { state: { postId: id } });
  };

  const handleConfirmDelete = () => {
    console.log("Deleting post:", selectedPostId);
    // Add delete API call here
    setShowDeleteModal(false);
    setSelectedPostId(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedPostId(null);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, posts.length);
  const paginatedPosts = posts.slice(startIndex, endIndex);

  const handleAddWebexFacebbok = () => {
    navigate("/webex-facebook/add");
  };

  return (
    <div className="w-full h-full p-2 overflow-y-auto">
      <div className="p-5">
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-[#374151]">
            Web Facebook
          </h2>
          <button
            onClick={handleAddWebexFacebbok}
            className="px-4 py-2 bg-[#003366] text-white font-medium rounded-lg flex items-center gap-2"
          >
            Web facebook +
          </button>
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
                    S.No.
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Post Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Link
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Event date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Event time
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-[#6B7280] border-b border-gray-300">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedPosts.length > 0 ? (
                  paginatedPosts.map((post, index) => (
                    <tr
                      key={post.id}
                      className="bg-white hover:bg-[#F9FAFB] border-b border-[#E5E7EB] last:border-b-0]"
                    >
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {post.postType}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {post.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        <a
                          href={post.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate block"
                        >
                          {post.link}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {post.eventDate}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151]">
                        {post.eventTime}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleEdit(post.id)}
                          className="text-[#E91E63] hover:text-[#C2185B] transition"
                        >
                          <img src={EditIcon} alt="Delete" className="" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
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
                onClick={() =>
                  setCurrentPage(
                    Math.min(Math.ceil(totalCount / pageSize), currentPage + 1),
                  )
                }
                disabled={currentPage === Math.ceil(totalCount / pageSize)}
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
                Are you sure you want to delete this post? This action cannot be
                undone.
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

export default WebexFacebookList;
