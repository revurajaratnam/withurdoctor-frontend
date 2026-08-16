import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignUpMutation } from "../../features/auth/api/signupApi";
import { toast } from "react-toastify";
import { useGetdrdataQuery } from "../../features/auth/api/drDataApi";

const SignUp = ({ view = "drsignup" }) => {
  // true for doctor signup
  // false for patient signup
  const isDoctor = view === "drsignup";

  const [signupData, { isLoading }] = useSignUpMutation();

  const [formdata, setFormdata] = useState({
    fullname: "",
    email: "",
    pass: "",
    cpass: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  // Get doctors only when this is doctor signup
  const { data: drdata } = useGetdrdataQuery(undefined, {
    skip: !isDoctor,
  });

  const doctors = Array.isArray(drdata?.data)
    ? drdata.data
    : [];

  const doctorsCount = doctors.length;

  const navigate = useNavigate();

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormdata({
      ...formdata,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");

    // Validation
    if (
      !formdata.fullname.trim() ||
      !formdata.email.trim() ||
      !formdata.pass.trim() ||
      !formdata.cpass.trim()
    ) {
      const message = "Please fill in all fields";

      setErrorMessage(message);
      toast.error(message);

      return;
    }

    // Password validation
    if (formdata.pass !== formdata.cpass) {
      const message = "Passwords do not match";

      setErrorMessage(message);
      toast.error(message);

      return;
    }

    // IMPORTANT:
    // Create payload based on current signup type
    const payload = {
      fullname: formdata.fullname.trim(),
      email: formdata.email.trim(),
      pass: formdata.pass,
      cpass: formdata.cpass,

      // Doctor page → doctor
      // User page → patient
      role: isDoctor ? "doctor" : "patient",
    };

    console.log("Signup type:", isDoctor ? "Doctor" : "Patient");

    console.log("Sending payload:", payload);

    try {
      const response = await signupData(payload).unwrap();

      const result =
        typeof response === "string"
          ? JSON.parse(response)
          : response;

      console.log("Signup response:", result);

      if (result?.success) {
        toast.success(
          result?.message ||
            "The OTP has been sent! Please check your email."
        );

        navigate("/VerifyEmail", {
          state: {
            email: formdata.email.trim(),
            role: payload.role,
          },
        });

        return;
      }

      if (result?.success === false) {
        const message =
          result?.message || "Signup failed";

        setErrorMessage(message);

        toast.error(message);
      }
    } catch (error) {
      console.log("Signup error:", error);

      const message =
        error?.data?.message ||
        error?.message ||
        "Signup failed";

      setErrorMessage(message);

      toast.error(message);
    }
  };

  return (
    <div className="container">
      <br />

      <form onSubmit={handleSubmit}>
        <div className="login-form container border border-1 p-5 m-3">

          {/* TOP SECTION */}

          <div className="d-flex justify-content-between my-4 border-bottom">

            <p>
              {isDoctor
                ? `Join ${doctorsCount}+ doctors`
                : "Join WithUrDoctor"}
            </p>

            {/* DOCTOR SIGNUP PAGE */}

            {isDoctor ? (
              <Link
                to="/userRegistration"
                style={{
                  fontSize: "13px",
                  textDecoration: "none",
                }}
              >
                Are you a User?
              </Link>
            ) : (
              /* PATIENT SIGNUP PAGE */

              <p style={{ fontSize: "13px" }}>
                Are you a Doctor?{" "}

                <Link
                  to="/Signup"
                  className="text-decoration-none text-warning"
                >
                  Signup Here
                </Link>
              </p>
            )}
          </div>

          {/* FULL NAME */}

          <label>Full Name</label>

          <br />

          <input
            type="text"
            name="fullname"
            value={formdata.fullname}
            placeholder="Full Name"
            onChange={handleChange}
            className="w-100 my-2 p-1 fullname-input"
          />

          {/* EMAIL */}

          <div>
            <label>Email Address</label>

            <br />

            <input
              type="email"
              name="email"
              value={formdata.email}
              placeholder="Email Address"
              onChange={handleChange}
              className="w-100 my-2 p-1 emails-input"
            />
          </div>

          {/* PASSWORD */}

          <label>Create Password</label>

          <br />

          <input
            type="password"
            name="pass"
            value={formdata.pass}
            placeholder="Password"
            onChange={handleChange}
            className="w-100 my-2 p-1 password-input"
          />

          {/* CONFIRM PASSWORD */}

          <label>Confirm Password</label>

          <br />

          <input
            type="password"
            name="cpass"
            value={formdata.cpass}
            placeholder="Confirm Password"
            onChange={handleChange}
            className="w-100 my-2 p-1 confirmpassword"
          />

          <br />

          {/* CHECKBOX */}

          <label className="d-flex align-items-center gap-2">
            <input type="checkbox" />

            <span style={{ fontSize: "10px" }}>
              Receive relevant offers and promotional communication
              <br />
              from WithUrDoctor
            </span>
          </label>

          {/* SUBMIT BUTTON */}

          <button
            type="submit"
            className="my-5 btn btn-info w-100 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Sending OTP..." : "Send OTP"}
          </button>

          {/* ERROR */}

          {errorMessage && (
            <p className="f-5 alert-danger p-2 rounded">
              {errorMessage}
            </p>
          )}

        </div>
      </form>
    </div>
  );
};

export default SignUp;