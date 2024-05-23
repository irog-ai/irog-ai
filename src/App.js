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
import Layout from "./AppPages/LandingPage/Layout";
import Contactus from "./AppPages/Contactus";
import LawyerInfo from "./AppPages/LawyerInfo";
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
    <div style={{ display: "flex" }}>
      {/* {!location.pathname.includes('/submit') && (

        <Sidebar signOut={signOut} />
      )}        */}
      {/* <button onClick={LoginButtonClicked}>Login</button> */}

      <Routes>
        {/* <Route path="/" element={<Layout />}>
          <Route path="/" element={<MainLandingpage />} />
          <Route exact path="/Faq" element={<Faq />} />

          <Route exact path="/Contactus" element={<Contactus />} />
        </Route>
        <Route element={<Sidebar />}>
          <Route path="/Case" element={<Home />} />
          <Route exact path="/Home" element={<LandingPage />} />
          <Route exact path="/AddNewCase" element={<AddNewCase />} />
        </Route> */}
        <Route path="/" element={<Layout />}>
          <Route index element={<MainLandingpage />} />
          <Route path="faq" element={<Faq />} />
          <Route path="contactus" element={<Contactus />} />
        </Route>
        <Route element={<Sidebar />}>
          <Route path="Case" element={<Home />} />
          <Route path="Landingpage" element={<LandingPage />} />
          <Route path="AddNewCase" element={<AddNewCase />} />
          {/* <Route path="Lawyer" element={<LawyerInfo />} /> */}
          <Route
            path="Lawyer"
            element={
              <ProtectedRoute allowedGroups={["Admin"]}>
                <LawyerInfo />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="/Unauthorized" element={<UnauthorizedPage />}/>
        <Route exact path="/Submit/:key" element={<Submit />} />
      </Routes>
    </div>
  );
}

export default App;
