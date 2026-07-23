


export default function Calender() {

        const nowDate = new Date()
    
    return(
        <div>
            <div>
               <h1>{nowDate.getDate()}</h1>
               <h1>{nowDate.getDay()}</h1>
               <h1>{nowDate.getMinutes()}</h1>
               <h1>{nowDate.getFullYear()}</h1>



            </div>
        </div>
    )
}