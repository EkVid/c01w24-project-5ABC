"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const Search_grants = ({ grants }) => {
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

      console.log('res', res)
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

  // const allGrants = [
  //   {
  //     Active: false,
  //     AmountPerApp: 1499.99,
  //     AppliedIDs: [],
  //     Deadline: "2024-04-05",
  //     Description: "Do apply to this grant",
  //     MaxWinners: 10,
  //     NumWinners: 0,
  //     PostedDate: "2024-04-01",
  //     QuestionData: [
  //       {
  //         isRequired: true,
  //         options: {
  //           answerType: "short",
  //           isMultipleLines: false,
  //           maxCharsNum: 16,
  //           minCharsNum: 1,
  //         },
  //         question: "What is your name?",
  //         type: "textbox",
  //       },
  //     ],
  //     Title: "A Generous Grant",
  //     WinnerIDs: [],
  //     _id: "6600a85f973f58eb1683c521",
  //     grantorEmail: "grantor@website.com",
  //     profileReqs: {
  //       gender: ["Man", "Woman", "Non-binary"],
  //       maxAge: 24,
  //       minAge: 18,
  //       nationality: ["Canadian", "American"],
  //       race: ["Asian", "African American", "White"],
  //       veteran: 0,
  //     },
  //   },
  //   {
  //     Active: true,
  //     AmountPerApp: 1499.99,
  //     AppliedIDs: [],
  //     Deadline: "2024-04-05",
  //     Description: "Do apply to this grant",
  //     MaxWinners: 10,
  //     NumWinners: 0,
  //     PostedDate: "2024-04-01",
  //     QuestionData: [
  //       {
  //         isRequired: true,
  //         options: {
  //           answerType: "short",
  //           isMultipleLines: false,
  //           maxCharsNum: 16,
  //           minCharsNum: 1,
  //         },
  //         question: "What is your name?",
  //         type: "textbox",
  //       },
  //     ],
  //     Title: "A Generous Grant",
  //     WinnerIDs: [],
  //     _id: "6600a85f973f58eb1683c522",
  //     grantorEmail: "grantor@website.com",
  //     profileReqs: {
  //       gender: ["Man", "Woman", "Non-binary"],
  //       maxAge: 24,
  //       minAge: 18,
  //       nationality: ["Canadian", "American"],
  //       race: ["Asian", "African American", "White"],
  //       veteran: 1,
  //     },
  //   },
  //   {
  //     Active: true,
  //     AmountPerApp: 1499.99,
  //     AppliedIDs: [],
  //     Deadline: "2024-04-05",
  //     Description: "Do apply to this grant",
  //     MaxWinners: 10,
  //     NumWinners: 0,
  //     PostedDate: "2024-04-01",
  //     QuestionData: [
  //       {
  //         isRequired: true,
  //         options: {
  //           answerType: "short",
  //           isMultipleLines: false,
  //           maxCharsNum: 16,
  //           minCharsNum: 1,
  //         },
  //         question: "What is your name?",
  //         type: "textbox",
  //       },
  //     ],
  //     Title: "A Generous Grant",
  //     WinnerIDs: [],
  //     _id: "6600a85f973f58eb1683c524",
  //     grantorEmail: "grantor@website.com",
  //     profileReqs: {
  //       gender: ["Man", "Woman", "Non-binary"],
  //       maxAge: 24,
  //       minAge: 18,
  //       nationality: ["Canadian", "American"],
  //       race: ["Asian", "African American", "White"],
  //       veteran: 1,
  //     },
  //   },
  //   {
  //     Active: true,
  //     AmountPerApp: 1499.99,
  //     AppliedIDs: [],
  //     Deadline: "2024-04-05",
  //     Description: "Do apply to this grant",
  //     MaxWinners: 10,
  //     NumWinners: 0,
  //     PostedDate: "2024-04-01",
  //     QuestionData: [
  //       {
  //         isRequired: true,
  //         options: {
  //           answerType: "short",
  //           isMultipleLines: false,
  //           maxCharsNum: 16,
  //           minCharsNum: 1,
  //         },
  //         question: "What is your name?",
  //         type: "textbox",
  //       },
  //     ],
  //     Title: "A Generous Grant",
  //     WinnerIDs: [],
  //     _id: "6600a85f973f58eb1683c526",
  //     grantorEmail: "grantor@website.com",
  //     profileReqs: {
  //       gender: ["Man", "Woman", "Non-binary"],
  //       maxAge: 24,
  //       minAge: 18,
  //       nationality: ["Canadian", "American"],
  //       race: ["Asian", "African American", "White"],
  //       veteran: 1,
  //     },
  //   },
  //   {
  //     Active: true,
  //     AmountPerApp: 1499.99,
  //     AppliedIDs: [],
  //     Deadline: "2024-04-05",
  //     Description: "Do apply to this grant",
  //     MaxWinners: 10,
  //     NumWinners: 0,
  //     PostedDate: "2024-04-01",
  //     QuestionData: [
  //       {
  //         isRequired: true,
  //         options: {
  //           answerType: "short",
  //           isMultipleLines: false,
  //           maxCharsNum: 16,
  //           minCharsNum: 1,
  //         },
  //         question: "What is your name?",
  //         type: "textbox",
  //       },
  //     ],
  //     Title: "A Generous Grant",
  //     WinnerIDs: ["6600a85f973f58eb1683c529"],
  //     _id: "6600a85f973f58eb1683c528",
  //     grantorEmail: "grantor@website.com",
  //     profileReqs: {
  //       gender: ["Man", "Woman", "Non-binary"],
  //       maxAge: 24,
  //       minAge: 18,
  //       nationality: ["Canadian", "American"],
  //       race: ["Asian", "African American", "White"],
  //       veteran: 1,
  //     },
  //   },
  //   {
  //     Active: true,
  //     AmountPerApp: 1499.99,
  //     AppliedIDs: [],
  //     Deadline: "2024-04-05",
  //     Description: "Do apply to this grant",
  //     MaxWinners: 10,
  //     NumWinners: 0,
  //     PostedDate: "2024-04-01",
  //     QuestionData: [
  //       {
  //         isRequired: true,
  //         options: {
  //           answerType: "short",
  //           isMultipleLines: false,
  //           maxCharsNum: 16,
  //           minCharsNum: 1,
  //         },
  //         question: "What is your name?",
  //         type: "textbox",
  //       },
  //     ],
  //     Title: "A Generous Grant",
  //     WinnerIDs: [],
  //     _id: "6600a85f973f58eb1683c52a",
  //     grantorEmail: "grantor@website.com",
  //     profileReqs: {
  //       gender: ["Man", "Woman", "Non-binary"],
  //       maxAge: 24,
  //       minAge: 18,
  //       nationality: ["Canadian", "American"],
  //       race: ["Asian", "African American", "White"],
  //       veteran: 1,
  //     },
  //   },
  //   {
  //     Active: true,
  //     AmountPerApp: 1499.99,
  //     AppliedIDs: [],
  //     Deadline: "2024-04-05",
  //     Description: "Do apply to this grant",
  //     MaxWinners: 10,
  //     NumWinners: 0,
  //     PostedDate: "2024-04-01",
  //     QuestionData: [
  //       {
  //         isRequired: true,
  //         options: {
  //           answerType: "short",
  //           isMultipleLines: false,
  //           maxCharsNum: 16,
  //           minCharsNum: 1,
  //         },
  //         question: "What is your name?",
  //         type: "textbox",
  //       },
  //     ],
  //     Title: "A Generous Grant",
  //     WinnerIDs: [],
  //     _id: "6600a85f973f58eb1683c52c",
  //     grantorEmail: "grantor@website.com",
  //     profileReqs: {
  //       gender: ["Man", "Woman", "Non-binary"],
  //       maxAge: 24,
  //       minAge: 18,
  //       nationality: ["Canadian", "American"],
  //       race: ["Asian", "African American", "White"],
  //       veteran: 1,
  //     },
  //   },
  //   {
  //     Active: true,
  //     AmountPerApp: 1499.99,
  //     AppliedIDs: [],
  //     Deadline: "2024-04-05",
  //     Description: "Do apply to this grant",
  //     MaxWinners: 10,
  //     NumWinners: 0,
  //     PostedDate: "2024-04-01",
  //     QuestionData: [
  //       {
  //         isRequired: true,
  //         options: {
  //           answerType: "short",
  //           isMultipleLines: false,
  //           maxCharsNum: 16,
  //           minCharsNum: 1,
  //         },
  //         question: "What is your name?",
  //         type: "textbox",
  //       },
  //     ],
  //     Title: "A Generous Grant",
  //     WinnerIDs: [],
  //     _id: "6600ad2d8d6dfb38c7992c63",
  //     grantorEmail: "grantor@website.com",
  //     profileReqs: {
  //       gender: ["Man", "Woman", "Non-binary"],
  //       maxAge: 24,
  //       minAge: 18,
  //       nationality: ["Canadian", "American"],
  //       race: ["Asian", "African American", "White"],
  //       veteran: 1,
  //     },
  //   },
  //   {
  //     Active: true,
  //     AmountPerApp: 1499.99,
  //     AppliedIDs: [],
  //     Deadline: "2024-04-05",
  //     Description: "Do apply to this grant",
  //     MaxWinners: 10,
  //     NumWinners: 0,
  //     PostedDate: "2024-04-01",
  //     QuestionData: [
  //       {
  //         isRequired: true,
  //         options: {
  //           answerType: "short",
  //           isMultipleLines: false,
  //           maxCharsNum: 16,
  //           minCharsNum: 1,
  //         },
  //         question: "What is your name?",
  //         type: "textbox",
  //       },
  //     ],
  //     Title: "A Generous Grant",
  //     WinnerIDs: [],
  //     _id: "6600ad2d8d6dfb38c7992c64",
  //     grantorEmail: "grantor@website.com",
  //     profileReqs: {
  //       gender: ["Man", "Woman", "Non-binary"],
  //       maxAge: 24,
  //       minAge: 18,
  //       nationality: ["Canadian", "American"],
  //       race: ["Asian", "African American", "White"],
  //       veteran: 1,
  //     },
  //   },
  //   {
  //     Active: true,
  //     AmountPerApp: 1499.99,
  //     AppliedIDs: [],
  //     Deadline: "2024-04-05",
  //     Description: "Do apply to this grant",
  //     MaxWinners: 10,
  //     NumWinners: 0,
  //     PostedDate: "2024-04-01",
  //     QuestionData: [
  //       {
  //         isRequired: true,
  //         options: {
  //           answerType: "short",
  //           isMultipleLines: false,
  //           maxCharsNum: 16,
  //           minCharsNum: 1,
  //         },
  //         question: "What is your name?",
  //         type: "textbox",
  //       },
  //     ],
  //     Title: "A Generous Grant",
  //     WinnerIDs: [],
  //     _id: "6600ad2d8d6dfb38c7992c66",
  //     grantorEmail: "grantor@website.com",
  //     profileReqs: {
  //       gender: ["Man", "Woman", "Non-binary"],
  //       maxAge: 24,
  //       minAge: 18,
  //       nationality: ["Canadian", "American"],
  //       race: ["Asian", "African American", "White"],
  //       veteran: 1,
  //     },
  //   },
  //   {
  //     Active: true,
  //     AmountPerApp: 1499.99,
  //     AppliedIDs: [],
  //     Deadline: "2024-04-05",
  //     Description: "Do apply to this grant",
  //     MaxWinners: 10,
  //     NumWinners: 0,
  //     PostedDate: "2024-04-01",
  //     QuestionData: [
  //       {
  //         isRequired: true,
  //         options: {
  //           answerType: "short",
  //           isMultipleLines: false,
  //           maxCharsNum: 16,
  //           minCharsNum: 1,
  //         },
  //         question: "What is your name?",
  //         type: "textbox",
  //       },
  //     ],
  //     Title: "A Generous Grant",
  //     WinnerIDs: [],
  //     _id: "6600ad2e8d6dfb38c7992c68",
  //     grantorEmail: "grantor@website.com",
  //     profileReqs: {
  //       gender: ["Man", "Woman", "Non-binary"],
  //       maxAge: 24,
  //       minAge: 18,
  //       nationality: ["Canadian", "American"],
  //       race: ["Asian", "African American", "White"],
  //       veteran: 1,
  //     },
  //   },
  //   {
  //     Active: true,
  //     AmountPerApp: 1499.99,
  //     AppliedIDs: [],
  //     Deadline: "2024-04-05",
  //     Description: "Do apply to this grant",
  //     MaxWinners: 10,
  //     NumWinners: 0,
  //     PostedDate: "2024-04-01",
  //     QuestionData: [
  //       {
  //         isRequired: true,
  //         options: {
  //           answerType: "short",
  //           isMultipleLines: false,
  //           maxCharsNum: 16,
  //           minCharsNum: 1,
  //         },
  //         question: "What is your name?",
  //         type: "textbox",
  //       },
  //     ],
  //     Title: "A Generous Grant",
  //     WinnerIDs: ["6600ad2e8d6dfb38c7992c6b"],
  //     _id: "6600ad2e8d6dfb38c7992c6a",
  //     grantorEmail: "grantor@website.com",
  //     profileReqs: {
  //       gender: ["Man", "Woman", "Non-binary"],
  //       maxAge: 24,
  //       minAge: 18,
  //       nationality: ["Canadian", "American"],
  //       race: ["Asian", "African American", "White"],
  //       veteran: 1,
  //     },
  //   },
  //   {
  //     Active: true,
  //     AmountPerApp: 1499.99,
  //     AppliedIDs: [],
  //     Deadline: "2024-04-05",
  //     Description: "Do apply to this grant",
  //     MaxWinners: 10,
  //     NumWinners: 0,
  //     PostedDate: "2024-04-01",
  //     QuestionData: [
  //       {
  //         isRequired: true,
  //         options: {
  //           answerType: "short",
  //           isMultipleLines: false,
  //           maxCharsNum: 16,
  //           minCharsNum: 1,
  //         },
  //         question: "What is your name?",
  //         type: "textbox",
  //       },
  //     ],
  //     Title: "A Generous Grant",
  //     WinnerIDs: [],
  //     _id: "6600ad2e8d6dfb38c7992c6c",
  //     grantorEmail: "grantor@website.com",
  //     profileReqs: {
  //       gender: ["Man", "Woman", "Non-binary"],
  //       maxAge: 24,
  //       minAge: 18,
  //       nationality: ["Canadian", "American"],
  //       race: ["Asian", "African American", "White"],
  //       veteran: 1,
  //     },
  //   },
  //   {
  //     Active: true,
  //     AmountPerApp: 1499.99,
  //     AppliedIDs: [],
  //     Deadline: "2024-04-05",
  //     Description: "Do apply to this grant",
  //     MaxWinners: 10,
  //     NumWinners: 0,
  //     PostedDate: "2024-04-01",
  //     QuestionData: [
  //       {
  //         isRequired: true,
  //         options: {
  //           answerType: "short",
  //           isMultipleLines: false,
  //           maxCharsNum: 16,
  //           minCharsNum: 1,
  //         },
  //         question: "What is your name?",
  //         type: "textbox",
  //       },
  //     ],
  //     Title: "A Generous Grant",
  //     WinnerIDs: [],
  //     _id: "6600ad2e8d6dfb38c7992c6e",
  //     grantorEmail: "grantor@website.com",
  //     profileReqs: {
  //       gender: ["Man", "Woman", "Non-binary"],
  //       maxAge: 24,
  //       minAge: 18,
  //       nationality: ["Canadian", "American"],
  //       race: ["Asian", "African American", "White"],
  //       veteran: 1,
  //     },
  //   },
  // ];

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
      className="flex items-center justify-center min-h-screen pt-10"
      style={{
        backgroundImage:
          "url('https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcm00MjItMDQ3LWtxOTJ3eDl5LmpwZw.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
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
                  value={filters.titleKeyword}
                  onChange={onChangeTitle}
                  placeholder="Search for keywords in title   (e.g: study, medical)"
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
                  <div className="flex flex-wrap md:flex-nowrap">
                    <div className="w-full md:w-1/2 md:pr-2">
                      <form>
                        <div className="mb-4">
                          <label
                            htmlFor="maxAmount"
                            className="block mb-2 text-black"
                          >
                            Gender:
                          </label>
                          <input
                            type="text"
                            id="race"
                            value={filters.gender}
                            onChange={onChangeGender}
                            className="w-full p-2 border border-black rounded text-black"
                            placeholder="All"
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            htmlFor="maxAmount"
                            className="block mb-2 text-black"
                          >
                            Race:
                          </label>
                          <input
                            type="text"
                            id="race"
                            value={filters.race}
                            onChange={onChangeRace}
                            className="w-full p-2 border border-black rounded text-black"
                            placeholder="All"
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            htmlFor="maxAmount"
                            className="block mb-2 text-black"
                          >
                            Nationality:
                          </label>
                          <input
                            type="text"
                            id="race"
                            value={filters.nationality}
                            onChange={onChangeNationality}
                            className="w-full p-2 border border-black rounded text-black"
                            placeholder="All"
                          />
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
                            value={filters.datePostedBefore}
                            onChange={onChangePostedBefore}
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
                            value={filters.datePostedAfter}
                            onChange={onChangePostedAfter}
                            className="w-full p-2 border border-black rounded text-black"
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            htmlFor="postedAfter"
                            className="block mb-2 text-black"
                          >
                            Available Until:
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
                          <label
                            htmlFor="status"
                            className="block mb-2 text-black"
                          >
                            Status:
                          </label>
                          <select
                            id="status"
                            className="w-full p-2 border border-black rounded text-black"
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
                            htmlFor="grantorEmail"
                            className="block mb-2 border-black text-black"
                          >
                            Grantor Email:
                          </label>
                          <input
                            type="text"
                            id="grantorEmail"
                            value={filters.email}
                            onChange={onChangeEmail}
                            className="w-full p-2 border border-black rounded text-black"
                            placeholder="Enter the email of the grantor"
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            htmlFor="MinAmount"
                            className="block mb-2 text-black"
                          >
                            Minimum Age:
                          </label>
                          <input
                            type="number"
                            id="minAge"
                            value={filters.minAge}
                            onChange={onChangeMinAge}
                            className="w-full p-2 border border-black rounded text-black"
                            placeholder="Enter minimum age"
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            htmlFor="maxAmount"
                            className="block mb-2 text-black"
                          >
                            Maximum Age
                          </label>
                          <input
                            type="text"
                            id="minAge"
                            value={filters.maxAge}
                            onChange={onChangeMaxAge}
                            className="w-full p-2 border border-black rounded text-black"
                            placeholder="Enter maximum age"
                          />
                        </div>
                        <div className="mb-5">
                          <label
                            htmlFor="MinAmount"
                            className="block mb-2 text-black"
                          >
                            Minimum Payable Amount:
                          </label>
                          <input
                            type="text"
                            id="minAmount"
                            value={filters.minAmount}
                            onChange={onChangeMinAmount}
                            className="w-full p-2 border border-black rounded text-black"
                            placeholder="Enter minimum amount"
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            htmlFor="maxAmount"
                            className="block mb-2 text-black"
                          >
                            Maximum Payable Amount:
                          </label>
                          <input
                            type="text"
                            id="maxAmount"
                            value={filters.maxAmount}
                            onChange={onChangeMaxAmount}
                            className="w-full p-2 border border-black rounded text-black"
                            placeholder="Enter maximum amount"
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            htmlFor="status"
                            className="block mb-2 text-black"
                          >
                            Veteran Status:
                          </label>
                          <select
                            id="status"
                            className="w-full p-2 border border-black rounded text-black"
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
                            htmlFor="MinAmount"
                            className="block mb-2 text-black"
                          >
                            Number of Grants Available:
                          </label>
                          <input
                            type="text"
                            id="numGrants"
                            value={filters.maxWinners}
                            onChange={onChangeMaxWinners}
                            className="w-full p-2 border border-black rounded text-black"
                            placeholder="Enter the number of grants available"
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                )}
                <div className="w-full flex justify-center mt-4 md:mt-0 sm:justify-end">
                  <button onClick={() => handleFilteredGrants(filters)} className="mr-2 px-6 py-2 text-white bg-green-700 hover:bg-green-900 rounded-full">
                    Filter
                  </button>
                  <button onClick={() => {
                    setFilters(defaultFilters)
                    setAllGrants(grants)
                    }} 
                    className="px-4 py-2 text-white bg-gray-500 hover:bg-gray-700 rounded-full">
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
                    expandedGrantId === null || expandedGrantId === claim._id;

                  // Only render the card if it should be displayed based on the above condition
                  if (shouldDisplay) {
                    return (
                      <div
                        key={claim._id}
                        className={` p-1 transition-all duration-500 ease-in-out ${
                          expandedGrantId === claim._id
                            ? "scale-100 opacity-100"
                            : "scale-95 opacity-75"
                        } ${
                          expandedGrantId === claim._id
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
                                <span className="font-semibold">Email: </span>{" "}
                                {claim.grantorEmail}
                              </p>
                            </p>
                            <button
                              onClick={() =>
                                toggleCardExpansion(
                                  expandedGrantId === claim._id
                                    ? null
                                    : claim._id
                                )
                              }
                              className="text-green-700 text-md hover:text-green-900 transition duration-150 ease-in-out"
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
                              <div className="mb-5">
                                <div className="flex justify-between">
                                  <h2 className="text-black font-semibold mb-2">
                                    Basic Information
                                  </h2>
                                </div>
                                <div className="bg-slate-100 border-2 rounded p-6">
                                  <div className="flex justify-between mb-2">
                                    <span className="font-bold">Title:</span>
                                    {claim.Title}
                                  </div>
                                  <div className="flex justify-between mb-2">
                                    <span className="font-bold">
                                      Provider Email:
                                    </span>
                                    {claim.grantorEmail}
                                  </div>
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold">
                                      Amount Payable:
                                    </span>
                                    {claim.AmountPerApp}
                                  </div>
                                  <div className="flex justify-between mb-2">
                                    <span className="font-bold">
                                      Required Nationality:
                                    </span>
                                    {claim.profileReqs.nationality.join(", ")}
                                  </div>
                                  <div className="flex justify-between mb-2">
                                    <span className="font-bold">
                                      Required Age:
                                    </span>
                                    {claim.profileReqs.minAge} -{" "}
                                    {claim.profileReqs.maxAge}
                                  </div>
                                  <div className="flex justify-between mb-2">
                                    <span className="font-bold">
                                      Required Race:
                                    </span>
                                    {claim.profileReqs.race.join(", ")}
                                  </div>
                                  <div className="flex justify-between mb-2">
                                    <span className="font-bold">
                                      Required Gender:
                                    </span>
                                    {claim.profileReqs.gender.join(", ")}
                                  </div>
                                  <div className="flex justify-between mb-2">
                                    <span className="font-bold">
                                      Veteran Only:
                                    </span>
                                    {claim.profileReqs.veteran === 0
                                      ? "No"
                                      : "Yes"}
                                  </div>
                                  <div className="flex justify-between mb-2">
                                    <span className="font-bold">
                                      Number of Grants Available:
                                    </span>
                                    {claim.MaxWinners}
                                  </div>
                                  <div className="flex justify-between mb-2">
                                    <span className="font-bold">
                                      Date Posted:
                                    </span>
                                    {claim.PostedDate}
                                  </div>
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold">
                                      Grant Status:
                                    </span>
                                    {claim.Active ? "Active" : "Inactive"}
                                  </div>
                                </div>
                              </div>
                              <h2 className="text-black font-semibold mb-2">
                                Description
                              </h2>
                              <div className="bg-slate-100 border-2  rounded p-6">
                                <div className="flex justify-between mb-4 text-md">
                                  {claim.Description}
                                </div>
                              </div>
                              <h2 className="text-red-500 font-semibold mb-2 mt-5">
                                Deadline to Apply
                              </h2>
                              <div className="bg-slate-100 border-2  rounded p-6">
                                <div className="mb-2">{claim.Deadline}</div>
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
                              <p className="mb-2 text-md">{claim.Title}</p>
                              <p className="mb-2">
                                {claim.profileReqs.minAge} -{" "}
                                {claim.profileReqs.maxAge}
                              </p>
                              <div className="flex justify-between items-center">
                                <div>
                                  <p>Date Posted:</p>
                                  <p>{claim.PostedDate}</p>
                                </div>
                                <div>
                                  <p>Amount Payable:</p>
                                  <p>{claim.AmountPerApp}</p>
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
