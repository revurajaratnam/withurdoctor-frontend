import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "../pages/home";
import LoginAndSignupDashboard from "../pages/Auth/LoginSignup";
import VerifyMobile from "../pages/Auth/VerifyMobile";
import ViewProfile from "../pages/Doctors/viewProfile";
import BookAppointment from "../pages/Hero-Pages/BookAppointment";
import Calender from "../components/Calender";
import Appointments from "../pages/Hero-Pages/Appointment";
import Schedules from "../pages/Hero-Pages/Schedules";
import AppointmentsDashboard from "../features/components/appointmentsDashboard";

function NetworkDelay(promise, ms = 2000) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    }).then(() => promise);
}

const VideoConsult = lazy(() => import("../pages/Services/VideoConsult"));
const Medicines = lazy(() => import("../pages/Services/Medicines"));
const Surgeries = lazy(() => import("../pages/Services/Surgeries"));
const Forcorporates = lazy(() => import("../pages/Forcorporates"));
const LabTests = lazy(() => import("../pages/Services/LapTests"));
const Profileform = lazy(() => import("../pages/Doctors/DrProfileForm"));
const DoctorDashboards = lazy(() => import("../pages/Dashboardpages/DrDashboard"));
const MyAppointments = lazy(() => import("../features/components/Myappointments"));
const Consult = lazy(() => import("../pages/Dashboardpages/consult"));
const FindDrHome = lazy(() => NetworkDelay(import("../pages/Doctors/FindDoctors"),1000));

const FindDoctors = lazy(() => NetworkDelay(import("../pages/Doctors/DrInfomations"), 1000));

const DrProfilePage = lazy(() => import("../pages/Doctors/DrProfilePage"));

const Routers = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />
    },
    {
        path: "/FindDoctors",
        element: <FindDoctors />
    },
    {
        path: '/Finddrhome',
        element: <FindDrHome />
    },
    {
        path: "/VideoConsult",
        element: <VideoConsult />
    },
    {
        path: "/Medicines",
        element: <Medicines />
    },
    {
        path: "/LabTests",
        element: <LabTests />
    },
    {
        path: "/Surgeries",
        element: <Surgeries />
    },
    {
        path: "/forcorporates",
        element: <Forcorporates />
    },
    {
        path: "/LoginAndSignupDashboard",
        element: <LoginAndSignupDashboard />
    },
    {
        path: "/Login",
        element: <LoginAndSignupDashboard view="login" />
    },
    {
        path: "/Signup",
        element: <LoginAndSignupDashboard view="drsignup" />
    },
    {
        path: "/VerifyEmail",
        element: <VerifyMobile />
    },
    {
        path: "/userRegistration",
        element: <LoginAndSignupDashboard view="usersignup" />
    },
    {
        path: "/Profile",
        element: <Profileform />
    },
    {
        path: "/drprofile",
        element: <DoctorDashboards />
    },
    {
        path: "/myappointments",
        element: <MyAppointments />,
        children:[
           { path:true,
           element: <AppointmentsDashboard />},
    ]
    },
    {
        path: "/newconsultation",
        element: <Consult />
    },
    {
        path: "/doctor/:doctorName",
        element: <DrProfilePage />
    },
    {
        path:"/viewProfile/:id",
        element: <ViewProfile />
    },
    {
        path:"/appointment/:doctorId",
        element: <BookAppointment />
    },
    {
        path:"/calender",
        element: <Calender />
    },
    {
        path:"/bookappointment/:doctorId",
        element: <Appointments/>
    },
    {
        path:"/schedule/:doctorId",
        element:<Schedules />
    }
]);

export default function AppRouters() {
    return (
        <Suspense fallback={<div className="loading-screen">Loading please wait...</div>}>
            <RouterProvider router={Routers} />
        </Suspense>
    );
}