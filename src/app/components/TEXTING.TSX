// "use client";

// import React, { useState, useEffect, use } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { SubmitHandler } from "react-hook-form";

// import {
//   User,
//   Mail,
//   Phone,
//   FileText,
//   MapPin,
//   Calendar,
//   X,
//   GripVertical,
//   Info,
//   Luggage,
//   Globe,
//   CheckCircle,
// } from "lucide-react";
// import type { LeadRecord } from "../../../../../types/types";
// import {
//   createLead,
//   updateLead,
//   fetchLeads,
// } from "@/app/features/lead/leadSlice";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/app/redux/store";
// import { getCountriesThunk } from "@/app/features/countrycode/countrycodeSlice";
// import { fetchVehicles } from "@/app/features/vehicle/vehicleSlice";

// const schema = z.object({
//   date: z.string().min(1, "Date is required"),
//   source: z.string().min(1, "Source is required"),
//   telesales: z.string().min(1, "Presales is required"),
//   status: z.string().min(1, "Status is required"),
//   customerType: z.string().min(1, "Customer category is required"),
//   customerCategoryType: z.string().optional(),
//   countryName: z.string().min(1, "Country is required"),
//   serviceType: z.string().min(1, "Service type is required"),
//   vehicle2: z.string().optional(),
//   vehicles: z.string().optional(),
//   vehicle3: z.string().optional(),
//   occasion: z.string().optional(),
//   pickupDateTime: z.string().min(1, "Pickup date is required"),
//   dropDateTime: z.string().optional(),
//   days: z
//     .number()
//     .min(1, "Days is required")
//     .or(z.string().min(1, "Days is required")),
//   pickupAddress: z.string().min(1, "Pickup address is required"),
//   dropAddress: z.string().min(1, "Drop address is required"),
//   dropcity: z.string().min(1, "Drop city is required"),
//   pickupcity: z.string().min(1, "Pickup city is required"),
//   passengerTotal: z
//     .number()
//     .min(1, "Passengers is required")
//     .or(z.string().min(1, "Passengers is required")),
//   petsNumber: z.number().optional(),
//   petsNames: z.string().optional(),
//   requirementVehicle: z.string().optional(),
//   km: z.string().min(1, "KM is required"),
//   smallbaggage: z.number().optional(),
//   mediumbaggage: z.number().optional(),
//   largebaggage: z.number().optional(),
//   airportbaggage: z.number().optional(),
//   totalbaggage: z.number().optional(),
//   itinerary: z.array(z.string()).optional(),
//   tripType: z.string().optional(),
//   remarks: z.string().optional(),
//   email: z.string().email("Invalid email format").optional().or(z.literal("")),
// });

// type FormData = z.infer<typeof schema>;

// const LeadsForm: React.FC<{ initialData?: LeadRecord | null }> = ({
//   initialData,
// }) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isValid },
//     setValue,
//     watch,
//     trigger,
//     reset,
//     getValues,
//   } = useForm<FormData>({
//     resolver: zodResolver(schema),
//     defaultValues: {
//       status: "New",
//       pickupDateTime: new Date().toISOString().slice(0, 16),
//       customerType: "Personal",
//     },
//     mode: "onChange",
//   });

//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     alternatePhone: "",
//     email: "",
//     companyName: "",
//   });

//   const dispatch = useDispatch<AppDispatch>();
//   const { countries, loading, error } = useSelector(
//     (state: RootState) => state.country,
//   );

//   const { vehicleCodes } = useSelector((state: RootState) => state.vehicle);

//   useEffect(() => {
//     dispatch(fetchVehicles());
//   }, [dispatch]);

//   useEffect(() => {
//     dispatch(getCountriesThunk());
//   }, [dispatch]);

//   useEffect(() => {
//     if (countries.length > 0) {
//       console.log("Countries from Redux:", countries);
//     }
//   }, [countries]);

//   const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
//     {},
//   );
//   const [successMessage, setSuccessMessage] = useState("");
//   const [showSuccessToast, setShowSuccessToast] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [editLeadId, setEditLeadId] = useState<string | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [currentItinerary, setCurrentItinerary] = useState("");
//   const [itineraryList, setItineraryList] = useState<string[]>([]);
//   type Vehicle = { type: string; category: string; vehicle3: string };

//   const [showPopup, setShowPopup] = useState(false);
//   const [popupData, setPopupData] = useState({
//     dateTime: "",
//     customer: "",
//     startDate: "",
//     endDate: "",
//     days: 0,
//   });
//   const [isLoadingCountries, setIsLoadingCountries] = useState(false);

//   const [phoneCountryCodes, setPhoneCountryCodes] = useState<
//     { id: number; country_code: string; phone_code: string }[]
//   >([]);
//   const [customerCategoryTypeValue, setCustomerCategoryTypeValue] =
//     useState("");

//   // Helper function to parse phone number and extract country code
//   const parsePhoneNumber = (fullPhone: string) => {
//     if (!fullPhone) return { code: "+91", number: "" };

//     // Common phone code patterns to check

//     // First try to match with loaded country codes
//     const matchedCode = phoneCountryCodes.find((c) =>
//       fullPhone.startsWith(c.phone_code + " "),
//     );

//     if (matchedCode) {
//       return {
//         code: matchedCode.country_code,
//         number: fullPhone.replace(matchedCode.phone_code + " ", "").trim(),
//       };
//     }

//     const match = fullPhone.match(/^\+(\d{1,3})\s*(.*)$/);
//     if (match) {
//       return { code: "+" + match[1], number: match[2].trim() };
//     }

//     return { code: "+91", number: fullPhone.trim() };
//   };

//   useEffect(() => {
//     if (countries.length > 0) {
//       const currentCountry = watch("countryName");
//       if (!currentCountry) {
//         const india = countries.find((c) => c.country_name === "India");
//         if (india) {
//           setValue("countryName", "India");
//         }
//       }
//     }
//   }, [countries, setValue, watch]);
//   useEffect(() => {
//     if (initialData) {
//       setIsEditMode(true);
//       setEditLeadId(initialData.id || null);

//       const mainPhone = parsePhoneNumber(initialData.customerPhone || "");
//       const altPhone = parsePhoneNumber(initialData.alternatePhone || "");

//       setCountryCode(mainPhone.code);
//       setAlternateCountryCode(altPhone.code);

//       const initialCompanyName =
//         initialData.customerType === "Personal"
//           ? "C"
//           : initialData.companyName || "";

//       setFormData({
//         name: initialData.customerName || "",
//         phone: mainPhone.number,
//         alternatePhone: altPhone.number,
//         email: initialData.customerEmail || "",
//         companyName: initialCompanyName,
//       });

//       setValue("date", initialData.enquiryTime || "");
//       setValue("source", initialData.source);
//       setValue("telesales", initialData.telecaller);
//       setValue("status", initialData.status);
//       setValue("customerType", initialData.customerType);

//       // Manually trigger onChange for customerType to set companyName correctly
//       if (initialData.customerType === "Personal") {
//         setFormData((prev) => ({ ...prev, companyName: "C" }));
//       } else if (initialData.companyName === "C") {
//         setFormData((prev) => ({ ...prev, companyName: "" }));
//       }
//       setValue("vehicles", initialData.vehicles || "");
//       setValue("vehicle2", initialData.vehicle2 || "");
//       setValue("vehicle3", initialData.vehicle3 || "");
//       setValue(
//         "customerCategoryType",
//         (initialData as any).customerCategoryType || "",
//       );
//       setCustomerCategoryTypeValue(
//         (initialData as any).customerCategoryType || "",
//       );
//       setValue("serviceType", initialData.serviceType || "");
//       setValue("tripType", initialData.tripType || "");
//       setValue("occasion", initialData.occasion || "");
//       setValue(
//         "pickupDateTime",
//         initialData.pickupDateTime
//           ? initialData.pickupDateTime.replace(" ", "T").slice(0, 16)
//           : "",
//       );
//       setValue(
//         "dropDateTime",
//         initialData.dropDateTime
//           ? initialData.dropDateTime.replace(" ", "T").slice(0, 16)
//           : "",
//       );
//       setValue("pickupAddress", initialData.pickupAddress || "");
//       setValue("dropAddress", initialData.dropAddress || "");
//       setValue("dropcity", (initialData as any).dropcity || "");
//       setValue("pickupcity", (initialData as any).pickupcity || "");
//       setValue("passengerTotal", initialData.passengerTotal);
//       setValue("days", initialData.days);
//       setValue("km", String(initialData.km));
//       setValue("petsNumber", initialData.petsNumber);
//       setValue("petsNames", initialData.petsNames);
//       setValue("smallbaggage", initialData.smallBaggage);
//       setValue("mediumbaggage", initialData.mediumBaggage);
//       setValue("largebaggage", initialData.largeBaggage);
//       setValue("airportbaggage", initialData.airportBaggage);
//       setValue("totalbaggage", initialData.totalBaggage);
//       setValue("remarks", initialData.remarks || "");
//       setValue("countryName", initialData.countryName || "");
//       setValue(
//         "requirementVehicle",
//         (initialData as any).requirementVehicle || "",
//       );

//       if (initialData.itinerary) {
//         setItineraryList(initialData.itinerary);
//         setValue("itinerary", initialData.itinerary);
//       }

//       setTimeout(() => {
//         trigger();
//       }, 100);
//     }
//   }, [initialData, setValue, trigger]);

//   const categoryOptions: Record<string, string[]> = {
//     Personal: ["Personal"],
//     Corporate: [
//       "Company",
//       "Educational Institute",
//       "Sporting Company",
//       "Government",
//     ],
//     "Travel Agent": [
//       "Travel Agent",
//       "Tour Operator",
//       "Hotel",
//       "Wedding Planner",
//       "DMC",
//     ],
//   };

//   const pickupDateTime = watch("pickupDateTime");
//   const dropDateTime = watch("dropDateTime");

//   // Service type change effect
//   useEffect(() => {
//     const currentServiceType = watch("serviceType");
//     const pickup = watch("pickupDateTime");
//     const drop = watch("dropDateTime");

//     if (currentServiceType === "Pick & Drop") {
//       setValue("days", 2);
//     } else if (pickup && drop) {
//       // Normal days calculation for other service types
//       const pickupDate = new Date(pickup);
//       const dropDate = new Date(drop);
//       const diffTime = Math.abs(dropDate.getTime() - pickupDate.getTime());
//       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//       setValue("days", diffDays);
//     }
//   }, [
//     watch("serviceType"),
//     watch("pickupDateTime"),
//     watch("dropDateTime"),
//     setValue,
//   ]);

//   const [countryCode, setCountryCode] = useState("+91");
//   const [alternateCountryCode, setAlternateCountryCode] = useState("+91");
//   const [vehicles, setVehicles] = useState<Vehicle[]>([
//     { type: "", category: "", vehicle3: "" },
//   ]);

//   const smallbaggage = watch("smallbaggage");
//   const mediumbaggage = watch("mediumbaggage");
//   const largebaggage = watch("largebaggage");
//   const airportbaggage = watch("airportbaggage");
//   const customerType = watch("customerType");

//   useEffect(() => {
//     const total =
//       Number(smallbaggage || 0) +
//       Number(mediumbaggage || 0) +
//       Number(largebaggage || 0) +
//       Number(airportbaggage || 0);
//     setValue("totalbaggage", total);
//   }, [smallbaggage, mediumbaggage, largebaggage, airportbaggage, setValue]);

//   useEffect(() => {
//     if (!countryCode || phoneCountryCodes.length === 0) return;

//     const selected = phoneCountryCodes.find(
//       (c) => c.country_code === countryCode,
//     );

//     if (selected) {
//       setFormData((prev) => {
//         if (prev.phone?.startsWith(selected.phone_code)) {
//           return prev;
//         }

//         return {
//           ...prev,
//           phone: `${selected.phone_code} `,
//         };
//       });
//     }
//   }, [countryCode, phoneCountryCodes]);

//   useEffect(() => {
//     const handleViewLead = (e: any) => {
//       const lead: LeadRecord = e.detail;
//       console.log("Received viewLead for lead:", lead.id);
//       if (lead.id) {
//         setEditLeadId(lead.id);
//         setIsEditMode(true);
//       }

//       const mainPhone = parsePhoneNumber(lead.customerPhone || "");
//       const altPhone = parsePhoneNumber(lead.alternatePhone || "");

//       setCountryCode(mainPhone.code);
//       setAlternateCountryCode(altPhone.code);

//       setFormData({
//         name: lead.customerName,
//         phone: mainPhone.number,
//         alternatePhone: altPhone.number,
//         email: lead.customerEmail,
//         companyName: lead.companyName,
//       });
//       setValue("date", lead.enquiryTime || "");
//       setValue("source", lead.source);
//       setValue("telesales", lead.telecaller);
//       setValue("status", lead.status);
//       setValue("customerType", lead.customerType);
//       setValue("vehicles", lead.vehicles || "");
//       setValue("vehicle2", lead.vehicle2 || "");
//       setValue("vehicle3", lead.vehicle3 || "");

//       setValue(
//         "customerCategoryType",
//         (lead as any).customerCategoryType || "",
//       );
//       setCustomerCategoryTypeValue((lead as any).customerCategoryType || "");
//       setValue("serviceType", lead.serviceType || "");
//       setValue("tripType", lead.tripType || "");
//       setValue("occasion", lead.occasion || "");
//       setValue(
//         "pickupDateTime",
//         lead.pickupDateTime
//           ? lead.pickupDateTime.replace(" ", "T").slice(0, 16)
//           : "",
//       );
//       setValue(
//         "dropDateTime",
//         lead.dropDateTime
//           ? lead.dropDateTime.replace(" ", "T").slice(0, 16)
//           : "",
//       );
//       setValue("pickupAddress", lead.pickupAddress || "");
//       setValue("dropAddress", lead.dropAddress || "");
//       setValue("dropcity", (lead as any).dropcity || "");
//       setValue("pickupcity", (lead as any).pickupcity || "");
//       setValue("passengerTotal", lead.passengerTotal);
//       setValue("days", lead.days);
//       setValue("km", String(lead.km));
//       setValue("petsNumber", lead.petsNumber);
//       setValue("petsNames", lead.petsNames);
//       setValue("smallbaggage", lead.smallBaggage);
//       setValue("mediumbaggage", lead.mediumBaggage);
//       setValue("largebaggage", lead.largeBaggage);
//       setValue("airportbaggage", lead.airportBaggage);
//       setValue("totalbaggage", lead.totalBaggage);
//       setValue("remarks", lead.remarks || "");
//       setValue("countryName", lead.countryName || "");
//       setValue("requirementVehicle", (lead as any).requirementVehicle || "");

//       if (lead.itinerary) {
//         setItineraryList(lead.itinerary);
//         setValue("itinerary", lead.itinerary);
//       }

//       setTimeout(() => {
//         trigger();
//       }, 100);
//     };
//     window.addEventListener("viewLead", handleViewLead);
//     return () => window.removeEventListener("viewLead", handleViewLead);
//   }, [setValue, trigger]);

//   const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const markFieldTouched = (field: string) => {
//     setTouchedFields((prev) => ({ ...prev, [field]: true }));
//   };

//   const getMaxLength = (field: string) => {
//     const limits: Record<string, number> = {
//       name: 50,
//       phone: 10,
//       email: 100,
//       companyName: 100,
//     };
//     return limits[field] || 100;
//   };

//   const addItinerary = () => {
//     if (currentItinerary.trim() && itineraryList.length < 15) {
//       const newList = [...itineraryList, currentItinerary.trim()];
//       setItineraryList(newList);
//       setCurrentItinerary("");
//       setValue("itinerary", newList);
//     }
//   };

//   const removeItinerary = (index: number) => {
//     const newList = itineraryList.filter((_, i) => i !== index);
//     setItineraryList(newList);
//     setValue("itinerary", newList);
//   };

//   const updateVehicle = (
//     index: number,
//     field: keyof Vehicle,
//     value: string,
//   ) => {
//     const newVehicles = [...vehicles];
//     newVehicles[index][field] = value;
//     setVehicles(newVehicles);
//   };

//   // Function to show toast notification
//   const showToastMessage = (message: string) => {
//     setSuccessMessage(message);
//     setShowSuccessToast(true);

//     // Auto hide after 3 seconds
//     setTimeout(() => {
//       setShowSuccessToast(false);
//       setTimeout(() => {
//         setSuccessMessage("");
//       }, 300); // Clear message after animation
//     }, 3000);
//   };

//   // ✅ Form Reset Function - Sab fields clear karne ke liye
//   const resetFormFields = () => {
//     // Customer information reset
//     setFormData({
//       name: "",
//       phone: "",
//       alternatePhone: "",
//       email: "",
//       companyName: "",
//     });

//     // Itinerary reset
//     setItineraryList([]);
//     setCurrentItinerary("");

//     // Vehicles reset
//     setVehicles([{ type: "", category: "", vehicle3: "" }]);

//     // Country codes reset to default
//     setCountryCode("+91");
//     setAlternateCountryCode("+91");

//     // Customer category type reset
//     setCustomerCategoryTypeValue("");

//     // React Hook Form reset with default values
//     reset({
//       status: "New",
//       pickupDateTime: new Date().toISOString().slice(0, 16),
//       customerType: "Personal",
//       date: new Date().toISOString().slice(0, 16),
//       source: "",
//       telesales: "",
//       countryName: "",
//       serviceType: "",
//       vehicle2: "",
//       vehicles: "",
//       vehicle3: "",
//       occasion: "",
//       dropDateTime: "",
//       pickupAddress: "",
//       dropAddress: "",
//       dropcity: "",
//       pickupcity: "",
//       passengerTotal: "",
//       days: undefined,
//       km: "",
//       petsNumber: 0,
//       petsNames: "",
//       smallbaggage: 0,
//       mediumbaggage: 0,
//       largebaggage: 0,
//       airportbaggage: 0,
//       totalbaggage: 0,
//       requirementVehicle: "",
//       remarks: "",
//       itinerary: [],
//       tripType: "",
//     });

//     setIsEditMode(false);
//     setEditLeadId(null);
//   };

//   const onSubmit = async (data: FormData) => {
//     setIsSubmitting(true);

//     const payload: any = {
//       date: data.date
//         ? data.date.split("T")[0]
//         : new Date().toISOString().split("T")[0],
//       enquiryTime: data.date ? `${data.date}:00` : new Date().toISOString(),
//       source: data.source,
//       status: data.status,
//       telecaller: data.telesales || "Default",

//       customerName: formData.name,
//       customerPhone: `+91 ${formData.phone}`,
//       alternatePhone: `${(countries.find((c) => c.country_code === alternateCountryCode) || {}).phone_code || ""}${formData.alternatePhone ? ` ${formData.alternatePhone}` : ""}`,

//       customerEmail: formData.email || "",
//       companyName: formData.companyName,
//       customerType: data.customerType,
//       customerCategoryType: data.customerCategoryType,
//       serviceType: data.serviceType,
//       occasion: data.occasion,
//       tripType: data.tripType,
//       pickupDateTime: data.pickupDateTime ? `${data.pickupDateTime}:00` : null,
//       dropDateTime: data.dropDateTime ? `${data.dropDateTime}:00` : null,
//       pickupAddress: data.pickupAddress,
//       dropAddress: data.dropAddress,
//       dropcity: data.dropcity,
//       pickupcity: data.pickupcity,
//       itinerary: itineraryList,
//       vehicles: data.vehicles,
//       vehicle2: data.vehicle2,
//       vehicle3: data.vehicle3,
//       requirementVehicle: data.requirementVehicle,
//       passengerTotal: data.passengerTotal,
//       days: Number(data.days),
//       km: parseInt(data.km) || 0,
//       petsNumber: data.petsNumber || 0,
//       petsNames: data.petsNames || "",
//       smallBaggage: data.smallbaggage || 0,
//       mediumBaggage: data.mediumbaggage || 0,
//       largeBaggage: data.largebaggage || 0,
//       airportBaggage: data.airportbaggage || 0,
//       totalBaggage: data.totalbaggage || 0,
//       remarks: data.remarks || "",
//       countryName: data.countryName,
//       message: "",
//       lost_reason: "",
//     };

//     console.log("Dispatch Payload:", payload);

//     try {
//       if (isEditMode && editLeadId) {
//         await dispatch(updateLead({ id: editLeadId, data: payload })).unwrap();
//         showToastMessage("Lead updated successfully!");
//       } else {
//         await dispatch(createLead(payload)).unwrap();

//         setPopupData({
//           dateTime: data.date
//             ? new Date(data.date).toLocaleString()
//             : new Date().toLocaleString(),
//           customer: formData.name,
//           startDate: data.pickupDateTime
//             ? new Date(data.pickupDateTime).toLocaleDateString()
//             : "",
//           endDate: data.dropDateTime
//             ? new Date(data.dropDateTime).toLocaleDateString()
//             : "",
//           days: Number(data.days),
//         });
//         setShowPopup(true);

//         showToastMessage("Lead created successfully!");

//         resetFormFields();
//       }

//       dispatch(fetchLeads(1));

//       window.dispatchEvent(new CustomEvent("leadSubmitted"));
//     } catch (error: any) {
//       console.error("Submit Error:", error);
//       showToastMessage(
//         error.message || "Failed to save lead. Please try again.",
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const today = new Date();
//   const maxDate = new Date(
//     today.getFullYear() + 2,
//     today.getMonth(),
//     today.getDate(),
//   )
//     .toISOString()
//     .slice(0, 16);
//   const minDate = today.toISOString().slice(0, 16);

//   return (
//     <div>
//       {/* Success Toast Notification */}
//       {showSuccessToast && (
//         <div className="fixed right-4 z-50 animate-slide-in-right">
//           <div className="bg-green-50 border-l-4 border-green-500 rounded-lg shadow-lg p-4 flex items-start gap-3 min-w-[320px]">
//             <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
//             <div className="flex-1">
//               <p className="text-green-800 font-medium">{successMessage}</p>
//             </div>
//             <button
//               onClick={() => {
//                 setShowSuccessToast(false);
//                 setTimeout(() => setSuccessMessage(""), 300);
//               }}
//               className="text-green-600 hover:text-green-800"
//             >
//               <X size={18} />
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="sticky top-0 z-10 bg-orange-100 p-3 rounded-md">
//         <div className="flex justify-between items-center">
//           <div className="pl-4 border-l-8 border-orange-500 bg-white px-3 rounded-md shadow-md">
//             <h2 className="text-4xl font-bold text-left py-4 text-orange-600">
//               {isEditMode ? "Edit Form" : "New Leads Form"}
//             </h2>
//           </div>
//         </div>
//       </div>

//       <div className="p-6 w- mx-auto bg-white shadow-xl rounded-lg">
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
//           <div className="border rounded-xl p-6 bg-blue-50">
//             <h3 className="text-xl font-semibold text-blue-800 mb-6 pb-3 border-b relative">
//               <span className="bg-blue-600 text-white px-3 py-1 rounded-md mr-2">
//                 1
//               </span>
//               Enquiry Information
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-md font-extrabold text-gray-700 mb-1">
//                   Lead Date & Time
//                 </label>
//                 <div className="relative group">
//                   <span title="All fields mandatory">
//                     <Info
//                       size={15}
//                       className="absolute -top-4 right-0 text-blue-500 cursor-help"
//                     />
//                   </span>
//                   <input
//                     type="datetime-local"
//                     {...register("date")}
//                     className="w-full py-2 border bg-white px-12 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="Enter enquiry date and time"
//                   />
//                   <Calendar
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-800 group-focus-within:animate-pulse"
//                     size={20}
//                   />
//                 </div>
//                 {errors.date && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.date?.message}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-md font-extrabold text-gray-700 mb-1">
//                   Source
//                 </label>

//                 <div className="relative group">
//                   {/* Info Icon */}
//                   <span className="absolute -top-4 right-0 cursor-pointer">
//                     <Info size={15} className="text-blue-500" />
//                   </span>

//                   {/* Tooltip */}
//                   <div className="absolute right-0 top-0 mt-4 hidden group-hover:block bg-black text-white text-xs rounded-md px-3 py-2 shadow-lg z-50 w-52">
//                     <p>WA = WhatsApp</p>
//                     <p>GAC = Get a Call</p>
//                     <p>GAQ = Get a Quotation</p>
//                     <p>META = Meta Ads</p>
//                     <p>GA = Google Ads</p>
//                     <p>REP-C = Repeat Call</p>
//                     <p>REF-C = Reference Call</p>
//                   </div>

//                   <select
//                     {...register("source")}
//                     className="w-full py-2 border bg-white px-12 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select Source Type</option>
//                     <option value="Call">Call</option>
//                     <option value="WA">WA</option>
//                     <option value="GAC">GAC</option>
//                     <option value="GAQ">GAQ</option>
//                     <option value="Email">Email</option>
//                     <option value="META">META</option>
//                     <option value="GA">GA</option>
//                     <option value="REP-C">REP-C</option>
//                     <option value="REF-C">REF-C</option>
//                   </select>

//                   <FileText
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 group-focus-within:animate-pulse"
//                     size={20}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-md font-extrabold text-gray-700 mb-1">
//                   Presales
//                 </label>
//                 <div className="relative group">
//                   <span title="All fields mandatory">
//                     <Info
//                       size={15}
//                       className="absolute -top-4 right-0 text-blue-500 cursor-help"
//                     />
//                   </span>
//                   <select
//                     {...register("telesales")}
//                     className="w-full py-2 border bg-white px-12 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select Presales</option>
//                     <option value="muskan">Muskan</option>
//                     <option value="sanjana">Sanjana</option>
//                     <option value="manshi">Manshi</option>
//                     <option value="other">Other</option>
//                   </select>
//                   <FileText
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 group-focus-within:animate-pulse"
//                     size={20}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="border rounded-xl p-6 bg-green-50">
//             <h3 className="text-xl font-semibold text-green-800 mb-6 pb-3 border-b relative">
//               <span className="bg-green-600 text-white px-3 py-1 rounded-md mr-2">
//                 2
//               </span>
//               Customer Information
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//               <div>
//                 <label className="block text-md font-extrabold text-gray-700 mb-1">
//                   Name <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative group">
//                   <span title="All fields mandatory">
//                     <Info
//                       size={15}
//                       className="absolute -top-4 right-0 text-blue-500 cursor-help"
//                     />
//                   </span>
//                   <input
//                     name="name"
//                     value={formData.name}
//                     onChange={handleFieldChange}
//                     onBlur={() => markFieldTouched("name")}
//                     className="w-full py-2 border bg-white px-12 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     maxLength={getMaxLength("name")}
//                     placeholder="Enter Customer name"
//                     required
//                   />
//                   <User
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 group-focus-within:animate-pulse"
//                     size={20}
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-md font-extrabold text-gray-700 mb-1">
//                   Phone No. (India) <span className="text-red-500">*</span>
//                 </label>

//                 <div className="relative flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
//                   <div className="bg-gray-100 px-2 py-2 text-sm font-medium min-w-[100px]">
//                     +91 IND
//                   </div>
//                   <input type="hidden" name="countryCode" value="+91" />
//                   <input
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleFieldChange}
//                     placeholder="Enter phone number"
//                     className="w-full py-2 px-3 outline-none"
//                     maxLength={10}
//                     inputMode="numeric"
//                     required
//                   />

//                   <Phone
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600"
//                     size={20}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-md font-extrabold text-gray-700 mb-1">
//                   Phone No. (Other)
//                 </label>

//                 <div className="relative flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
//                   {/* Country Code Select */}
//                   <select
//                     value={alternateCountryCode}
//                     onChange={(e) => {
//                       const selectedCode = e.target.value;
//                       setAlternateCountryCode(selectedCode);

//                       if (selectedCode) {
//                         dispatch(getCountriesThunk());
//                       }
//                     }}
//                     className="bg-gray-100 px-2 py-2 outline-none text-sm cursor-pointer min-w-[100px]"
//                     disabled={loading}
//                   >
//                     <option value="">
//                       {loading ? "Loading..." : "Select"}
//                     </option>

//                     {countries.map((code) => (
//                       <option key={code.id} value={code.country_code}>
//                         {code.country_code} {code.phone_code}
//                       </option>
//                     ))}
//                   </select>

//                   {/* Phone Input */}
//                   <input
//                     name="alternatePhone"
//                     value={formData.alternatePhone}
//                     onChange={handleFieldChange}
//                     placeholder="Enter phone number"
//                     className="w-full py-2 px-3 outline-none"
//                     maxLength={15}
//                     inputMode="numeric"
//                   />

//                   <Phone
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600"
//                     size={20}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-md font-extrabold text-gray-700 mb-1">
//                   Email
//                 </label>
//                 <div className="relative group">
//                   <span title="All fields mandatory">
//                     <Info
//                       size={15}
//                       className="absolute -top-4 right-0 text-blue-500 cursor-help"
//                     />
//                   </span>
//                   <input
//                     name="email"
//                     type="text"
//                     value={formData.email}
//                     onChange={handleFieldChange}
//                     onBlur={() => markFieldTouched("email")}
//                     placeholder="Enter email address"
//                     className="w-full py-2 border bg-white px-12 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     maxLength={getMaxLength("email")}
//                   />
//                   <Mail
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 group-focus-within:animate-pulse"
//                     size={20}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-md font-extrabold text-gray-700 mb-1">
//                   Customer Category <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative group">
//                   <span title="All fields mandatory">
//                     <Info
//                       size={15}
//                       className="absolute -top-4 right-0 text-blue-500 cursor-help"
//                     />
//                   </span>
//                   <select
//                     {...register("customerType")}
//                     onChange={(e) => {
//                       const value = e.target.value;
//                       register("customerType").onChange(e);
//                       // Default companyName to "C" when Personal is selected
//                       if (value === "Personal") {
//                         setFormData((prev) => ({ ...prev, companyName: "C" }));
//                       } else if (formData.companyName === "C") {
//                         setFormData((prev) => ({ ...prev, companyName: "" }));
//                       }
//                     }}
//                     className="w-full py-2 border bg-white px-12 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select Customer Category</option>
//                     <option value="Personal">Personal</option>
//                     <option value="Corporate">Corporate</option>
//                     <option value="Travel Agent">Agent</option>
//                   </select>
//                   <FileText
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 group-focus-within:animate-pulse"
//                     size={20}
//                   />
//                 </div>
//                 {errors.customerType && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.customerType?.message}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-md font-extrabold text-gray-700 mb-1">
//                   Customer Type
//                 </label>
//                 <div className="relative group">
//                   <select
//                     {...register("customerCategoryType")}
//                     value={customerCategoryTypeValue}
//                     onChange={(e) => {
//                       register("customerCategoryType").onChange(e);
//                       setCustomerCategoryTypeValue(e.target.value);
//                     }}
//                     className="w-full py-2 border bg-white px-12 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select Customer Type</option>
//                     {customerType &&
//                       categoryOptions[customerType]?.map(
//                         (item: string, index: number) => (
//                           <option key={index} value={item}>
//                             {item}
//                           </option>
//                         ),
//                       )}
//                   </select>
//                   <FileText
//                     className="absolute px-8 left-3 top-1/2 -translate-y-1/2 text-green-600"
//                     size={20}
//                   />
//                 </div>
//               </div>
//               {customerType !== "Personal" && (
//                 <div>
//                   <label className="block text-md font-extrabold text-gray-700 mb-1">
//                     Company Name
//                   </label>
//                   <div className="relative group">
//                     <span title="All fields mandatory">
//                       <Info
//                         size={15}
//                         className="absolute -top-4 right-0 text-blue-500 cursor-help"
//                       />
//                     </span>
//                     <input
//                       name="companyName"
//                       value={formData.companyName}
//                       onChange={handleFieldChange}
//                       onBlur={() => markFieldTouched("companyName")}
//                       className="w-full px-12 py-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       maxLength={getMaxLength("companyName")}
//                       placeholder="Enter company name"
//                       required
//                     />
//                     <User
//                       className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 group-focus-within:animate-pulse"
//                       size={20}
//                     />
//                   </div>
//                 </div>
//               )}

//               <div>
//                 <label className="block text-md font-extrabold text-gray-700 mb-1">
//                   Country Name
//                 </label>
//                 <div className="relative group">
//                   <span title="All fields mandatory">
//                     <Info
//                       size={15}
//                       className="absolute -top-4 right-0 text-blue-500 cursor-help z-10"
//                     />
//                   </span>
//                   <select
//                     {...register("countryName")}
//                     className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//                   >
//                     <option value="">
//                       {loading ? "Loading..." : "Select Country"}
//                     </option>

//                     {/* Pehle India ko show karo */}
//                     {countries
//                       .slice() // Copy array to avoid mutation
//                       .sort((a, b) => {
//                         // India ko top par rakhne ke liye
//                         if (a.country_name === "India") return -1;
//                         if (b.country_name === "India") return 1;
//                         return a.country_name.localeCompare(b.country_name);
//                       })
//                       .map((country) => (
//                         <option key={country.id} value={country.country_name}>
//                           {country.country_name}
//                         </option>
//                       ))}
//                   </select>
//                   <Globe
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 group-focus-within:animate-pulse"
//                     size={20}
//                   />
//                 </div>
//                 {errors.countryName && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.countryName.message}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="p-6 border rounded-xl bg-purple-50">
//             <h3 className="relative pb-3 mb-6 text-xl font-semibold text-purple-800 border-b">
//               <span className="px-3 py-1 mr-2 text-white bg-purple-600 rounded-md">
//                 3
//               </span>
//               Travel Requirements
//             </h3>

//             <div className="p-4 mb-6 bg-white border rounded-lg">
//               <span className="mb-3 font-extrabold text-purple-600 text-md">
//                 Travel Dates
//               </span>
//               <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
//                 <div className="md:col-span-2">
//                   <div className="flex flex-col md:flex-row gap-4 mb-4">
//                     {/* Pickup Date & Time - 20% */}
//                     <div className="w-full md:w-[20%]">
//                       <label className="block mb-1 font-extrabold text-gray-700 text-md">
//                         Pickup Date & Time{" "}
//                         <span className="text-red-500">*</span>
//                       </label>
//                       <div className="relative group">
//                         <span title="All fields mandatory">
//                           <Info
//                             size={15}
//                             className="absolute -top-6 right-0 text-blue-500 cursor-help"
//                           />
//                         </span>

//                         <input
//                           type="datetime-local"
//                           {...register("pickupDateTime")}
//                           min={minDate}
//                           max={maxDate}
//                           className="w-full bg-white py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />

//                         <Calendar
//                           className="absolute text-purple-600 -translate-y-1/2 left-3 top-1/2 group-focus-within:animate-pulse"
//                           size={20}
//                         />
//                       </div>

//                       {errors.pickupDateTime && (
//                         <p className="mt-1 text-sm text-red-500">
//                           {errors.pickupDateTime.message}
//                         </p>
//                       )}
//                     </div>

//                     {/* Pickup City - 20% */}
//                     <div className="w-full md:w-[20%]">
//                       <label className="block mb-1 font-extrabold text-gray-700 text-md">
//                         Pickup City <span className="text-red-500">*</span>
//                       </label>
//                       <div className="relative group">
//                         <span title="All fields mandatory">
//                           <Info
//                             size={15}
//                             className="absolute -top-6 right-0 text-blue-500 cursor-help"
//                           />
//                         </span>

//                         <input
//                           {...register("pickupcity")}
//                           className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                           placeholder="Enter pickup city"
//                         />

//                         <MapPin
//                           className="absolute text-purple-600 -translate-y-1/2 left-3 top-1/2 group-focus-within:animate-pulse"
//                           size={20}
//                         />
//                       </div>

//                       {errors.pickupcity && (
//                         <p className="mt-1 text-sm text-red-500">
//                           {errors.pickupcity.message}
//                         </p>
//                       )}
//                     </div>

//                     {/* Pickup Address - 40% */}
//                     <div className="w-full md:w-[50%]">
//                       <label className="block mb-1 font-extrabold text-gray-700 text-md">
//                         Pickup Address <span className="text-red-500">*</span>
//                       </label>
//                       <div className="relative group">
//                         <span title="All fields mandatory">
//                           <Info
//                             size={15}
//                             className="absolute -top-6 right-0 text-blue-500 cursor-help"
//                           />
//                         </span>

//                         <input
//                           {...register("pickupAddress")}
//                           className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                           placeholder="Enter pickup address"
//                         />

//                         <MapPin
//                           className="absolute text-purple-600 -translate-y-1/2 left-3 top-1/2 group-focus-within:animate-pulse"
//                           size={20}
//                         />
//                       </div>

//                       {errors.pickupAddress && (
//                         <p className="mt-1 text-sm text-red-500">
//                           {errors.pickupAddress.message}
//                         </p>
//                       )}
//                     </div>

//                     {/* No. of Days - 20% */}
//                     <div className="w-full md:w-[10%]">
//                       <label className="block mb-1 font-extrabold text-gray-700 text-md">
//                         No. of Days <span className="text-red-500">*</span>
//                       </label>

//                       <div className="relative group">
//                         <input
//                           type="number"
//                           step="1"
//                           {...register("days", {
//                             valueAsNumber: true,
//                           })}
//                           readOnly={watch("serviceType") === "Pick & Drop"}
//                           className={`w-full ${
//                             watch("serviceType") === "Pick & Drop"
//                               ? "bg-purple-400 cursor-not-allowed"
//                               : "bg-purple-600"
//                           } text-white font-extrabold text-2xl py-2 pl-8 pr-8 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-sm placeholder:font-normal placeholder:text-white/90`}
//                           placeholder="Total Days"
//                         />

//                         <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white font-bold pointer-events-none">
//                           days
//                         </span>
//                       </div>

//                       {errors.days && (
//                         <p className="mt-1 text-sm text-red-500 text-center">
//                           {errors.days?.message}
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   <div className="flex flex-wrap md:flex-nowrap gap-4">
//                     {/* Drop Date & Time - 20% */}
//                     <div className="w-full md:w-[20%]">
//                       <label className="block mb-1 font-extrabold text-gray-700 text-md">
//                         Drop Date & Time <span className="text-red-500">*</span>
//                       </label>
//                       <div className="relative group">
//                         <input
//                           type="datetime-local"
//                           {...register("dropDateTime")}
//                           min={pickupDateTime || minDate}
//                           max={maxDate}
//                           className="w-full bg-white py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                         <Calendar
//                           className="absolute text-purple-600 -translate-y-1/2 left-3 top-1/2"
//                           size={20}
//                         />
//                       </div>
//                     </div>

//                     {/* Drop City - 10% */}
//                     <div className="w-full md:w-[15%]">
//                       <label className="block mb-1 font-extrabold text-gray-700 text-md">
//                         Drop City
//                       </label>
//                       <input
//                         {...register("dropcity")}
//                         className="w-full py-2 pl-3 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         placeholder="City"
//                       />
//                     </div>

//                     {/* Drop Address - 30% */}
//                     <div className="w-full md:w-[30%]">
//                       <label className="block mb-1 font-extrabold text-gray-700 text-md">
//                         Drop Address
//                       </label>
//                       <input
//                         {...register("dropAddress")}
//                         className="w-full py-2 pl-3 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         placeholder="Address"
//                       />
//                     </div>

//                     {/* Service Type - 10% */}
//                     <div className="w-full md:w-[15%]">
//                       <label className="block text-md font-extrabold text-gray-700 mb-1">
//                         Service
//                       </label>
//                       <select
//                         {...register("serviceType")}
//                         onChange={(e) => {
//                           const value = e.target.value;
//                           register("serviceType").onChange(e);

//                           // Agar Pick & Drop select kiya to days = 2 set karo
//                           if (value === "Pick & Drop") {
//                             setValue("days", 2);
//                           }
//                           // Agar koi aur option select kiya to days field ko editable chhodo
//                           // Aur agar pehle Pick & Drop tha to days ko empty ya previous value rahne do
//                         }}
//                         className="w-full py-2 border bg-white px-3 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       >
//                         <option value="">Select</option>
//                         <option value="One Way">One Way</option>
//                         <option value="Pick & Drop">Pick & Drop</option>
//                         <option value="Round Trip">Round Trip</option>
//                         <option value="Long Term Lease">Lease</option>
//                       </select>
//                     </div>

//                     {/* Trip Type - 20% (Same Line) */}
//                     {watch("serviceType") === "Round Trip" && (
//                       <div className="w-full md:w-[20%]">
//                         <label className="block text-md font-extrabold text-gray-700 mb-1">
//                           Trip Type
//                         </label>

//                         <div className="flex items-center gap-6 mt-2">
//                           <label className="flex items-center gap-2 cursor-pointer">
//                             <input
//                               type="radio"
//                               value="Sightseeing"
//                               {...register("tripType")}
//                               className="accent-blue-500"
//                             />
//                             <span className="text-sm font-semibold">
//                               Sightseeing
//                             </span>
//                           </label>

//                           <label className="flex items-center gap-2 cursor-pointer">
//                             <input
//                               type="radio"
//                               value="Point to Point"
//                               {...register("tripType")}
//                               className="accent-blue-500"
//                             />
//                             <span className="text-sm font-semibold">
//                               Point to Point
//                             </span>
//                           </label>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="p-4 mb-6 bg-white border rounded-lg">
//               <span className="mb-6 font-extrabold text-purple-600 text-md mt-4">
//                 Itinerary Details
//               </span>
//               <div>
//                 <div className="grid grid-cols-1 gap-4 mt-2 md:grid-cols-2">
//                   <div>
//                     <label className="block mb-1 mt-6 font-extrabold text-gray-700 text-md">
//                       Add Itinerary
//                     </label>
//                     <div className="relative group">
//                       <input
//                         value={currentItinerary}
//                         onChange={(e) => setCurrentItinerary(e.target.value)}
//                         onKeyDown={(e) => {
//                           if (e.key === "Enter") {
//                             e.preventDefault();
//                             addItinerary();
//                           }
//                         }}
//                         className="w-full px-3 py-2 pl-10 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         placeholder="Enter itinerary item"
//                       />
//                       <FileText
//                         className="absolute text-purple-600 -translate-y-1/2 left-3 top-1/2 group-focus-within:animate-pulse"
//                         size={20}
//                       />
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block mb-1 font-extrabold text-gray-700 text-md">
//                       Added Itineraries ({itineraryList.length}/15)
//                     </label>
//                     <div className="flex flex-wrap gap-2 overflow-y-auto max-h-32">
//                       {itineraryList.map((item, idx) => (
//                         <div
//                           key={idx}
//                           className="flex items-center gap-1 px-2 py-1 text-sm text-purple-800 bg-purple-100 rounded cursor-move"
//                           draggable
//                           onDragStart={(e) =>
//                             e.dataTransfer.setData("text/plain", idx.toString())
//                           }
//                           onDragOver={(e) => e.preventDefault()}
//                           onDrop={(e) => {
//                             const draggedIdx = parseInt(
//                               e.dataTransfer.getData("text/plain"),
//                             );
//                             if (draggedIdx !== idx) {
//                               const newList = [...itineraryList];
//                               const [removed] = newList.splice(draggedIdx, 1);
//                               newList.splice(idx, 0, removed);
//                               setItineraryList(newList);
//                               setValue("itinerary", newList);
//                             }
//                           }}
//                         >
//                           <GripVertical size={14} className="text-purple-600" />
//                           <span>{item}</span>
//                           <button
//                             onClick={() => removeItinerary(idx)}
//                             className="text-red-500 hover:text-red-700"
//                           >
//                             <X size={14} />
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-4">
//                   <div>
//                     <label className="block mb-1 font-extrabold text-gray-700 text-md">
//                       Actual KM <span className="text-red-500">*</span>
//                     </label>
//                     <div className="relative max-w-[180px]">
//                       <input
//                         type="number"
//                         {...register("km")}
//                         className="w-full bg-purple-600 text-white font-extrabold text-2xl py-2 pl-8 text-center pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-sm placeholder:font-normal placeholder:text-white/90"
//                         placeholder="Total KM"
//                       />
//                       <span className="absolute left-2 top-1/2 -translate-y-1/2 text-white pointer-events-none">
//                         📍
//                       </span>
//                       <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white font-bold pointer-events-none">
//                         KM
//                       </span>
//                     </div>
//                     {errors?.km && (
//                       <p className="mt-1 text-sm text-red-500">
//                         {errors.km?.message}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-md font-extrabold text-gray-700 mb-1">
//                       Occasion Type
//                     </label>
//                     <div className="relative group">
//                       <select
//                         {...register("occasion")}
//                         className="w-full py-2 border bg-white px-12 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       >
//                         <option value="">Select Occasion Type</option>
//                         <option value="Wedding">Wedding</option>
//                         <option value="Vacation">Vacation</option>
//                         <option value="Pilgrimage">Pilgrimage</option>
//                         <option value="Corporate">Corporate</option>
//                         <option value="Event">Event</option>
//                         <option value="Local">Local</option>
//                       </select>
//                       <FileText
//                         className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 group-focus-within:animate-pulse"
//                         size={20}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="p-6 mt-6 bg-white border rounded-xl">
//               <span className="mb-3 font-extrabold text-purple-900 text-md">
//                 Passenger Details
//               </span>
//               <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mt-4">
//                 <div>
//                   <label className="block mb-1 font-extrabold text-gray-700 text-md">
//                     Total Passengers <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative max-w-[180px]">
//                     <input
//                       type=""
//                       {...register("passengerTotal", { valueAsNumber: true })}
//                       className="w-full bg-purple-600 text-white font-extrabold text-2xl py-2 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-sm placeholder:font-normal placeholder:text-white/90"
//                       placeholder="Total Pax"
//                     />
//                     <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white font-bold pointer-events-none">
//                       Pax
//                     </span>
//                   </div>
//                   {errors.passengerTotal && (
//                     <p className="mt-1 text-sm text-red-500">
//                       {errors.passengerTotal?.message}
//                     </p>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block mb-1 font-extrabold text-gray-700 text-md">
//                     Number of Pets
//                   </label>
//                   <div className="relative max-w-[180px]">
//                     <input
//                       type="number"
//                       {...register("petsNumber", { valueAsNumber: true })}
//                       className="w-full bg-red-600 text-white font-extrabold text-2xl py-2 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-center placeholder:text-sm placeholder:font-normal placeholder:text-white/90"
//                       placeholder="No. of pets"
//                       min=""
//                     />
//                     <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white font-bold pointer-events-none">
//                       pets
//                     </span>
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block mb-1 font-extrabold text-gray-700 text-md">
//                     Pet Names
//                   </label>
//                   <div className="relative group">
//                     <input
//                       {...register("petsNames")}
//                       className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="Enter pet names"
//                     />
//                     <FileText
//                       className="absolute text-purple-800 -translate-y-1/2 left-3 top-1/2 group-focus-within:animate-pulse"
//                       size={20}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="p-6 mt-6 bg-white border rounded-xl">
//               <span className="mb-3 font-extrabold text-purple-900 text-md">
//                 Baggage Details
//               </span>
//               <div className="grid grid-cols-1 gap-4 md:grid-cols-5 mt-4">
//                 <div>
//                   <label className="block mb-1 font-extrabold text-gray-700 text-md">
//                     Small Baggage Size
//                   </label>
//                   <div className="relative group">
//                     <input
//                       type="number"
//                       {...register("smallbaggage", { valueAsNumber: true })}
//                       className="w-full py-2 bg-white pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="Total Small Baggage"
//                     />
//                     <Luggage
//                       className="absolute text-purple-800 -translate-y-1/2 left-3 top-1/2 group-focus-within:animate-pulse"
//                       size={16}
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block mb-1 font-extrabold text-gray-700 text-md">
//                     Medium Baggage Size
//                   </label>
//                   <div className="relative group">
//                     <input
//                       type="number"
//                       {...register("mediumbaggage", { valueAsNumber: true })}
//                       className="w-full py-2 bg-white pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="Total Medium Baggage"
//                     />
//                     <Luggage
//                       className="absolute text-purple-800 -translate-y-1/2 left-3 top-1/2 group-focus-within:animate-pulse"
//                       size={20}
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block mb-1 font-extrabold text-gray-700 text-md">
//                     Large Baggage Size
//                   </label>
//                   <div className="relative group">
//                     <input
//                       type="number"
//                       {...register("largebaggage", { valueAsNumber: true })}
//                       className="w-full py-2 bg-white pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="Total Large Baggage"
//                     />
//                     <Luggage
//                       className="absolute text-purple-800 -translate-y-1/2 left-3 top-1/2 group-focus-within:animate-pulse"
//                       size={20}
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block mb-1 font-extrabold text-gray-700 text-md">
//                     Airport Size Baggage
//                   </label>
//                   <div className="relative group">
//                     <input
//                       type="number"
//                       {...register("airportbaggage", { valueAsNumber: true })}
//                       className="w-full py-2 bg-white pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="Total Airport Baggage"
//                     />
//                     <Luggage
//                       className="absolute text-purple-800 -translate-y-1/2 left-3 top-1/2 group-focus-within:animate-pulse"
//                       size={20}
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block mb-1 font-extrabold text-gray-700 text-md">
//                     Total Baggage Size
//                   </label>
//                   <div className="relative group">
//                     <input
//                       type="text"
//                       {...register("totalbaggage", { valueAsNumber: true })}
//                       className="w-full bg-purple-600 text-white font-extrabold text-2xl py-2 pl-8 text-center pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-sm placeholder:font-normal placeholder:text-white/90"
//                       placeholder="Total Baggage"
//                     />
//                     <Luggage
//                       className="absolute text-white -translate-y-1/2 left-3 top-1/2 group-focus-within:animate-pulse"
//                       size={20}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="p-6 bg-white border rounded-xl mt-4">
//               <span className="mb-3 font-extrabold text-purple-900 text-md">
//                 Vehicle Details
//               </span>
//               <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-4">
//                 <div>
//                   <label className="block text-md font-extrabold text-gray-700 mb-1">
//                     Vehicle Type 1
//                   </label>
//                   <div className="relative group">
//                     <span title="">
//                       <Info
//                         size={15}
//                         className="absolute -top-4 right-0 text-blue-500 cursor-help"
//                       />
//                       {/* Tooltip - Hover par ye dikhega with scrollbar */}
//                       {/* <div className="absolute hidden group-hover:block right-0 bg-black text-white text-xs rounded-md p-2 shadow-lg z-50 max-w-[300px] max-h-[250px] overflow-y-auto">
//                         <p className="font-semibold border-b border-gray-600 pb-1 sticky top-0 bg-black">
//                           Vehicle Code = Vehicle Name
//                         </p>
//                         <div className="space-y-1">
//                           {vehicleCodes.map(
//                             (
//                               vehicle: { code: string; name: string },
//                               index,
//                             ) => (
//                               <p
//                                 key={index}
//                                 className="whitespace-nowrap hover:bg-gray-700 px-1"
//                               >
//                                 {vehicle.code} = {vehicle.name}
//                               </p>
//                             ),
//                           )}
//                         </div>
//                       </div> */}
//                     </span>
//                     <select
//                       {...register("vehicles")}
//                       className="w-full py-2 border bg-white px-12 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >
//                       <option value="">Select Vehicle Type</option>
//                       {vehicleCodes.map(
//                         (vehicle: { code: string; name: string }, index) => (
//                           <option
//                             key={`${vehicle.code}-${index}`}
//                             value={vehicle.code}
//                           >
//                             {vehicle.code}
//                           </option>
//                         ),
//                       )}
//                     </select>
//                     <FileText
//                       className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 group-focus-within:animate-pulse"
//                       size={20}
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-md font-extrabold text-gray-700 mb-1">
//                     Vehicle Type 2
//                   </label>
//                   <div className="relative group">
//                     <span title="All fields mandatory">
//                       <Info
//                         size={15}
//                         className="absolute -top-4 right-0 text-blue-500 cursor-help"
//                       />

//                       {/* Tooltip - Hover par ye dikhega with scrollbar */}
//                       {/* <div className="absolute hidden group-hover:block  bg-black text-white text-xs rounded-md p-2 shadow-lg z-50 min-w-[200px] max-h-[250px] overflow-y-auto">
//                         <p className="font-semibold  border-b border-gray-600 pb-1 sticky top-0 bg-black">
//                           Vehicle Code = Vehicle Name
//                         </p>
//                         <div className="space-y-1">
//                           {vehicleCodes.map(
//                             (
//                               vehicle: { code: string; name: string },
//                               index,
//                             ) => (
//                               <p
//                                 key={index}
//                                 className="whitespace-nowrap hover:bg-gray-700 px-1"
//                               >
//                                 {vehicle.code} = {vehicle.name}
//                               </p>
//                             ),
//                           )}
//                         </div>
//                       </div> */}
//                     </span>
//                     <select
//                       {...register("vehicle2")}
//                       className="w-full py-2 border bg-white px-12 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >
//                       <option value="">Select Vehicle Type 2</option>
//                       {vehicleCodes.map(
//                         (vehicle: { code: string; name: string }, index) => (
//                           <option
//                             key={`${vehicle.code}-type2-${index}`}
//                             value={vehicle.code}
//                           >
//                             {vehicle.code}
//                           </option>
//                         ),
//                       )}
//                     </select>
//                     <FileText
//                       className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 group-focus-within:animate-pulse"
//                       size={20}
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-md font-extrabold text-gray-700 mb-1">
//                     Vehicle Type 3
//                   </label>
//                   <div className="relative group">
//                     <span title="All fields mandatory">
//                       <Info
//                         size={15}
//                         className="absolute -top-4 right-0 text-blue-500 cursor-help"
//                       />

//                       {/* Tooltip - Hover par ye dikhega with scrollbar */}
//                       {/* <div className="absolute hidden group-hover:block  bg-black text-white text-xs rounded-md p-2 shadow-lg z-50 min-w-[200px] max-h-[250px] overflow-y-auto">
//                         <p className="font-semibold  border-b border-gray-600 pb-1 sticky top-0 bg-black">
//                           Vehicle Code = Vehicle Name
//                         </p>
//                         <div className="space-y-1">
//                           {vehicleCodes.map(
//                             (
//                               vehicle: { code: string; name: string },
//                               index,
//                             ) => (
//                               <p
//                                 key={index}
//                                 className="whitespace-nowrap hover:bg-gray-700 px-1"
//                               >
//                                 {vehicle.code} = {vehicle.name}
//                               </p>
//                             ),
//                           )}
//                         </div>
//                       </div> */}
//                     </span>

//                     <select
//                       {...register("vehicle3")}
//                       className="w-full py-2 border bg-white px-12 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >
//                       <option value="">Select Vehicle Type 3</option>
//                       {vehicleCodes.map(
//                         (vehicle: { code: string; name: string }, index) => (
//                           <option
//                             key={`${vehicle.code}-type3-${index}`}
//                             value={vehicle.code}
//                           >
//                             {vehicle.code}
//                           </option>
//                         ),
//                       )}
//                     </select>
//                     <FileText
//                       className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 group-focus-within:animate-pulse"
//                       size={20}
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block mb-1 font-extrabold text-gray-700 text-md">
//                     Total Vehicle Requirement
//                   </label>
//                   <div className="relative group">
//                     <input
//                       {...register("requirementVehicle")}
//                       className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="Enter requirement"
//                     />
//                     <FileText
//                       className="absolute text-purple-800 -translate-y-1/2 left-3 top-1/2 group-focus-within:animate-pulse"
//                       size={20}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-1">
//               <div>
//                 <label className="block text-md font-extrabold text-gray-700 mb-1">
//                   Remark
//                 </label>

//                 <div className="relative group">
//                   <textarea
//                     {...register("remarks")}
//                     rows={4}
//                     placeholder="Enter your remark..."
//                     className="w-full py-2 border bg-white px-12 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
//                   ></textarea>

//                   <FileText
//                     className="absolute left-3 top-3 text-green-600 group-focus-within:animate-pulse"
//                     size={20}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="pt-6">
//             {!isValid && Object.keys(errors).length > 0 && (
//               <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
//                 <p className="font-semibold mb-2">
//                   Please fix the following errors:
//                 </p>
//                 <ul className="list-disc list-inside text-sm">
//                   {Object.entries(errors)
//                     .slice(0, 5)
//                     .map(([key, error]: any) => (
//                       <li key={key}>{error?.message || `${key} is invalid`}</li>
//                     ))}
//                 </ul>
//               </div>
//             )}
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className={`w-full px-6 py-3 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-900 text-white hover:bg-blue-500"}`}
//             >
//               {isSubmitting
//                 ? "Submitting..."
//                 : isEditMode
//                   ? "Update"
//                   : "Submit"}
//             </button>
//           </div>
//         </form>

//         {showPopup && (
//           <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
//             <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-4 border-blue-300 p-4 rounded-3xl max-w-md w-full mx-4 shadow-2xl">
//               <div className="flex items-center justify-between mb-3">
//                 <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
//                   New Lead Arrived !!
//                 </h2>
//                 <button
//                   onClick={() => setShowPopup(false)}
//                   className="w-6 h-6 bg-red-200 hover:bg-red-300 text-red-600 hover:text-red-800 rounded-full flex items-center justify-center transition-colors duration-200"
//                 >
//                   <X size={14} />
//                 </button>
//               </div>
//               <div className="bg-white rounded-2xl p-3 shadow-lg text-gray-700">
//                 <div className="space-y-3">
//                   <div className="flex items-center">
//                     <svg
//                       className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//                       />
//                     </svg>
//                     <span className="font-semibold text-gray-900">
//                       Date & Time:
//                     </span>{" "}
//                     <span className="ml-2">{popupData.dateTime}</span>
//                   </div>
//                   <div className="flex items-center">
//                     <svg
//                       className="w-5 h-5 text-purple-500 mr-3 flex-shrink-0"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                       />
//                     </svg>
//                     <span className="font-semibold text-gray-900">CUS-:</span>{" "}
//                     <span className="ml-2">{popupData.customer}</span>
//                   </div>
//                   <div>
//                     <div className="flex items-center mb-2">
//                       <svg
//                         className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//                         />
//                       </svg>
//                       <span className="font-semibold text-gray-900">
//                         Travel Dates:
//                       </span>
//                     </div>
//                     <div className="ml-8 space-y-1 text-sm">
//                       <p>Start Date: {popupData.startDate}</p>
//                       <p>End Date: {popupData.endDate}</p>
//                       <p>No. of Days: {popupData.days}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Add custom animation styles */}
//       <style jsx>{`
//         @keyframes slideInRight {
//           from {
//             transform: translateX(100%);
//             opacity: 0;
//           }
//           to {
//             transform: translateX(0);
//             opacity: 1;
//           }
//         }

//         @keyframes slideOutRight {
//           from {
//             transform: translateX(0);
//             opacity: 1;
//           }
//           to {
//             transform: translateX(100%);
//             opacity: 0;
//           }
//         }

//         .animate-slide-in-right {
//           animation: slideInRight 0.3s ease-out;
//         }

//         .animate-slide-out-right {
//           animation: slideOutRight 0.3s ease-in;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default LeadsForm;
