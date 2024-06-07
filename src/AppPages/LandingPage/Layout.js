import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { Auth } from "aws-amplify";

const Layout = () => {
  const [scrolled, setScrolled] = useState(false);
  const [selectedButton, setSelectedButton] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Set the selected button based on the current path
    const path = location.pathname.split("/")[1];
    setSelectedButton(path || "home");

    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    const fetchUser = async () => {
      const user = await checkUserSession();
      setUser(user);
    };

    fetchUser();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const handleButtonClick = (buttonName, route) => {
    setSelectedButton(buttonName);
    navigate(route);
  };

  const checkUserSession = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      return user;
    } catch (error) {
      console.log("User is not signed in", error);
      return null;
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: scrolled ? "rgba(76, 101, 150, 0.4)" : "#2c4376",
          transition: "background-color 0.3s",
          boxShadow: "none",
        }}
      >
        <Toolbar>
          <Button
            variant="text"
            style={{ color: "white", fontSize: "large" }}
            onClick={() => handleButtonClick("home", "/")}
          >
            CG TECHNOLOGIES
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            sx={{
              border: selectedButton === "home" ? "1px solid white" : "none",
              borderRadius: "5px",
              margin: "15px",
            }}
            onClick={() => handleButtonClick("home", "/")}
            color="inherit"
          >
            HOME
          </Button>
          <Button
            sx={{
              border: selectedButton === "faq" ? "1px solid white" : "none",
              borderRadius: "5px",
              margin: "15px",
            }}
            onClick={() => handleButtonClick("faq", "/Faq")}
            color="inherit"
          >
            FAQ
          </Button>
          <Button
            sx={{
              border:
                selectedButton === "contactus" ? "1px solid white" : "none",
              borderRadius: "5px",
              margin: "15px",
            }}
            onClick={() => handleButtonClick("contactus", "/Contactus")}
            color="inherit"
          >
            CONTACT US
          </Button>
          <Button
            sx={{
              border: selectedButton === "login" ? "1px solid white" : "none",
              borderRadius: "5px",
              margin: "15px",
            }}
            onClick={() => handleButtonClick("login", "/Landingpage")}
            color="inherit"
          >
            {user ? (
              <p>Welcome, {user.username} - Go to App</p>
            ) : (
              <p>LOGIN</p>
            )}
          </Button>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Outlet />
    </Box>
  );
};

export default Layout;
