import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSigninMutation, useUserLoginMutation } from "../../features/auth/services/signinApi";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../../features/auth/Slice/UserSlice";
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
    const [loginType, setLoginType] = useState("doctor");
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
            newErrors.email = "Email ID field cannot be empty"
        }
        if (!formdata.pass.trim()) {
            newErrors.pass = "Password field cannot be empty"
        }
        setRequireFileds(newErrors)
        if (Object.keys(newErrors).length > 0) {
            return;
        }
        try {
            const result = loginType === "doctor" 
            ? await data(formdata).unwrap()
            : await UserData(formdata).unwrap();
            if (result.success === true) {
                
                console.log(result);
                setMessage("");
                const token = result.token;
                const user = result.user;
                
                toast.success("Login Successful");
                localStorage.setItem("token", token);
                navigate("/", { state: { email: formdata.email } });

                dispatch(setUser({ 
                    user:user,
                    token: token,
                    role: user?.role,

                 }));
                
            } else {
                localStorage.removeItem("token")
                setMessage(result.message || "Login Failed");
            }
        } catch (error) {
            localStorage.removeItem("token")
            setMessage(error.data?.message || "An error occurred");
            console.log(error);
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
                navigate("/Profile", { state: { email: result.user.email } });
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