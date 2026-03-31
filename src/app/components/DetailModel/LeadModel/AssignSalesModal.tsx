// components/AssignSalesModal.tsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "@/app/redux/store";
import {
  fetchSalesUsers,
  assignLeadToUser,
  setSelectedUser,
  clearSelectedUser,
  clearAssignError,
  resetAssignState,
} from "../../../features/access/accessSlice";
import type { User } from "@/types/types";

const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

interface AssignSalesModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: string; // Single lead ID
}

const AssignSalesModal: React.FC<AssignSalesModalProps> = ({
  isOpen,
  onClose,
  leadId,
}) => {
  const dispatch = useAppDispatch();

  const {
    salesUsers,
    loading,
    error,
    assignLoading,
    assignError,
    selectedUserId,
  } = useAppSelector((state) => state.assign);

  const [localSelectedUserId, setLocalSelectedUserId] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchSalesUsers());
      setLocalSelectedUserId("");
      dispatch(clearSelectedUser());
    }

    return () => {
      if (!isOpen) {
        dispatch(clearAssignError());
        dispatch(clearSelectedUser());
      }
    };
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (selectedUserId) {
      setLocalSelectedUserId(selectedUserId);
    }
  }, [selectedUserId]);

  const handleRadioChange = (userId: string) => {
    setLocalSelectedUserId(userId);
    dispatch(setSelectedUser(userId));
  };

  const handleSubmit = async () => {
    if (!localSelectedUserId) {
      alert("Please select a sales user");
      return;
    }

    try {
      await dispatch(
        assignLeadToUser({
          leadId: leadId,
          userId: localSelectedUserId,
        })
      ).unwrap();

      alert("Lead assigned successfully!");
      onClose();
      dispatch(resetAssignState());
    } catch (err) {
      console.error("Assignment failed", err);
      alert(assignError || "Assignment failed");
    }
  };

  if (!isOpen) return null;

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(4px)",
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
    cursor: "pointer",
    backgroundColor: "white",
  };

  const radioStyle: React.CSSProperties = {
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
    cursor: !localSelectedUserId || assignLoading ? "not-allowed" : "pointer",
    opacity: !localSelectedUserId || assignLoading ? 0.6 : 1,
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
          <h3 style={titleStyle}>Assign Lead to Sales User</h3>
          <button onClick={onClose} style={closeButtonStyle} aria-label="Close">
            ✕
          </button>
        </div>

        {loading && (
          <div style={loadingStyle}>
            <div>Loading sales users...</div>
          </div>
        )}

        {(error || assignError) && (
          <div style={errorStyle}>
            {error || assignError || "Failed to load users. Please try again."}
          </div>
        )}

        {salesUsers && salesUsers.length > 0 && (
          <>
            <ul style={listStyle}>
              {salesUsers.map((user: User) => (
                <li
                  key={user.uuid}
                  style={listItemStyle}
                  onClick={() => handleRadioChange(user.uuid)}
                >
                  <label style={labelStyle}>
                    <input
                      type="radio"
                      name="salesUser"
                      value={user.uuid}
                      checked={localSelectedUserId === user.uuid}
                      onChange={(e) => handleRadioChange(e.target.value)}
                      style={radioStyle}
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
                disabled={assignLoading || !localSelectedUserId}
                style={primaryButtonStyle}
              >
                {assignLoading ? "Assigning..." : "Assign Lead"}
              </button>
            </div>
          </>
        )}

        {!loading && (!salesUsers || salesUsers.length === 0) && (
          <div style={loadingStyle}>No sales users available</div>
        )}
      </div>
    </div>
  );
};

export default AssignSalesModal;