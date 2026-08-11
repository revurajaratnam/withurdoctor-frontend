import { Link } from "react-router-dom";

export default function ProfileBreadcrumb({ doctor }) {
  return (
    <div >
      <Link  className="breadcrumb-wrapper" to="/">Home</Link>

      <span> › </span>

      <Link className="breadcrumb-wrapper"
        to={`/FindDoctors?location=${encodeURIComponent(
          doctor.state || ""
        )}`}
      >
        {doctor.state || "Location"}
      </Link>

      <span> › </span>

      <Link className="breadcrumb-wrapper"
        to={`/FindDoctors?specialization=${encodeURIComponent(
          doctor.specialization || ""
        )}`}
      >
        {doctor.specialization}
      </Link>

      <span> › </span>
      <Link className="breadcrumb-wrapper"
        to={`/FindDoctors?city=${encodeURIComponent(
          doctor.city || ""
        )}`}
      >
        {doctor.city}
      </Link>

      <span> › </span>

      <span>Dr. {doctor.fullname}</span>
    </div>
  );
}