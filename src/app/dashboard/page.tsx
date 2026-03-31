"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import type { ComponentType } from "react";
import Navbar from "../components/ui/navbar";
import Sidebar from "../components/ui/sidebar";
import { Admin } from "../components/admin";
import { Access } from "../components/Access/accesslevel";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { useSearchParams } from "next/navigation";
import { currentUserThunk } from "../features/user/userSlice";
import type { LeadRecord } from "@/types/types";

type SidebarSection =
  | "leads"
  | "master"
  | "rate-quotation"
  | "booking-trip"
  | "payment"
  | "feedback"
  | "dashboard"
  | "access"
  | "admin";

type MasterKey =
  | "vendor"
  | "vehicles"
  | "vehicle-category"
  | "vehicle-registration"
  | "vehicle-add"
  | "driver"
  | "employee"
  | "hr"
  | "city"
  | "corporate-form"
  | "corporate-event"
  | "customer-personal"
  | "rate-quotation"
  | "card-reel"
  | "quotation-pdf"
  | "country-code"
  | "access-level"
  | "region"
  | "zone";

type LeadView =
  | "dashboard"
  | "lead-form"
  | "lead-table"
  | "sale-lead-table"
  | "sales-edit-form"
  | "tl-tables";

type DashboardView =
  | "leads-dashboard"
  | "presales-dashboard"
  | "citymanager-dashboard"
  | "bdm-dashboard"
  | "teamleader-dashboard"
  | "salesteam-dashboard";

interface MasterTab {
  key: MasterKey;
  label: string;
  component: ComponentType;
}

const LoadingPanel = () => (
  <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
    Loading module…
  </div>
);

const LeadsOverviewModule = dynamic(
  () => import("../components/pages/leads/dashboard"),
  {
    ssr: false,
    loading: LoadingPanel,
  },
);

const LeadFormModule = dynamic(
  () => import("../components/pages/leads/list/leadsfrom"),
  {
    ssr: false,
    loading: LoadingPanel,
  },
);

const LeadTableModule = dynamic(
  () => import("../components/pages/leads/list/leadtable"),
  {
    ssr: false,
    loading: LoadingPanel,
  },
) as React.ComponentType<{ selectedRegion?: string; selectedCity?: string }>;

const LeadSaleTableModule = dynamic(
  () => import("../components/salesteam/saleleadable"),
  {
    ssr: false,
    loading: LoadingPanel,
  },
);

const EditLeadFormModule = dynamic(
  () => import("../components/pages/leads/list/EditForm/editleadform"),
  {
    ssr: false,
    loading: LoadingPanel,
  },
);

const TeamLeaderLeadTableModule = dynamic(
  () => import("../components/pages/teamleader/teamleaderleadtable"),
  {
    ssr: false,
    loading: LoadingPanel,
  },
);

const PresalesDashboardModule = dynamic(
  () => import("../components/presalesteam/dashboardpresales"),
  {
    ssr: false,
    loading: LoadingPanel,
  },
);

const TeamleaderDashboardModule = dynamic(
  () => import("../components/pages/teamleader/teamleaderdashboard"),
  {
    ssr: false,
    loading: LoadingPanel,
  },
);

const BdmDashboardModule = dynamic(
  () => import("../components/bdmdash/bdmtemadash"),
  {
    ssr: false,
    loading: LoadingPanel,
  },
);

const SalesTeamDashboardModule = dynamic(
  () => import("../components/salesteam/dashtemaadash"),
  {
    ssr: false,
    loading: LoadingPanel,
  },
);

const RateQuotationTableModule = dynamic(
  () => import("../components/pages/ratequation/list/ratequotationtable"),
  {
    ssr: false,
    loading: LoadingPanel,
  },
) as React.ComponentType<{ leadData?: LeadRecord | null }>;

const masterTabs: MasterTab[] = [
  {
    key: "vendor",
    label: "Vendor Master",
    component: dynamic(
      () => import("../components/masterform.tsx/VendorFormData"),
      {
        ssr: false,
        loading: LoadingPanel,
      },
    ),
  },
  {
    key: "vehicles",
    label: "Vehicles Master",
    component: dynamic(
      () => import("../components/masterform.tsx/vehiclesmaster"),
      {
        ssr: false,
        loading: LoadingPanel,
      },
    ),
  },
  {
    key: "vehicle-category",
    label: "Vehicle Category",
    component: dynamic(
      () => import("../components/masterform.tsx/vehiclecategory"),
      {
        ssr: false,
        loading: LoadingPanel,
      },
    ),
  },
  {
    key: "vehicle-registration",
    label: "Vehicle Registration",
    component: dynamic(
      () => import("../components/masterform.tsx/Vehicleregistration"),
      {
        ssr: false,
        loading: LoadingPanel,
      },
    ),
  },
  {
    key: "vehicle-add",
    label: "Vehicle Add Form",
    component: dynamic(
      () => import("../components/masterform.tsx/Vehicleaddform"),
      {
        ssr: false,
        loading: LoadingPanel,
      },
    ),
  },
  {
    key: "driver",
    label: "Driver Master",
    component: dynamic(
      () => import("../components/masterform.tsx/DriverFormData"),
      {
        ssr: false,
        loading: LoadingPanel,
      },
    ),
  },
  {
    key: "employee",
    label: "Employee Master",
    component: dynamic(
      () => import("../components/masterform.tsx/EmployeeFormData"),
      {
        ssr: false,
        loading: LoadingPanel,
      },
    ),
  },

  {
    key: "city",
    label: "City Master",
    component: dynamic(() => import("../components/Access/city"), {
      ssr: false,
      loading: LoadingPanel,
    }),
  },
  {
    key: "corporate-form",
    label: "Corporate Form",
    component: dynamic(
      () => import("../components/masterform.tsx/coprateform"),
      {
        ssr: false,
        loading: LoadingPanel,
      },
    ),
  },
  {
    key: "corporate-event",
    label: "Corporate Event",
    component: dynamic(
      () => import("../components/masterform.tsx/corporatevent"),
      {
        ssr: false,
        loading: LoadingPanel,
      },
    ),
  },
  {
    key: "customer-personal",
    label: "Customer Personal",
    component: dynamic(
      () => import("../components/masterform.tsx/CUSTOMER/customerpersonal"),
      {
        ssr: false,
        loading: LoadingPanel,
      },
    ),
  },
  {
    key: "card-reel",
    label: "Card Reel",
    component: dynamic(() => import("../components/masterform.tsx/cardreel"), {
      ssr: false,
      loading: LoadingPanel,
    }),
  },
  {
    key: "quotation-pdf",
    label: "Quotation PDF",
    component: dynamic(
      () => import("../components/masterform.tsx/quotationPdf"),
      {
        ssr: false,
        loading: LoadingPanel,
      },
    ),
  },
  {
    key: "country-code",
    label: "Country Code",
    component: dynamic(
      () => import("../components/masterform.tsx/countrycode"),
      {
        ssr: false,
        loading: LoadingPanel,
      },
    ),
  },
  {
    key: "zone",
    label: "Zone",
    component: dynamic(() => import("../components/Access/zone"), {
      ssr: false,
      loading: LoadingPanel,
    }),
  },
  {
    key: "region",
    label: "Region",
    component: dynamic(() => import("../components/Access/region"), {
      ssr: false,
      loading: LoadingPanel,
    }),
  },
];

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState<SidebarSection>("leads");
  const [activeMaster, setActiveMaster] = useState<MasterKey>("vendor");
  const [activeLeadView, setActiveLeadView] = useState<LeadView>("dashboard");

  const getDefaultDashboard = (role: string): DashboardView => {
    const normalizedRole = role.toLowerCase().trim();
    switch (normalizedRole) {
      case "presales":
      case "presale":
        return "presales-dashboard";
      case "bdm":
        return "bdm-dashboard";
      case "sales":
        return "salesteam-dashboard";
      case "city manager":
      case "citymanager":
        return "citymanager-dashboard";
      case "team leader":
      case "teamleader":
      case "team_leader":
        return "teamleader-dashboard";
      default:
        return "leads-dashboard";
    }
  };

  const [activeDashboardView, setActiveDashboardView] =
    useState<DashboardView>("leads-dashboard");
  const [pendingModuleKey, setPendingModuleKey] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [activeYearKey, setActiveYearKey] = useState<string | null>(null);
  const [activeAccessKey, setActiveAccessKey] = useState<string | null>(null);

  const [userRole, setUserRole] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [selectedLeadForEdit, setSelectedLeadForEdit] =
    useState<LeadRecord | null>(null);
  const [selectedLeadForRateQuotation, setSelectedLeadForRateQuotation] =
    useState<LeadRecord | null>(null);

  // Helper function to reset all report/feature states
  const resetAllReportStates = () => {};

  const dispatch = useDispatch<AppDispatch>();
  const { currentUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(currentUserThunk());
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
      const role = currentUser.role || "user";
      setUserRole(role);
      setUserName(currentUser.name || "User");
      setUserEmail(currentUser.email || "");

      // Set the default dashboard view based on role
      const defaultDashboard = getDefaultDashboard(role);
      setActiveDashboardView(defaultDashboard);

      // If Sales or Presales role (case insensitive), also set the active section to dashboard
      const lowerRole = role.toLowerCase().trim();
      if (
        lowerRole === "sales" ||
        lowerRole === "presale" ||
        lowerRole === "presales" ||
        lowerRole === "team leader" ||
        lowerRole === "teamleader" ||
        lowerRole === "team_leader" ||
        lowerRole === "bdm" ||
        lowerRole === "city manager" ||
        lowerRole === "citymanager"
      ) {
        setActiveSection("dashboard");
        // Ensure presales users always get presales-dashboard view
        if (lowerRole === "presale" || lowerRole === "presales") {
          setActiveDashboardView("presales-dashboard");
        }
      }
    }
  }, [currentUser]);

  // Listen for lead selection events from LeadSaleTableModule
  useEffect(() => {
    const handleViewLead = (event: CustomEvent<LeadRecord>) => {
      const lead = event.detail;
      if (lead) {
        setSelectedLeadForEdit(lead);
        setActiveSection("leads");
        setActiveLeadView("sales-edit-form");
        resetAllReportStates();
      }
    };

    window.addEventListener("viewLead", handleViewLead as EventListener);
    return () => {
      window.removeEventListener("viewLead", handleViewLead as EventListener);
    };
  }, []);

  // Listen for navigateToLeadTable event from LeadsForm
  useEffect(() => {
    const handleNavigateToLeadTable = () => {
      setActiveSection("leads");
      setActiveLeadView("lead-table");
      resetAllReportStates();
    };

    window.addEventListener("navigateToLeadTable", handleNavigateToLeadTable);
    return () => {
      window.removeEventListener(
        "navigateToLeadTable",
        handleNavigateToLeadTable,
      );
    };
  }, []);

  // Listen for rate quotation events from LeadSaleTableModule
  useEffect(() => {
    const handleRateQuotation = (event: CustomEvent<{ lead: LeadRecord }>) => {
      const { lead } = event.detail;
      console.log("Rate quotation event received for lead:", lead);
      if (lead) {
        setSelectedLeadForRateQuotation(lead);
        setActiveSection("rate-quotation");
        setPendingModuleKey(null);
        resetAllReportStates();
      }
    };

    window.addEventListener(
      "rateQuotation",
      handleRateQuotation as EventListener,
    );
    return () => {
      window.removeEventListener(
        "rateQuotation",
        handleRateQuotation as EventListener,
      );
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const permittedMasterTabs = useMemo(() => masterTabs, []);
  const permittedMasterKeys = useMemo(
    () => permittedMasterTabs.map((tab) => tab.key) as MasterKey[],
    [permittedMasterTabs],
  );

  useEffect(() => {
    if (!permittedMasterKeys.includes(activeMaster)) {
      const fallback = permittedMasterKeys[0] ?? "vendor";
      setActiveMaster(fallback);
    }
  }, [activeMaster, permittedMasterKeys]);

  useEffect(() => {
    if (activeSection !== "leads" && activeLeadView !== "dashboard") {
      setActiveLeadView("dashboard");
    }
  }, [activeSection, activeLeadView]);

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    setSelectedCity("");
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
  };

  const handleDashboardSelect = (key: string) => {
    setActiveDashboardView(key as DashboardView);
  };

  const handleYearSelect = (key: string) => {
    setActiveYearKey(key);
  };

  const handleAccessSelect = (key: string) => {
    setActiveAccessKey(key);
  };

  // 🔥 Handler for Sales Lead Table
  const handleSalesLeadSelect = (key: string) => {
    if (key === "sales-lead-table" || key === "sale-lead-table") {
      setPendingModuleKey(null);
      setActiveSection("leads");
      setActiveLeadView("sale-lead-table");
      resetAllReportStates();
    }
  };

  // 🔥 Handler for TL Tables
  const handleTlTablesSelect = (key: string) => {
    if (key === "tl-tables") {
      setPendingModuleKey(null);
      setActiveSection("leads");
      setActiveLeadView("tl-tables");
      resetAllReportStates();
    }
  };

  const handleSalesEditFormSelect = (key: string) => {
    if (key === "sales-edit-form") {
      setPendingModuleKey(null);
      setActiveSection("leads");
      setActiveLeadView("sales-edit-form");
      resetAllReportStates();
    }
  };

  const ActiveMasterComponent = useMemo(() => {
    if (activeSection !== "master") {
      return null;
    }
    return (
      permittedMasterTabs.find((tab) => tab.key === activeMaster)?.component ??
      null
    );
  }, [activeMaster, activeSection, permittedMasterTabs]);

  const renderFallback = (title: string, description: string) => (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 text-center">
      <h1 className="text-2xl font-semibold text-slate-800">{title}</h1>
      <p className="max-w-xl mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );

  const mainContent = (() => {
    if (activeSection === "master") {
      if (pendingModuleKey) {
        return renderFallback(
          "Module coming soon",
          `The ${pendingModuleKey.replace(/-/g, " ")} module is not ready yet.`,
        );
      }
      if (ActiveMasterComponent) {
        return (
          <div className="space-y-6">
            <ActiveMasterComponent />
          </div>
        );
      }
      return renderFallback(
        "Module not found",
        "Select a different master module while we locate this one.",
      );
    }

    if (activeSection === "leads") {
      if (activeLeadView === "lead-form") {
        return (
          <div className="space-y-6">
            <LeadFormModule />
          </div>
        );
      }

      if (activeLeadView === "lead-table") {
        return (
          <div className="space-y-6">
            <LeadTableModule
              selectedRegion={selectedRegion}
              selectedCity={selectedCity}
            />
          </div>
        );
      }

      // 🔥 Condition for sale-lead-table
      if (activeLeadView === "sale-lead-table") {
        return (
          <div className="space-y-6">
            <LeadSaleTableModule />
          </div>
        );
      }

      if (activeLeadView === "sales-edit-form") {
        if (!selectedLeadForEdit) {
          return renderFallback(
            "No Lead Selected",
            "Please select a lead from the table to edit. Go to Sales Lead Table and click the Edit button on a lead.",
          );
        }
        return (
          <div className="space-y-6">
            <EditLeadFormModule
              initialData={selectedLeadForEdit}
              onSuccess={() => {
                setSelectedLeadForEdit(null);
                setActiveLeadView("sale-lead-table");
              }}
              onCancel={() => {
                setSelectedLeadForEdit(null);
                setActiveLeadView("sale-lead-table");
              }}
            />
          </div>
        );
      }

      // 🔥 Condition for tl-tables
      if (activeLeadView === "tl-tables") {
        return (
          <div className="space-y-6">
            <TeamLeaderLeadTableModule />
          </div>
        );
      }

      return (
        <div className="space-y-6">
          <LeadsOverviewModule />
        </div>
      );
    }

    if (activeSection === "admin") {
      return (
        <div className="space-y-6">
          <Admin />
        </div>
      );
    }

    if (activeSection === "dashboard") {
      if (activeDashboardView === "leads-dashboard") {
        return (
          <div className="space-y-6">
            <LeadsOverviewModule />
          </div>
        );
      }
      if (activeDashboardView === "presales-dashboard") {
        return (
          <div className="space-y-6">
            <PresalesDashboardModule />
          </div>
        );
      }
      if (activeDashboardView === "citymanager-dashboard") {
        return (
          <div className="space-y-6">
            <div>City Manager Dashboard Coming Soon</div>
          </div>
        );
      }
      if (activeDashboardView === "bdm-dashboard") {
        return (
          <div className="space-y-6">
            <BdmDashboardModule />
          </div>
        );
      }
      if (activeDashboardView === "salesteam-dashboard") {
        return (
          <div className="space-y-6">
            <SalesTeamDashboardModule />
          </div>
        );
      }
      if (activeDashboardView === "teamleader-dashboard") {
        return (
          <div className="space-y-6">
            <TeamleaderDashboardModule />
          </div>
        );
      }
      return (
        <div className="space-y-6">
          <LeadsOverviewModule />
        </div>
      );
    }

    if (activeSection === "access") {
      return (
        <div className="space-y-6">
          <Access activeAccessKey={activeAccessKey} />
        </div>
      );
    }

    if (activeSection === "rate-quotation") {
      return (
        <div className="space-y-6">
          <RateQuotationTableModule leadData={selectedLeadForRateQuotation} />
        </div>
      );
    }

    return null;
  })();

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-100 text-slate-900">
      {/* Navbar - Full Width */}
      <Navbar
        // 🔥 Added showSalesMenu prop
        showSalesMenu={true}
        showAccess={activeSection === "access"}
        showMaster={activeSection === "master"}
        showLeadsMenu={activeSection === "leads"}
        showDashboardMenu={
          activeSection === "dashboard" && userRole?.toLowerCase() === "admin"
        }
        showYearMenu={activeSection === "leads"}
        activeSection={activeSection}
        activeMasterKey={activeMaster}
        activeLeadKey={activeLeadView === "dashboard" ? null : activeLeadView}
        activeDashboardKey={activeDashboardView}
        activeYearKey={activeYearKey}
        activeAccessKey={activeAccessKey}
        selectedRegion={selectedRegion}
        selectedCity={selectedCity}
        onRegionChange={handleRegionChange}
        onCityChange={handleCityChange}
        onDashboardSelect={handleDashboardSelect}
        onYearSelect={handleYearSelect}
        onAccessSelect={handleAccessSelect}
        onSalesLeadSelect={handleSalesLeadSelect}
        onSalesEditFormSelect={handleSalesEditFormSelect}
        onTlTablesSelect={handleTlTablesSelect}
        onMasterSelect={(key) => {
          const targeted = permittedMasterTabs.find((tab) => tab.key === key);
          setActiveSection("master");
          resetAllReportStates();
          if (targeted) {
            setPendingModuleKey(null);
            setActiveMaster(targeted.key);
            return;
          }
          setPendingModuleKey(key);
        }}
        onLeadSelect={(key) => {
          if (key === "lead-form" || key === "lead-table") {
            setPendingModuleKey(null);
            setActiveSection("leads");
            setActiveLeadView(key);
            resetAllReportStates();
          }
          // 🔥 Optional: Also handle through onLeadSelect
          else if (key === "sale-lead-table") {
            handleSalesLeadSelect(key);
          }
        }}
        permittedMasterKeys={permittedMasterKeys}
        userName={userName}
        roleLabel={userRole}
        userRole={userRole}
        onLogout={handleLogout}
      />

      {/* Sidebar + Main Content - Remaining Height */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeItem={activeSection}
          userRole={userRole}
          onAccessClick={() => {
            setActiveSection("access");
            setPendingModuleKey(null);
            resetAllReportStates();
          }}
          onAdminClick={() => {
            setActiveSection("admin");
            setPendingModuleKey(null);
            resetAllReportStates();
          }}
          onMasterClick={() => {
            setActiveSection("master");
            setPendingModuleKey(null);
            resetAllReportStates();
          }}
          onLeadsClick={() => {
            setActiveSection("leads");
            setPendingModuleKey(null);
            setActiveLeadView("dashboard");
            resetAllReportStates();
          }}
          onRateQuotationClick={() => {
            setActiveSection("rate-quotation");
            setPendingModuleKey(null);
            resetAllReportStates();
          }}
          onBookingTripClick={() => {
            setActiveSection("booking-trip");
            setPendingModuleKey(null);
            resetAllReportStates();
          }}
          onPaymentClick={() => {
            setActiveSection("payment");
            setPendingModuleKey(null);
            resetAllReportStates();
          }}
          onFeedbackClick={() => {
            setActiveSection("feedback");
            setPendingModuleKey(null);
            resetAllReportStates();
          }}
          onDashboardClick={() => {
            setActiveSection("dashboard");
            setPendingModuleKey(null);
            resetAllReportStates();
          }}
        />

        <main className="flex-1 px-4 py-1 overflow-y-auto bg-white sm:px-6">
          <div className="w-full mx-auto space-y-6">{mainContent}</div>
        </main>
      </div>
    </div>
  );
}
