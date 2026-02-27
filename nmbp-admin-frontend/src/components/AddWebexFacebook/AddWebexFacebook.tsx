import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AddWebexFacebook = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  console.log(state);
  const [formData, setFormData] = useState({
    postType: "",
    title: "",
    link: "",
    eventDate: "",
    eventTime: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add API call here
    navigate(-1);
  };

  return (
    <div className="p-5 mt-40 md:mt-0">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-[20px] border border-[#E5E7EB] p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-[#003366]">
              Add Webex Facebook
            </h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Select Post Type Field */}
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Select Post Type
                </label>
                <select
                  name="postType"
                  value={formData.postType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#E5E7EB] rounded-md outline-none text-[#374151] text-sm appearance-none bg-white focus:border-[#003366] transition cursor-pointer"
                  required
                >
                  <option value="">--Select an option--</option>
                  <option value="Webex">Webex</option>
                  <option value="Facebook">Facebook</option>
                </select>
              </div>

              {/* Title Field */}
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#E5E7EB] rounded-md outline-none text-[#374151] text-sm focus:border-[#003366] transition"
                  placeholder="Title"
                  required
                />
              </div>

              {/* Link Field */}
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Link
                </label>
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#E5E7EB] rounded-md outline-none text-[#374151] text-sm focus:border-[#003366] transition"
                  placeholder="Link"
                  required
                />
              </div>

              {/* Event Date Field */}
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Event date
                </label>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#E5E7EB] rounded-md outline-none text-[#374151] text-sm focus:border-[#003366] transition"
                  required
                />
              </div>

              {/* Event Time Field */}
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Event Time
                </label>
                <input
                  type="time"
                  name="eventTime"
                  value={formData.eventTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#E5E7EB] rounded-md outline-none text-[#374151] text-sm focus:border-[#003366] transition"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center gap-6">
              <button
                type="button"
                className="px-12 py-2 border border-[#003366] text-[#003366] font-[500] rounded-lg text-sm"
                onClick={() => navigate("/webex-facebook")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-12 py-2 bg-[#003366] text-white font-[500] rounded-lg text-sm hover:opacity-90 transition"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddWebexFacebook;
