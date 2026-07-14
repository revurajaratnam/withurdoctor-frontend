import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/Logo.png";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/Slice/UserSlice";
import caretdown from "../assets/caret-down-svgrepo-com.svg";
import caretup from "../assets/caret-up-svgrepo-com.svg";

export default function NavbarComp() {
  const [drop, setDrop] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, email, isLoggedIn } = useSelector((state) => state.dr);

  const dispatch = useDispatch();
  const location = useLocation();

  const handleOnChange = (name) => {
    setDrop((previous) => (previous === name ? null : name));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    setMenuOpen(false);
    setDrop(null);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setDrop(null);
  };

  const activeStyle = (path) => ({
    borderBottom:
      location.pathname === path ? "5px solid #199FD9" : "none",
  });

  return (
    <header className="navbar-wrapper">
      <nav className="navbar">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img src={Logo} alt="WithUrDoctor Logo" width="100" />
        </Link>

        <button
          type="button"
          className="menu-button"
          aria-label="Open navigation menu"
          onClick={() => setMenuOpen((previous) => !previous)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <div className={`navbar-items ${menuOpen ? "show-menu" : ""}`}>
          <Link
            to="/Finddrhome"
            className="text-decoration-none text-dark"
            style={activeStyle("/Finddrhome")}
            onClick={closeMenu}
          >
            <b>Find Doctors</b>
          </Link>

          <Link
            to="/VideoConsult"
            className="text-decoration-none text-dark"
            style={activeStyle("/VideoConsult")}
            onClick={closeMenu}
          >
            <b>Video Consult</b>
          </Link>

          <Link
            to="/LabTests"
            className="text-decoration-none text-dark"
            style={activeStyle("/LabTests")}
            onClick={closeMenu}
          >
            <b>Lab Tests</b>
          </Link>

          <Link
            to="/Surgeries"
            className="text-decoration-none text-dark"
            style={activeStyle("/Surgeries")}
            onClick={closeMenu}
          >
            <b>Surgeries</b>
          </Link>

          <div className="position-relative">
            <span
              className="text-dark navbar-dropdown-title"
              onClick={() => handleOnChange("forcorporates")}
            >
              <span
                className="badge rounded-pill me-1"
                style={{
                  background: "#28328C",
                  fontSize: "9px",
                  fontWeight: "normal",
                }}
              >
                NEW
              </span>

              For Corporates

              <img
                src={drop === "forcorporates" ? caretup : caretdown}
                width={15}
                alt=""
              />
            </span>

            {drop === "forcorporates" && (
              <div className="navbar-dropdown">
                <p>Health & Wellness Plans</p>
                <p>Group Insurance</p>
              </div>
            )}
          </div>

          <div className="position-relative">
            <span
              className="text-dark navbar-dropdown-title"
              onClick={() => handleOnChange("forproviders")}
            >
              For Providers

              <img
                src={drop === "forproviders" ? caretup : caretdown}
                width={15}
                alt=""
              />
            </span>

            {drop === "forproviders" && (
              <div className="navbar-dropdown">
                <p>WithUrDoctor Prime</p>
                <p>Software for providers</p>
                <p>List your practice for free</p>
              </div>
            )}
          </div>

          <div className="position-relative">
            <span
              className="text-dark navbar-dropdown-title"
              onClick={() => handleOnChange("security")}
            >
              Security & Help

              <img
                src={drop === "security" ? caretup : caretdown}
                width={15}
                alt=""
              />
            </span>

            {drop === "security" && (
              <div className="navbar-dropdown">
                <p>Data security</p>
                <p>Help</p>
              </div>
            )}
          </div>

          <div className="position-relative navbar-account">
            {isLoggedIn ? (
              <>
                <p
                  className="mb-0 navbar-dropdown-title"
                  onClick={() => handleOnChange("profiledrop")}
                >
                  {user?.email?.split("@")[0] ||
                    email?.split("@")[0] ||
                    "Profile"}

                  <img
                    src={drop === "profiledrop" ? caretup : caretdown}
                    width={15}
                    alt=""
                  />
                </p>

                {drop === "profiledrop" && (
                  <div className="navbar-dropdown profile-dropdown">
                    <div className="profile-header">
                      <img
                        src="https://img.magnific.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?semt=ais_hybrid&w=740&q=80"
                        width={50}
                        height={50}
                        alt="Profile"
                      />

                      <span>{user?.email || email}</span>
                    </div>

                    <Link to="/myappointments" onClick={closeMenu}>
                      My Appointments
                    </Link>

                    <Link to="/mytests" onClick={closeMenu}>
                      My Tests
                    </Link>

                    <Link to="/medicine-orders" onClick={closeMenu}>
                      My Medicine Orders
                    </Link>

                    <Link to="/medical-records" onClick={closeMenu}>
                      My Medical Records
                    </Link>

                    <Link to="/online-consultations" onClick={closeMenu}>
                      My Online Consultations
                    </Link>

                    <Link to="/feedback" onClick={closeMenu}>
                      My Feedback
                    </Link>

                    <Link to="/profile" onClick={closeMenu}>
                      View / Profile Update
                    </Link>

                    <Link to="/settings" onClick={closeMenu}>
                      Settings
                    </Link>

                    <Link to="/" onClick={handleLogout}>
                      Logout
                    </Link>

                    <Link to="/drprofile" onClick={closeMenu}>
                      Switch Products Account
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <Link to="/LoginAndSignupDashboard" onClick={closeMenu}>
                <button type="button" id="login-signup-btn">
                  Login / Signup
                </button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}