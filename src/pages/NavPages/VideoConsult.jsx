import { Link } from "react-router-dom";
import NavbarComp from "../../components/Navbar";
import { Specialities } from "../../utils/info";
import { useState } from "react";
import { commonHealthConcerns } from "../../utils/info";
import MobileImage from "../../assets/Gemini_Generated_Image_jj7n4hjj7n4hjj7n-Photoroom.png"
import caret from '../../assets/caret-circle-right-fill-svgrepo-com.svg'
import { useGetdrdataQuery } from "../../features/auth/services/drDataApi";
import Footer from "../../components/Footer"
export default function VideoConsult() {
    const [start, setStart] = useState(0)
    const [swipe,setSwipe] = useState(0)
    const visible = Specialities.slice(swipe, swipe + 6);
    const visiblecommon = commonHealthConcerns.slice(start, start + 4);
    const {data:drdata,isLoading,isSuccess} = useGetdrdataQuery();
    if(isLoading){<h1>isLoading...</h1> }
    const previous = () => {
        if (swipe > 0) {
            setSwipe(swipe - 1)
        }
    }
    const nextimg = () => {
        if (swipe < Specialities.length - 6) {
            setSwipe(swipe + 1)
        }
    }
    const prev = () => {
        if (start > 0) {
            setStart(start - 1)
        }
    }
    const next = () => {
        if (start < commonHealthConcerns.length - 4) {
            setStart(start + 1)
        }
    }
    return (
        <div className="min-vh-100 d-flex flex-column">
            
                <div className="position-fixed top-0 start-0 w-100 bg-white" style={{zIndex:1}}>
                <NavbarComp></NavbarComp>
                </div>
          
            <main>
            <div className="d-flex " style={{ backgroundColor: "#e6e8f8", padding: "20px", borderRadius: "10px", height: "300px",marginTop:"100px" }}>
                <div  style={{ margin: "30px 0px 0px 120px" }}>
                    <h1>Skip the Travel!</h1>
                    <h1>Take Online Doctor Consultation </h1>
                    <p>Private consultation + Audio call · Starts at just ₹199</p>

                    <Link to="/newconsultation" className="btn " style={{ backgroundColor: "#199FD9", color: "white" }}>Consult Now</Link>
                </div>
                <div >
                <img src={MobileImage} alt="mobileimage"
                        width={350}
                         />
                         <img src="https://static.vecteezy.com/system/resources/previews/069/509/552/non_2x/a-man-sitting-on-the-floor-with-a-phone-png.png" alt="" width={400} />
                </div>
            </div>
            <div className="mt-4">
                <div style={{ margin: "30px 120px 0px 120px" }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h1>25+ Specialities</h1>
                            <p>Consult with top doctors across specialities</p>
                        </div>

                        <Link 
                        className=" rounded text-center text-dark"
                        style={{textDecoration:"none", border:"1px solid black", padding:"10px",width:"200px"}}
                        to="/newconsultation">See all Specialities</Link>
                    </div>

                    <div className="position-relative">
                        {swipe > 0 && (
                            <button
                                onClick={previous}
                                className="position-absolute shadow  start-0 top-50 translate-middle-y  p-2"
                                style={{ zIndex: 10, borderRadius: "50%", backgroundColor: "white", border: "none" }}
                            >
                                {"<"}
                            </button>
                        )}

                        <div className="d-flex gap-3 justify-content-center align-items-center px-5">
                            {visible.map((info, i) => (
                                <div key={i} className="p-2 text-center rounded" style={{ boxShadow: "1px 1px 10px 1px rgba(0,0,0,0.05)" }}>
                                    <div>
                                        <img src={info.image} width={150} alt={info.title} />
                                    </div>
                                    <h6>{info.title}</h6>
                                    <p>{info.price}</p>
                                    <Link to={`/newconsultation?id=${info.consult_id}`} className="text-decoration-none">{info.button}</Link>
                                </div>
                            ))}
                        </div>

                        {swipe < Specialities.length - 6 && (
                            <button
                                onClick={nextimg}
                                className="position-absolute shadow   end-0 top-50 translate-middle-y p-2"
                                style={{ zIndex: 10, borderRadius: "50%", backgroundColor: "white", border: "none" }}
                            >
                                {">"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div style={{ margin: "30px 120px 0px 120px" }}>
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                    <h1>Common Health Concerns</h1>
                    <p>Consult a doctor online for any health issue</p>
                    </div>
                    <Link 
                    className=" rounded text-center text-dark"
                    style={{textDecoration:"none", border:"1px solid black", padding:"10px",width:"200px"}}
                    >See All Syntoms</Link>
                </div>

                <div className="position-relative my-5">
                        {start > 0 && (
                            <button
                                onClick={prev}
                                className="position-absolute shadow  start-0 top-50 translate-middle-y  p-2"
                                style={{ zIndex: 10, borderRadius: "50%", backgroundColor: "white", border: "none" }}
                            >
                                {"<"}
                            </button>
                        )}

                        <div className="d-flex gap-3 justify-content-center overflow-auto  align-items-center ">
                            {visiblecommon.map((info, i) => (
                                <div key={i} className="p-2 text-center rounded" style={{ boxShadow: "1px 1px 10px 1px rgba(0,0,0,0.05)" }}>
                                    <div>
                                        <img src={info.image} width={285} alt={info.title} />
                                    </div>
                                    <h6>{info.title}</h6>
                                    <p>{info.price}</p>
                                    <Link to={`/newconsultation?id=${info.consult_id}`} className="text-decoration-none">{info.buttonText}</Link>
                                </div>
                            ))}
                        </div>

                        {start < commonHealthConcerns.length - 4 && (
                            <button
                                onClick={next}
                                className="position-absolute shadow   end-0 top-50 translate-middle-y p-2"
                                style={{ zIndex: 10, borderRadius: "50%", backgroundColor: "white", border: "none" }}
                            >
                                {">"}
                            </button>
                        )}
                    </div>

                    <div>
                        <h1>Offers</h1>
                        <div className="d-flex justify-content-between align-items-center my-5 gap-2" >
                        <div className="px-5 "  style={{backgroundColor:"#FFDACC",width:"620px"}}>
                            <b style={{fontSize:"20px",backgroundColor:"#FFFF",padding:"5px",color:"#FFDACC"}}>OFFER</b>
                        <h1>Download the App & get <br /> ₹200 HealthCash</h1>
                            <div className="d-flex align-items-center justify-content-between mx-2">
                            <Link className="text-decoration-none text-dark">Download App 
                            <img src={caret} alt="logo" width={50} />
                             </Link>
                            <img src={MobileImage} alt="MobileImage" width={200} />
                            </div>

                        </div>
                        <div className="px-5  "  style={{backgroundColor:"#FFDBBE   ",width:"620px"}}>
                        <b style={{fontSize:"20px",backgroundColor:"#FFFF",padding:"5px",color:"#FFDBBE"}}>OFFER</b>

                        <h1>Consult with specialists at <br /> just ₹199 </h1>
                            <div className="d-flex justify-content-between align-items-center">
                            <Link className="text-decoration-none text-dark">Consult Now 
                            <img src={caret} alt="logo" width={50} />
                             </Link>
                            <img src="https://static.vecteezy.com/system/resources/thumbnails/046/680/177/small/an-pakistani-male-doctor-on-isolated-transparent-background-png.png" alt="MobileImage" width={115} />
                            </div>
                        </div>
                        </div>
                    </div>
            </div>
            <div style={{ margin: "30px 120px 0px 120px" }} >
                <h1>Our Doctors</h1>
                    
                    <div className="  d-flex align-items-center overflow-auto   gap-5 ">
                        {
                           drdata?.map((dr,i)=>
                           {
                            const profilePic = dr?.profilephoto
                     ? `http://localhost:4545/uploads/${dr.profilephoto}`
                     : "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png";
                            return (
                            
                                <div key={i}  className="card w-25 my-5" >
                                    <div className="d-flex gap-3 p-3">
                                    <div>
                                        <img src={profilePic} alt="" width={120} height={120} style={{  borderRadius:"50%",objectFit:"cover"}}  />
                                    </div>
                                    <div>
                                        <b>{dr.fullname}</b>
                                        <div>{dr.specialization}</div>
                                        <div>{dr.experience}</div>
                                    </div>
                                    </div>
                                   
                                </div>
                               )
                           })
                        }
                    </div>
            </div>
            <div>
                <div>
                    <h1>
                        How it works
                    </h1>
                </div>
            </div>
            </main>
                <Footer />
            
        </div>
    )
}