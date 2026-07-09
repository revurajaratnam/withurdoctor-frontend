import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom"; 
import NavbarComp from "../../components/Navbar";
import { useLazyGetdrdataQuery } from "../../features/auth/services/drDataApi";
import Footer from "../../components/Footer";
import LocationandSearch from "./Location";
import AppointmentSchedule from "../Hero-Pages/Schedule";
import ClinicandHospital from "../Hero-Pages/ClinicandHospital";

export default function FindDoctors() {
  const [searchParams] = useSearchParams();
  const urlSearch = searchParams.get("search");
  
  const [locationValue, setLocationValue] = useState("");
  const [searchValue, setSearchValue] = useState(urlSearch);
  const [doctors, setDoctors] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [openDoctorId, setopenDoctorId] = useState(null); 
  const [clinicPh,setClinicPh] = useState(null)
  
  const urlLocation = searchParams.get("location") || "";
  const currentLocation = locationValue || urlLocation;
  const [triggerFetch] = useLazyGetdrdataQuery();
  const observerRef = useRef(null);

  const loadDoctors = async (resetList = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await triggerFetch({
        cursor: resetList ? null : cursor,
        search: searchValue,
        location: currentLocation,
        urlSearch,
      }).unwrap();

      const newData = Array.isArray(res?.data) ? res.data : [];
      setDoctors(prev => (resetList ? newData : [...prev, ...newData]));
      setCursor(res?.nextCursor ?? null);
      setHasMore(Boolean(res?.hasMore));
    } catch (err) {
      console.log(err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setDoctors([]);
    setCursor(null);
    setHasMore(true);
    loadDoctors(true);
  }, [searchValue, currentLocation, urlSearch]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        loadDoctors(false);
      }
    });
    const node = observerRef.current;
    if (node) observer.observe(node);
    return () => { if (node) observer.unobserve(node); };
  }, [cursor, hasMore, loading]);

  return (
    <div className="min-vh-100 d-flex flex-column">
      <main className="flex-grow-1">
        <div className="position-fixed top-0 start-0 w-100 bg-white" style={{ zIndex: 1050 }}>
          <NavbarComp />
        </div>

        <div style={{ marginTop: "100px", marginLeft: "100px" }}>
          <LocationandSearch
            locationValue={locationValue}
            setLocationValue={setLocationValue}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            doctorsData={doctors}
          />
        </div>

        <div className="container w-100" style={{ marginTop: "50px" }}>
          {doctors?.length > 0 ? (
            <h1>{doctors.length} Doctor's Available</h1>
          ) : !loading ? (
            <h1>No Doctor's available</h1>
          ) : null}

          {doctors?.map((doctor, index) => {
            const doctorId = doctor._id || doctor.id;
            const profilePic = doctor?.profilephoto
              ? `http://localhost:4545/uploads/${doctor.profilephoto}`
              : "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png";

            return (
              <div key={doctorId || index} className="d-flex flex-wrap align-items-center justify-content-between border-bottom py-4 w-100">
                
                <div className="d-flex align-items-center w-75">
                  <div className="text-center me-4">
                    <img src={profilePic} alt="profile" width={120} height={120}
                      style={{ borderRadius: "50%", objectFit: "cover", border: "5px solid white" }} />
                    <br />
                    <Link to={`/viewProfile${doctor.id}`}>View Profile</Link>
                  </div>

                  <div className="">
                    <Link to={`/viewprofile?id=${doctor.id}`} className="text-decoration-none text-dark">
                      <h5 className="mb-1">{doctor.fullname}</h5>
                    </Link>
                    <p className="mb-1 text-muted">{doctor.specialization}</p>
                    <p className="mb-1">{doctor.experience} experience overall</p>
                    <p className="mb-1 " >Address: {doctor.address}</p>
                    <p className="mb-0 fw-semibold">₹{doctor.consultation} Consultation Fee at Clinic</p>
                  </div>
                </div>

                <div className="ms-4 text-center">
                  <p className="text-success mt-3"><i className="bi bi-calendar3"></i> Available today</p>
                  
                  <button 
                    onClick={() => setopenDoctorId(openDoctorId === doctorId ? null : doctorId)}
                    className= " btn btn-info text-white px-4 py-2 my-3 rounded-3"
                  >
                    Book Appointment
                  </button>
                  
                  <div>
                    <button className="Contact-Clinic border px-4 py-2 my-3 rounded-3 text-center" 
                    onClick={() => setClinicPh(clinicPh ===doctorId ? null : doctorId)}
                    >
                      <i className="bi bi-telephone-fill mx-2"></i> Contact Clinic
                    </button>
                  </div>
                </div>
                {
                  clinicPh === doctorId && (
                    <div className="w-100">
                      <ClinicandHospital doctorId = {doctorId} />
                    </div>
                  )
                }

                {openDoctorId === doctorId && (
                  <div className="w-100 mt-4 p-3 bg-light border rounded">
                    <AppointmentSchedule doctorId={doctorId} />
                  </div>
                )}
                
              </div>
            );
          })}

          <div ref={observerRef} className="text-center py-3">
            {loading ? "Loading more doctors..." : !hasMore ? "No more doctors" : ""}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}