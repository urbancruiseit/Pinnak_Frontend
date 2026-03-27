"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  User,
  Mail,
  Phone,
  FileText,
  MapPin,
  Calendar,
  X,
  GripVertical,
  Info,
  Luggage,
  Globe,
  CheckCircle,
} from "lucide-react";
import type { LeadRecord } from "../../../types/types";
import { updateLead, fetchLeads } from "@/app/features/lead/leadSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { getCountriesThunk } from "@/app/features/countrycode/countrycodeSlice";
import { fetchVehicles } from "@/app/features/vehicle/vehicleSlice";
import { getAllCitiesThunk } from "@/app/features/travelcity/travelcitySlice";

// Import Disabled Components
import {
  DisabledDateField,
  DisabledTextField,
  DisabledSelectField,
  DisabledPhoneField,
  SOURCE_OPTIONS,
  CUSTOMER_CATEGORY_OPTIONS,
  CITY_OPTIONS,
} from "./SalesLeadModel/disable";

type FormData = {
  date: string;
  source: string;
  telesales: string;
  status: string;
  customerType: string;
  customerCategoryType: string;
  countryName: string;
  serviceType?: string;
  tripType?: string;
  occasion?: string;
  pickupDateTime: string;
  dropDateTime?: string;
  days: number;
  pickupAddress: string;
  dropAddress: string;
  pickupcity: string;
  dropcity: string;
  city?: string;
  passengerTotal: number | string;
  petsNumber?: number;
  petsNames?: string;
  vehicle2?: string;
  vehicles?: string;
  vehicle3?: string;
  requirementVehicle?: string;
  km: string;
  smallbaggage?: number;
  mediumbaggage?: number;
  largebaggage?: number;
  airportbaggage?: number;
  totalbaggage?: number;
  itinerary?: string[];
  remarks?: string;
  lost_reason?: string;
  lostReasonDetails?: string;
  followUp?: string;
  email?: string;
};

const SalesEditLeadForm: React.FC<{
  initialData: LeadRecord | any;
  isEditMode?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}> = ({ initialData, onSuccess, onCancel }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { countries } = useSelector((state: RootState) => state.country);
  const { vehicleCodes } = useSelector((state: RootState) => state.vehicle);
  const { travelcity } = useSelector((state: RootState) => state.travelcity);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      smallbaggage: 0,
      mediumbaggage: 0,
      largebaggage: 0,
      airportbaggage: 0,
      totalbaggage: 0,
      petsNumber: 0,
      days: 1,
    },
  });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    alternatePhone: "",
    email: "",
    companyName: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentItinerary, setCurrentItinerary] = useState("");
  const [itineraryList, setItineraryList] = useState<string[]>([]);
  const [customerCategoryTypeValue, setCustomerCategoryTypeValue] =
    useState("");
  const [alternateCountryCode, setAlternateCountryCode] = useState("+91");

  const pickupDateTime = watch("pickupDateTime");
  const dropDateTime = watch("dropDateTime");
  const smallbaggage = watch("smallbaggage");
  const mediumbaggage = watch("mediumbaggage");
  const largebaggage = watch("largebaggage");
  const airportbaggage = watch("airportbaggage");
  const customerType = watch("customerType");
  const serviceType = watch("serviceType");

  const categoryOptions: Record<string, string[]> = {
    Personal: ["Personal"],
    Corporate: [
      "Company",
      "Educational Institute",
      "Sporting Company",
      "Government",
    ],
    "Travel Agent": [
      "Travel Agent",
      "Tour Operator",
      "Hotel",
      "Wedding Planner",
      "DMC",
    ],
  };

  // Fetch initial data
  useEffect(() => {
    dispatch(getCountriesThunk());
    dispatch(getAllCitiesThunk());
    dispatch(fetchVehicles());
  }, [dispatch]);

  // Calculate total baggage
  useEffect(() => {
    const total =
      (Number(smallbaggage) || 0) +
      (Number(mediumbaggage) || 0) +
      (Number(largebaggage) || 0) +
      (Number(airportbaggage) || 0);
    setValue("totalbaggage", total);
  }, [smallbaggage, mediumbaggage, largebaggage, airportbaggage, setValue]);

  // Calculate days based on pickup and drop dates
  useEffect(() => {
    if (serviceType === "Pick & Drop") {
      setValue("days", 2);
      return;
    }

    if (pickupDateTime && dropDateTime) {
      const pickup = new Date(pickupDateTime.split("T")[0]);
      const drop = new Date(dropDateTime.split("T")[0]);
      const diffDays =
        (drop.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24);
      const totalDays = diffDays + 1;
      setValue("days", totalDays > 0 ? totalDays : 1);
    }
  }, [serviceType, pickupDateTime, dropDateTime, setValue]);

  // Load initial data
  useEffect(() => {
    if (initialData) {
      const parsePhone = (phone: string) => {
        if (!phone) return { code: "+91", number: "" };
        const match = phone.match(/^\+(\d{1,3})\s*(.*)$/);
        if (match) {
          return { code: "+" + match[1], number: match[2].trim() };
        }
        return { code: "+91", number: phone.trim() };
      };

      const mainPhone = parsePhone(initialData.customerPhone || "");
      const altPhone = parsePhone(initialData.alternatePhone || "");

      setAlternateCountryCode(altPhone.code);

      setFormData({
        name: initialData.customerName || "",
        phone: mainPhone.number,
        alternatePhone: altPhone.number,
        email: initialData.customerEmail || "",
        companyName:
          initialData.customerType === "Personal"
            ? "C"
            : initialData.companyName || "",
      });

      setCustomerCategoryTypeValue(initialData.customerCategoryType || "");

      if (initialData.itinerary) {
        setItineraryList(initialData.itinerary);
      }

      setValue("date", initialData.enquiryTime?.slice(0, 16) || "");
      setValue("source", initialData.source);
      setValue("telesales", initialData.telecaller);
      setValue("status", initialData.status);
      setValue("customerType", initialData.customerType);
      setValue("customerCategoryType", initialData.customerCategoryType || "");
      setValue("serviceType", initialData.serviceType || undefined);
      setValue("tripType", initialData.tripType || "");
      setValue("occasion", initialData.occasion || "");
      setValue(
        "pickupDateTime",
        initialData.pickupDateTime?.replace(" ", "T").slice(0, 16) || "",
      );
      setValue(
        "dropDateTime",
        initialData.dropDateTime?.replace(" ", "T").slice(0, 16) || "",
      );
      setValue("pickupAddress", initialData.pickupAddress || "");
      setValue("dropAddress", initialData.dropAddress || "");
      setValue("pickupcity", (initialData as any).pickupcity || "");
      setValue("dropcity", (initialData as any).dropcity || "");
      setValue("passengerTotal", initialData.passengerTotal);
      setValue("days", initialData.days);
      setValue("km", String(initialData.km));
      setValue("petsNumber", initialData.petsNumber || 0);
      setValue("petsNames", initialData.petsNames || "");
      setValue("vehicles", initialData.vehicles || "");
      setValue("vehicle2", initialData.vehicle2 || "");
      setValue("vehicle3", initialData.vehicle3 || "");
      setValue("requirementVehicle", initialData.requirementVehicle || "");
      setValue("smallbaggage", initialData.smallBaggage || 0);
      setValue("mediumbaggage", initialData.mediumBaggage || 0);
      setValue("largebaggage", initialData.largeBaggage || 0);
      setValue("airportbaggage", initialData.airportBaggage || 0);
      setValue("totalbaggage", initialData.totalBaggage || 0);
      setValue("remarks", initialData.remarks || "");
      setValue("lost_reason", initialData.lost_reason || "");
      setValue("lostReasonDetails", initialData.lostReasonDetails || "");
      setValue("followUp", initialData.followUp || "");
      setValue("countryName", initialData.countryName || "");
      setValue("city", initialData.city || "");
      setValue("itinerary", initialData.itinerary || []);
    }
  }, [initialData, setValue]);

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addItinerary = () => {
    if (currentItinerary.trim() && itineraryList.length < 25) {
      const newList = [...itineraryList, currentItinerary.trim()];
      setItineraryList(newList);
      setCurrentItinerary("");
      setValue("itinerary", newList);
    }
  };

  const removeItinerary = (index: number) => {
    const newList = itineraryList.filter((_, i) => i !== index);
    setItineraryList(newList);
    setValue("itinerary", newList);
  };

  const showToastMessage = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      setTimeout(() => setSuccessMessage(""), 300);
    }, 3000);
  };

  // ==================== MAIN UPDATE FUNCTION ====================
  const onSubmit = async (data: FormData) => {
    if (!initialData.id) {
      showToastMessage("Lead ID not found");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      enquiryTime: data.date ? `${data.date}:00` : new Date().toISOString(),
      source: data.source,
      status: data.status,
      telecaller: data.telesales || "Default",

      customerName: formData.name,
      customerPhone: `+91 ${formData.phone}`,
      alternatePhone: formData.alternatePhone
        ? `${alternateCountryCode} ${formData.alternatePhone}`
        : "",
      customerEmail: formData.email || "",
      companyName: formData.companyName === "C" ? "" : formData.companyName,
      customerType: data.customerType,
      customerCategoryType: data.customerCategoryType || "",
      countryName: data.countryName,
      city: data.city || "",

      serviceType: data.serviceType,
      occasion: data.occasion || "",
      tripType: data.tripType || undefined,
      pickupDateTime: data.pickupDateTime
        ? `${data.pickupDateTime}:00`
        : undefined,
      dropDateTime: data.dropDateTime ? `${data.dropDateTime}:00` : undefined,
      pickupAddress: data.pickupAddress,
      dropAddress: data.dropAddress,
      pickupcity: data.pickupcity,
      dropcity: data.dropcity,
      days: Number(data.days),
      km: parseInt(data.km) || 0,

      itinerary: itineraryList,

      passengerTotal: Number(data.passengerTotal),
      petsNumber: Number(data.petsNumber) || 0,
      petsNames: data.petsNames || "",

      smallBaggage: Number(data.smallbaggage) || 0,
      mediumBaggage: Number(data.mediumbaggage) || 0,
      largeBaggage: Number(data.largebaggage) || 0,
      airportBaggage: Number(data.airportbaggage) || 0,
      totalBaggage: Number(data.totalbaggage) || 0,

      vehicles: data.vehicles || "",
      vehicle2: data.vehicle2 || "",
      vehicle3: data.vehicle3 || "",
      requirementVehicle: data.requirementVehicle || "",

      remarks: data.remarks || "",
      lost_reason: data.lost_reason || "",
      lostReasonDetails: data.lostReasonDetails || "",
      followUp: data.followUp || "",

      message: "",
    };

    try {
      const result = await dispatch(
        updateLead({
          id: initialData.id,
          data: payload,
        }),
      ).unwrap();

      console.log("Update successful:", result);
      showToastMessage("Lead updated successfully!");

      await dispatch(fetchLeads(1));

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Update Error:", error);
      showToastMessage(
        error?.message || "Failed to update lead. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date();
  const maxDate = new Date(
    today.getFullYear() + 2,
    today.getMonth(),
    today.getDate(),
  )
    .toISOString()
    .slice(0, 16);
  const minDate = today.toISOString().slice(0, 16);

  // Create customer type options based on selected customer category
  const getCustomerTypeOptions = () => {
    if (!customerType) return [];
    return categoryOptions[customerType]?.map(item => ({ 
      value: item, 
      label: item 
    })) || [];
  };

  return (
    <div>
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed right-4 top-4 z-50 animate-slide-in-right">
          <div className="bg-green-50 border-l-4 border-green-500 rounded-lg shadow-lg p-4 flex items-start gap-3 min-w-[320px]">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-green-800 font-medium">{successMessage}</p>
            </div>
            <button
              onClick={() => {
                setShowSuccessToast(false);
                setTimeout(() => setSuccessMessage(""), 300);
              }}
              className="text-green-600 hover:text-green-800"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-10 bg-orange-100 p-3 rounded-md">
        <div className="flex justify-between items-center">
          <div className="pl-4 border-l-8 border-orange-500 bg-white px-3 rounded-md shadow-md">
            <h2 className="text-4xl font-bold text-left py-4 text-orange-600">
              Sales Edit Lead
            </h2>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="p-6 mx-auto bg-white shadow-xl rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Section 1: Enquiry Information */}
          <div className="border rounded-xl p-6 bg-blue-50">
            <h3 className="text-xl font-semibold text-blue-800 mb-6 pb-3 border-b relative">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-md mr-2">
                1
              </span>
              Enquiry Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Lead Date & Time - Disabled */}
              <DisabledDateField
                label="Lead Date & Time"
                value={watch("date") || ""}
                icon={<Calendar className="text-blue-800" size={20} />}
              />

              {/* Source - Disabled */}
              <DisabledSelectField
                label="Source"
                value={watch("source") || ""}
                options={SOURCE_OPTIONS}
                icon={<FileText className="text-blue-600" size={20} />}
              />

              {/* Status - Editable */}
              <div>
                <label className="block text-md font-extrabold text-gray-700 mb-1">
                  Status
                </label>
                <div className="relative group">
                  <span title="All fields mandatory">
                    <Info
                      size={15}
                      className="absolute -top-4 right-0 text-blue-500 cursor-help"
                    />
                  </span>
                  <select
                    {...register("status")}
                    className="w-full py-2 border bg-white px-10 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Status</option>
                    <option value="New">New</option>
                    <option value="KYC">KYC</option>
                    <option value="RFQ">RFQ</option>
                    <option value="HOT">HOT</option>
                    <option value="Book">Book</option>
                    <option value="Veh-n">Veh-n</option>
                    <option value="Lost">Lost</option>
                    <option value="Blank">Blank</option>
                  </select>
                  <FileText
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 group-focus-within:animate-pulse"
                    size={20}
                  />
                </div>
              </div>

              {/* City - Editable */}
              <div>
                <label className="block text-md font-extrabold text-gray-700 mb-1">
                  City
                </label>
                <div className="relative group">
                  <Info
                    size={15}
                    className="absolute -top-4 right-0 text-blue-500 cursor-help"
                  />
                  <select
                    {...register("city")}
                    className="w-full py-2 border bg-white px-12 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select City</option>
                    {CITY_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <FileText
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600"
                    size={20}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Customer Information */}
          <div className="border rounded-xl p-6 bg-green-50">
            <h3 className="text-xl font-semibold text-green-800 mb-6 pb-3 border-b relative">
              <span className="bg-green-600 text-white px-3 py-1 rounded-md mr-2">
                2
              </span>
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Name - Disabled */}
              <DisabledTextField
                label="Name"
                value={formData.name}
                placeholder="Enter Customer name"
                icon={<User className="text-green-600" size={20} />}
                required
                maxLength={50}
              />

              {/* Phone No. (India) - Disabled */}
              <DisabledPhoneField
                label="Phone No. (India)"
                countryCode="+91 IND"
                phoneNumber={formData.phone}
                icon={<Phone className="text-green-600" size={20} />}
                required
              />

              {/* Phone No. (Other) - Editable */}
              <div>
                <label className="block text-md font-extrabold text-gray-700 mb-1">
                  Phone No. (Other)
                </label>
                <div className="relative flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                  <select
                    value={alternateCountryCode}
                    onChange={(e) => setAlternateCountryCode(e.target.value)}
                    className="bg-gray-100 px-2 py-2 outline-none text-sm cursor-pointer min-w-[100px]"
                  >
                    <option value="">Select</option>
                    {countries.map((code) => (
                      <option key={code.id} value={code.country_code}>
                        {code.country_code} {code.phone_code}
                      </option>
                    ))}
                  </select>
                  <input
                    name="alternatePhone"
                    value={formData.alternatePhone}
                    onChange={handleFieldChange}
                    placeholder="Enter phone number"
                    className="w-full py-2 px-3 outline-none"
                    maxLength={15}
                    inputMode="numeric"
                  />
                  <Phone
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600"
                    size={20}
                  />
                </div>
              </div>

              {/* Email - Editable */}
              <div>
                <label className="block text-md font-extrabold text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative group">
                  <Info
                    size={15}
                    className="absolute -top-4 right-0 text-blue-500 cursor-help"
                  />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleFieldChange}
                    placeholder="Enter email address"
                    className="w-full py-2 border bg-white px-12 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={100}
                  />
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600"
                    size={20}
                  />
                </div>
              </div>

              {/* Customer Category - Disabled */}
              <DisabledSelectField
                label="Customer Category"
                value={watch("customerType") || ""}
                options={CUSTOMER_CATEGORY_OPTIONS}
                icon={<FileText className="text-green-600" size={20} />}
                required
              />

              {/* Customer Type - Disabled */}
              <DisabledSelectField
                label="Customer Type"
                value={customerCategoryTypeValue}
                options={getCustomerTypeOptions()}
                icon={<FileText className="text-green-600" size={20} />}
                placeholder={customerType ? "Select Customer Type" : "First select customer category"}
              />

              {/* Company Name - Editable (conditional) */}
              {customerType !== "Personal" && (
                <div>
                  <label className="block text-md font-extrabold text-gray-700 mb-1">
                    Company Name
                  </label>
                  <div className="relative group">
                    <Info
                      size={15}
                      className="absolute -top-4 right-0 text-blue-500 cursor-help"
                    />
                    <input
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleFieldChange}
                      className="w-full px-12 py-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      maxLength={100}
                      placeholder="Enter company name"
                    />
                    <User
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600"
                      size={20}
                    />
                  </div>
                </div>
              )}

              {/* Country Name - Editable */}
              <div>
                <label className="block text-md font-extrabold text-gray-700 mb-1">
                  Country Name
                </label>
                <div className="relative group">
                  <Info
                    size={15}
                    className="absolute -top-4 right-0 text-blue-500 cursor-help z-10"
                  />
                  <select
                    {...register("countryName")}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Select Country</option>
                    {countries
                      .slice()
                      .sort((a, b) => {
                        if (a.country_name === "India") return -1;
                        if (b.country_name === "India") return 1;
                        return a.country_name.localeCompare(b.country_name);
                      })
                      .map((country) => (
                        <option key={country.id} value={country.country_name}>
                          {country.country_name}
                        </option>
                      ))}
                  </select>
                  <Globe
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600"
                    size={20}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Travel Requirements */}
          <div className="p-6 border rounded-xl bg-purple-50">
            <h3 className="relative pb-3 mb-6 text-xl font-semibold text-purple-800 border-b">
              <span className="px-3 py-1 mr-2 text-white bg-purple-600 rounded-md">
                3
              </span>
              Travel Requirements
            </h3>

            <div className="p-4 mb-6 bg-white border rounded-lg">
              <span className="mb-3 font-extrabold text-purple-600 text-md">
                Travel Dates
              </span>
              <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="w-full md:w-[20%]">
                      <label className="block mb-1 font-extrabold text-gray-700 text-md">
                        Pickup Date & Time{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group">
                        <Info
                          size={15}
                          className="absolute -top-6 right-0 text-blue-500 cursor-help"
                        />
                        <input
                          type="datetime-local"
                          {...register("pickupDateTime")}
                          min={minDate}
                          max={maxDate}
                          className="w-full bg-white py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Calendar
                          className="absolute text-purple-600 -translate-y-1/2 left-3 top-1/2"
                          size={20}
                        />
                      </div>
                    </div>

                    <div className="w-full md:w-[20%]">
                      <label className="block mb-1 font-extrabold text-gray-700 text-md">
                        Pickup City <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          {...register("pickupcity")}
                          className="w-full py-2 pl-10 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                        >
                          <option value="">Select Pickup City</option>
                          {travelcity?.map((city) => (
                            <option
                              key={city.id || city.uuid}
                              value={city.cityName}
                            >
                              {city.cityName}
                            </option>
                          ))}
                        </select>
                        <MapPin
                          className="absolute text-purple-600 -translate-y-1/2 left-3 top-1/2"
                          size={20}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-[50%]">
                      <label className="block mb-1 font-extrabold text-gray-700 text-md">
                        Pickup Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group">
                        <Info
                          size={15}
                          className="absolute -top-6 right-0 text-blue-500 cursor-help"
                        />
                        <input
                          {...register("pickupAddress")}
                          className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter pickup address"
                        />
                        <MapPin
                          className="absolute text-purple-600 -translate-y-1/2 left-3 top-1/2"
                          size={20}
                        />
                      </div>
                    </div>

                    <div className="w-full md:w-[10%]">
                      <label className="block mb-1 font-extrabold text-gray-700 text-md">
                        No. of Days <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group">
                        <input
                          type="number"
                          {...register("days", { valueAsNumber: true })}
                          readOnly={serviceType === "Pick & Drop"}
                          className={`w-full ${
                            serviceType === "Pick & Drop"
                              ? "bg-purple-400 cursor-not-allowed"
                              : "bg-purple-600"
                          } text-white placeholder:text-white/80 placeholder:text-md font-extrabold text-2xl py-2 pl-8 pr-8 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          placeholder="Total Days"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white font-bold pointer-events-none">
                          days
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap md:flex-nowrap gap-4">
                    <div className="w-full md:w-[20%]">
                      <label className="block mb-1 font-extrabold text-gray-700 text-md">
                        Drop Date & Time
                      </label>
                      <div className="relative group">
                        <input
                          type="datetime-local"
                          {...register("dropDateTime")}
                          min={pickupDateTime || minDate}
                          max={maxDate}
                          className="w-full bg-white py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Calendar
                          className="absolute text-purple-600 -translate-y-1/2 left-3 top-1/2"
                          size={20}
                        />
                      </div>
                    </div>

                    <div className="w-full md:w-[15%]">
                      <label className="block mb-1 font-extrabold text-gray-700 text-md">
                        Drop City <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          {...register("dropcity")}
                          className="w-full py-2 pl-10 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                        >
                          <option value="">Select Drop City</option>
                          {travelcity?.map((city) => (
                            <option
                              key={city.id || city.uuid}
                              value={city.cityName}
                            >
                              {city.cityName}
                            </option>
                          ))}
                        </select>
                        <MapPin
                          className="absolute text-purple-600 -translate-y-1/2 left-3 top-1/2"
                          size={20}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-[30%]">
                      <label className="block mb-1 font-extrabold text-gray-700 text-md">
                        Drop Address
                      </label>
                      <input
                        {...register("dropAddress")}
                        className="w-full py-2 pl-3 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Address"
                      />
                    </div>

                    <div className="w-full md:w-[15%]">
                      <label className="block text-md font-extrabold text-gray-700 mb-1">
                        Service
                      </label>
                      <select
                        {...register("serviceType")}
                        onChange={(e) => {
                          const value = e.target.value;
                          register("serviceType").onChange(e);
                          if (value === "Pick & Drop") setValue("days", 2);
                        }}
                        className="w-full py-2 border bg-white px-3 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select</option>
                        <option value="One Way">One Way</option>
                        <option value="Pick & Drop">Pick & Drop</option>
                        <option value="Round Trip">Round Trip</option>
                        <option value="Long Term Lease">Lease</option>
                      </select>
                    </div>

                    {serviceType === "Round Trip" && (
                      <div className="w-full md:w-[20%]">
                        <label className="block text-md font-extrabold text-gray-700 mb-1">
                          Trip Type
                        </label>
                        <div className="flex items-center gap-6 mt-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              value="Sightseeing"
                              {...register("tripType")}
                              className="accent-blue-500"
                            />
                            <span className="text-sm font-semibold">
                              Sightseeing
                            </span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              value="Point to Point"
                              {...register("tripType")}
                              className="accent-blue-500"
                            />
                            <span className="text-sm font-semibold">
                              Point to Point
                            </span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Itinerary Details */}
            <div className="p-4 mb-6 bg-white border rounded-lg">
              <span className="mb-6 font-extrabold text-purple-600 text-md">
                Itinerary Details
              </span>
              <div>
                <div className="grid grid-cols-1 gap-4 mt-2 md:grid-cols-2">
                  <div>
                    <label className="block mb-1 mt-6 font-extrabold text-gray-700 text-md">
                      Add Itinerary
                    </label>
                    <div className="relative group">
                      <input
                        value={currentItinerary}
                        onChange={(e) => setCurrentItinerary(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addItinerary();
                          }
                        }}
                        className="w-full px-3 py-2 pl-10 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter itinerary item"
                      />
                      <FileText
                        className="absolute text-purple-600 -translate-y-1/2 left-3 top-1/2"
                        size={20}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1 font-extrabold text-gray-700 text-md">
                      Added Itineraries ({itineraryList.length}/25)
                    </label>
                    <div className="flex flex-wrap gap-2 overflow-y-auto max-h-32">
                      {itineraryList.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1 px-2 py-1 text-sm text-purple-800 bg-purple-100 rounded cursor-move"
                          draggable
                          onDragStart={(e) =>
                            e.dataTransfer.setData("text/plain", idx.toString())
                          }
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            const draggedIdx = parseInt(
                              e.dataTransfer.getData("text/plain"),
                            );
                            if (draggedIdx !== idx) {
                              const newList = [...itineraryList];
                              const [removed] = newList.splice(draggedIdx, 1);
                              newList.splice(idx, 0, removed);
                              setItineraryList(newList);
                              setValue("itinerary", newList);
                            }
                          }}
                        >
                          <GripVertical size={14} className="text-purple-600" />
                          <span>{item}</span>
                          <button
                            onClick={() => removeItinerary(idx)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-4">
                  <div>
                    <label className="block mb-1 font-extrabold text-gray-700 text-md">
                      Actual KM <span className="text-red-500">*</span>
                    </label>
                    <div className="relative max-w-[180px]">
                      <input
                        type="number"
                        {...register("km")}
                        className="w-full placeholder:text-white/80 bg-purple-600 text-white font-extrabold text-2xl py-2 pl-6 text-center pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Total KM"
                      />
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-white pointer-events-none">
                        📍
                      </span>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white font-bold pointer-events-none">
                        KM
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-md font-extrabold text-gray-700 mb-1">
                      Occasion Type
                    </label>
                    <div className="relative group">
                      <select
                        {...register("occasion")}
                        className="w-full py-2 border bg-white px-12 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Occasion Type</option>
                        <option value="Wedding">Wedding</option>
                        <option value="Vacation">Vacation</option>
                        <option value="Pilgrimage">Pilgrimage</option>
                        <option value="Corporate">Corporate</option>
                        <option value="Event">Event</option>
                        <option value="Local">Local</option>
                      </select>
                      <FileText
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600"
                        size={20}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Passenger Details */}
            <div className="p-6 mt-6 bg-white border rounded-xl">
              <span className="mb-3 font-extrabold text-purple-900 text-md">
                Passenger Details
              </span>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mt-4">
                <div>
                  <label className="block mb-1 font-extrabold text-gray-700 text-md">
                    Total Passengers <span className="text-red-500">*</span>
                  </label>
                  <div className="relative max-w-[180px]">
                    <input
                      type="number"
                      {...register("passengerTotal", { valueAsNumber: true })}
                      className="w-full bg-purple-600 placeholder:text-white/80 text-white font-extrabold text-2xl py-2 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Total Pax"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white font-bold pointer-events-none">
                      Pax
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block mb-1 font-extrabold text-gray-700 text-md">
                    Number of Pets
                  </label>
                  <div className="relative max-w-[180px]">
                    <input
                      type="number"
                      {...register("petsNumber", { valueAsNumber: true })}
                      className="w-full bg-red-600 placeholder:text-white/80 text-white font-extrabold text-2xl py-2 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="No. of pets"
                      min="0"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white font-bold pointer-events-none">
                      pets
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block mb-1 font-extrabold text-gray-700 text-md">
                    Pet Names
                  </label>
                  <div className="relative group">
                    <input
                      {...register("petsNames")}
                      className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter pet names"
                    />
                    <FileText
                      className="absolute text-purple-800 -translate-y-1/2 left-3 top-1/2"
                      size={20}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Baggage Details */}
            <div className="p-6 mt-6 bg-white border rounded-xl">
              <span className="mb-3 font-extrabold text-purple-900 text-md">
                Baggage Details
              </span>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-5 mt-4">
                <div>
                  <label className="block mb-1 font-extrabold text-gray-700 text-md">
                    Small Baggage
                  </label>
                  <div className="relative group">
                    <input
                      type="number"
                      {...register("smallbaggage", { valueAsNumber: true })}
                      className="w-full py-2 bg-white pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Small Baggage"
                    />
                    <Luggage
                      className="absolute text-purple-800 -translate-y-1/2 left-3 top-1/2"
                      size={16}
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1 font-extrabold text-gray-700 text-md">
                    Medium Baggage
                  </label>
                  <div className="relative group">
                    <input
                      type="number"
                      {...register("mediumbaggage", { valueAsNumber: true })}
                      className="w-full py-2 bg-white pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Medium Baggage"
                    />
                    <Luggage
                      className="absolute text-purple-800 -translate-y-1/2 left-3 top-1/2"
                      size={20}
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1 font-extrabold text-gray-700 text-md">
                    Large Baggage
                  </label>
                  <div className="relative group">
                    <input
                      type="number"
                      {...register("largebaggage", { valueAsNumber: true })}
                      className="w-full py-2 bg-white pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Large Baggage"
                    />
                    <Luggage
                      className="absolute text-purple-800 -translate-y-1/2 left-3 top-1/2"
                      size={20}
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1 font-extrabold text-gray-700 text-md">
                    Airport Baggage
                  </label>
                  <div className="relative group">
                    <input
                      type="number"
                      {...register("airportbaggage", { valueAsNumber: true })}
                      className="w-full py-2 bg-white pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Airport Baggage"
                    />
                    <Luggage
                      className="absolute text-purple-800 -translate-y-1/2 left-3 top-1/2"
                      size={20}
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1 font-extrabold text-gray-700 text-md">
                    Total Baggage
                  </label>
                  <div className="relative group">
                    <input
                      type="number"
                      {...register("totalbaggage", { valueAsNumber: true })}
                      readOnly
                      className="w-full bg-purple-600 text-white font-extrabold text-2xl py-2 pl-8 text-center pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Total"
                    />
                    <Luggage
                      className="absolute text-white -translate-y-1/2 left-3 top-1/2"
                      size={20}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="p-6 bg-white border rounded-xl mt-4">
              <span className="mb-3 font-extrabold text-purple-900 text-md">
                Vehicle Details
              </span>
              <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-4">
                <div>
                  <label className="block text-md font-extrabold text-gray-700 mb-1">
                    Vehicle Type 1
                  </label>
                  <div className="relative group">
                    <select
                      {...register("vehicles")}
                      className="w-full py-2 border bg-white px-12 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Vehicle Type</option>
                      {vehicleCodes.map(
                        (vehicle: { code: string; name: string }, index) => (
                          <option
                            key={`${vehicle.code}-${index}`}
                            value={vehicle.code}
                          >
                            {vehicle.code}
                          </option>
                        ),
                      )}
                    </select>
                    <FileText
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600"
                      size={20}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-md font-extrabold text-gray-700 mb-1">
                    Vehicle Type 2
                  </label>
                  <div className="relative group">
                    <select
                      {...register("vehicle2")}
                      className="w-full py-2 border bg-white px-12 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Vehicle Type 2</option>
                      {vehicleCodes.map(
                        (vehicle: { code: string; name: string }, index) => (
                          <option
                            key={`${vehicle.code}-type2-${index}`}
                            value={vehicle.code}
                          >
                            {vehicle.code}
                          </option>
                        ),
                      )}
                    </select>
                    <FileText
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600"
                      size={20}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-md font-extrabold text-gray-700 mb-1">
                    Vehicle Type 3
                  </label>
                  <div className="relative group">
                    <select
                      {...register("vehicle3")}
                      className="w-full py-2 border bg-white px-12 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Vehicle Type 3</option>
                      {vehicleCodes.map(
                        (vehicle: { code: string; name: string }, index) => (
                          <option
                            key={`${vehicle.code}-type3-${index}`}
                            value={vehicle.code}
                          >
                            {vehicle.code}
                          </option>
                        ),
                      )}
                    </select>
                    <FileText
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600"
                      size={20}
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1 font-extrabold text-gray-700 text-md">
                    Total Vehicle Requirement
                  </label>
                  <div className="relative group">
                    <input
                      {...register("requirementVehicle")}
                      className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter requirement"
                    />
                    <FileText
                      className="absolute text-purple-800 -translate-y-1/2 left-3 top-1/2"
                      size={20}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Remarks */}
            <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-1">
              <div>
                <label className="block text-md font-extrabold text-gray-700 mb-1">
                  Remark
                </label>
                <div className="relative group">
                  <textarea
                    {...register("remarks")}
                    rows={4}
                    placeholder="Enter your remark..."
                    className="w-full py-2 border bg-white px-12 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <FileText
                    className="absolute left-3 top-3 text-green-600"
                    size={20}
                  />
                </div>
              </div>
            </div>

            {/* Lost Reason and Follow Up */}
            <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-3">
              <div>
                <label className="block text-md font-extrabold text-gray-700 mb-1">
                  LOST REASON
                </label>
                <div className="relative group">
                  <select
                    {...register("lost_reason")}
                    className="w-full py-2 border bg-white px-12 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Lost Reason</option>
                    <option value="Price too high">Price too high</option>
                    <option value="Found better offer">
                      Found better offer
                    </option>
                    <option value="Cancelled trip">Cancelled trip</option>
                    <option value="No response">No response</option>
                    <option value="Other">Other</option>
                  </select>
                  <FileText
                    className="absolute left-3 top-3 text-green-600"
                    size={20}
                  />
                </div>
              </div>

              <div>
                <label className="block text-md font-extrabold text-gray-700 mb-1">
                  Lost Reason Details
                </label>
                <div className="relative group">
                  <textarea
                    {...register("lostReasonDetails")}
                    rows={4}
                    placeholder="Enter lost reason details..."
                    className="w-full py-2 border bg-white px-12 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <FileText
                    className="absolute left-3 top-3 text-green-600"
                    size={20}
                  />
                </div>
              </div>

              <div>
                <label className="block text-md font-extrabold text-gray-700 mb-1">
                  Follow Up
                </label>
                <div className="relative group">
                  <textarea
                    {...register("followUp")}
                    rows={4}
                    placeholder="Enter follow up notes..."
                    className="w-full py-2 border bg-white px-12 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <FileText
                    className="absolute left-3 top-3 text-green-600"
                    size={20}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-6 py-3 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-900 text-white hover:bg-blue-500"
              }`}
            >
              {isSubmitting ? "Updating..." : "Update Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalesEditLeadForm;