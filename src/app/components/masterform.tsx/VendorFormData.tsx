"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  FileText,
  Truck,
  Calendar,
  Palette,
  Users,
  Fuel,
  Car,
  Star,
  MessageSquare,
  DollarSign,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { stateOptions, getCitiesByState } from "../../../data/statesCities";


interface VendorFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  panNumber: string;
  aadhaarNumber: string;
  companyName: string;
  businessNumber: string;
  companyRegisteredNumber: string;
  gstNumber: string;
  registeredAddress: string;
  garageAddress: string;
  garagePhone: string;
  cooperativeName: string;
  cooperativeNumber: string;
  passportPhoto: File | null;
  panDoc: File | null;
  gstDoc: File | null;
  vendorProof: File | null;
  vehicleDoc: File | null;
  code: string;
  managerName2: string;
  companyType: string;
  companyPanNumber: string;
  personalAddressInfo: {
    city: string;
    state: string;
  };
  addressInfo: {
    city: string;
    state: string;
  };
}

interface VehicleDraft {
  type: string;
  model: string;
  brand: string;
  year: string;
  regDate: string;
  regNumber: string;
  seats: string;
  fuel: string;
  category: string;
  color: string;
  amenities: string;
  message: string;
  pricePerKm: string;
  seatConfiguration: string;
  manufactureCompany: string;
}

interface VehicleListItem {
  _id: string;
  plate: string;
  vehicleModel: string;
  type: string;
  category: string;
  status: string;
  fuelType?: string;
  seats?: number;
  assignedDriver?: { licenseNumber?: string } | null;
  pricePerKm?: number;
  manufactureCompany?: string;
  year?: string;
}

const vehicleTypes = ["Car", "Tempo Traveller", "Tempo", "Bus", "Van", "Velfier"];
const fuelTypes = ["Petrol", "Diesel", "CNG", "Electric"];
const companyTypes = ["Private Limited", "Public Limited", "Partnership", "Sole Proprietorship", "LLP"];
const seatConfigurations = [ "1x1 Maharaja", "2x1 Maharaja","2x1", "2x2", "3x2", "2x1 Berth","2x1 Berth + Seat"];
const seatingCapacities = Array.from({ length: 60 }, (_, i) => `${i + 4} Seater`);
const manufactureCompanies = [
  "Audi",
  "BMW",
  "SML",
  "Maruti Suzuki",
  "Ashok Leyland",
  "Eicher",
  "Volvo",
  "Force Motors",
  "Honda",
  "Hyundai",
  "Mercedes-Benz",
  "Nissan",
  "Tata Motors",
  "Toyota",
  "Volkswagen"
].sort((b, a) => b.localeCompare(a)); // descending alphabetical
const initialFormState: VendorFormData = {
  name: "",
  email: "",
  phone: "",
  address: "",
  panNumber: "",
  aadhaarNumber: "",
  companyName: "",
  businessNumber: "",
  companyRegisteredNumber: "",
  gstNumber: "",
  registeredAddress: "",
  garageAddress: "",
  garagePhone: "",
  cooperativeName: "",
  cooperativeNumber: "",
  passportPhoto: null,
  panDoc: null,
  gstDoc: null,
  vendorProof: null,
  vehicleDoc: null,
  code: "",
  managerName2: "",
  companyType: "",
  companyPanNumber: "",
  personalAddressInfo: {
    city: "",
    state: "",
  },
  addressInfo: {
    city: "",
    state: "",
  },
};

const initialVehicle: VehicleDraft = {
  type: "",
  model: "",
  brand: "",
  year: "",
  regDate: "",
  regNumber: "",
  seats: "",
  fuel: "",
  category: "",
  color: "",
  amenities: "",
  message: "",
  pricePerKm: "",
  seatConfiguration: "",
  manufactureCompany: "",
};

const FIELD_LABELS: Partial<Record<keyof VendorFormData, string>> = {
  name: "Vendor Name",
  email: "Email",
  phone: "Phone Number",
  address: "Address",
  panNumber: "PAN Number",
  aadhaarNumber: "Aadhaar Number",
  companyName: "Company Name",
  businessNumber: "Business Number",
  companyRegisteredNumber: "Company Registration Number",
  gstNumber: "GST Number",
  registeredAddress: "Registered Address",
  garageAddress: "Garage Address",
  garagePhone: "Garage Phone Number",
  cooperativeName: "Cooperative Name",
  cooperativeNumber: "Cooperative Number",
  passportPhoto: "Passport Photo",
  panDoc: "PAN Document",
  gstDoc: "GST Document",
  vendorProof: "Vendor Proof",
  vehicleDoc: "Vehicle Document",
  code: "Vendor Code",
  managerName2: "Manager Name 2",
  companyType: "Company Type",
  companyPanNumber: "Company PAN Number",
};

const FIELD_MAX_LENGTH: Partial<Record<keyof VendorFormData, number>> = {
  name: 50,
  email: 50,
  phone: 10,
  address: 150,
  panNumber: 10,
  aadhaarNumber: 10,
  companyName: 150,
  businessNumber: 10,
  companyRegisteredNumber: 150,
  gstNumber: 15,
  registeredAddress: 150,
  garageAddress: 150,
  garagePhone: 10,
  cooperativeName: 150,
  cooperativeNumber: 10,
  code: 50,
  managerName2: 50,
  companyType: 50,
  companyPanNumber: 10,
};

const REQUIRED_FIELDS: (keyof VendorFormData)[] = [
  "name",
  "email",
  "phone",
  "address",
  "panNumber",
  "aadhaarNumber",
  "companyName",
  "companyRegisteredNumber",
  "gstNumber",
  "registeredAddress",
  "garageAddress",
  "code",
  "managerName2",
  "companyType",
  "companyPanNumber",
];

const NUMERIC_ONLY_FIELDS: (keyof VendorFormData)[] = [
  "phone",
  "businessNumber",
  "garagePhone",
  "cooperativeNumber",
  "aadhaarNumber",
];

const UPPERCASE_FIELDS: (keyof VendorFormData)[] = ["panNumber", "gstNumber"];
const FILE_FIELDS = [
  "passportPhoto",
  "panDoc",
  "gstDoc",
  "vendorProof",
  "vehicleDoc",
] as const satisfies ReadonlyArray<keyof VendorFormData>;
const MESSAGE_WORD_LIMIT = 300;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const VEHICLE_FIELD_MAX_LENGTH: Partial<Record<keyof VehicleDraft, number>> = {
  type: 50,
  model: 150,
  brand: 150,
  year: 4,
  regDate: 10,
  regNumber: 20,
  seats: 3,
  fuel: 20,
  category: 50,
  color: 50,
  amenities: 150,
  message: 2000,
  pricePerKm: 3,
  seatConfiguration: 50,
};

const VendorForm: React.FC = () => {
  const [formData, setFormData] = useState<VendorFormData>(initialFormState);
  const [vehicleDraft, setVehicleDraft] = useState<VehicleDraft>(initialVehicle);
  const [vehicles, setVehicles] = useState<VehicleListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingVehicle, setSavingVehicle] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const [personalCities, setPersonalCities] = useState<string[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [touchedFields, setTouchedFields] = useState<Partial<Record<keyof VendorFormData, boolean>>>({});

  const getMaxLength = (field: keyof VendorFormData) => FIELD_MAX_LENGTH[field] ?? 150;

  const baseInputClass =
    "border border-gray-300 bg-white rounded px-3 py-2 w-full";

  const getFieldError = (field: keyof VendorFormData) => {
    const rawValue = (formData[field] || "") as string;
    const value = rawValue.trim();

    if (REQUIRED_FIELDS.includes(field) && !value) {
      return "required";
    }

    if (field === "email" && value && !EMAIL_REGEX.test(value)) {
      return "invalid";
    }

    if (NUMERIC_ONLY_FIELDS.includes(field)) {
      if (value.length > 10) {
        return "max-digits";
      }
      if ((field === "phone" || field === "aadhaarNumber") && value.length !== 10) {
        return "length";
      }
    }

    if (value && value.length > getMaxLength(field)) {
      return "length-limit";
    }

    return null;
  };

  const getFieldStateClasses = (field: keyof VendorFormData) => {
    const touched = touchedFields[field];
    const errorKey = getFieldError(field);
    const hasValue = ((formData[field] || "") as string).trim().length > 0;

    if (touched && errorKey) {
      return "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-red-700 placeholder:text-red-400";
    }

    if (touched && hasValue && !errorKey) {
      return "border-green-500 focus:ring-2 focus:ring-green-500 focus:border-green-500";
    }

    return "focus:ring-2 focus:ring-green-500 focus:border-green-500";
  };

  const getInputClass = (field: keyof VendorFormData, withIcon = false) =>
    `${baseInputClass} ${withIcon ? "pl-10" : ""} ${getFieldStateClasses(field)}`;

  const getTextAreaClass = (field: keyof VendorFormData, withIcon = false) =>
    `${baseInputClass} ${withIcon ? "pl-10" : ""} ${getFieldStateClasses(field)}`;

  const markFieldTouched = (field: keyof VendorFormData) =>
    setTouchedFields((prev) => ({ ...prev, [field]: true }));

  const getVehicleInputClass = (withIcon = false) => `${baseInputClass} ${withIcon ? "pl-10" : ""}`;
  const getVehicleTextareaClass = (withIcon = false) => `${baseInputClass} ${withIcon ? "pl-10" : ""}`;

  const sanitizeValue = useCallback((field: keyof VendorFormData, value: string) => {
    let sanitized = value;

    if (NUMERIC_ONLY_FIELDS.includes(field)) {
      sanitized = value.replace(/\D/g, "").slice(0, getMaxLength(field));
      return sanitized;
    }

    if (field === "email") {
      sanitized = value.replace(/\s+/g, "");
      return sanitized.slice(0, getMaxLength(field));
    }

    if (UPPERCASE_FIELDS.includes(field)) {
      sanitized = value.replace(/\s+/g, "").toUpperCase();
      return sanitized.slice(0, getMaxLength(field));
    }

    sanitized = value.replace(/\s{2,}/g, " ").replace(/^\s+/, "");
    if (sanitized.length > getMaxLength(field)) {
      sanitized = sanitized.slice(0, getMaxLength(field));
    }
    return sanitized;
  }, []);

  const validateRequiredFields = (data: VendorFormData) => {
    for (const field of REQUIRED_FIELDS) {
      const value = (data[field] || "") as string;
      if (!value.trim()) {
        return `${FIELD_LABELS[field]} is required.`;
      }
    }
    if (!data.personalAddressInfo.city.trim()) {
      return "Personal City is required.";
    }
    if (!data.personalAddressInfo.state.trim()) {
      return "Personal State is required.";
    }
    if (!data.addressInfo.city.trim()) {
      return "Company City is required.";
    }
    if (!data.addressInfo.state.trim()) {
      return "Company State is required.";
    }
    return null;
  };

  const isFileField = (field: keyof VendorFormData): field is (typeof FILE_FIELDS)[number] =>
    FILE_FIELDS.includes(field as (typeof FILE_FIELDS)[number]);

  const sanitizeFormData = (data: VendorFormData): VendorFormData => {
    const next: VendorFormData = { ...data };

    (Object.keys(data) as Array<keyof VendorFormData>).forEach((fieldKey) => {
      const value = data[fieldKey];
      if (!isFileField(fieldKey) && typeof value === "string" && fieldKey !== "addressInfo" && fieldKey !== "personalAddressInfo") {
        next[fieldKey] = sanitizeValue(fieldKey, value) as VendorFormData[typeof fieldKey];
      } else if (isFileField(fieldKey)) {
        // file fields (File | null)
        next[fieldKey] = value as VendorFormData[typeof fieldKey];
      } else if (fieldKey === "addressInfo" || fieldKey === "personalAddressInfo") {
        // addressInfo and personalAddressInfo are objects, copy as is
        next[fieldKey] = value as VendorFormData[typeof fieldKey];
      } else {
        // fallback (shouldn't happen) - coerce to empty string
        next[fieldKey] = (typeof value === 'string' ? value : '') as VendorFormData[typeof fieldKey];
      }
    });

    return next;
  };

  const ensureValidPhoneLength = (value: string, field: keyof VendorFormData) => {
    if (!value) return null;
    if (!NUMERIC_ONLY_FIELDS.includes(field)) return null;

    if (value.length > 10) {
      return `${FIELD_LABELS[field]} must not exceed 10 digits.`;
    }

    if ((field === "phone" || field === "aadhaarNumber") && value.length !== 10) {
      return `${FIELD_LABELS[field]} must be exactly 10 digits.`;
    }
    return null;
  };

  const getVehicleMaxLength = (field: keyof VehicleDraft) => VEHICLE_FIELD_MAX_LENGTH[field] ?? 150;

  const enforceWordLimit = (text: string, limit: number) => {
    const words = text.trim().split(/\s+/).filter(Boolean);
    if (words.length <= limit) {
      return text;
    }
    return words.slice(0, limit).join(" ");
  };

  const sanitizeVehicleField = (field: keyof VehicleDraft, value: string) => {
    if (field === "message") {
      const cleaned = value.replace(/\s{2,}/g, " ").replace(/^\s+/, "");
      return enforceWordLimit(cleaned, MESSAGE_WORD_LIMIT);
    }

    if (field === "regNumber") {
      return value.replace(/\s+/g, "").toUpperCase().slice(0, getVehicleMaxLength(field));
    }

    if (field === "type" || field === "fuel" || field === "category" || field === "seatConfiguration") {
      const trimmed = value.replace(/\s{2,}/g, " ").replace(/^\s+/, "");
      return trimmed.slice(0, getVehicleMaxLength(field));
    }

    if (field === "seats" || field === "pricePerKm") {
      return value.replace(/\D/g, "").slice(0, getVehicleMaxLength(field));
    }

    if (field === "year") {
      return value.replace(/\D/g, "").slice(0, 4);
    }

    const normalized = value.replace(/\s{2,}/g, " ").replace(/^\s+/, "");
    return normalized.slice(0, getVehicleMaxLength(field));
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    const cityList = getCitiesByState(formData.addressInfo.state);
    setCities(cityList);
  }, [formData.addressInfo.state]);

  useEffect(() => {
    const personalCityList = getCitiesByState(formData.personalAddressInfo.state);
    setPersonalCities(personalCityList);
  }, [formData.personalAddressInfo.state]);

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const fieldKey = name as keyof VendorFormData;
    const sanitized = sanitizeValue(fieldKey, value);
    setFormData((prev) => ({ ...prev, [fieldKey]: sanitized }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    if (keys.length === 2) {
      if (keys[0] === 'addressInfo') {
        const subKey = keys[1] as keyof VendorFormData['addressInfo'];
        setFormData((prev) => ({
          ...prev,
          addressInfo: {
            ...prev.addressInfo,
            [subKey]: value,
          },
        }));
      } else if (keys[0] === 'personalAddressInfo') {
        const subKey = keys[1] as keyof VendorFormData['personalAddressInfo'];
        setFormData((prev) => ({
          ...prev,
          personalAddressInfo: {
            ...prev.personalAddressInfo,
            [subKey]: value,
          },
        }));
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof VendorFormData) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const handleVehicleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const fieldKey = name as keyof VehicleDraft;
    const sanitized = sanitizeVehicleField(fieldKey, value);
    setVehicleDraft((prev) => ({ ...prev, [fieldKey]: sanitized }));
  };

  const resetVehicleDraft = () => {
    setVehicleDraft(initialVehicle);
  };

  const handleProfileSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setSavingProfile(true);

    try {
      const sanitizedProfile = sanitizeFormData(formData);

      const requiredFieldError = validateRequiredFields(sanitizedProfile);
      if (requiredFieldError) {
        setError(requiredFieldError);
        setFormData(sanitizedProfile);
        return;
      }

      for (const field of NUMERIC_ONLY_FIELDS) {
        const errorMessage = ensureValidPhoneLength((sanitizedProfile[field] as string) || "", field);
        if (errorMessage) {
          setError(errorMessage);
          setFormData(sanitizedProfile);
          return;
        }
      }

      setFormData(sanitizedProfile);

      // Simulate successful submission
      setSuccessMessage("Vendor profile submitted successfully.");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || "Failed to submit vendor profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleVehicleSubmit = async () => {
    setError(null);
    setSuccessMessage(null);

    if (!vehicleDraft.model || !vehicleDraft.regNumber) {
      setError("Please complete the model and registration number fields.");
      return;
    }

    setSavingVehicle(true);
    try {
      // Simulate adding vehicle
      const newVehicle: VehicleListItem = {
        _id: Date.now().toString(),
        plate: vehicleDraft.regNumber.trim().toUpperCase(),
        vehicleModel: vehicleDraft.model.trim(),
        type: vehicleDraft.seatConfiguration,
        category: vehicleDraft.category ? vehicleDraft.category.trim() : 'Uncategorized',
        status: "Available",
        fuelType: vehicleDraft.fuel || undefined,
        seats: vehicleDraft.seats ? Number(vehicleDraft.seats) : undefined,
        pricePerKm: vehicleDraft.pricePerKm ? Number(vehicleDraft.pricePerKm) : undefined,
        manufactureCompany: vehicleDraft.manufactureCompany || undefined,
        year: vehicleDraft.year || undefined,
      };

      setVehicles((prev) => [newVehicle, ...prev]);
      setSuccessMessage("Vehicle added successfully.");
      resetVehicleDraft();
    } catch (err: unknown) {
      setError("Failed to add vehicle");
    } finally {
      setSavingVehicle(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full py-12">
        <div className="text-lg text-gray-600">Loading vendor form...</div>
      </div>
    );
  }

  return (
    <div className="p-6 w-[165vh] mx-auto bg-white shadow-xl rounded-lg">
      <div className="p-6">
        <div className="p-4 mb-8 bg-orange-100 rounded-xl">
          <h2 className="text-2xl font-bold text-center text-orange-600">Vendor Registration Form</h2>
          <p className="mt-2 text-center text-orange-700">
            <span className="text-red-500">*</span> All fields marked with asterisk are required
          </p>
        </div>

        {(error || successMessage) && (
          <div className="mb-6">
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 text-red-700 border border-red-200 rounded-lg bg-red-50">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}
            {successMessage && (
              <div className="flex items-center gap-2 px-4 py-3 mt-3 text-green-700 border border-green-200 rounded-lg bg-green-50">
                <CheckCircle2 className="w-5 h-5" />
                <span>{successMessage}</span>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          {/* vendor nfo */}
          <div className="p-6 border rounded-xl bg-purple-50">
            <h3 className="pb-3 mb-6 text-xl font-semibold text-purple-800 border-b">
              <span className="px-3 py-1 mr-2 text-white bg-purple-600 rounded-md">1</span>
              Vendor  Detail
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block mb-1 font-extrabold text-gray-700 text-md ">
                  Vendor Name <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleFieldChange}
                    onBlur={() => markFieldTouched("name")}
                    placeholder="Enter vendor name"
                    className={getInputClass("name", true)}
                    maxLength={getMaxLength("name")}
                    required
                  />
                  <User className="absolute text-purple-600 -translate-y-1/2 left-3 top-1/2 group-focus-within:animate-pulse" size={20} />
                </div>
              </div>
                <div>
                <label className="block mb-1 font-extrabold text-gray-700 text-md ">
                  Vendor Short Name <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <input
                    name="Short Name"
                    value={formData.name}
                    onChange={handleFieldChange}
                    onBlur={() => markFieldTouched("name")}
                    placeholder="Enter Short Name"
                    className={getInputClass("name", true)}
                    maxLength={getMaxLength("name")}
                    required
                  />
                  <User className="absolute text-purple-600 -translate-y-1/2 left-3 top-1/2 group-focus-within:animate-pulse" size={20} />
                </div>
              </div>
                <div>
                <label className="block mb-1 font-extrabold text-gray-700 text-md ">
                  Vendor code <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <input
                    name="code"
                    value={formData.code}
                    onChange={handleFieldChange}
                    onBlur={() => markFieldTouched("code")}
                    placeholder="Enter Vendor Code"
                    className={getInputClass("code", true)}
                    maxLength={getMaxLength("code")}
                    required
                  />
                  <User className="absolute text-purple-600 -translate-y-1/2 left-3 top-1/2 group-focus-within:animate-pulse" size={20} />
                </div>
              </div>
                <div>
                  <label className="block mb-1 text-sm font-extrabold text-gray-700">
                    State <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="personalAddressInfo.state"
                    value={formData.personalAddressInfo.state}
                    onChange={handleInputChange}
                    list="personalStates"
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
                    required
                  />
                  <datalist id="personalStates">
                    {stateOptions.map((state) => (
                      <option key={state} value={state} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-extrabold text-gray-700">
                  City  <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="personalAddressInfo.city"
                    value={formData.personalAddressInfo.city}
                    onChange={handleInputChange}
                    list="personalCities"
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
                    required
                  />
                  <datalist id="personalCities">
                    {personalCities.map((city) => (
                      <option key={city} value={city} />
                    ))}
                  </datalist>
                </div>
            </div>
          </div>
          {/*     Vendor Contact Information */}
          <div className="p-6 border rounded-xl bg-blue-50">
            <h3 className="pb-3 mb-6 text-xl font-semibold text-blue-800 border-b">
              <span className="px-3 py-1 mr-2 text-white bg-blue-600 rounded-md">2</span>
               Contact Information
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block mb-1 font-extrabold text-gray-700 text-md ">
                  Owner Name <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleFieldChange}
                    onBlur={() => markFieldTouched("name")}
                    placeholder="Enter vendor name"
                    className={getInputClass("name", true)}
                    maxLength={getMaxLength("name")}
                    required
                  />
                  <User className="absolute text-blue-600 -translate-y-1/2 left-3 top-1/2 group-focus-within:animate-pulse" size={20} />
                </div>
              </div>
              
              
                <div>
                <label className="block mb-1 font-extrabold text-gray-700 text-md">
                   Owner Phone  Number <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleFieldChange}
                    onBlur={() => markFieldTouched("phone")}
                    placeholder="Enter Phone number"
                    className={getInputClass("phone", true)}
                    maxLength={getMaxLength("phone")}
                    inputMode="numeric"
                    required
                  />
                  <FileText className="absolute text-blue-600 -translate-y-1/2 left-3 top-1/2 group-focus-within:animate-pulse" size={20} />
                </div>
              </div>
         
              <div>
                <label className="block mb-1 font-extrabold text-gray-700 text-md">
                   Owner Email <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleFieldChange}
                    onBlur={() => markFieldTouched("email")}
                    placeholder="Enter email address"
                    className={getInputClass("email", true)}
                    maxLength={getMaxLength("email")}
                    required
                  />
                  <Mail className="absolute text-blue-600 -translate-y-1/2 left-3 top-1/2 group-focus-within:animate-pulse" size={20} />
                </div>
              </div>
            
           
               <div >
                <label className="block mb-1 font-extrabold text-gray-700 text-md ">
                  Manager 1 Name  <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <input
                    name="Short Name"
                    value={formData.name}
                    onChange={handleFieldChange}
                    onBlur={() => markFieldTouched("name")}
                    placeholder="Enter Manager name 1"
                    className={getInputClass("name", true)}
                    maxLength={getMaxLength("name")}
                    required
                  />
                  <User className="absolute text-blue-600 -translate-y-1/2 left-3 top-1/2 group-focus-within:animate-pulse" size={20} />
                </div>
              </div>
                <div>
                <label className="block mb-1 font-extrabold text-gray-700 text-md">
                  Manager 1 Phone  Number <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleFieldChange}
                    onBlur={() => markFieldTouched("phone")}
                    placeholder="Enter  Manager Phone number"
                    className={getInputClass("phone", true)}
                    maxLength={getMaxLength("phone")}
                    inputMode="numeric"
                    required
                  />
                  <FileText className="absolute text-blue-600 -translate-y-1/2 left-3 top-1/2 group-focus-within:animate-pulse" size={20} />
                </div>
              </div>
              
         
              <div>
                <label className="block mb-1 font-extrabold text-gray-700 text-md">
                  Manager 1 Email <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleFieldChange}
                    onBlur={() => markFieldTouched("email")}
                    placeholder="Enter email address"
                    className={getInputClass("email", true)}
                    maxLength={getMaxLength("email")}
                    required
                  />
                  <Mail className="absolute text-blue-600 -translate-y-1/2 left-3 top-1/2 group-focus-within:animate-pulse" size={20} />
                </div>
              </div>
              
               <div >
                <label className="block mb-1 font-extrabold text-gray-700 text-md ">
                  Manager 2 Name  <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <input
                    name="Short Name"
                    value={formData.name}
                    onChange={handleFieldChange}
                    onBlur={() => markFieldTouched("name")}
                    placeholder="Enter Manager name 1"
                    className={getInputClass("name", true)}
                    maxLength={getMaxLength("name")}
                    required
                  />
                  <User className="absolute text-blue-600 -translate-y-1/2 left-3 top-1/2 group-focus-within:animate-pulse" size={20} />
                </div>
              </div>
                <div>
                <label className="block mb-1 font-extrabold text-gray-700 text-md">
                  Manager 2 Phone  Number <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleFieldChange}
                    onBlur={() => markFieldTouched("phone")}
                    placeholder="Enter  Manager Phone number"
                    className={getInputClass("phone", true)}
                    maxLength={getMaxLength("phone")}
                    inputMode="numeric"
                    required
                  />
                  <FileText className="absolute text-blue-600 -translate-y-1/2 left-3 top-1/2 group-focus-within:animate-pulse" size={20} />
                </div>
              </div>
              
         
              <div>
                <label className="block mb-1 font-extrabold text-gray-700 text-md">
                  Manager 2 Email <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleFieldChange}
                    onBlur={() => markFieldTouched("email")}
                    placeholder="Enter email address"
                    className={getInputClass("email", true)}
                    maxLength={getMaxLength("email")}
                    required
                  />
                  <Mail className="absolute text-blue-600 -translate-y-1/2 left-3 top-1/2 group-focus-within:animate-pulse" size={20} />
                </div>
              </div>
              </div>
          </div>
{/*  Company Details/Firm */}
          <div className="p-6 border rounded-xl bg-green-50">
            <h3 className="pb-3 mb-6 text-xl font-semibold text-green-800 border-b">
              <span className="px-3 py-1 mr-2 text-white bg-green-600 rounded-md">3</span>
              Company / Firm Details
            </h3>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="block mb-1 font-extrabold text-gray-700 text-md">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <input
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleFieldChange}
                    onBlur={() => markFieldTouched("companyName")}
                    placeholder="Enter company name"
                    className={getInputClass("companyName", true)}
                    maxLength={getMaxLength("companyName")}
                    required
                  />
                  <Building className="absolute text-green-600 -translate-y-1/2 left-3 top-1/2 group-focus-within:animate-pulse" size={20} />
                </div>
              </div>
               <div>
                    <label className="block mb-1 font-extrabold text-gray-700 text-md">
                      Company Type <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <select
                        name="companyType"
                        value={formData.companyType}
                        onChange={handleFieldChange}
                        className={getInputClass("companyType", true)}
                        required
                      >
                        <option value="" >Select type</option>
                        {companyTypes.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                      <Building className="absolute text-green-600 -translate-y-1/2 left-3 top-1/2 group-focus-within:animate-pulse" size={20} />
                    </div>
                  </div>
           
              <div>
                <label className="block mb-1 font-extrabold text-gray-700 text-md">
                  Company Registration Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    name="companyRegisteredNumber"
                    value={formData.companyRegisteredNumber}
                    onChange={handleFieldChange}
                    onBlur={() => markFieldTouched("companyRegisteredNumber")}
                    placeholder="Enter registration number"
                    className={getInputClass("companyRegisteredNumber", true)}
                    maxLength={getMaxLength("companyRegisteredNumber")}
                    required
                  />
                  <FileText className="absolute text-green-600 -translate-y-1/2 left-3 top-1/2" size={20} />
                </div>
              </div>
              <div>
                <label className="block mb-1 font-extrabold text-gray-700 text-md">
                  GST Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleFieldChange}
                    onBlur={() => markFieldTouched("gstNumber")}
                    placeholder="Enter GST number"
                    className={getInputClass("gstNumber", true)}
                    maxLength={getMaxLength("gstNumber")}
                    required
                  />
                  <FileText className="absolute text-green-600 -translate-y-1/2 left-3 top-1/2" size={20} />
                </div>
              </div>
               <div>
                <label className="block mb-1 font-extrabold text-gray-700 text-md">
                  Company Pan Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    name="companyPanNumber"
                    value={formData.companyPanNumber}
                    onChange={handleFieldChange}
                    onBlur={() => markFieldTouched("companyPanNumber")}
                    placeholder="Enter  PAN number"
                    className={getInputClass("companyPanNumber", true)}
                    maxLength={getMaxLength("companyPanNumber")}
                    required
                  />
                  <FileText className="absolute text-green-600 -translate-y-1/2 left-3 top-1/2" size={20} />
                </div>
              </div>
               

              <div>
                <label className="block mb-1 text-sm font-extrabold text-gray-700">
                  State <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="addressInfo.state"
                  value={formData.addressInfo.state}
                  onChange={handleInputChange}
                  list="states"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
                  required
                />
                <datalist id="states">
                  {stateOptions.map((state) => (
                    <option key={state} value={state} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className="block mb-1 text-sm font-extrabold text-gray-700">
                  City  <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="addressInfo.city"
                  value={formData.addressInfo.city}
                  onChange={handleInputChange}
                  list="cities"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
                  required
                />
                <datalist id="cities">
                  {cities.map((city) => (
                    <option key={city} value={city} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className="block mb-1 font-extrabold text-gray-700 text-md">
                  Registered Address <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <input
                    name="registeredAddress"
                    value={formData.registeredAddress}
                    onChange={handleFieldChange}
                    onBlur={() => markFieldTouched("registeredAddress")}
                    placeholder="Enter registered address"
                    className={getInputClass("registeredAddress", true)}
                    maxLength={getMaxLength("registeredAddress")}
                    required
                  />
                  <MapPin className="absolute text-green-600 -translate-y-1/2 left-3 top-1/2 group-focus-within:animate-pulse" size={20} />
                </div>
              </div>
              <div>
                <label className="block mb-1 font-extrabold text-gray-700 text-md">
                  Garage Address <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <input
                    name="garageAddress"
                    value={formData.garageAddress}
                    onChange={handleFieldChange}
                    onBlur={() => markFieldTouched("garageAddress")}
                    placeholder="Enter garage address"
                    className={getInputClass("garageAddress", true)}
                    maxLength={getMaxLength("garageAddress")}
                    required
                  />
                  <MapPin className="absolute text-green-600 -translate-y-1/2 left-3 top-1/2 group-focus-within:animate-pulse" size={20} />
                </div>
                <button type="button" className="w-full h-10 mt-2 text-sm text-white bg-blue-500 border rounded " onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    garageAddress: prev.registeredAddress,
                  }));
                }}>
                 Add Garage Address
                </button>
              </div>
            
             
            </div>
          </div>
          {/* Documents Upload */}

          <div className="p-6 border rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50">
            <h3 className="pb-3 mb-4 text-xl font-semibold text-yellow-800 border-b">
              <span className="px-3 py-1 mr-2 text-white bg-yellow-600 rounded-md">4</span>
              Documents Upload
            </h3>
           

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
               <div>
                <label className="mb-1 font-extrabold text-gray-700 text-md">
                  Business Registration Certificate  <span className="text-red-500">*</span><p className="text-sm text-gray-500">( Incopration , Partnership deed , Gumasta,MSME)</p>
                </label>
                <div className="flex items-center gap-2 p-3 rounded-md bg-blue-50">
                  <input
                    type="file"
                    id="vendorProof"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(event) => handleFileChange(event, "vendorProof")}
                    className="hidden"
                    required={!formData.vendorProof}
                  />
                  <label htmlFor="vendorProof" className="px-4 py-2 font-extrabold text-white bg-yellow-700 rounded-md cursor-pointer hover:bg-blue-600 text-md ">
                    Choose File
                  </label>
                  {formData.vendorProof && <span className="text-sm text-gray-600">{formData.vendorProof.name}</span>}
                </div>
              </div>
             
               <div>
                <label className="block mb-1 font-extrabold text-gray-700 text-md">
                  Company Pan card <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2 p-3 rounded-md bg-blue-50">
                  <input
                    type="file"
                    id="companyPan"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(event) => handleFileChange(event, "vehicleDoc")}
                    className="hidden"
                    required={!formData.vehicleDoc}
                  />
                  <label htmlFor="companyPan" className="px-4 py-2 font-extrabold text-white bg-yellow-700 rounded-md cursor-pointer hover:bg-blue-600 text-md ">
                    Choose File
                  </label>
                  {formData.vehicleDoc && <span className="text-sm text-gray-600">{formData.vehicleDoc.name}</span>}
                </div>
              </div>
             
               <div>
                <label className="block mb-1 font-extrabold text-gray-700 text-md">
                  GST Certificate <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2 p-3 rounded-md bg-blue-50">
                  <input
                    type="file"
                    id="gstCertificate"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(event) => handleFileChange(event, "gstDoc")}
                    className="hidden"
                    required={!formData.gstDoc}
                  />
                  <label htmlFor="gstCertificate" className="px-4 py-2 font-extrabold text-white bg-yellow-700 rounded-md cursor-pointer hover:bg-blue-600 text-md ">
                    Choose File
                  </label>
                  {formData.gstDoc && <span className="text-sm text-gray-600">{formData.gstDoc.name}</span>}
                </div>
              </div>
              <div>
                <label className="block mb-1 font-extrabold text-gray-700 text-md">
                  Owner /Partner Adhar Card  <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2 p-3 rounded-md bg-blue-50">
                  <input
                    type="file"
                    id="ownerAdhar"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(event) => handleFileChange(event, "panDoc")}
                    className="hidden"
                    required={!formData.panDoc}
                  />
                  <label htmlFor="ownerAdhar" className="px-4 py-2 font-extrabold text-white bg-yellow-700 rounded-md cursor-pointer hover:bg-blue-600 text-md ">
                    Choose File
                  </label>
                  {formData.panDoc && <span className="text-sm text-gray-600">{formData.panDoc.name}</span>}
                </div>
              </div>
            </div>
          </div>
      
{/* Fleets Details  */}
        <div className="p-6 mt-8 border rounded-xl bg-red-50">
          <h3 className="pb-3 mb-6 text-xl font-semibold text-red-800 border-b">
            <span className="px-3 py-1 mr-2 text-white bg-red-600 rounded-md">5</span>
            Fleets Details 
          </h3>

            <div className="space-y-6">
          
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 bg-red-50">
                  
                 
                   <div>
                    <label className="block mb-1 font-extrabold text-gray-700 text-md">Category</label>
                    <div className="relative text-gray-600 group">
                      <select
                        name="category"
                        value={vehicleDraft.category}
                        onChange={handleVehicleChange}
                        className={getVehicleInputClass(true)}
                      >
                        <option className="text-gray-300">Select category</option>
                        {['Car', 'SUV', 'Luxury Car', 'Luxury SUV', 'Luxury Van', 'Tempo Traveller', 'Urbania', 'Mini Bus', 'Luxury Bus', 'Semi Sleeper Bus', 'Sleeper Bus','Bus with Washroom', 'Motor Home'].map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                      <Users className="absolute text-red-600 -translate-y-1/2 left-3 top-1/2 group-focus-within:animate-pulse" size={20} />
                    </div>
                  </div>
                   <div>
                     <label className="block mb-1 font-extrabold text-gray-700 text-md">
                       Seating Capacity
                     </label>
                     <div className="relative text-gray-600 group">
                       <select
                         name="seats"
                         value={vehicleDraft.seats}
                         onChange={handleVehicleChange}
                         className={`${getVehicleInputClass(true)} max-h-32 overflow-y-auto`}
                       >
                         <option value="">Select capacity</option>
                         {seatingCapacities.map((item) => (
                           <option key={item} value={item}>
                             {item}
                           </option>
                         ))}
                       </select>
                       <Users className="absolute text-red-600 -translate-y-1/2 left-3 top-1/2 group-focus-within:animate-pulse" size={20} />
                     </div>
                   </div>
                
                  <div>
                    <label className="block mb-1 font-extrabold text-gray-700 text-md">
                      Seat Configuration
                    </label>
                    <div className="relative text-gray-600 group">
                      <select
                        name="seatConfiguration"
                        value={vehicleDraft.seatConfiguration}
                        onChange={handleVehicleChange}
                        className={getVehicleInputClass(true)}
                      >
                        <option value="">Select configuration</option>
                        {seatConfigurations.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                      <Truck className="absolute text-red-600 -translate-y-1/2 left-3 top-1/2 group-focus-within:animate-pulse" size={20} />
                    </div>
                  </div>
                   <div>
                     <label className="block mb-1 font-extrabold text-gray-700 text-md">
                       Model <span className="text-red-500">*</span>
                     </label>
                     <div className="relative group">
                       <input
                         name="model"
                         value={vehicleDraft.model}
                         onChange={handleVehicleChange}
                         placeholder="e.g., Innova, XUV700"
                         className={getVehicleInputClass(true)}
                         maxLength={getVehicleMaxLength("model")}
                         required
                       />
                       <Car className="absolute text-red-600 -translate-y-1/2 left-3 top-1/2 group-focus-within:animate-pulse" size={20} />
                     </div>
                   </div>

                   <div>
                     <label className="block mb-1 font-extrabold text-gray-700 text-md">
                       Manufacture Company
                     </label>
                     <div className="relative text-gray-600 group">
                       <select
                         name="manufactureCompany"
                         value={vehicleDraft.manufactureCompany}
                         onChange={handleVehicleChange}
                         className={getVehicleInputClass(true)}
                       >
                         <option value="">Select company</option>
                         {manufactureCompanies.map((item) => (
                           <option key={item} value={item}>
                             {item}
                           </option>
                         ))}
                       </select>
                       <Building className="absolute text-red-600 -translate-y-1/2 left-3 top-1/2 group-focus-within:animate-pulse" size={20} />
                     </div>
                   </div>

                   <div>
                     <label className="block mb-1 font-extrabold text-gray-700 text-md">
                       Registeration  Year
                     </label>
                     <div className="relative group">
                       <input
                         name="year"
                         type="text"
                         value={vehicleDraft.year}
                         onChange={handleVehicleChange}
                         placeholder="e.g., 2023"
                         className={getVehicleInputClass(true)}
                         maxLength={getVehicleMaxLength("year")}
                         inputMode="numeric"
                       />
                       <Calendar className="absolute text-red-600 -translate-y-1/2 left-3 top-1/2 group-focus-within:animate-pulse" size={20} />
                     </div>
                   </div>
                  
                
                
                
                
              </div>

              

        <div className="mt-8">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Registered Vehicles</h3>
          <div className="overflow-hidden border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">S.No</th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Category</th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Seat Configuration</th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Model</th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Manufacture Company</th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Registration Year</th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Seating Capacities</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vehicles.length === 0 ? (
                  <tr>
                    <td className="px-4 py-5 text-center text-gray-500" colSpan={7}>
                      No vehicles added yet. Use "Add Vehicle" to register your fleet.
                    </td>
                  </tr>
                ) : (
                  vehicles.map((vehicle, index) => (
                    <tr key={vehicle._id}>
                      <td className="px-4 py-4 font-extrabold text-gray-900 whitespace-nowrap text-md">
                        {String(index + 1).padStart(2, '0')}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {vehicle.category}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {vehicle.type}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {vehicle.vehicleModel}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {vehicle.manufactureCompany ?? "—"}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {vehicle.year ?? "—"}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {vehicle.seats ?? "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => resetVehicleDraft()}
                  className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  disabled={savingVehicle}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleVehicleSubmit}
                  className="px-5 py-2 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-700"
                  disabled={savingVehicle}
                >
                  {savingVehicle ? "Saving..." : "Add Vehicle"}
                </button>
              </div>
            </div>
          </div>
              <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="h-16 px-8 py-3 text-xl font-semibold text-white bg-orange-600 border-2 border-gray-200 rounded-full shadow-xl hover:bg-orange-700 w-88"
              disabled={savingProfile}
            >
              {savingProfile ? "Saving..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorForm;
