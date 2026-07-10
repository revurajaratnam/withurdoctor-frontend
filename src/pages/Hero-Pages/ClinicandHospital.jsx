import { useSearchParams } from "react-router-dom";
import { useGetdrdataQuery } from "../../features/auth/services/drDataApi";

export default function ClinicandHospital() {
  const [searchParams] = useSearchParams();

  const targetId = searchParams.get("id");

  const { data: doctorData, isLoading, isError, error } = useGetdrdataQuery();

  console.log("doctorData:", doctorData);
  console.log("error:", error);
  console.log("targetId:", targetId);

  const doctors = Array.isArray(doctorData?.data) ? doctorData.data : [];

  if (isLoading) {
    return <h4>Loading...</h4>;
  }

  if (isError) {
    return <h4>Something went wrong</h4>;
  }

  const singleDoctor = doctors.find(
    (doctor) =>
      String(doctor.id) === String(targetId) ||
      String(doctor._id) === String(targetId)
  );

  return (
    <div>
      {singleDoctor ? (
        <div className="border p-3 my-2">
          <p>Doctor Name</p>
          <h4>{singleDoctor.fullname}</h4>

          <p>Phone Number</p>
          <h4>{singleDoctor.phone || "Phone number not available"}</h4>
        </div>
      ) : (
        <h4>No doctor found with this ID</h4>
      )}
    </div>
  );
}