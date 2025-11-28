import "./App.css";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Home from "./Pages/Home";
import AllDoctors from "./AllDoctors/AllDoctors";
import ScrollToTop from "./Components/ScrollToTop";
import AppointmentBooking from "./Components/AppointmentBooking";
import DoctorProfile from "./Doctor Profile/DoctorProfile";

function App() {
  return (
    <>
      <Router>
        <Header />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/all-doctors" element={<AllDoctors />} />
          <Route path="/booking" element={<AppointmentBooking />} />
          // Add this route to your existing routes
          <Route path="/doctor-profile/:id" element={<DoctorProfile />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
