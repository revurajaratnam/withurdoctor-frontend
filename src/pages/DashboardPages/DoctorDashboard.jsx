import { Link } from "react-router-dom";
import NavbarComp from "../../components/Navbar";

export default function DoctorDashboard() {
  return (
    <div>
      <NavbarComp />

      <div
        style={{
          backgroundColor: "#28328C",
          color: "white",
          width: "200px",
          margin: "30px",
        }}
      >
        <div className="d-flex flex-column p-4 gap-4">

          <Link
            to="/calender"
            className="text-decoration-none text-white d-flex gap-2"
          >
            <i className="bi bi-calendar2-check-fill"></i>
            Calendar
          </Link>

          <Link
            to="/profile"
            className="text-decoration-none text-white d-flex gap-2"
          >
            <i className="bi bi-person-fill"></i>
            Profile
          </Link>

          <Link
            to="#"
            className="text-decoration-none text-white d-flex gap-2"
          >
            <i className="bi bi-bell-fill"></i>
            Prime
          </Link>

          <Link
            to="#"
            className="text-decoration-none text-white d-flex gap-2"
          >
            <i className="bi bi-hand-thumbs-up-fill"></i>
            Feedback
          </Link>

          <Link
            to="#"
            className="text-decoration-none text-white d-flex gap-2"
          >
            <i className="bi bi-megaphone-fill"></i>
            Reach
          </Link>

          <Link
            to="#"
            className="text-decoration-none text-white d-flex gap-2"
          >
            <i className="bi bi-chat-left-quote-fill"></i>
            Consult
          </Link>

          <Link
            to="#"
            className="text-decoration-none text-white d-flex gap-2"
          >
            <i className="bi bi-newspaper"></i>
            Health feed
          </Link>

        </div>
      </div>
    </div>
  );
}