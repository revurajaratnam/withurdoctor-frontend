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
            <div className="d-flex flex-column p-4 gap-4 " >
            <Link to="/Profile"
            className="text-decoration-none text-white"
            >Profile</Link>
            <Link

            className="text-decoration-none text-white"
            >Prime</Link>
            <Link

            className="text-decoration-none text-white"
            >Feedback</Link>
            <Link
            
            className="text-decoration-none text-white"
            >Reach</Link>
            <Link
            
            className="text-decoration-none text-white"
            >Consult</Link>
            <Link
            
            className="text-decoration-none text-white"
            >Health feed</Link>
            </div>
          </div>


        </div>
    )
}