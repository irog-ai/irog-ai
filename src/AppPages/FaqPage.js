import * as React from "react";
import { useEffect, useState } from "react";

export default function Faq() {
  useEffect(() => {
    document.title = 'FAQ — irog.ai';
  });

  return (
      <>
        <section id="faq" className="text-content page-content-container">
          <article>
            <h1>Frequently Asked Questions</h1>

            <section>
              <h3>General Questions</h3>
              <hr/>
              <ol>
                <li>
                  <h4>What is iROG.ai?</h4>
                  <p>iROG.ai is a discovery automation platform designed to streamline the process of preparing and
                    managing interrogatories. It uses AI and SMS technology to save law firms time and improve efficiency,
                    offering tailored solutions through three levels of service: Basic, Context, and Pro. For
                    sophisticated clients who prefer web-based communication over texting, iROG.ai also offers a secure
                    web interface for submitting answers.</p>
                </li>
                <hr/>
                <li>
                  <h4>What are the different levels of iROG.ai, and how do they work?</h4>
                  <ol>
                    <li>
                      <h5>iROG.ai Basic:</h5>
                      <p>Focuses on SMS-based client interaction. It sends clear, targeted text messages to gather factual
                        answers from clients and follows up intelligently to ensure complete responses. A secure web-based
                        interface is also available for clients who prefer not to use texting.</p>
                    </li>
                    <li>
                      <h5>iROG.ai Context:</h5>
                      <p>Adds the ability to upload pleadings and other case materials, such as demand letters,
                        correspondence, and medical records. The AI analyzes these documents to provide context-aware
                        suggested answers to interrogatories before reaching out to clients via SMS or the web
                        interface.</p>
                    </li>
                    <li>
                      <h5>iROG.ai Pro:</h5>
                      <p>Includes all features of Basic and Context and introduces objection generation. iROG.ai Pro can
                        analyze interrogatories and provide AI-drafted objections tailored to the case strategy, which can
                        then be reviewed, refined, and finalized by your team.</p>
                    </li>
                  </ol>
                </li>
                <hr/>
                <li>
                  <h4>Why does iROG.ai use text messaging for client communication?</h4>
                  <p>Studies show that SMS messages have a 98% open rate and are typically read within 3 minutes of receipt.
                    Clients are much more likely to respond to text messages than lengthy emails or calls. However, for
                    clients who prefer an alternative, iROG.ai offers a web-based user interface for submitting responses
                    securely and efficiently.</p>
                </li>
                <hr/>
                <li>
                  <h4>How is information collected from our clients?</h4>
                  <p>After you verify the interrogatories you’d like to send to your client, you have the option of
                    initiating an interaction with your client via text message, a web interface, or both.</p>
                  <ol>
                    <li>
                      <h5>Text Messaging:</h5>
                      <p>Your client will receive a text message from our AI-powered assistant explaining that they’ll be providing
                        information on your behalf. The assistant then asks simplified questions to collect answers to the
                        interrogatories. If the responses are incomplete, the assistant provides feedback, requesting any
                        additional information needed.</p>
                    </li>
                    <li>
                      <h5>Web Interface:</h5>
                      <p>Your client will receive an email inviting them to access a secure web page. The process is similar to
                        text messaging but uses a browser-based interface where the AI assistant guides the client through the
                        interrogatories, offering feedback on relevance and completeness.</p>
                    </li>
                  </ol>
                  <p>You can choose either or both options, depending on what works best for your clients.</p>
                </li>
              </ol>
            </section>
            <hr/>

            <section>
              <h3>iROG.ai Basic: SMS-Only Module</h3>
              <hr/>
              <ol>
                <li>
                  <h4>How does iROG.ai Basic work?</h4>
                  <p>iROG.ai Basic uses SMS technology to collect factual responses from clients. It sends clear, concise text
                    messages to ask specific questions and follows up automatically based on response quality. Sophisticated
                    clients who prefer not to use SMS can access a secure web-based interface to provide their responses.</p>
                </li>
                <hr/>
                <li>
                  <h4>Is iROG.ai Basic suitable for small firms?</h4>
                  <p>Yes. iROG.ai Basic is an excellent solution for firms that prefer to manage other parts of the discovery
                    process internally while leveraging the convenience and efficiency of SMS-based client interaction.</p>
                </li>
                <hr/>
                <li>
                  <h4>How much time can iROG.ai Basic save my firm?</h4>
                  <p>With its automated client communication, iROG.ai Basic can save 2–4 hours per case on average, depending
                    on client responsiveness and the complexity of the interrogatories.</p>
                </li>
                <hr/>

                <h3>iROG.ai Context: Document Upload and Context Analysis</h3>
                <li>
                  <h4>What additional features does iROG.ai Context offer?</h4>
                  <p>iROG.ai Context builds on Basic by allowing firms to upload up to 100 pages of case-related documents,
                    such as pleadings, demand letters, correspondence, and medical records. The AI analyzes these documents to
                    provide context-aware suggested answers to interrogatories before reaching out to the client via SMS or
                    the web interface.</p>
                </li>
                <hr/>
                <li>
                  <h4>How does iROG.ai Context improve the discovery process?</h4>
                  <p>By analyzing case materials first, iROG.ai Context can generate suggested answers to many questions,
                    reducing the need for client follow-ups. This saves time and ensures more complete, accurate responses.</p>
                </li>
                <hr/>
                <li>
                  <h4>Can iROG.ai Context help reduce follow-up communication with clients?</h4>
                  <p>Yes. With iROG.ai Context, the AI answers as many questions as possible from the uploaded materials,
                    minimizing the need for SMS or web follow-ups to clients. This reduces back-and-forth and speeds up the
                    discovery process.</p>
                </li>
              </ol>
            </section>
            <hr/>

            <section>
              <h3>iROG.ai Pro: Objection Generation</h3>
              <hr/>
              <ol>
                <li>
                  <h4>What makes iROG.ai Pro unique?</h4>
                  <p>iROG.ai Pro includes all the features of Basic and Context while adding advanced objection-generation
                    capabilities. The AI analyzes interrogatories and drafts objections tailored to your chosen
                    strategy—whether neutral, balanced, or comprehensive. These objections can then be reviewed, refined, and
                    finalized by your team.</p>
                </li>
                <hr/>
                <li>
                  <h4>How are objections tailored to my firm’s strategy?</h4>
                  <p>iROG.ai Pro allows you to select the tone of objections, ranging from neutral and concise to assertive and
                    comprehensive. This ensures objections align with your case needs and jurisdictional requirements.</p>
                </li>
                <hr/>
                <li>
                  <h4>How much time can iROG.ai Pro save my firm?</h4>
                  <p>With objection automation and enhanced client communication, iROG.ai Pro can save 5–9 hours per case,
                    depending on complexity and the number of interrogatories.</p>
                </li>
              </ol>
            </section>
            <hr/>

            <section>
              <h3>Common Questions Across All Levels</h3>
              <hr/>
              <ol>
                <li>
                  <h4>Can iROG.ai prepare final interrogatory responses?</h4>
                  <p>Yes. iROG.ai compiles all responses into a professional Word document format. These responses are ready
                    for the client’s final review and formal signature. Additionally, the system prepares the Notice of
                    Service of Interrogatories, formatted and ready for the lawyer’s signature.</p>
                </li>
                <hr/>
                <li>
                  <h4>What are the hardware/software requirements to use iROG.ai?</h4>
                  <p>iROG.ai is a web-based service that runs entirely in the browser. The requirements are minimal—any modern
                    device, including phones and tablets, will have no problem running it.</p>
                </li>
                <hr/>
                <li>
                  <h4>Does iROG.ai replace my team’s role in discovery?</h4>
                  <p>No. iROG.ai is designed to enhance your team’s efficiency, not replace it. It automates tedious tasks,
                    allowing your team to focus on strategic decision-making and client advocacy.</p>
                </li>
                <hr/>
                <li>
                  <h4>Which case management software does iROG.ai integrate with?</h4>
                  <p>Currently, we are focusing on integrations with Salesforce, Filevine, and Clio. If you are a large firm in
                    need of a custom integration, let us know, and we’ll explore the possibilities. For smaller firms, the
                    iROG.ai interface is user-friendly enough to work as a standalone tool, and we offer a free seven-day
                    trial (usage limits apply) to help you decide.</p>
                </li>
              </ol>
            </section>
            <hr/>

            <section>
              <h3>Time and Cost Savings</h3>
              <hr/>
              <ol>
                <li>
                  <h4>How much time can iROG.ai save my firm overall?</h4>
                  <p>Depending on the module you choose, iROG.ai can save:</p>
                  <ol>
                    <li>Basic: 2–4 hours per case.</li>
                    <li>Context: 4–8 hours per case.</li>
                    <li>Pro: 5–9 hours per case.</li>
                  </ol>
                  <p>These savings translate into hundreds of hours per month for firms handling multiple cases.</p>
                </li>
                <hr/>
                <li>
                  <h4>How much does this service cost?</h4>
                  <p>The platform is currently in beta, so pricing depends on a number of variables. Contact us, and we’ll
                    work with you to figure out a plan that is tailored to your specific needs.</p>
                </li>
                <hr/>
                <li>
                  <h4>Can iROG.ai improve client satisfaction?</h4>
                  <p>Yes. By using SMS and web-based communication, clients respond more quickly and accurately. This
                    reduces frustration for both clients and your team, ensuring smoother and faster discovery processes.</p>
                </li>
              </ol>
            </section>
            <hr/>

            <section>
              <h3>Getting Started</h3>
              <hr/>
              <ol>
                <li>
                  <h4>How do I get started with iROG.ai?</h4>
                  <p>Sign up on our website to explore the features of iROG.ai Basic, Context, or Pro. All plans come with
                    a free seven-day trial (usage limits apply), so you can see how iROG.ai fits into your firm’s workflow.</p>
                </li>
                <hr/>
                <li>
                  <h4>Is iROG.ai easy to use?</h4>
                  <p>Yes. iROG.ai is designed to be intuitive and requires minimal training. Whether you’re a small firm
                    or a large practice, the platform adapts to your needs seamlessly.</p>
                </li>
              </ol>
            </section>
            <hr/>

            <p id="faq--footnote">
              If you still have questions, we have answers.{" "}
              <a href="/contactus">Get in touch</a>!
            </p>
          </article>
        </section>
      </>
  );
}
