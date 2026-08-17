import {
  useParams,
  useSearchParams,
  Link,
} from "react-router-dom";

import {
  useAppointmentMutation,
  useGetdrdataQuery,
} from "../../features/auth/api/drDataApi";

import NavbarComp from "../../components/Navbar";


const fallbackImage =
  "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png";


function getProfileImage(doctor) {
  const image =
    doctor?.profileImage || doctor?.profilephoto;

  if (!image) {
    return fallbackImage;
  }

  if (image.startsWith("http")) {
    return image;
  }

  return `https://withurdoctor.onrender.com/uploads/${image}`;
}


function formatSelectedDate(dateValue) {
  if (!dateValue) {
    return "Date not selected";
  }

  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}


function getErrorMessage(error) {
  console.log("Full booking error:", error);

  if (error?.data?.message) {
    return error.data.message;
  }

  if (error?.data?.error) {
    return error.data.error;
  }

  if (error?.error) {
    return error.error;
  }

  if (error?.status === "FETCH_ERROR") {
    return "Cannot connect to the server.";
  }

  return "Booking failed. Please try again.";
}


export default function BookAppointment() {

  const { doctorId } = useParams();

  const [searchParams] = useSearchParams();

  const selectedDate = searchParams.get("date");
  const selectedTime = searchParams.get("time");


  // GET LOGGED-IN USER
  let storedUser = null;

  try {
    const storedUserString =
      localStorage.getItem("user");

    storedUser = storedUserString
      ? JSON.parse(storedUserString)
      : null;

  } catch (error) {
    console.error(
      "Invalid user data in localStorage:",
      error
    );
  }


  console.log(
    "Logged in user:",
    storedUser
  );


  // IMPORTANT
  // Your backend sends `id`, not `_id`
  const patientId =
    storedUser?.id || storedUser?._id;


  console.log(
    "Patient ID:",
    patientId
  );


  const [
    bookAppointment,
    {
      data: bookingResponse,
      isLoading: isBooking,
      isSuccess: bookingSuccess,
      isError: bookingFailed,
      error: bookingError,
      reset: resetBooking,
    },
  ] = useAppointmentMutation();


  // GET DOCTOR DATA
  const {
    data: doctorData,
    isLoading: doctorLoading,
    isError: doctorFailed,
    error: doctorError,
  } = useGetdrdataQuery(
    {
      id: doctorId,
    },
    {
      skip: !doctorId,
    }
  );


  // NORMALIZE DOCTOR DATA
  const doctors = Array.isArray(doctorData?.data)
    ? doctorData.data
    : Array.isArray(doctorData)
      ? doctorData
      : doctorData?.doctor
        ? [doctorData.doctor]
        : [];


  // FIND SELECTED DOCTOR
  const selectedDoctor =
    doctors.find((doctor) => {

      const currentDoctorId =
        doctor?._id || doctor?.id;

      return (
        String(currentDoctorId) ===
        String(doctorId)
      );

    }) || doctors[0];


  // CONFIRM APPOINTMENT
  const handleConfirmAppointment = async () => {

    console.log(
      "Doctor ID from URL:",
      doctorId
    );


    console.log(
      "Selected doctor:",
      selectedDoctor
    );


    if (!doctorId) {
      alert("Doctor ID not found.");
      return;
    }


    if (!selectedDate || !selectedTime) {
      alert("Please select date and time.");
      return;
    }


    if (!patientId) {

      console.error(
        "Patient ID not found:",
        storedUser
      );

      alert(
        "Your login information is missing. Please logout and login again."
      );

      return;
    }


    const appointmentData = {

      // DOCTOR INFORMATION
      doctorId:
        selectedDoctor?._id || doctorId,

      doctorName:
        selectedDoctor?.fullname || "",

      doctorEmail:
        selectedDoctor?.email || "",


      // PATIENT INFORMATION
      patientId: patientId,

      patientName:
        storedUser?.name || "",

      patientEmail:
        storedUser?.email || "",


      // APPOINTMENT INFORMATION
      bookedFor: "myself",

      appointmentDate:
        selectedDate,

      timeSlot:
        selectedTime,


      consultationFee:
        selectedDoctor?.consultationFee ??
        selectedDoctor?.consultation ??
        0,
    };


    console.log(
      "Appointment payload:",
      appointmentData
    );


    try {

      const response =
        await bookAppointment(
          appointmentData
        ).unwrap();


      console.log(
        "Appointment confirmed:",
        response
      );

    } catch (error) {

      console.error(
        "Appointment booking failed:",
        error
      );

    }
  };


  if (doctorLoading) {
    return (
      <div className="container py-5 text-center">

        <div
          className="spinner-border text-primary"
          role="status"
        />

        <h4 className="mt-3">
          Loading doctor information...
        </h4>

      </div>
    );
  }


  if (doctorFailed) {

    console.error(
      "Doctor fetch error:",
      doctorError
    );

    return (
      <div className="container py-5 text-center">

        <div className="alert alert-danger">
          Failed to load doctor information.
        </div>

        <Link
          to="/FindDoctors"
          className="btn btn-primary"
        >
          Back to doctors
        </Link>

      </div>
    );
  }


  if (!selectedDoctor) {

    return (
      <div className="container py-5 text-center">

        <div className="alert alert-warning">
          Doctor not found.
        </div>

        <Link
          to="/FindDoctors"
          className="btn btn-primary"
        >
          Back to doctors
        </Link>

      </div>
    );
  }


  return (

    <div className="min-vh-100">

      <NavbarComp />


      <div className="container py-5">

        <h2 className="mb-4">
          Confirm Appointment
        </h2>


        <div className="card shadow-sm">

          <div className="card-body p-4">


            <div className="d-flex flex-column flex-md-row gap-4">

              <img
                src={getProfileImage(selectedDoctor)}
                alt={
                  selectedDoctor.fullname || "Doctor"
                }
                style={{
                  width: "140px",
                  height: "140px",
                  borderRadius: "12px",
                  objectFit: "cover",
                }}
              />


              <div>

                <h3>
                  Dr. {selectedDoctor.fullname}
                </h3>


                <p className="mb-2">

                  <strong>
                    Specialization:
                  </strong>{" "}

                  {selectedDoctor.specialization ||
                    "Not available"}

                </p>


                <p className="mb-2">

                  <strong>
                    Experience:
                  </strong>{" "}

                  {selectedDoctor.experience ||
                    "Not available"}

                </p>


                <p className="mb-2">

                  <strong>
                    Hospital:
                  </strong>{" "}

                  {selectedDoctor.hospitalName ||
                    "Not available"}

                </p>


                <p className="mb-2">

                  <strong>
                    Location:
                  </strong>{" "}

                  {selectedDoctor.city ||
                    selectedDoctor.address ||
                    "Not available"}

                </p>


                <p className="mb-0">

                  <strong>
                    Consultation Fee:
                  </strong>{" "}

                  ₹
                  {selectedDoctor.consultationFee ??
                    selectedDoctor.consultation ??
                    0}

                </p>

              </div>

            </div>


            <hr className="my-4" />


            <div className="p-3 bg-light rounded">

              <h4 className="mb-3">
                Selected Appointment
              </h4>


              <p className="mb-2">

                <strong>Date:</strong>{" "}

                {formatSelectedDate(selectedDate)}

              </p>


              <p className="mb-0">

                <strong>Time:</strong>{" "}

                {selectedTime ||
                  "Time not selected"}

              </p>

            </div>


            {bookingSuccess && (

              <div className="alert alert-success mt-4">

                <h5>
                  Your booking is confirmed!
                </h5>

                <p>
                  {bookingResponse?.message ||
                    "Appointment booked successfully."}
                </p>

              </div>

            )}


            {bookingFailed && (

              <div className="alert alert-danger mt-4">

                <h5>
                  Booking failed
                </h5>

                <p>
                  {getErrorMessage(bookingError)}
                </p>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={resetBooking}
                >
                  Try Again
                </button>

              </div>

            )}


            <div className="d-flex flex-wrap gap-3 mt-4">

              {!bookingSuccess && (

                <button
                  type="button"
                  className="btn btn-primary"

                  disabled={
                    !doctorId ||
                    !selectedDate ||
                    !selectedTime ||
                    !patientId ||
                    isBooking
                  }

                  onClick={
                    handleConfirmAppointment
                  }
                >

                  {isBooking
                    ? "Confirming..."
                    : "Confirm Appointment"}

                </button>

              )}


              <Link
                to="/FindDoctors"
                className="btn btn-outline-secondary"
              >

                {bookingSuccess
                  ? "Back to Doctors"
                  : "Change Doctor"}

              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}