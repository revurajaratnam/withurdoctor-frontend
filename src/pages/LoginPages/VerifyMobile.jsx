import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../style/App.css"
import { ToastContainer ,toast } from "react-toastify";
import { useVerifyMutation } from "../../features/auth/services/VerifyEmail";
import NavbarComp from "../../components/Navbar";
import { useState } from "react";
import { useResendOTPMutation } from "../../features/auth/services/resendOTP";



      export default  function VerifyMobile() {
        const location=useLocation();
        const naviagate = useNavigate()
        const emails = location.state?.email;
        const [formdata,setFormdata]=useState({
            VerifyOTP:"",
            email:emails
        })

        const [Verification,{isLoading,isSuccess,error}] = useVerifyMutation();
        const [ResendOTP,{isSending,isVerified,invalid}] = useResendOTPMutation()
      

            const handleSubmit = async (e)=>{
                e.preventDefault();
               try {
                const result = await  Verification(formdata).unwrap();
                console.log("Success",result)
               } catch (error) {
                    console.log(error);
               }

            }
            const handleSubmitResend =async (e)=>{
                e.preventDefault();
                try {
                    const result = await ResendOTP({email:emails}).unwrap()
                    console.log("Success",result);
                } catch (error) {
                    console.log(error);
                }
            }
           const  handleVerify = () =>{
            naviagate("/Login")
           }
            
            return(
                <div>
                    <div>
                        <NavbarComp></NavbarComp>
                    </div>
                    <div className="d-flex justify-content-center gap-3">
                        <Link to="/Login" 
                        id="vfySignIn"
                        >Login</Link>
                        <Link to="/Signup" 
                        id="vfySignup" >Signup</Link>
                    </div>
                       <form onSubmit={handleSubmit} >
                       <div className="d-flex justify-content-center">
                       <div>
                       <p>Please check Youre Email</p>
                       <p>We have sent you an OTP on </p>
                       <h5>Email:{emails}</h5>
                       <p></p>
                      
                        <label> OTP</label> <br />
                        <input type="text" 
                                name="VerifyOTP"
                                placeholder="Please enter the 6 digit OTP here to verify"
                                onChange={(e)=> setFormdata({...formdata,[e.target.name]:e.target.value})}
                        /> 
                        <ToastContainer theme="dark" />
                        <br />

                        <button type="submit"
                        onClick={handleVerify}
                        >Verify</button>
                        <button
                        onClick={handleSubmitResend} 
                         >Resend</button>

                       </div>
                       </div>
                       </form>
                    </div>
            )
        }  