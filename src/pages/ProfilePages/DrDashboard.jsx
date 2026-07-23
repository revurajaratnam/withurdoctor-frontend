import { Link } from "react-router-dom";
import NavbarComp from "../../components/Navbar";



export default function DoctorDashboards() {
    

    return(
        <div>
          <div>
            <NavbarComp></NavbarComp>
          </div>
          <div  style={{backgroundColor:"#28328C",color:"white",width:"100px",margin:"30px"}}>
            <div>

            </div>
            <div className="d-flex flex-column p-4 gap-4  " >
              <Link 
              to="/calender"
              className="text-decoration-none text-white d-flex">
                <i className="bi bi-calendar2-check-fill"></i>
              Calendar
              </Link>
            <Link to="/Profile"
            className="text-decoration-none text-white">
            <i className="bi bi-person-fill"></i>

              Profile</Link>
            <Link

            className="text-decoration-none text-white"
            >
            <i className="bi bi-bell-fill"></i>

              Prime</Link>
            <Link

            className="text-decoration-none text-white"
            >
            <i className="bi bi-hand-thumbs-up-fill"></i>

              Feedback</Link>
            <Link
            
            className="text-decoration-none text-white"
            >
            <i className="bi bi-megaphone-fill"></i>
              
              Reach</Link>
            <Link
            
            className="text-decoration-none text-white"
            >
            <i className="bi bi-chat-left-quote-fill"></i>

              Consult</Link>
            <Link
            
            className="text-decoration-none text-white"
            >
            <i className="bi bi-newspaper"></i>
              Health feed</Link>
            </div>
          </div>


        </div>
    )
}