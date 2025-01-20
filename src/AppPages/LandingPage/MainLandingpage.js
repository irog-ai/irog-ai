import React, { useEffect, useState } from "react";
import { Storage } from "aws-amplify";
import mainStylesheet from "../../Styles/main.css";
import { useOutletContext } from 'react-router-dom';

function MainLandingPage() {
    const { handleLoginButtonClick } = useOutletContext();

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
        <main>
            <section
                id="hero"
                className="clear-header-target"
            >
                <div
                    id="hero--background"
                    className="parallax"
                    data-parallaxmultiplier="-0.9"
                />
                <div id="hero--inner-container">
                    <div id="hero--text" className="parallax" data-parallaxmultiplier="-0.6">
                        <h1 id="hero--text--header">Revolutionize your interrogatory workflow.</h1>
                        <p id="hero--text--subheader">Turn time-consuming interrogatories into effortless, client-friendly conversations with the help of cutting-edge AI.</p>
                        <p id="hero-cta">
                            <a onClick={handleLoginButtonClick}>
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
            <div className="fp--section-container">
                <section id="fp--process" className="page-content-container max-1200 fp-module">
                    <div id="fp--process-text">
                        <div class="fp--tag">The process</div>
                        <h2>Streamlined from start to finish.</h2>
                        <p>With irog.ai, interrogatories become easy to manage, ensuring every step is efficient, accurate, and stress-free.</p>
                    </div>
                    <ol id="fp--process-steps">
                        <li className="fp--process-step">
                            <div className="fp--process-step--number">1</div>
                            <h3 className="fp--process-step--header">Upload Your Case</h3>
                            <div className="fp--process-step--line"></div>
                            <div className="fp--process-step--text">
                                <p>Use our intuitive dashboard to upload your client's Interrogatory and Notice of Service documents.</p>
                            </div>
                        </li>
                        <li className="fp--process-step">
                            <div className="fp--process-step--number">2</div>
                            <h3 className="fp--process-step--header">AI-Powered Processing</h3>
                            <div className="fp--process-step--line"></div>
                            <div className="fp--process-step--text">
                                <p>Our advanced AI analyzes the documents, extracts key details, and translates complex legal questions into clear, client-friendly language.</p>
                            </div>
                        </li>
                        <li className="fp--process-step">
                            <div className="fp--process-step--number">3</div>
                            <h3 className="fp--process-step--header">Client Collaboration Made Easy</h3>
                            <div className="fp--process-step--line"></div>
                            <div className="fp--process-step--text">
                                <p>Through SMS or web interface, our AI assistant asks your client the simplified questions, checks their responses for accuracy and completeness, and gently guides them to provide the information you need.</p>
                            </div>
                        </li>
                        <li className="fp--process-step">
                            <div className="fp--process-step--number">4</div>
                            <h3 className="fp--process-step--header">Receive Finalized Documents</h3>
                            <div className="fp--process-step--line"></div>
                            <div className="fp--process-step--text">
                                <p>Once your client finishes, irog.ai organizes their responses into professionally formatted answers and generates the necessary documents, ready for your review and submission.</p>
                            </div>
                        </li>
                    </ol>
                </section>
            </div>
            <div className="fp--section-container">
                <section id="fp--benefits" className="page-content-container max-1200 fp-module">
                    <div id="fp--benefits-text" class="max-800">
                        <div className="fp--tag">Benefits</div>
                        <h2>The irog.ai advantage.</h2>
                        <p>Boost efficiency by automating tedious legal tasks.</p>
                    </div>
                    <div id="fp--benefits-blocks">
                        <div className="fp--benefits-block">
                            <h3>Save time</h3>
                            <p>irog.ai automates the time-consuming process of collecting client information, freeing up your team to focus on what matters most &mdash; winning cases.</p>
                        </div>
                        <div className="fp--benefits-block">
                            <h3>Built for scalability</h3>
                            <p>Whether you're handling one client or a hundred, irog.ai adapts to your needs, providing consistent, reliable service at any scale.</p>
                        </div>
                        <div className="fp--benefits-block">
                            <h3>AI-driven accuracy</h3>
                            <p>irog.ai leverages advanced artificial intelligence to extract, organize, and verify data with precision, ensuring your clients' answers align perfectly with legal requirements.</p>
                        </div>
                        <div className="fp--benefits-block">
                            <h3>Empower your clients</h3>
                            <p>With simplified questions and natural language responses, irog.ai empowers your clients to provide accurate answers quickly and easily.</p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
      </>

  );
}

export default MainLandingPage;
