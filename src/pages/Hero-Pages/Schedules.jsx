import { Link } from "react-router-dom";
import { TimeSchedules } from "../../utils/TimeSchedules";

function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function Schedules({ doctorId }) {
  const selectedDate = getTodayDate();

  if (!doctorId) {
    return (
      <div className="alert alert-danger">
        Doctor ID is missing.
      </div>
    );
  }

  return (
    <div className="container-fluid py-3">
      <h5 className="mb-3">Select appointment time</h5>

      {TimeSchedules.map((group) => (
        <div key={group.Title} className="mb-4">
          <h6 className="fw-bold mb-3">{group.Title}</h6>

          <div className="d-flex flex-wrap gap-2">
            {group.Time.map((time) => (
              <Link
                key={time}
                className="btn btn-outline-primary"
                to={`/appointment/${doctorId}?date=${encodeURIComponent(
                  selectedDate
                )}&time=${encodeURIComponent(time)}`}
              >
                {time}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}