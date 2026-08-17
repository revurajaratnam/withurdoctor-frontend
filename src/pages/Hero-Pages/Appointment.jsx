import { useEffect, useMemo, useState } from "react";
import {
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useSelector } from "react-redux";

import NavbarComp from "../../components/Navbar";

import {
  useGetdrdataQuery,
} from "../../features/auth/api/drDataApi";

import {
  useAppointmentBookingMutation,
} from "../../features/auth/api/AppoApi";


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
    (id) =>
      id &&
      String(id) === String(doctorId)
  );
}


export default function Appointments() {

  const { doctorId } = useParams();

  const [searchParams] = useSearchParams();


  const appointmentDate =
    searchParams.get("date") || "";

  const timeSlot =
    searchParams.get("time") || "";


  // GET LOGGED-IN USER FROM REDUX
  const { user, token } = useSelector(
    (state) => state.dr
  );


  const [
    selectedPatientType,
    setSelectedPatientType,
  ] = useState("myself");


  const [
    patientDetails,
    setPatientDetails,
  ] = useState({
    fullName: "",
    mobile: "",
    email: "",
  });


  const [
    bookingMessage,
    setBookingMessage,
  ] = useState("");


  const [
    bookingError,
    setBookingError,
  ] = useState("");


  // GET DOCTOR DATA
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


  // APPOINTMENT MUTATION
  const [
    appointmentBooking,
    {
      isLoading: isBooking,
    },
  ] = useAppointmentBookingMutation();


  // AUTO FILL LOGGED-IN USER DETAILS
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

        email:
          user?.email || "",
      });

    } else {

      setPatientDetails({
        fullName: "",
        mobile: "",
        email: "",
      });

    }

  }, [
    selectedPatientType,
    user,
  ]);


  // FIND SELECTED DOCTOR
  const selectedDoctor = useMemo(() => {

    const singleDoctor =
      getSingleDoctor(doctorResponse);


    if (
      singleDoctor &&
      doctorIdMatches(
        singleDoctor,
        doctorId
      )
    ) {
      return singleDoctor;
    }


    const doctors =
      getDoctorsArray(doctorResponse);


    return (
      doctors.find(
        (doctor) =>
          doctorIdMatches(
            doctor,
            doctorId
          )
      ) || null
    );

  }, [
    doctorResponse,
    doctorId,
  ]);


  // CHANGE PATIENT TYPE
  const handlePatientTypeChange = (type) => {

    setSelectedPatientType(type);

    setBookingMessage("");

    setBookingError("");

  };


  // HANDLE INPUT CHANGE
  const handleInputChange = (event) => {

    const {
      name,
      value,
    } = event.target;


    setPatientDetails(
      (previousData) => ({
        ...previousData,
        [name]: value,
      })
    );

  };


  // SUBMIT APPOINTMENT
  const handleSubmit = async (event) => {

    event.preventDefault();


    setBookingMessage("");

    setBookingError("");


    // CHECK LOGIN
    if (!token) {

      setBookingError(
        "Please log in before booking an appointment."
      );

      return;
    }


    // CHECK DOCTOR ID
    if (!doctorId) {

      setBookingError(
        "Doctor ID is missing. Please select the doctor again."
      );

      return;
    }


    // CHECK DOCTOR
    if (!selectedDoctor) {

      setBookingError(
        "Doctor details are unavailable. Please select the doctor again."
      );

      return;
    }


    // CHECK DATE
    if (!appointmentDate) {

      setBookingError(
        "Appointment date is missing."
      );

      return;
    }


    // CHECK TIME
    if (!timeSlot) {

      setBookingError(
        "Appointment time slot is missing."
      );

      return;
    }


    // CHECK NAME
    if (
      !patientDetails.fullName.trim()
    ) {

      setBookingError(
        "Please enter the patient's full name."
      );

      return;
    }


    // CHECK MOBILE
    if (
      !patientDetails.mobile.trim()
    ) {

      setBookingError(
        "Please enter the patient's mobile number."
      );

      return;
    }


    // VALIDATE MOBILE
    if (
      !/^[6-9]\d{9}$/.test(
        patientDetails.mobile.trim()
      )
    ) {

      setBookingError(
        "Please enter a valid 10-digit mobile number."
      );

      return;
    }


    // CHECK EMAIL
    if (
      !patientDetails.email.trim()
    ) {

      setBookingError(
        "Please enter the patient's email address."
      );

      return;
    }


    // GET PATIENT ID
    const patientId =
      user?._id ||
      user?.id ||
      user?.userId ||
      "";


    // CHECK PATIENT ID
    if (!patientId) {

      console.error(
        "Patient ID not found."
      );

      console.log(
        "Redux user:",
        user
      );


      setBookingError(
        "Patient ID not found. Please logout and login again."
      );

      return;
    }


    // CREATE APPOINTMENT PAYLOAD
    const appointmentPayload = {

      doctorId:
        selectedDoctor?._id ||
        selectedDoctor?.id ||
        selectedDoctor?.doctorId ||
        doctorId,


      doctorName:
        selectedDoctor?.fullname ||
        selectedDoctor?.fullName ||
        selectedDoctor?.name ||
        "",


      doctorEmail:
        selectedDoctor?.email ||
        "",


      patientId: patientId,


      bookedFor:
        selectedPatientType,


      patientName:
        patientDetails.fullName.trim(),


      patientMobile:
        patientDetails.mobile.trim(),


      patientEmail:
        patientDetails.email.trim(),


      appointmentDate:
        appointmentDate,


      timeSlot:
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
      "Redux user:",
      user
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


      console.log(
        "Appointment booking success:",
        response
      );


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


      console.error(
        "Backend response:",
        error?.data
      );


      setBookingError(
        error?.data?.message ||
        error?.data?.error ||
        error?.error ||
        "Appointment booking failed. Please try again."
      );

    }

  };


  // DOCTOR ID MISSING
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


  // LOADING
  if (
    isDoctorLoading ||
    isDoctorFetching
  ) {

    return (
      <div>

        <NavbarComp />

        <div className="container mt-5">

          <p>
            Loading doctor details...
          </p>

        </div>

      </div>
    );

  }


  // DOCTOR API ERROR
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

              {
                doctorError?.data?.message ||
                doctorError?.error ||
                "Unable to connect to the server."
              }

            </p>

          </div>

        </div>

      </div>
    );

  }


  // DOCTOR NOT FOUND
  if (!selectedDoctor) {

    return (
      <div>

        <NavbarComp />

        <div className="container mt-5">

          <div className="alert alert-danger">

            <h5>
              Doctor not found
            </h5>


            <p>

              Doctor ID: {doctorId}

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


          {/* DOCTOR DETAILS */}

          <section className="col-lg-4">

            <div className="card p-3">

              <div className="d-flex align-items-center gap-3">


                <img
                  src={
                    getDoctorImage(
                      selectedDoctor
                    )
                  }
                  alt="Doctor profile"
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

                    {
                      selectedDoctor?.fullname ||
                      selectedDoctor?.fullName ||
                      selectedDoctor?.name ||
                      "Doctor"
                    }

                  </h5>


                  <p className="mb-1">

                    {
                      selectedDoctor?.qualification ||
                      "Qualification not provided"
                    }

                  </p>


                  <p className="mb-0 text-muted">

                    {
                      selectedDoctor?.specialization ||
                      "Specialization not provided"
                    }

                  </p>

                </div>

              </div>

            </div>

          </section>


          {/* APPOINTMENT FORM */}

          <section className="col-lg-8">


            <h4>

              Appointment with Dr.{" "}

              {
                selectedDoctor?.fullname ||
                selectedDoctor?.fullName ||
                selectedDoctor?.name
              }

            </h4>


            <div className="card p-3 my-3">


              <p className="mb-2">

                <strong>
                  Appointment date:
                </strong>

                {" "}

                {
                  appointmentDate ||
                  "Not selected"
                }

              </p>


              <p className="mb-0">

                <strong>
                  Time slot:
                </strong>

                {" "}

                {
                  timeSlot ||
                  "Not selected"
                }

              </p>

            </div>


            <hr />


            <h2>
              Patient Details
            </h2>


            {/* MYSELF */}

            <div className="mb-2">

              <input
                type="radio"
                id="myself"
                name="who"
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

                Myself

              </label>

            </div>


            {/* SOMEONE ELSE */}

            <div className="mb-3">

              <input
                type="radio"
                id="someone"
                name="who"
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


            <form
              onSubmit={handleSubmit}
            >


              {/* FULL NAME */}

              <div className="mb-3">

                <label htmlFor="fullName">

                  Patient's Full Name

                </label>


                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  className="form-control"
                  style={{
                    maxWidth: "400px",
                  }}
                  value={
                    patientDetails.fullName
                  }
                  onChange={
                    handleInputChange
                  }
                />

              </div>


              {/* MOBILE */}

              <div className="mb-3">

                <label htmlFor="mobile">

                  Mobile

                </label>


                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  maxLength={10}
                  className="form-control"
                  style={{
                    maxWidth: "400px",
                  }}
                  value={
                    patientDetails.mobile
                  }
                  onChange={
                    handleInputChange
                  }
                />

              </div>


              {/* EMAIL */}

              <div className="mb-3">

                <label htmlFor="email">

                  Patient Email

                </label>


                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-control"
                  style={{
                    maxWidth: "400px",
                  }}
                  value={
                    patientDetails.email
                  }
                  onChange={
                    handleInputChange
                  }
                  readOnly={
                    selectedPatientType ===
                    "myself"
                  }
                />

              </div>


              {/* ERROR */}

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


              {/* SUCCESS */}

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


              {/* SUBMIT */}

              <button
                type="submit"
                className="btn btn-info text-white"
                style={{
                  width: "400px",
                  maxWidth: "100%",
                }}
                disabled={isBooking}
              >

                {
                  isBooking
                    ? "Booking Appointment..."
                    : "Confirm Clinic Visit"
                }

              </button>

            </form>

          </section>

        </div>

      </main>

    </div>
  );
}