'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MapPin, FileText, Users, Globe } from 'lucide-react';

// Define validation schema
const citySchema = z.object({
  cityName: z.string().min(1, 'City name is required'),
  state: z.string().min(1, 'State is required'),
  zone: z.string().min(1, 'Zone is required'),
  region: z.string().min(1, 'Region is required'),
});

// Define form data type
type CityFormData = z.infer<typeof citySchema>;

export default function CityForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cities, setCities] = useState([]);
  const [editingCity, setEditingCity] = useState<any>(null);

  const fetchCities = async () => {
    try {
      const response = await fetch('/api/city');
      if (response.ok) {
        const data = await response.json();
        setCities(data);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const handleEdit = (city: any) => {
    setEditingCity(city);
    reset({
      cityName: city.city_name,
      state: city.state,
      zone: city.zone,
      region: city.region,
    });
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this city?')) {
      try {
        const response = await fetch(`/api/city/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('City deleted successfully!');
          fetchCities();
        } else {
          throw new Error('Delete failed');
        }
      } catch (error) {
        console.error('Error deleting city:', error);
        alert('Failed to delete. Please try again.');
      }
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    reset,
  } = useForm<CityFormData>({
    resolver: zodResolver(citySchema),
  });

  const onSubmit = async (data: CityFormData) => {
    setIsSubmitting(true);
    try {
      let response;
      if (editingCity) {
        // Update
        response = await fetch(`/api/city/${editingCity.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      } else {
        // Create
        response = await fetch('/api/city', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      }

      if (response.ok) {
        alert(`City ${editingCity ? 'updated' : 'submitted'} successfully!`);
        setEditingCity(null);
        fetchCities(); // Refresh the list
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 w-[165vh] mx-auto bg-white shadow-xl rounded-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Header */}
        <div className="mb-8 bg-orange-100 p-4 rounded-xl">
          <h2 className="text-2xl font-bold text-center text-orange-600">City Management</h2>
          <p className="text-center text-orange-700 mt-2">
            <span className="text-red-500">*</span> All fields marked with asterisk are required
          </p>
        </div>

        {/* City Information Section */}
        <div className="border rounded-xl p-6 bg-blue-50">
          <h3 className="text-xl font-semibold text-blue-800 mb-6 pb-3 border-b">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-md mr-2">1</span>
            City Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-md font-extrabold text-gray-700 mb-1">
                City Name <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <input
                  {...register('cityName')}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter city name"
                />
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 group-focus-within:animate-pulse" size={20} />
              </div>
              {errors.cityName && (
                <p className="text-red-500 text-sm mt-1">{errors.cityName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-md font-extrabold text-gray-700 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <input
                  {...register('state')}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter state"
                />
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 group-focus-within:animate-pulse" size={20} />
              </div>
              {errors.state && (
                <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
              )}
            </div>

            <div>
              <label className="block text-md font-extrabold text-gray-700 mb-1">
                Zone <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <select
                  {...register('zone')}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Zone</option>
                  <option value="WEST - 1">WEST - 1</option>
                  <option value="WEST - 2">WEST - 2</option>
                  <option value="SOUTH - 1">SOUTH - 1</option>
                  <option value="SOUTH - 2">SOUTH - 2</option>
                  <option value="NORTH - 2">NORTH - 2</option>
                  <option value="NORTH - 1">NORTH - 1</option>
                  <option value="EAST">EAST</option>
                  <option value="N.EAST">N.EAST</option>
                </select>
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 group-focus-within:animate-pulse" size={20} />
              </div>
              {errors.zone && (
                <p className="text-red-500 text-sm mt-1">{errors.zone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-md font-extrabold text-gray-700 mb-1">
                Region <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <select
                  {...register('region')}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Region</option>
                  <option value="east">East</option>
                  <option value="west">West</option>
                  <option value="south">South</option>
                  <option value="north">North</option>
                </select>
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 group-focus-within:animate-pulse" size={20} />
              </div>
              {errors.region && (
                <p className="text-red-500 text-sm mt-1">{errors.region.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className={`flex-1 px-6 py-3 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-900 text-white hover:bg-blue-500'
            }`}
          >
            {isSubmitting ? 'Submitting...' : editingCity ? 'Update City Details' : 'Submit City Details'}
          </button>
          {editingCity && (
            <button
              type="button"
              onClick={() => {
                setEditingCity(null);
                reset();
              }}
              className="px-6 py-3 font-medium rounded-md bg-gray-500 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* City List Table */}
      <div className="mt-8 border rounded-xl p-6 bg-gray-50">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-3 border-b">
          Saved Cities
        </h3>
        {cities.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-left">City Name</th>
                  <th className="py-2 px-4 border-b text-left">State</th>
                  <th className="py-2 px-4 border-b text-left">Zone</th>
                  <th className="py-2 px-4 border-b text-left">Region</th>
                  <th className="py-2 px-4 border-b text-left">Created At</th>
                  <th className="py-2 px-4 border-b text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {cities.map((city: any) => (
                  <tr key={city.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{city.city_name}</td>
                    <td className="py-2 px-4 border-b">{city.state}</td>
                    <td className="py-2 px-4 border-b">{city.zone}</td>
                    <td className="py-2 px-4 border-b">{city.region}</td>
                    <td className="py-2 px-4 border-b">{new Date(city.created_at).toLocaleString()}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => handleEdit(city)}
                        className="mr-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(city.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No cities saved yet.</p>
        )}
      </div>
    </div>
  );
}