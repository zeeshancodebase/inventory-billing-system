// pages/ManageStaff/ManageStaff.jsx
import React, { useState, useEffect } from "react";
import "./ManageStaff.css";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { FaRegCirclePlay } from "react-icons/fa6";
import Spinner from "../../components/Spinner";
import axios from "../../api/axios";

const ManageStaff = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPast, setShowPast] = useState(false);
  const [staffLoading, setStaffLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editStaffId, setEditStaffId] = useState(null);

  const [newStaff, setNewStaff] = useState({
    fullName: "",
    phoneNumber: "",
    role: "",
    address: "",
    email: "",
    salary: "",
  });

  // 🟢 Fetch all staff from API
  useEffect(() => {
    const fetchStaff = async () => {
      setStaffLoading(true);
      try {
        const res = await axios.get("/api/getAllStaff");
        setStaffList(res.data.users || []);
        // console.log("Fetched staff:", res.data.users);
      } catch (error) {
        toast.error(error || "Faild to fetch Staff");
        console.error("Failed to fetch staff:", error);
      } finally {
        setStaffLoading(false); // ✅ stop loading regardless of success/failure
      }
    };

    fetchStaff();
  }, []);

  // 🔵 Handle Add Staff
  const handleAdd = async () => {
    const { fullName, phoneNumber, role, email } = newStaff;

    if (!fullName || !phoneNumber || !role || !email) {
      toast.error("Please fill required fields.");
      return;
    }

    setLoading(true);

    try {
      if (isEditing) {
        // 🔁 Update Staff
        const res = await axios.patch(
          `/api/updateStaff/${editStaffId}`,
          newStaff
        );
        const updated = res.data.user;

        // update staff list in-place
        setStaffList((prev) =>
          prev.map((staff) => (staff._id === editStaffId ? updated : staff))
        );

        Swal.fire({
          icon: "success",
          title: "Staff Updated",
          text: `${updated.fullName} has been updated successfully.`,
        });
      } else {
        // ➕ Add Staff
        const res = await axios.post("/api/addStaff", newStaff);
        setStaffList([...staffList, res.data.staff]);

        Swal.fire({
          icon: "success",
          title: "Staff Added",
          text: `${fullName} has been added as a ${role} with phone number ${phoneNumber}.`,
        });
      }

      // reset form and editing mode
      setNewStaff({
        fullName: "",
        phoneNumber: "",
        role: "",
        address: "",
        email: "",
        salary: "",
      });
      setIsEditing(false);
      setEditStaffId(null);
    } catch (error) {
      console.error("Error in add/edit:", error);
      toast.error(error.response?.data?.error || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // const handleAdd = async () => {
  //   const { fullName, phoneNumber, role, email } = newStaff;

  //   if (!fullName || !phoneNumber || !role || !email) {
  //     toast.error("Please fill required fields.");
  //     return;
  //   }
  //   setLoading(true);
  //   try {
  //     const res = await axios.post("/api/addStaff", {
  //       fullName: newStaff.fullName,
  //       phoneNumber: newStaff.phoneNumber,
  //       role: newStaff.role,
  //       address: newStaff.address,
  //       email: newStaff.email,
  //       salary: newStaff.salary,
  //     });

  //     setStaffList([...staffList, res.data.staff]);

  //     // console.log("Staff added successfully:", res.data.staff);

  //     Swal.fire({
  //       icon: "success",
  //       title: "Staff Added",
  //       text: `${fullName} has been added as a ${role} with phone number ${phoneNumber}.`,
  //     });

  //     setNewStaff({
  //       fullName: "",
  //       phoneNumber: "",
  //       role: "",
  //       address: "",
  //       email: "",
  //       salary: "",
  //     });
  //   } catch (error) {
  //     console.error("Failed to add staff:", error);
  //     const errorMessage =
  //       error.response?.data?.error || "An unknown error occurred.";
  //     toast.error(errorMessage);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleEdit = (staff) => {
    setNewStaff({
      fullName: staff.fullName || "",
      phoneNumber: staff.phoneNumber || "",
      role: staff.role || "",
      address: staff.address || "",
      email: staff.email || "",
      salary: staff.salary || "",
    });
    setIsEditing(true);
    setEditStaffId(staff._id);
  };

  const handleDeactivate = async (id) => {
    const result = await Swal.fire({
      title: "Deactivate Staff Member?",
      text: "This action will deactivate the staff member, restricting access to the system and sales functions.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, deactivate",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.patch(`/api/deactivateStaff/${id}`);
      toast.success("Staff member marked as inactive!");

      // Update UI: Remove from active list
      setStaffList((prev) => prev.filter((staff) => staff._id !== id));
    } catch (error) {
      console.error("Failed to deactivate staff:", error);
      toast.error("Failed to mark staff as inactive.");
    }
  };

  const handleReactivate = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This staff member will be marked as active and regain access to the system.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, reactivate",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axios.patch(`/api/reactivateStaff/${id}`);
      const updatedStaff = res.data.staff;
      toast.success("Staff member marked as active!");

      setStaffList((prev) => {
        const filtered = prev.filter((staff) => staff && staff._id !== id);
        return [...filtered, updatedStaff];
      });
    } catch (error) {
      console.error("Failed to reactivate staff:", error);
      toast.error("Failed to mark staff as active.");
    }
  };

  // 🔴 Handle Delete Staff
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the staff member.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`/api/deleteStaff/${id}`);
      setStaffList(staffList.filter((s) => s._id !== id));
      toast.success("Staff member deleted successfully!");
    } catch (error) {
      console.error("Failed to delete staff:", error);
    }
  };

  return (
    <div style={{ padding: "32px" }}>
      <h2>🧍‍♂️ Manage Staff</h2>

      <div className="form-container">
        <div className="addProd-form-group">
          <div className="addProd-input-group">
            <label htmlFor="name">Staff Name *</label>
            <input
              type="text"
              placeholder="Staff Name"
              value={newStaff.fullName}
              onChange={(e) =>
                setNewStaff({ ...newStaff, fullName: e.target.value })
              }
              style={{ marginRight: "10px" }}
            />
          </div>
          <div className="addProd-input-group">
            <label htmlFor="mobile">Mobile Number *</label>
            <input
              type="text"
              placeholder="Mobile Number"
              value={newStaff.phoneNumber}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d{0,10}$/.test(val)) {
                  setNewStaff({ ...newStaff, phoneNumber: val });
                }
              }}
              style={{ marginRight: "10px" }}
              maxLength={10}
              inputMode="numeric"
            />
          </div>
        </div>
        <div className="addProd-form-group">
          <div className="addProd-input-group">
            <label htmlFor="role">Role *</label>
            <select
              value={newStaff.role}
              onChange={(e) =>
                setNewStaff({ ...newStaff, role: e.target.value })
              }
            >
              <option value="" disabled selected>
                Select Role
              </option>
              <option value="manager">Manager</option>
              <option value="salesMan">Sales Man</option>
            </select>
          </div>
          <div className="addProd-input-group">
            <label htmlFor="address">Address </label>
            <input
              type="text"
              placeholder="Address"
              value={newStaff.address}
              onChange={(e) =>
                setNewStaff({ ...newStaff, address: e.target.value })
              }
              style={{ marginRight: "10px" }}
            />
          </div>
        </div>
        <div className="addProd-form-group">
          <div className="addProd-input-group" style={{ position: "relative" }}>
            <label htmlFor="email">Email *</label>
            <input
              placeholder="Enter the email"
              value={newStaff.email}
              onChange={(e) =>
                setNewStaff({ ...newStaff, email: e.target.value })
              }
            />
          </div>

          <div className="addProd-input-group">
            <label htmlFor="salary">Salary </label>
            <input
              type="Number"
              placeholder="₹ Salary"
              value={newStaff.salary}
              onChange={(e) =>
                setNewStaff({ ...newStaff, salary: e.target.value })
              }
              style={{ marginRight: "10px" }}
            />
          </div>
        </div>
        <div className="addProd-btn">
          <button onClick={handleAdd} disabled={loading}>
            {loading ? (
              <>
                <ClipLoader color="#fff" size={20} />
                <span style={{ marginLeft: "8px" }}>
                  {isEditing ? "Updating..." : "Adding..."}
                </span>
              </>
            ) : isEditing ? (
              "Update Staff"
            ) : (
              "Add Staff"
            )}
          </button>
          {isEditing && (
            <button
              onClick={() => {
                setIsEditing(false);
                setEditStaffId(null);
                setNewStaff({
                  fullName: "",
                  phoneNumber: "",
                  role: "",
                  address: "",
                  email: "",
                  salary: "",
                });
              }}
              className="cancel-edit-btn"
              style={{
                marginLeft: "10px",
                backgroundColor: "#ccc",
                color: "#000",
              }}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      <table
        width="100%"
        border="1"
        cellPadding="8"
        style={{ borderCollapse: "collapse", backgroundColor: "white" }}
      >
        <thead style={{ backgroundColor: "#f0f0f0" }}>
          <tr>
            <th>Name</th>
            <th>Mobile No</th>
            <th>Role</th>
            <th>Salary</th>
            <th>Email</th>
            <th>Address</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {staffLoading ? (
            <td colSpan="8">
              <div className="loading-indicator">
                <Spinner />
                <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                  ⏳ Loading Staff...
                </p>
              </div>
            </td>
          ) : (
            <>
              {staffList.filter((s) => s && s.status === "active" && !s.isAdmin)
                .map((staff) => (
                  <tr key={staff.id}>
                    <td>{staff.fullName}</td>
                    <td>{staff.phoneNumber}</td>
                    <td>{staff.role}</td>
                    <td>{staff.salary}</td>
                    <td>{staff.email}</td>
                    <td>{staff.address}</td>
                    <td>
                      {staff.status === "active" ? "✅ Active" : "❌ Inactive"}
                    </td>
                    <td>
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(staff)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDeactivate(staff._id)}
                      >
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                ))}
            </>
          )}
          {staffList.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No staff members found.
              </td>
            </tr>
          )}
          {/* Toggle Row */}
          <tr
            style={{
              cursor: "pointer",
              backgroundColor: "#f6f6f6",
              textAlign: "center",
            }}
            onClick={() => setShowPast(!showPast)}
          >
            <td colSpan="8">
              {showPast ? "🔽 Hide Past Members" : "🕰️ Show Past Members"}
            </td>
          </tr>
        </tbody>
      </table>
      {/* 🔴 Past Members Table (Collapsed Section) */}
      {showPast && (
        <table
          width="100%"
          border="1"
          cellPadding="8"
          style={{
            borderCollapse: "collapse",
            backgroundColor: "#fafafa",
            marginTop: "10px",
          }}
        >
          <thead style={{ backgroundColor: "#e9e9e9" }}>
            <tr>
              <th>Name</th>
              <th>Mobile No</th>
              <th>Role</th>
              <th>Salary</th>
              <th>Email</th>
              <th>Address</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList
              .filter((s) => s && s.status === "inactive")
              .map((staff) => (
                <tr key={staff._id} style={{ color: "#888" }}>
                  <td>{staff.fullName}</td>
                  <td>{staff.phoneNumber}</td>
                  <td>{staff.role}</td>
                  <td>{staff.salary}</td>
                  <td>{staff.email}</td>
                  <td>{staff.address}</td>
                  <td>❌ Inactive</td>
                  <td>
                    <button
                      className="edit-button"
                      onClick={() => handleReactivate(staff._id)}
                    >
                      <FaRegCirclePlay />
                    </button>
                    <button
                      className="delete-button"
                      disabled
                      style={{ cursor: "not-allowed" }}
                      onClick={() => handleDelete(staff._id)}
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageStaff;
