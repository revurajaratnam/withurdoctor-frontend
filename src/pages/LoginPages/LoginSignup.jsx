import Login from "./Login";
import SignUp from "./DrSignup";
import NavbarComp from "../../components/Navbar";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";

export default function LoginAndSignupDashboard({ view = "usersignup" }) {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <NavbarComp />

      <main className="flex-grow-1">
        <div className="text-center my-4">
          <Link
            to="/Login"
            className={
              view === "login"
                ? "borders-btn text-decoration-none mx-5"
                : "text-decoration-none mx-5 text-dark"
            }
          >
            Login
          </Link>

          <Link
            to="/userRegistration"
            className={
              view === "usersignup" || view === "drsignup"
                ? "borders-btn text-decoration-none mx-5"
                : "text-decoration-none mx-5 text-dark"
            }
          >
            SignUp
          </Link>
        </div>

        <div className="d-flex container justify-content-center">
          <div>{view === "login" ? <Login /> : <SignUp view={view}/> }</div>
        </div>
      </main>

      <Footer />
    </div>
  );
}