"use client";

import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import ThemeContext from "../utils/ThemeContext";
import ColourBlindnessContext from "@/components/utils/ColorBlindnessContext";
import ReducedMotionContext from "../utils/ReducedMotionContext";
import { getcbMode } from "@/components/utils/cbMode";

const Search_grants = ({ grants }) => {
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
    if(filters.gender){
      newFilters["gender"] = filters.gender
    }
    if(filters.race){
      newFilters["race"] = filters.race
    }
    if(filters.nationality){
      newFilters["nationality"] = filters.nationality
    }
    if(filters.datePostedBefore){
      newFilters["datePostedBefore"] = filters.datePostedBefore
    }
    if(filters.datePostedAfter){
      newFilters["datePostedAfter"] = filters.datePostedAfter
    }
    if(filters.deadline){
      newFilters["deadline"] = filters.deadline
    }
    if(filters.status !== "notEmpty"){
      const status = filters.status === 'true'
      newFilters["status"] = status
    }
    if(filters.email){
      newFilters["email"] = filters.email
    }
    if(filters.minAge){
      newFilters["minAge"] = filters.minAge
    }
    if(filters.maxAge){
      newFilters["maxAge"] = filters.maxAge
    }
    if(filters.minAmount){
      newFilters["minAmount"] = filters.minAmount
    }
    if(filters.maxAmount){
      newFilters["maxAmount"] = filters.maxAmount
    }
    if(filters.veteran !== 2){
      newFilters["veteran"] = parseInt(filters.veteran)
    }
    if(filters.maxWinners){
      newFilters["maxWinners"] = filters.maxWinners
    }

    return newFilters
  }

  async function handleFilteredGrants(filters){
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userData.token}`
    }

    const newFilters = filterFiltersForBackend(filters)
    console.log(newFilters)

    try{
      const res = await axios.post("http://localhost:5000/getFilteredGrants", newFilters, {headers: headers})
      setAllGrants(res.data)
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
    
  }

  const defaultFilters = {
    titleKeyword: "",
    gender: "",
    race: "",
    nationality: "",
    datePostedBefore: "",
    datePostedAfter: "",
    deadline: "",
    status: "notEmpty",
    email: "",
    minAge: 0,
    maxAge: 0,
    minAmount: 0,
    maxAmount: 0,
    veteran: 2,
    maxWinners: 0,
  }

  const [isFormVisible, setIsFormVisible] = useState(true);
  const [expandedGrantId, setExpandedGrantId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState(defaultFilters)
  const [allGrants, setAllGrants] = useState(grants)

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

  function onChangeTitle(e){
    setFilters(prevFilters => ({...prevFilters, titleKeyword: e.target.value}))
  }

  function onChangeGender(e){
    setFilters(prevFilters => ({...prevFilters, gender: e.target.value}))
  }

  function onChangeRace(e){
    setFilters(prevFilters => ({...prevFilters, race: e.target.value}))
  }

  function onChangeNationality(e){
    setFilters(prevFilters => ({...prevFilters, nationality: e.target.value}))
  }

  function onChangePostedBefore(e){
    setFilters(prevFilters => ({...prevFilters, datePostedBefore: e.target.value}))
  }

  function onChangePostedAfter(e){
    setFilters(prevFilters => ({...prevFilters, datePostedAfter: e.target.value}))
  }

  function onChangeDeadline(e){
    setFilters(prevFilters => ({...prevFilters, deadline: e.target.value}))
  }

  function onChangeStatus(e){
    setFilters(prevFilters => ({...prevFilters, status: e.target.value}))
  }

  function onChangeEmail(e){
    setFilters(prevFilters => ({...prevFilters, email: e.target.value}))
  }

  function onChangeMinAge(e){
    setFilters(prevFilters => ({...prevFilters, minAge: e.target.valueAsNumber}))
  }

  function onChangeMaxAge(e){
    setFilters(prevFilters => ({...prevFilters, maxAge: e.target.valueAsNumber}))
  }

  function onChangeMinAmount(e){
    setFilters(prevFilters => ({...prevFilters, minAmount: e.target.valueAsNumber}))
  }

  function onChangeMaxAmount(e){
    setFilters(prevFilters => ({...prevFilters, maxAmount: e.target.valueAsNumber}))
  }

  function onChangeVeteran(e){
    setFilters(prevFilters => ({...prevFilters, veteran: e.target.value}))
  }

  function onChangeMaxWinners(e){
    setFilters(prevFilters => ({...prevFilters, maxWinners: e.target.valueAsNumber}))
  }

  return (
    <div
      className={`flex items-center justify-center flex-grow pt-10 ${theme === 'light' ? "" : "d-custom-navy-background border-t border-white"}`}
      style={{
        backgroundImage:`${theme === 'light' ? "url('https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcm00MjItMDQ3LWtxOTJ3eDl5LmpwZw.jpg')" : ""}`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="min-h-screen p-8 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:d-custom-dark-grey-background p-6 rounded-lg shadow-xl dark:shadow-none dark:border dark:border-white">
            <div className="bg-white dark:d-custom-dark-grey-background p-6 rounded-lg">
              <div className="flex flex-col items-start">
                <Link 
                  href="/grantee_dashboard" 
                  className="dark:d-text underline hover:scale-105"
                  aria-label="back to grantee dashboard"
                >
                  Back
                </Link>
                <h1 className="dark:d-text text-3xl text-center sm:text-left font-semibold mt-8 mb-10 text-left">
                  Here we go...
                </h1>
              </div>
              
              <div tabIndex={0} className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 mb-4">
                <h2 className="text-xl font-semibold dark:d-text text-center sm:text-left">
                  What is this grant for?
                </h2>
              </div>
              <div className="mb-4 flex border border-black dark:border-white rounded">
                <svg
                  className="dark:d-text m-2 w-6 h-6"
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
                  value={filters.titleKeyword}
                  onChange={onChangeTitle}
                  placeholder="Search for keywords in title   (e.g: study, medical)"
                  className="p-2 w-full dark:d-text dark:d-custom-dark-grey-background dark:border-neutral-600 focus:dark:border-white"
                  aria-label="Search for keywords in title"
                  tabIndex={0}
                />
              </div>
              <div className="flex justify-between">
                <h2 tabIndex={0} className="text-xl font-bold dark:d-text mt-5 mb-5">
                  Filter
                </h2>
                <button
                  tabIndex={0}
                  id="toggleButton"
                  className={`${isReducedMotion ? "" : "transition-transform"}`}
                  onClick={toggleFormVisibility}
                  aria-label="toggle filter menu"
                >
                  <svg
                    className={`w-6 h-6 dark:d-text ${isReducedMotion ? "" : "transition-transform duration-200 ease-in-out"} ${
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
                className={`${isReducedMotion ? "" : "transition-all duration-700 ease-in-out"} ${
                  isFormVisible
                    ? "opacity-100 max-h-[1000px]"
                    : "opacity-0 max-h-0"
                }`}
                style={{ transitionProperty: "opacity, max-height" }}
              >
                {isFormVisible && (
                  <div className="flex flex-wrap md:flex-nowrap">
                    <div className="w-full md:w-1/2 md:pr-2">
                      <form>
                        <div className="mb-4">
                          <label
                            id="genderLabel"
                            htmlFor="gender"
                            className="block mb-2 dark:d-text"
                          >
                            Gender:
                          </label>
                          <input
                            type="text"
                            id="gender"
                            value={filters.gender}
                            onChange={onChangeGender}
                            className="w-full p-2 border border-black rounded dark:d-text dark:d-custom-dark-grey-background dark:border-neutral-600 focus:dark:border-white"
                            placeholder="All"
                            aria-labelledby="genderLabel"
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            id="raceLabel"
                            htmlFor="race"
                            className="block mb-2 dark:d-text"
                          >
                            Race:
                          </label>
                          <input
                            type="text"
                            id="race"
                            value={filters.race}
                            onChange={onChangeRace}
                            className="w-full p-2 border border-black rounded dark:d-text dark:d-custom-dark-grey-background dark:border-neutral-600 focus:dark:border-white"
                            placeholder="All"
                            aria-labelledby="raceLabel"
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            id="nationalityLabel"
                            htmlFor="nationality"
                            className="block mb-2 dark:d-text"
                          >
                            Nationality:
                          </label>
                          <input
                            type="text"
                            id="nationality"
                            value={filters.nationality}
                            onChange={onChangeNationality}
                            className="w-full p-2 border border-black rounded dark:d-text dark:d-custom-dark-grey-background dark:border-neutral-600 focus:dark:border-white"
                            placeholder="All"
                            aria-labelledby="nationalityLabel"
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            id="postedBeforeLabel"
                            htmlFor="postedBefore"
                            className="block mb-2 dark:d-text"
                          >
                            Posted Before:
                          </label>
                          <input
                            type="date"
                            id="postedBefore"
                            value={filters.datePostedBefore}
                            onChange={onChangePostedBefore}
                            className="w-full p-2 border border-black rounded dark:d-text dark:d-custom-dark-grey-background dark:border-neutral-600 focus:dark:border-white"
                            aria-labelledby="postedBeforeLabel"
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            id="postedAfterLabel"
                            htmlFor="postedAfter"
                            className="block mb-2 dark:d-text"
                          >
                            Posted After:
                          </label>
                          <input
                            type="date"
                            id="postedAfter"
                            value={filters.datePostedAfter}
                            onChange={onChangePostedAfter}
                            className="w-full p-2 border border-black rounded dark:d-text dark:d-custom-dark-grey-background dark:border-neutral-600 focus:dark:border-white"
                            aria-labelledby="postedAfterLabel"
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            id="deadlineLabel"
                            htmlFor="deadline"
                            className="block mb-2 dark:d-text"
                          >
                            Available Until:
                          </label>
                          <input
                            type="date"
                            id="deadline"
                            value={filters.deadline}
                            onChange={onChangeDeadline}
                            className="w-full p-2 border border-black rounded dark:d-text dark:d-custom-dark-grey-background dark:border-neutral-600 focus:dark:border-white"
                            aria-labelledby="deadlineLabel"
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            id="statusLabel"
                            htmlFor="status"
                            className="block mb-2 dark:d-text"
                          >
                            Status:
                          </label>
                          <select
                            id="status"
                            className="w-full p-2 border border-black rounded dark:d-text dark:d-custom-dark-grey-background dark:border-neutral-600 focus:dark:border-white"
                            value={filters.status}
                            onChange={onChangeStatus}
                          >
                            <option value="notEmpty">All</option>
                            <option value={true}>Active</option>
                            <option value={false}>Inactive</option>
                          </select>
                        </div>
                      </form>
                    </div>
                    <div className="hidden md:block md:w-px bg-black mx-4"></div>
                    <div className="w-full md:w-1/2 md:pl-2">
                      <form>
                        <div className="mb-4">
                          <label
                            id="grantorEmailLabel"
                            htmlFor="grantorEmail"
                            className="block mb-2 border-black dark:d-text"
                          >
                            Grantor Email:
                          </label>
                          <input
                            type="text"
                            id="grantorEmail"
                            value={filters.email}
                            onChange={onChangeEmail}
                            className="w-full p-2 border border-black rounded dark:d-text dark:d-custom-dark-grey-background dark:border-neutral-600 focus:dark:border-white"
                            placeholder="Enter the email of the grantor"
                            aria-labelledby="grantorEmailLabel"
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            id="minAgeLabel"
                            htmlFor="minAge"
                            className="block mb-2 dark:d-text"
                          >
                            Minimum Age:
                          </label>
                          <input
                            type="number"
                            id="minAge"
                            value={filters.minAge}
                            onChange={onChangeMinAge}
                            className="w-full p-2 border border-black rounded dark:d-text dark:d-custom-dark-grey-background dark:border-neutral-600 focus:dark:border-white"
                            placeholder="Enter minimum age"
                            aria-labelledby="minAge"
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            id="maxAgeLabel"
                            htmlFor="maxAge"
                            className="block mb-2 dark:d-text"
                          >
                            Maximum Age
                          </label>
                          <input
                            type="number"
                            id="maxAge"
                            value={filters.maxAge}
                            onChange={onChangeMaxAge}
                            className="w-full p-2 border border-black rounded dark:d-text dark:d-custom-dark-grey-background dark:border-neutral-600 focus:dark:border-white"
                            placeholder="Enter maximum age"
                            aria-labelledby="maxAgeLabel"
                          />
                        </div>
                        <div className="mb-5">
                          <label
                            id="minAmountLabel"
                            htmlFor="minAmount"
                            className="block mb-2 dark:d-text"
                          >
                            Minimum Payable Amount:
                          </label>
                          <input
                            type="number"
                            id="minAmount"
                            value={filters.minAmount}
                            onChange={onChangeMinAmount}
                            className="w-full p-2 border border-black rounded dark:d-text dark:d-custom-dark-grey-background dark:border-neutral-600 focus:dark:border-white"
                            placeholder="Enter minimum amount"
                            aria-labelledby="minAmountLabel"
                          />
                        </div>
                        <div className="mb-4">
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
                            className="w-full p-2 border border-black rounded dark:d-text dark:d-custom-dark-grey-background dark:border-neutral-600 focus:dark:border-white"
                            placeholder="Enter maximum amount"
                            aria-labelledby="maxAmountLabel"
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            id="statusLabel"
                            htmlFor="status"
                            className="block mb-2 dark:d-text"
                          >
                            Veteran Status:
                          </label>
                          <select
                            id="status"
                            className="w-full p-2 border border-black rounded dark:d-text dark:d-custom-dark-grey-background dark:border-neutral-600 focus:dark:border-white"
                            value={filters.veteran}
                            onChange={onChangeVeteran}
                          >
                            <option value={2}>All</option>
                            <option value={1}>Yes</option>
                            <option value={0}>No</option>
                          </select>
                        </div>
                        <div className="mb-4">
                          <label
                            id="numGrantsLabel"
                            htmlFor="numGrants"
                            className="block mb-2 dark:d-text"
                          >
                            Number of Grants Available:
                          </label>
                          <input
                            type="number"
                            id="numGrants"
                            value={filters.maxWinners}
                            onChange={onChangeMaxWinners}
                            className="w-full p-2 border border-black rounded focus:dark:border-white dark:border-neutral-600 dark:d-text dark:d-custom-dark-grey-background"
                            placeholder="Enter the number of grants available"
                            aria-labelledby="numGrantslabel"
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                )}
                {isFormVisible && 
                  <div className="w-full flex justify-center mt-4 md:mt-0 sm:justify-end">
                    <button 
                      onClick={() => handleFilteredGrants(filters)} 
                      className={`mr-2 px-6 py-2 text-white rounded-full hover:scale-105 ${isReducedMotion ? "" : "transition-colors"} text-sm sm:text-base ${protanopia ? "custom-green-background-pt" : deuteranopia ? "custom-green-background-dt" : tritanopia ? "custom-green-background-tr" : "custom-green-background"}`}
                      aria-label="Apply filters"
                    >
                      Filter
                    </button>
                    <button onClick={() => {
                      setFilters(defaultFilters)
                      setAllGrants(grants)
                      }} 
                      className="px-4 py-2 text-white bg-gray-500 hover:scale-105 hover:bg-[#d76b65] rounded-full"
                      aria-label="Reset filters"
                      >
                      Reset
                    </button>
                  </div>
                }
              </div>
            </div>
            <div className="border-2 border-black dark:border-white block"></div>
            <div className="w-full p-4 mt-7">
              <h2 tabIndex={0} className="font-bold text-lg mb-4 dark:d-text">
                Available Grants
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 dark:d-text mt-3">
                {currentGrants.map((claim) => {
                  // Check if the card should be expanded or if no card is expanded
                  const shouldDisplay =
                    expandedGrantId === null || expandedGrantId === claim._id;

                  // Only render the card if it should be displayed based on the above condition
                  if (shouldDisplay) {
                    return (
                      <div
                        key={claim._id}
                        className={`p-1 ${isReducedMotion ? "" : "transition-all duration-500 ease-in-out"} ${
                          expandedGrantId === claim._id
                            ? "scale-100 opacity-100"
                            : "scale-95"
                        } ${
                          expandedGrantId === claim._id
                            ? "col-span-3 lg:col-span-3"
                            : "md:col-span-2 lg:col-span-1"
                        }`}
                      >
                        <div
                          className={`h-2 w-full rounded-t-lg ${claim.Active ? protanopia ? "custom-yellow-background-pt" : deuteranopia ? "custom-yellow-background-dt" : tritanopia ? "custom-yellow-background-tr" : "bg-yellow-600" : 'bg-red-600'}`}
                        ></div>

                        <div className="bg-white dark:d-custom-dark-grey-background dark:border dark:border-neutral-600 p-2 rounded-lg shadow shadow-xl">
                          <div className="flex justify-between items-center mb-4">
                            <p tabIndex={0} className="text-md dark:d-text">
                              Email: {claim.grantorEmail}
                            </p>
                            <button
                              onClick={() =>
                                toggleCardExpansion(
                                  expandedGrantId === claim._id
                                    ? null
                                    : claim._id
                                )
                              }
                              className={`text-md hover:underline ${isReducedMotion ? "" : "transition duration-150 ease-in-out"} ${protanopia ? "custom-green-pt dark:d-custom-green-color-blind" : deuteranopia ? "custom-green-dt dark:d-custom-green-color-blind" : tritanopia ? "custom-green-tr dark:d-custom-green-color-blind-tr" : "custom-green"}`}
                                aria-label={expandedGrantId === claim._id ? "Close grant details" : "View grant details"}
                            >
                              {expandedGrantId === claim._id
                                ? "Close"
                                : "View Details"}
                            </button>
                          </div>

                          <div className="border-t border-gray-300 mb-5"></div>
                          {expandedGrantId === claim._id ? (
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
                                      <p tabIndex={0}>{claim.Title}</p>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                      <span tabIndex={0} className="font-bold">
                                        Provider Email:
                                      </span>
                                      <p tabIndex={0}>{claim.grantorEmail}</p>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                      <span tabIndex={0} className="font-bold dark:d-text">
                                        Amount Payable:
                                      </span>
                                      <p tabIndex={0}>${claim.AmountPerApp}</p>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                      <span tabIndex={0} className="font-bold dark:d-text">Age:</span>
                                      <p tabIndex={0}>
                                        {claim.profileReqs.minAge === 0 && claim.profileReqs.maxAge === 0 ?
                                          "N/A"
                                        :
                                          claim.profileReqs.minAge + '-' + claim.profileReqs.maxAge
                                        }
                                      </p>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                      <span tabIndex={0} className="font-bold dark:d-text">
                                        Required Race:
                                      </span>
                                      <p tabIndex={0}>
                                        {claim.profileReqs.race.length > 0 ?
                                          claim.profileReqs.race.join(
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
                                        {claim.profileReqs.gender.length > 0 ?
                                          claim.profileReqs.gender.join(
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
                                        {claim.profileReqs?.veteran === 0
                                        ? "No"
                                        : claim.profileReqs?.veteran === 1 ?
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
                                      <p tabIndex={0}>{claim.MaxWinners}</p>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                      <span tabIndex={0} className="font-bold dark:d-text">
                                        Date Posted:
                                      </span>
                                      <p tabIndex={0}>{claim.PostedDate}</p>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                      <span tabIndex={0} className="font-bold dark:d-text">
                                        Grant Status:
                                      </span>
                                      <p tabIndex={0}>{claim.Active ? "Yes" : "No"}</p>
                                    </div>
                                  </div>
                                </div>
                              <h2 tabIndex={0} className="dark:d-text font-semibold mb-2">
                                Description
                              </h2>
                              <div className="bg-slate-100 dark:d-custom-dark-grey-background dark:d-text border-2 rounded p-6">
                                <p tabIndex={0} className="mb-4 text-md">
                                  {claim.Description}
                                </p>
                              </div>
                              <h2 tabIndex={0} className="text-red-500 font-semibold mb-2 mt-5">
                                Deadline to Apply
                              </h2>
                              <div className="bg-slate-100 dark:d-custom-dark-grey-background dark:d-text border-2  rounded p-6">
                                <p tabIndex={0} className="mb-2">{claim.Deadline}</p>
                              </div>
                              <div className="flex justify-center items-center">
                                {claim.Active ? 
                                  <Link 
                                    href={`/apply/${claim._id}`}
                                    className="dark:d-text px-6 py-2 bg-sky-100 border border-neutral-700 dark:border-white dark:d-custom-dark-grey-background dark:d-text hover:scale-105 rounded-full font-semibold mb-2 mt-5">
                                    Apply Here
                                  </Link>
                                :
                                  <></>
                                }
                                
                              </div>
                            </div>
                          ) : (
                            <div>
                              {/* Small view content */}
                              <p tabIndex={0} className="mb-2 text-md">{claim.Title}</p>
                              <p tabIndex={0} className="mb-2">
                                {claim.profileReqs.minAge} -{" "}
                                {claim.profileReqs.maxAge}
                              </p>
                              <div className="flex justify-between items-center">
                                <div>
                                  <p tabIndex={0}>Date Posted:</p>
                                  <p tabIndex={0}>{claim.PostedDate}</p>
                                </div>
                                <div>
                                  <p tabIndex={0}>Amount Payable:</p>
                                  <p tabIndex={0}>${claim.AmountPerApp}</p>
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

              <div className="flex justify-center p-4 dark:d-text">
                {currentPage > 1 && (
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    className={`px-2 py-2 mr-5 text-sm font-semibold text-white hover:scale-105 rounded-full w-1/4 ${protanopia ? "custom-green-background-pt" : deuteranopia ? "custom-green-background-dt" : tritanopia ? "custom-green-background-tr" : "custom-green-background"}`}
                    aria-label="Previous page of applications"
                  >
                    Previous
                  </button>
                )}
                {indexOfLastGrant < allGrants.length && (
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
  );
};

export default Search_grants;
