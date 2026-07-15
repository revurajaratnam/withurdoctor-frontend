import React, { useEffect, useState, useCallback } from "react";
import "../../style/AppointmentSchedule.css";

// Swap fetch() calls below for your RTK Query hooks whenever you wire this
// into the existing WithUrDoctor api slices (useLazyGetDrDataQuery pattern).

const API_BASE = "http://localhost:4545"; // adjust to your backend base URL

function formatDateLabel(dateStr, index) {
  const d = new Date(dateStr);
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short" });
}

export default function DoctorAppointmentSlots({ doctorId, patientId }) {
  const [fee, setFee] = useState(null);
  const [doctorName, setDoctorName] = useState("");
  const [dateSummary, setDateSummary] = useState([]); // [{date, slotCount}]
  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(null); // slotTime currently being booked
  const [error, setError] = useState("");
  const [visibleStart, setVisibleStart] = useState(0); // for the 5-day scroll window

  // 1. Fetch real fee for THIS doctor (not fixed)
  useEffect(() => {
    fetch(`${API_BASE}/doctors/${doctorId}/fee`)
      .then((r) => r.json())
      .then((data) => {
        setFee(data.fee);
        setDoctorName(data.doctorName);
      })
      .catch(() => setError("Could not load doctor fee"));
  }, [doctorId]);

  // 2. Fetch 20-day availability summary for the date tabs
  useEffect(() => {
    if (!doctorId) return;
  
    fetch(`${API_BASE}/doctors/${doctorId}/availability?days=20`)
      .then(async (res) => {
        const result = await res.json();
  
        if (!res.ok) {
          throw new Error(result.message || "Could not load availability");
        }
  
        return result;
      })
      .then((result) => {
        console.log("Availability response:", result);
  
        const availability = Array.isArray(result)
          ? result
          : Array.isArray(result.availability)
          ? result.availability
          : Array.isArray(result.data)
          ? result.data
          : [];
  
        setDateSummary(availability);
  
        const firstAvailable = availability.find(
          (item) => item.slotCount > 0
        );
  
        setSelectedDate(
          (firstAvailable || availability[0])?.date || null
        );
      })
      .catch((err) => {
        console.error(err);
        setDateSummary([]);
        setError(err.message);
      });
  }, [doctorId]);
  // 3. Fetch real-time slots whenever the selected date changes
  const loadSlots = useCallback(() => {
    if (!selectedDate) return;
    setLoadingSlots(true);
    fetch(`${API_BASE}/doctors/${doctorId}/slots?date=${selectedDate}`)
      .then((r) => r.json())
      .then((data) => setSlots(data.slots))
      .catch(() => setError("Could not load slots"))
      .finally(() => setLoadingSlots(false));
  }, [doctorId, selectedDate]);

  useEffect(() => {
    loadSlots();
    // refresh every 30s so slots that just got booked by someone else disappear
    const interval = setInterval(loadSlots, 30000);
    return () => clearInterval(interval);
  }, [loadSlots]);

  const handleBook = async (slotTime) => {
    setBooking(slotTime);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId, patientId, slotTime }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Booking failed");
      }
      loadSlots(); // refresh so the booked slot immediately shows as taken
    } catch (err) {
      setError(err.message);
    } finally {
      setBooking(null);
    }
  };

  const groupSlots = (slots) => {
    const groups = { Morning: [], Afternoon: [], Evening: [] };
    slots.forEach((s) => {
      const hour = new Date(s.time).getHours();
      if (hour < 12) groups.Morning.push(s);
      else if (hour < 17) groups.Afternoon.push(s);
      else groups.Evening.push(s);
    });
    return groups;
  };

  const visibleDates = dateSummary.slice(visibleStart, visibleStart + 3);
  const groups = groupSlots(slots);

  return (
    <div className="appt-card">
      <div className="appt-header">
        <div>
          <span className="appt-badge">Clinic Appointment</span>
          {fee !== null && <span className="appt-fee">₹{fee} Fee</span>}
        </div>
        <div className="appt-doctor-name">{doctorName}</div>
      </div>

      <div className="appt-date-tabs">
        <button
          className="appt-nav-arrow"
          disabled={visibleStart === 0}
          onClick={() => setVisibleStart((v) => Math.max(0, v - 3))}
        >
          &#8249;
        </button>

        {visibleDates.map((d, i) => {
          const globalIndex = visibleStart + i;
          const isSelected = d.date === selectedDate;
          return (
            <button
              key={d.date}
              className={`appt-date-tab ${isSelected ? "active" : ""}`}
              onClick={() => setSelectedDate(d.date)}
            >
              <div className="appt-date-tab-label">
                {formatDateLabel(d.date, globalIndex)}
              </div>
              <div className={`appt-date-tab-count ${d.slotCount === 0 ? "none" : "available"}`}>
                {d.slotCount === 0 ? "No Slots Available" : `${d.slotCount} Slots Available`}
              </div>
            </button>
          );
        })}

        <button
          className="appt-nav-arrow"
          disabled={visibleStart + 3 >= dateSummary.length}
          onClick={() => setVisibleStart((v) => v + 3)}
        >
          &#8250;
        </button>
      </div>

      <div className="appt-slots-area">
        {error && <div className="appt-error">{error}</div>}

        {loadingSlots && <div className="appt-loading">Loading slots…</div>}

        {!loadingSlots && slots.length === 0 && (
          <div className="appt-empty">
            <p>No slots available for this day</p>
          </div>
        )}

        {!loadingSlots &&
          Object.entries(groups).map(([label, groupSlots]) =>
            groupSlots.length ? (
              <div key={label} className="appt-slot-group">
                <div className="appt-slot-group-label">
                  {label} ({groupSlots.length} slots)
                </div>
                <div className="appt-slot-grid">
                  {groupSlots.map((s) => (
                    <button
                      key={s.time}
                      className={`appt-slot-btn ${s.isBooked ? "disabled" : ""}`}
                      disabled={s.isBooked || booking === s.time}
                      onClick={() => handleBook(s.time)}
                    >
                      {booking === s.time ? "…" : s.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null
          )}
      </div>
      <div>
      =
      </div>
    </div>
  );
}
