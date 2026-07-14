import { useState, useEffect } from "react";
import { TimeSchedules } from "../../utils/TimeSchedules"
import { parseTimeStringToDate } from "../../utils/timeHelpers"
import "../../style/AppointmentSlots.css"
import { Link } from "react-router-dom";
export default function Appointment() {

    // 1. state to hold "now" - starts as the time when component first loads
    const [currentTime, setCurrentTime] = useState(new Date());

    // 2. effect that keeps updating that state every 60 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // 60000ms = 1 minute

        // cleanup: stop the timer if component unmounts (e.g. user navigates away)
        return () => clearInterval(interval);
    }, []); // empty [] = run this effect only once, on mount

    return (
        <div className="bookingSchedule">
            <div >
                {TimeSchedules.map((Schedule, i) => {

                    const upcomingSlots = Schedule.Time.filter((timeSlot) => {
                        return parseTimeStringToDate(timeSlot) > currentTime;
                    });

                    if (upcomingSlots.length === 0) return null;
                    

                    return (
                        <div key={i}>
                            <div className="daily">{Schedule.Title}</div>
                            <div className="btns-time-schedules">
                                {upcomingSlots.map((timeSlot, j) => (
                                    <Link to="/bookingpage" key={j} className="timebtn"

                                     >
                                        {timeSlot}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
              
        </div>
    )
}