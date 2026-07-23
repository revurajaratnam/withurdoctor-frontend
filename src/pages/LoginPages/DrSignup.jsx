
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSignUpMutation } from "../../features/auth/services/signupApi"
import { ToastContainer ,toast } from "react-toastify";
import VerifyMobile from "./VerifyMobile";
import { useGetdrdataQuery } from "../../features/auth/services/drDataApi";



 const  SignUp= ({view="drsignup"}) => {
    const isDoctor = view ==="drsignup"
    const [signupData, { isLoading, isSuccess, error }] = useSignUpMutation();
    const [formdata, setFormdata] = useState({
        fullname: "",
        email: "",
        pass: "",
        cpass:"",
    })
    const [verifybtn,setVerifyBtn]= useState(false);
    const {data: drdata} = useGetdrdataQuery(
        undefined,{
            skip:!isDoctor
        }
    );
    const doctors = Array.isArray(drdata?.data)? drdata.data:[];
    const doctorsCount = doctors.length;

    const navigate = useNavigate();

        const handleVerifybtns = () =>{
            setVerifyBtn(true);
        }


    const handleSubmit = async (e) => {
        e.preventDefault();
        // const formdata = new FormData(e.target);

          
        try {
            const result = await signupData(formdata).unwrap();
            console.log( result)
             toast.success("The OTP has been sent.! Please check your email")
            navigate("/VerifyEmail",{
                state:{email:formdata.email}
            })

        } catch (error) {
            console.log(error);
            toast.error(error?.data?.message || "Signup failed");
        }
    }




    return (
        <div className="container">
            <br />
            <form onSubmit={handleSubmit}>
                <div className="login-form container border border-1 p-5 m-3">
                    
                    <div className="d-flex justify-content-between my-4 border-bottom">
                    <p>
              {isDoctor
                ? `Joined ${doctorsCount}+ doctors`
                : "Join WithUrDoctor"}
            </p>
            {isDoctor ? (
              <Link to="/userRegistration" 
              style={{ fontSize: "13px", 
                        textDecoration:"none"

              }}>
                Are you a User?
              </Link>
            ) : (
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
                <label>Full  Name</label> <br />
                <input type="text"
                    name="fullname"
                    value={formdata.fullname}
                    placeholder="Full Name"
                    onChange={(e) => setFormdata({ ...formdata, [e.target.name]: e.target.value })}
                    className="w-100 my-2 p-1 fullname-input"
                />
                <div>
                    <label>Email Address</label> <br />
                    <input type="email"
                        name="email"
                        value={formdata.email}
                        placeholder="Email Address "
                        onChange={(e) => setFormdata({ ...formdata, [e.target.name]: e.target.value })}
                        className="w-100 my-2 p-1  emails-input"
                    />
                </div>
                <label>Create Password</label> <br />
                <input type="password"
                    name="pass"
                    value={formdata.pass}
                    placeholder="Password"
                    onChange={(e) => setFormdata({ ...formdata, [e.target.name]: e.target.value })}
                    className="w-100 my-2 p-1 password-input"

                /> 
                <label>Confirm Password</label> <br />
                <input type="password"
                name="cpass" 
                value={formdata.cpass}
                placeholder="Confirm Password"
                onChange={(e)=>setFormdata({...formdata,[e.target.name]:e.target.value})}
                className="w-100 my-2 p-1 confirmpassword"
                />  <br />
               <label className="d-flex align-items-center gap-2">
               <input type="checkbox" />
               <span style={{fontSize:"10px"}}>Receive relevant offers and 
                promotional communication <br />from WithUrDoctor</span>
               </label>

               
             <button type="submit"
                className="my-5 btn btn-info w-100 text-white"
                disabled={isLoading}
                >{isLoading?"Sending OTP":"Send OTP"}</button>
                </div>
               
                
               
            </form>


        </div>

    )
}

export default SignUp;