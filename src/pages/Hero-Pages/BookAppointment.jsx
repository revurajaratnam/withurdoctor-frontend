import { useGetdrdataQuery } from "../../features/auth/services/drDataApi"



export default function BookAppointment() {
           const {data:doctorData} = useGetdrdataQuery();
    return(
        <div>
               <h1>Hello</h1> 
        </div>
    )
}