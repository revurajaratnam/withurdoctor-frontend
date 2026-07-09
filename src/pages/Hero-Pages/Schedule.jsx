import { useState } from "react";
import "../../style/AppointmentSchedule.css";

const scheduleData = [
  {
    id: 1,
    day: "Today",
    date: "",
    slotsAvailable: 0,
    slots: [],
  },
  {
    id: 2,
    day: "Tomorrow",
    date: "",
    slotsAvailable: 24,
    slots: ["10:00 AM", "10:30 AM", "11:00 AM", "12:00 PM"],
  },
  {
    id: 3,
    day: "Fri, 10 Jul",
    date: "",
    slotsAvailable: 24,
    slots: ["09:00 AM", "09:30 AM", "02:00 PM", "05:00 PM"],
  },
];

export default function AppointmentSchedule() {
  const [selectedDay, setSelectedDay] = useState(scheduleData[0]);

  const goNextAvailability = () => {
    const nextAvailable = scheduleData.find((item) => item.slotsAvailable > 0);
    if (nextAvailable) {
      setSelectedDay(nextAvailable);
    }
  };

  return (
    <div className="schedule-card">
      <div className="schedule-header">
        <button className="arrow-btn">
          <i className="bi bi-chevron-left"></i>
        </button>

        <div className="date-tabs">
          {scheduleData.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedDay(item)}
              className={
                selectedDay.id === item.id
                  ? "date-tab active-date-tab"
                  : "date-tab"
              }
            >
              <h6>{item.day}</h6>

              {item.slotsAvailable > 0 ? (
                <p className="available-text">
                  {item.slotsAvailable} Slots Available
                </p>
              ) : (
                <p className="not-available-text">No Slots Available</p>
              )}
            </button>
          ))}
        </div>

        <button className="arrow-btn">
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>

      <div className="schedule-body">
        {selectedDay.slotsAvailable === 0 ? (
          <>
            <div className="empty-icon">🗓️</div>
            <p className="empty-text">
              No slots available for {selectedDay.day.toLowerCase()}
            </p>

            <button onClick={goNextAvailability} className="next-btn">
              Next availability on Thu, 9 Jul
            </button>

            <button className="call-btn">
              <i className="bi bi-telephone"></i> Call Now
            </button>
          </>
        ) : (
          <>
            <h6 className="slot-title">Available Slots</h6>

            <div className="slots-box">
              {selectedDay.slots.map((slot, index) => (
                <button key={index} className="slot-btn">
                  {slot}
                </button>
              ))}
            </div>

            <button className="call-btn mt-3">
              <i className="bi bi-telephone"></i> Call Now
            </button>
          </>
        )}
      </div>
    </div>
  );
}