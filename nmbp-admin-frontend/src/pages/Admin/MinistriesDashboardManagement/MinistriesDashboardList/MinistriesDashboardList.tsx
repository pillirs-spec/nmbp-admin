import React, { useEffect, useState } from "react";
import PledgeContributionIcon from "../../../../assets/total_pledge.svg";
import { useLogger, useToast } from "../../../../hooks";
import { pledgeReportService } from "../../PledgeReportManagement/PledgeReportList/pledgeReportService";
import { LogLevel } from "../../../../enums";

const MinistriesDashboardList = () => {
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPledgeCount, setTotalPledgeCount] = useState<number>(0);
  const [totalPledgeTodayCount, setTotalPledgeTodayCount] = useState<number>(0);
  const { log } = useLogger();
  const { showToast } = useToast();

  const [pageSize, setPageSize] = useState<number>(10);

  const getPledgesList = async () => {
    try {
      const payload = {
        pageSize,
        currentPage,
      };
      const response = await pledgeReportService.getAllPledgesList(payload);
      log(LogLevel.INFO, "PledgeReportList :: getPledgesList", response.data);
      if (response.status === 200) {
        setTotalCount(Number(response.data.data.pledgesCount));
        setTotalPledgeCount(Number(response.data.data.totalPledgeCount));
        setTotalPledgeTodayCount(
          Number(response.data.data.totalPledgeTodayCount),
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
  }, []);

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
              <p className="text-3xl font-semibold text-[#003366]">
                {totalPledgeCount}
              </p>
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
              <p className="text-3xl font-semibold text-[#003366]">
                {totalPledgeTodayCount}
              </p>
            </div>
            <img src={PledgeContributionIcon} alt="pledge-contribution-icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinistriesDashboardList;
