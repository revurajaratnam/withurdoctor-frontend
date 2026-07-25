import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useSelector } from "react-redux";

import { TimeSchedules } from "../../utils/TimeSchedules";
import "../../style/calender.css";

function convertSlotToMinutes(timeString) {
  const [time, period] = timeString.trim().split(" ");
  const [hoursString, minutesString] = time.split(":");

  let hours = Number(hoursString);
  const minutes = Number(minutesString);

  if (period.toUpperCase() === "PM" && hours !== 12) {
    hours += 12;
  }

  if (period.toUpperCase() === "AM" && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
}

function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(
    2,
    "0"
  );
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function Schedules({
  doctorId,
  doctorEmail,
  doctorName,
}) {
  const [currentTime, setCurrentTime] = useState(
    new Date()
  );

  const [selectedDate, setSelectedDate] = useState(
    getLocalDateString()
  );

  const [selectedSlot, setSelectedSlot] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const { isLoggedIn, token } = useSelector(
    (state) => state.dr
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const currentMinutes =
    currentTime.getHours() * 60 +
    currentTime.getMinutes();

  const today = getLocalDateString();

  const handleSlotSelection = (slot) => {
    setMessage("");
    setSelectedSlot(slot);

    if (!doctorId) {
      setMessage("Doctor ID is missing.");
      return;
    }

    if (!selectedDate) {
      setMessage("Please select an appointment date.");
      return;
    }

    const appointmentPage = `/bookappointment/${doctorId}?date=${encodeURIComponent(
      selectedDate
    )}&time=${encodeURIComponent(slot)}`;

    if (!isLoggedIn || !token) {
      navigate("/LoginAndSignupDashboard", {
        state: {
          from: appointmentPage,
          previousPage:
            location.pathname + location.search,
          message:
            "Please log in before booking an appointment.",
        },
      });

      return;
    }

    navigate(appointmentPage, {
      state: {
        doctorId,
        doctorEmail,
        doctorName,
        appointmentDate: selectedDate,
        timeSlot: slot,
      },
    });
  };

  if (!doctorId) {
    return (
      <div className="alert alert-danger">
        Doctor ID is not available.
      </div>
    );
  }

  return (
    <div className="schedule-container">
      <div className="mb-3">
        <label
          htmlFor={`appointment-date-${doctorId}`}
          className="form-label"
        >
          Select appointment date
        </label>

        <input
          id={`appointment-date-${doctorId}`}
          type="date"
          className="form-control"
          value={selectedDate}
          min={today}
          onChange={(event) => {
            setSelectedDate(event.target.value);
            setSelectedSlot("");
            setMessage("");
          }}
        />
      </div>

      {message && (
        <div className="alert alert-danger">
          {message}
        </div>
      )}

      {TimeSchedules.map(
        (timeGroup, groupIndex) => {
          const availableSlots =
            timeGroup.Time.filter((schedule) => {
              /*
               * For future dates, display every slot.
               */
              if (selectedDate !== today) {
                return true;
              }

              /*
               * For today, hide expired slots.
               */
              const slotMinutes =
                convertSlotToMinutes(schedule);

              return slotMinutes > currentMinutes;
            });

          return (
            <div
              key={`${timeGroup.Title}-${groupIndex}`}
              className="mb-4"
            >
              <h5>{timeGroup.Title}</h5>

              <div className="d-flex flex-wrap gap-2">
                {availableSlots.length > 0 ? (
                  availableSlots.map((schedule) => (
                    <button
                      key={schedule}
                      type="button"
                      className={
                        selectedSlot === schedule
                          ? "btn btn-primary"
                          : "btn btn-outline-primary"
                      }
                      onClick={() =>
                        handleSlotSelection(schedule)
                      }
                    >
                      {schedule}
                    </button>
                  ))
                ) : (
                  <p className="text-muted">
                    No available slots for today.
                  </p>
                )}
              </div>
            </div>
          );
        }
      )}
    </div>
  );
}