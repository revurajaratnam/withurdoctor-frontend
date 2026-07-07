import { useSelector } from "react-redux";
import { useGetdrdataQuery } from "../features/auth/services/drDataApi";
import NavbarComp from "./Navbar";
import DoctorDashboard from "../pages/ProfilePages/DrDashboard";
import Footer from "./Footer";
import {drinfo,healthConcern,BookanAppoitment} from '../../src/utils/info'
import { Link } from "react-router-dom";
import { useRef, useState,useEffect } from "react";
import { states } from "../utils/StatesAndCities";
import { DrProfission } from "../utils/DrProfission";
import { specialization } from "../utils/drSpecial";






export default function HomePage() {
    const {data,isLoading,isSuccess}=useGetdrdataQuery()
        const {user,isLoggedIn} = useSelector((state) => state.dr);
        const [swap,setSwap] = useState(0);
        const visiable = BookanAppoitment.slice(swap ,swap+4)
        const previous = () => {
            if(swap>0){
                setSwap(swap-1)
            }
        }
        const next = () =>{
            if(swap<BookanAppoitment.length-4){
                setSwap(swap+1)
            }
        }
         const [dropdown, setDropdown] = useState(null);
          const [locationValue, setLocationValue] = useState("");
          const [searchValue, setSearchValue] = useState("");
        
          const searchBoxRef = useRef(null);
        
          useEffect(() => {
            const handleClickOutSide = (e) => {
              if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
                setDropdown(null);
              }
            };
        
            document.addEventListener("mousedown", handleClickOutSide);
        
            return () => {
              document.removeEventListener("mousedown", handleClickOutSide);
            };
          }, []);
        
          const filteredState = states.filter((s) =>
            s.toLowerCase().includes(locationValue.toLowerCase())
          );
        
          const filteredSpecialization =specialization.filter((s) =>
            s.title.toLowerCase().includes(searchValue.toLowerCase())
          );

        

        return (
            <div className="min-vh-100 d-flex flex-column">
              <NavbarComp />
          
              <main className="flex-grow-1">
                 <div
                          ref={searchBoxRef}
                          className="d-flex justify-content-center align-items-start"
                          style={{ width: "70%", height: "50px",  marginLeft:"200px"}}
                        >
                          <div className="position-relative" style={{ width: "30%" }}>
                            <input
                              type="text"
                              className="p-2 w-100 fnpage-focus"
                              value={locationValue}
                              onClick={() => setDropdown("location")}
                              onChange={(e) => {
                                setLocationValue(e.target.value);
                                setDropdown("location");
                              }}
                              placeholder={states[0]}
                            />
                
                            {dropdown === "location" && (
                              <div
                                className="position-absolute bg-white w-100 border rounded"
                                style={{
                                  top: "100%",
                                  left: 0,
                                  zIndex: 2000,
                                  maxHeight: "250px",
                                  overflowY: "auto",
                                }}
                              >
                                {filteredState.length > 0 ? (
                                  filteredState.map((state, index) => (
                                    <div
                                      key={index}
                                      className="location-h-effect p-2 text-start"
                                      style={{ cursor: "pointer" }}
                                      onClick={() => {
                                        setLocationValue(state);
                                        setDropdown(null);
                                      }}
                                    >
                                      <i className="bi bi-search mx-3"></i>
                                      {state}
                                    </div>
                                  ))
                                ) : (
                                  <div className="p-2 text-start">This city is not available</div>
                                )}
                              </div>
                            )}
                          </div>
                
                          <div className="position-relative" style={{ width: "70%" }}>
                            <input
                              type="text"
                              className="p-2 w-100 fnpage-focus"
                              value={searchValue}
                              placeholder="Search for doctors..."
                              onClick={() => setDropdown("search")}
                              onChange={(e) => {
                                setSearchValue(e.target.value);
                                setDropdown("search");
                              }}
                            />
                
                            {dropdown === "search" && (
                              <div
                                className="position-absolute bg-white w-100 border rounded"
                                style={{
                                  top: "100%",
                                  left: 0,
                                  zIndex: 2000,
                                  maxHeight: "250px",
                                  overflowY: "auto",
                                }}
                              >
                                {filteredSpecialization.length > 0 ? (
                                  filteredSpecialization.map((special) => (
                                   <Link to={`/FindDoctors?id=${special.id}&location${encodeURIComponent(locationValue)}`}
                                   key={special.id}
                                      className="location-h-effect p-2 text-start"
                                      style={{ cursor: "pointer" }}
                                      onClick={() => {
                                        setSearchValue(special.title);
                                        setDropdown(null);
                                      }}>
                                    <div
                                      
                                    >
                                      <i className="bi bi-search mx-3"></i>
                                      {special.title}
                                    </div>
                                   </Link>
                                  ))
                                ) : (
                                  <div className="p-2 text-start">
                                    No specialization available
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
          
                <div className="d-flex mx-5 justify-content-center" style={{ marginBottom: "100px" }}>
                  {drinfo.map((dr, i) => (
                    <Link
                    key={i}
                    className="text-decoration-none text-dark"
                      to={dr.route}
                    >
                    <div className="p-2 my-4" style={{ width: "200px" }}>
                      <div
                        className="text-center"
                        style={{
                          width: "200px",
                          padding: "15px 15px 0px 15px",
                          borderRadius: "15px 15px 0px 0px",
                          boxShadow: "1px 2px 10px 3px rgba(0,0,0,0.25)",
                          backgroundColor: dr.color,
                        }}
                      >
                        <img src={dr.image} alt="" width={150} height={150} />
                      </div>
          
                      <div
                        className="bg-white text-center"
                        style={{
                          boxShadow: "0px 0px 5px 1px rgba(0,0,0,0.25)",
                          height: "100px",
                          borderRadius: "0px 0px 15px 15px",
                        }}
                      >
                        <h5>{dr.title}</h5>
                        <p className="text-muted">{dr.des}</p>
                      </div>
                    </div>
                    </Link>
                  ))}
                </div>
          
                <section className="container">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h4>Consult top doctors online for any health concern</h4>
                      <p>Private online consultation with verified doctors in all specialists</p>
                    </div>
          
                    <Link
                      to="/"
                      className="text-decoration-none p-2 rounded"
                      style={{ color: "#14BEF0", border: "1px solid #14BEF0" }}
                    >
                      View All Specialites
                    </Link>
                  </div>
          
                  <div className="d-flex gap-3 text-center justify-content-between">
                    {healthConcern.map((drs, i) => (
                      <div key={i} className="d-flex flex-column my-5">
                        <div className="bg-info mx-4 p-3" style={{ borderRadius: "50%" }}>
                          <img
                            src={drs.image}
                            width={100}
                            height={100}
                            style={{ borderRadius: "50%", objectFit: "cover" }}
                            alt=""
                          />
                        </div>
          
                        <p>{drs.title}</p>
                        <Link to={`/newconsultation?id=${drs.consultid}`} className="text-decoration-none">
                          {drs.button}
                        </Link>
                      </div>
                    ))}
                  </div>
                </section>
          
                <section className="container my-5">
  <div className="d-flex justify-content-between align-items-center">
    <div>
      <h5>Book an appointment for an in-clinic consultation</h5>
      <p>Find experienced doctors across all specialties</p>
    </div>
  </div>

  <div className="position-relative">
   {swap > 0 &&(
     <button
     onClick={previous}
     className="btn btn-light rounded-pill shadow position-absolute top-50 start-0 translate-middle-y"
     style={{ zIndex: 10 }}
   >
     {"<"}
   </button>
   )}

    <div className="row g-3 border-bottom pb-4 px-5">
      {visiable.map((doctor, i) => (
        <div key={i} className="col text-center">
         <Link to={"/Finddrhome"} className="text-decoration-none text-dark">
         <img
            src={doctor.images}
            alt=""
            width={150}
            height={100}
            style={{ objectFit: "cover", borderRadius: "6px" }}
          />
          <h5>{doctor.Title}</h5>
         </Link>
          <p>{doctor.des}</p>
        </div>
      ))}
    </div>

    <button
      onClick={next}
      className="btn btn-light rounded-pill shadow position-absolute top-50 end-0 translate-middle-y"
      style={{ zIndex: 10 }}
    >
      {">"}
    </button>
  </div>
</section>
          
                <section className="container my-5">
                  <div className="d-flex justify-content-between gap-4">
                    <div className="w-25">
                      <h1>Read top articles from health experts</h1>
                      <p>
                        Health articles that keep you informed about good health practices and achieve your goals.
                      </p>
          
                      <Link
                        to="/"
                        className="text-decoration-none p-2 rounded"
                        style={{ color: "#14BEF0", border: "1px solid #14BEF0" }}
                      >
                        See all articles
                      </Link>
                    </div>
          
                    <div className="d-flex gap-4">
                      <div>
                        <img
                          src="https://www.indiaspend.com/h-upload/old_images/1500x900_342694-overpricing1440.jpg"
                          alt=""
                          width={200}
                        />
                        <p>CORONAVIRUS</p>
                      <h6 style={{ width: "200px" }}>
                          12 Coronavirus Myths and Facts That You Should Be Aware Of
                        </h6>
                        <p>Dr. Diana Borgio</p>
                      </div>

                      <div>
                        <img
                          src="https://assets.clevelandclinic.org/transform/38c591fa-8621-48c0-b603-22e792284e27/fruits-vegetables-1278940460"
                          alt=""
                          width={200}
                        />
                          <p style={{ width: "200px" }}>
                          VITAMINS AND SUPPLEMENTS
                        </p>
                        <h6>
                            Eating Right to Build Immunity Against Cold And Viral Infections
                        </h6>
                        <p>Dr. Diana Borgio</p>
                        
                      </div>
                    </div>
                  </div>
                </section>
          
                <section className="container my-5 text-center">
                  <h1>What our users have to say</h1>
                </section>
              </main>
          
              <Footer />
            </div>
          );
}