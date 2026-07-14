import { useParams, useSearchParams } from "react-router-dom";
import Footer from "../../components/Footer";
import NavbarComp from "../../components/Navbar";
import { useGetdrdataQuery } from "../../features/auth/services/drDataApi";
import "../../style/viewProfile-page.css"
import LocationandSearch from "../NavPages/Location";
import AppointmentSchedule from "../Hero-Pages/Schedule";
import { useState } from "react";
import ProfileBreadcrumb from "./Breadcrumb";
import Appointment from "../Hero-Pages/Appointment";
export default function ViewProfile() {
  const [searchParams] = useSearchParams();
  const urlSearch = searchParams.get("search");
  const [locationValue, setLocationValue] = useState("Hyderabad");
  const [searchValue, setSearchValue] = useState(urlSearch);
  const { id } = useParams();

  const { data: drProfile, isLoading, error } = useGetdrdataQuery({ id });

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>Something went wrong...</h1>;
  }

  const doctors = Array.isArray(drProfile?.data) ? drProfile.data : [];
  const selectedDoctor = doctors[0];

  if (!selectedDoctor) {
    return <h1>Doctor profile not found</h1>;
  }

  // const profilePic = selectedDoctor.profilephoto
  //   ? `http://localhost:4545/uploads/${selectedDoctor.profilephoto}`
  //   : "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png";

  return (
    <div className="min-vh-100 d-flex flex-column  ">
      <header className="navBars-search">
        <NavbarComp />
        <LocationandSearch 
          locationValue={locationValue}
          setLocationValue={setLocationValue}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          doctorsData={doctors}
          wrapperStyle={{
            width: "70%",
            height: "50px",
            marginLeft: "200px",
          }}
        />
        <ProfileBreadcrumb doctor={selectedDoctor} />
      </header>
      <div>

      </div>
      <div className="breadcrumb-profile">

          </div>
      <main className="flex-grow-1 viewProfile-page">
          
          <div className="d-flex  Doctor-profile-card">

          <div className="profile">
            <img
              src={selectedDoctor.profileImage}
              width={150}
              height={100}
              className="profile-image"
              alt={selectedDoctor.fullname}
            />
          </div>
          <div className="ms-4">
            <h1>Dr. {selectedDoctor.fullname}</h1>
            <p className="text-success">{selectedDoctor.specialization}</p>
            <p>{selectedDoctor.experience} experience overall</p>
            <p>{selectedDoctor.address}</p>
            <p>₹{selectedDoctor.consultationFee} Consultation Fee</p>
          </div>
        </div>
        <div className="schedule-appointment">
          {/* <AppointmentSchedule /> */}
          <Appointment />
        </div>
        <section className="drinfo-drop-downs">
        <div className=" drinfo-drop-downs-childs">
          Info 
          {

          }
        </div>
        <div className=" drinfo-drop-downs-childs">
          Stories 
        </div>
        <div className=" drinfo-drop-downs-childs">
          Surguries & Treatments 
        </div>
        <div className=" drinfo-drop-downs-childs" >
          photos & videos 
        </div>
        <div className=" drinfo-drop-downs-childs">
          Consult Q&A
        </div >
        <div className=" drinfo-drop-downs-childs">
         Healthfeed
        </div>
      </section>
      </main>
      

      <footer>
        <Footer />
      </footer>
    </div>
  );
}