import { Link, Outlet } from "react-router-dom";
import NavForDr from "./NavForDr";




export default function MyAppointments() {



    return(
        <div>
            <div>
                <NavForDr></NavForDr>
            </div>
            <div className="border-bottom m-4">
                <h4>Your Drive</h4>

            </div>
            <div className="m-4 d-flex flex-column ">
                <Link className="text-decoration-none" to="">Medical records</Link>
                <Link className="text-decoration-none" to="/myappointment">Appointments</Link>

                <Link className="text-decoration-none" to="">Lab Tests</Link>
                <Link className="text-decoration-none" to="">Medicine Orders</Link>
                <Link className="text-decoration-none" to="">Online Consultations</Link>
                <Link className="text-decoration-none" to="">Articles</Link>
                <Link className="text-decoration-none" to="">Feedback</Link>
                <Link className="text-decoration-none" to="">Payments</Link>
            </div>
            <Outlet />
        </div>
    )
}