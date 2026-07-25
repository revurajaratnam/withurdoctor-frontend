import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useSelector } from "react-redux";

import NavbarComp from "../../components/Navbar";
import { useGetdrdataQuery } from "../../features/auth/services/drDataApi";
import { useAppointmentBookingMutation } from "../../features/auth/services/AppoApi";

export default function Appointments() {
  const navigate = useNavigate();

  // "myself" is selected by default
  const [selectedPatientType, setSelectedPatientType] =
    useState("myself");

  const [patientDetails, setPatientDetails] = useState({
    fullName: "",
    mobile: "",
    email: "",
  });

  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingError, setBookingError] = useState("");

  // Doctor ID from /appointments/:doctorId
  const { doctorId } = useParams();

  // Date and time from URL query parameters
  const [searchParams] = useSearchParams();

  const appointmentDate = searchParams.get("date") || "";
  const timeSlot = searchParams.get("time") || "";

  // Logged-in patient data
  const { user, token } = useSelector((state) => state.dr);

  const {
    data: doctorResponse,
    isLoading: isDoctorLoading,
    isError: isDoctorError,
  } = useGetdrdataQuery();

  const [
    appointmentBooking,
    { isLoading: isBooking },
  ] = useAppointmentBookingMutation();

  // Your backend returns fullname, not only name
  useEffect(() => {
    if (selectedPatientType === "myself") {
      setPatientDetails({
        fullName: user?.fullname || user?.name || "",
        mobile: user?.mobile || user?.phone || "",
        email: user?.email || "",
      });
    } else {
      setPatientDetails({
        fullName: "",
        mobile: "",
        email: "",
      });
    }
  }, [selectedPatientType, user]);

  // Handle API response formats
  const doctors = Array.isArray(doctorResponse)
    ? doctorResponse
    : Array.isArray(doctorResponse?.data)
    ? doctorResponse.data
    : [];

  // Find selected doctor
  const selectedDoctor = doctors.find(
    (doctor) =>
      String(doctor._id) === String(doctorId) ||
      String(doctor.id) === String(doctorId)
  );

  const handlePatientTypeChange = (type) => {
    setSelectedPatientType(type);
    setBookingMessage("");
    setBookingError("");
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setPatientDetails((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setBookingMessage("");
    setBookingError("");

    if (!token) {
      setBookingError(
        "Please log in before booking an appointment."
      );
      return;
    }

    if (!appointmentDate || !timeSlot) {
      setBookingError(
        "Appointment date or time slot is missing. Please select the slot again."
      );
      return;
    }

    if (
      !patientDetails.fullName.trim() ||
      !patientDetails.mobile.trim() ||
      !patientDetails.email.trim()
    ) {
      setBookingError("Please enter all required patient details.");
      return;
    }

    const appointmentPayload = {
      doctorId: selectedDoctor._id || selectedDoctor.id,

      // Backend should normally get patient ID from JWT token
      patientId: user?._id || user?.id,

      bookedFor: selectedPatientType,

      patientName: patientDetails.fullName.trim(),
      patientMobile: patientDetails.mobile.trim(),
      patientEmail: patientDetails.email.trim(),

      appointmentDate,
      timeSlot,
    };

    console.log("Appointment payload:", appointmentPayload);

    try {
      const response = await appointmentBooking(
        appointmentPayload
      ).unwrap();

      setBookingMessage(
        response?.message || "Appointment booked successfully."
      );

      // Change this route to your confirmation page
      // navigate("/booking-confirmed", {
      //   state: {
      //     appointment: appointmentPayload,
      //     response,
      //   },
      // });
    } catch (error) {
      console.error("Appointment booking failed:", error);

      setBookingError(
        error?.data?.message ||
          error?.message ||
          "Appointment booking failed. Please try again."
      );
    }
  };

  if (isDoctorLoading) {
    return (
      <p className="container mt-5">
        Loading doctor details...
      </p>
    );
  }

  if (isDoctorError) {
    return (
      <p className="container mt-5 text-danger">
        Failed to load doctor details.
      </p>
    );
  }

  if (!selectedDoctor) {
    return (
      <p className="container mt-5 text-danger">
        Doctor not found. Doctor ID:{" "}
        {doctorId || "undefined"}
      </p>
    );
  }

  return (
    <div>
      <NavbarComp />

      <main className="d-flex">
        <section>
              <h3>Dr.{selectedDoctor.fullname}</h3>
        </section>
        <section className="container mt-4 ">
          <h4>
            Appointment with Dr.{" "}
            {selectedDoctor.fullname}
          </h4>

          <div className="card p-3 my-3">
            <p className="mb-2">
              <strong>Appointment date:</strong>{" "}
              {appointmentDate || "Not selected"}
            </p>

            <p className="mb-0">
              <strong>Time slot:</strong>{" "}
              {timeSlot || "Not selected"}
            </p>
          </div>

          <hr />

          <h2>Patient Details</h2>

          {/* Myself is selected by default */}
          <div className="mb-2">
            <input
              type="radio"
              id="myself"
              name="who"
              value="myself"
              checked={selectedPatientType === "myself"}
              onChange={() =>
                handlePatientTypeChange("myself")
              }
            />

            <label htmlFor="myself" className="ms-2">
              {user?.fullname ||
                user?.name ||
                "Myself"}
            </label>
          </div>

          <div className="mb-3">
            <input
              type="radio"
              id="someone"
              name="who"
              value="someone"
              checked={selectedPatientType === "someone"}
              onChange={() =>
                handlePatientTypeChange("someone")
              }
            />

            <label htmlFor="someone" className="ms-2">
              Someone Else
            </label>
          </div>

          <form onSubmit={handleSubmit}>
            {selectedPatientType === "someone" && (
              <p>
                Please provide the patient&apos;s
                information:
              </p>
            )}

            <div className="mb-3">
              <label htmlFor="fullName">
                Patient&apos;s Full Name
                <sup className="text-danger">*</sup>
              </label>

              <br />

              <input
                id="fullName"
                name="fullName"
                type="text"
                className="form-control"
                style={{ maxWidth: "400px" }}
                placeholder="Enter patient full name"
                value={patientDetails.fullName}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="mobile">
                Mobile
                <sup className="text-danger">*</sup>
              </label>

              <br />

              <input
                id="mobile"
                name="mobile"
                type="tel"
                className="form-control"
                style={{ maxWidth: "400px" }}
                placeholder="Enter mobile number"
                value={patientDetails.mobile}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email">
                Patient Email
                <sup className="text-danger">*</sup>
              </label>

              <br />

              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                style={{ maxWidth: "400px" }}
                placeholder="Enter patient email ID"
                value={patientDetails.email}
                onChange={handleInputChange}
                readOnly={
                  selectedPatientType === "myself"
                }
              />
            </div>

            {bookingError && (
              <div
                className="alert alert-danger"
                style={{ maxWidth: "400px" }}
              >
                {bookingError}
              </div>
            )}

            {bookingMessage && (
              <div
                className="alert alert-success"
                style={{ maxWidth: "400px" }}
              >
                {bookingMessage}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-info text-white"
              style={{ width: "400px", maxWidth: "100%" }}
              disabled={isBooking}
            >
              {isBooking
                ? "Booking Appointment..."
                : "Confirm Clinic Visit"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}