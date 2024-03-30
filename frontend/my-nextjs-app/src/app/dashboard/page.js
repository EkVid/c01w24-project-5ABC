'use client'
import dynamic from "next/dynamic";

const DashboardHomeElement = dynamic(
    () => import("@/components/Dashboard/DashboardHome.js"), 
    {ssr: false,}
);

const Dashboard = () => {
 
  return (
    <div className="mb-auto">
      <DashboardHomeElement/>
    </div>
  )
}

export default Dashboard;