
import { TimeSchedules } from "../../utils/TimeSchedules"

export default function Appointment() {
    return(

        <div>

            <div>
                {TimeSchedules.map((Schedule, i)=>(
                   <div key={i}>
                     <div>
                        {Schedule.Title}
                    </div>
                    <div >
                       {
                        Schedule.Time.map((timeSlot,j)=>(
                            <div  key={j} className="btn btn-info text-white me-3 mb-3" >
                                {timeSlot}
                            </div>
                        ))
                       }
                    </div>
                   </div>
                ))}
            </div>

            <div>

            </div>

        </div>

    )
}