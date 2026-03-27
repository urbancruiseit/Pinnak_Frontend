import React, { useState } from 'react';
import { User, Calendar, MapPin, Phone, Mail, Users, Briefcase, FileText, Building, CheckCircle2 } from 'lucide-react';
import { stateOptions, getCitiesByState } from '../../../data/statesCities';

interface DriverFormData {
  phone: string;
  email: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    email: string;
    phone: string;
    emergencyContact: string;
    bloodGroup: string;
    vendor: string;
    vendorState: string;
    vendorCity: string;
  };
  addressInfo: {
    permanentAddress: string;
    currentAddress: string;
    city: string;
    state: string;
    pincode: string;
  };
  licenseInfo: {
    licenseNumber: string;
    licenseType: string;
    issuingAuthority: string;
    issueDate: string;
    experienceDetails: string;
    expiryDate: string;
    dlFront: File | null;
    dlBack: File | null;
  };
  employmentInfo: {
    employeeId: string;
    joiningDate: string;
    designation: string;
    department: string;
    reportingManager: string;
    status: 'active' | 'inactive' | 'on-leave';
  };
  medicalInfo: {
    lastMedicalCheckup: string;
    nextMedicalDue: string;
    medicalConditions: string;
    isFit: boolean;
  };
  vehicleAssignment: {
    assignedVehicleId: string;
    assignedVehicleType: string;
    assignmentDate: string;
  };
  documents: {
    aadharCard: File | null;
    panCard: File | null;
    passportPhoto: File | null;
    experienceLetter: File | null;
  };
}

const licenseTypes = [
  'MCWG', 'MCWOG', 'LMV', 'LMV-NT', 'LMV-TR', 
  'HMV', 'HMV-TR', 'HMV-NT', 'International'
];

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const sampleVendors = [
  { name: 'Vendor A', state: 'Maharashtra', city: 'Mumbai' },
  { name: 'Vendor B', state: 'Delhi', city: 'New Delhi' },
  { name: 'Vendor C', state: 'Karnataka', city: 'Bengaluru' },
  { name: 'Vendor D', state: 'Tamil Nadu', city: 'Chennai' },
  { name: 'Vendor E', state: 'Uttar Pradesh', city: 'Lucknow' },
];

const DriverForm: React.FC = () => {
  const [formData, setFormData] = useState<DriverFormData>({
    phone: '',
    email: '',
    personalInfo: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      email: '',
      phone: '',
      emergencyContact: '',
      bloodGroup: '',
      vendor: '',
      vendorState: '',
      vendorCity: '',
    },
    addressInfo: {
      permanentAddress: '',
      currentAddress: '',
      city: '',
      state: '',
      pincode: '',
    },
    licenseInfo: {
      licenseNumber: '',
      licenseType: '',
      issuingAuthority: '',
      issueDate: '',
      experienceDetails: '',
      expiryDate: '',
      dlFront: null,
      dlBack: null,
    },
    employmentInfo: {
      employeeId: '',
      joiningDate: '',
      designation: '',
      department: '',
      reportingManager: '',
      status: 'active',
    },
    medicalInfo: {
      lastMedicalCheckup: '',
      nextMedicalDue: '',
      medicalConditions: '',
      isFit: true,
    },
    vehicleAssignment: {
      assignedVehicleId: '',
      assignedVehicleType: '',
      assignmentDate: '',
    },
    documents: {
      aadharCard: null,
      panCard: null,
      passportPhoto: null,
      experienceLetter: null,
    },
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const markFieldTouched = (field: string) => {
    setTouched({ ...touched, [field]: true });
  };

  const getMaxLength = (field: string) => {
    if (field === 'phone') return 15;
    if (field === 'email') return 50;
    return 50;
  };

  const getInputClass = (field: string, required: boolean) => {
    return `w-full pl-10 pr-3 py-2 border bg-white ${
      touched[field] && !formData[field as keyof DriverFormData] && required ? 'border-red-500' : 'border-gray-300'
    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`;
  };

  const [sameAsPermanent, setSameAsPermanent] = useState(false);
  const [cities, setCities] = useState<string[]>([]);

  React.useEffect(() => {
    const cityList = getCitiesByState(formData.addressInfo.state);
    setCities(cityList);
  }, [formData.addressInfo.state]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...(prev[section as keyof typeof prev] as any),
          [field]: checkbox.checked
        }
      }));
    } else if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...(prev[section as keyof typeof prev] as any),
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0] || null;
    const [section, field] = fieldName.split('.');

    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof typeof prev] as any),
        [field]: file
      }
    }));
  };

  const handleAddressSame = () => {
    if (!sameAsPermanent) {
      setFormData(prev => ({
        ...prev,
        addressInfo: {
          ...prev.addressInfo,
          currentAddress: prev.addressInfo.permanentAddress
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        addressInfo: {
          ...prev.addressInfo,
          currentAddress: ''
        }
      }));
    }
    setSameAsPermanent(!sameAsPermanent);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Driver Form Submitted:', formData);
    // Handle form submission with API
  };

  const renderFileUpload = (label: string, name: string, accept?: string) => (
    <div className="relative group">
      <FileText className="absolute text-blue-500 -translate-y-1/2 left-3 top-1/2 group-focus-within:animate-pulse" size={18} />
      <label className="block pl-8 mb-1 font-extrabold text-gray-700 text-md">
        {label}
      </label>
      <input
        type="file"
        onChange={(e) => handleFileChange(e, name)}
        accept={accept}
        className="w-full py-2 pl-10 pr-3 text-sm text-gray-900 bg-white border border-gray-300 rounded"
      />
    </div>
  );

  return (
    <div className="p-6 w-[165vh] mx-auto bg-white shadow-xl rounded-lg">
   

      <div className="p-4 mb-8 bg-orange-100 rounded-xl">
    <h2 className="text-2xl font-bold text-center text-orange-600">Driver Registration Form</h2>
    <p className="mt-2 text-center text-orange-700">Complete all sections to register a new driver</p>
  </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Section 1: Personal Information */}
        <div className="p-6 border rounded-xl bg-blue-50">
          <h3 className="pb-3 mb-6 text-xl font-semibold text-blue-800 border-b">
            <span className="px-3 py-1 mr-2 text-white bg-blue-600 rounded-md">1</span>
            Personal Information
          </h3>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="relative group">
              <label className="block mb-1 font-extrabold text-gray-700 text-md">
                Employee ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="employmentInfo.employeeId"
                value={formData.employmentInfo.employeeId}
                onChange={handleInputChange}
                placeholder="EMP-001"
                className="w-full py-2 pl-10 pr-3 bg-white border border-gray-300 rounded placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
              <User className="absolute text-blue-600 -translate-y-1/2 left-3 top-10 group-focus-within:animate-pulse" size={20} />
            </div>
             <div className="relative group">
              <label className="block mb-1 font-extrabold text-gray-700 text-md">
                Vendor Under <span className="text-red-500">*</span>
              </label>
              <select
                name="personalInfo.vendor"
                value={formData.personalInfo.vendor}
                onChange={(e) => {
                  const value = e.target.value;
                  handleInputChange(e);
                  const selectedVendor = sampleVendors.find(v => v.name === value);
                  if (selectedVendor) {
                    // store vendor's city/state under personalInfo only
                    setFormData(prev => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        vendorState: selectedVendor.state,
                        vendorCity: selectedVendor.city
                      }
                    }));
                  } else {
                    setFormData(prev => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        vendorState: '',
                        vendorCity: ''
                      }
                    }));
                  }
                }}
                className="w-full py-2 pl-10 pr-3 bg-white border border-gray-300 rounded  placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Select Vendor</option>
                {sampleVendors.map(vendor => (
                  <option key={vendor.name} value={vendor.name}>{vendor.name}</option>
                ))}
              </select>
              <User className="absolute text-blue-600 -translate-y-1/2 left-3 top-10 group-focus-within:animate-pulse" size={20} />
              
            </div>

            <div className="flex gap-4">
              <div>
                <label className="block mb-1 font-extrabold text-gray-700 text-md">Vendor City</label>
                <input
                  type="text"
                  name="personalInfo.vendorCity"
                  value={formData.personalInfo.vendorCity}
                  readOnly
                  className="w-full p-2.5 border border-gray-300 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block mb-1 font-extrabold text-gray-700 text-md">Vendor State</label>
                <input
                  type="text"
                  name="personalInfo.vendorState"
                  value={formData.personalInfo.vendorState}
                  readOnly
                  className="w-full p-2.5 border border-gray-300 rounded-lg bg-white"
                />
              </div>
            </div>
   
            <div className="relative group">

              <label className="block mb-1 font-extrabold text-gray-700 text-md">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="personalInfo.firstName"
                value={formData.personalInfo.firstName}
                onChange={handleInputChange}
                placeholder="Enter first name"
                className="w-full py-2 pl-10 pr-3 bg-white border border-gray-300 rounded placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
              <User className="absolute text-blue-600 -translate-y-1/2 left-3 top-10 group-focus-within:animate-pulse" size={20} />
            </div>

            <div className="relative group">
              <label className="block mb-1 font-extrabold text-gray-700 text-md">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="personalInfo.lastName"
                value={formData.personalInfo.lastName}
                onChange={handleInputChange}
                placeholder="Enter last name"
                className="w-full py-2 pl-10 pr-3 bg-white border border-gray-300 rounded placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
              <User className="absolute text-blue-600 -translate-y-1/2 left-3 top-10 group-focus-within:animate-pulse" size={20} />
            </div>

            <div className="relative group">
              <label className="block mb-1 font-extrabold text-gray-700 text-md">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="personalInfo.dateOfBirth"
                value={formData.personalInfo.dateOfBirth}
                onChange={handleInputChange}
                className="w-full py-2 pl-10 pr-3 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
              <Calendar className="absolute text-blue-600 -translate-y-1/2 left-3 top-10 group-focus-within:animate-pulse" size={20} />
           
            </div>

            <div>
              <label className="block mb-1 font-extrabold text-gray-700 text-md">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="personalInfo.gender"
                value={formData.personalInfo.gender}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
   
              </select>
            </div>
              <div>
                <label className="block mb-1 font-extrabold text-gray-700 text-md">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative group ">
                  <input
                    name="personalInfo.phone"
                    type="tel"
                    value={formData.personalInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 px-10 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter WhatsApp number"
                    inputMode="numeric"
                    required
                  />
                  <Phone className="absolute text-blue-800 -translate-y-1/2 left-3 top-1/2 group-focus-within:animate-pulse" size={20} />
                </div>
              </div>
                      <div className="relative group">

                          <label className="block mb-1 font-extrabold text-gray-700 text-md">
                            Relative Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="personalInfo.firstName"
                            value={formData.personalInfo.firstName}
                            onChange={handleInputChange}
                            placeholder="Enter relative name"
                            className="w-full py-2 pl-10 pr-3 bg-white border border-gray-300 rounded placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            required
                          />
                          <User className="absolute text-blue-600 -translate-y-1/2 left-3 top-10 group-focus-within:animate-pulse" size={20} />
                        </div>
                          <div>
                            <label className="block mb-1 font-extrabold text-gray-700 text-md">
                              Relative Mobile Number <span className="text-red-500">*</span>
                            </label>
                            <div className="relative group ">
                              <input
                                name="personalInfo.emergencyContact"
                                type="tel"
                                value={formData.personalInfo.emergencyContact}
                                onChange={handleInputChange}
                                className="w-full px-3 px-10 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter relative Mobile Number"
                                inputMode="numeric"
                                required
                              />
                              <Phone className="absolute text-blue-800 -translate-y-1/2 left-3 top-1/2 group-focus-within:animate-pulse" size={20} />
                            </div>
                          </div>
                               <div>
                                 <label className="block mb-1 font-extrabold text-gray-700 text-md">
                                    Email <span className="text-red-500">*</span>
                                 </label>
                                 <div className="relative group">
                                   <input
                                     name="personalInfo.email"
                                     type="email"
                                     value={formData.personalInfo.email}
                                     onChange={handleInputChange}
                                     className="w-full px-3 px-10 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                     placeholder="Enter email address"
                                     required
                                   />
                                   <Mail className="absolute text-blue-600 -translate-y-1/2 left-3 top-1/2 group-focus-within:animate-pulse" size={20} />
                                 </div>
                               </div>
            <div>
              <label className="block mb-1 font-extrabold text-gray-700 text-md">
                Blood Group
              </label>
              <select
                name="personalInfo.bloodGroup"
                value={formData.personalInfo.bloodGroup}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select</option>
                {bloodGroups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>

          </div>
        </div>

        
        {/* Section 2: Address Information */}
        <div className="p-6 border rounded-xl bg-green-50">
          <h3 className="pb-3 mb-6 text-xl font-semibold text-green-800 border-b">
            <span className="px-3 py-1 mr-2 text-white bg-green-600 rounded-md">3</span>
            Address Information
          </h3>
          
          <div className="space-y-4">
            <div className="relative group">
              <label className="block mb-1 font-extrabold text-gray-700 text-md">
                Permanent Address <span className="text-red-500">*</span>
              </label>
              <input
                name="addressInfo.permanentAddress"
                value={formData.addressInfo.permanentAddress}
                onChange={handleInputChange}
               
                placeholder="Enter permanent address"
                className="w-full py-2 pl-10 pr-3 bg-white border border-gray-300 rounded placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
              <MapPin className="absolute text-green-600 -translate-y-1/2 left-3 top-10 group-focus-within:animate-pulse" size={20} />
            </div>

            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="sameAddress"
                checked={sameAsPermanent}
                onChange={handleAddressSame}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label htmlFor="sameAddress" className="ml-2 text-sm text-gray-700">
                Same as Permanent Address
              </label>
            </div>

            <div className="relative group">
              <label className="block mb-1 font-extrabold text-gray-700 text-md">
                Current Address <span className="text-red-500">*</span>
              </label>
              <input
                name="addressInfo.currentAddress"
                value={formData.addressInfo.currentAddress}
                onChange={handleInputChange}
           
                placeholder="Enter current address"
                className="w-full py-2 pl-10 pr-3 bg-white border border-gray-300 rounded placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
                disabled={sameAsPermanent}
              />
              <MapPin className="absolute text-green-600 -translate-y-1/2 left-3 top-10 group-focus-within:animate-pulse" size={20} />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
               <div>
                             <label className="block mb-1 font-extrabold text-gray-700 text-md">
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
                             <label className="block mb-1 font-extrabold text-gray-700 text-md">
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
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="addressInfo.pincode"
                  value={formData.addressInfo.pincode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: License Information */}
        <div className="p-6 border rounded-xl bg-orange-100/50">
          <h3 className="pb-3 mb-6 text-xl font-semibold text-orange-600 border-b border-orange-800">
            <span className="px-3 py-1 mr-2 text-white bg-orange-600 rounded-md">4</span>
            Driving License Information
          </h3>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="relative group">
              <label className="block mb-1 font-extrabold text-gray-700 text-md">
                License Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="licenseInfo.licenseNumber"
                value={formData.licenseInfo.licenseNumber}
                onChange={handleInputChange}
                placeholder="Enter license number"
                className="w-full py-2 pl-10 pr-3 bg-white border border-gray-300 rounded placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-green-500"
                required
              />
              <FileText className="absolute text-yellow-600 -translate-y-1/2 left-3 top-10 group-focus-within:animate-pulse" size={20} />
            </div>

            <div className="relative group">
              <label className="block mb-1 font-extrabold text-gray-700 text-md">
                License Type <span className="text-red-500">*</span>
              </label>
              <select
                name="licenseInfo.licenseType"
                value={formData.licenseInfo.licenseType}
                onChange={handleInputChange}
                className="w-full py-2 pl-10 pr-3 bg-white border border-gray-300 rounded placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Select Type</option>
                {licenseTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <FileText className="absolute text-yellow-600 -translate-y-1/2 left-3 top-10 group-focus-within:animate-pulse" size={20} />
            </div>

            <div className="relative group">
              <label className="block mb-1 font-extrabold text-gray-700 text-md">
                Issuing Authority <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="licenseInfo.issuingAuthority"
                value={formData.licenseInfo.issuingAuthority}
                onChange={handleInputChange}
                placeholder="Enter issuing authority"
                className="w-full py-2 pl-10 pr-3 bg-white border border-gray-300 rounded placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
              <FileText className="absolute text-yellow-600 -translate-y-1/2 left-3 top-10 group-focus-within:animate-pulse" size={20} />
            </div>

            <div className="relative group">
              <label className="block mb-1 font-extrabold text-gray-700 text-md">
                Issue Date<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="licenseInfo.issueDate"
                value={formData.licenseInfo.issueDate}
                onChange={handleInputChange}
                className="w-full py-2 pl-10 pr-3 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
              <Calendar className="absolute text-yellow-600 -translate-y-1/2 left-3 top-10 group-focus-within:animate-pulse" size={20} />
              
            </div>

            <div className="relative group">
              <label className="block mb-1 font-extrabold text-gray-700 text-md">
                Expiry Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="licenseInfo.expiryDate"
                value={formData.licenseInfo.expiryDate}
                onChange={handleInputChange}
                className="w-full py-2 pl-10 pr-3 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
              <Calendar className="absolute text-yellow-600 -translate-y-1/2 left-3 top-10 group-focus-within:animate-pulse" size={20} />
          
            </div>

            <div className="relative group">
              <label className="block mb-1 font-extrabold text-gray-700 text-md">
                Experience Year  <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="licenseInfo.experienceDetails"
                value={formData.licenseInfo.experienceDetails}
                onChange={handleInputChange}
                className="w-full py-2 pl-10 pr-3 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
              <Calendar className="absolute text-yellow-600 -translate-y-1/2 left-3 top-10 group-focus-within:animate-pulse" size={20} />
           
            </div>
          
          </div>
        </div>

    
      

       
        
          <div className="p-6 border rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50">
            <h3 className="pb-3 mb-4 text-xl font-semibold text-yellow-800 border-b">
              <span className="px-3 py-1 mr-2 text-white bg-yellow-600 rounded-md">5</span>
              Documents Upload
            </h3>
           

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
               <div>
                <label className="block mb-1 font-extrabold text-gray-700 text-md">
                  License Front Photo <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2 p-3 rounded-md bg-blue-50">
                  <input
                    type="file"
                    id="dlFront"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(event) => handleFileChange(event, "licenseInfo.dlFront")}
                    className="hidden"
                    required={!formData.licenseInfo.dlFront}
                  />
                  <label htmlFor="dlFront" className="px-4 py-2 font-extrabold text-white bg-yellow-700 rounded-md cursor-pointer hover:bg-yellow-500 text-md ">
                 Choose File
                  </label>
                  {formData.licenseInfo.dlFront && <span className="text-sm text-gray-600">{formData.licenseInfo.dlFront.name}</span>}
                </div>
              </div>
              <div>
                <label className="block mb-1 font-extrabold text-gray-700 text-md">
                 License Back Photo<span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2 p-3 rounded-md bg-blue-50">
                  <input
                    type="file"
                    id="dlBack"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(event) => handleFileChange(event, "licenseInfo.dlBack")}
                    className="hidden"
                    required={!formData.licenseInfo.dlBack}
                  />
                  <label htmlFor="dlBack" className="px-4 py-2 font-extrabold text-white bg-yellow-700 rounded-md cursor-pointer hover:bg-yellow-500 text-md ">
              Choose File
                  </label>
                  {formData.licenseInfo.dlBack && <span className="text-sm text-gray-600">{formData.licenseInfo.dlBack.name}</span>}
                </div>
              </div>
               <div>
                <label className="mb-1 font-extrabold text-gray-700  text-md">
                     Aadhar Card  <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2 p-3 rounded-md bg-blue-50">
                  <input
                    type="file"
                    id="aadharCard"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(event) => handleFileChange(event, "documents.aadharCard")}
                    className="hidden"
                    required={!formData.documents.aadharCard}
                  />
                  <label htmlFor="aadharCard" className="px-4 py-2 font-extrabold text-white bg-yellow-700 rounded-md cursor-pointer hover:bg-yellow-500 text-md ">
       Choose File
                  </label>
                  {formData.documents.aadharCard && <span className="text-sm text-gray-600">{formData.documents.aadharCard.name}</span>}
                </div>
              </div>
             
               <div>
                <label className="block mb-1 font-extrabold text-gray-700 text-md">
                 Pan card <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2 p-3 rounded-md bg-blue-50">
                  <input
                    type="file"
                    id="panCard"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(event) => handleFileChange(event, "documents.panCard")}
                    className="hidden"
                    required={!formData.documents.panCard}
                  />
                  <label htmlFor="panCard" className="px-4 py-2 font-extrabold text-white bg-yellow-700 rounded-md cursor-pointer hover:bg-yellow-500 text-md ">
                   Choose File
                  </label>
                  {formData.documents.panCard && <span className="text-sm text-gray-600">{formData.documents.panCard.name}</span>}
                </div>
              </div>
             
            
             
            </div>
          </div>

        {/* Submit Button */}
        <div className="flex justify-center gap-4 pt-6 border-t">
        
          <button
            type="submit"
            className="h-16 px-8 py-3 text-xl font-semibold text-white bg-orange-600 border-2 border-gray-200 rounded-full shadow-xl hover:bg-orange-700 w-88"
          >
            Submit Driver Registration
          </button>
        </div>
      </form>
    </div>
  );
};

export default DriverForm;