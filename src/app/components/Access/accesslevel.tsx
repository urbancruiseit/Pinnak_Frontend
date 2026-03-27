"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const LoadingPanel = () => (
  <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
    Loading module…
  </div>
);

// Dynamic imports for all access level components
const CityManagerAccess = dynamic(() => import("./accesscitymanager"), {
  ssr: false,
  loading: LoadingPanel,
});

const TeamLeaderAccess = dynamic(() => import("./accessteamleader"), {
  ssr: false,
  loading: LoadingPanel,
});

const TelesalesAccess = dynamic(() => import("./accesstelesale"), {
  ssr: false,
  loading: LoadingPanel,
});

interface AccessProps {
  activeAccessKey?: string | null;
}

export function Access({ activeAccessKey }: AccessProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingPanel />
      </div>
    );
  }

  // Render the appropriate component based on activeAccessKey
  const renderAccessComponent = () => {
    switch (activeAccessKey) {
      case "city-manager":
        return <CityManagerAccess />;
      case "team-leader":
        return <TeamLeaderAccess />;
      case "sales-member":
        return <TelesalesAccess />;
      default:
        // Show welcome message when no specific access type is selected
        return (
          <div className="p-6 w-full mx-auto bg-white shadow-xl rounded-lg">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Welcome to Access Level Management
              </h2>
              <p className="text-gray-600 mb-6">
                Please select an access type from the navbar menu to manage
                access levels.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
                  <h3 className="font-semibold text-purple-700">
                    City Manager
                  </h3>
                  <p className="text-sm text-purple-600 mt-2">
                    Manage city manager access and permissions
                  </p>
                </div>
                <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-700">Team Leader</h3>
                  <p className="text-sm text-green-600 mt-2">
                    Manage team leader access and permissions
                  </p>
                </div>
                <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-700">Sales Member</h3>
                  <p className="text-sm text-blue-600 mt-2">
                    Manage sales member access and permissions
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return <>{renderAccessComponent()}</>;
}
