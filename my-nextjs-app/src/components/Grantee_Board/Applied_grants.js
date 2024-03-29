"use client";
import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ViewAnswers from "../GrantForm/ViewAnswers";
import ThemeContext from "../utils/ThemeContext";
import ColourBlindnessContext from "@/components/utils/ColorBlindnessContext";
import ReducedMotionContext from "../utils/ReducedMotionContext";
import { getcbMode } from "@/components/utils/cbMode";
import Link from "next/link";

const Applied_Grants = ({ applications }) => {
  const router = useRouter()
  const userData = JSON.parse(sessionStorage.getItem('userData'))
  const cbMode = useContext(ColourBlindnessContext)
  const { protanopia, deuteranopia, tritanopia } = getcbMode(cbMode)
  const isReducedMotion = useContext(ReducedMotionContext)
  const theme = useContext(ThemeContext)

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
    if(filters.status !== '0'){
      newFilters["status"] = parseInt(filters.status)
    }
    if(filters.maxAmount){
      newFilters["maxAmount"] = filters.maxAmount
    }
    return newFilters
  }

  const handleFilteredApplications = async (e, filters) => {
    e.preventDefault()
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userData.token}`
    }
    const newFilters = filterFiltersForBackend(filters)
    const body = {
        Email: userData.email,
        Filters: newFilters,
    }

    try{
      const res = await axios.post("http://localhost:5000/getFilteredGranteeApplications", body, {headers: headers})
      setAllApplications(res.data)
    }
    catch(error){
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else if (error.request) {
        console.log("No response received:", error.request);
      } else {
        console.log("Error:", error.message);
      }
    }
  };

  const defaultFilters = {
    dateSubmitted: "",
    status: 0,
    titleKeyword: "",
    deadline: "",
    maxAmount: 0,
  }

  const grantsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedApplicationId, setExpandedApplicationId] = useState(null);
  const [filters, setFilters] = useState(defaultFilters)
  const [allApplications, setAllApplications] = useState(applications)

  const indexOfLastGrant = currentPage * grantsPerPage;
  const indexOfFirstGrant = indexOfLastGrant - grantsPerPage;
  const currentGrants = allApplications.slice(indexOfFirstGrant, indexOfLastGrant);
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    setExpandedApplicationId(null); // Collapse any expanded card when paginating
  };

  const toggleCardExpansion = (id) => {
    if (expandedApplicationId === id) {
      // If already expanded, shrink the card
      setExpandedApplicationId(null);
    } else {
      setExpandedApplicationId(id);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 3:
        return protanopia ? "custom-green-background-pt" : deuteranopia ? "custom-green-background-dt" : tritanopia ? "custom-green-background-tr" : "custom-green-background";; // Green for approved
      case 2:
        return "bg-red-600"; // Red for rejected
      case 1:
        return protanopia ? "custom-yellow-background-pt" : deuteranopia ? "custom-yellow-background-dt" : tritanopia ? "custom-yellow-background-tr" : "bg-yellow-600";; // Yellow for pending
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
    console.log(e.target.value)
    setFilters(prevFilters => ({...prevFilters, status:e.target.value}))
  }

  function onChangeMaxAmount(e){
    setFilters(prevFilters => ({...prevFilters, maxAmount:e.target.valueAsNumber}))
  }

  return (
    <div
      className={`flex items-center justify-center flex-grow py-10 ${theme === 'light' ? "" : "d-custom-navy-background border-t border-white"}`}
      style={{
        backgroundImage:`${theme === 'light' ? "url('https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcm00MjItMDQ3LWtxOTJ3eDl5LmpwZw.jpg')" : ""}`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="flex justify-center w-full">
        <div className="max-w-7xl w-full mx-auto px-4">
          <div className="mt-10 bg-sky-50 dark:d-custom-dark-grey-background dark:border dark:border-white rounded-lg shadow overflow-hidden mb-6">
            <div className="flex flex-col items-start">
              <Link 
                href="/grantee_dashboard" 
                className="dark:d-text underline px-4 pt-4 hover:scale-105"
                aria-label="back to grantee dashboard"
              >
                Back
              </Link>
              <h1 tabIndex={0} className="dark:d-text lg:text-4xl md:text-3xl text-3xl text-center sm:text-left font-semibold px-4 py-6">
                Application History
              </h1>
            </div>
            

            <div className="flex lg:flex-row md:flex-row flex-col">
              <div className="lg:w-1/4 md:w-1/4 w-full p-4">
                <div className="flex justify-between items-center">
                  <h2 tabIndex={0} className="font-bold text-lg mb-4 dark:d-text">Filters</h2>
                  <button 
                    onClick={() => {
                      setAllApplications(applications)
                      setFilters(defaultFilters)
                    }}
                    className={`mb-4 text-sm font-semibold bg-gray-500 text-white px-3 py-1 hover:scale-105 rounded ${isReducedMotion ? "" : 'transition-colors ease-in-out duration-150'} hover:bg-[#d76b65]`}>
                    Reset Filters
                  </button>
                </div>
                {/* Filter form */}
                <form onSubmit={(e) => handleFilteredApplications(e, filters)}>
                  <div className="mb-4">
                    <label
                      id="titleLabel"
                      htmlFor="title"
                      className="block mb-2 dark:d-text"
                    >
                      Title:
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={filters.titleKeyword}
                      onChange={onChangeTitle}
                      className="w-full p-2 border border-black rounded dark:d-custom-dark-grey-background dark:d-text"
                      placeholder="Enter keywords in title"
                      tabIndex={0}
                      aria-labelledby="titleLabel"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      id="dateSubmittedLabel"
                      htmlFor="dateSubmitted"
                      className="block mb-2 dark:d-text"
                    >
                      Date Submitted:
                    </label>
                    <input
                      type="date"
                      id="dateSubmitted"
                      value={filters.dateSubmitted}
                      onChange={onChangeDateSubmitted}
                      className="w-full p-2 border border-black rounded dark:d-custom-dark-grey-background dark:d-text"
                      tabIndex={0}
                      aria-labelledby="dateSubmittedLabel"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      id="deadlineLabel"
                      htmlFor="deadline"
                      className="block mb-2 border-black dark:d-text"
                    >
                      Deadline:
                    </label>
                    <input
                      type="date"
                      id="deadline"
                      value={filters.deadline}
                      onChange={onChangeDeadline}
                      className="w-full p-2 border border-black rounded dark:d-custom-dark-grey-background dark:d-text"
                      tabIndex={0}
                      aria-labelledby="deadlineLabel"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="status" className="block mb-2 dark:d-text">
                      Status:
                    </label>
                    <select
                      id="status"
                      className="w-full p-2 border  border-black rounded dark:d-custom-dark-grey-background dark:d-text"
                      value={filters.status}
                      onChange={onChangeStatus}
                    >
                      <option key="All" value={0}>All</option>
                      <option key="Approved" value={3}>Approved</option>
                      <option key="Rejected" value={2}>Rejected</option>
                      <option key="Pending" value={1}>Pending</option>
                    </select>
                  </div>
                  <div className="mb-6">
                    <label
                      id="maxAmountLabel"
                      htmlFor="maxAmount"
                      className="block mb-2 dark:d-text"
                    >
                      Maximum Payable Amount:
                    </label>
                    <input
                      type="number"
                      id="maxAmount"
                      value={filters.maxAmount}
                      onChange={onChangeMaxAmount}
                      className="w-full p-2 border border-black rounded dark:d-custom-dark-grey-background dark:d-text"
                      placeholder="Enter maximum amount"
                      tabIndex={0}
                      aria-labelledby="maxAmountLabel"
                    />
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className={`text-white w-full px-5 py-2 rounded-full hover:scale-105 ${isReducedMotion ? "" : "transition-colors"} text-sm sm:text-base ${protanopia ? "custom-green-background-pt" : deuteranopia ? "custom-green-background-dt" : tritanopia ? "custom-green-background-tr" : "custom-green-background"}`}
                    >
                      Filter
                    </button>
                  </div>
                  <div className="border-2 border-black mt-10 lg:hidden md:hidden block"></div>
                </form>
              </div>

              <div className="w-full lg:w-3/4 p-4">
                <h2 tabIndex={0} className="font-bold text-lg mb-4 dark:d-text">
                  Applied Grants
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 dark:d-text mt-3">
                  {currentGrants.map((claim) => {
                    // Check if the card should be expanded or if no card is expanded
                    const shouldDisplay =
                      expandedApplicationId === null ||
                      expandedApplicationId === claim.ApplicationData.applicationID;

                    // Only render the card if it should be displayed based on the above condition
                    if (shouldDisplay) {
                      return (
                        <div
                          key={claim.ApplicationData.applicationID}
                          className={`p-1 ${isReducedMotion ? "" : 'transition-all duration-500 ease-in-out'} ${
                            expandedApplicationId === claim.ApplicationData.applicationID
                              ? "scale-100 opacity-100"
                              : "scale-95"
                          } ${
                            expandedApplicationId === claim.ApplicationData.applicationID
                              ? "col-span-3 lg:col-span-3"
                              : "md:col-span-2 lg:col-span-1"
                          }`}
                        >
                          <div
                            className={`${getStatusColor(
                              claim.ApplicationData.status
                            )} h-2 w-full rounded-t-lg`}
                          ></div>

                          <div className="bg-white dark:d-custom-dark-grey-background dark:border dark:border-white p-2 rounded-lg shadow shadow-xl">
                            <div className="flex justify-between items-center mb-4">
                              <p tabIndex={0} className="text-md">
                                Status:{" "}
                                {getStatusText(claim.ApplicationData.status)}
                              </p>
                              <button
                                onClick={() =>
                                  toggleCardExpansion(
                                    expandedApplicationId ===
                                      claim.ApplicationData.applicationID
                                      ? null
                                      : claim.ApplicationData.applicationID
                                  )
                                }
                                className={`text-md hover:underline ${isReducedMotion ? "" : "transition duration-150 ease-in-out"} ${protanopia ? "custom-green-pt dark:d-custom-green-color-blind" : deuteranopia ? "custom-green-dt dark:d-custom-green-color-blind" : tritanopia ? "custom-green-tr dark:d-custom-green-color-blind-tr" : "custom-green"}`}
                                aria-label={expandedApplicationId === claim.ApplicationData.applicationID ? "Close application details" : "View application details"}
                              >
                                {expandedApplicationId ===
                                claim.ApplicationData.applicationID
                                  ? "Close"
                                  : "View Details"}
                              </button>
                            </div>

                            <div className="border-t border-gray-300 mb-5"></div>
                            {expandedApplicationId ===
                            claim.ApplicationData.applicationID ? (
                              <div>
                                {/* Expanded view content */}
                                <div className="mb-5 ">
                                  <div className="flex justify-between">
                                    <h2 tabIndex={0} className="dark:d-text font-semibold mb-2">
                                      Grant's Information
                                    </h2>
                                  </div>
                                  <div className="bg-slate-100 dark:d-custom-dark-grey-background dark:d-text border-2 rounded p-6">
                                    <div className="flex justify-between mb-2">
                                      <span tabIndex={0} className="font-bold dark:d-text">Title:</span>
                                      <p tabIndex={0}>{claim.GrantData.Title}</p>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                      <span tabIndex={0} className="font-bold">
                                        Provider Email:
                                      </span>
                                      <p tabIndex={0}>{claim.GrantData.grantorEmail}</p>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                      <span tabIndex={0} className="font-bold dark:d-text">
                                        Amount Payable:
                                      </span>
                                      <p tabIndex={0}>${claim.GrantData.AmountPerApp}</p>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                      <span tabIndex={0} className="font-bold dark:d-text">Age:</span>
                                      <p tabIndex={0}>
                                        {claim.GrantData.profileReqs.minAge === 0 && claim.GrantData.profileReqs.maxAge === 0 ?
                                          "N/A"
                                        :
                                          claim.GrantData.profileReqs.minAge + '-' + claim.GrantData.profileReqs.maxAge
                                        }
                                      </p>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                      <span tabIndex={0} className="font-bold dark:d-text">
                                        Required Race:
                                      </span>
                                      <p tabIndex={0}>
                                        {claim.GrantData.profileReqs.race.length > 0 ?
                                          claim.GrantData.profileReqs.race.join(
                                            ", "
                                          )
                                        :
                                          "N/A"
                                        }
                                      </p>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                      <span tabIndex={0} className="font-bold dark:d-text">
                                        Required Gender:
                                      </span>
                                      <p tabIndex={0}>
                                        {claim.GrantData.profileReqs.gender.length > 0 ?
                                          claim.GrantData.profileReqs.gender.join(
                                            ", "
                                          )
                                        :
                                          "N/A"
                                        }
                                      </p>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                      <span tabIndex={0} className="font-bold dark:d-text">
                                        Veteran Only:
                                      </span>
                                      <p tabIndex={0}>
                                        {claim.GrantData.profileReqs?.veteran === 0
                                        ? "No"
                                        : claim.GrantData.profileReqs?.veteran === 1 ?
                                          "Yes"
                                          :
                                          "N/A"
                                        }
                                      </p>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                      <span tabIndex={0} className="font-bold">
                                        Number of Grants Available:
                                      </span>
                                      <p tabIndex={0}>{claim.GrantData.MaxWinners}</p>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                      <span tabIndex={0} className="font-bold dark:d-text">
                                        Date Posted:
                                      </span>
                                      <p tabIndex={0}>{claim.GrantData.PostedDate}</p>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                      <span tabIndex={0} className="font-bold dark:d-text">
                                        Grant Status:
                                      </span>
                                      <p tabIndex={0}>{claim.GrantData.Active ? "Yes" : "No"}</p>
                                    </div>
                                  </div>
                                </div>
                                <h2 tabIndex={0} className="dark:d-text font-semibold mb-2">
                                  Grant's Description
                                </h2>
                                <div className="bg-slate-100 dark:d-custom-dark-grey-background dark:d-text border-2 rounded p-6">
                                  <p tabIndex={0} className="mb-4 text-md">
                                    {claim.GrantData.Description}
                                  </p>
                                </div>
                                <h2 tabIndex={0} className="dark:d-text font-semibold mb-2 mt-5">
                                  Applicant's Information
                                </h2>
                                <div className="bg-slate-100 dark:d-custom-dark-grey-background dark:d-text border-2 rounded p-6">
                                  <div className="flex justify-between mb-4">
                                    <span tabIndex={0} className="font-bold">
                                      Applicant Email:
                                    </span>
                                    <p tabIndex={0}>{claim.ApplicationData.email}</p>
                                  </div>
                                  <div className="flex justify-between mb-4 text-md">
                                    <span tabIndex={0} className="font-bold">Age:</span>
                                    <p tabIndex={0}>{claim.ApplicationData.profileData?.age ? claim.ApplicationData.profileData.age : "N/A"}</p>
                                  </div>
                                  <div className="flex justify-between mb-4 text-md">
                                    <span tabIndex={0} className="font-bold">
                                      Nationality:
                                    </span>
                                    <p tabIndex={0}>{claim.ApplicationData.profileData?.nationality ? claim.ApplicationData.profileData.nationality : "N/A"}</p>
                                  </div>
                                  <div className="flex justify-between mb-4 text-md">
                                    <span tabIndex={0} className="font-bold">Race:</span>
                                    <p tabIndex={0}>{claim.ApplicationData.profileData?.race ? claim.ApplicationData.profileData.race : "N/A"}</p>
                                  </div>
                                  <div className="flex justify-between items-center mb-4">
                                    <span tabIndex={0} className="font-bold">
                                      Veteran Status:
                                    </span>
                                    <p tabIndex={0}>
                                      {claim.ApplicationData.profileData?.veteran === 0
                                        ? "No"
                                        : claim.ApplicationData.profileData?.veteran === 1 ?
                                          "Yes"
                                          :
                                          "N/A"
                                      }
                                    </p>
                                  </div>
                                  <div className="flex justify-between items-center mb-2">
                                    <span tabIndex={0} className="font-bold">
                                      Date Submitted:
                                    </span>
                                    <p tabIndex={0}>{claim.ApplicationData.dateSubmitted}</p>
                                  </div>
                                </div>
                                <h2 tabIndex={0} className="dark:d-text font-semibold mb-2 mt-5">
                                  Applicant's Response
                                </h2>

                                <div className="bg-slate-100 dark:d-custom-dark-grey-background border-2 rounded p-6">
                                  <ViewAnswers questionData={claim.GrantData.QuestionData} answerData={claim.ApplicationData.answers} />
                                </div>
                              </div>
                            ) : (
                              <div>
                                {/* Small view content */}
                                <p tabIndex={0} className="mb-2 text-md dark:d-text">
                                  {claim.ApplicationData.email}
                                </p>
                                <p tabIndex={0} className="mb-2 dark:d-text">{claim.GrantData.Title}</p>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center dark:d-text">
                                  <div>
                                    <p tabIndex={0}>Date Submitted:</p>
                                    <p tabIndex={0}>{claim.ApplicationData.dateSubmitted}</p>
                                  </div>
                                  <div>
                                    <p tabIndex={0}>Amount Payable:</p>
                                    <p tabIndex={0}>${claim.GrantData.AmountPerApp}</p>
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
                      className={`px-2 py-2 mr-5 text-sm font-semibold text-white hover:scale-105 rounded-full w-1/4 ${protanopia ? "custom-green-background-pt" : deuteranopia ? "custom-green-background-dt" : tritanopia ? "custom-green-background-tr" : "custom-green-background"}`}
                      aria-label="Previous page of applications"
                    >
                      Previous
                    </button>
                  )}
                  {indexOfLastGrant < allApplications.length && (
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      className={`px-4 py-2 mx-1 text-sm font-semibold text-white hover:scale-105 rounded-full w-1/4 ${protanopia ? "custom-green-background-pt" : deuteranopia ? "custom-green-background-dt" : tritanopia ? "custom-green-background-tr" : "custom-green-background"}`}
                      aria-label="Next page of applications"
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
