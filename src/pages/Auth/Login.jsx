import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSigninMutation } from "../../features/auth/api/signinApi";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../../features/auth/Slice/UserSlice";

export default function Login() {
  const [otpWithNum, setOtpWithNum] = useState(false);

  const [requirefileds, setRequireFileds] = useState({});

  const [formdata, setFormdata] = useState({
    email: "",
    pass: "",
  });

  const [message, setMessage] = useState("");

  // ONE LOGIN API ONLY
  const [loginData, { isLoading }] = useSigninMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOnchange = (e) => {
    setFormdata({
      ...formdata,
      [e.target.name]: e.target.value,
    });

    setRequireFileds({
      ...requirefileds,
      [e.target.name]: "",
    });
  };

  const handelPassword = () => {
    setOtpWithNum(!otpWithNum);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formdata.email.trim()) {
      newErrors.email = "Email ID field cannot be empty";
    }

    if (!otpWithNum && !formdata.pass.trim()) {
      newErrors.pass = "Password field cannot be empty";
    }

    setRequireFileds(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      setMessage("");

      // ONE LOGIN PAYLOAD
      const payload = {
        email: formdata.email.trim(),
        pass: formdata.pass,
      };

      console.log("Login payload:", payload);

      // CALL ONLY ONE LOGIN API
      const result = await loginData(payload).unwrap();

      console.log("Login result:", result);

      if (!result.success) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setMessage(result.message || "Login failed");
        return;
      }

      // Remove previous login data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Store new token and user
      localStorage.setItem("token", result.token);

      localStorage.setItem(
        "user",
        JSON.stringify(result.user)
      );

      // Update Redux
      dispatch(
        setUser({
          token: result.token,
          user: result.user,
        })
      );

      // Check JWT
      const decodedPayload = JSON.parse(
        atob(result.token.split(".")[1])
      );

      console.log(
        "New login token payload:",
        decodedPayload
      );

      console.log(
        "Logged in user role:",
        result.user.role
      );

      setMessage("");

      toast.success(
        `${result.user.role} login successful`
      );

      // AUTOMATIC REDIRECT BASED ON DATABASE ROLE
      if (result.user.role === "doctor") {
        navigate("/drprofile");
      } else if (result.user.role === "patient") {
        navigate("/");
      }

    } catch (error) {
      console.error("Login error:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setMessage(
        error?.data?.message || "An error occurred"
      );
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="login-form container border p-5 mt-2">

          <label className="py-2">
            Mobile Number / Email ID
          </label>

          <br />

          <input
            type="text"
            id="email-input"
            name="email"
            value={formdata.email}
            placeholder="Mobile Number / Email ID"
            onChange={handleOnchange}
            className={`w-100 p-1 my-2 email-focus ${
              requirefileds.email
                ? "border border-danger"
                : "border border-secondary"
            }`}
          />

          {requirefileds.email && (
            <p
              className="text-danger"
              style={{ fontSize: "13px" }}
            >
              {requirefileds.email}
            </p>
          )}

          <label
            className="py-2"
            style={{
              color: otpWithNum ? "gray" : "black",
            }}
          >
            Password
          </label>

          <br />

          <input
            type="password"
            id="password-input"
            name="pass"
            value={formdata.pass}
            placeholder="Password"
            disabled={otpWithNum}
            onChange={handleOnchange}
            className={`w-100 p-1 password-focus ${
              requirefileds.pass
                ? "border border-danger"
                : "border border-secondary"
            }`}
          />

          {requirefileds.pass && (
            <p
              className="text-danger"
              style={{ fontSize: "13px" }}
            >
              {requirefileds.pass}
            </p>
          )}

          <label
            className="d-flex align-items-center gap-2"
            style={{ fontSize: "11px" }}
          >
            <input
              type="checkbox"
              className="my-3 rounded-0 checkbox-30days"
            />

            <span className="d-flex gap-5">
              <span>
                Remember me for 30 days
              </span>

              <Link
                className={`text-decoration-none mx-2 ${
                  otpWithNum
                    ? "text-info disabled"
                    : "text-info"
                }`}
              >
                Forgot password?
              </Link>
            </span>
          </label>

          <label
            className="d-flex align-items-center gap-2"
            style={{ fontSize: "11px" }}
          >
            <input
              type="checkbox"
              checked={otpWithNum}
              onChange={handelPassword}
              className="my-3 mb-3 rounded-0 checkbox-30days"
            />

            <span>
              Login with OTP instead of password
            </span>
          </label>

          <br />

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-info text-white w-100 p-2 mb-4"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          {message && (
            <p
              className="alert alert-danger"
              style={{
                color: "red",
                marginTop: "10px",
              }}
            >
              {message}
            </p>
          )}

        </div>
      </form>
    </div>
  );
}