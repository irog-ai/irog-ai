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
    window.scrollTo(0, 0);

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

    document.addEventListener('click', hideDropdown);
    window.addEventListener("scroll", handleScroll);
    return () => {
        window.removeEventListener("scroll", handleScroll);
        document.removeEventListener('click', hideDropdown);
    };
  }, [location.pathname]);

  const toggleDropdown = () => {
      const loggedInElement = document.getElementById('page-header--logged-in');
      if (!loggedInElement)
          return;
      if (loggedInElement.classList.contains('dropdown-visible'))
      {
          loggedInElement.classList.remove('dropdown-visible');
      }
      else
      {
          loggedInElement.classList.add('dropdown-visible');
      }
  }

  const hideDropdown = (event) => {
      const loggedInElement = document.getElementById('page-header--logged-in');
      if (!loggedInElement)
          return;
      if (!loggedInElement.contains(event.target))
      {
          if (loggedInElement.classList.contains('dropdown-visible'))
          {
              loggedInElement.classList.remove('dropdown-visible');
          }
      }
  }

  const toggleMenu = () => {
      if (document.querySelector('body').classList.contains('mobile-menu-open'))
      {
          document.querySelector('body').classList.remove('mobile-menu-open')
      }
      else
      {
          document.querySelector('body').classList.add('mobile-menu-open');
      }
  }

  const closeMenu = () => {
      document.querySelector('body').classList.remove('mobile-menu-open')
  }

  const handleButtonClick = (event, buttonName, route) => {
    setSelectedButton(buttonName);
    navigate(route);
    closeMenu();
    if(event!=null)event.preventDefault();
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
      handleButtonClick(null, "login", "/Landingpage");
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
      <>
          <nav id="mobile-menu--container">
              <div id="mobile-menu--header-background"></div>
              <div id="mobile-menu--container-inner">
                  <ul>
                      {user ? (
                          <>
                              <span id="mobile-menu--user-name">{user.attributes.given_name + " " + user.attributes.family_name}</span>
                              <hr/>
                              <li><a onClick={handleLoginButtonClick}>Dashboard</a></li>
                              <li><a onClick={handleLogout}>Log out</a></li>
                          </>
                      ) : (
                          <>
                              <li><a onClick={handleLoginButtonClick}>Log in</a></li>
                          </>
                      )}
                      <hr/>
                      <li><a href="/" onClick={(e) => handleButtonClick(e, "home", "/")}><span>Home</span></a></li>
                      <li><a href="/faq" onClick={(e) => handleButtonClick(e, "faq", "/Faq")}><span>FAQ</span></a></li>
                      <li><a href="/contactus" onClick={(e) => handleButtonClick(e, "contactus", "/Contactus")}><span>Contact Us</span></a></li>
                  </ul>
              </div>
          </nav>
          <div id="page-container">
              <div id="page-overlay" onClick={closeMenu}></div>
              <header id="page-header" className={'header' + (location.pathname === '/' ? ' clear-header' : '')}>
              <div id="page-header--shadow"/>
              <div id="page-header--background"/>
              <div id="page-header--inner-container" class="page-content-container">
                  <div id="page-header--logo">
                      <a href="/"/>
                  </div>
                  <nav id="page-header--nav">
                      <ul id="page-header--nav-desktop">
                          <li>
                              <a href="/"
                                 onClick={(e) => handleButtonClick(e, "home", "/")}
                              >
                                  <span>Home</span>
                              </a>
                          </li>
                          <li>
                              <a href="/faq"
                                 onClick={(e) => handleButtonClick(e, "faq", "/Faq")}
                              >
                                  <span>FAQ</span>
                              </a>
                          </li>
                          <li>
                              <a href="/contactus"
                                 onClick={(e) => handleButtonClick(e, "contactus", "/Contactus")}
                              >
                                  <span>Contact Us</span>
                              </a>
                          </li>
                          {user ? (
                              <>
                                  <li id="page-header--logged-in"
                                    onClick={toggleDropdown}
                                  >
                                      <span>
                                          <div className="profile-circle">
                                              {<AccountCircle/>}
                                          </div>
                                          {user.attributes.given_name + " " + user.attributes.family_name}
                                      </span>
                                      <div id="page-header--account-dropdown">
                                          <div id="page-header--account-dropdown-arrow"/>
                                          <div id="page-header--account-dropdown-container">
                                              <ul>
                                                  <li>
                                                      <a
                                                          onClick={handleLoginButtonClick}
                                                      >Dashboard</a>
                                                  </li>
                                                  <li>
                                                      <a
                                                          onClick={handleLogout}
                                                      >Log out</a>
                                                  </li>
                                              </ul>
                                          </div>
                                      </div>
                                  </li>

                              </>
                          ) : (
                              <>
                                  <li>
                                      <a
                                          onClick={handleLoginButtonClick}
                                      >
                                          <span>Log In</span>
                                      </a>
                                  </li>
                              </>
                          )}
                      </ul>
                      <div id="page-header--nav-mobile">
                          <button id="page-header--menu-icon" class="page-header--menu-icon-open" onClick={toggleMenu}>
                              <div id="page-header--menu-icon-line-1" class="page-header--menu-icon-line"></div>
                              <div id="page-header--menu-icon-line-2" class="page-header--menu-icon-line"></div>
                              <div id="page-header--menu-icon-line-3" class="page-header--menu-icon-line"></div>
                          </button>
                      </div>
                  </nav>
              </div>
          </header>
          <Outlet context={{ handleLoginButtonClick }} />
          <footer id="page-footer">
              <nav id="footer-nav" class="page-content-container">
                  <ul>
                      <li id="footer-logo"></li>
                      <li><a href="/faq"
                              onClick={(e) =>
                                  handleButtonClick(e, "faq", "/Faq")}
                      >FAQ</a></li>
                      <li><a href="/contactus"
                              onClick={(e) =>
                                  handleButtonClick(e, "contactus", "/Contactus")}
                      >Contact Us</a></li>
                      <li><a href="/privacypolicy"
                              onClick={(e) =>
                                  handleButtonClick(e, "privacypolicy", "/Privacypolicy")}
                      >Privacy Policy</a></li>
                      <li><a href="/terms"
                              onClick={(e) =>
                                  handleButtonClick(e, "terms", "/Terms")}
                      >Terms & Conditions</a></li>
                  </ul>
              </nav>
              <p id="footer-copyright">© 2025 CG Legal Technologies, LLC</p>
          </footer>
          </div>

          {/* CustomAuth Dialog */}
          <CustomAuth
              open={showAuthDialog}
              onClose={() => setShowAuthDialog(false)}
          />
      </>

  );
};

export default Layout;
