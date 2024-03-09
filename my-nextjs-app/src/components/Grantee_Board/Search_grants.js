"use client";

import React, { useState } from "react";

const Search_grants = () => {
  const allGrants = [
    {
      id: 1,
      serviceDate: "2023-01-01",
      receivedOn: "2023-01-02",
      claimType: "Type A",
      memberName: "Canada",
      amountPaid: "$1000",
      category: "Category 1",
      grantor: "Provider A",
    },
    {
      id: 2,
      serviceDate: "2023-02-01",
      receivedOn: "2023-02-05",
      claimType: "Type B",
      memberName: "Canada",
      amountPaid: "$1500",
      grantor: "Provider B",
      category: "Category 2",
    },
    {
      id: 3,
      serviceDate: "2023-03-01",
      receivedOn: "2023-03-03",
      claimType: "Type C",
      memberName: "International",
      amountPaid: "$2000",
      grantor: "Provider C",
      category: "Category 3",
    },
    {
      id: 4,
      serviceDate: "2023-01-01",
      receivedOn: "2023-01-02",
      claimType: "Type A",
      memberName: "Canada",
      amountPaid: "$1000",
      grantor: "Provider A",
      category: "Category 1",
    },
    {
      id: 5,
      serviceDate: "2023-02-01",
      receivedOn: "2023-02-05",
      claimType: "Type B",
      memberName: "Canada",
      amountPaid: "$1500",
      grantor: "Provider B",
      category: "Category 2",
    },
    {
      id: 6,
      serviceDate: "2023-01-01",
      receivedOn: "2023-01-02",
      claimType: "Type A",
      memberName: "Canada",
      amountPaid: "$1000",
      category: "Category 1",
      grantor: "Provider A",
    },
    {
      id: 7,
      serviceDate: "2023-02-01",
      receivedOn: "2023-02-05",
      claimType: "Type B",
      memberName: "Canada",
      amountPaid: "$1500",
      grantor: "Provider B",
      category: "Category 2",
    },
    {
      id: 8,
      serviceDate: "2023-03-01",
      receivedOn: "2023-03-03",
      claimType: "Type C",
      memberName: "Canada",
      amountPaid: "$2000",
      grantor: "Provider C",
      category: "Category 3",
    },
    {
      id: 9,
      serviceDate: "2023-01-01",
      receivedOn: "2023-01-02",
      claimType: "Type A",
      memberName: "US",
      amountPaid: "$1000",
      grantor: "Provider A",
      category: "Category 1",
    },
    {
      id: 10,
      serviceDate: "2023-02-01",
      receivedOn: "2023-02-05",
      claimType: "Type B",
      memberName: "China",
      amountPaid: "$1500",
      grantor: "Provider B",
      category: "Category 2",
    },
  ];

  const [isFormVisible, setIsFormVisible] = useState(true);
  const [expandedGrantId, setExpandedGrantId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const grantsPerPage = 9;
  const indexOfLastGrant = currentPage * grantsPerPage;
  const indexOfFirstGrant = indexOfLastGrant - grantsPerPage;
  const currentGrants = allGrants.slice(indexOfFirstGrant, indexOfLastGrant);

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  const toggleCardExpansion = (id) => {
    if (expandedGrantId === id) {
      // If already expanded, shrink the card
      setExpandedGrantId(null);
    } else {
      setExpandedGrantId(id);
    }
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    setExpandedGrantId(null); // Collapse any expanded card when paginating
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundImage:
          "url('https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcm00MjItMDQ3LWtxOTJ3eDl5LmpwZw.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="min-h-screen p-8 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="bg-white p-6 rounded-lg">
              <h1 className="text-black text-3xl text-center sm:text-left font-semibold mb-10 text-left">
                Here we go...
              </h1>
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 mb-4">
                <h2 className="text-xl font-semibold text-black text-center sm:text-left">
                  What is this grant for?
                </h2>
              </div>
              <div className="mb-4 flex border border-black rounded">
                <svg
                  className="text-black m-2 w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <input
                  id="searchInput"
                  type="text"
                  placeholder="Search for category   (e.g: study, medical)"
                  className="p-2 w-full text-black"
                />
              </div>
              <div className="flex justify-between">
                <h2 className="text-xl font-bold text-black mt-5 mb-5">
                  Filter
                </h2>
                <button
                  id="toggleButton"
                  className="focus:outline-none transition-transform"
                  onClick={toggleFormVisibility}
                >
                  <svg
                    className={`w-6 h-6 text-black transition-transform duration-200 ease-in-out ${
                      isFormVisible ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 15l7-7 7 7"
                    ></path>
                  </svg>
                </button>
              </div>
              <div
                className={`transition-all duration-700 ease-in-out ${
                  isFormVisible
                    ? "opacity-100 max-h-[1000px]"
                    : "opacity-0 max-h-0"
                } overflow-hidden`}
                style={{ transitionProperty: "opacity, max-height" }}
              >
                {isFormVisible && (
                  <div class="flex flex-wrap md:flex-nowrap">
                    <div class="w-full md:w-1/2 md:pr-2">
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
                            htmlFor="postedBefore"
                            className="block mb-2 text-black"
                          >
                            Posted Before:
                          </label>
                          <input
                            type="date"
                            id="postBefore"
                            className="w-full p-2 border border-black rounded text-black"
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            htmlFor="postedAfter"
                            className="block mb-2 text-black"
                          >
                            Posted After:
                          </label>
                          <input
                            type="date"
                            id="postedAfter"
                            className="w-full p-2 border border-black rounded text-black"
                          />
                        </div>
                      </form>
                    </div>
                    <div class="hidden md:block md:w-px bg-black mx-4"></div>
                    <div class="w-full md:w-1/2 md:pl-2">
                      <form>
                        <div className="mb-4">
                          <label
                            htmlFor="memberName"
                            className="block mb-2 border-black text-black"
                          >
                            Grantor Name:
                          </label>
                          <input
                            type="text"
                            id="grantorName"
                            className="w-full p-2 border border-black rounded text-black"
                            placeholder="Enter the name of the grantor"
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            htmlFor="MinAmount"
                            className="block mb-2 text-black"
                          >
                            Minimum Amount:
                          </label>
                          <input
                            type="number"
                            id="minAmount"
                            className="w-full p-2 border border-black rounded text-black"
                            placeholder="Enter minimum amount"
                          />
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
                      </form>
                    </div>
                  </div>
                )}
                <div class="w-full flex justify-center mt-4 md:mt-0 sm:justify-end">
                  <button class="mr-2 px-6 py-2 text-white bg-green-700 hover:bg-green-900 rounded-full">
                    Filter
                  </button>
                  <button class="px-4 py-2 text-white bg-gray-500 hover:bg-gray-700 rounded-full">
                    Reset
                  </button>
                </div>
              </div>
            </div>
            <div className="border-2 border-black block"></div>
            <div className="w-full p-4 mt-7">
              <h2 className="font-bold text-lg mb-4 text-black">
                Available Grants
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
                          className={"h-2 w-full rounded-t-lg bg-orange-400"}
                        ></div>

                        <div className="bg-white p-2 rounded-lg shadow shadow-xl">
                          <div className="flex justify-between items-center mb-4">
                            <p className="text-md">
                              <p className=" text-black">
                                <span className="font-semibold">
                                  Provider:{" "}
                                </span>{" "}
                                {claim.grantor}
                              </p>
                            </p>
                            <button
                              onClick={() =>
                                toggleCardExpansion(
                                  expandedGrantId === claim.id ? null : claim.id
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
                                    Basic Information
                                  </h2>
                                </div>
                                <div className="bg-slate-100 border-2 rounded p-6">
                                  <div className="flex justify-between mb-2">
                                    <span className="font-bold">Category:</span>
                                    {claim.category}
                                  </div>
                                  <div className="flex justify-between mb-2">
                                    <span className="font-bold">Provider:</span>
                                    {claim.grantor}
                                  </div>
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold">
                                      Amount Payable:
                                    </span>
                                    {claim.amountPaid}
                                  </div>
                                  <div className="flex justify-between mb-2">
                                    <span className="font-bold">
                                      Required Nationality:
                                    </span>
                                    {claim.memberName}
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
                                Description
                              </h2>
                              <div className="bg-slate-100 border-2  rounded p-6">
                                <div className="flex justify-between mb-4 text-md">
                                  This is a really great grant! This is a really
                                  great grant! This is a really great grant!
                                  This is a really great grant! This is a really
                                  great grant! This is a really great grant!
                                  This is a really great grant! This is a really
                                  great grant! This is a really great grant!
                                  This is a really great grant!
                                </div>
                              </div>
                              <h2 className="text-red-500 font-semibold mb-2 mt-5">
                                Deadline to Apply
                              </h2>
                              <div className="bg-slate-100 border-2  rounded p-6">
                                <div className="mb-2">2023-10-10</div>
                                {/* add more */}
                              </div>
                              <div className="flex justify-center items-center">
                                <button className="text-black px-6 py-2 bg-sky-100 hover:bg-sky-200 rounded-full font-semibold mb-2 mt-5">
                                  Apply Here
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              {/* Small view content */}
                              <p className="mb-2 text-md">{claim.memberName}</p>
                              <p className="mb-2">{claim.category}</p>
                              <div className="flex justify-between items-center">
                                <div>
                                  <p>Date Posted:</p>
                                  <p>{claim.receivedOn}</p>
                                </div>
                                <div>
                                  <p>Amount Payable:</p>
                                  <p>{claim.amountPaid}</p>
                                </div>
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
                    className="px-2 py-2 mr-5 text-sm font-semibold text-white bg-green-600 rounded-full sm:w-auto sm:px-4 hover:bg-green-800"
                  >
                    Previous
                  </button>
                )}
                {indexOfLastGrant < allGrants.length && (
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    className="px-2 py-2 mx-1 text-sm font-semibold text-white bg-green-600 rounded-full w-1/4  hover:bg-green-800"
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
  );
};

export default Search_grants;
