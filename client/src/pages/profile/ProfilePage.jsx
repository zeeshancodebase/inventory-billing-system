import React, { useState, useEffect } from "react";
import "./ProfilePage.css";
import { ClipLoader } from "react-spinners";
import { useAuth } from "../../context/auth";
import { CiEdit } from "react-icons/ci";
import { FaTimes } from "react-icons/fa";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Spinner from "../../components/Spinner";
import AdminOnly from "../../utils/AdminOnly";

const ProfilePage = () => {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    fullName: "",
    phoneNumber: "",
    role: "",
    email: "",
    address: "",
    salary: "",
  });

  const isChanged = JSON.stringify(user) !== JSON.stringify(profile);
  // Initialize profile state from user data once user is available
  useEffect(() => {
    if (user) {
      setProfile({
        fullName: user.fullName || "",
        phoneNumber: user.phoneNumber || "",
        role: user.role || "",
        email: user.email || "",
        address: user.address || "",
        salary: user.salary || "",
        isOwner: user.isOwner
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { fullName, phoneNumber, email, address, salary } = profile;

    if (!fullName || !phoneNumber || !email) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.patch(`/api/updateStaff/${user._id}`, {
        fullName,
        phoneNumber,
        email,
        address,
        salary,
      });

      const updated = res.data.user;

      setProfile({
        fullName: updated.fullName || "",
        phoneNumber: updated.phoneNumber || "",
        role: updated.role || "",
        email: updated.email || "",
        address: updated.address || "",
        salary: updated.salary || "",
      });

      setEditMode(false); // exit edit mode

      toast.success("Your profile has been updated successfully!!");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(
        error.response?.data?.error || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // reset profile to user data and exit edit mode
    setProfile({
      fullName: user.fullName || "",
      phoneNumber: user.phoneNumber || "",
      role: user.role || "",
      email: user.email || "",
      address: user.address || "",
      salary: user.salary || "",
    });
    setEditMode(false);
  };


  if (!user)
    return (
      <div className="loading-indicator">
        <Spinner />
        <p style={{ fontSize: "18px", fontWeight: "bold" }}>
          ⏳ Loading Profile...
        </p>
      </div>
    );

  return (
    <div className="page-wrapper">
      <div
        className="profile-container"
        role="main"
        aria-label="Admin Profile Page"
      >
        <div className="profile-pic-container" aria-hidden="true">
          {profile.fullName.charAt(0).toUpperCase()}
        </div>
        <h2 className="profile-title">{profile.fullName}</h2>
        <p className="profile-subtitle">
          {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
        </p>

        {!editMode ? (
          <>
            <div className="profile-info">
              {/* <p>
              <strong>Role:</strong> {profile.role}
            </p> */}
              <p>
                <strong>Phone Number:</strong> {profile.phoneNumber}
              </p>

              <p>
                <strong>Email:</strong> {profile.email}
              </p>
              <p>
                <strong>Address:</strong> {profile.address || "-"}
              </p>
              <p>
                <strong>Salary (₹):</strong> {profile.salary || "-"}
              </p>
            </div>
            <AdminOnly isAdmin={profile.isOwner}>
              <button
                className="edit-profile-btn"
                onClick={() => setEditMode(true)}
                aria-label="Edit Profile"
              >
                <CiEdit style={{ marginRight: "2px" }} size={22} />
                Edit
              </button>
            </AdminOnly>
          </>
        ) : (
          <AdminOnly isAdmin={profile.isOwner}>
            <form onSubmit={handleSubmit} noValidate>
              <div className="profile-form-group">
                <label htmlFor="fullName" className="profile-label">
                  Full Name *
                </label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  className="profile-input"
                  value={profile.fullName}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  placeholder="Your full name"
                />
              </div>

              <div className="profile-form-group">
                <label htmlFor="phoneNumber" className="profile-label">
                  Phone Number *
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  name="phoneNumber"
                  className="profile-input"
                  value={profile.phoneNumber}
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  required
                />
              </div>

              <div className="profile-form-group">
                <label htmlFor="email" className="profile-label">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="profile-input"
                  value={profile.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                />
              </div>

              <div className="profile-form-group">
                <label htmlFor="address" className="profile-label">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  className="profile-textarea"
                  value={profile.address}
                  onChange={handleChange}
                  placeholder="Your address"
                />
              </div>

              <div className="profile-form-group">
                <label htmlFor="salary" className="profile-label">
                  Salary (₹)
                </label>
                <input
                  id="salary"
                  type="number"
                  name="salary"
                  className="profile-input"
                  value={profile.salary}
                  onChange={handleChange}
                  min="0"
                  placeholder="Your salary"
                />
              </div>

              <button
                className="profile-btn"
                disabled={!isChanged || loading}
                type="submit"
              >
                {loading ? (
                  <>
                    <ClipLoader color="#fff" size={20} />
                    <span style={{ marginLeft: "8px" }}>Saving...</span>
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
              <button
                type="button"
                className="edit-profile-btn profile-btn-cancel"
                onClick={handleCancel}
              >
                <FaTimes /> Cancel
              </button>
            </form>
          </AdminOnly>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
