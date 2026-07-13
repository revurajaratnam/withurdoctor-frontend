import { useState } from "react"
import { Link } from "react-router-dom"
import Logo from '../assets/Logo.png'

export default function Footer() {
    const [open ,setOpen] = useState(null)
        const handleonchange= (name) =>{
            setOpen(open===name?null:name)
        }
        // #28328C
        
    return(
       <div className="w-100" style={{background:"green" ,color:"white"}}>
   
        
            <div className="d-flex justify-content-between align-items-center p-2 ">
            <h6>WithUrDoctor</h6>
            <Link
                onClick={()=>handleonchange("withUrDoctor")}
                className="text-decoration-none text-white fs-bold"
            >{open?"-":"+"}</Link>
             </div>
            <div className="border-bottom">
            {open === "withUrDoctor" &&(
                <div className="p-2 ">
                <p>About</p>
                <p>Blog</p>
                <p>Careers</p>
                <p>Contact</p>
                
            </div>
            )} 
        </div>
        
        <div className="d-flex justify-content-between align-items-center p-2">
        <h6>For patients</h6>
        <Link
        className="text-decoration-none text-white"
        onClick={()=>handleonchange("forPatients")}
        >{open?"-":"+"}</Link>
        </div>
        
           <div className=" border-bottom">
           {open === "forPatients"&&(
                <div >
                <p>Ask free health questions</p>
                <p>Search for doctors</p>
                <p>Search for clinics</p>
                <p>Read health articles</p>
                <p>Read about medicines</p>
                <p>Consult a Doctor</p>
                <p>Practo drive</p>
                <p>Health app</p>
           </div>
          
            )}
              </div>
            <div className="d-flex justify-content-between p-2 " >
                <h6>For doctors</h6>
                <Link
                className="text-decoration-none text-white"
                onClick={()=> handleonchange("fordoctors")}
                >{open?"-":"+"}</Link>
            </div>
           {open==="fordoctors"&&(
             <div>
             <Link className="text-decoration-none text-white"><p>WithUrDoctor Consult</p></Link>
             <Link className="text-decoration-none text-white"><p>WithUrDoctor Health Feed</p></Link>
             <Link className="text-decoration-none text-white"><p>WithUrDoctor Profile</p></Link>
             <Link className="text-decoration-none text-white"><h6>For clinics</h6></Link>
             <Link className="text-decoration-none text-white"><p>Ray by WithUrDoctor</p></Link>
             <Link className="text-decoration-none text-white"><p>WithUrDoctor Reach</p></Link>
             <Link className="text-decoration-none text-white"><p>Ray Tab</p></Link>
             <Link className="text-decoration-none text-white"><p>WithUrDoctor Pro</p></Link>
         </div>
           )}

        <div className="text-center ">
            <img src={Logo} alt="" />
            <p className=" text-secondary">Copyright © 2026 WithUrDoctor. All RIghts reseved.</p>
        </div>

       </div>
    )
}