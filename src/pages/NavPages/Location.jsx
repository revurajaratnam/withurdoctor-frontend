import { useEffect, useRef, useState } from "react";
import { states } from "../../utils/StatesAndCities";
import { specialization } from "../../utils/drSpecial";
import { Link } from "react-router-dom";

export default function LocationandSearch({
  locationValue,
  setLocationValue,
  searchValue,
  setSearchValue,
  doctorsData = [],
}) {
  const [dropdown, setDropdown] = useState(null);
  const searchBoxRef = useRef(null);
  const searchInputRef = useRef(null);

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

  const filteredState = states.filter((s) =>
    s.toLowerCase().includes(locationValue.toLowerCase())
  );

  const filteredSpecialization = specialization.filter((s) =>
    s.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  const filteredDoctors = doctorsData.filter((doctor) => {
    const matchLocation = locationValue
      ? doctor.address?.toLowerCase().includes(locationValue.toLowerCase())
      : true;

    const matchSearch = searchValue
      ? doctor.fullname?.toLowerCase().includes(searchValue.toLowerCase()) ||
        doctor.specialization?.toLowerCase().includes(searchValue.toLowerCase())
      : false;

    return matchLocation && matchSearch;
  });

  return (
    <div>
      <div
        ref={searchBoxRef}
        className="d-flex justify-content-center align-items-start"
        style={{ width: "70%", height: "50px" }}
      >
        <div className="position-relative border" style={{ width: "30%" }}>
          <input
            type="text"
            className="p-2 w-100 fnpage-focus"
            value={locationValue}
            onClick={() => setDropdown("location")}
            onChange={(e) => {
              setLocationValue(e.target.value);
              setDropdown("location");
            }}
            placeholder={states[0]}
          />

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
          <input
          ref={searchInputRef}
            type="text"
            className="p-2 w-100 fnpage-focus"
            value={searchValue}
            placeholder="Search for doctors..."
            onClick={() => setDropdown("search")}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setDropdown("search");
            }}
          />

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
                    to={`/Profile/${doctor._id}`}
                    key={doctor._id}
                    className="location-h-effect p-2 text-start d-block text-decoration-none text-dark"
                    onClick={() => {
                      setSearchValue(doctor.fullname);
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