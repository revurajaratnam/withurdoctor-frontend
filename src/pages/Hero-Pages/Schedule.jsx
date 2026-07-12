import { useEffect, useMemo, useState } from "react";
import "../../style/AppointmentSchedule.css";

const timeGroups = [
  {
    title: "Morning",
    slots: [
      "09:00 AM",
      "09:30 AM",
      "10:00 AM",
      "10:30 AM",
      "11:00 AM",
      "11:30 AM",
    ],
  },
  {
    title: "Afternoon",
    slots: [
      "12:00 PM",
      "12:30 PM",
      "01:00 PM",
      "01:30 PM",
      "02:00 PM",
      "02:30 PM",
    ],
  },
  {
    title: "Evening",
    slots: [
      "03:00 PM",
      "03:30 PM",
      "04:00 PM",
      "04:30 PM",
      "05:00 PM",
    ],
  },
];

// Converts a date into YYYY-MM-DD format
function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Converts "09:30 AM" into a complete Date object
function createSlotDate(date, time) {
  const [timeValue, period] = time.split(" ");
  const [hourValue, minuteValue] = timeValue.split(":");

  let hours = Number(hourValue);
  const minutes = Number(minuteValue);

  if (period === "PM" && hours !== 12) {
    hours += 12;
  }

  if (period === "AM" && hours === 12) {
    hours = 0;
  }

  const slotDate = new Date(date);

  slotDate.setHours(hours, minutes, 0, 0);

  return slotDate;
}

export default function AppointmentSchedule({
  doctorId,
  bookedSlots = {},
  onBookAppointment,
}) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // Generate today plus the next 16 days
  const scheduleDays = useMemo(() => {
    return Array.from({ length: 17 }, (_, index) => {
      const date = new Date();

      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() + index);

      return {
        id: getDateKey(date),
        date,
        dayName: date.toLocaleDateString("en-IN", {
          weekday: "short",
        }),
        dateNumber: date.getDate(),
        monthName: date.toLocaleDateString("en-IN", {
          month: "short",
        }),
      };
    });
  }, []);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Check which slots are still available
  const daysWithAvailableSlots = useMemo(() => {
    return scheduleDays.map((day) => {
      const bookedTimes = bookedSlots[day.id] || [];

      const availableGroups = timeGroups
        .map((group) => {
          const availableSlots = group.slots.filter((time) => {
            const slotDate = createSlotDate(day.date, time);

            const isPastTime = slotDate <= currentTime;
            const isBooked = bookedTimes.includes(time);

            return !isPastTime && !isBooked;
          });

          return {
            ...group,
            slots: availableSlots,
          };
        })
        .filter((group) => group.slots.length > 0);

      const totalAvailableSlots = availableGroups.reduce(
        (total, group) => total + group.slots.length,
        0
      );

      return {
        ...day,
        availableGroups,
        totalAvailableSlots,
      };
    });
  }, [scheduleDays, bookedSlots, currentTime]);

  // Automatically select the first day that has slots
  useEffect(() => {
    const currentlySelectedDay = daysWithAvailableSlots.find(
      (day) => day.id === selectedDate
    );

    if (
      currentlySelectedDay &&
      currentlySelectedDay.totalAvailableSlots > 0
    ) {
      return;
    }

    const firstAvailableDay = daysWithAvailableSlots.find(
      (day) => day.totalAvailableSlots > 0
    );

    setSelectedDate(firstAvailableDay?.id || "");
    setSelectedTime("");
  }, [daysWithAvailableSlots, selectedDate]);

  const selectedDay = daysWithAvailableSlots.find(
    (day) => day.id === selectedDate
  );

  const handleDateSelect = (day) => {
    if (day.totalAvailableSlots === 0) {
      return;
    }

    setSelectedDate(day.id);
    setSelectedTime("");
  };

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select a date and time");
      return;
    }

    const selectedSlotDate = createSlotDate(
      selectedDay.date,
      selectedTime
    );

    // Check the time again before booking
    if (selectedSlotDate <= new Date()) {
      alert("This time slot has already passed");

      setCurrentTime(new Date());
      setSelectedTime("");

      return;
    }

    const appointmentData = {
      doctorId,
      appointmentDate: selectedDate,
      appointmentTime: selectedTime,
    };

    if (onBookAppointment) {
      onBookAppointment(appointmentData);
      return;
    }

    console.log("Appointment information:", appointmentData);

    alert(
      `Appointment selected for ${selectedDate} at ${selectedTime}`
    );
  };

  return (
    <div className="schedule-container">
      <div className="schedule-heading">
        <h3>Book an Appointment</h3>
        <p>Select an available date and time</p>
      </div>

      {/* 17-day date strip */}
      <div className="date-strip">
        {daysWithAvailableSlots.map((day, index) => {
          const isSelected = selectedDate === day.id;
          const hasNoSlots = day.totalAvailableSlots === 0;

          return (
            <button
              type="button"
              key={day.id}
              disabled={hasNoSlots}
              onClick={() => handleDateSelect(day)}
              className={`
                date-card
                ${isSelected ? "active-date" : ""}
                ${hasNoSlots ? "unavailable-date" : ""}
              `}
            >
              <span className="day-name">
                {index === 0 ? "Today" : day.dayName}
              </span>

              <span className="date-number">
                {day.dateNumber}
              </span>

              <span className="month-name">
                {day.monthName}
              </span>

              <small>
                {hasNoSlots
                  ? "No slots"
                  : `${day.totalAvailableSlots} slots`}
              </small>
            </button>
          );
        })}
      </div>

      {!selectedDay ? (
        <div className="no-slots-message">
          No appointment slots are available for the next 17 days.
        </div>
      ) : (
        <>
          <div className="selected-date-heading">
            Available slots for{" "}
            <strong>
              {selectedDay.date.toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </strong>
          </div>

          <div className="time-sections">
            {selectedDay.availableGroups.length === 0 ? (
              <div className="no-slots-message">
                No slots are available for this day.
              </div>
            ) : (
              selectedDay.availableGroups.map((group) => (
                <div className="time-group" key={group.title}>
                  <h5>{group.title}</h5>

                  <div className="slot-grid">
                    {group.slots.map((time) => (
                      <button
                        type="button"
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`time-slot ${
                          selectedTime === time
                            ? "selected-slot"
                            : ""
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="booking-summary">
            <div>
              <p>
                <strong>Date:</strong>{" "}
                {selectedDay.date.toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>

              <p>
                <strong>Time:</strong>{" "}
                {selectedTime || "Please select a time"}
              </p>
            </div>

            <button
              type="button"
              className="book-button"
              disabled={!selectedTime}
              onClick={handleBookAppointment}
            >
              Book Appointment
            </button>
          </div>
        </>
      )}
    </div>
  );
}