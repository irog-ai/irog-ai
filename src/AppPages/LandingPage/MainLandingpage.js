import React, { useEffect, useState } from "react";
import { Storage } from "aws-amplify";
import mainStylesheet from "../../Styles/main.css";

function MainLandingPage() {
    useEffect(() => {
        document.title = 'irog.ai — Revolutionize your interrogatory workflow';

        let initialDelayTimeout;
        let displayMessageTimeout;
        let displayWritingTimeout;
        let preResetTimeout;
        let removeMessageTimeout;
        let waitForResetTimeout;
        let resetMessageSequenceTimeout;

        const clockElement = document.getElementById('hero--phone-screen-header-clock').querySelector('span');

        updateClock();
        let updateClockInterval = setInterval(updateClock, 10000)

        function updateClock()
        {
            const now = new Date();
            const hours = now.getHours() % 12 || 12;
            const minutes = (now.getMinutes() + "").padStart(2, '0');
            clockElement.textContent = `${hours}:${minutes}`;
        }

        const messageElements = document.getElementsByClassName('hero--phone-message');
        const writingElement = document.getElementById('hero--phone-message-writing');
        const wordsPerSecond = 400 / 60; // 400
        const baseMessageDelay = 1000; // 1000
        const writingDelay = 1000; // 1500
        const initialDelay = 10;
        const preResetDelay = 2000;

        startMessageSequence();

        function startMessageSequence()
        {
            initialDelayTimeout = setTimeout(displayMessage, initialDelay);
        }

        function resetMessageSequence()
        {
            for (let element of messageElements)
            {
                element.classList.remove('animation-disabled');
            }

            startMessageSequence();
        }

        function displayMessage()
        {
            for (let element of messageElements)
            {
                if (!element.classList.contains('hero--phone-message-visible'))
                {
                    let numWords = element.textContent.replace(/\s+/g,' ').trim().split(' ').length;
                    // console.log('words: ' + numWords);
                    let delay = baseMessageDelay + (numWords / wordsPerSecond) * 1000;
                    if (element.classList.contains('hero--phone-message-assistant'))
                    {
                        // AI assistant message
                        if (writingElement.classList.contains('hero--phone-message-writing-visible'))
                        {
                            writingElement.classList.remove('hero--phone-message-writing-visible');
                            element.classList.add('hero--phone-message-visible');
                            delay = Math.max(delay - writingDelay, 0);
                            // console.log("waiting for " + delay + "ms");
                            displayMessageTimeout = setTimeout(displayMessage, delay);
                        }
                        else
                        {
                            displayWritingIndicator();
                        }
                    }
                    else
                    {
                        // client message
                        writingElement.classList.remove('hero--phone-message-writing-visible');
                        element.classList.add('hero--phone-message-visible');
                        // console.log("waiting for " + delay + "ms");
                        displayMessageTimeout = setTimeout(displayMessage, delay);
                    }

                    return;
                }
            }

            removeAllMessages();
        }

        function displayWritingIndicator()
        {
            writingElement.classList.add('hero--phone-message-writing-visible');
            // console.log("waiting for " + writingDelay + "ms");
            displayWritingTimeout = setTimeout(function(){displayMessage();}, writingDelay);
        }

        function removeAllMessages()
        {
            preResetTimeout = setTimeout(removeMessage, preResetDelay);
        }

        function removeMessage()
        {
            for (let element of messageElements)
            {
                if (!element.classList.contains('hero--phone-message-removed'))
                {
                    element.classList.add('hero--phone-message-removed');
                    removeMessageTimeout = setTimeout(removeMessage, 25);

                    return;
                }
            }

            // wait for transitions to complete
            // then reset
            waitForResetTimeout = setTimeout(waitForReset, 500);
        }

        function waitForReset()
        {
            for (let element of messageElements)
            {
                element.classList.add('animation-disabled');
                element.classList.remove('hero--phone-message-visible');
                element.classList.remove('hero--phone-message-removed');
            }
            resetMessageSequenceTimeout = setTimeout(resetMessageSequence, 50);
        }


        /* header transitions */
        const clearHeaderElement = document.getElementsByClassName("clear-header-target")[0];
        const headers = document.querySelectorAll(".header");
        const headerShadow = document.getElementById("page-header--shadow");
        const headerBackground = document.getElementById("page-header--background");
        const headerHeight = document.getElementById("page-header").offsetHeight;

        /* parallax */
        const parallaxElements = document.querySelectorAll(".parallax");
        let parallaxMultipliers = [];
        const fadeStart = 0.6;
        const fadeEnd = 1.0;

        /* on first view transitions */
        const viewTransitionElements = document.querySelectorAll('[data-remove-on-view]');


        for (let i = 0; i < parallaxElements.length; i++)
        {
            parallaxMultipliers.push(parallaxElements[i].getAttribute("data-parallaxmultiplier"));
        }

        updateScrollElements();



        window.addEventListener("scroll", function(){updateScrollElements();});
        window.addEventListener("resize", function(){updateScrollElements();});

        // todo: replace this with something better
        setTimeout(function(){
            headerShadow.classList.add("header-transitions");
            headerBackground.classList.add("header-transitions");
        }, 50);

        function updateScrollElements()
        {
            const scroll = window.scrollY;

            for (let i = 0; i < parallaxElements.length; i++)
            {
                if (parallaxMultipliers[i] !== 1)
                {
                    parallaxElements[i].style.transform = "translate3d(0px, " + -(scroll * parallaxMultipliers[i]) + "px, 0px)";
                }

                let fadeStartPx = clearHeaderElement.offsetHeight * fadeStart;
                let fadeDiffPx = clearHeaderElement.offsetHeight * fadeEnd - fadeStartPx;
                let opacity = 1.0 - clamp((scroll - fadeStartPx) / fadeDiffPx, 0.0, 1.0);
                parallaxElements[i].style.opacity = opacity;
            }

            if (clearHeaderElement !== undefined)
            {
                if (scroll >= clearHeaderElement.offsetHeight - headerHeight)
                {
                    for (let j = 0; j < headers.length; j++)
                    {
                        headers[j].classList.remove("clear-header");
                    }
                }
                else
                {
                    for (let j = 0; j < headers.length; j++)
                    {
                        headers[j].classList.add("clear-header");
                    }
                }
            }
            else
            {
                for (let i = 0; i < headers.length; i++)
                {
                    headers[i].classList.remove("clear-header");
                }
            }

            for (let i = 0; i < viewTransitionElements.length; i++)
            {
                const rect = viewTransitionElements[i].getBoundingClientRect();
                if (window.innerHeight > rect.top + 50)
                {
                    const removeClass = viewTransitionElements[i].dataset.removeOnView;
                    viewTransitionElements[i].classList.remove(removeClass);
                }
            }
        }

        function clamp(number, min, max) {
            return Math.max(min, Math.min(number, max));
        }

        return () => {
            clearInterval(updateClockInterval);
            clearTimeout(initialDelayTimeout);
            clearTimeout(displayMessageTimeout);
            clearTimeout(displayWritingTimeout);
            clearTimeout(preResetTimeout);
            clearTimeout(removeMessageTimeout);
            clearTimeout(waitForResetTimeout);
            clearTimeout(resetMessageSequenceTimeout);
        };
    });

  return (
      <>
          <section
              id="hero"
              className="clear-header-target hero--on-view hero--pre-view"
              data-remove-on-view="hero--pre-view"
          >
              <div
                  id="hero--background"
                  className="parallax"
                  data-parallaxmultiplier="-0.9"
              />
              <div id="hero--inner-container">
                  <div id="hero--text" className="parallax" data-parallaxmultiplier="-0.3">
                      <h1 id="hero--text--header">
                          Revolutionize your interrogatory workflow.
                      </h1>
                      <p id="hero--text--subheader">Harness the power of AI.</p>
                      <p id="hero-cta">
                          <a>
                              <span>Get started</span>
                          </a>
                      </p>
                  </div>
                  <div
                      id="hero--phone-container"
                      className="parallax"
                      data-parallaxmultiplier="-0.6"
                  >
                      <div id="hero--phone">
                          <div id="hero--phone-screen">
                              <div id="hero--phone-screen-messages">
                                  <div className="hero--phone-message hero--phone-message-assistant">
                                      <div className="hero--phone-message-bubble">
                                          <div className="hero--phone-message-bubble-tail" />
                                          <span className="hero--phone-message-bubble-text">
                    Hello! I am a virtual assistant working on behalf of your
                    attorney, John Smith. I will be asking you some questions.
                    Are you ready to begin?
                  </span>
                                      </div>
                                  </div>
                                  <div className="hero--phone-message hero--phone-message-client">
                                      <div className="hero--phone-message-bubble">
                                          <div className="hero--phone-message-bubble-tail" />
                                          <span className="hero--phone-message-bubble-text">Yes</span>
                                      </div>
                                  </div>
                                  <div className="hero--phone-message hero--phone-message-assistant">
                                      <div className="hero--phone-message-bubble">
                                          <div className="hero--phone-message-bubble-tail" />
                                          <span className="hero--phone-message-bubble-text">
                    Great! Let me know if I can help you at any time.
                    <br />
                    <br />
                    Please tell me your name, address, social security number,
                    date and place of birth, and your driver's license number.
                  </span>
                                      </div>
                                  </div>
                                  <div className="hero--phone-message hero--phone-message-client">
                                      <div className="hero--phone-message-bubble">
                                          <div className="hero--phone-message-bubble-tail" />
                                          <span className="hero--phone-message-bubble-text">
                    My name is Jane Doe. My social security number is
                    123-45-6789. I was born on Jan 1, 1900 in Washington, DC. My
                    driver's license number is A123456789012.
                  </span>
                                      </div>
                                  </div>
                                  <div className="hero--phone-message hero--phone-message-assistant">
                                      <div className="hero--phone-message-bubble">
                                          <div className="hero--phone-message-bubble-tail" />
                                          <span className="hero--phone-message-bubble-text">
                    Can you please explain exactly what the defendant did or did
                    not do that you believe caused the accident, in a way that
                    anyone can understand?
                  </span>
                                      </div>
                                  </div>
                                  <div className="hero--phone-message hero--phone-message-client">
                                      <div className="hero--phone-message-bubble">
                                          <div className="hero--phone-message-bubble-tail" />
                                          <span className="hero--phone-message-bubble-text">
                    I was driving through the intersection of Connecticut Ave
                    and Macomb St when the defendant struck me from the side. I
                    had passed through a green light, so I know I had the right
                    of way.
                  </span>
                                      </div>
                                  </div>
                                  <div className="hero--phone-message hero--phone-message-assistant">
                                      <div className="hero--phone-message-bubble">
                                          <div className="hero--phone-message-bubble-tail" />
                                          <span className="hero--phone-message-bubble-text">
                    Can you provide the names, addresses, phone numbers, and any
                    other contact information of people who may have heard the
                    Defendant talk about the incident mentioned in the
                    Complaint? And can you share what they heard the Defendant
                    say about it?
                  </span>
                                      </div>
                                  </div>
                                  <div className="hero--phone-message hero--phone-message-client">
                                      <div className="hero--phone-message-bubble">
                                          <div className="hero--phone-message-bubble-tail" />
                                          <span className="hero--phone-message-bubble-text">
                    [Client message]
                  </span>
                                      </div>
                                  </div>
                                  <div className="hero--phone-message hero--phone-message-assistant">
                                      <div className="hero--phone-message-bubble">
                                          <div className="hero--phone-message-bubble-tail" />
                                          <span className="hero--phone-message-bubble-text">
                    That's all the questions answered! The information you
                    provided has been sent to your attorney, John Smith. Thank
                    you!
                  </span>
                                      </div>
                                  </div>
                                  <div id="hero--phone-message-writing">
                                      <div id="hero--phone-message-writing-bubble">
                                          <div id="hero--phone-message-writing-tail-large" />
                                          <div id="hero--phone-message-writing-tail-small" />
                                          <div
                                              className="hero--phone-message-writing-dot"
                                              id="hero--phone-message-writing-dot-1"
                                          />
                                          <div
                                              className="hero--phone-message-writing-dot"
                                              id="hero--phone-message-writing-dot-2"
                                          />
                                          <div
                                              className="hero--phone-message-writing-dot"
                                              id="hero--phone-message-writing-dot-3"
                                          />
                                      </div>
                                  </div>
                              </div>
                              <div id="hero--phone-screen-header">
                                  <div id="hero--phone-screen-header-blur" />
                                  <div id="hero--phone-screen-header-clock">
                                      <span>––:––</span>
                                  </div>
                                  <div id="hero--phone-screen-header-icons">
                                      <svg
                                          height={0}
                                          viewBox="0 0 77.409 14.186"
                                          xmlns="http://www.w3.org/2000/svg"
                                      >
                                          <g transform="translate(-36 -77.044)">
                                              <path
                                                  style={{ fill: "#000", strokeWidth: ".123406" }}
                                                  d="M36 87.204h4.313v4.026H36z"
                                              />
                                              <path
                                                  style={{ fill: "#000", strokeWidth: ".169081" }}
                                                  d="M41.837 83.672h4.313v7.558h-4.313z"
                                              />
                                              <path
                                                  style={{ fill: "#000", strokeWidth: ".206843" }}
                                                  d="M47.674 79.919h4.313V91.23h-4.313z"
                                              />
                                              <path
                                                  style={{ fill: "#000", strokeWidth: ".23026" }}
                                                  d="M53.511 77.213h4.313V91.23h-4.313z"
                                              />
                                              <path
                                                  style={{ fill: "#000", strokeWidth: ".197419" }}
                                                  d="M72.387 77.044a14.087 14.087 0 0 0-9.954 4.133l2.227 2.227a10.929 10.929 0 0 1 7.727-3.201 10.929 10.929 0 0 1 7.728 3.2l2.227-2.226a14.087 14.087 0 0 0-9.955-4.133Z"
                                              />
                                              <path
                                                  style={{ fill: "#000", strokeWidth: ".131908" }}
                                                  d="M72.387 81.719a9.413 9.413 0 0 0-6.65 2.761l2.233 2.234a6.254 6.254 0 0 1 4.417-1.837 6.254 6.254 0 0 1 4.423 1.832l2.228-2.229a9.413 9.413 0 0 0-6.65-2.761z"
                                              />
                                              <path
                                                  style={{ fill: "#000", strokeWidth: ".0646262" }}
                                                  d="M72.387 86.52a4.612 4.612 0 0 0-3.258 1.353l3.258 3.258 3.26-3.26a4.612 4.612 0 0 0-3.26-1.351z"
                                              />
                                              <path
                                                  style={{ fill: "#000", strokeWidth: ".184699" }}
                                                  d="M88.118 78.068c-.788 0-1.423.611-1.423 1.37v9.096c0 .76.635 1.37 1.423 1.37h23.042c.788 0 1.422-.61 1.422-1.37v-9.096c0-.759-.634-1.37-1.422-1.37zm.41.456h22.221c.76 0 1.372.563 1.372 1.264v8.387c0 .7-.612 1.265-1.372 1.265H88.527c-.76 0-1.371-.564-1.371-1.265v-8.387c0-.7.611-1.264 1.371-1.264z"
                                              />
                                              <rect
                                                  style={{ fill: "#000", strokeWidth: ".158225" }}
                                                  width="23.584"
                                                  height="9.535"
                                                  x="87.846"
                                                  y="79.214"
                                                  rx="1.296"
                                                  ry="1.104"
                                              />
                                              <path
                                                  style={{ fill: "#000", strokeWidth: ".243669" }}
                                                  d="M112.306 82.428h1.103v3.032h-1.103z"
                                              />
                                          </g>
                                      </svg>
                                  </div>
                                  <div id="hero--phone-screen-header-dynamic-island" />
                                  <div id="hero--phone-screen-header-picture" />
                                  <div id="hero--phone-screen-header-name">
                                      <span>irog.ai assistant</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div id="hero--phone-border"></div>
                  </div>
              </div>
          </section>
          <div id="page-content-container">
          <section id="fp--process">
              <div className="page-content">
                  <h2 id="fp--process-header">
                      Your interrogatories, <span className="gradient-text">simplified.</span>
                  </h2>
                  <ol id="fp--process-steps">
                      <li className="fp--process-step fp--process-step--user">
                          <div
                              className="fp--process-step--container on-view pre-view"
                              data-remove-on-view="pre-view"
                          >
                              <div className="fp--process-step--text-box">
                                  <h3 className="fp--process-step--header">Upload documents</h3>
                                  <p className="fp--process-step--text">
                                      Use our intuitive dashboard to upload your client's
                                      Interrogatory and Notice of Service documents.
                                  </p>
                              </div>
                              <div className="fp--process-branch" />
                          </div>
                          <div className="fp--process-trunk" />
                      </li>
                      <li className="fp--process-step fp--process-step--irog">
                          <div
                              className="fp--process-step--container on-view pre-view"
                              data-remove-on-view="pre-view"
                          >
                              <div className="fp--process-step--text-box">
                                  <h3 className="fp--process-step--header">
                                      AI-powered processing
                                  </h3>
                                  <p className="fp--process-step--text">
                                      Cutting edge AI technology reads your documents, extracts the
                                      necessary information, and translates interrogatories into
                                      plain, legalese-free English—all in seconds.
                                  </p>
                              </div>
                              <div className="fp--process-branch" />
                          </div>
                          <div className="fp--process-trunk" />
                      </li>
                      <li className="fp--process-step fp--process-step--user">
                          <div
                              className="fp--process-step--container on-view pre-view"
                              data-remove-on-view="pre-view"
                          >
                              <div className="fp--process-step--text-box">
                                  <h3 className="fp--process-step--header">
                                      Approve interrogatories
                                  </h3>
                                  <p className="fp--process-step--text">
                                      Select the interrogatories to send to your client and the
                                      communication method you'd like us to use—text, web, or
                                      both—then sit back and let us do the rest.
                                  </p>
                              </div>
                              <div className="fp--process-branch" />
                          </div>
                          <div className="fp--process-trunk" />
                      </li>
                      <li className="fp--process-step fp--process-step--irog">
                          <div
                              className="fp--process-step--container on-view pre-view"
                              data-remove-on-view="pre-view"
                          >
                              <div className="fp--process-step--text-box">
                                  <h3 className="fp--process-step--header">Send interrogatories to client</h3>
                                  <p className="fp--process-step--text">
                                      Our AI-powered assistant will reach out to your client to
                                      retrieve the answers to their interrogatories, communicating
                                      with accessible natural language and performing comprehensive
                                      tests to ensure your client's answers are relevant and complete.
                                  </p>
                                  <p className="fp--process-step--text">
                                      When our AI assistant has collected all of your client's
                                      answers, we'll let you know.
                                  </p>
                              </div>
                              <div className="fp--process-branch" />
                          </div>
                          <div className="fp--process-trunk" />
                      </li>
                      <li className="fp--process-step fp--process-step--user">
                          <div
                              className="fp--process-step--container on-view pre-view"
                              data-remove-on-view="pre-view"
                          >
                              <div className="fp--process-step--text-box">
                                  <h3 className="fp--process-step--header">Receive answers</h3>
                                  <p className="fp--process-step--text">
                                      Look over your client's answers side-by-side with the original
                                      and plain English interrogatories to ensure everything looks
                                      good. Then, with the click of a button, request the completed
                                      Answer and Notice of Service documents.
                                  </p>
                              </div>
                              <div className="fp--process-branch" />
                          </div>
                          <div className="fp--process-trunk" />
                      </li>
                      <li className="fp--process-step fp--process-step--irog">
                          <div
                              className="fp--process-step--container on-view pre-view"
                              data-remove-on-view="pre-view"
                          >
                              <div className="fp--process-step--text-box">
                                  <h3 className="fp--process-step--header">
                                      Automatic document generation
                                  </h3>
                                  <p className="fp--process-step--text">
                                      Our software automatically compiles all the extracted
                                      information and the unmodified interrogatories paired with your
                                      client's answers, and formats it according to legal standards to
                                      produce a document that is ready to send.
                                  </p>
                              </div>
                              <div className="fp--process-branch" />
                          </div>
                          <div className="fp--process-trunk" />
                      </li>
                      <li className="fp--process-step fp--process-step--relax">
                          <div
                              className="fp--process-step--container on-view pre-view"
                              data-remove-on-view="pre-view"
                          >
                              <div className="fp--process-step--text-box">
                                  <h3 className="fp--process-step--header">
                                      <span className="gradient-text">Relax</span>
                                  </h3>
                                  <p className="fp--process-step--text">
                                      ...with all the time you've saved.
                                  </p>
                              </div>
                          </div>
                          <div className="fp--process-branch" />
                          <div className="fp--process-trunk" />
                      </li>
                  </ol>
              </div>
          </section>
          </div>
      </>

  );
}

export default MainLandingPage;
