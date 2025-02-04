import "@aws-amplify/ui-react/styles.css";
import {
  withAuthenticator,
  Button,
  Heading,
  Image,
  View,
  Card,
} from "@aws-amplify/ui-react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";

import AddNewCase from "./AppPages/AddNewCase";
import Home from "./AppPages/Home";
import LandingPage from "./AppPages/LandingPage";
import MainLandingpage from "./AppPages/LandingPage/MainLandingpage";
import Submit from "./AppPages/SubmitForm/Submit";
import Faq from "./AppPages/FaqPage";
import PrivacyPolicy from "./AppPages/PrivacyPolicyPage";
import Terms from "./AppPages/TermsPage";
import Layout from "./AppPages/LandingPage/Layout";
import Contactus from "./AppPages/Contactus";
import LawyerInfo from "./AppPages/LawyerInfo";
import CustomSignIn from "./AppPages/ReusableComponents/CustomSignin";
import CustomSignUp from "./AppPages/ReusableComponents/CustomSignUp";
import Drawer from "./AppPages/ReusableComponents/Drawer";
import styles from "./App.css";
import Sidebar from "./AppPages/ReusableComponents/Sidebar";
import ProtectedRoute from "./AppPages/ReusableComponents/ProtectedRoute";
import UnauthorizedPage from "./AppPages/ReusableComponents/Unauthorized";

function App() {
  const location = useLocation();
  console.log(location);
  const [input, setInput] = useState("");
  const [customers, setCustomers] = useState([]);
  return (
    <div>
      
      <Routes>
        
        <Route path="/" element={<Layout />}>
          <Route index element={<MainLandingpage />} />
          <Route path="faq" element={<Faq />} />
          <Route path="privacypolicy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="contactus" element={<Contactus />} />
          <Route path="/signin" element={<CustomSignIn />} />
            <Route path="/signup" element={<CustomSignUp />} />
        </Route>
        <Route element={<Sidebar />}>
          <Route path="Case" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="Landingpage" element={<ProtectedRoute><LandingPage /></ProtectedRoute>} />
          {/* <Route path="AddNewCase" element={<AddNewCase />} /> */}
          
          {/* <Route path="Lawyer" element={<LawyerInfo />} /> */}
          <Route
            path="Lawyer"
            element={
              <ProtectedRoute allowedGroups={["Admin"]}>
                <LawyerInfo />
              </ProtectedRoute>
            }
          />
          <Route path="/Unauthorized" element={<UnauthorizedPage />}/>
        </Route>
        
        
      </Routes>
    </div>
  );
}

export default App;
