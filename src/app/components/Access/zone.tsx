"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";

type ZoneFormData = {
  region: string;
  zoneName: string;
};

type Zone = {
  id: number;
  region: string;
  zoneName: string;
  createdAt: string;
};

const regions = ["North", "South", "West", "East"];

export default function ZoneManagement() {
  const [showModal, setShowModal] = useState(false);
  const [zones, setZones] = useState<Zone[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ZoneFormData>();

  const onSubmit = (data: ZoneFormData) => {
    const newZone: Zone = {
      id: Date.now(),
      region: data.region,
      zoneName: data.zoneName,
      createdAt: new Date().toLocaleString(),
    };

    setZones((prev) => [...prev, newZone]);

    alert("Zone Added Successfully ✅");

    reset();
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this zone?")) {
      setZones((prev) => prev.filter((zone) => zone.id !== id));
    }
  };

  return (
    <div className="p-10">
      {/* Header */}
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Zone Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-2 bg-green-600 text-white rounded-lg"
        >
          + Add Zone
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-[500px] rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-bold mb-6 text-center">Add Zone</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Region Select */}
              <div>
                <label className="block font-semibold mb-2">
                  Select Region *
                </label>
                <select
                  {...register("region", { required: "Region is required" })}
                  className="w-full border p-2 rounded-md"
                >
                  <option value="">Select Region</option>
                  {regions.map((region, index) => (
                    <option key={index} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
                {errors.region && (
                  <p className="text-red-500 text-sm">
                    {errors.region.message}
                  </p>
                )}
              </div>

              {/* Zone Name */}
              <div>
                <label className="block font-semibold mb-2">Zone Name *</label>
                <input
                  {...register("zoneName", {
                    required: "Zone name is required",
                  })}
                  className="w-full border p-2 rounded-md"
                  placeholder="Enter zone name"
                />
                {errors.zoneName && (
                  <p className="text-red-500 text-sm">
                    {errors.zoneName.message}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md"
                >
                  Submit
                </button>

                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setShowModal(false);
                  }}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Zone Table */}
      <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border text-left">Region</th>
              <th className="p-3 border text-left">Zone Name</th>
              <th className="p-3 border text-left">Created At</th>
              <th className="p-3 border text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {zones.length > 0 ? (
              zones.map((zone) => (
                <tr key={zone.id} className="hover:bg-gray-50">
                  <td className="p-3 border">{zone.region}</td>
                  <td className="p-3 border">{zone.zoneName}</td>
                  <td className="p-3 border">{zone.createdAt}</td>
                  <td className="p-3 border">
                    <button
                      onClick={() => handleDelete(zone.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center p-4 text-gray-500">
                  No zones added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
