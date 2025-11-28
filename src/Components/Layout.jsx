// Components/Layout.js
import { useLocation } from "react-router-dom";
import Header from "./Header";
import ScrollToTop from "./ScrollToTop";

const Layout = ({ children }) => {
  const location = useLocation();
  const hideHeaderRoutes = ['/login', '/register'];
  const shouldShowHeader = !hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowHeader && <Header />}
      <ScrollToTop />
      {children}
    </>
  );
};

export default Layout;