import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Send,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import FooterBg1 from "../assets/footer-bg-01.png";
import FooterBg2 from "../assets/footer-bg-02.png";
import FooterBg3 from "../assets/footer-bg-03.png";
import FooterBg4 from "../assets/footer-bg-04.png";
import FooterBg5 from "../assets/footer-bg-05.png";
import LOGO from "../assets/logo.png";
import { HiLocationMarker, HiPhone, HiMail } from "react-icons/hi";

const MedicalFooter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (email && email.includes("@")) {
      console.log("Subscribed:", email);
      alert("Thank you for subscribing!");
      setEmail("");
    } else {
      alert("Please enter a valid email address");
    }
  };

  return (
    <footer className="medical-footer inner-footer">
      {/* Background Images - Using your exact positioning */}
      <div className="footer-bg">
        <img
          className="footer-bg-01"
          alt="Medical background element"
          src={FooterBg1}
        />
        <img
          className="footer-bg-02"
          alt="Medical background element"
          src={FooterBg2}
        />
        <img
          className="footer-bg-03"
          alt="Medical background element"
          src={FooterBg3}
        />
        <img
          className="footer-bg-04"
          alt="Medical background element"
          src={FooterBg4}
        />
        <img
          className="footer-bg-05"
          alt="Medical background element"
          src={FooterBg5}
        />
      </div>

      <div className="container">
        {/* Top Banner */}
        <div className="footer-top-banner">
          <div className="banner-content">
            <h2 className="banner-title">Working for Your Better Health.</h2>
            <div className="banner-contact">
              <div className="contact-item">
                <div className="contact-icon">
                  <Phone size={18} />
                </div>
                <div className="contact-info">
                  <h6>Customer Support</h6>
                  <p>+1 56589 54598</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">
                  <Mail size={18} />
                </div>
                <div className="contact-info">
                  <h6>Drop Us an Email</h6>
                  <p>info1256@example.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Content */}
        <div className="footer-content">
          <div className="row">
            {/* Newsletter */}
            <div className="col-lg-4 col-md-8">
              <div className="footer-widget">
                {/* <h6 className="footer-title">Newsletter</h6> */}
                <img className="h-50 w-50" src={LOGO} alt="logo" />

                {/* Contact Info */}
                <div className="footer-contact mt-1">
                  <a
                    href="https://maps.google.com/?q=123 Medical Street, Mumbai, India"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="d-flex gap-2 align-items-center AddressText text-decoration-none"
                  >
                    <HiLocationMarker size={18} />
                    123 Medical Street, Mumbai, India
                  </a>

                  <a
                    href="tel:+919876543210"
                    className="d-flex gap-2 align-items-center AddressText text-decoration-none mt-2"
                  >
                    <HiPhone size={18} />
                    +91 98765 43210
                  </a>

                  <a
                    href="mailto:support@yourwebsite.com"
                    className="d-flex gap-2 align-items-center AddressText text-decoration-none mt-2"
                  >
                    <HiMail size={18} />
                    support@yourwebsite.com
                  </a>
                </div>

                {/* Social Icons */}
                <div className="social-connect mt-4">
                  <h6>Connect With Us</h6>
                  <div className="social-icons">
                    <a
                      href="https://facebook.com"
                      className="social-icon"
                      aria-label="Facebook"
                    >
                      <Facebook size={16} />
                    </a>
                    <a
                      href="https://twitter.com"
                      className="social-icon"
                      aria-label="Twitter"
                    >
                      <Twitter size={16} />
                    </a>
                    <a
                      href="https://instagram.com"
                      className="social-icon"
                      aria-label="Instagram"
                    >
                      <Instagram size={16} />
                    </a>
                    <a
                      href="https://linkedin.com"
                      className="social-icon"
                      aria-label="LinkedIn"
                    >
                      <Linkedin size={16} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            {/* Company */}
            <div className="col-lg-2 col-md-4 col-sm-6">
              <div className="footer-widget footer-menu">
                <h6 className="footer-title">Company</h6>
                <ul>
                  <li>
                    <a href="/about">About</a>
                  </li>
                  <li>
                    <a href="/features">Features</a>
                  </li>
                  <li>
                    <a href="/works">Works</a>
                  </li>
                  <li>
                    <a href="/careers">Careers</a>
                  </li>
                  <li>
                    <a href="/locations">Locations</a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Treatments */}
            <div className="col-lg-2 col-md-4 col-sm-6">
              <div className="footer-widget footer-menu">
                <h6 className="footer-title">Treatments</h6>
                <ul>
                  <li>
                    <a href="/dental">Dental</a>
                  </li>
                  <li>
                    <a href="/cardiac">Cardiac</a>
                  </li>
                  <li>
                    <a href="/spinal-cord">Spinal Cord</a>
                  </li>
                  <li>
                    <a href="/hair-growth">Hair Growth</a>
                  </li>
                  <li>
                    <a href="/anemia">Anemia & Disorder</a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Specialities */}
            <div className="col-lg-2 col-md-4 col-sm-6">
              <div className="footer-widget footer-menu">
                <h6 className="footer-title">Specialities</h6>
                <ul>
                  <li>
                    <a href="/transplant">Transplant</a>
                  </li>
                  <li>
                    <a href="/cardiologist">Cardiologist</a>
                  </li>
                  <li>
                    <a href="/oncology">Oncology</a>
                  </li>
                  <li>
                    <a href="/pediatrics">Pediatrics</a>
                  </li>
                  <li>
                    <a href="/gynaecology">Gynaecology</a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Utilities */}
            <div className="col-lg-2 col-md-4 col-sm-6">
              <div className="footer-widget footer-menu">
                <h6 className="footer-title">Utilities</h6>
                <ul>
                  <li>
                    <a href="/pricing">Pricing</a>
                  </li>
                  <li>
                    <a href="/contact">Contact</a>
                  </li>
                  <li>
                    <a href="/request-quote">Request A Quote</a>
                  </li>
                  <li>
                    <a href="/premium">Premium Membership</a>
                  </li>
                  <li>
                    <a href="/integrations">Integrations</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="copyright-content">
            <p className="copyright-text">
              Copyright © 2025 . All Rights Reserved
            </p>
            <ul className="footer-links">
              <li>
                <a href="/legal">Legal Notice</a>
              </li>
              <li>
                <a href="/privacy">Privacy Policy</a>
              </li>
              <li>
                <a href="/refund">Refund Policy</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MedicalFooter;
