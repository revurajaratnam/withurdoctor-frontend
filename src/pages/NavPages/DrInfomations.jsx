import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useSearchParams, Link } from "react-router-dom"; 
import NavbarComp from "../../components/Navbar";
import { useLazyGetdrdataQuery } from "../../features/auth/services/drDataApi";
import Footer from "../../components/Footer";
import LocationandSearch from "./Location";
import AppointmentSchedule from "../Hero-Pages/Schedule";
import ClinicandHospital from "../Hero-Pages/ClinicandHospital";
import FilterDoctors from "./FilterDoctors";
import Logo from "../../assets/Logo.png";
import Appointment from "../Hero-Pages/Appointment";
import "../../style/profile-container.css";

export default function FindDoctors() {
  const [searchParams] = useSearchParams();
  const initialFilters = {
    gender: "",
    experience: null,
    consultationFee: null,
    cosultType: ""
  };

  const specilizationParam = searchParams.get("specialization") || "";
  const urlSearch = searchParams.get("search");
  
  const [locationValue, setLocationValue] = useState("Hyderabad");
  const [searchValue, setSearchValue] = useState(urlSearch);
  const [dropFilter, setDropFilter] = useState({
    gender: "",
    experience: "",
    price: "",
  });

  const [doctors, setDoctors] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [openDoctorId, setopenDoctorId] = useState(null); 
  const [clinicPh, setClinicPh] = useState(null);
  
  const urlLocation = searchParams.get("location") || "";
  const currentLocation = locationValue || urlLocation;
  
  const [triggerFetch] = useLazyGetdrdataQuery();
  const observerRef = useRef(null);
  const requestIDRef = useRef(0);
  
  const scrollContainerRef = useRef(null);
  const [showScrollArrow, setShowScrollArrow] = useState(false);

  const handleResetFilter = () => {
    setDropFilter(initialFilters);
  };                                                  

  const loadDoctors = async (resetList = false) => {
    if (loading) return;
    setLoading(true);
    const thisRequestID = ++requestIDRef.current;
    
    try {
      const res = await triggerFetch({
        cursor: resetList ? null : cursor,
        search: searchValue,
        location: currentLocation,
        specialization: specilizationParam,
        gender: dropFilter.gender,
        experienceMin: dropFilter.experience?.min ?? "",
        experienceMax: dropFilter.experience?.max ?? "",
        consultationFeeMin: dropFilter.consultationFee?.min ?? "",
        consultationFeeMax: dropFilter.consultationFee?.max ?? "",
      }).unwrap();
      
      if(thisRequestID !== requestIDRef.current) {
        return;
      }

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
  }, [searchValue, currentLocation, urlSearch, specilizationParam, dropFilter]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        loadDoctors(false);
      }
    }, {
      root: scrollContainerRef.current,
      rootMargin: "0px",
      threshold: 0.1
    });
    
    const node = observerRef.current;
    if (node) observer.observe(node);
    
    return () => { 
      if (node) observer.unobserve(node); 
    };
  }, [cursor, hasMore, loading]);

  const handleScroll = (event) => {
    const currentScroll = event.currentTarget.scrollTop;
    setShowScrollArrow(currentScroll > 400);
  };

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <div 
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="find-doctors-layout"
    >
      <main className="find-doctors-main">
        
        <div className="find-doctors-navbar">
          <NavbarComp />
        </div>

        <div className="find-doctors-search-wrapper">
          <LocationandSearch
            locationValue={locationValue}
            setLocationValue={setLocationValue}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            doctorsData={doctors}
            wrapperStyle={{
              width: "70%",
              height: "50px",
              marginLeft: "auto",
              marginRight: "auto"
            }}
          />
        </div>

        <div className="find-doctors-content">
          <FilterDoctors 
            dropFilter={dropFilter}
            setDropFilter={setDropFilter}
            onResetFilter={handleResetFilter}
          />
        
          {doctors?.map((doctor, index) => {
            const doctorId = doctor._id || doctor.id;
            const profileImage =
              doctor.profileImage ||
              "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png";

            return (
              <div key={doctorId || index} className="doctor-card">
                <div className="doctor-image-section">
                  <div className="doctor-image-wrapper">
                    <img
                      src={profileImage}
                      alt={doctor.fullname || "Doctor"}
                      className="doctor-profile-image"
                    />
                  </div>

                  <Link
                    to={`/viewProfile/${doctorId}`}
                    className="view-profile-link"
                  >
                    View Profile
                  </Link>
                </div>

                <div className="doctor-details-section">
                  <Link
                    to={`/viewProfile/${doctorId}`}
                    className="doctor-name-link"
                  >
                    <h4>Dr. {doctor.fullname}</h4>
                  </Link>

                  <p className="doctor-specialization">
                    {doctor.specialization}
                  </p>

                  <p className="doctor-experience">
                    {doctor.experience} experience overall
                  </p>

                  <p className="doctor-location">
                    <i className="bi bi-geo-alt-fill"></i>
                    {doctor.city} {doctor.hospitalName}
                  </p>

                  <p className="doctor-fee">
                    <i className="bi bi-currency-rupee"></i>
                    {doctor.consultationFee} Consultation Fee at Clinic
                  </p>

                  <div className="doctor-card-divider"></div>

                  <div className="doctor-rating">
                    <i className="bi bi-hand-thumbs-up-fill"></i>
                    <span>{doctor.rating || 0}%</span>
                  </div>
                </div>

                <div className="doctor-actions-section">
                  <p className="available-text">
                    <i className="bi bi-calendar-check-fill"></i>
                    Available today
                  </p>

                  <button
                    type="button"
                    className="book-appointment-btn"
                    onClick={() =>
                      setopenDoctorId(
                        openDoctorId === doctorId ? null : doctorId
                      )
                    }
                  >
                    <i className="bi bi-calendar3"></i>
                    Book Appointment
                  </button>

                  <button
                    type="button"
                    className="contact-clinic-btn"
                    onClick={() =>
                      setClinicPh(clinicPh === doctorId ? null : doctorId)
                    }
                  >
                    <i className="bi bi-telephone-fill"></i>
                    Contact Clinic
                  </button>
                </div>

                {clinicPh === doctorId && (
                  <div className="doctor-dropdown-section">
                    <ClinicandHospital doctor={doctor} />
                  </div>
                )}

                {openDoctorId === doctorId && (
                  <div className="doctor-dropdown-section appointment-dropdown">
                    <Appointment doctorId={doctorId} />
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
      
      <div className="find-doctors-footer">
        <Footer />
      </div>

      {showScrollArrow && (
        <button
          type="button"
          className="scroll-to-top-btn"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          title="Go to top"
        >
          ↑
        </button>
      )}
    </div>
  );
}