import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import { CommonHealthConcernsinfo, DrProfission, VideoConsult } from "../../utils/DrProfission";
import { consultDoctor } from "../../utils/images";

// import "./Consult.css";

export default function Consult() {
  const [searchParams] = useSearchParams();
  const [activeIndex, setActiveIndex] = useState(0);

  const paramid = Number(searchParams.get("id"));
  const DoctorsSpecial = [...DrProfission,...VideoConsult,...CommonHealthConcernsinfo]

  const selectedDr = DoctorsSpecial.find((dr) => dr.id === paramid)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) =>
        prev === consultDoctor.length - 1 ? 0 : prev + 1
      );
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const activeConsult = consultDoctor[activeIndex];

  return (
    <div className="consult-page">
      <div>
        <img src={Logo} alt="" width={100} />
      </div>

      <div className="consult-box">
        <Link to="/" className="consult-close">
          X
        </Link>

        <div className="consult-left">
          <h1>Consult with a Doctor</h1>

          <p className="consult-label">Speciality</p>

          <div>
            {selectedDr ? (
              <div className="selected-speciality">
                <span>
                  <i className="bi bi-check-circle-fill text-info mx-2"></i>
                  {selectedDr.title}
                </span>
                <span>₹{selectedDr.price}</span>
              </div>
            ) : (
              <p>Selected doctor not found.</p>
            )}
          </div>

          <form>
            <label className="consult-label">Patient name</label>
            <br />

            <input
              type="text"
              placeholder="Enter patient name for prescriptions"
              className="fullname-input consult-input"
            />

            <br />

            <label className="consult-label">Mobile number</label>
            <br />

            <input
              type="text"
              placeholder="Enter mobile number"
              className="emails-input consult-input"
            />

            <p className="text-muted consult-small-text">
              A verification code will be sent to this number.
            </p>

            <button type="submit" className="btn btn-info text-white mt-3">
              Continue
            </button>
          </form>
        </div>

        <div className="consult-right">
          <div className="consult-animation-card" key={activeConsult.id}>
            <img
              src={activeConsult.picture}
              alt={activeConsult.title}
              width={100}
              height={100}
              className="consult-animation-img"
            />

            <h5>{activeConsult.title}</h5>
          </div>

          <div className="consult-dots">
            {consultDoctor.map((item, index) => (
              <span
                key={item.id}
                className={
                  activeIndex === index ? "consult-dot active" : "consult-dot"
                }
              ></span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}