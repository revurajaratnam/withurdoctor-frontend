import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import NavbarComp from "../../components/Navbar";
import { useState, useRef, useEffect } from "react";
import { states } from "../../utils/StatesAndCities";
import { specialization } from "../../utils/drSpecial";
import LocationandSearch from "./Location";
import { useGetdrdataQuery } from "../../features/auth/services/drDataApi";



export default function FindDrHome() {
  const [dropdown, setDropdown] = useState(null);
  const [locationValue, setLocationValue] = useState("Hyderabad");
  const [searchValue, setSearchValue] = useState("");
  const {data:doctorsData} = useGetdrdataQuery();
  

  

  return (
    <div className="min-vh-100 d-flex flex-column">
      <div
        className="position-fixed top-0 start-0 w-100 bg-white"
        style={{ zIndex: 1050 }}
      >
        <NavbarComp />
      </div>

      <div
        className="find-hero d-flex flex-column justify-content-center align-items-center text-center"
        style={{
          marginTop: "70px",
          width: "100%",
          height: "480px",
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url('https://wallpapercave.com/wp/wp12768528.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <h1
          className="text-white"
          style={{
            fontSize: "50px",
            fontWeight: "bold",
            textShadow: "2px 2px 15px rgba(0,0,0,0.25)",
          }}
        >
          Your home for health
        </h1>

        <h1
          className="text-white"
          style={{
            fontSize: "30px",
            fontWeight: "bold",
            textShadow: "2px 2px 15px rgba(0,0,0,0.50)",
          }}
        >
          Find and Book
        </h1>

          <div className="findHome-align" >
            <LocationandSearch
            locationValue={locationValue}
            setLocationValue={setLocationValue}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            doctorsData={doctorsData}
            
             />
          </div>

        <div className="d-flex   align-items-center mt-3">
    
            <p className="text-white mb-0 me-3 ">Popular searches:</p>
          <Link to="/FindDoctors?search=Dermatologist" className="popular-search">
            Dermatologist
          </Link>
          <Link to="/FindDoctors?search=Pediatrician" className="popular-search">
            Pediatrician
          </Link>
          <Link to="/FindDoctors?search=Gynecologist" className="popular-search">
            Gynecologist/Obstetrician
          </Link>
          <Link to="/FindDoctors" className="popular-search">
            Other
          </Link>
          </div>
      </div>

      <div
        className="d-flex flex-wrap gap-3 justify-content-center align-items-center"
        style={{ width: "100%", minHeight: "70px", backgroundColor: "#111731" }}
      >
        <Link to="/VideoConsult" className="icon-text">
          <span className="d-flex flex-column justify-content-center align-items-center gap-1">
            <i
              className="bi bi-chat-right-text icon"
              style={{ fontSize: "15px", color: "white" }}
            ></i>
            <p>Consult with a doctor</p>
          </span>
        </Link>

        <Link to="/Medicines" className="icon-text">
          <span className="d-flex flex-column justify-content-center align-items-center gap-1">
            <i
              className="bi bi-cart2 icon"
              style={{ fontSize: "15px", color: "white" }}
            ></i>
            <p>Order Medicines</p>
          </span>
        </Link>

        <Link to="/medical-records" className="icon-text">
          <span className="d-flex flex-column justify-content-center align-items-center gap-1">
            <i
              className="bi bi-journal-plus icon"
              style={{ fontSize: "15px", color: "white" }}
            ></i>
            <p>View medical records</p>
          </span>
        </Link>

        <Link to="/LabTests" className="icon-text">
          <span className="d-flex flex-column justify-content-center align-items-center gap-1">
            <i
              className="bi bi-clipboard2-pulse icon"
              style={{ fontSize: "15px", color: "white" }}
            ></i>
            <p>Book lab tests</p>
          </span>
        </Link>

        <Link to="/Surgeries" className="icon-text">
          <span className="d-flex flex-column justify-content-center align-items-center gap-1">
            <i
              className="bi bi-hospital icon"
              style={{ fontSize: "15px", color: "white" }}
            ></i>
            <p>Book surgeries</p>
          </span>
        </Link>

        <Link to="/Forcorporates" className="icon-text">
          <span className="d-flex flex-column justify-content-center align-items-center gap-1">
            <i
              className="bi bi-people icon"
              style={{ fontSize: "15px", color: "white" }}
            ></i>
            <p>For healthcare providers</p>
          </span>
        </Link>
      </div>

      <div className="container py-5">
        <h1>
          Safety of your data is our <b>top priority</b>
        </h1>
      </div>

      <div
        className="d-flex flex-column justify-content-center align-items-center gap-3"
        style={{ width: "100%", minHeight: "50vh", backgroundColor: "#E5F1F9" }}
      >
        <div className="text-center">
          <h1>
            Instant appointment with doctors. <b>Guaranteed.</b>
          </h1>
          <p>3 Verified doctors</p>
          <p>0+ Patients recommendations</p>
          <p>0 Patients/year</p>
          <Link to="/FindDoctors">Find me the right doctor</Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}