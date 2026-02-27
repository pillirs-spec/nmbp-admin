import React from "react";
import PledgeContributionIcon from "../../../../assets/total_pledge.svg";

const MinistriesDashboardList = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-[#374151]">
          Ministries / Departments and Spiritual Organisations <br />
          <span className="text-sm text-[#6B7280]">
            (Who have signed MoU with the Ministry of Social Justice)
          </span>
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-[#6B7280] mb-2">
                Total Pledges
              </p>
              <p className="text-3xl font-semibold text-[#003366]">1000</p>
            </div>
            <img src={PledgeContributionIcon} alt="pledge-contribution-icon" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-[#6B7280] mb-2">
                Total Pledges Taken (Today)
              </p>
              <p className="text-3xl font-semibold text-[#003366]">500</p>
            </div>
            <img src={PledgeContributionIcon} alt="pledge-contribution-icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinistriesDashboardList;
