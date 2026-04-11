"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Home,
  Building,
  Globe,
  Info,
} from "lucide-react";
import { AppDispatch, RootState } from "../../../redux/store";
import {
  fetchAllCities,
  fetchStatesByCity,
  resetStatesForCity,
} from "../../../features/State/stateSlice";
import {
  searchCustomersThunk,
  clearSearchResults,
  createCustomerThunk,
  updateCustomerThunk,
} from "../../../features/NewCustomer/NewCustomerSlice";
import { getCountriesThunk } from "../../../features/countrycode/countrycodeSlice";

interface CustomerRecord {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  alternatePhone: string;
  dateOfBirth: string;
  anniversary: string;
  gender: string;
  address: string;
  state: string;
  city: string;
  pincode: string;
  stateId?: number;
  cityId?: number;
  companyName: string;
  customerType: string;
  customerCategoryType: string;
  countryName: string;
  customerCity: string;
  customerState: string;
  customerAddress: string;
}

const initialFormState: CustomerRecord = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  phone: "",
  alternatePhone: "",
  dateOfBirth: "",
  anniversary: "",
  gender: "",
  address: "",
  state: "",
  city: "",
  pincode: "",
  companyName: "",
  customerType: "",
  customerCategoryType: "",
  countryName: "",
  customerCity: "",
  customerState: "",
  customerAddress: "",
};

const CustomerForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [mode, setMode] = useState<string>("");

  // Redux states with safe fallbacks
  const stateSlice = useSelector((state: RootState) => state.stateCity);
  const newCustomerSlice = useSelector((state: RootState) => state.newCustomer);
  const countrycodeSlice = useSelector((state: RootState) => state.country);

  // Safe destructuring with fallbacks
  const {
    cities = [],
    statesForCity = [],
    loading: stateLoading = false,
  } = stateSlice || {};

  const {
    searchResults = [],
    loading: customerLoading = false,
    error: customerError = null,
  } = newCustomerSlice || {};

  const { countries = [], loading: countriesLoading = false } =
    countrycodeSlice || {};

  const [formData, setFormData] = useState<CustomerRecord>(initialFormState);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {},
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Dropdown states
  const [isLoadingCities, setIsLoadingCities] = useState(true);

  // Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching] = useState(false);

  // Additional states
  const [alternateCountryCode, setAlternateCountryCode] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [countryName, setCountryName] = useState("");
  const [customerCity, setCustomerCity] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editCustomerId, setEditCustomerId] = useState<number | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);

  // ─── Handle mode from URL params ─────────────────────────────────────────
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlMode = params.get("mode");
      setMode(urlMode || "");
      if (urlMode === "edit") {
        setIsEditMode(true);
      } else if (urlMode === "view") {
        setIsViewMode(true);
      }
    }
  }, []);

  // ─── Load edit customer data from localStorage on mount ──────────────────
  useEffect(() => {
    const editData = localStorage.getItem("editCustomerData");
    if (editData) {
      const customer = JSON.parse(editData);
      setFormData({
        firstName: customer.firstName || "",
        middleName: customer.middleName || "",
        lastName: customer.lastName || "",
        email: customer.customerEmail || "",
        phone: customer.customerPhone || "",
        alternatePhone: customer.alternatePhone || "",
        dateOfBirth: customer.dateOfBirth || "",
        anniversary: customer.anniversary || "",
        gender: customer.gender || "",
        address: customer.address || "",
        state: customer.state || "",
        city: customer.city || "",
        pincode: customer.pincode || "",
        stateId: customer.stateId,
        cityId: customer.cityId,
        companyName: customer.companyName || "",
        customerType: customer.customerType || "",
        customerCategoryType: customer.customerCategoryType || "",
        countryName: customer.countryName || "",
        customerCity: customer.customerCity || "",
        customerState: customer.customerState || "",
        customerAddress: customer.customerAddress || "",
      });
      setEditCustomerId(customer.id || null);
      setIsEditMode(true);
      localStorage.removeItem("editCustomerData");
    }
  }, []);

  // ─── Load cities from Redux on mount ───────────────────────────────────
  useEffect(() => {
    const loadCities = async () => {
      try {
        setIsLoadingCities(true);
        await dispatch(fetchAllCities()).unwrap();
      } catch (err) {
        console.error("Cities fetch error:", err);
      } finally {
        setIsLoadingCities(false);
      }
    };
    loadCities();
  }, [dispatch]);

  // ─── Load countries from Redux on mount ────────────────────────────────
  useEffect(() => {
    dispatch(getCountriesThunk());
  }, [dispatch]);

  // ─── City change → fetch states from Redux ─────────────────────────────
  const handleCityChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCity = e.target.value;
    const selectedCityObj = cities.find((c) => c?.cityName === selectedCity);

    // Reset state first
    dispatch(resetStatesForCity());

    setFormData((prev) => ({
      ...prev,
      city: selectedCity,
      cityId: selectedCityObj?.id,
      state: "",
      stateId: undefined,
    }));

    if (errors.city) setErrors((prev) => ({ ...prev, city: "" }));

    if (!selectedCity) return;

    try {
      await dispatch(fetchStatesByCity(selectedCity)).unwrap();
    } catch (err) {
      console.error("States fetch error:", err);
    }
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStateName = e.target.value;
    const selectedState = statesForCity.find(
      (s) => s?.stateName === selectedStateName,
    );

    setFormData((prev) => ({
      ...prev,
      state: selectedStateName,
      stateId: selectedState?.id,
    }));

    if (errors.state) setErrors((prev) => ({ ...prev, state: "" }));
  };

  // ─── For India specific city/state (if needed) ─────────────────────────
  useEffect(() => {
    const loadCitiesForIndia = async () => {
      if (countryName === "India") {
        try {
          await dispatch(fetchAllCities()).unwrap();
        } catch (err) {
          console.error("Cities fetch error:", err);
        }
      }
    };
    loadCitiesForIndia();
  }, [dispatch, countryName]);

  // ─── Load states when customer city is selected ────────────────────────
  useEffect(() => {
    const loadStates = async () => {
      if (customerCity) {
        try {
          await dispatch(fetchStatesByCity(customerCity)).unwrap();
        } catch (err) {
          console.error("States fetch error:", err);
        }
      } else {
        dispatch(resetStatesForCity());
      }
    };
    loadStates();
  }, [dispatch, customerCity]);

  // ─── Search customers using Redux Thunk ────────────────────────────────
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.length >= 2) {
        handleSearch();
      } else {
        dispatch(clearSearchResults());
        setShowDropdown(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, dispatch]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      setSearching(true);
      await dispatch(searchCustomersThunk(searchTerm)).unwrap();
      setShowDropdown(searchResults.length > 0);
    } catch (err: any) {
      console.error("Search error:", err);
      setShowDropdown(false);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectCustomer = (customer: any) => {
    const nameParts = (customer.customerName || "").split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    setFormData({
      ...formData,
      firstName: firstName,
      middleName: "",
      lastName: lastName,
      email: customer.customerEmail || "",
      phone: customer.customerPhone || "",
      companyName: customer.companyName || "",
    });
    setSearchTerm("");
    setShowDropdown(false);
    dispatch(clearSearchResults());
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    dispatch(clearSearchResults());
    setShowDropdown(false);
  };

  const handleFieldChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const markFieldTouched = (fieldName: string) => {
    setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const requiredFields = [
      "firstName",
      "lastName",
      "phone",
      "address",
      "city",
      "state",
      "pincode",
    ];

    requiredFields.forEach((field) => {
      const value = formData[field as keyof CustomerRecord];
      if (!value || (typeof value === "string" && !value.trim())) {
        const label =
          field === "firstName"
            ? "First name"
            : field === "lastName"
              ? "Last name"
              : field.charAt(0).toUpperCase() + field.slice(1);
        newErrors[field] = `${label} is required`;
      }
    });

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter valid email";

    if (formData.phone && !/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone must be 10 digits";

    if (formData.pincode && !/^\d{6}$/.test(formData.pincode))
      newErrors.pincode = "Pincode must be 6 digits";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─── Submit using Redux Thunk ──────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched: Record<string, boolean> = {};
    Object.keys(formData).forEach((k) => (allTouched[k] = true));
    setTouchedFields(allTouched);

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      setError(null);

      if (isEditMode && editCustomerId) {
        await dispatch(
          updateCustomerThunk({ id: editCustomerId, data: formData }),
        ).unwrap();
        setIsSuccess(true);
      } else {
        await dispatch(createCustomerThunk(formData)).unwrap();
        setIsSuccess(true);
        setFormData(initialFormState);
        dispatch(resetStatesForCity());
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        setIsSuccess(false);
        if (isEditMode) {
          setIsEditMode(false);
          setEditCustomerId(null);
          setFormData(initialFormState);
        }
      }, 3000);
    } catch (err: any) {
      setError(err?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const getInputClass = (field: string, icon = true) => {
    const base = `w-full ${icon ? "pl-10" : "px-4"} pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors`;
    if (touchedFields[field] && errors[field])
      return `${base} border-red-500 bg-red-50 focus:ring-red-200`;
    return `${base} border-gray-300 focus:ring-blue-200 focus:border-blue-400`;
  };

  // Get unique cities for dropdown with safe check
  const uniqueCities = React.useMemo(() => {
    if (!cities || !Array.isArray(cities)) return [];
    const unique = [...new Map(cities.map((c) => [c?.cityName, c])).values()];
    return unique;
  }, [cities]);

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-orange-100 p-3 rounded-md shadow-sm">
        <div className="flex justify-between items-center">
          <div className="pl-4 border-l-8 border-orange-500 bg-white px-3 rounded-md shadow-md">
            <h2 className="text-4xl font-bold text-left py-4 text-orange-600">
              {isViewMode ? "View Customer" : isEditMode ? "Edit Customer" : "Customer Registration Form"}
            </h2>
          </div>
          {(isEditMode || isViewMode) && (
            <button
              onClick={() => router.push("/dashboard?tab=customer-table")}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Back to Table
            </button>
          )}
        </div>
      </div>

      <div className="p-6 w-full mx-auto bg-white shadow-xl rounded-lg my-6">
        {/* Status Messages */}
        {(error || customerError) && (
          <div className="flex items-center gap-2 p-4 mb-6 text-red-700 bg-red-50 rounded-lg border border-red-200">
            <AlertCircle size={20} />
            <span className="font-medium">{error || customerError}</span>
          </div>
        )}
        {isSuccess && (
          <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-5 py-3 text-green-700 bg-green-50 border border-green-300 rounded-lg shadow-lg">
            <CheckCircle2 size={20} />
            <span className="font-medium">
              Customer registered successfully!
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information Section */}
          <div className="border rounded-xl p-6 bg-green-50">
            <div className="flex justify-between items-center mb-6 pb-3 border-b">
              <h3 className="text-xl font-semibold text-green-800 flex items-center">
                <span className="bg-green-600 text-white px-3 py-1 rounded-md mr-2">
                  1
                </span>
                Customer Information
              </h3>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search customers by name, email or phone..."
                  className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-80"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() =>
                    searchResults.length > 0 && setShowDropdown(true)
                  }
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>

                {searchTerm && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}

                {searching && (
                  <div className="absolute top-full mt-2 w-full bg-white border rounded-lg shadow-lg z-50 p-4 text-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600 mx-auto"></div>
                  </div>
                )}

                {showDropdown && !searching && searchResults.length > 0 && (
                  <div className="absolute top-full mt-2 w-full bg-white border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                    {searchResults.map((customer) => (
                      <div
                        key={customer.uuid}
                        className="p-3 hover:bg-gray-100 cursor-pointer border-b"
                        onMouseDown={() => handleSelectCustomer(customer)}
                      >
                        <div className="font-semibold text-gray-800">
                          {customer.firstName} {customer.lastName}
                        </div>
                        <div className="text-sm text-gray-600">
                          {customer.customerEmail && (
                            <span>{customer.customerEmail} | </span>
                          )}
                          {customer.customerPhone}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* First Name */}
              <div>
                <label className="block text-md font-extrabold text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleFieldChange}
                    onBlur={() => markFieldTouched("firstName")}
                    className="w-full py-2 border bg-white pl-10 pr-3 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={50}
                    placeholder="Enter first name"
                  />
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600"
                    size={20}
                  />
                </div>
                {touchedFields.firstName && errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* Middle Name */}
              <div>
                <label className="block text-md font-extrabold text-gray-700 mb-1">
                  Middle Name
                </label>
                <div className="relative">
                  <input
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleFieldChange}
                    className="w-full py-2 border bg-white pl-10 pr-3 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={50}
                    placeholder="Enter middle name"
                  />
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600"
                    size={20}
                  />
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-md font-extrabold text-gray-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleFieldChange}
                    onBlur={() => markFieldTouched("lastName")}
                    className="w-full py-2 border bg-white pl-10 pr-3 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={50}
                    placeholder="Enter last name"
                  />
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600"
                    size={20}
                  />
                </div>
                {touchedFields.lastName && errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>

              {/* Phone No. (India) */}
              <div>
                <label className="block text-md font-extrabold text-gray-700 mb-1">
                  Phone No. (India) <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                  <div className="bg-gray-100 px-3 py-2 text-sm font-medium min-w-[80px] text-center">
                    +91 IND
                  </div>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(
                        /[^0-9]/g,
                        "",
                      );
                      handleFieldChange({
                        ...e,
                        target: {
                          ...e.target,
                          name: "phone",
                          value: numericValue,
                        },
                      });
                    }}
                    placeholder="Enter 10 digit number"
                    className="w-full py-2 px-3 outline-none"
                    maxLength={10}
                  />
                  <Phone
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600"
                    size={20}
                  />
                </div>
                {touchedFields.phone && errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-md font-extrabold text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleFieldChange}
                    onBlur={() => markFieldTouched("email")}
                    placeholder="Enter email address"
                    className="w-full py-2 border bg-white pl-10 pr-3 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={100}
                  />
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600"
                    size={20}
                  />
                </div>
                {touchedFields.email && errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Country Dropdown - Using Redux countries */}
              <div>
                <label className="block text-md font-extrabold text-gray-700 mb-1">
                  Country
                </label>
                <div className="relative">
                  <Globe
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600"
                    size={20}
                  />
                  <select
                    name="countryName"
                    value={formData.countryName}
                    onChange={handleFieldChange}
                    className="w-full py-2 border bg-white pl-10 pr-3 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={countriesLoading}
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.id} value={country.country_name}>
                        {country.country_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Customer Type */}
              <div>
                <label className="block text-md font-extrabold text-gray-700 mb-1">
                  Customer Type
                </label>
                <div className="relative">
                  <Building
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600"
                    size={20}
                  />
                  <select
                    name="customerType"
                    value={formData.customerType}
                    onChange={handleFieldChange}
                    className="w-full py-2 border bg-white pl-10 pr-3 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Customer Type</option>
                    <option value="Personal">Personal</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Travel Agent">Travel Agent</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="p-6 border rounded-xl bg-green-50">
            <h3 className="mb-4 text-xl font-semibold text-green-800 flex items-center gap-2">
              <Home size={20} /> Address Information
            </h3>

            <div className="mb-4">
              <label className="block font-medium text-gray-700 mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                placeholder="Enter complete address"
                value={formData.address}
                onChange={handleFieldChange}
                onBlur={() => markFieldTouched("address")}
                className={getInputClass("address", false)}
                rows={3}
              />
              {touchedFields.address && errors.address && (
                <p className="text-sm text-red-600 mt-1">{errors.address}</p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {/* City Dropdown - Using Redux cities */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-3 top-3 text-gray-400 z-10"
                    size={18}
                  />
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleCityChange}
                    onBlur={() => markFieldTouched("city")}
                    className={getInputClass("city")}
                    disabled={isLoadingCities}
                  >
                    <option value="">
                      {isLoadingCities ? "Loading cities..." : "Select City"}
                    </option>
                    {uniqueCities.map((city) => (
                      <option key={city.id} value={city.cityName}>
                        {city.cityName}
                      </option>
                    ))}
                  </select>
                </div>
                {touchedFields.city && errors.city && (
                  <p className="text-sm text-red-600 mt-1">{errors.city}</p>
                )}
              </div>

              {/* State Dropdown - Using Redux statesForCity */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-3 top-3 text-gray-400 z-10"
                    size={18}
                  />
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleStateChange}
                    onBlur={() => markFieldTouched("state")}
                    className={getInputClass("state")}
                    disabled={
                      !formData.city ||
                      stateLoading ||
                      statesForCity.length === 0
                    }
                  >
                    <option value="">
                      {stateLoading
                        ? "Loading states..."
                        : !formData.city
                          ? "First select city"
                          : "Select State"}
                    </option>
                    {statesForCity.map((state) => (
                      <option key={state.id} value={state.stateName}>
                        {state.stateName}
                      </option>
                    ))}
                  </select>
                  {stateLoading && (
                    <div className="absolute right-3 top-3">
                      <svg
                        className="animate-spin h-5 w-5 text-blue-500"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                {touchedFields.state && errors.state && (
                  <p className="text-sm text-red-600 mt-1">{errors.state}</p>
                )}
              </div>

              {/* Pincode */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  name="pincode"
                  type="text"
                  placeholder="6-digit pincode"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={handleFieldChange}
                  onBlur={() => markFieldTouched("pincode")}
                  className={getInputClass("pincode", false)}
                />
                {touchedFields.pincode && errors.pincode && (
                  <p className="text-sm text-red-600 mt-1">{errors.pincode}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            {!isViewMode && (
              <button
                type="submit"
                disabled={
                  isLoading || isLoadingCities || stateLoading || customerLoading
                }
                className="px-10 py-3 text-white bg-blue-600 rounded-full hover:bg-blue-700 
                           disabled:opacity-50 disabled:cursor-not-allowed transition-all
                           font-semibold text-lg shadow-md hover:shadow-lg"
              >
                {isLoading || customerLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Saving...
                  </span>
                ) : isEditMode ? (
                  "Update Customer"
                ) : (
                  "Register Customer"
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;
