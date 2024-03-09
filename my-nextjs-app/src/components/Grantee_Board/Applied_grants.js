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
      id: 4,
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
      id: 5,
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
      id: 6,
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
      id: 7,
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
      id: 8,
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
      id: 9,
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
      id: 10,
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
      id: 11,
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
      id: 12,
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
      id: 13,
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
      id: 14,
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
      id: 15,
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
  const [expandedGrantId, setExpandedGrantId] = useState(null);

  const indexOfLastGrant = currentPage * grantsPerPage;
  const indexOfFirstGrant = indexOfLastGrant - grantsPerPage;
  const currentGrants = allGrants.slice(indexOfFirstGrant, indexOfLastGrant);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    setExpandedGrantId(null); // Collapse any expanded card when paginating
  };

  const toggleCardExpansion = (id) => {
    if (expandedGrantId === id) {
      // If already expanded, shrink the card
      setExpandedGrantId(null);
    } else {
      setExpandedGrantId(id);
    }
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
          <div className="mt-10 bg-sky-50 rounded-lg shadow overflow-hidden">
            <h1 className="text-black lg:text-4xl md:text-3xl text-3xl text-center sm:text-left font-semibold mb-6 p-6">
              Rawad's Application History
            </h1>

            <div className="flex lg:flex-row md:flex-row flex-col">
              <div className="lg:w-1/4 md:w-1/4 w-full p-4">
                <div className="flex justify-between items-center">
                  <h2 className="font-bold text-lg mb-4 text-black">Filters</h2>
                  <button className=" mb-4 text-sm font-semibold bg-gray-500 text-white px-3 py-1 rounded hover:bg-green-700 transition ease-in-out duration-150">
                    Reset Filter
                  </button>
                </div>
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
                  {currentGrants.map((claim) => {
                    // Check if the card should be expanded or if no card is expanded
                    const shouldDisplay =
                      expandedGrantId === null || expandedGrantId === claim.id;

                    // Only render the card if it should be displayed based on the above condition
                    if (shouldDisplay) {
                      return (
                        <div
                          key={claim.id}
                          className={` p-1 transition-all duration-500 ease-in-out ${
                            expandedGrantId === claim.id
                              ? "scale-100 opacity-100"
                              : "scale-95 opacity-75"
                          } ${
                            expandedGrantId === claim.id
                              ? "col-span-3 lg:col-span-3"
                              : "md:col-span-2 lg:col-span-1"
                          }`}
                        >
                          <div
                            className={`${getStatusColor(
                              claim.status
                            )} h-2 w-full rounded-t-lg`}
                          ></div>

                          <div className="bg-white p-2 rounded-lg shadow shadow-xl">
                            <div className="flex justify-between items-center mb-4">
                              <p className="text-md">Status: {claim.status}</p>
                              <button
                                onClick={() =>
                                  toggleCardExpansion(
                                    expandedGrantId === claim.id
                                      ? null
                                      : claim.id
                                  )
                                }
                                className="text-green-700 text-md hover:text-green-900 transition duration-150 ease-in-out"
                              >
                                {expandedGrantId === claim.id
                                  ? "Close"
                                  : "View Details"}
                              </button>
                            </div>

                            <div className="border-t border-gray-300 mb-5"></div>
                            {expandedGrantId === claim.id ? (
                              <div>
                                {/* Expanded view content */}
                                <div className="mb-5">
                                  <div className="flex justify-between">
                                    <h2 className="text-black font-semibold mb-2">
                                      Grant's Information
                                    </h2>
                                    <h2 className="text-black mb-2">
                                      Learn more (a link)
                                    </h2>
                                  </div>
                                  <div className="bg-slate-100 border-2 rounded p-6">
                                    <div className="flex justify-between mb-2">
                                      <span className="font-bold">
                                        Category:
                                      </span>
                                      {claim.category}
                                    </div>
                                    <div className="flex justify-between mb-2">
                                      <span className="font-bold">
                                        Provider:
                                      </span>
                                      Rawad
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="font-bold">
                                        Amount Payable:
                                      </span>
                                      {claim.amountPaid}
                                    </div>
                                    <div className="flex justify-between mb-2">
                                      <span className="font-bold">
                                        Date Posted:
                                      </span>
                                      2022-12-20
                                    </div>
                                    {/* add more  */}
                                  </div>
                                </div>
                                <h2 className="text-black font-semibold mb-2">
                                  Grant's Description
                                </h2>
                                <div className="bg-slate-100 border-2  rounded p-6">
                                  <div className="flex justify-between mb-4 text-md">
                                    This is a really great grant! This is a
                                    really great grant! This is a really great
                                    grant! This is a really great grant! This is
                                    a really great grant! This is a really great
                                    grant! This is a really great grant! This is
                                    a really great grant! This is a really great
                                    grant! This is a really great grant!
                                  </div>
                                </div>
                                <h2 className="text-black font-semibold mb-2 mt-5">
                                  Applicant's Information
                                </h2>
                                <div className="bg-slate-100 border-2  rounded p-6">
                                  <div className="flex justify-between mb-4 text-md">
                                    <span className="font-bold">
                                      Applicant Name:
                                    </span>
                                    {claim.memberName}
                                  </div>
                                  <div className="flex justify-between mb-4 text-md">
                                    <span className="font-bold">Age:</span>
                                    18
                                  </div>
                                  <div className="flex justify-between mb-4 text-md">
                                    <span className="font-bold">
                                      Nationality:
                                    </span>
                                    Canadian
                                  </div>
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold">
                                      Date Submitted:
                                    </span>
                                    {claim.receivedOn}
                                  </div>
                                  {/* add more */}
                                </div>
                                <h2 className="text-black font-semibold mb-2 mt-5">
                                  Applicant's Response
                                </h2>
                                <div className="bg-slate-100 border-2  rounded p-6">
                                  <div className="mb-2">
                                    <span class="font-bold">
                                      Question 1:{" "}
                                      <span className="text-red-400">
                                        Why do you need this grant?
                                      </span>
                                    </span>
                                  </div>
                                  <div className="mb-8 mt-2">
                                    <span class="font-bold">
                                      Answer:{" "}
                                      <span className="text-red-400">
                                        I am broke af
                                      </span>
                                    </span>
                                  </div>
                                  <div className="mb-2">
                                    <span class="font-bold">
                                      Question 2:{" "}
                                      <span className="text-red-400">
                                        Why do you need this grant?
                                      </span>
                                    </span>
                                  </div>
                                  <div className="mb-8 mt-2">
                                    <span class="font-bold">
                                      Answer:{" "}
                                      <span className="text-red-400">
                                        I am broke af
                                      </span>
                                    </span>
                                  </div>
                                  <div className="mb-2">
                                    <span class="font-bold">
                                      Question 3:{" "}
                                      <span className="text-red-400">
                                        Why do you need this grant?
                                      </span>
                                    </span>
                                  </div>
                                  <div className="mb-8 mt-2">
                                    <span class="font-bold">
                                      Answer:{" "}
                                      <span className="text-red-400">
                                        I am broke af
                                      </span>
                                    </span>
                                  </div>
                                  {/* add more */}
                                </div>
                              </div>
                            ) : (
                              <div>
                                {/* Small view content */}
                                <p className="mb-2 text-md">
                                  {claim.memberName}
                                </p>
                                <p className="mb-2">{claim.category}</p>
                                <div className="flex justify-between items-center">
                                  <p>Date Submitted: {claim.receivedOn}</p>
                                  <p>Amount Payable: {claim.amountPaid}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }
                    return null; // If the card should not be displayed, return null to skip rendering
                  })}
                </div>

                <div className="flex justify-center p-4 text-black">
                  {currentPage > 1 && (
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      className="px-2 py-2 mr-5 text-sm font-semibold text-white bg-green-600 rounded-full w-1/4 hover:bg-green-800"
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
