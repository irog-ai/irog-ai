import React, { useEffect, useState } from "react";
import myImage from "../../Images/AppHomeImage.JPG";
import "@fontsource/catamaran";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Box,
  Button,
} from "@mui/material";
import { styled } from "@mui/system";

const Banner = styled("div")(({ theme }) => ({
  height: "600px",
  //backgroundImage: 'url("https://via.placeholder.com/1400x300")', // Replace with your image URL
  backgroundSize: "cover",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
  fontSize: "2rem",
  backgroundColor: "#2c4376",
}));

const sectionStyle = {
  padding: "40px",
  backgroundColor: "#ffffff",
  margin: "20px 0",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
};

function MainLandingPage() {
  // const [scrolled, setScrolled] = useState(false);
  // const [selectedButton, setSelectedButton] = useState("home");
  // const navigate = useNavigate();

  // const handleHomeButtonClick = () => {
  //   navigate("/");
  // };

  // const handleFaqButtonClick= () => {
  //   setSelectedButton("faq");
  //   navigate("/faq");
  // }

  // const handleButtonClick = (buttonName) => {
  //   setSelectedButton(buttonName);
  // };

  // const handleScroll = () => {
  //   const offset = window.scrollY;
  //   if (offset > 100) {
  //     setScrolled(true);
  //   } else {
  //     setScrolled(false);
  //   }
  // };

  // useEffect(() => {
  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Navigation Bar */}
      {/* <AppBar
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
            onClick={handleHomeButtonClick}
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
            onClick={() => handleHomeButtonClick("home")}
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
            onClick={() => handleFaqButtonClick("faq")}
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
            onClick={() => handleButtonClick("contactus")}
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
            onClick={() => handleButtonClick("login")}
            color="inherit"
          >
            LOGIN
          </Button>
        </Toolbar>
      </AppBar> */}

      {/* Banner */}
      <Banner>
        {/* <Typography variant="h3">Welcome to CG LLC TECHNOLOGIES</Typography> */}
        <Grid container spacing={2}>
          <Grid item xs={7}>
            <div style={{ margin: "15%", fontFamily: "Catamaran !important" }}>
              <Typography variant="h2">
                Revolutionizing Your Questionnaire Experience!!{" "}
              </Typography>
              <Typography
                variant="h6"
                style={{ color: "#f4d056", marginTop: "20px" }}
              >
                Let AI Simplify the Process for You
              </Typography>
              <Button
                style={{ verticalAlign: "center", color: "white" }}
                variant="outlined"
              >
                Get Started
              </Button>
              <Typography
                variant="h5"
                style={{
                  fontFamily: "Questrial !important",
                  lineHeight: "32px",
                  fontWeight: "700",
                  fontStyle: "italic",
                  color: "rgb(235, 235, 235)",
                  marginTop: "30px",
                }}
              >
                Get Answers, Anytime, Anywhere - Web or SMS
              </Typography>
            </div>
          </Grid>
          <Grid item xs={5}>
            <img
              src={myImage}
              alt="Image from public"
              style={{ width: "450px", height: "480px", marginTop: "15%" }}
            />
          </Grid>
        </Grid>
      </Banner>

      <Container>
        {/* About Section */}
        <Box sx={{ ...sectionStyle }}>
          <Typography variant="h4" gutterBottom>
            About Us
          </Typography>
          <Typography variant="body1">
            Your support network for navigating life after divorce. We provide a
            community space with resources to help you through every step of the
            way.
          </Typography>
        </Box>

        {/* Features Section */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ ...sectionStyle }}>
              <Typography variant="h5" gutterBottom>
                Community & Support
              </Typography>
              <Typography variant="body1">
                Connect with others who are on a similar journey. Share stories,
                provide support, and build friendships.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ ...sectionStyle }}>
              <Typography variant="h5" gutterBottom>
                Resources
              </Typography>
              <Typography variant="body1">
                Access blogs, podcasts, and articles written by experts. Get the
                support and information you need.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default MainLandingPage;
