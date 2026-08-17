import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSigninMutation, useUserLoginMutation } from "../../features/auth/api/signinApi";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../../features/auth/Slice/UserSlice";
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
    const [loginType, setLoginType] = useState("");
    const [otpWithNum, SetOtpWithNum] = useState(false);
    const [requirefileds, setRequireFileds] = useState({})
    const [formdata, setFormdata] = useState({
        email: "",
        pass: "",
    });

    const [message, setMessage] = useState("");

    const [data, { isLoading: isDoctorLoading }] = useSigninMutation();
    const [UserData,{isLoading: isUserLoading}] = useUserLoginMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleOnchange = (e) => {
        setFormdata({
            ...formdata,
            [e.target.name]: e.target.value
        })
        setRequireFileds({
            ...requirefileds,
            [e.target.name]: "",
        })
    }
    const handelPassword = () => {
        SetOtpWithNum(!otpWithNum);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
      
        const newErrors = {};
      
        if (!formdata.email.trim()) {
          newErrors.email = "Email ID field cannot be empty";
        }
      
        if (!formdata.pass.trim()) {
          newErrors.pass = "Password field cannot be empty";
        }
      
        setRequireFileds(newErrors);
      
        if (Object.keys(newErrors).length > 0) {
          return;
        }
      
        try {
          console.log("Selected login type:", loginType);
      
          const result =
            loginType === "patient"
              ? await data(formdata).unwrap()
              : await UserData(formdata).unwrap();
      
          console.log("Login result:", result);
      
          if (!result.success) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
      
            setMessage(result.message || "Login failed");
            return;
          }
      
          // Remove any previous doctor/patient token
          localStorage.removeItem("token");
          localStorage.removeItem("user");
      
          // Store new token
          localStorage.setItem("token", result.token);
          localStorage.setItem(
            "user",
            JSON.stringify(result.user)
          );
      
          // Update Redux before navigating
          dispatch(
            setUser({
              token: result.token,
              user: result.user,
            })
          );
      
          const decodedPayload = JSON.parse(
            atob(result.token.split(".")[1])
          );
      
          console.log("New login token payload:", decodedPayload);
      
          setMessage("");
          toast.success(
            `${loginType === "doctor" ? "doctor" : "patient"} login successful`
          );
      
          navigate("/");
        } catch (error) {
          console.error("Login error:", error);
      
          localStorage.removeItem("token");
          localStorage.removeItem("user");
      
          setMessage(
            error?.data?.message || "An error occurred"
          );
        }
      };
   

    const handleGoogleSuccess = async (credentialResponse) => {
        try {

            const googleToken = credentialResponse.credential;


            const response = await fetch("http://localhost:4545/api/auth/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: googleToken })
            });

            const result = await response.json();

            if (response.ok) {
                toast.success("Google Login Successful!");

                // Store token in Redux and LocalStorage just like standard login
                // (Using the Google token here, or ideally a JWT your backend creates)
                localStorage.setItem("token", googleToken);
                dispatch(setUser({ token: googleToken }));

                // Navigate to profile, passing the email we got back from the backend
                navigate("/Profile", { state: { email: result } });
            } else {
                setMessage(result.message || "Google Authentication failed on server");
            }

        } catch (error) {
            console.error("Error sending token to backend:", error);
            setMessage("Server error during Google login");
        }
    };

    const isLoading = isDoctorLoading || isUserLoading;

    return (
        <div>
            <div>
                <form onSubmit={handleSubmit}>
                    <div className="login-form container border p-5 mt-2">
                        <label
                            className="py-2 "
                        >Mobile Number / Email ID</label> <br />
                        <input
                            type="text"
                            id="email-input"
                            name="email"
                            value={formdata.email}
                            placeholder="Mobile Number / Email ID"
                            onChange={handleOnchange}
                            className={`w-100 p-1 my-2 email-focus ${requirefileds.email ? "border border-danger" : "border border-secondary"
                                }`}

                        />
                        {requirefileds.email && (
                            <p className="text-danger" style={{ fontSize: "13px" }}>
                                {requirefileds.email}
                            </p>
                        )}

                        <label
                            className="py-2"
                            style={{ color: otpWithNum ? "gray" : "black" }}>Password</label> <br />
                        <input
                            type="password"
                            id="password-input"
                            name="pass"
                            value={formdata.pass}
                            placeholder="Password"
                            disabled={otpWithNum}
                            onChange={handleOnchange}
                            className={`border border-secondary w-100 p-1 password-focus ${requirefileds.pass?'border border-danger':'border border-secondary'}`}
                        /> 
                        {
                            requirefileds.pass &&(
                                <p className="text-danger" style={{fontSize:"13px"}}>
                                    {requirefileds.pass}
                                </p>
                            )
                        }

                        <label className="d-flex align-items-center gap-2" style={{ fontSize: "11px" }}>
                            <input type="checkbox" className="my-3 rounded-0 checkbox-30days" />
                            <span className="d-flex gap-5  ">
                                <span >Remember me for 30 days
                                </span>
                                <Link className={`text-decoration-none mx-2 ${otpWithNum ? 'text-info disabled' : 'text-info'}`} >Forgot password?</Link>
                            </span>

                        </label>
                        <label className="d-flex align-items-center gap-2 " style={{ fontSize: "11px" }}>
                            <input
                                type="checkbox"
                                onClick={handelPassword}
                                className="my-3 mb-3 rounded-0 checkbox-30days "
                            />
                            <span> Login with OTP instead of password </span>
                        </label>
                        <br />

                        <button type="submit" disabled={isLoading}
                            className="btn btn-info text-white w-100 p-2 mb-4 " style={{boxShadow:"0,0,0"}}
                        >
                            {isLoading ? "Logging in..." : "Login"}
                        </button>
                        <div style={{ marginBottom: "20px" }}>
                            {/* <GoogleLogin
                                type="standard"
                                theme="outline"
                                size="large"
                                text="signin_with"
                                shape="rectangular"
                                logo_alignment="left"
                                width="300"
                                locale="en"
                                onSuccess={handleGoogleSuccess}
                                onError={() => {
                                    console.log("Login Failed");
                                    toast.error("Google Login popup was closed or failed.");
                                }}
                            /> */}
                            {message && <p className="alert alert-danger" style={{ color: "red", marginTop: "10px" }}>{message}</p>}

                        </div>
                    </div>
                </form>


            </div>
           
        </div>
           

    );
}