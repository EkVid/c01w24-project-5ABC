"use client";
import dynamic from "next/dynamic";
import React from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import ViewAnswers from "../GrantForm/ViewAnswers";

const Grantee_dashboard = ({ applications }) => {
  const recentGrants = applications.slice(0, 3);

  const [expandedGrantId, setExpandedGrantId] = useState(null);

  // Function to get the color based on the claim status
  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-600"; // Green for approved
      case "Rejected":
        return "bg-red-600"; // Red for rejected
      case "In Review":
        return "bg-yellow-600"; // Yellow for pending
      default:
        return "bg-gray-400"; // Gray for any other status or if no status is provided
    }
  };

  const toggleCardExpansion = (id) => {
    if (expandedGrantId === id) {
      // If already expanded, shrink the card
      setExpandedGrantId(null);
    } else {
      setExpandedGrantId(id);
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
      className="flex items-center justify-center min-h-screen pt-10"
      style={{
        backgroundImage:
          "url('https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcm00MjItMDQ3LWtxOTJ3eDl5LmpwZw.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="bg-white p-6 rounded-lg">
              <h1 className="text-black lg:text-4xl md:text-3xl text-3xl text-center sm:text-left font-semibold mb-20 text-left">
                Your journey starts here...
              </h1>
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 mb-4">
                <h2 className="text-xl font-semibold text-black text-center sm:text-left">
                  Your Recent Applications
                </h2>

                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <Link
                    href="/applied_grants"
                    className="text-green-700 hover:text-green-900 transition-colors px-4 py-2 sm:px-5 sm:py-2 rounded-full text-sm sm:text-base"
                  >
                    View My Applications
                  </Link>
                  <Link
                    href="/search_grants"
                    className="bg-green-600 text-white px-4 py-2 sm:px-5 sm:py-2 rounded-full hover:bg-green-800 transition-colors text-sm sm:text-base"
                  >
                    Submit an Application
                  </Link>
                </div>
              </div>

              {recentGrants.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-black mt-3">
                  {recentGrants.map((claim) => {
                    // Check if the card should be expanded or if no card is expanded
                    const statusText = getStatusText(
                      claim.ApplicationData.status
                    );
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
                              statusText
                            )} h-2 w-full rounded-t-lg`}
                          ></div>

                          <div className="bg-white p-2 rounded-lg shadow shadow-xl">
                            <div className="flex justify-between items-center mb-4">
                              <p className="text-md">Status: {statusText}</p>
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
                                    {claim.ApplicationData.profileData?.age}
                                  </div>
                                  <div className="flex justify-between mb-4 text-md">
                                    <span className="font-bold">
                                      Nationality:
                                    </span>
                                    {
                                      claim.ApplicationData.profileData?.nationality
                                    }
                                  </div>
                                  <div className="flex justify-between mb-4 text-md">
                                    <span className="font-bold">Race:</span>
                                    {claim.ApplicationData.profileData?.race}
                                  </div>
                                  <div className="flex justify-between items-center mb-4">
                                    <span className="font-bold">
                                      Veteran Status:
                                    </span>
                                    {claim.ApplicationData.profileData?.veteran === 0
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
                                  <ViewAnswers questionData={claim.GrantData.QuestionData} answerData={claim.ApplicationData.answers} />
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
              ) : (
                <div className="text-center mt-20 mb-10 text-black">
                  <p className="text-3xl font-semibold">
                    You have no recent grants applications. Start applying now!
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-between items-start flex-col md:flex-row text-black">
              <div className="flex-1 m-2">
                <h3 className="text-lg font-semibold mb-4 text-center sm:text-left">
                  Your Grants Benefits
                </h3>
                <div
                  className="bg-white p-6 rounded-lg shadow-lg"
                  style={{ backgroundColor: "#eaf4e0" }}
                >
                  <p className="font-semibold mb-4">
                    Calculate your grants amount
                  </p>
                  <p className="mb-4">
                    Calculate how much you could be approved for your benefits.
                  </p>
                  <div className="flex justify-center">
                    <button
                      className="bg-green-600 text-white px-4 py-2 sm:px-5 sm:py-2 rounded-full hover:bg-green-800 transition-colors text-sm sm:text-base"
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
                <h3 className="text-lg font-semibold mb-4 text-center sm:text-left">
                  Search for a Grant
                </h3>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <p className="font-semibold mb-4">Find a grant for you</p>
                  <p className="mb-4">
                    Search for grants that precisely align with your individual
                    needs.
                  </p>
                  <div className="flex justify-center">
                    <Link
                      href="/search_grants"
                      className="bg-green-600 text-white px-4 py-2 sm:px-5 sm:py-2 rounded-full hover:bg-green-800 transition-colors text-sm sm:text-base"
                    >
                      Find Grants
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-center sm:text-left mb-5 mt-20 text-black">
              Read Our Stories
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-lg shadow-lg overflow-hidden">
                <img
                  src="https://jdrf.ca/wp-content/uploads/2024/02/GRANT-Blog_Hero-Banner_1280x720-1024x576.jpg"
                  alt="Family image"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h5 className="text-lg font-semibold mb-2">
                    Perspectives form a family
                  </h5>
                  <p className="text-gray-700">
                    Thanks to 5ABC, we've turned our vision into reality. The
                    process was straightforward, and the support we received was
                    unparalleled. Truly a game-changer for us.
                  </p>
                </div>
              </div>
              {/* Card 2 */}
              <div className="rounded-lg shadow-lg overflow-hidden">
                <img
                  src="https://otf.ca/sites/default/files/styles/responsive_1040/public/2021-07/YOF_Announcement_July_2021.jpg?itok=uZGXy9B6"
                  alt="Students image"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h5 className="text-lg font-semibold mb-2">
                    Perspectives from students
                  </h5>
                  <p className="text-gray-700">
                    I was new to grant writing and felt overwhelmed by the
                    complexity. 5ABC provided the tools and confidence I needed
                    to secure funding. Their platform is a must-have for anyone
                    serious about making an impact.
                  </p>
                </div>
              </div>
              {/* Card 3 */}
              <div className="rounded-lg shadow-lg overflow-hidden">
                <img
                  src="https://www.pegasusseniorliving.com/the-oaks-at-inglewood/wp-content/uploads/sites/38/2022/08/oaks-group-of-happy-seniors-friends-1024x683.jpeg"
                  alt="Elderly image"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h5 className="text-lg font-semibold mb-2">
                    Perspectives from elderly
                  </h5>
                  <p className="text-gray-700">
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
