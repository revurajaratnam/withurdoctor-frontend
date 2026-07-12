import { useSearchParams } from "react-router-dom";
import { useGetdrdataQuery } from "../../features/auth/services/drDataApi";

export default function ClinicandHospital( {
  doctor
}) {

  if(!doctor){
    return <h1>No Doctor Found</h1>
  }

  return (
    <div>
      
        <div className="border p-3 my-2">
          <p>Doctor Name</p>
          <h4>{doctor.fullname}</h4>

          <p>Phone Number</p>
          <h4>{doctor.phone || "Phone number not available"}</h4>
        </div>
      
    </div>
  );
}