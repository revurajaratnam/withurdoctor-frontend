import { useState } from "react"
import caret from "../../assets/caret-down-svgrepo-com.svg"

export default function FilterDoctors() {
    const [open,setOpen] = useState("");
    const toggleDropdown = (name) => {
        setOpen(open === name ? " " : name);
    }
    

    return(

        <div>
            <div className=" position-relative  d-flex gap-5 bg-success w-100  align-items-center " style={{marginTop:"150px"}}>
               <div className="ms-5 ">
                <p className="text-light cursor-pointer " 
                style={{backgroundColor:"rgba(255,255,255,0.25)"}}
                onClick={() => toggleDropdown("gender")}
                >Gender 
                <img src={caret} alt="" width={15} 
                className="ms-5"
                style={{filter:"invert(100%)",transform:open === "gender" ? "rotate(180deg)":"rotate(0deg)"}} />  </p>
                {
                    open === "gender" && (
                        <div className=" position-absolute bg-light "
                        style={{width:"120px"}}
                        >
                            <p className="filter-drop">Male</p>
                            <p className="filter-drop">Female</p>
                        </div>
                    )
                }
               </div>
               <div>
                <p
                className="text-light cursor-pointer"
                style={{backgroundColor:"rgba(255,255,255,0.25)"}}
                onClick={() =>  toggleDropdown("experience")}
                >Expirence
                <img src={caret} 
                alt=""
                width={15}
                className="ms-5"
                style={{filter:"invert(100%)",transform: open === "experience" ? "rotate(180deg)":"rotate(0deg)"}}
                 />
                </p>
                {
                    open === "experience" && (
                        <div className="position-absolute bg-light">
                            <p className="filter-drop">5+ Years Experience</p>
                            <p className="filter-drop">10+ Years Experience</p>
                            <p className="filter-drop">15+ Years Experience</p>
                            <p className="filter-drop">20+ Years Experience</p>

                        </div>
                    )
                }
               </div>
            <div>
                <p
                className="cursor-pointer text-white"
                style={{backgroundColor:"rgba(255,255,255,0.25)"}}
                onClick={()=> toggleDropdown("patinetStories")}
                >Patient Stories
                    <img src={caret} 
                    alt="" 
                    width={15}
                    style={{transform: open === "patinetStories" ? "rotate(180deg)":"rotate(0deg)",filter:"invert(100%)"}}
                    />
                </p>
                {
                    open === "patinetStories" && (
                        <div className="position-absolute bg-white">
                            <p className="filter-drop">10+ Patient Stories</p>
                            <p className="filter-drop">50+ Patinet Stories</p>
                        </div>
                    )
                }
            </div>
               <div>
                    <p
                    className="text-white cursor-pointer"
                    onClick={()=>toggleDropdown("allfilters")}
                    >All Filters
                    <img src={caret} alt="" 
                    width={15}
                   style={{filter:"invert(100%)",transform:open === "allfilters" ? "rotate(180deg)":"rotate(0deg)"}}
                    />
                    </p>

                {
                    open === "allfilters" && (
                        <div className="position-absolute start-0  w-100 bg-success  ">
                          <div className="d-flex  gap-5 text-white ms-5" >
                          <div className="">
                           <input type="radio" className="filter-drop" /> ₹0- ₹500 <br />
                           <input type="radio" className="filter-drop" /> Above ₹500 <br />
                           <input type="radio" className="filter-drop" /> Above ₹1000 <br />
                           <input type="radio" className="filter-drop" /> Above ₹2000
                           </div> 
                           <div className=""> className="filter-drop"
                           <input type="radio" className="filter-drop" /> Avaliable in next 4 hour <br />
                           <input type="radio" className="filter-drop" /> Avaliable today <br /> 
                           <input type="radio" className="filter-drop" /> Avaliable tomorrow <br />
                           <input type="radio" className="filter-drop" /> Avaliable in next 7 days
                           </div>
                          
                          </div>
                          <input type="radio" /> Video consult
                           
                        </div>
                    )

                }
               </div>
               <div >
                    <p className="text-muted">Soft By 
                        <span
                        className="cursor-pointer text-white"
                        style={{backgroundColor:"rgba(255,255,255,0.25"}}
                        onClick={()=>toggleDropdown("relevance")}
                        >Relevance</span>
                    </p>
                    {
                        open === "relevance" && (
                            <div className="position-absolute bg-white">
                                <p className="filter-drop">Number of patient stories - High to Low</p>
                                <p className="filter-drop">Experience -High to Low</p>
                                <p className="filter-drop">Consultation Fee - High to Low</p>
                                <p className="filter-drop">Consultation Fee - Low to High</p>

                            </div>
                        )
                    }
                </div>

            </div>
                
        </div>
    )
}