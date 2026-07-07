import { useParams } from "react-router-dom";
import Footer from "../../components/Footer";
import NavbarComp from "../../components/Navbar";
import { useGetdrdataQuery } from "../../features/auth/services/drDataApi";

export default function ViewProfile() {
  const { id } = useParams();
  const { data: drProfile, isLoading, error } = useGetdrdataQuery();

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>Something went wrong...</h1>;
  }

  const doctorsData = Array.isArray(drProfile) ? drProfile : [];

  const selectedDoctor = doctorsData.find(
    (doctor) => String(doctor._id) === String(id) || String(doctor.id) === String(id)
  );

  if (!selectedDoctor) {
    return <h1>Doctor profile not found</h1>;
  }

  return (
    <div className="min-vh-100 d-flex flex-column">
      <header>
        <NavbarComp />
      </header>

      <main className="flex-grow-1 container py-4">
       <div className=" d-flex">
       <div className="profile">
       <img src={  `http://localhost:4545/uploads/${selectedDoctor.profilephoto}`} alt="" />
       </div>
       <div>
       <h1>Dr. {selectedDoctor.fullname}</h1>
        <p>{selectedDoctor.specialization}</p>
        <p>{selectedDoctor.experience} experience overall</p>
        <p>{selectedDoctor.address}</p>
        <p>₹{selectedDoctor.consultation} Consultation Fee</p>
       </div>
       </div>
        
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}