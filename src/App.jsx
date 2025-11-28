import "./App.css";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Home from "./Pages/Home";
import AllDoctors from "./AllDoctors/AllDoctors";
import ScrollToTop from "./Components/ScrollToTop";
import AppointmentBooking from "./Components/AppointmentBooking";
import DoctorProfile from "./Doctor Profile/DoctorProfile";
import Login from "./Authentication/Login";
import Layout from "./Components/Layout";
import Register from "./Authentication/Register";

function App() {
  return (
    <>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/all-doctors" element={<AllDoctors />} />
            <Route path="/booking" element={<AppointmentBooking />} />
            <Route path="/doctor-profile/:id" element={<DoctorProfile />} />
            <Route path="/login" element={<Login />} />
               <Route path="/register" element={<Register />} />
          </Routes>
        </Layout>
      </Router>
    </>
  );
}

export default App;