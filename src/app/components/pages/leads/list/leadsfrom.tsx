"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SubmitHandler } from "react-hook-form";
import {
  getAllCitiesThunk,
} from "@/app/features/travelcity/travelcitySlice";
import Popup from '@/app/components/pages/leads/list/popup';

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
import type { LeadRecord } from "../../../../../types/types";
import {
  createLead,
  updateLead,
  fetchLeads,
} from "@/app/features/lead/leadSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { getCountriesThunk } from "@/app/features/countrycode/countrycodeSlice";
import { fetchVehicles } from "@/app/features/vehicle/vehicleSlice";

// ==================== SCHEMA DEFINITION ====================
const schema = z.object({
  // Enquiry Information
  date: z.string().min(1, "Date is required"),
  source: z.string().min(1, "Source is required"),
  telesales: z.string().min(1, "Presales is required"),
  status: z.string().min(1, "Status is required"),

  // Customer Information
  customerType: z.string().min(1, "Customer category is required"),
  customerCategoryType: z.string().optional(),
  countryName: z.string().min(1, "Country is required"),
  customerCity: z.string().optional(),

  serviceType: z.string().optional(),
  tripType: z.string().optional(),
  occasion: z.string().optional(),
  pickupDateTime: z.string().optional(),
  dropDateTime: z.string().optional(),
  days: z.number().optional(),
  pickupAddress: z.string().optional(),
  dropAddress: z.string().optional(),
  pickupcity: z.string().optional(),
  dropcity: z.string().optional(),
  city: z.string().optional(),

  passengerTotal: z.number().optional(),

  petsNumber: z.number().optional(),
  petsNames: z.string().optional(),

  // ALL VEHICLE FIELDS OPTIONAL
  vehicle2: z.string().optional(),
  vehicles: z.string().optional(),
  vehicle3: z.string().optional(),
  vehicle3Quantity: z.string().optional(),
  vehicle2Quantity: z.string().optional(),
  vehicle1Quantity: z.string().optional(),
  requirementVehicle: z.string().optional(),

  km: z.union([z.string(), z.number()]).optional(),

  smallbaggage: z.number().optional(),
  mediumbaggage: z.number().optional(),
  largebaggage: z.number().optional(),
  airportbaggage: z.number().optional(),
  totalbaggage: z.number().optional(),

  itinerary: z.array(z.string()).optional(),
  remarks: z.string().optional(),
  lost_reason: z.string().optional(),
  lostReasonDetails: z.string().optional(),
  followUp: z.string().optional(),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

const LeadsForm: React.FC<{ initialData?: LeadRecord | null }> = ({
  initialData,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { countries } = useSelector((state: RootState) => state.country);
  const { vehicleCodes } = useSelector((state: RootState) => state.vehicle);
  const { travelcity, loading } = useSelector(
    (state: RootState) => state.travelcity,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    trigger,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: "-",
      pickupDateTime: new Date().toISOString().slice(0, 16),
      customerType: "Personal",
      date: new Date().toISOString().slice(0, 16),
      days: 1,
      smallbaggage: 0,
      mediumbaggage: 0,
      largebaggage: 0,
      airportbaggage: 0,
      totalbaggage: 0,
      petsNumber: 0,
      vehicles: "",
      vehicle2: "",
      vehicle3: "",
      vehicle1Quantity: "",
      vehicle2Quantity: "",
      vehicle3Quantity: "",
      requirementVehicle: "",
      serviceType: "",
      pickupAddress: "",
      pickupcity: "",
      passengerTotal: 0,
      km: "",
    },
    mode: "onChange",
  });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    alternatePhone: "",
    email: "",
    companyName: "",
  });

  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {},
  );
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentItinerary, setCurrentItinerary] = useState("");
  const [itineraryList, setItineraryList] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState({
    dateTime: "",
    customer: "",
    startDate: "",
    endDate: "",
    days: 0,
  });
  const [customerCategoryTypeValue, setCustomerCategoryTypeValue] =
    useState("");
  const [countryCode] = useState("+91");
  const [alternateCountryCode, setAlternateCountryCode] = useState("+91");

  const isEditMode = !!initialData?.id;

  const pickupDateTime = watch("pickupDateTime");
  const dropDateTime = watch("dropDateTime");
  const smallbaggage = watch("smallbaggage");
  const mediumbaggage = watch("mediumbaggage");
  const largebaggage = watch("largebaggage");
  const airportbaggage = watch("airportbaggage");
  const customerType = watch("customerType");
  const serviceType = watch("serviceType");
  
  // Vehicle Watch
  const vehicle1 = watch("vehicles");
  const vehicle2 = watch("vehicle2");
  const vehicle3 = watch("vehicle3");

  const qty1 = watch("vehicle1Quantity");
  const qty2 = watch("vehicle2Quantity");
  const qty3 = watch("vehicle3Quantity");

  const categoryOptions: Record<string, string[]> = {
    Personal: ["Personal"],
    Corporate: [
      "Company",
      "Educational Institute",
      "Sporting Company",
      "Government",
      "NGO",
    ],
    "Travel Agent": [
      "Travel Agent",
      "Tour Operator",
      "Hotel",
      "Wedding Planner",
      "DMC",
      "EMC",
    ],
  };

  useEffect(() => {
    dispatch(getCountriesThunk());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllCitiesThunk());
  }, [dispatch]);
  
  useEffect(() => {
    dispatch(fetchVehicles());
  }, [dispatch]);

  useEffect(() => {
    if (countries.length > 0) {
      const currentCountry = watch("countryName");
      if (!currentCountry) {
        const india = countries.find((c) => c.country_name === "India");
        if (india) {
          setValue("countryName", "India");
        }
      }
    }
  }, [countries, setValue, watch]);

  useEffect(() => {
    const total =
      (Number(smallbaggage) || 0) +
      (Number(mediumbaggage) || 0) +
      (Number(largebaggage) || 0) +
      (Number(airportbaggage) || 0);
    setValue("totalbaggage", total);
  }, [smallbaggage, mediumbaggage, largebaggage, airportbaggage, setValue]);

  useEffect(() => {
    if (serviceType === "Pick & Drop") {
      setValue("days", 2);
      return;
    }

    if (serviceType === "One Way") {
      setValue("days", 1);
      setValue("dropcity", "");
      setValue("dropAddress", "");
      return;
    }

    if (pickupDateTime && dropDateTime) {
      const pickup = new Date(pickupDateTime.split("T")[0]);
      const drop = new Date(dropDateTime.split("T")[0]);

      const diffDays =
        (drop.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24);

      const totalDays = diffDays + 1;

      setValue("days", totalDays > 0 ? totalDays : 1);
    } else {
      setValue("days", 0);
    }
  }, [serviceType, pickupDateTime, dropDateTime, setValue]);

  // Vehicle combination effect - only creates string when both vehicle and quantity are present
  useEffect(() => {
    const vehiclesList: string[] = [];

    if (vehicle1 && vehicle1.trim() !== "" && qty1 && qty1.trim() !== "") {
      vehiclesList.push(`${vehicle1} x ${qty1}`);
    }

    if (vehicle2 && vehicle2.trim() !== "" && qty2 && qty2.trim() !== "") {
      vehiclesList.push(`${vehicle2} x ${qty2}`);
    }

    if (vehicle3 && vehicle3.trim() !== "" && qty3 && qty3.trim() !== "") {
      vehiclesList.push(`${vehicle3} x ${qty3}`);
    }

    const result = vehiclesList.join(", ");
    setValue("requirementVehicle", result);
  }, [vehicle1, vehicle2, vehicle3, qty1, qty2, qty3, setValue]);

  useEffect(() => {
    const now = new Date();
    const currentDateTime = now.toISOString().slice(0, 16);
    setValue("date", currentDateTime);
  }, [setValue]);

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

      setValue("date", initialData.enquiryTime?.slice(0, 16) || "");
      setValue("source", initialData.source);
      setValue("telesales", initialData.telecaller);
      setValue("status", initialData.status);
      setValue("customerType", initialData.customerType);
      setValue(
        "customerCategoryType",
        (initialData as any).customerCategoryType || "",
      );
      setCustomerCategoryTypeValue(
        (initialData as any).customerCategoryType || "",
      );
      setValue("serviceType", initialData.serviceType || "");
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
      setValue("vehicle3Quantity", initialData.vehicle3Quantity || "");
      setValue("vehicle2Quantity", initialData.vehicle2Quantity || "");
      setValue("vehicle1Quantity", initialData.vehicle1Quantity || "");
      setValue(
        "requirementVehicle",
        (initialData as any).requirementVehicle || "",
      );
      setValue("smallbaggage", initialData.smallBaggage || 0);
      setValue("mediumbaggage", initialData.mediumBaggage || 0);
      setValue("largebaggage", initialData.largeBaggage || 0);
      setValue("airportbaggage", initialData.airportBaggage || 0);
      setValue("totalbaggage", initialData.totalBaggage || 0);
      setValue("remarks", initialData.remarks || "");
      setValue("countryName", initialData.countryName || "");
      setValue("city", initialData.city || "");
      setValue("customerCity", initialData.customerCity || "");

      if (initialData.itinerary) {
        setItineraryList(initialData.itinerary);
        setValue("itinerary", initialData.itinerary);
      }

      setTimeout(() => trigger(), 100);
    }
  }, [initialData, setValue, trigger]);

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const markFieldTouched = (field: string) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
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

  const resetFormFields = () => {
    setFormData({
      name: "",
      phone: "",
      alternatePhone: "",
      email: "",
      companyName: "",
    });

    setItineraryList([]);
    setCurrentItinerary("");
    setCustomerCategoryTypeValue("");
    setAlternateCountryCode("+91");

    reset({
      status: "BLANK",
      pickupDateTime: new Date().toISOString().slice(0, 16),
      customerType: "Personal",
      date: new Date().toISOString().slice(0, 16),
      source: "",
      telesales: "",
      countryName: "India",
      serviceType: "",
      vehicle2: "",
      vehicles: "",
      vehicle3: "",
      vehicle3Quantity: "",
      vehicle2Quantity: "",
      vehicle1Quantity: "",
      occasion: "",
      dropDateTime: "",
      pickupAddress: "",
      dropAddress: "",
      dropcity: "",
      pickupcity: "",
      passengerTotal: undefined,
      days: undefined,
      km: "",
      petsNumber: 0,
      petsNames: "",
      smallbaggage: 0,
      mediumbaggage: 0,
      largebaggage: 0,
      airportbaggage: 0,
      totalbaggage: 0,
      requirementVehicle: "",
      remarks: "",
      itinerary: [],
      tripType: "",
      city: "",
      customerCity: "",
    });
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true);

    try {
      // Clean the payload - remove any undefined values and ensure all fields are properly set
      const payload: any = {
        date: data.date ? data.date.split("T")[0] : new Date().toISOString().split("T")[0],
        enquiryTime: data.date ? `${data.date}:00` : new Date().toISOString(),
        source: data.source || "",
        status: data.status || "-",
        telecaller: data.telesales || "Default",
        customerName: formData.name || "",
        customerPhone: formData.phone ? `+91 ${formData.phone}` : "",
        alternatePhone: formData.alternatePhone
          ? `+${alternateCountryCode} ${formData.alternatePhone}`
          : "",
        customerEmail: formData.email || "",
        companyName: formData.companyName === "C" ? "" : formData.companyName || "",
        customerType: data.customerType || "Personal",
        customerCategoryType: data.customerCategoryType || "",
        serviceType: data.serviceType || "",
        occasion: data.occasion || "",
        tripType: data.tripType || "",
        pickupDateTime: data.pickupDateTime ? `${data.pickupDateTime}:00` : null,
        dropDateTime: data.dropDateTime ? `${data.dropDateTime}:00` : null,
        pickupAddress: data.pickupAddress || "",
        dropAddress: data.dropAddress || "",
        pickupcity: data.pickupcity || "",
        dropcity: data.dropcity || "",
        itinerary: itineraryList || [],
        vehicles: data.vehicles || "",
        vehicle2: data.vehicle2 || "",
        vehicle3: data.vehicle3 || "",
        vehicle3Quantity: data.vehicle3Quantity || "",
        vehicle2Quantity: data.vehicle2Quantity || "",
        vehicle1Quantity: data.vehicle1Quantity || "",
        requirementVehicle: data.requirementVehicle || "",
        passengerTotal: data.passengerTotal || 0,
        days: Number(data.days) || 0,
        km: data.km ? (typeof data.km === "string" ? parseInt(data.km) || 0 : data.km) : 0,
        petsNumber: Number(data.petsNumber) || 0,
        petsNames: data.petsNames || "",
        smallBaggage: Number(data.smallbaggage) || 0,
        mediumBaggage: Number(data.mediumbaggage) || 0,
        largeBaggage: Number(data.largebaggage) || 0,
        airportBaggage: Number(data.airportbaggage) || 0,
        totalBaggage: Number(data.totalbaggage) || 0,
        remarks: data.remarks || "",
        countryName: data.countryName || "",
        customerCity: data.customerCity || "",
        city: data.city || "",
        message: "",
        lost_reason: (data as any).lost_reason || "",
        lostReasonDetails: (data as any).lostReasonDetails || "",
        followUp: (data as any).followUp || "",
      };

      if (isEditMode && initialData?.id) {
        await dispatch(
          updateLead({ id: initialData.id, data: payload }),
        ).unwrap();
        showToastMessage("Lead updated successfully!");
      } else {
        await dispatch(createLead(payload)).unwrap();

        setPopupData({
          dateTime: data.date
            ? new Date(data.date).toLocaleString()
            : new Date().toLocaleString(),
          customer: formData.name,
          startDate: data.pickupDateTime
            ? new Date(data.pickupDateTime).toLocaleDateString()
            : "",
          endDate: data.dropDateTime
            ? new Date(data.dropDateTime).toLocaleDateString()
            : "",
          days: Number(data.days) || 0,
        });
        setShowPopup(true);
        showToastMessage("Lead created successfully!");
        resetFormFields();
      }

      dispatch(fetchLeads(1));
      window.dispatchEvent(new CustomEvent("leadSubmitted"));
    } catch (error: any) {
      console.error("Submit Error:", error);
      
      let errorMessage = "Failed to save lead. Please try again.";
      
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.payload) {
        errorMessage = error.payload;
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      }
      
      showToastMessage(errorMessage);
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

  return (
    <div>
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed right-4 top-4 animate-slide-in-right z-50">
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
      <div className="sticky top-0 z-30 bg-orange-100 p-3 rounded-md">
        <div className="flex justify-between items-center">
          <div className="pl-4 border-l-8 border-orange-500 bg-white px-3 rounded-md shadow-md">
            <h2 className="text-4xl font-bold text-left py-4 text-orange-600">
              {isEditMode ? "Edit Lead" : "New Leads Form"}
            </h2>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-6 mx-auto bg-white shadow-xl rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* SECTION 1: Enquiry Information */}
          <div className="border rounded-xl p-6 bg-blue-50">
            <h3 className="text-xl font-semibold text-blue-800 mb-6 pb-3 border-b relative">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-md mr-2">
                1
              </span>
              Enquiry Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Date */}
              <div>
                <label className="block text-md font-extrabold text-gray-700 mb-1">
                  Lead Date & Time
                </label>
                <div className="relative group">
                  <Info
                    size={15}
                    className="absolute -top-4 right-0 text-blue-500 cursor-help"
                  />
                  <input
                    type="datetime-local"
                    {...register("date")}
                    max={new Date().toISOString().slice(0, 10) + "T23:59"}
                    className="w-full py-2 border bg-white px-12 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Calendar
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-800"
                    size={20}
                  />
                </div>
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.date.message}
                  </p>
                )}
              </div>

              {/* Source */}
              <div>
                <label className="block text-md font-extrabold text-gray-700 mb-1">
                  Source
                </label>
                <div className="relative group">
                  <Info
                    size={15}
                    className="absolute -top-4 right-0 text-blue-500 cursor-help"
                  />
                  <select
                    {...register("source")}
                    className="w-full py-2 border bg-white px-12 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Source Type</option>
                    <option value="Call">Call</option>
                    <option value="WA">WA</option>
                    <option value="GAC">GAC</option>
                    <option value="GAQ">GAQ</option>
                    <option value="Email">Email</option>
                    <option value="META">META</option>
                    <option value="GA">GA</option>
                    <option value="REP-C">REP-C</option>
                    <option value="REF-C">REF-C</option>
                  </select>
                  <FileText
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600"
                    size={20}
                  />
                </div>
              </div>

              {/* Presales */}
              <div>
                <label className="block text-md font-extrabold text-gray-700 mb-1">
                  Presales
                </label>
                <div className="relative group">
                  <Info
                    size={15}
                    className="absolute -top-4 right-0 text-blue-500 cursor-help"
                  />
                  <select
                    {...register("telesales")}
                    className="w-full py-2 border bg-white px-12 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Presales</option>
                    <option value="muskan">Muskan</option>
                    <option value="sanjana">Sanjana</option>
                    <option value="manshi">Manshi</option>
                    <option value="other">Other</option>
                  </select>
                  <FileText
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600"
                    size={20}
                  />
                </div>
              </div>

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
                    <option value="delhi">Delhi</option>
                    <option value="gurgoan">Gurgoan</option>
                    <option value="hydrabad">Hydrabad</option>
                    <option value="noida">Noida</option>
                  </select>
                  <FileText
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600"
                    size={20}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Customer Information */}
          <div className="border rounded-xl p-6 bg-green-50">
            <h3 className="text-xl font-semibold text-green-800 mb-6 pb-3 border-b relative">
              <span className="bg-green-600 text-white px-3 py-1 rounded-md mr-2">
                2
              </span>
              Customer Information
            </h3>

            {/* First Row - 4 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Name */}
              <div>
                <label className="block text-md font-extrabold text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <Info
                    size={15}
                    className="absolute -top-4 right-0 text-blue-500 cursor-help"
                  />
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleFieldChange}
                    onBlur={() => markFieldTouched("name")}
                    className="w-full py-2 border bg-white px-12 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={50}
                    placeholder="Enter Customer name"
                    required
                  />
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600"
                    size={20}
                  />
                </div>
              </div>

              {/* Phone (India) */}
              <div>
                <label className="block text-md font-extrabold text-gray-700 mb-1">
                  Phone No. (India) <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                  <div className="bg-gray-100 px-2 py-2 text-sm font-medium min-w-[100px]">
                    +91 IND
                  </div>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleFieldChange}
                    placeholder="Enter phone number"
                    className="w-full py-2 px-3 outline-none"
                    maxLength={10}
                    inputMode="numeric"
                    required
                  />
                  <Phone
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600"
                    size={20}
                  />
                </div>
              </div>

              {/* Alternate Phone */}
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
                    <option value="">Select </option>
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

              {/* Email */}
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
                    onBlur={() => markFieldTouched("email")}
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Customer Category - 20% */}
              <div className="w-full">
                <label className="block text-md font-extrabold text-gray-700 mb-1">
                  Customer Category <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <Info
                    size={15}
                    className="absolute -top-4 right-0 text-blue-500 cursor-help"
                  />
                  <select
                    {...register("customerType")}
                    onChange={(e) => {
                      const value = e.target.value;
                      register("customerType").onChange(e);
                      if (value === "Personal") {
                        setFormData((prev) => ({ ...prev, companyName: "C" }));
                      } else if (formData.companyName === "C") {
                        setFormData((prev) => ({ ...prev, companyName: "" }));
                      }
                    }}
                    className="w-full py-2 border bg-white px-12 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Customer Category</option>
                    <option value="Personal">Personal</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Travel Agent">Agent</option>
                  </select>
                  <FileText
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600"
                    size={20}
                  />
                </div>
                {errors.customerType && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.customerType.message}
                  </p>
                )}
              </div>

              {/* Customer Type - 20% */}
              <div className="w-full">
                <label className="block text-md font-extrabold text-gray-700 mb-1">
                  Customer Type
                </label>
                <div className="relative group">
                  <select
                    {...register("customerCategoryType")}
                    value={customerCategoryTypeValue}
                    onChange={(e) => {
                      register("customerCategoryType").onChange(e);
                      setCustomerCategoryTypeValue(e.target.value);
                    }}
                    className="w-full py-2 border bg-white px-12 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Customer Type</option>
                    {customerType &&
                      categoryOptions[customerType]?.map((item, index) => (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      ))}
                  </select>
                  <FileText
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600"
                    size={20}
                  />
                </div>
              </div>
              {/* Company Name - 20% (Conditional) */}
              {customerType !== "Personal" && (
                <div className="w-full">
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
                      onBlur={() => markFieldTouched("companyName")}
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
              {/* Country Name - 20% */}
              <div className="w-full">
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
                {errors.countryName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.countryName.message}
                  </p>
                )}
              </div>

              {/* Customer City - 20% */}
              <div className="w-full">
                <label className="block text-md font-extrabold text-gray-700 mb-1">
                  Customer City
                </label>
                <div className="relative group">
                  <Info
                    size={15}
                    className="absolute -top-4 right-0 text-blue-500 cursor-help z-10"
                  />
                  <select
                    {...register("customerCity")}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Select Customer City</option>
                    {travelcity?.map((city) => (
                      <option key={city.id || city.uuid} value={city.cityName}>
                        {city.cityName}
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

          {/* SECTION 3: Travel Requirements */}
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
                    {/* Pickup Date */}
                    <div className="w-full md:w-[20%]">
                      <label className="block mb-1 font-extrabold text-gray-700 text-md">
                        Pickup Date & Time
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
                      {errors.pickupDateTime && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.pickupDateTime.message}
                        </p>
                      )}
                    </div>

                    <div className="w-full md:w-[20%]">
                      <label className="block mb-1 font-extrabold text-gray-700 text-md">
                        Pickup City
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
                      {errors.pickupcity && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.pickupcity.message}
                        </p>
                      )}
                    </div>

                    <div className="w-full md:w-[50%]">
                      <label className="block mb-1 font-extrabold text-gray-700 text-md">
                        Pickup Address
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
                      {errors.pickupAddress && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.pickupAddress.message}
                        </p>
                      )}
                    </div>

                    <div className="w-full md:w-[10%]">
                      <label className="block mb-1 font-extrabold text-gray-700 text-md">
                        No. of Days
                      </label>
                      <div className="relative group">
                        <input
                          type="number"
                          {...register("days", { valueAsNumber: true })}
                          readOnly={serviceType === "Pick & Drop"}
                          className={`w-full ${serviceType === "Pick & Drop" ? "bg-purple-400 cursor-not-allowed" : "bg-purple-600"} text-white placeholder:text-white/80 placeholder:text-md font-extrabold text-2xl py-2 pl-8 pr-8 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          placeholder="Total Days"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white font-bold pointer-events-none">
                          days
                        </span>
                      </div>
                      {errors.days && (
                        <p className="mt-1 text-sm text-red-500 text-center">
                          {errors.days.message}
                        </p>
                      )}
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

                    {watch("serviceType") !== "One Way" && (
                      <>
                        <div className="w-full md:w-[15%]">
                          <label className="block mb-1 font-extrabold text-gray-700 text-md">
                            Drop City
                          </label>
                          <div className="relative">
                            {loading ? (
                              <div className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md bg-gray-50 animate-pulse">
                                Loading cities...
                              </div>
                            ) : (
                              <select
                                {...register("dropcity")}
                                className="w-full py-2 pl-10 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                              >
                                <option value="">Select Drop City</option>
                                {travelcity?.length > 0 ? (
                                  travelcity.map((city) => (
                                    <option
                                      key={city.id || city.uuid}
                                      value={city.cityName}
                                    >
                                      {city.cityName}
                                    </option>
                                  ))
                                ) : (
                                  <option disabled>No cities available</option>
                                )}
                              </select>
                            )}
                            <MapPin
                              className="absolute text-purple-600 -translate-y-1/2 left-3 top-1/2"
                              size={20}
                            />
                            {!loading && (
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
                            )}
                          </div>
                          {errors.dropcity && (
                            <p className="mt-1 text-sm text-red-500">
                              {errors.dropcity.message}
                            </p>
                          )}
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
                      </>
                    )}

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
                        <option value="Round Trip Drop">
                          Round Trip - Drop
                        </option>
                        <option value="Long Term Lease">Lease</option>
                      </select>
                    </div>

                    {(serviceType === "Round Trip" ||
                      serviceType === "Round Trip Drop") && (
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
                      Actual KM
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
                    {errors.km && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.km.message}
                      </p>
                    )}
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

            <div className="p-6 mt-6 bg-white border rounded-xl">
              <span className="mb-3 font-extrabold text-purple-900 text-md">
                Passenger Details
              </span>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mt-4">
                <div>
                  <label className="block mb-1 font-extrabold text-gray-700 text-md">
                    Total Passengers
                  </label>
                  <div className="relative max-w-[180px]">
                    <input
                      type="number"
                      {...register("passengerTotal", { valueAsNumber: true })}
                      className="w-full bg-purple-600 placeholder:text-white/80 text-white font-extrabold text-2xl py-2 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Total Pax"
                      min="1"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white font-bold pointer-events-none">
                      Pax
                    </span>
                  </div>
                  {errors.passengerTotal && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.passengerTotal.message}
                    </p>
                  )}
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

            {/* Vehicle Details Section - ALL FIELDS OPTIONAL */}
            <div className="p-6 bg-white border rounded-xl mt-4">
              <span className="mb-3 font-extrabold text-purple-900 text-md">
                Vehicle Details (Optional)
              </span>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="w-full md:w-[20%]">
                  <label className="block text-md font-extrabold text-gray-700 mb-1">
                    Vehicle Type 1
                  </label>
                  <div className="flex gap-2">
                    <div className="relative group flex-1">
                      <select
                        {...register("vehicles")}
                        className="py-2 border bg-white px-12 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      >
                        <option value="">Select Vehicle Type</option>
                        {[...vehicleCodes]
                          .sort((a, b) => {
                            const numA = parseInt(
                              a.code.match(/\d+/)?.[0] || "0",
                            );
                            const numB = parseInt(
                              b.code.match(/\d+/)?.[0] || "0",
                            );
                            if (numA !== numB) {
                              return numA - numB;
                            }
                            return a.code.localeCompare(b.code);
                          })
                          .map(
                            (
                              vehicle: { code: string; name: string },
                              index,
                            ) => (
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
                    <input
                      type="number"
                      placeholder="Qty"
                      className="w-20 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                      min="1"
                      {...register("vehicle1Quantity")}
                    />
                  </div>
                </div>

                <div className="w-full md:w-[20%]">
                  <label className="block text-md font-extrabold text-gray-700 mb-1">
                    Vehicle Type 2
                  </label>
                  <div className="flex gap-2">
                    <div className="relative group flex-1">
                      <select
                        {...register("vehicle2")}
                        className="w-full py-2 border bg-white px-12 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Vehicle Type 2</option>
                        {[...vehicleCodes]
                          .sort((a, b) => {
                            const numA = parseInt(
                              a.code.match(/\d+/)?.[0] || "0",
                            );
                            const numB = parseInt(
                              b.code.match(/\d+/)?.[0] || "0",
                            );

                            if (numA !== numB) {
                              return numA - numB;
                            }

                            return a.code.localeCompare(b.code);
                          })
                          .map(
                            (
                              vehicle: { code: string; name: string },
                              index,
                            ) => (
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
                    <input
                      type="number"
                      placeholder="Qty"
                      className="w-20 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                      min="1"
                      {...register("vehicle2Quantity")}
                    />
                  </div>
                </div>

                <div className="w-full md:w-[20%]">
                  <label className="block text-md font-extrabold text-gray-700 mb-1">
                    Vehicle Type 3
                  </label>
                  <div className="flex gap-2">
                    <div className="relative group flex-1">
                      <select
                        {...register("vehicle3")}
                        className="w-full py-2 border bg-white px-12 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Vehicle Type 3</option>
                        {[...vehicleCodes]
                          .sort((a, b) => {
                            const numA = parseInt(
                              a.code.match(/\d+/)?.[0] || "0",
                            );
                            const numB = parseInt(
                              b.code.match(/\d+/)?.[0] || "0",
                            );

                            if (numA !== numB) {
                              return numA - numB;
                            }

                            return a.code.localeCompare(b.code);
                          })
                          .map(
                            (
                              vehicle: { code: string; name: string },
                              index,
                            ) => (
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
                    <input
                      type="number"
                      placeholder="Qty"
                      className="w-20 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                      min="1"
                      {...register("vehicle3Quantity")}
                    />
                  </div>
                </div>

                <div className="w-full md:w-[35%]">
                  <label className="block mb-1 font-extrabold text-gray-700 text-md">
                    Total Vehicle Requirement
                  </label>
                  <div className="relative group">
                    <input
                      {...register("requirementVehicle")}
                      className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Auto-filled when vehicles selected"
                      readOnly
                    />
                    <FileText
                      className="absolute text-purple-800 -translate-y-1/2 left-3 top-1/2"
                      size={20}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Remarks Section */}
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
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            {!isValid && Object.keys(errors).length > 0 && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                <p className="font-semibold mb-2">
                  Please fix the following errors:
                </p>
                <ul className="list-disc list-inside text-sm">
                  {Object.entries(errors)
                    .slice(0, 5)
                    .map(([key, error]: any) => (
                      <li key={key}>{error?.message || `${key} is invalid`}</li>
                    ))}
                </ul>
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-6 py-3 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-900 text-white hover:bg-blue-500"
              }`}
            >
              {isSubmitting
                ? isEditMode
                  ? "Updating..."
                  : "Submitting..."
                : isEditMode
                  ? "Update Lead"
                  : "Submit"}
            </button>
          </div>
        </form>

        <Popup 
          showPopup={showPopup}
          setShowPopup={setShowPopup}
          popupData={popupData}
        />
      </div>

      {/* Styles */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
        .animate-slide-out-right {
          animation: slideOutRight 0.3s ease-in;
        }
      `}</style>
    </div>
  );
};

export default LeadsForm;