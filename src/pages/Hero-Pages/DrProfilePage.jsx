import { useParams } from "react-router-dom";
import Footer from "../../components/Footer";
import NavbarComp from "../../components/Navbar";
import { useGetdrdataQuery } from "../../features/auth/services/drDataApi";
import LocationandSearch from "../NavPages/Location";

export default function DrProfilePage({drlist}) {
    const {data:drdata,isLoading,isSuccess} = useGetdrdataQuery();
        if(isLoading){ return <h1>Loading..</h1>}
        const {drname} = useParams();
        const currentdr = drlist.find((dr).fullname === doctorName)
    return(
        <div className="min-vh-100  d-flex flex-column ">
            
                <NavbarComp />
                <LocationandSearch />
            <main className="flex-grow-1">
                <div className="" style={{marginTop:"100px"}}>

                    <div>
                        {
                            drdata?.map((dr,i)=>
                                (
                                    <div key={i}>
                                    <div>
                                    <h1>{currentdr === dr.fullname }</h1>
                                    </div>
                                </div>
                                )
                            )
                        }
                    </div>
                   
                </div>
            </main>
            <Footer />
        </div>
    )
}