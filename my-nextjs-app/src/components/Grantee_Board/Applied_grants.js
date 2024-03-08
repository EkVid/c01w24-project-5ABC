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
      status: "Pending",
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
      status: "Rejected",
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
    {
      id: 1,
      serviceDate: "2023-01-01",
      receivedOn: "2023-01-02",
      claimType: "Type A",
      memberName: "John Doe",
      amountPaid: "$1000",
      paidTo: "Provider A",
      category: "Category 1",
      status: "Approved",
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

  const grantsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [bgWhite, setBgWhite] = useState(false); // State to toggle background color

  const indexOfLastGrant = currentPage * grantsPerPage;
  const indexOfFirstGrant = indexOfLastGrant - grantsPerPage;
  const currentGrants = allGrants.slice(indexOfFirstGrant, indexOfLastGrant);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-600"; // Green for approved
      case "Rejected":
        return "bg-red-600"; // Red for rejected
      case "Pending":
        return "bg-yellow-600"; // Yellow for pending
      default:
        return "bg-gray-400"; // Gray for any other status or if no status is provided
    }
  };

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
              Rawad's Application History
            </h1>

            <div className="flex lg:flex-row md:flex-row flex-col">
              <div className="lg:w-1/4 md:w-1/4 w-full p-4">
                <h2 className="font-bold text-lg mb-4 text-black">Filters</h2>
                {/* Filter form */}
                <form>
                  <div className="mb-4">
                    <label
                      htmlFor="claimType"
                      className="block mb-2 text-black"
                    >
                      Grants Type:
                    </label>
                    <select
                      id="claimType"
                      className="w-full p-2 border border-black rounded text-black"
                    >
                      <option>All</option>
                      <option>Medical</option>
                      <option>Study</option>
                      <option>Travel</option>
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
                      className="w-full p-2 border border-black rounded text-black"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="memberName"
                      className="block mb-2 border-black text-black"
                    >
                      Applicant Name:
                    </label>
                    <input
                      type="text"
                      id="memberName"
                      className="w-full p-2 border  border-black rounded text-black"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="status" className="block mb-2 text-black">
                      Status:
                    </label>
                    <select
                      id="status"
                      className="w-full p-2 border  border-black rounded text-black"
                    >
                      <option>All</option>
                      <option>Approved</option>
                      <option>Rejected</option>
                      <option>Submitted</option>
                      <option>Pending</option>
                    </select>
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="maxAmount"
                      className="block mb-2 text-black"
                    >
                      Maximum Payable Amount:
                    </label>
                    <input
                      type="number"
                      id="maxAmount"
                      className="w-full p-2 border border-black rounded text-black"
                      placeholder="Enter maximum amount"
                    />
                  </div>
                  <div className="flex justify-center">
                    <button className="bg-green-600 text-white w-full px-5 py-2 rounded-full hover:bg-green-800 transition-colors text-sm sm:text-base">
                      Filter
                    </button>
                  </div>
                  <div className="border-2 border-black mt-10 lg:hidden md:hidden block"></div>
                </form>
              </div>

              <div className="w-full lg:w-3/4 p-4">
                <h2 className="font-bold text-lg mb-4 text-black">
                  Applied Grants
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-black mt-3">
                  {currentGrants.map((claim) => (
                    <div key={claim.id} className="p-1">
                      <div
                        className={`${getStatusColor(
                          claim.status
                        )} h-2 w-full rounded-t-lg`}
                      ></div>

                      {/* Card content */}
                      <div className="bg-white p-2 rounded-lg shadow shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                          <p className="text-md">Status: {claim.status}</p>
                          <button className="text-green-700 text-md hover:text-green-900 transition duration-150 ease-in-out">
                            View Details
                          </button>
                        </div>
                        <div className="border-t border-gray-300 mb-5"></div>
                        <p className="mb-2 text-md">{claim.memberName}</p>

                        <p className="mb-2">{claim.category}</p>

                        <div className="flex justify-between items-center">
                          <p>Date Submitted: {claim.receivedOn}</p>
                          <p>Amount Payable: {claim.amountPaid}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center p-4 text-black">
                  {currentPage > 1 && (
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      className="px-4 py-2 mr-5 text-sm font-semibold text-white bg-green-600 rounded-full w-1/4 hover:bg-green-800"
                    >
                      Previous
                    </button>
                  )}
                  {indexOfLastGrant < allGrants.length && (
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      className="px-4 py-2 mx-1 text-sm font-semibold text-white bg-green-600 rounded-full w-1/4  hover:bg-green-800"
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
