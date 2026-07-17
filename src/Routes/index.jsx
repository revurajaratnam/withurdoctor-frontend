import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "../components/home";
import LoginAndSignupDashboard from "../pages/LoginPages/LoginSignup";
import VerifyMobile from "../pages/LoginPages/VerifyMobile";
import ViewProfile from "../pages/ProfilePages/viewProfile";
import AppointmentSchedule from "../pages/Hero-Pages/Schedule";
import BookAppointment from "../pages/Hero-Pages/BookAppointment";

function NetworkDelay(promise, ms = 2000) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    }).then(() => promise);
}

const VideoConsult = lazy(() => import("../pages/NavPages/VideoConsult"));
const Medicines = lazy(() => import("../pages/NavPages/Medicines"));
const Surgeries = lazy(() => import("../pages/NavPages/Surgeries"));
const Forcorporates = lazy(() => import("../pages/NavPages/Forcorporates"));
const LabTests = lazy(() => import("../pages/NavPages/LapTests"));
const Profileform = lazy(() => import("../pages/ProfilePages/DrProfileForm"));
const DoctorDashboards = lazy(() => import("../pages/ProfilePages/DrDashboard"));
const MyAppointments = lazy(() => import("../features/auth/components/Myappointments"));
const Consult = lazy(() => import("../pages/DashboardPages/consult"));
const FindDrHome = lazy(() => NetworkDelay(import("../pages/NavPages/FindDoctors"),1000));

const FindDoctors = lazy(() => NetworkDelay(import("../pages/NavPages/DrInfomations"), 1000));

const DrProfilePage = lazy(() => import("../pages/Hero-Pages/DrProfilePage"));

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
        element: <MyAppointments />
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
        path:"/appointment",
        element: <BookAppointment />
    }
]);

export default function AppRouters() {
    return (
        <Suspense fallback={<div className="loading-screen">Loading please wait...</div>}>
            <RouterProvider router={Routers} />
        </Suspense>
    );
}