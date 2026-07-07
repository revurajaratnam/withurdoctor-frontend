import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
import Logo from "../assets/Logo.png"
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/Slice/UserSlice";
import caretdown from '../assets/caret-down-svgrepo-com.svg'
import caretup from '../assets/caret-up-svgrepo-com.svg'

export default function NavbarComp() {
  const [drop, setDrop] = useState(null);
  const { user, email, isLoggedIn } = useSelector((state) => state.dr);
  const dispatch = useDispatch();
  const handleOnchage = (name) => {
    setDrop(drop === name ? null : name)
  }
  const handleLogout = () => {
    const token = localStorage.removeItem("token");
    //   const token=  sessionStorage.removeItem("token");

    if (!token) {
      dispatch(logout())
    }
  }
  // console.log(user);
  // const username = location.state.email;
  return (
    <div>
      <Container>
        <div className=" container d-flex flex-grow-1 flex-wrap  align-items-center justify-content-between p-2 w-100 " style={{zIndex:"1000"}}>
          <div className="d-flex gap-4 align-items-center">
            <Link to="/"> <img src={Logo} alt="WithUrDoctor Logo" width="100px" /></Link>

            <Link to="/Finddrhome" className="text-decoration-none text-dark " style={{borderBottom:window.location.pathname === "/Finddrhome"?"5px solid #199FD9":"none"}}><b>Find Doctors</b></Link>
            <Link to="/VideoConsult" className="text-decoration-none text-dark" style={{borderBottom:window.location.pathname === "/VideoConsult"?"5px solid #199FD9":"none"}}><b>Video Consult</b></Link>
            {/* <Link to="/Medicines" className="text-decoration-none text-dark"style={{borderBottom:window.location.pathname === "/Medicines"?"5px solid #199FD9":"none"}}><b>Medicines</b></Link> */}
            <Link to="/LabTests" className="text-decoration-none text-dark" style={{borderBottom:window.location.pathname === "/LabTests"?"5px solid #199FD9":"none"}}><b>Lab Tests</b></Link>
            <Link to="/Surgeries" className="text-decoration-none text-dark"style={{borderBottom:window.location.pathname === "/Surgeries"?"5px solid #199FD9":"none"}}><b>Surgeries</b></Link>
          </div>
          <div className="d-flex gap-4 align-items-center  ">
            <div className="position-relative">
              <span
                onClick={() => handleOnchage("forcorporates")}
                className="text-dark"
                style={{ cursor: "pointer" }}
              >
                <span
                  className="badge rounded-pill me-1"
                  style={{ background: "#28328C", fontSize: "9px", fontWeight: "normal" }}
                >
                  NEW
                </span>
                For Corporates {drop === "forcorporates" ?<img src={caretup} width={15} alt="" />:<img src={caretdown} width={15} alt="" />}
              </span>

              {drop === "forcorporates" && (
                <div className="position-absolute top-100 start-0 mt-2 bg-white shadow rounded p-2 text-nowrap z-3 forProviders" >
                  <p className="mb-0 py-2 px-3 ">Health & Wellness Plans</p>
                  <p className="mb-0 py-2 px-3">Group Insurance</p>
                </div>
              )}
            </div>

            <div className="position-relative ">
              <span
                onClick={() => handleOnchage("forproviders")}
                className="text-dark"
                style={{ cursor: "pointer" }}
              >
                For Providers {drop === "forproviders" ? <img src={caretup} width={15} alt="" />:<img src={caretdown} width={15} alt="" />}
              </span>

              {drop === "forproviders" && (
                <div className="position-absolute top-100 start-0 mt-2 bg-white shadow rounded p-2 text-nowrap z-3 forProviders">
                  <p className=" d-block mb-0 py-2 px-3">WithUrDoctor Prime</p>
                  <p className=" d-block mb-0 py-2 px-3">Software for providers</p>
                  <p className=" d-block mb-0 py-2 px-3">List your practice for free</p>
                </div>
              )}
            </div>

            <div className="position-relative">
              <span
                onClick={() => handleOnchage("security")}
                className="text-dark"
                style={{ cursor: "pointer" }}
              >
                Security & Help {drop === "security" ? <img src={caretup} width={15} alt="" />:<img src={caretdown} width={15} alt="" />}
              </span>

              {drop === "security" && (
                <div className="position-absolute top-100 start-0 mt-2 bg-white shadow rounded p-2 text-nowrap z-3">
                  <p className="mb-0 py-2 px-3">Data security</p>
                  <p className="mb-0 py-2 px-3">Help</p>
                </div>
              )}
            </div>
          </div>
          <div className="position-relative ">
  {isLoggedIn ? (
    <>
      <p
        className="mb-0"
        style={{ cursor: "pointer" }}
        onClick={()=>handleOnchage("profiledrop")}
      >
        {user?.email?.split("@")[0] || email?.split("@")[0]} {drop==="profiledrop"?<img src={caretup} width={15} alt="" />:<img src={caretdown} width={15} alt="" />}
      </p>

      {drop === "profiledrop" && (
  <div className="position-absolute top-100  end-0 mt-2 bg-white shadow rounded p-3 text-nowrap z-3 profile-dropdown">
    
    <span><img src="https://img.magnific.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?semt=ais_hybrid&w=740&q=80" width={50} height={50} alt="" /></span>
    
    <span className="mb-0 py-2 px-2 text-muted " style={{fontSize:"12px"}}>
      {user?.email}</span>
    <Link className="d-block text-decoration-none text-dark py-2 px-3 hover-zoom" to="/myappointments">My Appointments</Link>
    <Link className="d-block text-decoration-none text-dark py-2 px-3 hover-zoom">My Tests</Link>
    <Link className="d-block text-decoration-none text-dark py-2 px-3 hover-zoom">My Medicine Orders</Link>
    <Link className="d-block text-decoration-none text-dark py-2 px-3 hover-zoom">My Medical Records</Link>
    <Link className="d-block text-decoration-none text-dark py-2 px-3 hover-zoom">My Online Consultations</Link>
    <Link className="d-block text-decoration-none text-dark py-2 px-3 hover-zoom">My Feedback</Link>
    <Link className="d-block text-decoration-none text-dark py-2 px-3 hover-zoom">View / Profile Update</Link>
    <Link className="d-block text-decoration-none text-dark py-2 px-3 hover-zoom">Settings</Link>
    <Link to="/" onClick={handleLogout} className="d-block text-decoration-none text-dark py-2 px-3 hover-zoom">
      Logout
    </Link>
    <Link to="/drprofile">Switching Products Account</Link>
  </div>
)}
    </>
  ) : (
    <Link to="/LoginAndSignupDashboard">
      <button id="login-signup-btn">Login / Signup</button>
    </Link>
  )}
</div>
        </div>
      </Container>

    </div>
  )
}