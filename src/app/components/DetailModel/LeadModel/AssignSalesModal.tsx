import React, { useState } from "react";
import {
  useGetSalesUsersQuery,
  useAssignToUsersMutation,
} from "../../../features/user/userApi";
import { User } from "../../../../types/types"; // adjust path

interface AssignSalesModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityId: string;
  entityType?: string;
}

const AssignSalesModal: React.FC<AssignSalesModalProps> = ({
  isOpen,
  onClose,
  entityId,
}) => {
  const { data: salesUsers, isLoading, error } = useGetSalesUsersQuery();
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [assignToUsers, { isLoading: isAssigning }] =
    useAssignToUsersMutation();

  const handleCheckboxChange = (userId: string, checked: boolean) => {
    setSelectedUserIds((prev) =>
      checked ? [...prev, userId] : prev.filter((id) => id !== userId),
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && salesUsers) {
      setSelectedUserIds(salesUsers.map((u) => u.uuid));
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleSubmit = async () => {
    try {
      await assignToUsers({ entityId, userIds: selectedUserIds }).unwrap();
      alert("Assigned successfully!");
      onClose();
    } catch (err) {
      console.error("Assignment failed", err);
      alert("Assignment failed");
    }
  };

  if (!isOpen) return null;

  // Styles (inline for simplicity – recommend moving to CSS module)
  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  };

  const modalStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    padding: "28px 24px",
    borderRadius: "16px",
    minWidth: "420px",
    maxWidth: "520px",
    maxHeight: "85vh",
    overflowY: "auto",
    boxShadow: "0 20px 35px -8px rgba(0,0,0,0.2)",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "1.35rem",
    fontWeight: 600,
    color: "#1e293b",
    margin: 0,
  };

  const closeButtonStyle: React.CSSProperties = {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "1.5rem",
    lineHeight: 1,
    color: "#64748b",
    padding: "4px 8px",
    borderRadius: "8px",
    transition: "background 0.2s",
  };

  const selectAllStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 12px",
    backgroundColor: "#f8fafc",
    borderRadius: "10px",
    marginBottom: "16px",
    fontWeight: 500,
    color: "#334155",
    cursor: "pointer",
  };

  const listStyle: React.CSSProperties = {
    listStyle: "none",
    padding: 0,
    margin: "0 0 20px 0",
    maxHeight: "300px",
    overflowY: "auto",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    backgroundColor: "#ffffff",
  };

  const listItemStyle: React.CSSProperties = {
    padding: "12px 16px",
    borderBottom: "1px solid #f1f5f9",
    transition: "background 0.2s",
  };

  const checkboxStyle: React.CSSProperties = {
    marginRight: "12px",
    accentColor: "#2563eb",
    width: "18px",
    height: "18px",
    cursor: "pointer",
  };

  const labelStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    fontSize: "0.95rem",
    color: "#1e293b",
    cursor: "pointer",
    width: "100%",
  };

  const userEmailStyle: React.CSSProperties = {
    fontSize: "0.85rem",
    color: "#64748b",
    marginLeft: "6px",
    fontWeight: 400,
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "24px",
  };

  const primaryButtonStyle: React.CSSProperties = {
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "10px",
    fontSize: "0.95rem",
    fontWeight: 500,
    cursor:
      selectedUserIds.length === 0 || isAssigning ? "not-allowed" : "pointer",
    opacity: selectedUserIds.length === 0 || isAssigning ? 0.6 : 1,
    transition: "background 0.2s, transform 0.1s",
    boxShadow: "0 4px 6px -1px rgba(37,99,235,0.2)",
  };

  const secondaryButtonStyle: React.CSSProperties = {
    backgroundColor: "transparent",
    color: "#475569",
    border: "1px solid #cbd5e1",
    padding: "10px 20px",
    borderRadius: "10px",
    fontSize: "0.95rem",
    fontWeight: 500,
    cursor: "pointer",
    transition: "background 0.2s",
  };

  const loadingStyle: React.CSSProperties = {
    textAlign: "center",
    padding: "30px",
    color: "#64748b",
  };

  const errorStyle: React.CSSProperties = {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "16px",
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h3 style={titleStyle}>Assign to Sales Users</h3>
          <button onClick={onClose} style={closeButtonStyle} aria-label="Close">
            ✕
          </button>
        </div>

        {isLoading && (
          <div style={loadingStyle}>
            <div>Loading sales users...</div>
            {/* You can add a spinner here */}
          </div>
        )}

        {error && (
          <div style={errorStyle}>Failed to load users. Please try again.</div>
        )}

        {salesUsers && (
          <>
            <div
              style={selectAllStyle}
              onClick={() =>
                handleSelectAll(selectedUserIds.length !== salesUsers.length)
              }
            >
              <input
                type="checkbox"
                onChange={(e) => handleSelectAll(e.target.checked)}
                checked={selectedUserIds.length === salesUsers.length}
                style={checkboxStyle}
              />
              <span>Select All ({salesUsers.length} users)</span>
            </div>

            <ul style={listStyle}>
              {salesUsers.map((user: User) => (
                <li key={user.uuid} style={listItemStyle}>
                  <label style={labelStyle}>
                    <input
                      type="checkbox"
                      checked={selectedUserIds.includes(user.uuid)}
                      onChange={(e) =>
                        handleCheckboxChange(user.uuid, e.target.checked)
                      }
                      style={checkboxStyle}
                    />
                    <span>
                      {user.name}
                      <span style={userEmailStyle}>({user.email})</span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>

            <div style={buttonContainerStyle}>
              <button onClick={onClose} style={secondaryButtonStyle}>
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isAssigning || selectedUserIds.length === 0}
                style={primaryButtonStyle}
                onMouseEnter={(e) => {
                  if (selectedUserIds.length > 0 && !isAssigning) {
                    e.currentTarget.style.backgroundColor = "#1d4ed8";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedUserIds.length > 0 && !isAssigning) {
                    e.currentTarget.style.backgroundColor = "#2563eb";
                  }
                }}
              >
                {isAssigning ? "Assigning..." : "Assign"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AssignSalesModal;
