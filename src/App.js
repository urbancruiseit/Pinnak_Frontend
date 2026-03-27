// import { useEffect, useState } from "react";
// import { generateToken, onMessageListener } from "./notification";

// function App() {
//   const [notification, setNotification] = useState(null);
//   const [fcmToken, setFcmToken] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [response, setResponse] = useState(null);

//   useEffect(() => {
//     // Generate token when app loads
//     const initNotification = async () => {
//       console.log("📱 Initializing notification system...");
//       const token = await generateToken();
//       setFcmToken(token);
//       console.log("✅ FCM Token generated:", token);
//     };

//     initNotification();

//     // Listen for foreground messages
//     const unsubscribe = onMessageListener().then((payload) => {
//       console.log("📨 Foreground notification received:", payload);
//       setNotification({
//         title: payload.notification.title,
//         body: payload.notification.body,
//       });
//     });

//     return () => unsubscribe;
//   }, []);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setResponse(null);

//     console.log("📤 Submitting lead form...");
//     console.log("📋 Form data:", formData);

//     try {
//       const startTime = Date.now();

//       const res = await fetch("http://localhost:5000/api/v1/leads", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const endTime = Date.now();
//       console.log(`⏱️ Request took: ${endTime - startTime}ms`);

//       const data = await res.json();
//       console.log("📥 Server response:", data);

//       if (res.ok) {
//         console.log("✅ Lead created successfully!");
//         console.log("📊 New lead data:", data.lead);

//         setResponse({
//           type: "success",
//           message: "Lead created successfully!",
//         });

//         // Clear form
//         setFormData({ name: "", email: "", phone: "" });

//         // Check if notification was sent
//         console.log("🔔 Checking if notification was triggered...");
//         console.log(
//           "   This should trigger sendNotification function on backend",
//         );
//         console.log("   Check backend console for: 'Notifications sent:'");
//       } else {
//         console.error("❌ Server error:", data);
//         setResponse({
//           type: "error",
//           message: data.message || "Something went wrong",
//         });
//       }
//     } catch (error) {
//       console.error("❌ Network error:", error);
//       setResponse({
//         type: "error",
//         message: "Failed to connect to server",
//       });
//     } finally {
//       setLoading(false);
//       console.log("🏁 Form submission completed");
//     }
//   };

//   return (
//     <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
//       <h2>📋 Lead Notification App</h2>

//       {/* Token Display */}
//       {fcmToken && (
//         <div
//           style={{
//             marginTop: "20px",
//             padding: "15px",
//             background: "#f0f0f0",
//             borderRadius: "5px",
//             wordBreak: "break-all",
//             borderLeft: "4px solid #4caf50",
//           }}
//         >
//           <strong>🔑 FCM Token:</strong>
//           <p style={{ fontSize: "12px", margin: "5px 0 0" }}>{fcmToken}</p>
//           <small>
//             ✅ Token generated successfully - Check console for details
//           </small>
//         </div>
//       )}

//       {/* Lead Form */}
//       <form onSubmit={handleSubmit} style={{ marginTop: "30px" }}>
//         <h3>Create New Lead</h3>

//         <div style={{ marginBottom: "15px" }}>
//           <label style={{ display: "block", marginBottom: "5px" }}>Name:</label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//             style={{
//               width: "100%",
//               padding: "8px",
//               borderRadius: "4px",
//               border: "1px solid #ddd",
//             }}
//           />
//         </div>

//         <div style={{ marginBottom: "15px" }}>
//           <label style={{ display: "block", marginBottom: "5px" }}>
//             Email:
//           </label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             style={{
//               width: "100%",
//               padding: "8px",
//               borderRadius: "4px",
//               border: "1px solid #ddd",
//             }}
//           />
//         </div>

//         <div style={{ marginBottom: "15px" }}>
//           <label style={{ display: "block", marginBottom: "5px" }}>
//             Phone:
//           </label>
//           <input
//             type="tel"
//             name="phone"
//             value={formData.phone}
//             onChange={handleChange}
//             required
//             style={{
//               width: "100%",
//               padding: "8px",
//               borderRadius: "4px",
//               border: "1px solid #ddd",
//             }}
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           style={{
//             padding: "10px 20px",
//             background: loading ? "#ccc" : "#4caf50",
//             color: "white",
//             border: "none",
//             borderRadius: "4px",
//             cursor: loading ? "not-allowed" : "pointer",
//           }}
//         >
//           {loading ? "Submitting..." : "Submit Lead"}
//         </button>
//       </form>

//       {/* Response Message */}
//       {response && (
//         <div
//           style={{
//             marginTop: "20px",
//             padding: "15px",
//             background: response.type === "success" ? "#d4edda" : "#f8d7da",
//             color: response.type === "success" ? "#155724" : "#721c24",
//             borderRadius: "5px",
//             border: `1px solid ${response.type === "success" ? "#c3e6cb" : "#f5c6cb"}`,
//           }}
//         >
//           {response.type === "success" ? "✅ " : "❌ "}
//           {response.message}
//         </div>
//       )}

//       {/* Notification Display */}
//       {notification && (
//         <div
//           style={{
//             marginTop: "20px",
//             padding: "15px",
//             background: "#e3f2fd",
//             borderRadius: "5px",
//             border: "1px solid #2196f3",
//           }}
//         >
//           <h4>🔔 New Notification Received!</h4>
//           <p>
//             <strong>{notification.title}</strong>
//           </p>
//           <p>{notification.body}</p>
//         </div>
//       )}

//       {/* Debug Info */}
//       <div
//         style={{
//           marginTop: "30px",
//           padding: "15px",
//           background: "#f8f9fa",
//           borderRadius: "5px",
//         }}
//       >
//         <h4>🔧 Debug Information:</h4>
//         <p>1. Open Browser Console (F12) to see detailed logs</p>
//         <p>2. Check if notification permission is granted</p>
//         <p>3. Check backend console for notification logs</p>
//         <p>4. After form submit, check for "Notifications sent:" in backend</p>
//       </div>
//     </div>
//   );
// }

// export default App;
