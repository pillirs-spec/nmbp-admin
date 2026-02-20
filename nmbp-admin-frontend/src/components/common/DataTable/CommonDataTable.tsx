import { MantineProvider, Pagination, Table } from "@mantine/core";
import React from "react";
import { CommonDataTableProps } from "./commonDataTableTypes";

const CommonDataTable: React.FC<CommonDataTableProps> = ({
  columns,
  data = [],
  renderActions,
  pageSize,
  isPagination,
  totalCount,
  currentPage,
  setCurrentPage,
  showChevron = false,
  onRowClick,
}) => {
  return (
    <>
      <div className="overflow-auto mt-5  mb-10 sm:mb-5 md:mb-0 rounded-2xl border">
        <Table
          striped
          highlightOnHover
          className="min-w-full border border-gray-300 rounded-md "
        >
          <thead className="bg-[#b7ccf3]">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-4 py-2 text-left tracking-wide text-[#000000] font-semibold text-nowrap"
                >
                  {column.label}
                </th>
              ))}
              {showChevron && <th className="px-4 py-2"></th>}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`border-b border-gray-200 bg-white hover:bg-gray-50 ${
                    showChevron && onRowClick ? "cursor-pointer" : ""
                  }`}
                  onClick={() => showChevron && onRowClick && onRowClick(row)}
                >
                  {columns.map((column, colIndex) => (
                    <React.Fragment key={colIndex}>
                      {column.tag === "imageUrl" ? (
                        <td className="px-4 py-2 text-gray-600 text-nowrap">
                          {row[column.key] ? (
                            <img
                              src={row[column.key]}
                              className="h-20 w-20 object-cover rounded-lg m-2"
                              alt="blog-picture"
                            />
                          ) : (
                            "N/A"
                          )}
                        </td>
                      ) : (
                        <td className="px-4 py-2 text-gray-600 text-nowrap">
                          {column.key === "actions"
                            ? renderActions(row)
                            : row[column.key] || "N/A"}
                        </td>
                      )}
                    </React.Fragment>
                  ))}
                  {showChevron && (
                    <td className="px-4 py-2 text-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={showChevron ? columns.length + 1 : columns.length}
                  className="text-center px-4 py-2 font-semibold"
                >
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <MantineProvider
        theme={{
          colors: {
            orange: [
              "#FFF5E1",
              "#FFE3B3",
              "#FFCF80",
              "#FFB74D",
              "#FF9800",
              "#F57C00",
              "#EF6C00",
              "#E65100",
              "#BF360C",
              "#870000",
            ],
          },
          primaryColor: "orange",
        }}
      ></MantineProvider>

      <div className="mt-4 flex justify-center fixed bottom-3 md:bottom-2 w-[80%] md:w-3/4">
        {isPagination ? (
          <Pagination
            color="#F5BE14"
            total={Math.ceil(totalCount / pageSize)}
            value={currentPage}
            onChange={setCurrentPage}
            styles={{
              control: {
                color: "black",
              },
            }}
          />
        ) : null}
      </div>
    </>
  );
};

export default CommonDataTable;
