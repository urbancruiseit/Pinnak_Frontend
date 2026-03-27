"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";

type RegionFormData = {
  regionName: string;
};

type Region = {
  id: number;
  regionName: string;
  createdAt: string;
};

export default function RegionManagement() {
  const [showModal, setShowModal] = useState(false);
  const [regions, setRegions] = useState<Region[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegionFormData>();

  const onSubmit = (data: RegionFormData) => {
    const newRegion: Region = {
      id: Date.now(),
      regionName: data.regionName,
      createdAt: new Date().toLocaleString(),
    };

    setRegions((prev) => [...prev, newRegion]);

    alert("Region Added Successfully ✅");

    reset();
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this region?")) {
      setRegions((prev) => prev.filter((region) => region.id !== id));
    }
  };

  return (
    <div className="p-10">
      {/* Header */}
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Region Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-2 bg-green-600 text-white rounded-lg"
        >
          + Add Region
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-[450px] rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-bold mb-6 text-center">Add Region</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Region Name */}
              <div>
                <label className="block font-semibold mb-2">
                  Region Name *
                </label>
                <input
                  {...register("regionName", {
                    required: "Region name is required",
                  })}
                  className="w-full border p-2 rounded-md"
                  placeholder="Enter region name"
                />
                {errors.regionName && (
                  <p className="text-red-500 text-sm">
                    {errors.regionName.message}
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

      {/* Region Table */}
      <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border text-left">Region Name</th>
              <th className="p-3 border text-left">Created At</th>
              <th className="p-3 border text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {regions.length > 0 ? (
              regions.map((region) => (
                <tr key={region.id} className="hover:bg-gray-50">
                  <td className="p-3 border">{region.regionName}</td>
                  <td className="p-3 border">{region.createdAt}</td>
                  <td className="p-3 border">
                    <button
                      onClick={() => handleDelete(region.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center p-4 text-gray-500">
                  No regions added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}