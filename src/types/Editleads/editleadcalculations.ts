import { LeadRecord } from "../../types/types";
import { LeadFormData } from "./editleadschema";

// Parse phone number
export const parsePhone = (phone: string) => {
  if (!phone) return { code: "+91", number: "" };
  const match = phone.match(/^\+(\d{1,3})\s*(.*)$/);
  if (match) {
    return { code: "+" + match[1], number: match[2].trim() };
  }
  return { code: "+91", number: phone.trim() };
};

// Format date for input field
export const formatDateTimeForInput = (dateStr: string | undefined): string => {
  if (!dateStr) return "";
  let formatted = dateStr.replace(" ", "T");
  const tIndex = formatted.indexOf("T");
  if (tIndex !== -1) {
    const datePart = formatted.substring(0, tIndex);
    const timePart = formatted.substring(tIndex + 1);
    const timeComponents = timePart.split(":");
    const hh = timeComponents[0] || "00";
    const mm = timeComponents[1] || "00";
    formatted = `${datePart}T${hh}:${mm}`;
  }
  return formatted;
};

// Format date for API submission
export const formatDateTimeForSubmit = (
  dateStr: string | undefined,
): string | undefined => {
  if (!dateStr) return undefined;
  let formatted = dateStr.replace("T", " ");
  const parts = formatted.split(" ");
  if (parts.length >= 2) {
    const timePart = parts[1];
    if (timePart && timePart.includes(":")) {
      const timeComponents = timePart.split(":");
      if (timeComponents.length === 2) {
        parts[1] = timePart + ":00";
        formatted = parts.join(" ");
      }
    }
  }
  return formatted;
};

// Calculate number of days - Fixed to handle undefined serviceType
export const calculateDays = (
  serviceType: string | undefined,
  pickupDateTime: string,
  dropDateTime: string | undefined,
): number => {
  if (serviceType === "Pick & Drop") return 2;

  if (pickupDateTime && dropDateTime) {
    const pickup = new Date(pickupDateTime.split("T")[0]);
    const drop = new Date(dropDateTime.split("T")[0]);
    const diffDays =
      (drop.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays + 1 > 0 ? diffDays + 1 : 1;
  }
  return 1;
};

// Calculate total baggage
export const calculateTotalBaggage = (
  small: number = 0,
  medium: number = 0,
  large: number = 0,
  airport: number = 0,
): number => {
  return small + medium + large + airport;
};

export const calculateTotalVehicles = (
  vehicle1: string,
  vehicle1Qty: number = 0,
  vehicle2: string,
  vehicle2Qty: number = 0,
  vehicle3: string,
  vehicle3Qty: number = 0,
): string => {
  const vehicles: string[] = [];

  if (vehicle1 && vehicle1Qty > 0) {
    vehicles.push(`${vehicle1} x ${vehicle1Qty}`);
  }
  if (vehicle2 && vehicle2Qty > 0) {
    vehicles.push(`${vehicle2} x ${vehicle2Qty}`);
  }
  if (vehicle3 && vehicle3Qty > 0) {
    vehicles.push(`${vehicle3} x ${vehicle3Qty}`);
  }

  return vehicles.join(", ");
};

// Prepare payload for API
export const prepareLeadPayload = (
  data: LeadFormData,
  formData: any,
  itineraryList: string[],
  alternateCountryCode: string,
) => {
  return {
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
    pickupDateTime: formatDateTimeForSubmit(data.pickupDateTime),
    dropDateTime: formatDateTimeForSubmit(data.dropDateTime),
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
    vehicle1Quantity: Number(data.vehicle1Quantity) || 0,
    vehicle2Quantity: Number(data.vehicle2Quantity) || 0,
    vehicle3Quantity: Number(data.vehicle3Quantity) || 0,
    requirementVehicle: data.requirementVehicle || "",
    remarks: data.remarks || "",
    lost_reason: data.lost_reason || "",
    lostReasonDetails: data.lostReasonDetails || "",
    followUp: data.followUp || "",
    message: "",
  };
};

// Map initial data to form
export const mapInitialDataToForm = (initialData: LeadRecord) => {
  const mainPhone = parsePhone(initialData.customerPhone || "");
  const altPhone = parsePhone(initialData.alternatePhone || "");

  return {
    formData: {
      name: initialData.customerName || "",
      phone: mainPhone.number,
      alternatePhone: altPhone.number,
      email: initialData.customerEmail || "",
      companyName:
        initialData.customerType === "Personal"
          ? "C"
          : initialData.companyName || "",
    },
    alternateCountryCode: altPhone.code,
    customerCategoryTypeValue: initialData.customerCategoryType || "",
    itineraryList: initialData.itinerary || [],
    setValues: {
      date: initialData.enquiryTime?.slice(0, 16) || "",
      source: initialData.source,
      telesales: initialData.telecaller,
      status: initialData.status,
      customerType: initialData.customerType,
      customerCategoryType: initialData.customerCategoryType || "",
      serviceType: initialData.serviceType,
      tripType: initialData.tripType || "",
      occasion: initialData.occasion || "",
      pickupDateTime: formatDateTimeForInput(initialData.pickupDateTime),
      dropDateTime: formatDateTimeForInput(initialData.dropDateTime),
      pickupAddress: initialData.pickupAddress || "",
      dropAddress: initialData.dropAddress || "",
      pickupcity: (initialData as any).pickupcity || "",
      dropcity: (initialData as any).dropcity || "",
      passengerTotal: initialData.passengerTotal,
      days: initialData.days,
      km: String(initialData.km),
      petsNumber: initialData.petsNumber || 0,
      petsNames: initialData.petsNames || "",
      vehicles: initialData.vehicles || "",
      vehicle2: initialData.vehicle2 || "",
      vehicle3: initialData.vehicle3 || "",
      vehicle1Quantity: (initialData as any).vehicle1Quantity || 0,
      vehicle2Quantity: (initialData as any).vehicle2Quantity || 0,
      vehicle3Quantity: (initialData as any).vehicle3Quantity || 0,
      requirementVehicle: initialData.requirementVehicle || "",
      smallbaggage: initialData.smallBaggage || 0,
      mediumbaggage: initialData.mediumBaggage || 0,
      largebaggage: initialData.largeBaggage || 0,
      airportbaggage: initialData.airportBaggage || 0,
      totalbaggage: initialData.totalBaggage || 0,
      remarks: initialData.remarks || "",
      lost_reason: initialData.lost_reason || "",
      lostReasonDetails: initialData.lostReasonDetails || "",
      followUp: initialData.followUp || "",
      countryName: initialData.countryName || "",
      city: initialData.city || "",
      itinerary: initialData.itinerary || [],
    },
  };
};
