"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const Applied_Grants = ({ applications }) => {
  const router = useRouter()
  const userData = JSON.parse(sessionStorage.getItem('userData'))

  if(!userData){
    router.push('/login')
  }

  function filterFiltersForBackend(filters){
    let newFilters = {}

    if(filters.titleKeyword){
      newFilters["titleKeyword"] = filters.titleKeyword
    }
    if(filters.dateSubmitted){
      newFilters["dateSubmitted"] = filters.dateSubmitted
    }
    if(filters.deadline){
      newFilters["deadline"] = filters.deadline
    }
    if(filters.status){
      newFilters["status"] = parseInt(filters.status)
    }
    if(filters.maxAmount){
      newFilters["maxAmount"] = filters.maxAmount
    }

    return newFilters
  }

  const handleFilteredApplications = (e, filters) => {
    e.preventDefault()

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userData.token}`
    }

    const newFilters = filterFiltersForBackend(filters)

    console.log(newFilters)

    axios
      .post("http://localhost:5000/getFilteredGranteeApplications", {
        Email: userData.email,
        Filters: newFilters,
      },
      {headers: headers})
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.status);
          console.log(error.response.data);
        } else if (error.request) {
          console.log("No response received:", error.request);
        } else {
          console.log("Error:", error.message);
        }
      });
  };

  // const allGrants = [
  //   {
  //     ApplicationData: {
  //       answerData: [
  //         {
  //           options: {
  //             answerType: "short",
  //             isMultipleLines: false,
  //             maxCharsNum: 16,
  //             minCharsNum: 1,
  //           },
  //           text: "Bob",
  //         },
  //       ],
  //       dateSubmitted: "2024-03-14",
  //       email: "applicant@website.com",
  //       grantID: "6600e2c08d8b0bba26e30a6c",
  //       profileData: {
  //         age: 21,
  //         gender: "Man",
  //         nationality: "Canadian",
  //         race: "White",
  //         veteran: 0,
  //       },
  //       status: 1,
  //     },
  //     GrantData: {
  //       Active: true,
  //       AmountPerApp: 1499.99,
  //       AppliedIDs: [],
  //       Deadline: "2024-04-05",
  //       Description: "Do apply to this grant",
  //       MaxWinners: 10,
  //       NumWinners: 0,
  //       PostedDate: "2024-04-01",
  //       QuestionData: [
  //         {
  //           isRequired: true,
  //           options: {
  //             answerType: "short",
  //             isMultipleLines: false,
  //             maxCharsNum: 16,
  //             minCharsNum: 1,
  //           },
  //           question: "What is your name?",
  //           type: "textbox",
  //         },
  //       ],
  //       Title: "A Generous Grant",
  //       WinnerIDs: [],
  //       grantID: "6600e2c08d8b0bba26e30a6c",
  //       grantorEmail: "grantor@website.com",
  //       profileReqs: {
  //         gender: ["Man", "Woman", "Non-binary"],
  //         maxAge: 24,
  //         minAge: 18,
  //         nationality: ["Canadian", "American"],
  //         race: ["Asian", "African American", "White"],
  //         veteran: 0,
  //       },
  //     },
  //   },
  //   {
  //     ApplicationData: {
  //       answerData: [
  //         {
  //           options: {
  //             answerType: "short",
  //             isMultipleLines: false,
  //             maxCharsNum: 16,
  //             minCharsNum: 1,
  //           },
  //           text: "Bob",
  //         },
  //       ],
  //       dateSubmitted: "2024-03-14",
  //       email: "applicant@website.com",
  //       grantID: "6600e2c08d8b0bba26e3a6c",
  //       profileData: {
  //         age: 21,
  //         gender: "Man",
  //         nationality: "Canadian",
  //         race: "White",
  //         veteran: 1,
  //       },
  //       status: 2,
  //     },
  //     GrantData: {
  //       Active: true,
  //       AmountPerApp: 1499.99,
  //       AppliedIDs: [],
  //       Deadline: "2024-04-05",
  //       Description: "Do apply to this grant",
  //       MaxWinners: 10,
  //       NumWinners: 0,
  //       PostedDate: "2024-04-01",
  //       QuestionData: [
  //         {
  //           isRequired: true,
  //           options: {
  //             answerType: "short",
  //             isMultipleLines: false,
  //             maxCharsNum: 16,
  //             minCharsNum: 1,
  //           },
  //           question: "What is your name?",
  //           type: "textbox",
  //         },
  //       ],
  //       Title: "A Generous Grant",
  //       WinnerIDs: [],
  //       grantID: "6600e2c08d8b0bba26e30a6c",
  //       grantorEmail: "grantor@website.com",
  //       profileReqs: {
  //         gender: ["Man", "Woman", "Non-binary"],
  //         maxAge: 24,
  //         minAge: 18,
  //         nationality: ["Canadian", "American"],
  //         race: ["Asian", "African American", "White"],
  //         veteran: 1,
  //       },
  //     },
  //   },
  //   {
  //     ApplicationData: {
  //       answerData: [
  //         {
  //           options: {
  //             answerType: "short",
  //             isMultipleLines: false,
  //             maxCharsNum: 16,
  //             minCharsNum: 1,
  //           },
  //           text: "Bob",
  //         },
  //       ],
  //       dateSubmitted: "2024-03-14",
  //       email: "applicant@website.com",
  //       grantID: "6600e2c08d8b0bba260a6c",
  //       profileData: {
  //         age: 21,
  //         gender: "Man",
  //         nationality: "Canadian",
  //         race: "White",
  //         veteran: 1,
  //       },
  //       status: 0,
  //     },
  //     GrantData: {
  //       Active: true,
  //       AmountPerApp: 1499.99,
  //       AppliedIDs: [],
  //       Deadline: "2024-04-05",
  //       Description: "Do apply to this grant",
  //       MaxWinners: 10,
  //       NumWinners: 0,
  //       PostedDate: "2024-04-01",
  //       QuestionData: [
  //         {
  //           isRequired: true,
  //           options: {
  //             answerType: "short",
  //             isMultipleLines: false,
  //             maxCharsNum: 16,
  //             minCharsNum: 1,
  //           },
  //           question: "What is your name?",
  //           type: "textbox",
  //         },
  //       ],
  //       Title: "A Generous Grant",
  //       WinnerIDs: [],
  //       grantID: "6600e2c08d8b0bba26e30a6c",
  //       grantorEmail: "grantor@website.com",
  //       profileReqs: {
  //         gender: ["Man", "Woman", "Non-binary"],
  //         maxAge: 24,
  //         minAge: 18,
  //         nationality: ["Canadian", "American"],
  //         race: ["Asian", "African American", "White"],
  //         veteran: 1,
  //       },
  //     },
  //   },
  // ];
  const defaultFilters = {
    dateSubmitted: "",
    status: 0,
    titleKeyword: "",
    deadline: "",
    maxAmount: 0,
  }

  const grantsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedGrantId, setExpandedGrantId] = useState(null);
  const [filters, setFilters] = useState(defaultFilters)

  const indexOfLastGrant = currentPage * grantsPerPage;
  const indexOfFirstGrant = indexOfLastGrant - grantsPerPage;
  const currentGrants = applications.slice(indexOfFirstGrant, indexOfLastGrant);
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

  function onChangeTitle(e){
    setFilters(prevFilters => ({...prevFilters, titleKeyword:e.target.value}))
  }

  function onChangeDateSubmitted(e){
    setFilters(prevFilters => ({...prevFilters, dateSubmitted:e.target.value}))
  }

  function onChangeDeadline(e){
    setFilters(prevFilters => ({...prevFilters, deadline:e.target.value}))
  }

  function onChangeStatus(e){
    setFilters(prevFilters => ({...prevFilters, status:e.target.valueAsNumber}))
  }

  function onChangeMaxAmount(e){
    setFilters(prevFilters => ({...prevFilters, maxAmount:e.target.valueAsNumber}))
  }

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
              Application History
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
                <form onSubmit={(e) => handleFilteredApplications(e, filters)}>
                  <div className="mb-4">
                    <label
                      htmlFor="title"
                      className="block mb-2 text-black"
                    >
                      Title:
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={filters.titleKeyword}
                      onChange={onChangeTitle}
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
                      value={filters.dateSubmitted}
                      onChange={onChangeDateSubmitted}
                      className="w-full p-2 border border-black rounded text-black"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="deadline"
                      className="block mb-2 border-black text-black"
                    >
                      Deadline:
                    </label>
                    <input
                      type="date"
                      id="deadline"
                      value={filters.deadline}
                      onChange={onChangeDeadline}
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
                      value={filters.status}
                      onChange={onChangeStatus}
                    >
                      <option value={0}>All</option>
                      <option value={3}>Approved</option>
                      <option value={2}>Rejected</option>
                      <option value={1}>Pending</option>
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
                      value={filters.maxAmount}
                      onChange={onChangeMaxAmount}
                      className="w-full p-2 border border-black rounded text-black"
                      placeholder="Enter maximum amount"
                    />
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="bg-green-600 text-white w-full px-5 py-2 rounded-full hover:bg-green-800 transition-colors text-sm sm:text-base"
                    >
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
                      expandedGrantId === claim.ApplicationData.grantID;

                    // Only render the card if it should be displayed based on the above condition
                    if (shouldDisplay) {
                      return (
                        <div
                          key={claim.ApplicationData.grantID}
                          className={` p-1 transition-all duration-500 ease-in-out ${
                            expandedGrantId === claim.ApplicationData.grantID
                              ? "scale-100 opacity-100"
                              : "scale-95 opacity-75"
                          } ${
                            expandedGrantId === claim.ApplicationData.grantID
                              ? "col-span-3 lg:col-span-3"
                              : "md:col-span-2 lg:col-span-1"
                          }`}
                        >
                          <div
                            className={`${getStatusColor(
                              claim.ApplicationData.status
                            )} h-2 w-full rounded-t-lg`}
                          ></div>

                          <div className="bg-white p-2 rounded-lg shadow shadow-xl">
                            <div className="flex justify-between items-center mb-4">
                              <p className="text-md">
                                Status:{" "}
                                {getStatusText(claim.ApplicationData.status)}
                              </p>
                              <button
                                onClick={() =>
                                  toggleCardExpansion(
                                    expandedGrantId ===
                                      claim.ApplicationData.grantID
                                      ? null
                                      : claim.ApplicationData.grantID
                                  )
                                }
                                className="text-green-700 text-md hover:text-green-900 transition duration-150 ease-in-out"
                              >
                                {expandedGrantId ===
                                claim.ApplicationData.grantID
                                  ? "Close"
                                  : "View Details"}
                              </button>
                            </div>

                            <div className="border-t border-gray-300 mb-5"></div>
                            {expandedGrantId ===
                            claim.ApplicationData.grantID ? (
                              <div>
                                {/* Expanded view content */}
                                <div className="mb-5">
                                  <div className="flex justify-between">
                                    <h2 className="text-black font-semibold mb-2">
                                      Grant's Information
                                    </h2>
                                  </div>
                                  <div className="bg-slate-100 border-2 rounded p-6">
                                    <div className="flex justify-between mb-2">
                                      <span className="font-bold">Title:</span>
                                      {claim.GrantData.Title}
                                    </div>
                                    <div className="flex justify-between mb-2">
                                      <span className="font-bold">
                                        Provider Email:
                                      </span>
                                      {claim.GrantData.grantorEmail}
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="font-bold">
                                        Amount Payable:
                                      </span>
                                      {claim.GrantData.AmountPerApp}
                                    </div>
                                    <div className="flex justify-between mb-2">
                                      <span className="font-bold">Age:</span>
                                      {
                                        claim.GrantData.profileReqs.minAge
                                      } - {claim.GrantData.profileReqs.maxAge}
                                    </div>
                                    <div className="flex justify-between mb-2">
                                      <span className="font-bold">
                                        Required Race:
                                      </span>
                                      {claim.GrantData.profileReqs.race.join(
                                        ", "
                                      )}
                                    </div>
                                    <div className="flex justify-between mb-2">
                                      <span className="font-bold">
                                        Required Gender:
                                      </span>
                                      {claim.GrantData.profileReqs.gender.join(
                                        ", "
                                      )}
                                    </div>
                                    <div className="flex justify-between mb-2">
                                      <span className="font-bold">
                                        Veteran Only:
                                      </span>
                                      {claim.GrantData.profileReqs.veteran === 0
                                        ? "No"
                                        : "Yes"}
                                    </div>
                                    <div className="flex justify-between mb-2">
                                      <span className="font-bold">
                                        Number of Grants Available:
                                      </span>
                                      {claim.GrantData.MaxWinners}
                                    </div>
                                    <div className="flex justify-between mb-2">
                                      <span className="font-bold">
                                        Date Posted:
                                      </span>
                                      {claim.GrantData.PostedDate}
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="font-bold">
                                        Grant Status:
                                      </span>
                                      {claim.GrantData.Active ? "Yes" : "No"}
                                    </div>
                                  </div>
                                </div>
                                <h2 className="text-black font-semibold mb-2">
                                  Grant's Description
                                </h2>
                                <div className="bg-slate-100 border-2  rounded p-6">
                                  <div className="flex justify-between mb-4 text-md">
                                    {claim.GrantData.Description}
                                  </div>
                                </div>
                                <h2 className="text-black font-semibold mb-2 mt-5">
                                  Applicant's Information
                                </h2>
                                <div className="bg-slate-100 border-2  rounded p-6">
                                  <div className="flex justify-between mb-4">
                                    <span className="font-bold">
                                      Applicant Email:
                                    </span>
                                    {claim.ApplicationData.email}
                                  </div>
                                  <div className="flex justify-between mb-4 text-md">
                                    <span className="font-bold">Age:</span>
                                    {claim.ApplicationData.profileData.age}
                                  </div>
                                  <div className="flex justify-between mb-4 text-md">
                                    <span className="font-bold">
                                      Nationality:
                                    </span>
                                    {
                                      claim.ApplicationData.profileData
                                        .nationality
                                    }
                                  </div>
                                  <div className="flex justify-between mb-4 text-md">
                                    <span className="font-bold">Race:</span>
                                    {claim.ApplicationData.profileData.race}
                                  </div>
                                  <div className="flex justify-between items-center mb-4">
                                    <span className="font-bold">
                                      Veteran Status:
                                    </span>
                                    {claim.ApplicationData.profileData
                                      .veteran === 0
                                      ? "No"
                                      : "Yes"}
                                  </div>
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold">
                                      Date Submitted:
                                    </span>
                                    {claim.ApplicationData.dateSubmitted}
                                  </div>
                                </div>
                                <h2 className="text-black font-semibold mb-2 mt-5">
                                  Applicant's Response
                                </h2>

                                <div className="bg-slate-100 border-2 rounded p-6">
                                  {claim.GrantData.QuestionData.map(
                                    (question, index) => (
                                      <div key={index}>
                                        <div className="mb-2">
                                          <span className="font-bold">
                                            Question {index + 1}:{" "}
                                            <span className="text-red-400">
                                              {question.question}
                                            </span>
                                          </span>
                                        </div>
                                        <div className="mb-8 mt-2">
                                          <span className="font-bold">
                                            Answer:{" "}
                                            <span className="text-red-400">
                                              {claim.ApplicationData
                                                .answerData[0].text ||
                                                "No answer provided"}
                                            </span>
                                          </span>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div>
                                {/* Small view content */}
                                <p className="mb-2 text-md">
                                  {claim.ApplicationData.email}
                                </p>
                                <p className="mb-2">{claim.GrantData.Title}</p>
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p>Date Submitted:</p>
                                    <p>{claim.ApplicationData.dateSubmitted}</p>
                                  </div>
                                  <div>
                                    <p>Amount Payable:</p>
                                    <p>{claim.GrantData.AmountPerApp}</p>
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
                      className="px-2 py-2 mr-5 text-sm font-semibold text-white bg-green-600 rounded-full w-1/4 hover:bg-green-800"
                    >
                      Previous
                    </button>
                  )}
                  {indexOfLastGrant < applications.length && (
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
