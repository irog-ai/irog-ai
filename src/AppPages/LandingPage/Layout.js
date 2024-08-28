import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import { Auth } from "aws-amplify";
import CustomAuth from "../ReusableComponents/CustomSignin"; // Ensure the CustomAuth component is in the right path
import AccountCircle from "@mui/icons-material/AccountCircle";
import logo from "./irog-logo1.png";

const Layout = () => {
  const [scrolled, setScrolled] = useState(false);
  const [selectedButton, setSelectedButton] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const open = Boolean(anchorEl);

  useEffect(() => {
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

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const imgStyle = {
    width: "150px",
    height: "30px",
    marginLeft: "10px",
    filter: isHovered ? "brightness(0.8)" : "brightness(1)",
    transition: "filter 0.3s",
  };

  const checkUserSession = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      console.log(user);
      return user;
    } catch (error) {
      console.log("User is not signed in", error);
      return null;
    }
  };

  const handleLoginButtonClick = () => {
    if (user) {
      setAnchorEl(null);
      handleButtonClick("login", "/Landingpage");
    } else {
      setShowAuthDialog(true);
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await Auth.signOut();
      setUser(null);
      setAnchorEl(null);
      navigate("/");
    } catch (error) {
      console.error("Error logging out: ", error);
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
            <img
              src={logo}
              alt="Image from public"
              style={imgStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            sx={{
              border: selectedButton === "home" ? "1px solid white" : "none",
              borderRadius: "5px",
              margin: "15px",
              transition: "filter 0.3s", // Smooth transition for the hover effect
              "&:hover": {
                filter: "brightness(0.8)",
              },
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
              transition: "filter 0.3s", // Smooth transition for the hover effect
              "&:hover": {
                filter: "brightness(0.8)",
              },
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
              transition: "filter 0.3s", // Smooth transition for the hover effect
              "&:hover": {
                filter: "brightness(0.8)",
              },
            }}
            onClick={() => handleButtonClick("contactus", "/Contactus")}
            color="inherit"
          >
            CONTACT US
          </Button>
          {user ? (
            <>
              {/* <IconButton
                onClick={handleMenuClick}
                color="inherit"
                sx={{
                  border: selectedButton === "login" ? "1px solid white" : "none",
                  borderRadius: "5px",
                  //margin: "15px",
                }}
              >
                <AccountCircle />
                {user.attributes.given_name + " " + user.attributes.family_name}
              </IconButton> */}
              <Button
                onClick={handleMenuClick}
                color="inherit"
                sx={{
                  border:
                    selectedButton === "login" ? "1px solid white" : "none",
                  borderRadius: "5px",
                  margin: "15px",
                  transition: "filter 0.3s", // Smooth transition for the hover effect
                  "&:hover": {
                    filter: "brightness(0.8)",
                  },
                }}
                startIcon={<AccountCircle />}
              >
                {user.attributes.given_name + " " + user.attributes.family_name}
              </Button>
              <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                <MenuItem onClick={handleLoginButtonClick}>Dashboard</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              sx={{
                border: selectedButton === "login" ? "1px solid white" : "none",
                borderRadius: "5px",
                margin: "15px",
              }}
              onClick={handleLoginButtonClick}
              color="inherit"
            >
              LOGIN
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Outlet />

      {/* CustomAuth Dialog */}
      <CustomAuth
        open={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
      />
    </Box>
  );
};

export default Layout;
