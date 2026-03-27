import { useEffect, useState } from "react";
import {
  X,
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Car,
  Users,
  Package,
  Flag,
  Briefcase,
  Clock,
  FileText,
  Tag,
  PhoneCall,
  Star,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface LeadDetailsModelProps {
  lead: any;
  isOpen: boolean;
  onClose: () => void;
}

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const DetailSection = ({
  title,
  icon,
  children,
  defaultOpen = true,
}: SectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-blue-600">{icon}</span>
          <h3 className="font-semibold text-gray-800">{title}</h3>
        </div>
        {isOpen ? (
          <ChevronUp size={18} className="text-gray-500" />
        ) : (
          <ChevronDown size={18} className="text-gray-500" />
        )}
      </button>
      {isOpen && <div className="p-4">{children}</div>}
    </div>
  );
};

const DetailRow = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number | null;
  icon?: React.ReactNode;
}) => (
  <div className="flex flex-col space-y-1 p-3 bg-gray-50 rounded-lg">
    <div className="flex items-center gap-2 text-sm text-gray-500">
      {icon && <span className="text-gray-400">{icon}</span>}
      <span>{label}</span>
    </div>
    <div className="font-medium text-gray-900 break-words">
      {value || <span className="text-gray-400 italic">Not specified</span>}
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig: Record<string, { color: string; bgColor: string }> = {
    New: { color: "text-blue-800", bgColor: "bg-blue-100" },
    KYC: { color: "text-amber-800", bgColor: "bg-amber-100" },
    RFQ: { color: "text-red-800", bgColor: "bg-red-100" },
    HOT: { color: "text-pink-800", bgColor: "bg-pink-100" },
    Book: { color: "text-green-800", bgColor: "bg-green-100" },
    Lost: { color: "text-gray-800", bgColor: "bg-gray-100" },
  };

  const config = statusConfig[status] || {
    color: "text-gray-800",
    bgColor: "bg-gray-100",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.color}`}
    >
      {status || "N/A"}
    </span>
  );
};

const LeadDetailsModel = ({ lead, isOpen, onClose }: LeadDetailsModelProps) => {
  const [imageError, setImageError] = useState<Record<string, boolean>>({});

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatDateTime = (dateTime: string) => {
    if (!dateTime) return null;
    try {
      return new Date(dateTime).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return null;
    }
  };

  if (!isOpen || !lead) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-7xl max-h-[90vh] overflow-y-auto bg-gray-100 rounded-xl shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-gradient-to-r from-blue-700 to-blue-900 rounded-t-xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Lead Details</h2>
              <div className="flex items-center gap-4 text-sm text-blue-200">
                <p>Reference ID: {lead.id || "N/A"}</p>
                <p>City: {lead.city || "N/A"}</p>
                <p>
                  Lead Date:{" "}
                  {lead.enquiryTime
                    ? new Date(lead.enquiryTime)
                        .toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                        .replace(",", "")
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white transition-all rounded-lg hover:bg-white/20 hover:scale-110"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-blue-500">
              <div className="text-xs text-gray-500">Status</div>
              <StatusBadge status={lead.status} />
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-green-500">
              <div className="text-xs text-gray-500">Source</div>
              <div className="font-medium flex items-center gap-1 mt-1">
                <Tag size={14} className="text-gray-400" />
                {lead.source || "N/A"}
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-purple-500">
              <div className="text-xs text-gray-500">Telecaller</div>
              <div className="font-medium flex items-center gap-1 mt-1">
                <PhoneCall size={14} className="text-gray-400" />
                {lead.telecaller || "N/A"}
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-amber-500">
              <div className="text-xs text-gray-500">Follow Up</div>
              <div className="font-medium flex items-center gap-1 mt-1">
                <Clock size={14} className="text-gray-400" />
                {lead.followup || "N/A"}
              </div>
            </div>
          </div>

          <DetailSection title="Customer Information" icon={<User size={18} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
              <DetailRow
                label="Full Name"
                value={lead.customerName}
                icon={<User size={14} />}
              />
              <DetailRow
                label="Phone Number"
                value={lead.customerPhone}
                icon={<Phone size={14} />}
              />
              <DetailRow
                label="Alternate Phone"
                value={lead.alternatePhone}
                icon={<Phone size={14} />}
              />
              <DetailRow
                label="Customer Category"
                value={lead.customerType}
                icon={<Building2 size={14} />}
              />
              <DetailRow
                label="Customer Type"
                value={lead.customerCategoryType}
                icon={<Building2 size={14} />}
              />
              <DetailRow
                label="Company"
                value={lead.companyName}
                icon={<Building2 size={14} />}
              />
              <DetailRow
                label="Email Address"
                value={lead.customerEmail}
                icon={<Mail size={14} />}
              />

              <DetailRow
                label="Country"
                value={lead.countryName}
                icon={<Flag size={14} />}
              />
              <DetailRow
                label="Customer City"
                value={lead.customerCity}
                icon={<Flag size={14} />}
              />
            </div>
          </DetailSection>

          <DetailSection title="Travel Details" icon={<MapPin size={18} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <DetailRow label="Trip Type" value={lead.tripType} />
              <DetailRow label="Service Type" value={lead.serviceType} />
              <DetailRow
                label="Pickup Date & Time"
                value={formatDateTime(lead.pickupDateTime)}
                icon={<Calendar size={14} />}
              />
              <DetailRow
                label="Drop Date & Time"
                value={formatDateTime(lead.dropDateTime)}
                icon={<Calendar size={14} />}
              />
              <DetailRow
                label="Pickup City"
                value={lead.pickupcity}
                icon={<MapPin size={14} />}
              />
              <DetailRow
                label="Drop City"
                value={lead.dropcity}
                icon={<MapPin size={14} />}
              />
              <DetailRow label="Duration (Days)" value={lead.days} />
              <DetailRow label="Distance (KM)" value={lead.km} />

              <div className="md:col-span-2">
                <DetailRow label="Pickup Address" value={lead.pickupAddress} />
              </div>

              <div className="md:col-span-2">
                <DetailRow label="Drop Address" value={lead.dropAddress} />
              </div>
            </div>
          </DetailSection>

          <DetailSection
            title="Passenger & Baggage Details"
            icon={<Users size={18} />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Users size={16} /> Passenger Information
                </h4>
                <div className="space-y-2">
                  <DetailRow
                    label="Total Passengers"
                    value={lead.passengerTotal}
                  />
                  {lead.petsNumber && (
                    <DetailRow
                      label="Pets"
                      value={`${lead.petsNumber} ${lead.petsNames ? `(${lead.petsNames})` : ""}`}
                    />
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Package size={16} /> Baggage Details
                </h4>
                <div className="space-y-2">
                  <DetailRow label="Total Baggage" value={lead.totalBaggage} />
                  {(lead.smallBaggage ||
                    lead.mediumBaggage ||
                    lead.largeBaggage ||
                    lead.airportBaggage) && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {lead.smallBaggage && (
                        <div className="text-sm">
                          Small: {lead.smallBaggage}
                        </div>
                      )}
                      {lead.mediumBaggage && (
                        <div className="text-sm">
                          Medium: {lead.mediumBaggage}
                        </div>
                      )}
                      {lead.largeBaggage && (
                        <div className="text-sm">
                          Large: {lead.largeBaggage}
                        </div>
                      )}
                      {lead.airportBaggage && (
                        <div className="text-sm">
                          Airport: {lead.airportBaggage}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DetailSection>

          <DetailSection title="Vehicle Requirements" icon={<Car size={18} />}>
            <div className="space-y-3">
              {
                lead.vehicles &&
                Array.isArray(lead.vehicles) &&
                lead.vehicles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {lead.vehicles.map((vehicle: any, index: number) => (
                      <div
                        key={index}
                        className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-blue-700">
                            {vehicle.quantity}x
                          </span>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {vehicle.category}
                          </span>
                        </div>
                        <p className="text-gray-700 mt-1">{vehicle.type}</p>
                      </div>
                    ))}
                  </div>
                ) : null 
              }

              {(lead.vehicle2 || lead.vehicle3 || lead.requirementVehicle) && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-3">
                  {lead.vehicles && (
                    <DetailRow
                      label="Additional Vehicle 1"
                      value={lead.vehicles}
                    />
                  )}
                  {lead.vehicle2 && (
                    <DetailRow
                      label="Additional Vehicle 2"
                      value={lead.vehicle2}
                    />
                  )}
                  {lead.vehicle3 && (
                    <DetailRow
                      label="Additional Vehicle 3"
                      value={lead.vehicle3}
                    />
                  )}
                  {lead.requirementVehicle && (
                    <DetailRow
                      label="Special Requirements"
                      value={lead.requirementVehicle}
                    />
                  )}
                </div>
              )}

              {(!lead.vehicles ||
                (Array.isArray(lead.vehicles) && lead.vehicles.length === 0)) &&
                !lead.vehicle2 &&
                !lead.vehicle3 &&
                !lead.requirementVehicle && (
                  <p className="text-gray-500 italic">No vehicles specified</p>
                )}
            </div>
          </DetailSection>

          {lead.itinerary &&
            Array.isArray(lead.itinerary) &&
            lead.itinerary.length > 0 && (
              <DetailSection
                title="Trip Itinerary"
                icon={<FileText size={18} />}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
                  {lead.itinerary.map((item: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center justify-center text-sm font-medium flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 flex-1">{item}</p>
                    </div>
                  ))}
                </div>
              </DetailSection>
            )}

          <DetailSection
            title="Additional Information"
            icon={<AlertCircle size={18} />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <DetailRow
                label="Occasion"
                value={lead.occasion}
                icon={<Star size={14} />}
              />
              <DetailRow label="Remarks" value={lead.remarks} />
              {lead.lost_reason && (
                <>
                  <DetailRow label="Lost Reason" value={lead.lost_reason} />
                  <DetailRow label="Lost Reason Details" value={lead.message} />
                </>
              )}
            </div>
          </DetailSection>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex justify-end p-4 bg-white border-t border-gray-200 shadow-lg">
          <button
            onClick={onClose}
            className="px-8 py-2.5 text-white transition-all bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-md active:scale-95 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailsModel;
