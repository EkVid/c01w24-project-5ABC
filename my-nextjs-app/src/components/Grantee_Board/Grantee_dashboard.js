"use client";
import dynamic from "next/dynamic";
import React from "react";
import { useRouter } from "next/navigation";
import { useState, useContext } from "react";
import Link from "next/link";
import ViewAnswers from "../GrantForm/ViewAnswers";
import FontSizeContext from "@/components/utils/FontSizeContext";
import ThemeContext from "../utils/ThemeContext";
import ColourBlindnessContext from "@/components/utils/ColorBlindnessContext";
import ReducedMotionContext from "../utils/ReducedMotionContext";
import { getcbMode } from "@/components/utils/cbMode";

const Grantee_dashboard = ({ applications }) => {
  const recentGrants = applications.slice(0, 3);
  const [expandedApplicationId, setExpandedApplicationId] = useState(null);

  const cbMode = useContext(ColourBlindnessContext)
  const { protanopia, deuteranopia, tritanopia } = getcbMode(cbMode)
  const fontSizeMultiplier = useContext(FontSizeContext) / 100;
  const isReducedMotion = useContext(ReducedMotionContext)
  const theme = useContext(ThemeContext)

  // Function to get the color based on the claim status
  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return protanopia ? "custom-green-background-pt" : deuteranopia ? "custom-green-background-dt" : tritanopia ? "custom-green-background-tr" : "custom-green-background"; // Green for approved
      case "Rejected":
        return "bg-red-600"; // Red for rejected
      case "In Review":
        return protanopia ? "custom-yellow-background-pt" : deuteranopia ? "custom-yellow-background-dt" : tritanopia ? "custom-yellow-background-tr" : "bg-yellow-600"; // Yellow for pending
      default:
        return "bg-gray-400"; // Gray for any other status or if no status is provided
    }
  };

  const toggleCardExpansion = (id) => {
    if (expandedApplicationId === id) {
      // If already expanded, shrink the card
      setExpandedApplicationId(null);
    } else {
      setExpandedApplicationId(id);
    }
  };

  const getStatusText = (status) => {
    switch (status) {
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

  const router = useRouter();

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
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:d-custom-dark-grey-background p-6 rounded-lg shadow-xl">
            <div className="bg-white dark:d-custom-dark-grey-background p-6 rounded-lg">
              <h1 className="dark:d-text lg:text-4xl md:text-3xl text-3xl text-center sm:text-left font-semibold mb-20 text-left">
                Your journey starts here...
              </h1>
              <div className="flex flex-col space-y-4 mb-4">
                <div className="sm:self-end flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <Link
                    href="/applied_grants"
                    className={`hover:underline text-center px-4 py-2 sm:px-5 sm:py-2 ${isReducedMotion ? "" : 'transition-colors'} rounded-full text-sm sm:text-base ${protanopia ? "custom-green-pt dark:d-custom-green-color-blind" : deuteranopia ? "custom-green-dt dark:d-custom-green-color-blind" : tritanopia ? "custom-green-tr dark:d-custom-green-color-blind-tr" : "custom-green"}`}
                  >
                    View My Applications
                  </Link>
                  <Link
                    href="/search_grants"
                    className={`text-white text-center px-4 py-2 sm:px-5 sm:py-2 rounded-full ${isReducedMotion ? "" : 'transition-all'} hover:scale-105 text-sm sm:text-base ${protanopia ? "custom-green-background-pt" : deuteranopia ? "custom-green-background-dt" : tritanopia ? "custom-green-background-tr" : "custom-green-background"}`}
                  >
                    Submit an Application
                  </Link>
                </div>

                <h2 tabIndex={0} className="text-xl font-semibold dark:d-text text-center sm:text-left">
                    Your Recent Applications
                  </h2>
              </div>

              {recentGrants.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-black mt-3">
                  {recentGrants.map((claim) => {
                    // Check if the card should be expanded or if no card is expanded
                    const statusText = getStatusText(
                      claim.ApplicationData.status
                    );
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
                              statusText
                            )} h-2 w-full rounded-t-lg`}
                          ></div>

                          <div className="bg-white dark:d-custom-dark-grey-background dark:border dark:border-white p-2 rounded-lg shadow shadow-xl">
                            <div className="flex justify-between items-center mb-4">
                              <p tabIndex={0} className="text-md dark:d-text">Status: {statusText}</p>
                              <button
                                onClick={() =>
                                  toggleCardExpansion(
                                    expandedApplicationId ===
                                      claim.ApplicationData.applicationID
                                      ? null
                                      : claim.ApplicationData.applicationID
                                  )
                                }
                                className={`text-md hover:underline ${isReducedMotion ? "" : "transition duration-150 ease-in-out"}  ${protanopia ? "custom-green-pt dark:d-custom-green-color-blind" : deuteranopia ? "custom-green-dt dark:d-custom-green-color-blind" : tritanopia ? "custom-green-tr dark:d-custom-green-color-blind-tr" : "custom-green"}`}
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
                                      <p tabIndex={0}>{claim.GrantData.AmountPerApp}</p>
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
                                        {claim.ApplicationData.profileData?.veteran === 0
                                        ? "No"
                                        : claim.ApplicationData.profileData?.veteran === 1 ?
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
                                    <p tabIndex={0}>{claim.GrantData.AmountPerApp}</p>
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
              ) : (
                <div className="text-center mt-20 mb-10 dark:d-text">
                  <p  tabIndex={0} className="text-3xl font-semibold">
                    You have no recent grants applications. Start applying now!
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-between items-start flex-col md:flex-row dark:d-text">
              <div className="flex-1 m-2">
                <h3 tabIndex={0} className="text-lg font-semibold mb-4 text-center sm:text-left">
                  Your Grants Benefits
                </h3>
                <div className="bg-white dark:d-custom-dark-grey-background p-6 rounded-lg shadow-lg dark:shadow-none dark:border dark:border-white">
                  <h3 tabIndex={0} className="font-semibold mb-4">
                    Calculate your grants amount
                  </h3>
                  <p tabIndex={0} className="mb-4">
                    Calculate how much you could be approved for your benefits.
                  </p>
                  <div className="flex justify-center">
                    <button
                      className={`text-white px-4 py-2 sm:px-5 sm:py-2 rounded-full hover:scale-105 ${isReducedMotion ? "" : 'transition-colors'} text-sm sm:text-base ${protanopia ? "custom-green-background-pt" : deuteranopia ? "custom-green-background-dt" : tritanopia ? "custom-green-background-tr" : "custom-green-background"}`}
                      onClick={() => {
                        router.push(
                          "https://www.canada.ca/en/government/grants-funding.html"
                        );
                      }}
                    >
                      Check Eligibility
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex-1 m-2">
                <h3 tabIndex={0} className="text-lg font-semibold mb-4 text-center sm:text-left">
                  Search for a Grant
                </h3>
                <div className="bg-white dark:d-custom-dark-grey-background p-6 rounded-lg shadow-lg dark:shadow-none dark:border dark:border-white">
                  <p tabIndex={0} className="font-semibold mb-4">Find a grant for you</p>
                  <p tabIndex={0} className="mb-4">
                    Search for grants that precisely align with your individual
                    needs.
                  </p>
                  <div className="flex justify-center">
                    <Link
                      href="/search_grants"
                      className={`text-white px-4 py-2 sm:px-5 sm:py-2 rounded-full hover:scale-105 ${isReducedMotion ? "" : 'transition-colors'} text-sm sm:text-base ${protanopia ? "custom-green-background-pt" : deuteranopia ? "custom-green-background-dt" : tritanopia ? "custom-green-background-tr" : "custom-green-background"}`}
                    >
                      Find Grants
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <h3 tabIndex={0} className="text-lg font-semibold text-center sm:text-left mb-5 mt-20 dark:d-text">
              Read Our Stories
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 dark:d-text">
              <div className="rounded-lg shadow-lg overflow-hidden dark:shadow-none dark:border dark:border-white">
                <img
                  src="https://jdrf.ca/wp-content/uploads/2024/02/GRANT-Blog_Hero-Banner_1280x720-1024x576.jpg"
                  alt="Family image"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h5 tabIndex={0} className="text-lg font-semibold mb-2">
                    Perspectives form a family
                  </h5>
                  <p tabIndex={0} className="text-gray-700 dark:d-text">
                    Thanks to 5ABC, we've turned our vision into reality. The
                    process was straightforward, and the support we received was
                    unparalleled. Truly a game-changer for us.
                  </p>
                </div>
              </div>
              {/* Card 2 */}
              <div className="rounded-lg shadow-lg overflow-hidden dark:shadow-none dark:border dark:border-white">
                <img
                  src="https://otf.ca/sites/default/files/styles/responsive_1040/public/2021-07/YOF_Announcement_July_2021.jpg?itok=uZGXy9B6"
                  alt="Students image"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h5 tabIndex={0} className="text-lg font-semibold mb-2">
                    Perspectives from students
                  </h5>
                  <p tabIndex={0} className="text-gray-700 dark:d-text">
                    I was new to grant writing and felt overwhelmed by the
                    complexity. 5ABC provided the tools and confidence I needed
                    to secure funding. Their platform is a must-have for anyone
                    serious about making an impact.
                  </p>
                </div>
              </div>
              {/* Card 3 */}
              <div className="rounded-lg shadow-lg overflow-hidden dark:shadow-none dark:border dark:border-white">
                <img
                  src="https://www.pegasusseniorliving.com/the-oaks-at-inglewood/wp-content/uploads/sites/38/2022/08/oaks-group-of-happy-seniors-friends-1024x683.jpeg"
                  alt="Elderly image"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h5 tabIndex={0} className="text-lg font-semibold mb-2">
                    Perspectives from elderly
                  </h5>
                  <p tabIndex={0} className="text-gray-700 dark:d-text">
                    Securing grants is critical for our community projects.
                    Thanks to 5ABC, we've not only found relevant opportunities
                    but also learned how to present our initiatives more
                    effectively. Their impact on our success is undeniable
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Grantee_dashboard), {
  ssr: false,
});
