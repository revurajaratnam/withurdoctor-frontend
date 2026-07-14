import { useEffect, useRef, useState } from "react";
import { states } from "../../utils/StatesAndCities";
import { specialization } from "../../utils/drSpecial";
import { Link } from "react-router-dom";
import { useGetdrdataQuery } from "../../features/auth/services/drDataApi";
import "../../style/searchBars.css"
export default function LocationandSearch({
  locationValue,
  setLocationValue,
  searchValue,
  setSearchValue,
  doctorsData = [],
  className="",
}) {
  const [dropdown, setDropdown] = useState(null);
  const searchBoxRef = useRef(null);
  const searchInputRef = useRef(null);
  const {data} = useGetdrdataQuery();
  useEffect(() => {
    const handleClickOutSide = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutSide);

    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, []);

  const doctorsDatas = Array.isArray(data?.data)? data.data : [];
  const safeText = (value) => String(value || "").toLowerCase();
  const finalDoctorData = doctorsData.length >0 ? doctorsData :doctorsDatas;
  const filteredState = states.filter((s) =>
    safeText(s).includes(safeText(locationValue))
  );

  const filteredSpecialization = specialization.filter((s) =>
    safeText(s.title).includes(safeText(searchValue))
  );

  const filteredDoctors = finalDoctorData.filter((doctor) => {
    const doctorName = safeText(doctor.fullname);
    const doctorSpecialization = safeText(doctor.specialization);
    const doctorAddress = safeText(doctor.address);
  
    const locationText = safeText(locationValue);
    const searchText = safeText(searchValue);
  
    const matchLocation = locationText
      ? doctorAddress.includes(locationText)
      : true;
  
    const matchSearch = searchText
      ? doctorName.includes(searchText) ||
        doctorSpecialization.includes(searchText)
      : false;
  
    return matchLocation && matchSearch;
  });
  return (
    <div className="bg-white  p-2  location-search-container" >
      <div
        ref={searchBoxRef}
        className="d-flex justify-content-center align-items-start bg-white"
        style={{ width: "100%" }}
      >
        <div className="position-relative border location-box " >
          <div className="d-flex align-items-center location-icon ">
            <i className="bi bi-geo-alt-fill me-2 ms-2  "></i>
            <span >
            <input
            type="text"
            className="p-2 w-100 fnpage-focus search-input"
            value={locationValue || ""}
            onClick={() => setDropdown("location")}
            onChange={(e) => {
              setLocationValue(e.target.value);
              setDropdown("location");
            }}
            placeholder="Search location"
          />
            </span>
           { locationValue && (
             <i className="bi bi-x-circle-fill text-secondary delete-location-icon "
             onClick={() =>setLocationValue("")}
           ></i>
           )

           }
          </div>

          {dropdown === "location" && (
            <div
              className="position-absolute bg-white w-100 border rounded"
              style={{
                top: "100%",
                left: 0,
                zIndex: 2000,
                maxHeight: "250px",
                overflowY: "auto",
              }}
            >
              {filteredState.length > 0 ? (
                filteredState.map((state, index) => (
                  <div
                    key={index}
                    className="location-h-effect p-2 text-start"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setLocationValue(state);
                      setDropdown("search");
                      setTimeout(() => {
                        searchInputRef.current.focus();
                      }, 0);
                    }}
                  >
                    <i className="bi bi-search mx-3"></i>
                    {state}
                  </div>
                ))
              ) : (
                <div className="p-2 text-start">This city is not available</div>
              )}
            </div>
          )}
        </div>

        <div className="position-relative border" style={{ width: "70%" }}>
          <div className="d-flex align-items-center location-icon " >
              <i className="bi bi-search ms-2"></i>
            <span>
            <input
            ref={searchInputRef}
            type="text"
            className="p-2  fnpage-focus ms-2  search-input" 
            value={searchValue || ""}
            placeholder="Search for doctors..."
            onClick={() => setDropdown("search")}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setDropdown("search");
            }}
          />
            </span>
            {
              searchValue && (
            <i className="bi bi-x-circle-fill text-secondary delete-location-icon"
                onMouseMove={(e)=> e.preventDefault("")}
                onClick={() => setSearchValue()}
            ></i>
              )
            }

          </div>

          {dropdown === "search" && (
            <div
              className="position-absolute bg-white w-100 border rounded"
              style={{
                top: "100%",
                left: 0,
                zIndex: 2000,
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              {searchValue && filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <Link
  to={`/FindDoctors?search=${encodeURIComponent(doctor.fullname || "")}${
    locationValue ? `&location=${encodeURIComponent(locationValue)}` : ""
  }`}
  key={doctor.id || doctor._id}
  className="location-h-effect p-2 text-start d-block text-decoration-none text-dark"
  onClick={() => {
    setSearchValue(doctor.fullname || "");
    setDropdown(null);
  }}
>
  <i className="bi bi-person-circle mx-3"></i>
  Dr. {doctor.fullname} - {doctor.specialization}

  <small className="d-block ms-5 text-muted">
    {doctor.address}
  </small>
</Link>
                ))
              ) : filteredSpecialization.length > 0 ? (
                filteredSpecialization.map((special) => (
                  <Link
                    to={`/FindDoctors?id=${special.id}&location=${encodeURIComponent(
                      locationValue
                    )}`}
                    key={special.id}
                    className="location-h-effect p-2 text-start d-block text-decoration-none text-dark"
                    onClick={() => {
                      setSearchValue(special.title);
                      setDropdown(null);
                    }}
                  >
                    <i className="bi bi-search mx-3"></i>
                    {special.title}
                  </Link>
                ))
              ) : (
                <div className="p-2 text-start">No doctors available</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}