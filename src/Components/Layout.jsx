import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import ScrollToTop from "./ScrollToTop";

const Layout = () => {
  const location = useLocation();
  
  // Hide header only for /auth route
  const shouldShowHeader = !location.pathname.startsWith('/auth');

  return (
    <>
      {shouldShowHeader && <Header />}
      <ScrollToTop />
      <Outlet /> {/* This renders the child routes */}
    </>
  );
};

export default Layout;