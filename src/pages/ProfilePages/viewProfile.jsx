import { useParams } from "react-router-dom";
import Footer from "../../components/Footer";
import NavbarComp from "../../components/Navbar";
import { useGetdrdataQuery } from "../../features/auth/services/drDataApi";

export default function ViewProfile() {
  const { id } = useParams();
  
  // FIX: Add the same arguments here so it fetches the full list!
  const { data: drProfile, isLoading, error } = useGetdrdataQuery({
    page: 1,
    limit: 200
  });

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>Something went wrong...</h1>;
  }

  const doctorsData = drProfile?.doctors || [];

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
        <div className="d-flex">
          <div className="profile">
            <img 
              src={`http://localhost:4545/uploads/${selectedDoctor.profilephoto}`} 
              width={150}
              className="object-fit rounded-5"
              alt="" 
            />
          </div>
          <div className="ms-4">
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