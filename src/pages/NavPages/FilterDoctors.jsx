import { useState } from "react"
import caret from "../../assets/caret-down-svgrepo-com.svg"

export default function FilterDoctors({
    dropFilter,
    setDropFilter,
    onResetFilter,
}) {

    const [open,setOpen] = useState("");
    const toggleDropdown = (name) => {
        setOpen((open)=>(open === name ? " " : name));
    }
    
    const handleGenderClick = (gender) =>{
            setDropFilter((filters) =>({
                ...filters,
                gender: gender,
            }));
            setOpen("");
    }
    const handleExperinenceClick =(min , max) =>{
        setDropFilter((filters) => ({
            ...filters,
            experience : {min ,max}
        }));
        setOpen("")
    }
    const handleOnChange = (min ,max) => {
        setDropFilter((p)=> ({
            ...p,
            consultationFee:{
                min ,
                max,
            }
        }))
    }
    const hasActiveFilters = Boolean(
        dropFilter.gender ||
         dropFilter.experience?.min !== "" &&
          dropFilter.experience?.min !== undefined ||
         dropFilter.consultationFee?.min !== "" &&
          dropFilter.consultationFee?.min !== undefined
      );

    return(

        <div className="d-flex align-items-center    bg-white " >
            <div className=" position-relative   d-flex gap-5 bg-success w-100  align-items-center pt-2 " style={{marginTop:"150px"}}>
               <div className="ms-5 ">
                <p className="text-light cursor-pointer ms-3 " 
                style={{backgroundColor:"rgba(255,255,255,0.25)"}}
                onClick={() => toggleDropdown("gender")}
                >{dropFilter.gender || "Gender" } 
                <img src={caret} alt="" width={15} 
                className="ms-5 me-2"
                style={{filter:"invert(100%)",transform:open === "gender" ? "rotate(180deg)":"rotate(0deg)"}} />  </p>
                {
                    open === "gender" && (
                        <div className=" position-absolute  "
                        style={{width:"120px",marginLeft:"20px"}}
                        >
                            <p className="filter-drop"
                            onClick={()=> handleGenderClick("Male")}
                            >Male</p>
                            <p className="filter-drop"
                            onClick={()=>handleGenderClick("Female")}
                            >Female</p>
                        </div>
                    )
                }
               </div>
               <div>
                <p
                className="text-light cursor-pointer ps-2 "
                style={{backgroundColor:"rgba(255,255,255,0.25)"}}
                onClick={() =>  toggleDropdown("experience")}
                >{dropFilter.experience ? `${dropFilter.experience.min}+ Years`:"Experience"}
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
                            <p className="filter-drop"
                               onClick={() => handleExperinenceClick(5 ,9)} 
                            >5+ Years Experience</p>
                            <p className="filter-drop"
                               onClick={() => handleExperinenceClick(10 , 14)} 
                            >10+ Years Experience</p>
                            <p className="filter-drop"
                               onClick={() => handleExperinenceClick(15 , 20)} 
                            >15+ Years Experience</p>
                            <p className="filter-drop"
                               onClick={() => handleExperinenceClick(21 ,100)} 
                            >20+ Years Experience</p>

                        </div>
                    )
                }
               </div>
            <div>
                <p
                className="cursor-pointer text-white ps-2"
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
                        <div className="position-absolute bg-light">
                            <p className="filter-drop">10+ Patient Stories</p>
                            <p className="filter-drop">50+ Patinet Stories</p>
                        </div>
                    )
                }
            </div>
            { hasActiveFilters && (
                <div>
                <p className="  reset-filter-style"
                onClick={() =>{onResetFilter();
                    setOpen("")}
                }
                >Reset Filters</p>
            </div>
            )
            }
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
        <div className="position-absolute  start-0 w-100 bg-success p-3">
          <div className="d-flex gap-5 text-white ms-5">

            <div className="d-flex flex-column gap-2">
                <label className="d-flex align-items-center gap-2">
                    <input type="radio" name="price" className="filter-drop " 
                    
                    checked={dropFilter.consultationFee?.min === 0 &&
                             dropFilter.consultationFee?.max === 500
                    }
                    onChange={() => handleOnChange(0,500)}
                    /> ₹0- ₹500
                </label>
                <label className="d-flex align-items-center gap-2">
                    <input type="radio" name="price" className="filter-drop" 
                   
                    checked={dropFilter.consultationFee?.min === 500 && 
                             dropFilter.consultationFee?.max === ""
                    }
                    onChange={()=>handleOnChange(500,"")}
                    /> Above ₹500
                </label>
                <label className="d-flex align-items-center gap-2">
                    <input type="radio" name="price" className="filter-drop" 
                    checked={dropFilter.consultationFee?.min === 1000 &&
                        dropFilter.consultationFee?.max === ""
               }
               onChange={() => handleOnChange(1000,"")}
                    /> Above ₹1000
                </label>
                <label className="d-flex align-items-center gap-2">
                    <input type="radio" name="price" className="filter-drop"
                    checked={dropFilter.consultationFee?.min === 2000 &&
                        dropFilter.consultationFee?.max === ""
               }
               onChange={() => handleOnChange(2000,"")}
                     /> Above ₹2000
                </label>
            </div>

            <div className="d-flex flex-column gap-2">
                <label className="d-flex align-items-center gap-2">
                    <input type="radio" name="availability" className="filter-drop" /> Avaliable in next 4 hour
                </label>
                <label className="d-flex align-items-center gap-2">
                    <input type="radio" name="availability" className="filter-drop" /> Avaliable today
                </label>
                <label className="d-flex align-items-center gap-2">
                    <input type="radio" name="availability" className="filter-drop" /> Avaliable tomorrow
                </label>
                <label className="d-flex align-items-center gap-2">
                    <input type="radio" name="availability" className="filter-drop" /> Avaliable in next 7 days
                </label>
            </div>

            <div className="d-flex flex-column gap-2">
                <label className="d-flex align-items-center gap-2">
                    <input type="radio" name="consultType" className="filter-drop" /> Video consult
                </label>
            </div>

          </div>
        </div>
    )
}
</div>
               <div >
                    <p className="text-white me-2">Sort By 
                        <span
                        className="cursor-pointer text-white  ms-3 ps-1 pe-2 pb-1"
                        style={{backgroundColor:"rgba(255,255,255,0.25"}}
                        onClick={()=>toggleDropdown("relevance")}
                        >Relevance
                        <img src={caret} alt=""
                        width={15}
                        style={{filter:"invert(100%)", transform: open === "relevance" ? "rotate(180deg)":"rotate(0deg)"}}
                         />
                        </span>
                    </p>
                    {
                        open === "relevance" && (
                            <div className="position-absolute ">
                                <p className="filter-drop "
                                 onClick={() => handleExperinenceClick(20,50)}
                                >Number of patient stories - High to Low
                                </p>
                                <p className="filter-drop"
                                  onClick={() => handleExperinenceClick(20,50)}
                                >Experience -High to Low</p>
                                <p className="filter-drop"
                                  onClick={() => handleOnChange(2000 ,0)}
                                >Consultation Fee - High to Low</p>
                                <p className="filter-drop"
                                  onClick={() => handleOnChange(0 ,2000)}
                                >Consultation Fee - Low to High</p>

                            </div>
                        )
                    }
                </div>

            </div>
                
        </div>
    )
}