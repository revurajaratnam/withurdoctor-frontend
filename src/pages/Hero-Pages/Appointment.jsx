import { useEffect, useMemo, useState } from "react";
import {
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useSelector } from "react-redux";

import NavbarComp from "../../components/Navbar";
import { useGetdrdataQuery } from "../../features/auth/services/drDataApi";
import { useAppointmentBookingMutation } from "../../features/auth/services/AppoApi";

const fallbackImage =
  "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png";

function getDoctorImage(doctor) {
  const image =
    doctor?.profileImage ||
    doctor?.profilephoto ||
    doctor?.profilePhoto;

  if (!image) {
    return fallbackImage;
  }

  if (image.startsWith("http")) {
    return image;
  }

  return `http://localhost:4545/uploads/${image}`;
}

function getDoctorsArray(response) {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }

  if (Array.isArray(response?.doctors)) {
    return response.doctors;
  }

  return [];
}

function getSingleDoctor(response) {
  if (!response || Array.isArray(response)) {
    return null;
  }

  if (
    response?._id ||
    response?.id ||
    response?.doctorId
  ) {
    return response;
  }

  if (
    response?.data &&
    !Array.isArray(response.data) &&
    (
      response.data?._id ||
      response.data?.id ||
      response.data?.doctorId
    )
  ) {
    return response.data;
  }

  if (
    response?.doctor &&
    !Array.isArray(response.doctor)
  ) {
    return response.doctor;
  }

  if (
    response?.data?.doctor &&
    !Array.isArray(response.data.doctor)
  ) {
    return response.data.doctor;
  }

  return null;
}

function doctorIdMatches(doctor, doctorId) {
  if (!doctor || !doctorId) {
    return false;
  }

  const availableIds = [
    doctor?._id,
    doctor?.id,
    doctor?.doctorId,
    doctor?.userId,
    doctor?.accountId,
    doctor?.doctor?._id,
    doctor?.user?._id,
  ];

  return availableIds.some(
    (id) => id && String(id) === String(doctorId)
  );
}

export default function Appointments() {
  const { doctorId } = useParams();
  const [searchParams] = useSearchParams();

  const appointmentDate =
    searchParams.get("date") || "";

  const timeSlot =
    searchParams.get("time") || "";

  const { user, token } = useSelector(
    (state) => state.dr
  );

  const [selectedPatientType, setSelectedPatientType] =
    useState("myself");

  const [patientDetails, setPatientDetails] = useState({
    fullName: "",
    mobile: "",
    email: "",
  });

  const [bookingMessage, setBookingMessage] =
    useState("");

  const [bookingError, setBookingError] =
    useState("");

  /*
   * Important:
   * Pass the doctor ID to the API instead of requesting
   * the normal paginated doctors list.
   */
  const {
    data: doctorResponse,
    isLoading: isDoctorLoading,
    isFetching: isDoctorFetching,
    isError: isDoctorError,
    error: doctorError,
  } = useGetdrdataQuery(
    {
      id: doctorId,
    },
    {
      skip: !doctorId,
    }
  );
  const doctorinfo = Array.isArray(doctorResponse)?doctorResponse:Array.isArray(doctorResponse?.data) ? doctorResponse.data : [];
  const [
    appointmentBooking,
    {
      isLoading: isBooking,
    },
  ] = useAppointmentBookingMutation();

  useEffect(() => {
    if (selectedPatientType === "myself") {
      setPatientDetails({
        fullName:
          user?.fullname ||
          user?.fullName ||
          user?.name ||
          "",
        mobile:
          user?.mobile ||
          user?.phone ||
          user?.mobileNumber ||
          "",
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

  const selectedDoctor = useMemo(() => {
    const singleDoctor =
      getSingleDoctor(doctorResponse);

    if (
      singleDoctor &&
      doctorIdMatches(singleDoctor, doctorId)
    ) {
      return singleDoctor;
    }

    const doctors =
      getDoctorsArray(doctorResponse);

    return (
      doctors.find((doctor) =>
        doctorIdMatches(doctor, doctorId)
      ) || null
    );
  }, [doctorResponse, doctorId]);

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

    if (!doctorId) {
      setBookingError(
        "Doctor ID is missing. Please select the doctor again."
      );
      return;
    }

    if (!selectedDoctor) {
      setBookingError(
        "Doctor details are unavailable. Please select the doctor again."
      );
      return;
    }

    if (!appointmentDate || !timeSlot) {
      setBookingError(
        "Appointment date or time slot is missing. Please select the slot again."
      );
      return;
    }

    if (!patientDetails.fullName.trim()) {
      setBookingError(
        "Please enter the patient's full name."
      );
      return;
    }

    if (!patientDetails.mobile.trim()) {
      setBookingError(
        "Please enter the patient's mobile number."
      );
      return;
    }

    if (!/^[6-9]\d{9}$/.test(
      patientDetails.mobile.trim()
    )) {
      setBookingError(
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    if (!patientDetails.email.trim()) {
      setBookingError(
        "Please enter the patient's email address."
      );
      return;
    }

    const appointmentPayload = {
      doctorId:
        selectedDoctor?._id ||
        selectedDoctor?.id ||
        selectedDoctor?.doctorId ||
        doctorId,

      /*
       * Normally, the backend should read patientId
       * from the verified JWT token.
       */
      doctorName:
        selectedDoctor?.fullname ||
        "",
      
      doctorEmail:
      selectedDoctor?.email ||
      "",
      patientId:
        user?._id ||
        user?.id ||
        user?.userId,

      bookedFor: selectedPatientType,

      patientName:
        patientDetails.fullName.trim(),

      patientMobile:
        patientDetails.mobile.trim(),

      patientEmail:
        patientDetails.email.trim(),

      appointmentDate,
      timeSlot,
    };

    console.log(
      "Doctor ID from URL:",
      doctorId
    );

    console.log(
      "Selected doctor:",
      selectedDoctor
    );

    console.log(
      "Appointment payload:",
      appointmentPayload
    );

    try {
      const response =
        await appointmentBooking(
          appointmentPayload
        ).unwrap();

      setBookingMessage(
        response?.message ||
          "Appointment booked successfully."
      );

      setBookingError("");
    } catch (error) {
      console.error(
        "Appointment booking failed:",
        error
      );

      setBookingError(
        error?.data?.message ||
          error?.data?.error ||
          error?.message ||
          "Appointment booking failed. Please try again."
      );
    }
  };

  if (!doctorId) {
    return (
      <div>
        <NavbarComp />

        <div className="container mt-5">
          <div className="alert alert-danger">
            Doctor ID is missing from the URL.
          </div>
        </div>
      </div>
    );
  }

  if (isDoctorLoading || isDoctorFetching) {
    return (
      <div>
        <NavbarComp />

        <div className="container mt-5">
          <p>Loading doctor details...</p>
        </div>
      </div>
    );
  }

  if (isDoctorError) {
    return (
      <div>
        <NavbarComp />

        <div className="container mt-5">
          <div className="alert alert-danger">
            <h5>
              Failed to load doctor details
            </h5>

            <p className="mb-1">
              Doctor ID: {doctorId}
            </p>

            <p className="mb-0">
              {doctorError?.data?.message ||
                doctorError?.error ||
                "Unable to connect to the server."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedDoctor) {
    return (
      <div>
        <NavbarComp />

        <div className="container mt-5">
          <div className="alert alert-danger">
            <h5>Doctor not found</h5>

            <p className="mb-1">
              Doctor ID: {doctorId}
            </p>

            <p className="mb-0">
              The doctor API did not return a doctor
              matching this ID.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavbarComp />

      <main className="container mt-4">
        <div className="row g-4">
          <section className="col-lg-4">
            <div className="card p-3">
              <div className="d-flex align-items-center gap-3">
                <img
                  src={getDoctorImage(selectedDoctor)}
                  alt={
                    selectedDoctor?.fullname
                      ? `Dr. ${selectedDoctor.fullname}`
                      : "Doctor profile"
                  }
                  width="100"
                  height="100"
                  style={{
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                  onError={(event) => {
                    event.currentTarget.src =
                      fallbackImage;
                  }}
                />

                <div>
                  <h5 className="mb-1">
                    Dr.{" "}
                    {selectedDoctor?.fullname ||
                      selectedDoctor?.fullName ||
                      selectedDoctor?.name ||
                      "Doctor"}
                  </h5>

                  <p className="mb-1">
                    {selectedDoctor?.qualification ||
                      "Qualification not provided"}
                  </p>

                  <p className="mb-0 text-muted">
                    {selectedDoctor?.specialization ||
                      "Specialization not provided"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="col-lg-8">
            <h4>
              Appointment with Dr.{" "}
              {selectedDoctor?.fullname ||
                selectedDoctor?.fullName ||
                selectedDoctor?.name}
            </h4>

            <div className="card p-3 my-3">
              <p className="mb-2">
                <strong>
                  Appointment date:
                </strong>{" "}
                {appointmentDate ||
                  "Not selected"}
              </p>

              <p className="mb-0">
                <strong>Time slot:</strong>{" "}
                {timeSlot || "Not selected"}
              </p>
            </div>

            <hr />

            <h2>Patient Details</h2>

            <div className="mb-2">
              <input
                type="radio"
                id="myself"
                name="who"
                value="myself"
                checked={
                  selectedPatientType ===
                  "myself"
                }
                onChange={() =>
                  handlePatientTypeChange(
                    "myself"
                  )
                }
              />

              <label
                htmlFor="myself"
                className="ms-2"
              >
                {user?.fullname ||
                  user?.fullName ||
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
                checked={
                  selectedPatientType ===
                  "someone"
                }
                onChange={() =>
                  handlePatientTypeChange(
                    "someone"
                  )
                }
              />

              <label
                htmlFor="someone"
                className="ms-2"
              >
                Someone Else
              </label>
            </div>

            <form onSubmit={handleSubmit}>
              {selectedPatientType ===
                "someone" && (
                <p>
                  Please provide the
                  patient&apos;s information:
                </p>
              )}

              <div className="mb-3">
                <label htmlFor="fullName">
                  Patient&apos;s Full Name
                  <sup className="text-danger">
                    *
                  </sup>
                </label>

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  className="form-control"
                  style={{
                    maxWidth: "400px",
                  }}
                  placeholder="Enter patient full name"
                  value={
                    patientDetails.fullName
                  }
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="mobile">
                  Mobile
                  <sup className="text-danger">
                    *
                  </sup>
                </label>

                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  className="form-control"
                  style={{
                    maxWidth: "400px",
                  }}
                  placeholder="Enter 10-digit mobile number"
                  value={patientDetails.mobile}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email">
                  Patient Email
                  <sup className="text-danger">
                    *
                  </sup>
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-control"
                  style={{
                    maxWidth: "400px",
                  }}
                  placeholder="Enter patient email ID"
                  value={patientDetails.email}
                  onChange={handleInputChange}
                  readOnly={
                    selectedPatientType ===
                    "myself"
                  }
                />
              </div>

              {bookingError && (
                <div
                  className="alert alert-danger"
                  style={{
                    maxWidth: "400px",
                  }}
                >
                  {bookingError}
                </div>
              )}

              {bookingMessage && (
                <div
                  className="alert alert-success"
                  style={{
                    maxWidth: "400px",
                  }}
                >
                  {bookingMessage}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-info text-white"
                style={{
                  width: "400px",
                  maxWidth: "100%",
                }}
                disabled={isBooking}
              >
                {isBooking
                  ? "Booking Appointment..."
                  : "Confirm Clinic Visit"}
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}