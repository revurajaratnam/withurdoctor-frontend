
import { Link } from 'react-router-dom'
import Logo from '../../assets/Logo.png'
export default function NavForDr() {
    return(
        <div>
            <div className='d-flex align-items-center justify-content-between m-4'>
                <div>
                    <Link to="/"><img src={Logo} width={85} height={50}/></Link>
                </div>
               <div className='d-flex gap-3'>
               <div>
                    <p>For Clinics & Hospitals</p>

                        <section className='d-flex flex-column'>
                        <Link>Software for clinics</Link>
                    <Link>Software for hospitals</Link>
                    <Link>Advertising</Link>
                    <Link>List your practice for Free</Link>
                        </section>
                </div>
                <div>
                    <p>Profile</p>
                    </div>
               </div>
            </div>
            
        </div>
    )
}