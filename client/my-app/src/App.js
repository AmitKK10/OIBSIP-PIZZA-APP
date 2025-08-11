// src/App.js

import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminInventory from "./pages/AdminInventory";
import CustomPizzaBuilder from "./pages/CustomPizzaBuilder";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import OrderSuccess from "./pages/OrderSuccess";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import MyOrders from "./pages/MyOrders";
import Wishlist from "./pages/Wishlist";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";
import VerifyOTP from "./pages/VerifyOTP";
import ProtectedRoute from "./components/ProtectedRoute";
import FAQ from "./pages/FAQ";
import Contact from "./pages/ContactUs";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { ToastContainer } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import Footer from "./components/Footer";

function App() {
  const isLoggedIn = !!localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const location = useLocation();

  const hideNavbarPages = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/change-password",
    "/verify-otp",
  ];

  const showNavbar =
    isLoggedIn &&
    !hideNavbarPages.some((path) => location.pathname.startsWith(path));

  const pageTransition = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 },
  };

  return (
    <>
      
      {showNavbar && (
        <div className="fixed top-0 left-0 w-full z-50">
          <Navbar />
        </div>
      )}

      <div className={showNavbar ? "pt-[80px]" : ""}>
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
          
            <Route path="/" element={<Navigate to="/login" />} />
            <Route
              path="/login"
              element={<motion.div {...pageTransition}><Login /></motion.div>}
            />
            <Route
              path="/register"
              element={<motion.div {...pageTransition}><Register /></motion.div>}
            />
            <Route
              path="/forgot-password"
              element={<motion.div {...pageTransition}><ForgotPassword /></motion.div>}
            />
            <Route
              path="/reset-password"
              element={<motion.div {...pageTransition}><ResetPassword /></motion.div>}
            />
            <Route
              path="/change-password"
              element={<motion.div {...pageTransition}><ChangePassword /></motion.div>}
            />
            <Route
              path="/verify-otp"
              element={<motion.div {...pageTransition}><VerifyOTP /></motion.div>}
            />

         
            <Route
              path="/home"
              element={
                isLoggedIn ? (
                  <motion.div {...pageTransition}><Home /></motion.div>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/custom-pizza"
              element={
                isLoggedIn ? (
                  <motion.div {...pageTransition}><CustomPizzaBuilder /></motion.div>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/cart"
              element={
                isLoggedIn ? (
                  <motion.div {...pageTransition}><Cart /></motion.div>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/order-success"
              element={
                isLoggedIn ? (
                  <motion.div {...pageTransition}><OrderSuccess /></motion.div>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/my-orders"
              element={
                isLoggedIn ? (
                  <motion.div {...pageTransition}><MyOrders /></motion.div>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/wishlist"
              element={
                isLoggedIn ? (
                  <motion.div {...pageTransition}><Wishlist /></motion.div>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

         
            <Route
              path="/faq"
              element={
                isLoggedIn && role === "customer" ? (
                  <motion.div {...pageTransition}><FAQ /></motion.div>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/contact"
              element={
                isLoggedIn && role === "customer" ? (
                  <motion.div {...pageTransition}><Contact /></motion.div>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/terms-of-service"
              element={
                isLoggedIn && role === "customer" ? (
                  <motion.div {...pageTransition}><TermsOfService /></motion.div>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/privacy-policy"
              element={
                isLoggedIn && role === "customer" ? (
                  <motion.div {...pageTransition}><PrivacyPolicy /></motion.div>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/admin-inventory"
              element={
                isLoggedIn && role === "admin" ? (
                  <motion.div {...pageTransition}><AdminInventory /></motion.div>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                isLoggedIn && role === "admin" ? (
                  <motion.div {...pageTransition}><AdminDashboard /></motion.div>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/admin-orders"
              element={
                isLoggedIn && role === "admin" ? (
                  <motion.div {...pageTransition}><AdminOrders /></motion.div>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </AnimatePresence>
      </div>

      <Footer />

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
