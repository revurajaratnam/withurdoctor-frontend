
import { Link } from 'react-router-dom'
import Logo from '../../../assets/Logo.png'
export default function NavForDr() {
    return(
        <div>
            <div className='d-flex align-items-center justify-content-between m-4'>
                <div>
                    <img src={Logo} width={70} height={50}/>
                </div>
               <div className='d-flex gap-3'>
               <div>
                    <p>For Clinics & Hospitals</p>

                    {/* <Link>Software for clinics</Link>
                    <Link>Software for hospitals</Link>
                    <Link>Advertising</Link>
                    <Link>List your practice for Free</Link> */}
                </div>
                <div>
                    <p>Profile</p>
                    </div>
               </div>
            </div>
            
        </div>
    )
}