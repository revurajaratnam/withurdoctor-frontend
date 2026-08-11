    import cardimg from '../../assets/image.png'
import Footer from '../../components/Footer'
import NavbarComp from '../../components/Navbar'

    export default function Surgeries() {

        return(
            <div className="min-vh-100 d-flex flex-column">
               <div className='position-fixed top-0 start-0 w-100 bg-white' style={{zIndex:1}}>
               <NavbarComp />
               </div>
                <div className='flex-grow-1' style={{marginTop:"100px"}}>
                <div className='card m-5 rounded' style={{width:"500px"}}>
                    <img src={cardimg} alt="image"
                    width={800}
                    className='rounded-top'
                     />
                </div>
                <div  className='card m-5 rounded' style={{width:"500px"}}>
                        <h5 className='border-bottom'>Why WithUrDoctor Assured?</h5>
                        <p>WithUrDoctor Assured Benefits</p>
                        <div>
                            <div>

                            </div>
                        </div>
                        <p>WithUrDoctor Assured Nerwork</p>
                        <div>
                            <div>

                            </div>
                        </div>
                </div>
                <h1>Treatments Offered</h1>
                <div className='card m-5 rounded' style={{width:"500px"}}>
                    <p>Popular</p>
                </div>
                </div>
                <Footer />
            </div>
        )
    }