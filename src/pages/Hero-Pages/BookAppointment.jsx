import {
    useParams,
    useSearchParams,
    Link,
  } from "react-router-dom";
  
  import {
    useAppointmentMutation,
    useGetdrdataQuery,
  } from "../../features/auth/services/drDataApi";
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
  
    return `http://localhost:4545/uploads/${image}`;
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
    if (error?.data?.message) {
      return error.data.message;
    }
  
    if (error?.error) {
      return error.error;
    }
  
    if (error?.status === "FETCH_ERROR") {
      return "Cannot connect to the server. Check whether the backend is running.";
    }
  
    return "Booking failed. Please try again.";
  }
  
  export default function BookAppointment() {
    const { doctorId } = useParams();
    const [searchParams] = useSearchParams();
  
    const selectedDate = searchParams.get("date");
    const selectedTime = searchParams.get("time");
  
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
  
    const doctors = Array.isArray(doctorData?.data)
      ? doctorData.data
      : Array.isArray(doctorData)
        ? doctorData
        : doctorData?.doctor
          ? [doctorData.doctor]
          : [];
  
    const selectedDoctor =
      doctors.find((doctor) => {
        const currentDoctorId =
          doctor?._id || doctor?.id;
  
        return String(currentDoctorId) === String(doctorId);
      }) || doctors[0];
  
    const handleConfirmAppointment = async () => {
      if (!doctorId) {
        return;
      }
  
      if (!selectedDate || !selectedTime) {
        return;
      }
  
      const appointmentData = {
        doctorId,
        date: selectedDate,
        time: selectedTime,
        doctorName: selectedDoctor?.fullname || "",
        consultationFee:
          selectedDoctor?.consultationFee ??
          selectedDoctor?.consultation ??
          0,
      };
  
      try {
        const response = await bookAppointment(
          appointmentData
        ).unwrap();
  
        console.log(
          "Appointment confirmed:",
          response
        );
      } catch (error) {
        console.error("Booking failed:", error);
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

      <div className=" py-5 min-vh-100 d-flex flex-column w-100 ">
           <div className="w-100">
           <NavbarComp />
           </div>
     
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
                  <strong>Specialization:</strong>{" "}
                  {selectedDoctor.specialization ||
                    "Not available"}
                </p>
  
                <p className="mb-2">
                  <strong>Experience:</strong>{" "}
                  {selectedDoctor.experience ||
                    "Not available"}
                </p>
  
                <p className="mb-2">
                  <strong>Hospital:</strong>{" "}
                  {selectedDoctor.hospitalName ||
                    "Not available"}
                </p>
  
                <p className="mb-2">
                  <strong>Location:</strong>{" "}
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
                Selected appointment
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
                <h5 className="mb-2">
                  <i className="bi bi-check-circle-fill me-2" />
                  Your booking is confirmed!
                </h5>
  
                <p className="mb-2">
                  {bookingResponse?.message ||
                    "Appointment booked successfully."}
                </p>
  
                <p className="mb-1">
                  <strong>Doctor:</strong> Dr.{" "}
                  {selectedDoctor.fullname}
                </p>
  
                <p className="mb-1">
                  <strong>Date:</strong>{" "}
                  {formatSelectedDate(selectedDate)}
                </p>
  
                <p className="mb-0">
                  <strong>Time:</strong>{" "}
                  {selectedTime}
                </p>
  
                {bookingResponse?.appointment?._id && (
                  <p className="mt-2 mb-0">
                    <strong>
                      Appointment ID:
                    </strong>{" "}
                    {
                      bookingResponse.appointment
                        ._id
                    }
                  </p>
                )}
              </div>
            )}
  
            {bookingFailed && (
              <div className="alert alert-danger mt-4">
                <h5 className="mb-2">
                  <i className="bi bi-x-circle-fill me-2" />
                  Booking failed
                </h5>
  
                <p className="mb-3">
                  {getErrorMessage(bookingError)}
                </p>
  
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={resetBooking}
                >
                  Try again
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
                    isBooking
                  }
                  onClick={handleConfirmAppointment}
                >
                  {isBooking ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      />
                      Confirming...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-calendar-check me-2" />
                      Confirm Appointment
                    </>
                  )}
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
    );
  }