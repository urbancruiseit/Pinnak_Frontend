import React, { useState } from 'react';
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
  Plus,
} from "lucide-react";
import {
  departmentData,
  getDesignationsByDepartment,
  getRolesByDepartment,
  getAllDepartments,
} from "@/data/departmentData";

interface EmployeeFormData {
  personalInfo: {
    employeeId: string;
    firstName: string;
    middleName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    maritalStatus: string;
    nationality: string;
    bloodGroup: string;
  };
  contactInfo: {
    personalEmail: string;
    officialEmail: string;
    mobile: string;
    alternateMobile: string;
    emergencyContact: string;
    emergencyContactRelation: string;
  };
  addressInfo: {
    permanentAddress: string;
    currentAddress: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  employmentInfo: {
    department: string;
    designation: string;
    role: string;
    employeeType: string;
    joiningDate: string;
    confirmationDate: string;
    workLocation: string;
    reportingManager: string;
    hrManager: string;
    employmentStatus: string;
    grade: string;
    probationTenure?: string;
    noticePeriod?: string;
  };
  officialInfo: {
    workShift: string;
    workTimings: string;
    weeklyOff: string;
    leavePolicy: string;
    probationPeriod: string;
    noticePeriod: string;
    ctc: string;
    basicSalary: string;
    pfNumber: string;
    esicNumber: string;
    uanNumber: string;
  };
  bankInfo: {
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
    ifscCode: string;
    branchName: string;
    accountType: string;
  };
  educationInfo: Array<{
    id: number;
    qualification: string;
    institution: string;
    university: string;
    yearOfPassing: string;
    percentage: string;
  }>;
  experienceInfo: Array<{
    id: number;
    company: string;
    designation: string;
    fromDate: string;
    toDate: string;
    duration: string;
    reasonForLeaving: string;
  }>;
  documents: {
    aadharCard: File | null;
    panCard: File | null;
    passportPhoto: File | null;
    resume: File | null;
    experienceLetters: File | null;
    educationalCertificates: File | null;
    relievingLetter: File | null;
  };
  familyInfo: Array<{
    id: number;
    name: string;
    relation: string;
    dateOfBirth: string;
    contact: string;
    occupation: string;
  }>;
}

const genderOptions = ['Male', 'Female'];
const maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widow'];
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const employeeTypes = ['Permanent', 'Contract', 'Intern', 'Probation'];
const employmentStatusOptions = ['Active', 'On Notice', 'Terminated', 'Resigned', 'Absconding'];
const departments = getAllDepartments();

const workShifts = [ 'Morning', 'Evening', 'Night', 'Rotational'];
const accountTypes = ['Savings', 'Current', 'Salary'];
const Grade = ['L 1', 'L 2', 'L 3', 'L 4', 'L 5', 'L 6', 'L 7', 'L 8', 'L 9'];

const EmployeeForm: React.FC = () => {
  const [availableDesignations, setAvailableDesignations] = useState<string[]>([]);
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);

  const [formData, setFormData] = useState<EmployeeFormData>({
    personalInfo: {
      employeeId: '',
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      maritalStatus: '',
      nationality: 'Indian',
      bloodGroup: '',
    },
    contactInfo: {
      personalEmail: '',
      officialEmail: '',
      mobile: '',
      alternateMobile: '',
      emergencyContact: '',
      emergencyContactRelation: '',
    },
    addressInfo: {
      permanentAddress: '',
      currentAddress: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
    },
    employmentInfo: {
      department: '',
      designation: '',
      role: '',
      employeeType: '',
      joiningDate: '',
      confirmationDate: '',
      workLocation: '',
      reportingManager: '',
      hrManager: '',
      employmentStatus: 'Active',
      grade: '',
      probationTenure: '',
      noticePeriod: '',
    },
    officialInfo: {
      workShift: 'General',
      workTimings: '00:00 AM - 00:00 PM',
      weeklyOff: 'Sunday',
      leavePolicy: 'Standard',
      probationPeriod: '6 Months',
      noticePeriod: '2 Months',
      ctc: '',
      basicSalary: '',
      pfNumber: '',
      esicNumber: '',
      uanNumber: '',
    },
    bankInfo: {
      bankName: '',
      accountNumber: '',
      accountHolderName: '',
      ifscCode: '',
      branchName: '',
      accountType: 'Savings',
    },
    educationInfo: [],
    experienceInfo: [],
    documents: {
      aadharCard: null,
      panCard: null,
      passportPhoto: null,
      resume: null,
      experienceLetters: null,
      educationalCertificates: null,
      relievingLetter: null,
    },
    familyInfo: [],
  });

  const [newEducation, setNewEducation] = useState({
    qualification: '',
    institution: '',
    university: '',
    yearOfPassing: '',
    percentage: '',
  });

  const [newExperience, setNewExperience] = useState({
    company: '',
    designation: '',
    fromDate: '',
    toDate: '',
    duration: '',
    reasonForLeaving: '',
  });

  const [newFamilyMember, setNewFamilyMember] = useState({
    name: '',
    relation: '',
    dateOfBirth: '',
    contact: '',
    occupation: '',
  });


  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof EmployeeFormData],
          [field]: value
        }
      }));

      if (name === 'employmentInfo.department') {
        const designations = getDesignationsByDepartment(value);
        const roles = getRolesByDepartment(value);
        setAvailableDesignations(designations);
        setAvailableRoles(roles);
        // Reset designation and role when department changes
        setFormData(prev => ({
          ...prev,
          employmentInfo: {
            ...prev.employmentInfo,
            designation: '',
            role: ''
          }
        }));
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0] || null;
    const [section, field] = fieldName.split('.');
    
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof EmployeeFormData],
        [field]: file
      }
    }));
  };

  const handleAddEducation = () => {
    if (newEducation.qualification && newEducation.institution) {
      const educationWithId = {
        ...newEducation,
        id: Date.now()
      };
      
      setFormData(prev => ({
        ...prev,
        educationInfo: [...prev.educationInfo, educationWithId]
      }));
      
      setNewEducation({
        qualification: '',
        institution: '',
        university: '',
        yearOfPassing: '',
        percentage: '',
      });
    }
  };

  const handleAddExperience = () => {
    if (newExperience.company && newExperience.designation) {
      const experienceWithId = {
        ...newExperience,
        id: Date.now()
      };
      
      setFormData(prev => ({
        ...prev,
        experienceInfo: [...prev.experienceInfo, experienceWithId]
      }));
      
      setNewExperience({
        company: '',
        designation: '',
        fromDate: '',
        toDate: '',
        duration: '',
        reasonForLeaving: '',
      });
    }
  };

  const handleAddFamilyMember = () => {
    if (newFamilyMember.name && newFamilyMember.relation) {
      const familyWithId = {
        ...newFamilyMember,
        id: Date.now()
      };
      
      setFormData(prev => ({
        ...prev,
        familyInfo: [...prev.familyInfo, familyWithId]
      }));
      
      setNewFamilyMember({
        name: '',
        relation: '',
        dateOfBirth: '',
        contact: '',
        occupation: '',
      });
    }
  };

  const handleRemoveEducation = (id: number) => {
    setFormData(prev => ({
      ...prev,
      educationInfo: prev.educationInfo.filter(edu => edu.id !== id)
    }));
  };

  const handleRemoveExperience = (id: number) => {
    setFormData(prev => ({
      ...prev,
      experienceInfo: prev.experienceInfo.filter(exp => exp.id !== id)
    }));
  };

  const handleRemoveFamilyMember = (id: number) => {
    setFormData(prev => ({
      ...prev,
      familyInfo: prev.familyInfo.filter(member => member.id !== id)
    }));
  };

  // Removed handleSubmit function to eliminate backend functionality

  const renderFileUpload = (label: string, name: string, accept?: string) => (
    <div className="bg-gray-50 p-4 rounded-lg border">
      <label className="block text-sm font-extrabold text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="file"
        onChange={(e) => handleFileChange(e, name)}
        accept={accept}
        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
    </div>
  );

  return (
    <div className="p-6 w-[165vh] mx-auto bg-white shadow-xl rounded-lg">
    <div className="mb-8 items-center bg-orange-100 p-4 rounded-xl w-120 h-14 mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center  text-orange-500">HR Subminsion Employee Form</h2>
        <p className="text-gray-600 text-center mb-10">Complete all sections to register a new employee </p>
      </div>
<div className="space-y-8 mb-6">

        {/* Section 1: Personal Information */}
        <div className="border rounded-xl p-6 bg-blue-50">
          <h3 className="text-xl font-semibold text-blue-800 mb-6 pb-3 border-b border-blue-200">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-md mr-2">1</span>
            Personal Information  <span className="text-red-600">*</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                Employee ID <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="personalInfo.employeeId"
                value={formData.personalInfo.employeeId}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
                required
                placeholder="EMP-001"
              />
              <Users className="absolute left-3 top-11 -translate-y-1/2 text-purple-600 pointer-events-none" size={20} />
            </div>

            <div className="relative group">
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                First Name  <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="personalInfo.firstName"
                value={formData.personalInfo.firstName}
                onChange={handleInputChange}
                placeholder="Enter First Name"
                className="w-full p-2.5 border text-right border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
                required
              />
                 <Users className="absolute left-3 top-11 -translate-y-1/2 text-purple-600 pointer-events-none" size={20} />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                Middle Name
              </label>
              <input
                type="text"
                name="personalInfo.middleName"
                value={formData.personalInfo.middleName}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
              />
                 <Users className="absolute left-3 top-11 -translate-y-1/2 text-purple-600 pointer-events-none" size={20} />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                Last Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="personalInfo.lastName"
                value={formData.personalInfo.lastName}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white  focus:border-blue-500"
                required
              />
                 <Users className="absolute left-3 top-11 -translate-y-1/2 text-purple-600 pointer-events-none" size={20} />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                Date of Birth  
              </label>
              <input
                type="date"
                name="personalInfo.dateOfBirth"
                value={formData.personalInfo.dateOfBirth}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500  bg-white focus:border-blue-500"
                required
              />
                 <Users className="absolute left-3 top-11 -translate-y-1/2 text-purple-600 pointer-events-none" size={20} />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                Gender  <span className="text-red-600">*</span>
              </label>
              <select
                name="personalInfo.gender"
                value={formData.personalInfo.gender}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
                required
              >
                <option value="">Select</option>
                {genderOptions.map(gender => (
                  <option key={gender} value={gender}>{gender}</option>
                ))}
              </select>
                 <Users className="absolute left-3 top-11 -translate-y-1/2 text-purple-600 pointer-events-none" size={20} />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                Marital Status  <span className="text-red-600">*</span>
              </label>
              <select
                name="personalInfo.maritalStatus"
                value={formData.personalInfo.maritalStatus}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white  focus:border-blue-500"
              >
                <option value="">Select</option>
                {maritalStatusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
                 <Users className="absolute left-3 top-11 -translate-y-1/2 text-purple-600 pointer-events-none" size={20} />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                Blood Group
              </label>
              <select
                name="personalInfo.bloodGroup"
                value={formData.personalInfo.bloodGroup}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500  bg-white focus:border-blue-500"
              >
                <option value="">Select</option>
                {bloodGroups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
                 <Users className="absolute left-3 top-11 -translate-y-1/2 text-purple-600 pointer-events-none" size={20} />
            </div>
          </div>
        </div>

        {/* Section 2: Contact Information */}
        <div className="border rounded-xl p-6 bg-green-50">
          <h3 className="text-xl font-semibold text-green-800 mb-6 pb-3 border-b border-green-200">
            <span className="bg-green-600 text-white px-3 py-1 rounded-md mr-2">2</span>
            Contact Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                Personal Email  <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                name="contactInfo.personalEmail"
                value={formData.contactInfo.personalEmail}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
                required
              />
                 <Users className="absolute left-3 top-11 -translate-y-1/2 text-purple-600 pointer-events-none" size={20} />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                Official Email  <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                name="contactInfo.officialEmail"
                value={formData.contactInfo.officialEmail}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500  bg-white focus:border-blue-500"
                required
              />   <Users className="absolute left-3 top-11 -translate-y-1/2 text-purple-600 pointer-events-none" size={20} />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                Mobile Number  <span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                name="contactInfo.mobile"
                value={formData.contactInfo.mobile}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
                required
              />   <Users className="absolute left-3 top-11 -translate-y-1/2 text-purple-600 pointer-events-none" size={20} />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                Alternate Mobile  <span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                name="contactInfo.alternateMobile"
                value={formData.contactInfo.alternateMobile}
                onChange={handleInputChange}
                required
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
              />   <Users className="absolute left-3 top-11 -translate-y-1/2 text-purple-600 pointer-events-none" size={20} />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                Emergency Contact  <span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                name="contactInfo.emergencyContact"
                value={formData.contactInfo.emergencyContact}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500  bg-white focus:border-blue-500"
                required
              />   <Users className="absolute left-3 top-11 -translate-y-1/2 text-purple-600 pointer-events-none" size={20} />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                Relationship
              </label>
              <input
                type="text"
                name="contactInfo.emergencyContactRelation"
                value={formData.contactInfo.emergencyContactRelation}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
                placeholder="Father, Mother, Spouse"
              />   <Users className="absolute left-3 top-11 -translate-y-1/2 text-purple-600 pointer-events-none" size={20} />
            </div>
          </div>
        </div>

        {/* Section 3: Address Information */}
        <div className="border rounded-xl p-6 bg-yellow-50">
          <h3 className="text-xl font-semibold text-yellow-800 mb-6 pb-3 border-b border-yellow-200">
            <span className="bg-yellow-600 text-white px-3 py-1 rounded-md mr-2">3</span>
            Address Information  <span className="text-red-600">*</span>
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                Permanent Address  <span className="text-red-600">*</span>
              </label>
              <input
                name="addressInfo.permanentAddress"
                value={formData.addressInfo.permanentAddress}
                onChange={handleInputChange}
                
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
                required
              />   <Users className="absolute left-3 top-11 -translate-y-1/2 text-purple-600 pointer-events-none" size={20} />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                Current Address  <span className="text-red-600">*</span>
              </label>
              <input
                name="addressInfo.currentAddress"
                value={formData.addressInfo.currentAddress}
                onChange={handleInputChange}
               
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
                required
              />   <Users className="absolute left-3 top-11 -translate-y-1/2 text-purple-600 pointer-events-none" size={20} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-extrabold text-gray-700 mb-1">
                  City  <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="addressInfo.city"
                  value={formData.addressInfo.city}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
                  required
                />   <Users className="absolute left-3 top-11 -translate-y-1/2 text-purple-600 pointer-events-none" size={20} />
              </div>

              <div>
                <label className="block text-sm font-extrabold text-gray-700 mb-1">
                  State <span className="text-red-600">*</span> 
                </label>
                <input
                  type="text"
                  name="addressInfo.state"
                  value={formData.addressInfo.state}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
                  required
                />   <Users className="absolute left-3 top-11 -translate-y-1/2 text-purple-600 pointer-events-none" size={20} />
              </div>

              <div>
                <label className="block text-sm font-extrabold text-gray-700 mb-1">
                  Pincode  <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="addressInfo.pincode"
                  value={formData.addressInfo.pincode}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
                  required
                />   <Users className="absolute left-3 top-11 -translate-y-1/2 text-purple-600 pointer-events-none" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Employment Information */}
        <div className="border rounded-xl p-6 bg-purple-50">
          <h3 className="text-xl font-semibold text-purple-800 mb-6 pb-3 border-b border-purple-200">
            <span className="bg-purple-600 text-white px-3 py-1 rounded-md mr-2">4</span>
            Employment Details  <span className="text-red-600">*</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                Department  <span className="text-red-600">*</span>
              </label>
              <select
                name="employmentInfo.department"
                value={formData.employmentInfo.department}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500  bg-white focus:border-blue-500"
                required
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>   <Users className="absolute left-3 top-11 -translate-y-1/2 text-purple-600 pointer-events-none" size={20} />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                Designation  <span className="text-red-600">*</span>
              </label>
              <select
                name="employmentInfo.designation"
                value={formData.employmentInfo.designation}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
                required
              >
                <option value="">Select Designation</option>
                {availableDesignations.map(desig => (
                  <option key={desig} value={desig}>{desig}</option>
                ))}
              </select>   <Users className="absolute left-3 top-11 -translate-y-1/2 text-purple-600 pointer-events-none" size={20} />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                Role
              </label>
              <select
                name="employmentInfo.role"
                value={formData.employmentInfo.role}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
              >
                <option value="">Select Role</option>
                {availableRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>   <Users className="absolute left-3 top-11 -translate-y-1/2 text-purple-600 pointer-events-none" size={20} />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                Employee Type  <span className="text-red-600">*</span>
              </label>
              <select
                name="employmentInfo.employeeType"
                value={formData.employmentInfo.employeeType}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
                required
              >
                <option value="">Select Type</option>
                {employeeTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>   <Users className="absolute left-3 top-11 -translate-y-1/2 text-purple-600 pointer-events-none" size={20} />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                Joining Date <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                name="employmentInfo.joiningDate"
                value={formData.employmentInfo.joiningDate}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
                required
              />   <Users className="absolute left-3 top-11 -translate-y-1/2 text-purple-600 pointer-events-none" size={20} />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                Confirmation Date 
              </label>
              <input
                type="date"
                name="employmentInfo.confirmationDate"
                value={formData.employmentInfo.confirmationDate}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
              />   <Users className="absolute left-3 top-11 -translate-y-1/2 text-purple-600 pointer-events-none" size={20} />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                Work Location  <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="employmentInfo.workLocation"
                value={formData.employmentInfo.workLocation}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
                required
                placeholder="e.g., Mumbai HQ"
              />   <Users className="absolute left-3 top-11 -translate-y-1/2 text-purple-600 pointer-events-none" size={20} />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                Reporting Manager 
              </label>
              <input
                type="text"
                name="employmentInfo.reportingManager"
                value={formData.employmentInfo.reportingManager}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
              />   <Users className="absolute left-3 top-11 -translate-y-1/2 text-purple-600 pointer-events-none" size={20} />
            </div>

            <div className="relative group">
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                Employee Status
              </label>
              <select
                name="employmentInfo.employmentStatus"
                value={formData.employmentInfo.employmentStatus}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
              >
                {employmentStatusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>   
              <Users className="absolute left-3 top-11 -translate-y-1/2 text-purple-600 pointer-events-none" size={20} />
            </div>
            <div className="relative">
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                Grade <span className="text-gray-400">*</span>
              </label>
              <select
                name="employmentInfo.grade"
                value={(formData.employmentInfo as any).grade || ''}
                onChange={handleInputChange}
                className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
              >
                <option value="">Select Grade</option>
                {Grade.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <Star className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600 pointer-events-none" size={18} />
            </div>
            <div className="relative">
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                Notice Period
              </label>
              <input
                type="text"
                name="employmentInfo.noticePeriod"
                value={formData.employmentInfo.noticePeriod}
                onChange={handleInputChange}
                className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
                placeholder="e.g., 2 Months"
              />
              <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600 pointer-events-none" size={18} />
            </div>
            <div className="relative">
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                Probation Tenure 
              </label>
              <input
                type="text"
                name="employmentInfo.probationTenure"
                value={formData.employmentInfo.probationTenure}
                onChange={handleInputChange}
                className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
                placeholder="e.g., 6 Months"
              />
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600 pointer-events-none" size={18} />
            </div>
            
              
              

          </div>
        </div>
           {/* Section : Refrence DETAILS */}
        <div className="border rounded-xl p-6 bg-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-700">
            <span className="bg-gray-700 text-white px-3 py-1 rounded-md mr-2">5</span>
            Reference Details  <span className="text-red-600">*</span>
          </h3>
          
          <div className="space-y-4">
            <div className="grid   lg:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-extrabold text-gray-700 mb-1">
                  Reference Name  <span className="text-red-600">*</span>
                </label>
              <input
                type="text"
                placeholder="Name"
                value={newFamilyMember.name}
                onChange={(e) => setNewFamilyMember({...newFamilyMember, name: e.target.value})}
                   className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
              />
              </div>
              <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-1"> 
                Refrance Roll  <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                placeholder="Role"
                value={newFamilyMember.relation}
                onChange={(e) => setNewFamilyMember({...newFamilyMember, relation: e.target.value})}
                className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
              />
              </div>
              <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-1"> 
               Refrance Contact  <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                placeholder="Contact"
                value={newFamilyMember.contact}
                onChange={(e) => setNewFamilyMember({...newFamilyMember, contact: e.target.value})}
               className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
              />
              </div>
             
          
            </div>
            </div>
            </div>
          
            
        {/* Section 6: Official Information */}
        <div className="border rounded-xl p-6 bg-pink-50">
          <h3 className="text-xl font-semibold text-pink-800 mb-6 pb-3 border-b border-pink-200">
            <span className="bg-pink-600 text-white px-3 py-1 rounded-md mr-2">6</span>
            Official Information  <span className="text-red-600">*</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                Work Shift
              </label>
              <select
                name="officialInfo.workShift"
                value={formData.officialInfo.workShift}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
              >
                {workShifts.map(shift => (
                  <option key={shift} value={shift}>{shift}</option>
                ))}
              </select>   <Users className="absolute left-3 top-11 -translate-y-1/2 text-purple-600 pointer-events-none" size={20} />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                Work Timings
              </label>
              <input
                type="text"
                name="officialInfo.workTimings"
                value={formData.officialInfo.workTimings}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
              />   <Users className="absolute left-3 top-11 -translate-y-1/2 text-purple-600 pointer-events-none" size={20} />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                Weekly Off
              </label>
              <input
                type="text"
                name="officialInfo.weeklyOff"
                value={formData.officialInfo.weeklyOff}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
              />   <Users className="absolute left-3 top-11 -translate-y-1/2 text-purple-600 pointer-events-none" size={20} />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                CTC (₹)
              </label>
              <input
                type="text"
                name="officialInfo.ctc"
                value={formData.officialInfo.ctc}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
                placeholder="e.g., 8,00,000"
              />   <Users className="absolute left-3 top-11 -translate-y-1/2 text-purple-600 pointer-events-none" size={20} />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                Basic Salary (₹)
              </label>
              <input
                type="text"
                name="officialInfo.basicSalary"
                value={formData.officialInfo.basicSalary}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
                placeholder="e.g., 4,00,000"
              />   <Users className="absolute left-3 top-11 -translate-y-1/2 text-purple-600 pointer-events-none" size={20} />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                PF Number
              </label>
              <input
                type="text"
                name="officialInfo.pfNumber"
                value={formData.officialInfo.pfNumber}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
              />   <Users className="absolute left-3 top-11 -translate-y-1/2 text-purple-600 pointer-events-none" size={20} />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                ESIC Number
              </label>
              <input
                type="text"
                name="officialInfo.esicNumber"
                value={formData.officialInfo.esicNumber}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
              />   <Users className="absolute left-3 top-11 -translate-y-1/2 text-purple-600 pointer-events-none" size={20} />
            </div> 
            
             <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                UAN Number
              </label>
              <input
                type="text"
                name="officialInfo.uanNumber"
                value={formData.officialInfo.uanNumber}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
              />   <Users className="absolute left-3 top-11 -translate-y-1/2 text-purple-600 pointer-events-none" size={20} />
            </div> 
          </div>
        </div>

        {/* Section 7: Bank Information */}
        <div className="border rounded-xl p-6 bg-indigo-50">
          <h3 className="text-xl font-semibold text-indigo-800 mb-6 pb-3 border-b border-indigo-200">
            <span className="bg-indigo-600 text-white px-3 py-1 rounded-md mr-2">7</span>
            Bank Account Details  <span className="text-red-600">*</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                Bank Name  <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="bankInfo.bankName"
                value={formData.bankInfo.bankName}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
                required
              />   <Users className="absolute left-3 top-11 -translate-y-1/2 text-purple-600 pointer-events-none" size={20} />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                Account Number  <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="bankInfo.accountNumber"
                value={formData.bankInfo.accountNumber}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
                required
              />   <Users className="absolute left-3 top-11 -translate-y-1/2 text-purple-600 pointer-events-none" size={20} />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                Account Holder Name  <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="bankInfo.accountHolderName"
                value={formData.bankInfo.accountHolderName}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
                required
              />   <Users className="absolute left-3 top-11 -translate-y-1/2 text-purple-600 pointer-events-none" size={20} />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                IFSC Code  <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="bankInfo.ifscCode"
                value={formData.bankInfo.ifscCode}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
                required
              />   <Users className="absolute left-3 top-11 -translate-y-1/2 text-purple-600 pointer-events-none" size={20} />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                Branch Name  <span className="text-red-600">*</span>s
              </label>
              <input
                type="text"
                name="bankInfo.branchName"
                value={formData.bankInfo.branchName}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
                required
              />   <Users className="absolute left-3 top-11 -translate-y-1/2 text-purple-600 pointer-events-none" size={20} />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                Account Type  <span className="text-red-600">*</span>
              </label>
              <select
                name="bankInfo.accountType"
                value={formData.bankInfo.accountType}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
                required
              >
                {accountTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>   <Users className="absolute left-3 top-11 -translate-y-1/2 text-purple-600 pointer-events-none" size={20} />
            </div>
            <div className="relative">
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                UPI ID
              </label>
              <input
                type="text"
                name="bankInfo.upiId"
                value={(formData.bankInfo as any).upiId || ''}
                onChange={handleInputChange}
                className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white focus:border-blue-500"
                placeholder="e.g., user@upi"
              />
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600 pointer-events-none" size={18} />
            </div>

            <div className="relative">
              <label className="block text-sm font-extrabold text-gray-700 mb-1">
                Bank Passbook / QR (upload)
              </label>
              <input
                type="file"
                name="bankInfo.passbookOrQr"
                onChange={(e) => handleFileChange(e, 'bankInfo.passbookOrQr')}
                accept="image/*,.pdf"
                className="w-full text-sm bg-white left-4 text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600 pointer-events-none" size={18} />
            </div>
            
          </div>
        </div>

        {/* Section 8: Education Information */}
        <div className="border rounded-xl p-6 bg-orange-50">
          <h3 className="text-xl font-semibold text-orange-800 mb-6 pb-3 border-b border-orange-200">
            <span className="bg-orange-600 text-white px-3 py-1 rounded-md mr-2">8</span>
            Educational Qualifications  <span className="text-red-600">*</span>
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              <input
                type="text"
                placeholder="Qualification"
                value={newEducation.qualification}
                onChange={(e) => setNewEducation({...newEducation, qualification: e.target.value})}
                className="p-2 border rounded bg-white"
              />
              <input
                type="text"
                placeholder="Institution"
                value={newEducation.institution}
                onChange={(e) => setNewEducation({...newEducation, institution: e.target.value})}
                className="p-2 border rounded bg-white"
              />
              <input
                type="text"
                placeholder="University"
                value={newEducation.university}
                onChange={(e) => setNewEducation({...newEducation, university: e.target.value})}
                className="p-2 border rounded bg-white"
              />
              <input
                type="text"
                placeholder="Year"
                value={newEducation.yearOfPassing}
                onChange={(e) => setNewEducation({...newEducation, yearOfPassing: e.target.value})}
                className="p-2 border rounded bg-white"
              />
              <input
                type="text"
                placeholder="Percentage"
                value={newEducation.percentage}
                onChange={(e) => setNewEducation({...newEducation, percentage: e.target.value})}
                className="p-2 border rounded bg-white"
              />
            </div>
            
            <button
              type="button"
              onClick={handleAddEducation}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            >
              + Add Education
            </button>

            {formData.educationInfo.length > 0 && (
              <div className="mt-4">
                <h4 className="font-extrabold text-gray-700 mb-2">Added Qualifications:</h4>
                <div className="space-y-2">
                  {formData.educationInfo.map(edu => (
                    <div key={edu.id} className="flex justify-between items-center bg-white p-3 rounded border">
                      <span>{edu.qualification} - {edu.institution} ({edu.yearOfPassing})</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveEducation(edu.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 9: Experience Information */}
        <div className="border rounded-xl p-6 bg-teal-50">
          <h3 className="text-xl font-semibold text-teal-800 mb-6 pb-3 border-b border-teal-200">
            <span className="bg-teal-600 text-white px-3 py-1 rounded-md mr-2">9</span>
            Work Experience (if any)
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Company"
                value={newExperience.company}
                onChange={(e) => setNewExperience({...newExperience, company: e.target.value})}
                className="p-2 border rounded bg-white"
              />
              <input
                type="text"
                placeholder="Designation"
                value={newExperience.designation}
                onChange={(e) => setNewExperience({...newExperience, designation: e.target.value})}
                className="p-2 border rounded bg-white"
              />
              <input
                type="date"
                placeholder="From Date"
                value={newExperience.fromDate}
                onChange={(e) => setNewExperience({...newExperience, fromDate: e.target.value})}
                className="p-2 border rounded bg-white"
              />
              <input
                type="date"
                placeholder="To Date"
                value={newExperience.toDate}
                onChange={(e) => setNewExperience({...newExperience, toDate: e.target.value})}
                className="p-2 border rounded bg-white"
              />
              <input
                type="text"
                placeholder="Duration"
                value={newExperience.duration}
                onChange={(e) => setNewExperience({...newExperience, duration: e.target.value})}
                className="p-2 border rounded bg-white"
              />
              <input
                type="text"
                placeholder="Reason for Leaving"
                value={newExperience.reasonForLeaving}
                onChange={(e) => setNewExperience({...newExperience, reasonForLeaving: e.target.value})}
                className="p-2 border rounded bg-white"
              />
            </div>
            
            <button
              type="button"
              onClick={handleAddExperience}
              className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
            >
              + Add Experience
            </button>

            {formData.experienceInfo.length > 0 && (
              <div className="mt-4">
                <h4 className="font-extrabold text-gray-700 mb-2">Added Experience:</h4>
                <div className="space-y-2">
                  {formData.experienceInfo.map(exp => (
                    <div key={exp.id} className="flex justify-between items-center bg-white p-3 rounded border">
                      <span>{exp.designation} at {exp.company} ({exp.duration})</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveExperience(exp.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 10: Family Information */}
        <div className="border rounded-xl p-6 bg-rose-50">
          <h3 className="text-xl font-semibold text-rose-800 mb-6 pb-3 border-b border-rose-200">
            <span className="bg-rose-600 text-white px-3 py-1 rounded-md mr-2">10</span>
            Family Details  <span className="text-red-600">*</span>
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              <input
                type="text"
                placeholder="Father's Name"
                value={newFamilyMember.name}
                required
                onChange={(e) => setNewFamilyMember({...newFamilyMember, name: e.target.value})}
                className="p-2 border rounded bg-white"
              />
              <input
                type="text"
                placeholder="Relation"
                value={newFamilyMember.relation}
                onChange={(e) => setNewFamilyMember({...newFamilyMember, relation: e.target.value})}
                className="p-2 border rounded bg-white"
              />
            
              <input
                type="text"
                placeholder="Contact"
                value={newFamilyMember.contact}
                required
                onChange={(e) => setNewFamilyMember({...newFamilyMember, contact: e.target.value})}
                className="p-2 border rounded bg-white"
              />
              <input
                type="text"
                placeholder="Occupation"
                value={newFamilyMember.occupation}
                required
                onChange={(e) => setNewFamilyMember({...newFamilyMember, occupation: e.target.value})}
                className="p-2 border rounded bg-white"
              />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              <input
                type="text"
                placeholder="Mother's Name"
                value={newFamilyMember.name}
                required
                onChange={(e) => setNewFamilyMember({...newFamilyMember, name: e.target.value})}
                className="p-2 border rounded bg-white"
              />
              <input
                type="text"
                placeholder="Relation"
                value={newFamilyMember.relation}
                required
                onChange={(e) => setNewFamilyMember({...newFamilyMember, relation: e.target.value})}
                className="p-2 border rounded bg-white"
              />
            
              <input
                type="text"
                placeholder="Contact"
                value={newFamilyMember.contact}
                onChange={(e) => setNewFamilyMember({...newFamilyMember, contact: e.target.value})}
                className="p-2 border rounded bg-white"
              />
              <input
                type="text"
                placeholder="Occupation"
                value={newFamilyMember.occupation}
                required
                onChange={(e) => setNewFamilyMember({...newFamilyMember, occupation: e.target.value})}
                className="p-2 border rounded bg-white"
              />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              <input
                type="text"
                placeholder="Brother/Sister Name"
                value={newFamilyMember.name}
                required
                onChange={(e) => setNewFamilyMember({...newFamilyMember, name: e.target.value})}
                className="p-2 border rounded bg-white"
              />
              <input
                type="text"
                placeholder="Relation"
                value={newFamilyMember.relation}
                required
                onChange={(e) => setNewFamilyMember({...newFamilyMember, relation: e.target.value})}
                className="p-2 border rounded bg-white"
              />
            
              <input
                type="text"
                placeholder="Contact"
                value={newFamilyMember.contact}
                required
                onChange={(e) => setNewFamilyMember({...newFamilyMember, contact: e.target.value})}
                className="p-2 border rounded bg-white"
              />
              <input
                type="text"
                placeholder="Occupation"
                value={newFamilyMember.occupation}
                required
                onChange={(e) => setNewFamilyMember({...newFamilyMember, occupation: e.target.value})}
                className="p-2 border rounded bg-white"
              />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              <input
                type="text"
                placeholder="Spouse Name"
                value={newFamilyMember.name}
                required
                onChange={(e) => setNewFamilyMember({...newFamilyMember, name: e.target.value})}
                className="p-2 border rounded bg-white"
              />
              <input
                type="text"
                placeholder="Relation"
                value={newFamilyMember.relation}
                onChange={(e) => setNewFamilyMember({...newFamilyMember, relation: e.target.value})}
                className="p-2 border rounded bg-white"
              />
            
              <input
                type="text"
                placeholder="Contact"
                value={newFamilyMember.contact}
                required
                onChange={(e) => setNewFamilyMember({...newFamilyMember, contact: e.target.value})}
                className="p-2 border rounded bg-white"
              />
              <input
                type="text"
                placeholder="Occupation"
                value={newFamilyMember.occupation}
                required
                onChange={(e) => setNewFamilyMember({...newFamilyMember, occupation: e.target.value})}
                className="p-2 border rounded bg-white"
              />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              <input
                type="text"
                placeholder="Nominee Name"
                value={newFamilyMember.name}
                required
                onChange={(e) => setNewFamilyMember({...newFamilyMember, name: e.target.value})}
                className="p-2 border rounded bg-white"
              />
              <input
                type="text"
                placeholder="Relation"
                value={newFamilyMember.relation}
                onChange={(e) => setNewFamilyMember({...newFamilyMember, relation: e.target.value})}
                className="p-2 border rounded bg-white"
              />
            
              <input
                type="text"
                placeholder="Contact"
                value={newFamilyMember.contact}
                required
                onChange={(e) => setNewFamilyMember({...newFamilyMember, contact: e.target.value})}
                className="p-2 border rounded bg-white"
              />
              <input
                type="text"
                placeholder="Occupation"
                value={newFamilyMember.occupation}
                required
                onChange={(e) => setNewFamilyMember({...newFamilyMember, occupation: e.target.value})}
                className="p-2 border rounded bg-white"
              />
            </div>
        

          
          </div>
        </div>

        {/* Section 11: Documents */}
        <div className="border rounded-xl p-6 bg-gray-50">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-3 border-b border-gray-200">
            <span className="bg-gray-600 text-white px-3 py-1 rounded-md mr-2">11</span>
            Required Documents  <span className="text-red-600">*</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 bg-white gap-6">
            {renderFileUpload("Aadhar Card *", "documents.aadharCard", "image/*,.pdf")}
            {renderFileUpload("PAN Card *", "documents.panCard", "image/*,.pdf")}
          
            {renderFileUpload("Resume *", "documents.resume", ".pdf,.doc,.docx")}
            {renderFileUpload("Experience Letters", "documents.experienceLetters", "image/*,.pdf")}
            {renderFileUpload("Salary Slip *", "documents.salarySlip", "image/*,.pdf")}
            {renderFileUpload("OFFER letter *", "documents.offerLetter", "image/*,.pdf")}
            {renderFileUpload("Bank Statement *", "documents.bankStatement", "image/*,.pdf")}
            {renderFileUpload("Educational Certificates", "documents.educationalCertificates", "image/*,.pdf")}
          </div>
        </div>
     </div>
    </div>
  );
};

export default EmployeeForm;