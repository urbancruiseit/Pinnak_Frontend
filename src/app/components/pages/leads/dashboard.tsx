"use client";

import { useEffect, useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { fetchLeads } from "@/app/features/lead/leadSlice";
import type { LeadRecord } from "@/types/types";

export default function LeadsDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { leads, loading, error, totalPages, total } = useSelector(
    (state: RootState) => state.lead,
  );
  const [period, setPeriod] = useState<"month" | "week" | "day">("month");

  useEffect(() => {
    // Fetch all leads for dashboard (use a large limit to get all)
    dispatch(fetchLeads(1) as any);
  }, [dispatch]);

  // Calculate stats from Redux leads
  const totalLeads = total;
  const pendingLeads = useMemo(
    () =>
      leads.filter((lead) => !["Book", "Lost"].includes(lead.status)).length,
    [leads],
  );
  const bookedLeads = useMemo(
    () => leads.filter((lead) => lead.status === "Book").length,
    [leads],
  );
  const lostLeads = useMemo(
    () => leads.filter((lead) => lead.status === "Lost").length,
    [leads],
  );

  // All leads sorted by date descending (latest first)
  const ageLeads = useMemo(
    () =>
      [...leads].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    [leads],
  );

  // Calculate aged leads (older than 7 days)
  const agedLeadsCount = useMemo(() => {
    const now = new Date();
    return leads.filter((lead) => {
      const leadDate = new Date(lead.date);
      const diffTime = now.getTime() - leadDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));
      return diffDays > 7;
    }).length;
  }, [leads]);

  const stats = [
    { title: "Total Leads", value: totalLeads, color: "bg-blue-500" },
    { title: "Pending Leads", value: pendingLeads, color: "bg-yellow-500" },
    { title: "Booked Leads", value: bookedLeads, color: "bg-green-500" },
    { title: "Lost Leads", value: lostLeads, color: "bg-red-500" },
    {
      title: "Aged Leads (>7 days)",
      value: agedLeadsCount,
      color: "bg-purple-500",
    },
  ];

  // Chart data for leads over time
  const chartData = useMemo(() => {
    return leads.reduce((acc: Record<string, number>, lead) => {
      const date = new Date(lead.date);
      let key: string;
      if (period === "month") {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      } else if (period === "week") {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split("T")[0];
      } else {
        key = lead.date;
      }
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [leads, period]);

  const chartArray = useMemo(
    () =>
      Object.entries(chartData)
        .map(([date, count]) => ({
          date,
          count,
        }))
        .sort((a, b) => a.date.localeCompare(b.date)),
    [chartData],
  );

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Leads Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-50 rounded-lg shadow p-6 border">
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full ${stat.color} mr-3`}></div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Leads Over Time</h2>
          <div className="mb-4">
            <label className="mr-4">
              <input
                type="radio"
                value="month"
                checked={period === "month"}
                onChange={(e) => setPeriod(e.target.value as "month")}
                className="mr-2"
              />
              Month
            </label>
            <label className="mr-4">
              <input
                type="radio"
                value="week"
                checked={period === "week"}
                onChange={(e) => setPeriod(e.target.value as "week")}
                className="mr-2"
              />
              Week
            </label>
            <label>
              <input
                type="radio"
                value="day"
                checked={period === "day"}
                onChange={(e) => setPeriod(e.target.value as "day")}
                className="mr-2"
              />
              Day
            </label>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartArray}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Lead Age Table */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Aged Leads</h2>
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="min-w-full table-auto">
              <thead className="sticky top-0 bg-gray-50">
                <tr>
                  <th className="px-4 py-2 bg-green-50 text-left text-xs font-bold text-green-800 uppercase">
                    Customer
                  </th>
                  <th className="px-4 py-2 bg-purple-50 text-left text-xs font-bold text-purple-800 uppercase">
                    Date
                  </th>
                  <th className="px-4 py-2 bg-blue-50 text-left text-xs font-bold text-blue-800 uppercase">
                    Assigned To
                  </th>
                  <th className="px-4 py-2 bg-yellow-50 text-left text-xs font-bold text-yellow-800 uppercase">
                    Days Old
                  </th>
                  <th className="px-4 py-2 bg-red-50 text-left text-xs font-bold text-red-800 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {ageLeads.slice(0, 20).map((lead) => {
                  const leadDate = new Date(lead.date);
                  const now = new Date();
                  const diffTime = now.getTime() - leadDate.getTime();
                  const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));
                  const formattedDate = leadDate.toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  });
                  return (
                    <tr key={lead.id} className="border-t text-gray-900">
                      <td className="px-4 py-2 text-sm font-medium">
                        {lead.customerName}
                      </td>
                      <td className="px-4 py-2 text-sm">{formattedDate}</td>
                      <td className="px-4 py-2 text-sm">{lead.telecaller}</td>
                      <td className="px-4 py-2 text-sm">{diffDays}</td>
                      <td className="px-4 py-2 text-sm">{lead.status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Transfer/Swap Analytics */}
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">
          Transfer & Swap Analytics
        </h2>
        <p className="text-gray-600">
          Analytics for transferred and swapped leads will be displayed here.
        </p>
        {/* Placeholder for transfer/swap data */}
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            No transfer/swap data available yet.
          </p>
        </div>
      </div>
    </div>
  );
}
