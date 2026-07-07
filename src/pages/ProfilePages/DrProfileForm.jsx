import React from "react";import NavbarComp from "../../components/Navbar";
import { useDashboardQuery } from "../../features/auth/services/signinApi";
import { useDrdataMutation, useGetdrdataQuery } from "../../features/auth/services/drDataApi";
import { useDispatch } from "react-redux";
import { setUser } from "../../features/auth/Slice/UserSlice";
import { useSelector } from "react-redux";
import { useNavigate ,useLocation } from "react-router-dom";

export default function Profileform() {
    const {user,isLoggedIn} = useSelector((state)=>state.dr);
    const{data,isLoading,Success,error} = useDashboardQuery()
    const[drdata,{isLoad,success,err}] = useDrdataMutation();
    const {data:drsdata,loading,succ,e}= useGetdrdataQuery();
   
    const dispatch = useDispatch();
    const handelsubmit = async (e)=>{
        e.preventDefault();
        const formdata = new FormData(e.target);

        try {
            const result = await drdata(formdata).unwrap();
            console.log(result);
            dispatch(setUser(result))
        } catch (error) {
            console.log(error);
           
        }
    }
    if(isLoading){ return <h1>Loading...</h1>}
    if(error){return <h1 className="text-danger">unauthorized access</h1>}
    
    

   
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