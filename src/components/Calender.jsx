
import NavbarComp from "./Navbar"
import Footer from "./Footer"
import { TimeSchedules } from "../constants/TimeSchedules"
import "../style/calender.css"
import {useEffect, useState } from "react"

   function convertSlotToMinutes(timeString) {
    const [time , period] = timeString.trim().split(" ");
    const [hoursString , minutesString] = time.split(":");

    let hours = Number(hoursString);
    const minutes = Number(minutesString);

        if(period.toUpperCase() === "PM" && hours !== 12){
            hours +=12;
        }
        if(period.toUpperCase() === "AM" && hours === 12){
            hours = 0;
        }
        return hours * 60 + minutes;
   }
   

export default function Calender() {
    const [currentTime , setCurrentTime] = useState(new Date())
    useEffect(()=>{
        const timer = setInterval(()=>{
            setCurrentTime(new Date())
        },60000)
        return () => {
            clearInterval(timer);
        };
    },[])
    console.log(currentTime)
    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    
    return(
        <div className="min-vh-100 d-flex flex-column " >
            <nav>
                <NavbarComp />
            </nav>
            <main className="flex-grow-1">
                <section>
                    <p>
                        Current time: {" "}
                        {currentTime.toLocaleDateString("en-IN",{
                            hour:"2-digit",
                            minute: "2-digit",
                        })}
                    </p>
                    <div>
                        {
                            TimeSchedules.map((timeGroup,i)=>{
                                const avaliableSlots  = timeGroup.Time.filter((schedule)=>{
                                    const slotMinutes = convertSlotToMinutes(schedule);
                                    return slotMinutes > currentMinutes;
                                });
                                return(
                                    <div key={i}>
                                        <p>{timeGroup.Title}</p>
                                        <div>
                                            {
                                                avaliableSlots.length > 0 ?(
                                                    avaliableSlots.map((schedule, index)=>(
                                                        <button key={index} className="btn btn-info ms-3">{schedule}</button>
                                                    ))
                                                ):(
                                                    <p>No Avaliable Slots</p>
                                                )
                                            }
                                        </div>
                                    </div>
                                )
                                
                            })
                        }
                    </div>
                </section>
            </main>
            <footer>
                <Footer />
            </footer>
        </div>
    )
}