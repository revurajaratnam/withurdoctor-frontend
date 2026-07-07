import React from "react";
import { Link, useLocation } from "react-router-dom";
import NavbarComp from "../../components/Navbar";
import { useDashboardQuery } from "../../features/auth/services/signinApi";
export default function DrDashBoard() {
    const {data,isLoading, error} = useDashboardQuery();
    const location = useLocation();
    const emailname = location.state?.email

    const handleLogout = () =>{
        localStorage.removeItem("token")
    }
    if(isLoading){return <h2>Loading...</h2>}
    if(error){return <h2>Unauthorized Access</h2>}

    return(

        <div>
            <div>
                <NavbarComp ></NavbarComp>
                <Link to={"/"}><button onClick={handleLogout}>Logout</button></Link>
            </div>
            {/* <div>{JSON.stringify(data)}</div> */}
            <h1>Welcome Dr {emailname.split("@")[0]} </h1>
            
        </div>
    )
}