"use client";
import React, { useState } from "react";

const Applied_Grants = () => {
  const allGrants = [
    {
      id: 1,
      serviceDate: "2023-01-01",
      receivedOn: "2023-01-02",
      claimType: "Type A",
      memberName: "John Doe",
      amountPaid: "$1000",
      paidTo: "Provider A",
      category: "Category 1",
      status: "Submitted",
    },
    {
      id: 2,
      serviceDate: "2023-02-01",
      receivedOn: "2023-02-05",
      claimType: "Type B",
      memberName: "Jane Doe",
      amountPaid: "$1500",
      paidTo: "Provider B",
      category: "Category 2",
      status: "In Review",
    },
    {
      id: 3,
      serviceDate: "2023-03-01",
      receivedOn: "2023-03-03",
      claimType: "Type C",
      memberName: "Mike Smith",
      amountPaid: "$2000",
      paidTo: "Provider C",
      category: "Category 3",
      status: "Approved",
    },
  ];

  const grantsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastGrant = currentPage * grantsPerPage;
  const indexOfFirstGrant = indexOfLastGrant - grantsPerPage;
  const currentGrants = allGrants.slice(indexOfFirstGrant, indexOfLastGrant);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div
      className="flex items-center justify-center min-h-screen py-10"
      style={{
        backgroundImage:
          "url('https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcm00MjItMDQ3LWtxOTJ3eDl5LmpwZw.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex justify-center w-full">
        <div className="max-w-7xl w-full mx-auto px-4">
          <div className="mt-10 rounded-lg shadow overflow-hidden">
            <h1 className="text-black lg:text-4xl md:text-3xl text-3xl text-center sm:text-left font-semibold mb-6 p-6">
              Your Application History
            </h1>
            <div className="flex">
              <div className="w-1/4 p-4">
                <h2 className="font-bold text-lg mb-4 text-black">Filters</h2>
                {/* Filter form */}
                <form>
                  <div className="mb-4">
                    <label
                      htmlFor="claimType"
                      className="block mb-2 text-black"
                    >
                      Claim Type:
                    </label>
                    <select
                      id="claimType"
                      className="w-full p-2 border rounded text-black"
                    >
                      {/* Option values */}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="dateSubmitted"
                      className="block mb-2 text-black"
                    >
                      Date Submitted:
                    </label>
                    <input
                      type="date"
                      id="dateSubmitted"
                      className="w-full p-2 border rounded text-black"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="memberName"
                      className="block mb-2 text-black"
                    >
                      Member Name:
                    </label>
                    <input
                      type="text"
                      id="memberName"
                      className="w-full p-2 border rounded text-black"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="status" className="block mb-2 text-black">
                      Status:
                    </label>
                    <select
                      id="status"
                      className="w-full p-2 border rounded text-black"
                    >
                      {/* Option values */}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="category" className="block mb-2 text-black">
                      Category:
                    </label>
                    <select
                      id="category"
                      className="w-full p-2 border rounded text-black"
                    >
                      {/* Option values */}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Filter
                  </button>
                </form>
              </div>

              <div className="w-full lg:w-3/4 p-4">
                <Grants_list />

                <div className="flex justify-center p-4 text-black">
                  {currentPage > 1 && (
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      className="px-4 py-2 mx-1 text-sm font-semibold text-gray-800 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Previous
                    </button>
                  )}
                  {indexOfLastGrant < allGrants.length && (
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      className="px-4 py-2 mx-1 text-sm font-semibold text-gray-800 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Applied_Grants;
