import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useParams, useSearchParams } from "react-router-dom";

import Footer from "../../components/Footer";
import NavbarComp from "../../components/Navbar";
import LocationandSearch from "../NavPages/Location";
import Appointment from "../Hero-Pages/Appointment";
import ProfileBreadcrumb from "./Breadcrumb";

import { useGetdrdataQuery } from "../../features/auth/services/drDataApi";

import "../../style/viewProfile-page.css";

const FALLBACK_IMAGE =
  "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png";

export default function ViewProfile() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const scrollContainerRef = useRef(null);
  
  const [locationValue, setLocationValue] = useState("Hyderabad");
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  );

  const [showScrollArrow, setShowScrollArrow] = useState(false);

  const {
    data: drProfile,
    isLoading,
    error,
  } = useGetdrdataQuery({ id });

  const handleScroll = (event) => {
    const currentScroll = event.currentTarget.scrollTop;
    setShowScrollArrow(currentScroll > 200);
  };

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="profile-status-message">
        <h2>Loading doctor profile...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-status-message">
        <h2>Something went wrong...</h2>
      </div>
    );
  }

  const doctors = Array.isArray(drProfile?.data)
    ? drProfile.data
    : drProfile?.data
      ? [drProfile.data]
      : [];

  const selectedDoctor = doctors[0];

  if (!selectedDoctor) {
    return (
      <div className="profile-status-message">
        <h2>Doctor profile not found</h2>
      </div>
    );
  }

  const consultationFee =
    selectedDoctor.consultationFee ??
    selectedDoctor.consultation ??
    null;

  const getProfileImage = () => {
    if (selectedDoctor.profileImage) {
      return selectedDoctor.profileImage;
    }

    if (
      typeof selectedDoctor.profilephoto === "string" &&
      selectedDoctor.profilephoto
    ) {
      if (selectedDoctor.profilephoto.startsWith("http")) {
        return selectedDoctor.profilephoto;
      }
      return `http://localhost:4545/uploads/${selectedDoctor.profilephoto}`;
    }

    return FALLBACK_IMAGE;
  };

  return (
    <div 
      ref={scrollContainerRef}
      className="profile-page-wrapper"
      onScroll={handleScroll}
      style={{ height: "100vh", overflowY: "auto", overflowX: "hidden" }}
    >
      <header className="profile-header">
        <NavbarComp />

        <div className="profile-search-wrapper">
          <LocationandSearch
            locationValue={locationValue}
            setLocationValue={setLocationValue}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            doctorsData={doctors}
            wrapperStyle={{
              width: "100%",
              minHeight: "50px",
              margin: "0 auto",
            }}
          />
        </div>

        <div className="profile-breadcrumb-wrapper">
          <ProfileBreadcrumb doctor={selectedDoctor} />
        </div>
      </header>

      <main className="viewProfile-page">
        <div className="profile-page-layout">
          <div className="profile-left-section">
            <section className="Doctor-profile-card">
              <div className="profile-image-wrapper">
                <img
                  src={getProfileImage()}
                  className="profile-image"
                  alt={`Dr. ${selectedDoctor.fullname || "Doctor"}`}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />
              </div>

              <div className="profile-content">
                <h1>Dr. {selectedDoctor.fullname || "Name not available"}</h1>
                <p className="doctor-specialization">
                  {selectedDoctor.specialization || "Specialization not available"}
                </p>

                {selectedDoctor.qualification && (
                  <p>{selectedDoctor.qualification}</p>
                )}

                <p>
                  {selectedDoctor.experience || "Experience not available"} experience overall
                </p>

                <p>{selectedDoctor.address || "Address not available"}</p>

                <p className="consultation-fee">
                  {consultationFee !== null
                    ? `₹${consultationFee} Consultation Fee`
                    : "Consultation fee not available"}
                </p>

                {selectedDoctor.about && (
                  <p className="doctor-about">{selectedDoctor.about}</p>
                )}

                <div className="profile-verification">
                  <p>
                    <span className="verification-icon">✓</span>
                    Medical Registration Verified
                  </p>
                  <p>
                    <span className="feedback-icon">👍</span>
                    97% positive feedback
                  </p>
                </div>
              </div>
            </section>

            <nav className="drinfo-drop-downs" aria-label="Doctor profile sections">
              <button type="button" className="drinfo-drop-downs-childs active-profile-tab">
                Info
              </button>
              <button type="button" className="drinfo-drop-downs-childs">Stories</button>
              <button type="button" className="drinfo-drop-downs-childs">Surgeries &amp; Treatments</button>
              <button type="button" className="drinfo-drop-downs-childs">Photos &amp; Videos</button>
              <button type="button" className="drinfo-drop-downs-childs">Consult Q&amp;A</button>
              <button type="button" className="drinfo-drop-downs-childs">Healthfeed</button>
            </nav>

            <section className="doctor-information-card">
              <h2>{selectedDoctor.clinicName || "Doctor Clinic"}</h2>
              <h3>{selectedDoctor.address || "Clinic address not available"}</h3>

              <div className="doctor-clinic-info">
                <div>
                  <span className="rating">4.5 ★</span>
                  <p>Clinic Excellence Rating</p>
                </div>
                <div>
                  <strong>Mon - Sat</strong>
                  <p>11:00 AM - 07:00 PM</p>
                </div>
                <div>
                  <strong>Consultation Fee</strong>
                  <p>
                    {consultationFee !== null
                      ? `₹${consultationFee}`
                      : "Not available"}
                  </p>
                </div>
              </div>

              {selectedDoctor.languages && (
                <p className="doctor-languages">
                  <strong>Languages: </strong>
                  {Array.isArray(selectedDoctor.languages)
                    ? selectedDoctor.languages.join(", ")
                    : selectedDoctor.languages}
                </p>
              )}
            </section>

            <section className="doctor-details-card">
              <h2>About the Doctor</h2>
              <p>
                {selectedDoctor.about ||
                  `Dr. ${selectedDoctor.fullname || ""} provides medical consultation and treatment services.`}
              </p>

              <div className="doctor-detail-row">
                <h3>Specialization</h3>
                <p>{selectedDoctor.specialization || "Information not available"}</p>
              </div>
              <div className="doctor-detail-row">
                <h3>Experience</h3>
                <p>{selectedDoctor.experience || "Information not available"}</p>
              </div>
              <div className="doctor-detail-row">
                <h3>Qualification</h3>
                <p>{selectedDoctor.qualification || "Information not available"}</p>
              </div>
              <div className="doctor-detail-row">
                <h3>Services</h3>
                <p>Medical consultation, diagnosis, health advice and treatment services.</p>
              </div>
              <div className="doctor-detail-row">
                <h3>Clinic Timings</h3>
                <p>Monday to Saturday, 11:00 AM to 07:00 PM.</p>
              </div>
            </section>
          </div>

          <aside className="schedule-appointment">
            <h2 className="appointment-heading">Pick a time slot</h2>
            <div className="appointment-component-wrapper">
              <Appointment doctor={selectedDoctor} />
            </div>
          </aside>
        </div>
      </main>

      <footer className="profile-footer">
        <Footer />
      </footer>

      {showScrollArrow &&
        createPortal(
          <button
            type="button"
            className="scroll-to-top"
            onClick={scrollToTop}
            aria-label="Scroll to top"
            title="Go to top"
          >
            ↑
          </button>,
          document.body
        )}
    </div>
  );
}