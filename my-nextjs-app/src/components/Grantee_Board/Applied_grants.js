"use client";
import React, { useState } from "react";

// change category to title

const Applied_Grants = () => {
  const allGrants = [
    {
      answerData: [
        {
          options: {
            answerType: "short",
            isMultipleLines: false,
            maxCharsNum: 16,
            minCharsNum: 1,
          },
          text: "Bob",
        },
      ],
      dateSubmitted: "2024-03-14",
      email: "avers07@gmail.com",
      grantID: "65f749445c287cfeb9f3c573",
      profileData: {
        age: 21,
        gender: "Man",
        nationality: "Canadian",
        race: "White",
        veteran: 1,
      },
      status: 2,
    },
    {
      answerData: [
        {
          options: {
            answerType: "short",
            isMultipleLines: false,
            maxCharsNum: 16,
            minCharsNum: 1,
          },
          text: "Bob",
        },
      ],
      dateSubmitted: "2024-03-14",
      email: "avers07@gmail.com",
      grantID: "65f749445c287cfeb9f3c572",
      profileData: {
        age: 21,
        gender: "Man",
        nationality: "Canadian",
        race: "White",
        veteran: 1,
      },
      status: 0,
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
      case 3:
        return "bg-green-600"; // Green for approved
      case 2:
        return "bg-red-600"; // Red for rejected
      case 1:
        return "bg-yellow-600"; // Yellow for pending
      default:
        return "bg-gray-400"; // Gray for any other status or if no status is provided
    }
  };

  const getStatusText = (statusInt) => {
    switch (statusInt) {
      case 0:
        return "Draft";
      case 1:
        return "In Review";
      case 2:
        return "Rejected";
      case 3:
        return "Approved";
      default:
        return "Unknown";
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
        backgroundAttachment: "fixed",
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
                      htmlFor="maxAmount"
                      className="block mb-2 text-black"
                    >
                      Title:
                    </label>
                    <input
                      type="text"
                      id="title"
                      className="w-full p-2 border border-black rounded text-black"
                      placeholder="Enter keywords in title"
                    />
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
                      Deadline:
                    </label>
                    <input
                      type="date"
                      id="deadline"
                      className="w-full p-2 border border-black rounded text-black"
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
                      expandedGrantId === null ||
                      expandedGrantId === claim.grantID;

                    // Only render the card if it should be displayed based on the above condition
                    if (shouldDisplay) {
                      return (
                        <div
                          key={claim.grantID}
                          className={` p-1 transition-all duration-500 ease-in-out ${
                            expandedGrantId === claim.grantID
                              ? "scale-100 opacity-100"
                              : "scale-95 opacity-75"
                          } ${
                            expandedGrantId === claim.grantID
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
                              <p className="text-md">
                                Status: {getStatusText(claim.status)}
                              </p>
                              <button
                                onClick={() =>
                                  toggleCardExpansion(
                                    expandedGrantId === claim.grantID
                                      ? null
                                      : claim.grantID
                                  )
                                }
                                className="text-green-700 text-md hover:text-green-900 transition duration-150 ease-in-out"
                              >
                                {expandedGrantId === claim.grantID
                                  ? "Close"
                                  : "View Details"}
                              </button>
                            </div>

                            <div className="border-t border-gray-300 mb-5"></div>
                            {expandedGrantId === claim.grantID ? (
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
                                      <span className="font-bold">Title:</span>
                                      to be changed
                                    </div>
                                    <div className="flex justify-between mb-2">
                                      <span className="font-bold">
                                        Provider:
                                      </span>
                                      to be changed
                                    </div>
                                    <div className="flex justify-between mb-2">
                                      <span className="font-bold">
                                        Provider Email:
                                      </span>
                                      to be changed
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="font-bold">
                                        Amount Payable:
                                      </span>
                                      to be changed
                                    </div>
                                    <div className="flex justify-between mb-2">
                                      <span className="font-bold">
                                        Required Race:
                                      </span>
                                      to be changed
                                    </div>
                                    <div className="flex justify-between mb-2">
                                      <span className="font-bold">
                                        Required Gender:
                                      </span>
                                      to be changed
                                    </div>
                                    <div className="flex justify-between mb-2">
                                      <span className="font-bold">
                                        Veteran Only:
                                      </span>
                                      to be changed
                                    </div>
                                    <div className="flex justify-between mb-2">
                                      <span className="font-bold">
                                        Number of Grants Available:
                                      </span>
                                      to be changed
                                    </div>
                                    <div className="flex justify-between mb-2">
                                      <span className="font-bold">
                                        Date Posted:
                                      </span>
                                      to be changed
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="font-bold">
                                        Grant Status:
                                      </span>
                                      to be changed
                                    </div>
                                    {/* add more  */}
                                  </div>
                                </div>
                                <h2 className="text-black font-semibold mb-2">
                                  Grant's Description
                                </h2>
                                <div className="bg-slate-100 border-2  rounded p-6">
                                  <div className="flex justify-between mb-4 text-md">
                                    to be changed
                                  </div>
                                </div>
                                <h2 className="text-black font-semibold mb-2 mt-5">
                                  Applicant's Information
                                </h2>
                                <div className="bg-slate-100 border-2  rounded p-6">
                                  <div className="flex justify-between mb-4 text-md">
                                    <span className="font-bold">
                                      Applicant Email:
                                    </span>
                                    {claim.email}
                                  </div>
                                  <div className="flex justify-between mb-4 text-md">
                                    <span className="font-bold">Age:</span>
                                    {claim.profileData.age}
                                  </div>
                                  <div className="flex justify-between mb-4 text-md">
                                    <span className="font-bold">
                                      Nationality:
                                    </span>
                                    {claim.profileData.nationality}
                                  </div>
                                  <div className="flex justify-between mb-4 text-md">
                                    <span className="font-bold">Race:</span>
                                    {claim.profileData.race}
                                  </div>
                                  <div className="flex justify-between items-center mb-4">
                                    <span className="font-bold">
                                      Veteran Status:
                                    </span>
                                    {claim.profileData.veteran}
                                  </div>
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold">
                                      Date Submitted:
                                    </span>
                                    {claim.dateSubmitted}
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
                                <p className="mb-2 text-md">{claim.email}</p>
                                <p className="mb-2">title</p>
                                <div className="flex justify-between items-center">
                                  <p>Date Submitted: {claim.dateSubmitted}</p>
                                  <p>Amount Payable: TBC</p>
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
