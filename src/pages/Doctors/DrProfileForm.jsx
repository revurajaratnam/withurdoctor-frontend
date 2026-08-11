import React from "react";import NavbarComp from "../../components/Navbar";
import { useDashboardQuery } from "../../features/auth/api/signinApi";
import { useDrdataMutation, useGetdrdataQuery } from "../../features/auth/api/drDataApi";
import { useDispatch } from "react-redux";
import { setUser } from "../../features/auth/Slice/UserSlice";
import { useSelector } from "react-redux";
import { useNavigate ,useLocation } from "react-router-dom";

export default function Profileform() {
    const {user,token,isLoggedIn} = useSelector((state)=>state.dr);
    const isDoctor = user?.role === "doctor";
    const{data,isLoading,Success,error} = useDashboardQuery(undefined, { skip:!token || !isLoggedIn ||!isDoctor})
    const[drdata,{isLoad,success,err}] = useDrdataMutation();
    const {data:drsdata,loading,succ,e}= useGetdrdataQuery();
   
    const dispatch = useDispatch();
    const handelsubmit = async (e)=>{
        e.preventDefault();
          if(!isDoctor){
            return;
          }
        try {
          const formdata = new FormData(e.currentTarget);
          const result = await drdata(formdata).unwrap();
            
        } catch (error) {
            console.log(error);
           
        }
    }
    if(isLoading){ return <h1>Loading...</h1>}
    if(error){return <h1 className="text-danger text-center">unauthorized access</h1>}
    
    if (!isDoctor) {
      return (
        <div>
          <NavbarComp />
  
          <div className="container my-5">
            <div className="alert alert-danger text-center">
              Only doctors can access this page. You are logged in as a
              patient.
            </div>
          </div>
        </div>
      );
    }

   
    return(
        <div>
            <div>
                <NavbarComp></NavbarComp>
            </div>

            <div>
           
            <div className="container my-5">
  <h3 className="mb-4 text-center">Connect a Practice</h3>

  <form onSubmit={handelsubmit} className="border rounded p-4 shadow-sm bg-info text-white">
    <div className="row g-4">

      <div className="col-md-6">
        <label className="form-label">Full Name</label>
        <input
          type="text"
          name="fullname"
          className="form-control"
          placeholder="Enter Full Name"
        /> 
      </div>

      <div className="col-md-6">
        <label className="form-label">Experience</label>
        <input
          type="text"
          name="experience"
          className="form-control"
          placeholder="10 Years"
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Qualification</label>
        <input
          type="text"
          name="qualification"
          className="form-control"
          placeholder="MBBS, MD"
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Specialization</label>
        <input
          type="text"
          name="specialization"
          className="form-control"
          placeholder="Cardiologist"
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Consultation Fee</label>
        <input
          type="number"
          name="consultation"
          className="form-control"
          placeholder="500"
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Languages</label>
        <input
          type="text"
          name="languages"
          className="form-control"
          placeholder="English, Telugu, Hindi"
        />
      </div>

      <div className="col-12">
        <label className="form-label">About Doctor</label>
        <textarea
          name="about"
          className="form-control"
          rows="3"
          placeholder="Write about yourself"
        />
      </div>

      <div className="col-12">
        <label className="form-label">Clinic Address</label>
        <textarea
          name="address"
          className="form-control"
          rows="3"
          placeholder="Enter clinic address"
        />
      </div>

      <div className="col-12">
        <label className="form-label">Surgeries & Treatments</label>
        <textarea
          name="surgeries"
          className="form-control"
          rows="3"
          placeholder="Write surgeries and treatments"
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Profile Photo</label>
        <input
          type="file"
          name="profilephoto"
          className="form-control"
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Clinic Photos & Videos</label>
        <input
          type="file"
          name="gallery"
          className="form-control"
          multiple
        />
      </div>

      <div className="col-12">
        <label className="form-label">Health Feed</label>
        <textarea
          name="hFeed"
          className="form-control"
          rows="3"
        />
      </div>

      <div className="col-12">
        <label className="form-label">Consult Q&A</label>
        <textarea
          name="consult"
          className="form-control"
          rows="3"
        />
      </div>

      <div className="col-12 text-end">
        <button type="submit" className="btn btn-light  px-4">
          Save Profile
        </button>
      </div>

    </div>
  </form>
</div>
            </div>
        </div>
    )
}