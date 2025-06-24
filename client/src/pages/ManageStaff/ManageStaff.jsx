// pages/ManageStaff/ManageStaff.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManageStaff.css";
import { FaEdit, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from 'sweetalert2';


const ManageStaff = () => {
  const [staffList, setStaffList] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const [newStaff, setNewStaff] = useState({
    fullName: "",
    phoneNumber: "",
    role: "",
    address: "",
    password: "",
    salary: "",
  });

  // 🟢 Fetch all staff from API
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/getAllStaff");
        setStaffList(res.data.users || []);
        console.log("Fetched staff:", res.data.users);
      } catch (error) {
        console.error("Failed to fetch staff:", error);
      }
    };

    fetchStaff();
  }, []);

  // 🔵 Handle Add Staff
  const handleAdd = async () => {
    const { fullName, phoneNumber, role, password } = newStaff;

    if (!fullName || !phoneNumber || !role || !password) {
      alert("Please fill required fields.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/addStaff", {
        fullName: newStaff.fullName,
        phoneNumber: newStaff.phoneNumber,
        role: newStaff.role,
        address: newStaff.address,
        password: newStaff.password,
        salary: newStaff.salary,
      });

      setStaffList([...staffList, res.data.staff]);

      // console.log("Staff added successfully:", res.data.staff);

      Swal.fire({
        icon: "success",
        title: "Staff Added",
        text: `${fullName} has been added as a ${role} with phone number ${phoneNumber}.`,
      });

      setNewStaff({
        fullName: "",
        phoneNumber: "",
        role: "",
        address: "",
        password: "",
        salary: "",
      });
    } catch (error) {
      console.error("Failed to add staff:", error);
    }
  };

  // 🔴 Handle Delete Staff
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this staff member?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/deleteStaff/${id}`);
      setStaffList(staffList.filter((s) => s._id !== id));
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
              type="Number"
              placeholder="Mobile Number"
              value={newStaff.phoneNumber}
              onChange={(e) =>
                setNewStaff({ ...newStaff, phoneNumber: e.target.value })
              }
              style={{ marginRight: "10px" }}
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
          {/* <div className="addProd-input-group">
            <label htmlFor="address">Password *</label>
            <input
              type="password"
              placeholder="Password"
              value={newStaff.password}
              onChange={(e) =>
                setNewStaff({ ...newStaff, password: e.target.value })
              }
              style={{ marginRight: "10px" }}
            />
          </div> */}
          <div className="addProd-input-group" style={{ position: "relative" }}>
            <label htmlFor="password">PIN *</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="6-Digit PIN"
              value={newStaff.password}
              // onChange={(e) =>
              //   setNewStaff({ ...newStaff, password: e.target.value })
              // }
              onChange={(e) => {
                const pin = e.target.value;
                if (/^\d*$/.test(pin) && pin.length <= 6) {
                  setNewStaff({ ...newStaff, password: pin });
                }
              }}
              style={{ paddingRight: "35px" }} // leave space for icon
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              style={{
                position: "absolute",
                right: "14px",
                top: "44px", // aligns with input line
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#555",
                fontSize: "16px",
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
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
          <button onClick={handleAdd}>Add Staff</button>
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
            <th>Address</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {staffList.map((staff) => (
            <tr key={staff.id}>
              <td>{staff.fullName}</td>
              <td>{staff.phoneNumber}</td>
              <td>{staff.role}</td>
              <td>{staff.salary}</td>
              <td>{staff.address}</td>
              <td>{staff.active ? "✅ Active" : "❌ Inactive"}</td>
              <td>
                <button className="edit-button">
                  <FaEdit />
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(staff._id)}
                >
                  <MdDelete />
                </button>
              </td>
            </tr>
          ))}
          {staffList.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No staff members found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageStaff;
