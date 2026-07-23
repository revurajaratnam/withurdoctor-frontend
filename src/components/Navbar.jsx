import React, { use, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Logo from "../assets/Logo.png";
import caretdown from "../assets/caret-down-svgrepo-com.svg";
import caretup from "../assets/caret-up-svgrepo-com.svg";
import { logout } from "../features/auth/Slice/UserSlice";
import "../style/searchBars.css";

export default function NavbarComp() {
  const [drop, setDrop] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, email, isLoggedIn } = useSelector((state) => state.dr);
  

  const dispatch = useDispatch();
  const location = useLocation();

  const displayName =
    user?.fullname ||
    user?.name ||
    user?.email?.split("@")[0] ||
    email?.split("@")[0] ||
    "Profile";

  const handleOnChange = (name) => {
    setDrop((previous) => (previous === name ? null : name));
  };

  const handleLogout = () => {
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
      location.pathname === path ? "4px solid #199fd9" : "4px solid transparent",
  });

  return (
    <header className="navbar-wrapper">
      <nav className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img src={Logo} alt="WithUrDoctor Logo" />
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
            className="navbar-main-link"
            style={activeStyle("/Finddrhome")}
            onClick={closeMenu}
          >
            Find Doctors
          </Link>

          <Link
            to="/VideoConsult"
            className="navbar-main-link"
            style={activeStyle("/VideoConsult")}
            onClick={closeMenu}
          >
            Video Consult
          </Link>

          <Link
            to="/LabTests"
            className="navbar-main-link"
            style={activeStyle("/LabTests")}
            onClick={closeMenu}
          >
            Lab Tests
          </Link>

          <Link
            to="/Surgeries"
            className="navbar-main-link"
            style={activeStyle("/Surgeries")}
            onClick={closeMenu}
          >
            Surgeries
          </Link>

          <div className="navbar-dropdown-wrapper">
            <button
              type="button"
              className="navbar-dropdown-title"
              onClick={() => handleOnChange("forcorporates")}
            >
              <span className="new-badge">NEW</span>
              For Corporates
              <img
                src={drop === "forcorporates" ? caretup : caretdown}
                alt=""
              />
            </button>

            {drop === "forcorporates" && (
              <div className="navbar-menu-dropdown">
                <Link to="/corporate-wellness" onClick={closeMenu}>
                  Health & Wellness Plans
                </Link>

                <Link to="/group-insurance" onClick={closeMenu}>
                  Group Insurance
                </Link>
              </div>
            )}
          </div>

          <div className="navbar-dropdown-wrapper">
            <button
              type="button"
              className="navbar-dropdown-title"
              onClick={() => handleOnChange("forproviders")}
            >
              For Providers
              <img
                src={drop === "forproviders" ? caretup : caretdown}
                alt=""
              />
            </button>

            {drop === "forproviders" && (
              <div className="navbar-menu-dropdown">
                <Link to="/provider-prime" onClick={closeMenu}>
                  WithUrDoctor Prime
                </Link>

                <Link to="/provider-software" onClick={closeMenu}>
                  Software for providers
                </Link>

                <Link to="/list-practice" onClick={closeMenu}>
                  List your practice for free
                </Link>
              </div>
            )}
          </div>

          <div className="navbar-dropdown-wrapper">
            <button
              type="button"
              className="navbar-dropdown-title"
              onClick={() => handleOnChange("security")}
            >
              Security & Help
              <img src={drop === "security" ? caretup : caretdown} alt="" />
            </button>

            {drop === "security" && (
              <div className="navbar-menu-dropdown">
                <Link to="/data-security" onClick={closeMenu}>
                  Data security
                </Link>

                <Link to="/help" onClick={closeMenu}>
                  Help
                </Link>
              </div>
            )}
          </div>

          <div className="navbar-account">
            {isLoggedIn ? (
              <>
                <button
                  type="button"
                  className="navbar-dropdown-title account-button"
                  onClick={() => handleOnChange("profiledrop")}
                >
                  <span className="account-name">{displayName}</span>

                  <img
                    src={drop === "profiledrop" ? caretup : caretdown}
                    alt=""
                  />
                </button>

                {drop === "profiledrop" && (
                  <div className="navbar-profile-dropdown">
                    <div className="profile-header">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                        width={50}
                        height={50}
                        alt="Profile"
                      />

                      <div>
                        <strong>{displayName}</strong>
                        <span>{user?.email || email || ""}</span>
                      </div>
                    </div>

                    <Link
                      to="/myappointments"
                      onClick={closeMenu}
                      className="profile-dropdown-link"
                    >
                      My Appointments
                    </Link>

                    <Link
                      to="/mytests"
                      onClick={closeMenu}
                      className="profile-dropdown-link"
                    >
                      My Tests
                    </Link>

                    <Link
                      to="/medicine-orders"
                      onClick={closeMenu}
                      className="profile-dropdown-link"
                    >
                      My Medicine Orders
                    </Link>

                    <Link
                      to="/medical-records"
                      onClick={closeMenu}
                      className="profile-dropdown-link"
                    >
                      My Medical Records
                    </Link>

                    <Link
                      to="/online-consultations"
                      onClick={closeMenu}
                      className="profile-dropdown-link"
                    >
                      My Online Consultations
                    </Link>

                    <Link
                      to="/feedback"
                      onClick={closeMenu}
                      className="profile-dropdown-link"
                    >
                      My Feedback
                    </Link>

                    <Link
                      to="/profile"
                      onClick={closeMenu}
                      className="profile-dropdown-link"
                    >
                      View / Profile Update
                    </Link>

                    <Link
                      to="/settings"
                      onClick={closeMenu}
                      className="profile-dropdown-link"
                    >
                      Settings
                    </Link>

                    <Link
                      to="/drprofile"
                      onClick={closeMenu}
                      className="profile-dropdown-link"
                    >
                      Switch Products Account
                    </Link>

                    <Link
                      to="/"
                      onClick={handleLogout}
                      className="profile-dropdown-link logout-link"
                    >
                      Logout
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <Link
                to="/LoginAndSignupDashboard"
                onClick={closeMenu}
                className="login-signup-link"
              >
                Login / Signup
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}