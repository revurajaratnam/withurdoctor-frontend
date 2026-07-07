import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import NavbarComp from "../../components/Navbar";


    export default function LabTests() {

        return(
            <div className="min-vh-100 d-flex flex-column">
                <NavbarComp />
                <div className="flex-grow-1 m-5">
                    <div className="">
                        <div className="d-flex align-items-center justify-content-between py-3">
                        <h1>Book Lab Tests Online</h1>
                        <Link  className="p-3 border rounded text-decoration-none"> <i className="bi bi-cart"></i>  Cart</Link>
                        </div>
                       <div>
                       <div className="d-flex justify-content-between align-items-center">
                            <div className="border p-2 w-75">
                            <i className="bi bi-geo-alt-fill"></i>
                            <input type="text" 
                                className="w-25   input-focus"
                                style={{borderRight:"1px"}}
                            />
                            </div>
                            
                            <div className="d-flex gap-5">
                                <Link className="text-decoration-none btn btn-primary ">Book Via Call <i className="bi bi-telephone-fill"></i> </Link>
                                <Link className="text-decoration-none btn btn-primary">Book Via Call <i className="bi bi-whatsapp"></i> </Link>
                            </div>
                        </div>
                        <div>
                            <h1>Top Booked Diagnostic Tests</h1>
                            <p className=" w-25 p-1 rounded-5 px-2" style={{backgroundImage:"linear-gradient(60deg,#B3F3B3,transparent)"}}> <i className="bi bi-lightning-fill text-success"></i> Get resports within 24hrs</p>
                        </div>
                        <div>

                        </div>
                       </div>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }