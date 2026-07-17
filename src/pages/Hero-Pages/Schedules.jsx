
import { Link } from "react-router-dom"
import { TimeSchedules } from "../../utils/TimeSchedules"

export default function Schedules() {
    
    return(

        <div className="containers">
            <div className=" row  ">
                {
                    TimeSchedules.map((time,i)=>(
                        <div key={i}>
                            <div className="">
                                {
                                    time.Title
                                }
                            </div>
                            {time.Time.map((times,index)=>(
                                <div className="mb-2 col">
                                    <Link className=" btn btn-danger" to="/appointment">
                                        {times}
                                    </Link> 
                                </div>
                            ))}
                        </div>
                    ))
                }
            </div>
        </div>
    )
}