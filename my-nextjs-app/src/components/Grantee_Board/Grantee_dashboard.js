"use client";

import dynamic from "next/dynamic";
import React from "react";
import { useRouter } from "next/navigation";

const Grantee_dashboard = () => {
  const name = "Rawad";
  // Mock data for claims
  const recentClaims = [
    {
      id: 1,
      title: "Medical Expense Claim",
      status: "Pending",
      applicantName: "John Doe",
      category: "Medical",
      dateSubmitted: "2024-03-07",
      amountPayable: "1200",
    },
    {
      id: 2,
      title: "Travel Reimbursement",
      status: "Approved",
      applicantName: "Jane Smith",
      category: "Travel",
      dateSubmitted: "2024-02-28",
      amountPayable: "300",
    },
    {
      id: 3,
      title: "Work From Home Setup",
      status: "Rejected",
      applicantName: "Alice Johnson",
      category: "Equipment",
      dateSubmitted: "2024-01-15",
      amountPayable: "500",
    },
  ];

  // Function to get the color based on the claim status
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

  const router = useRouter();

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
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="bg-white p-6 rounded-lg">
              <h1 className="text-black lg:text-4xl md:text-3xl text-3xl text-center sm:text-left font-semibold mb-20 text-left">
                Hello, {name}!
              </h1>
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 mb-4">
                <h2 className="text-xl font-semibold">
                  Your Recent Applications
                </h2>

                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <button
                    onClick={() => {
                      router.push("/applied_grants");
                    }}
                    className="text-green-700 hover:text-green-900 transition-colors px-4 py-2 sm:px-5 sm:py-2 rounded-full text-sm sm:text-base"
                  >
                    View My Applications
                  </button>
                  <button className="bg-green-600 text-white px-4 py-2 sm:px-5 sm:py-2 rounded-full hover:bg-green-800 transition-colors text-sm sm:text-base">
                    Submit an Application
                  </button>
                </div>
              </div>

              {recentClaims.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentClaims.map((claim) => (
                    <div key={claim.id} className="p-2">
                      <div
                        className={`${getStatusColor(
                          claim.status
                        )} h-2 w-full rounded-t-lg`}
                      ></div>
                      {/* Card content */}
                      <div className="bg-white p-4 rounded-lg shadow shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                          <p className="text-md">Status: {claim.status}</p>
                          <button className="text-green-700 text-md hover:text-green-900 transition duration-150 ease-in-out">
                            View Details
                          </button>
                        </div>
                        <p className="mb-2 text-md">{claim.applicantName}</p>

                        <p className="mb-2">{claim.category}</p>

                        <div className="flex justify-between items-center">
                          <p>Date Submitted: {claim.dateSubmitted}</p>
                          <p>Amount Payable: ${claim.amountPayable}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center mt-20 mb-10">
                  <p className="text-3xl font-semibold">
                    You have no recent grants applications. Start applying now!
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-between items-start flex-col md:flex-row">
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
                    Calculate how much you could be approved for your eligible
                    benefits.
                  </p>
                  <div className="flex justify-center">
                    <button className="bg-green-600 text-white px-4 py-2 sm:px-5 sm:py-2 rounded-full hover:bg-green-800 transition-colors text-sm sm:text-base">
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
                    Search for grants that match your needs.
                  </p>
                  <div className="flex justify-center">
                    <button className="bg-green-600 text-white px-4 py-2 sm:px-5 sm:py-2 rounded-full hover:bg-green-800 transition-colors text-sm sm:text-base">
                      Find Grants
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-center sm:text-left mb-5 mt-20">
              Read Our Stories
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-lg shadow-lg overflow-hidden">
                <img
                  src="https://jdrf.ca/wp-content/uploads/2024/02/GRANT-Blog_Hero-Banner_1280x720-1024x576.jpg"
                  alt="Card image 1"
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
                  alt="Card image 2"
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
                  alt="Card image 3"
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
