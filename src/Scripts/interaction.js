// "use strict";
//
// document.addEventListener("DOMContentLoaded", function()
// {
//     /* navigation */
//     // document.querySelector("#header-mobile-menu-button").addEventListener("click", function(){toggleSlideInNav();});
//     // document.querySelector("#screen-overlay").addEventListener("click", function(){closeSlideInNav();});
//     // const body = document.querySelector("body");
//     // let slideInNavVisible = false;
//     // const slideThreshold = 0.3; // width of screen
//     // const slideInNavMenuItems = document.querySelectorAll("#slide-in-nav ul a");
//     //
//     // let initialX = 0;
//     // let initialY = 0;
//     //
//     // document.querySelector("body").addEventListener("touchstart", function(e){
//     //     initialX = e.touches[0].pageX;
//     //     initialY = e.touches[0].pageY;
//     // }, false)
//     //
//     // document.querySelector("body").addEventListener("touchmove", function(e){
//     //     handleTouchMove(e.touches[0].pageX,e.touches[0].pageY);
//     // }, false)
//     //
//     // function handleTouchMove(x,y)
//     // {
//     //     if (x >= initialX + (window.innerWidth * slideThreshold))
//     //     {
//     //         closeSlideInNav();
//     //     }
//     // }
//     //
//     //
//     // function toggleSlideInNav()
//     // {
//     //     if (body.classList.contains("slide-in-nav-visible"))
//     //     {
//     //         closeSlideInNav();
//     //     }
//     //     else
//     //     {
//     //         openSlideInNav();
//     //     }
//     // }
//     //
//     // function closeSlideInNav()
//     // {
//     //     body.classList.remove("slide-in-nav-visible");
//     //     slideInNavVisible = false;
//     // }
//     //
//     // function openSlideInNav()
//     // {
//     //     body.classList.add("slide-in-nav-visible");
//     //     slideInNavVisible = true;
//     // }
//     //
//     // for (let i = 0; i < slideInNavMenuItems.length; i++)
//     // {
//     //     slideInNavMenuItems[i].addEventListener("click", function()
//     //     {
//     //         if (this.getAttribute("href").includes("#"))
//     //         {
//     //             closeSlideInNav();
//     //         }
//     //     });
//     // }
//     /* account dropdown box */
//     const loggedInElement = document.getElementById('page-header--logged-in');
//     loggedInElement.addEventListener('click', function()
//     {
//         if (loggedInElement.classList.contains('dropdown-visible'))
//         {
//             loggedInElement.classList.remove('dropdown-visible');
//         }
//         else
//         {
//             loggedInElement.classList.add('dropdown-visible');
//         }
//     });
//
//     document.addEventListener('click', function(event) {
//         if (!loggedInElement.contains(event.target))
//         {
//             if (loggedInElement.classList.contains('dropdown-visible'))
//             {
//                 loggedInElement.classList.remove('dropdown-visible');
//             }
//         }
//     });
//
//
//     /* header transitions */
//     const clearHeaderElement = document.getElementsByClassName("clear-header-target")[0];
//     const headers = document.querySelectorAll(".header");
//     const headerShadow = document.getElementById("page-header--shadow");
//     const headerBackground = document.getElementById("page-header--background");
//     const headerHeight = document.getElementById("page-header").offsetHeight;
//
//     /* parallax */
//     const parallaxElements = document.querySelectorAll(".parallax");
//     let parallaxMultipliers = [];
//     const fadeStart = 0.6;
//     const fadeEnd = 1.0;
//
//     /* on first view transitions */
//     const viewTransitionElements = document.querySelectorAll('[data-remove-on-view]');
//
//
//     for (let i = 0; i < parallaxElements.length; i++)
//     {
//         parallaxMultipliers.push(parallaxElements[i].getAttribute("data-parallaxmultiplier"));
//     }
//
//
//     let scrollEventsTriggered = 0;
//     let timeElapsed = 0;
//
//     updateScrollElements();
//
//     // setInterval(function(){
//     //     // timeElapsed += 1000;
//     //     // console.log(`time: ${timeElapsed} ms — scrollEventsTriggered: ${scrollEventsTriggered}`);
//     //     // const sps = scrollEventsTriggered / (timeElapsed / 1000);
//     //     // console.log(`sps: ${sps}`);
//     //     timeElapsed = 1000;
//     //     console.log(`time: ${timeElapsed} ms - scrollEventsTriggered: ${scrollEventsTriggered}`);
//     //     const sps = scrollEventsTriggered / (timeElapsed / 1000);
//     //     // console.log(`sps: ${sps}`);
//     //     scrollEventsTriggered = 0;
//     // }, 1000);
//
//
//     // const times = [];
//     // let fps;
//     // let lastWindowScrollY = window.scrollY;
//     //
//     // function refreshLoop() {
//     //     window.requestAnimationFrame(() => {
//     //         // if (lastWindowScrollY !== window.scrollY)
//     //         // {
//     //         //     updateScrollElements();
//     //         //     lastWindowScrollY = window.scrollY;
//     //         // }
//     //
//     //         const now = performance.now();
//     //         while (times.length > 0 && times[0] <= now - 1000) {
//     //             times.shift();
//     //         }
//     //         times.push(now);
//     //         fps = times.length;
//     //         refreshLoop();
//     //     });
//     // }
//     //
//     // refreshLoop();
//     // setInterval(function(){console.log(`fps: ${fps}`);}, 1000);
//
//
//
//     window.addEventListener("scroll", function(){updateScrollElements();});
//     window.addEventListener("resize", function(){updateScrollElements();});
//
//     // todo: replace this with something better
//     setTimeout(function(){
//         headerShadow.classList.add("header-transitions");
//         headerBackground.classList.add("header-transitions");
//     }, 50);
//
//     function updateScrollElements()
//     {
//         scrollEventsTriggered++;
//         const scroll = window.scrollY;
//
//         for (let i = 0; i < parallaxElements.length; i++)
//         {
//             if (parallaxMultipliers[i] !== 1)
//             {
//                 parallaxElements[i].style.transform = "translate3d(0px, " + -(scroll * parallaxMultipliers[i]) + "px, 0px)";
//             }
//
//             let fadeStartPx = clearHeaderElement.offsetHeight * fadeStart;
//             let fadeDiffPx = clearHeaderElement.offsetHeight * fadeEnd - fadeStartPx;
//             let opacity = 1.0 - clamp((scroll - fadeStartPx) / fadeDiffPx, 0.0, 1.0);
//             parallaxElements[i].style.opacity = opacity;
//         }
//
//         if (clearHeaderElement !== null)
//         {
//             if (scroll >= clearHeaderElement.offsetHeight - headerHeight)
//             {
//                 for (let j = 0; j < headers.length; j++)
//                 {
//                     headers[j].classList.remove("clear-header");
//                 }
//             }
//             else
//             {
//                 for (let j = 0; j < headers.length; j++)
//                 {
//                     headers[j].classList.add("clear-header");
//                 }
//             }
//         }
//         else
//         {
//             for (let i = 0; i < headers.length; i++)
//             {
//                 headers[i].classList.remove("clear-header");
//             }
//         }
//
//         for (let i = 0; i < viewTransitionElements.length; i++)
//         {
//             const rect = viewTransitionElements[i].getBoundingClientRect();
//             if (window.innerHeight > rect.top + 50)
//             {
//                 const removeClass = viewTransitionElements[i].dataset.removeOnView;
//                 viewTransitionElements[i].classList.remove(removeClass);
//             }
//         }
//     }
//
//     function clamp(number, min, max) {
//         return Math.max(min, Math.min(number, max));
//     }
//
//
//
//
//     /* fading image slideshow */
//     // const slideshowElements = document.querySelectorAll(".slideshow .slide");
//     // const totalSlides = slideshowElements.length;
//     // const transitionInterval = 5000;
//     // let currentSlide = totalSlides - 1;
//     //
//     // if (totalSlides > 1)
//     // {
//     //     setInterval(iterateSlide, transitionInterval);
//     // }
//     //
//     // function iterateSlide()
//     // {
//     //     const previousSlide = currentSlide;
//     //     currentSlide = (currentSlide >= totalSlides - 1) ? 0 : ++currentSlide;
//     //
//     //     // modify classes
//     //     for (let i = 0; i < totalSlides; i++)
//     //     {
//     //         if (i === currentSlide)
//     //         {
//     //             slideshowElements[i].classList.remove("slide-previous");
//     //             slideshowElements[i].classList.remove("slide-hidden");
//     //             slideshowElements[i].classList.add("slide-active");
//     //         }
//     //         else if (i === previousSlide)
//     //         {
//     //             slideshowElements[i].classList.remove("slide-active");
//     //             slideshowElements[i].classList.remove("slide-hidden");
//     //             slideshowElements[i].classList.add("slide-previous");
//     //         }
//     //         else
//     //         {
//     //             slideshowElements[i].classList.remove("slide-active");
//     //             slideshowElements[i].classList.remove("slide-previous");
//     //             slideshowElements[i].classList.add("slide-hidden");
//     //         }
//     //     }
//     // }
//
//
// });