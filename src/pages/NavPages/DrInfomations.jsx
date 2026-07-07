import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import NavbarComp from "../../components/Navbar";
import { useGetdrdataQuery } from "../../features/auth/services/drDataApi";
import Footer from "../../components/Footer";
import LocationandSearch from "./Location";

export default function FindDoctors() {
  const [searchParams] = useSearchParams();
  const [locationValue, setLocationValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const { data: isdata, isLoading, error } = useGetdrdataQuery();

  const id = searchParams.get("id");
  const urlLocation = searchParams.get("location") || "";

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>Something went wrong...</h1>;
  }

  const doctorsData = Array.isArray(isdata) ? isdata : [];

  const drs = doctorsData.filter((doctor) => {
    const matchSpecialization = id
      ? String(doctor.id) === String(id)
      : true;

    const currentLocation = locationValue || urlLocation;

    const matchLocation = currentLocation
      ? doctor.address?.toLowerCase().includes(currentLocation.toLowerCase())
      : true;

    const matchSearch = searchValue
      ? doctor.fullname?.toLowerCase().includes(searchValue.toLowerCase()) ||
        doctor.specialization?.toLowerCase().includes(searchValue.toLowerCase())
      : true;

    return matchSpecialization && matchLocation && matchSearch;
  });

  return (
    <div className="min-vh-100 d-flex flex-column">
      <main className="flex-grow-1">
        <div
          className="position-fixed top-0 start-0 w-100 bg-white"
          style={{ zIndex: 1050 }}
        >
          <NavbarComp />
        </div>

        <div style={{ marginTop: "100px", marginLeft: "100px" }}>
          <LocationandSearch
            locationValue={locationValue}
            setLocationValue={setLocationValue}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            doctorsData={doctorsData}
          />
        </div>

        <div className="container w-100" style={{ marginTop: "50px" }}>
          {drs.length > 0 ? (
            <h1>{drs.length} Doctor's available</h1>
          ) : (
            <h1>No Doctor's available</h1>
          )}

          {drs.map((doctor, index) => {
            const doctorId = doctor._id || doctor.id;

            const profilePic = doctor?.profilephoto
              ? `http://localhost:4545/uploads/${doctor.profilephoto}`
              : "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png";

            return (
              <div
                key={doctorId || index}
                className="d-flex align-items-center justify-content-between border-bottom py-4"
              >
                <div className="text-center me-4">
                  <img
                    src={profilePic}
                    alt="profile"
                    width={120}
                    height={120}
                    style={{
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "5px solid white",
                    }}
                  />

                  <br />

                  <Link
                    to={`/viewProfile/${doctor.id}`}
                    className="text-info text-decoration-none fw-semibold"
                  >
                    View Profile
                  </Link>
                </div>

                <div className="flex-grow-1">
                  <Link
                    to={`/viewprofile?id=${doctor.id}`}
                    className="text-decoration-none text-dark"
                  >
                    <h5 className="mb-1"> {doctor.fullname}</h5>
                  </Link>

                  <p className="mb-1 text-muted">{doctor.specialization}</p>
                  <p className="mb-1">{doctor.experience} experience overall</p>
                  <p className="mb-1">Address: {doctor.address}</p>

                  <p className="mb-0 fw-semibold">
                    ₹{doctor.consultation} Consultation Fee at Clinic
                  </p>
                </div>

                <div className="ms-4 text-end text-center">
                  <p className="text-success">
                    <i className="bi bi-calendar3"></i> Available today
                  </p>

                  <Link
                    to={`/doctor/${doctorId}`}
                    className="btn btn-info text-white px-4 py-2 my-3 rounded-3"
                  >
                    Book Appointment
                  </Link>

                  <div>
                    <Link
                      className="Contact-Clinic border px-4 py-2 my-3 rounded-3 text-center"
                      to="/"
                    >
                      <i className="bi bi-telephone-fill mx-2"></i>
                      Contact Clinic
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}