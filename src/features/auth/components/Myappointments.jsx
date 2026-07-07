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
            <div className="m-4">
                <p>Medical records</p>
                <p>Appointments</p>
                <p>Lab Tests</p>
                <p>Medicine Orders</p>
                <p>Online Consultations</p>
                <p>Articles</p>
                <p>Feedback</p>
                <p>Payments</p>
            </div>
        </div>
    )
}