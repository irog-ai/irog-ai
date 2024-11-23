import * as React from "react";
import { useEffect, useState } from "react";

export default function Faq() {
  useEffect(() => {
    document.title = 'FAQ — irog.ai';
  });

  return (
      <>
        <div id="page-content-container">
          <section id="faq" className="text-content">
            <h1>Frequently Asked Questions</h1>
            <ul>
              <li className="faq--item">
                <h3 className="faq--question">How does this service work?</h3>
                <div className="faq--answer">
                  <p>
                    irog.ai utilizes state of the art Artificial Intelligence
                    technology to automate the bulk of the tedious and time-consuming
                    task of collecting answers to your clients' interrogatories. This
                    process begins the moment you upload documents—irog.ai
                    automatically extracts all pertinent information, then translates
                    the interrogatories into plain English—and continues through
                    communicating directly with your client in natural language, then
                    finally uses the previously extracted information to produce
                    Answer and Notice of Service documents that are ready to send.
                  </p>
                </div>
              </li>
              <li className="faq--item">
                <h3 className="faq--question">
                  How is information collected from our clients?
                </h3>
                <div className="faq--answer">
                  <p>
                    After you verify the interrogatories you'd like to send to your
                    client, you have the option of initiating an interaction with your
                    client via text message, a web interface, or both.
                  </p>
                  <p>
                    In the case of text messaging, your client will receive a text
                    message from our AI-powered assistant to let them know they'll be
                    providing information to us on your behalf. After this, our
                    assistant will begin asking questions to collect answers to your
                    client's interrogatories. These questions are translated into
                    simplified language that is more accessible than the legalese
                    these documents often contain. If the provided answers do not
                    fully answer the interrogatories, the AI assistant will let your
                    client know what additional information they need to provide.
                  </p>
                  <p>
                    If you choose the web interface, your client will receive an email
                    from us which, as with the text messaging process, explains that
                    we are contacting them to collect information on your behalf. The
                    process is essentially the same as the text messaging described
                    above, but your client will navigate the interrogatories through a
                    private web page, with our AI assistant providing feedback on the
                    relevance and completeness of their answers as they progress.
                  </p>
                  <p>
                    You are able to choose both options if you'd like to leave the
                    choice to your client.
                  </p>
                </div>
              </li>
              <li className="faq--item">
                <h3 className="faq--question">How much does this service cost?</h3>
                <div className="faq--answer">
                  <p>
                    Pricing depends on a number of variables.{" "}
                    <a href="/contactus">Contact us</a>, and we'll work with you to
                    figure out a plan that is tailored to your specific needs.
                  </p>
                </div>
              </li>
              <li className="faq--item">
                <h3 className="faq--question">
                  What are the hardware/software requirements to use irog.ai?
                </h3>
                <div className="faq--answer">
                  <p>
                    irog.ai is a web-based service that runs entirely in the browser.
                    The requirements are minimal—any modern device will have no
                    problem running it, including phones and tablets.
                  </p>
                </div>
              </li>
            </ul>
            <p id="faq--footnote">
              If you still have questions, we have answers.{" "}
              <a href="/contactus">Get in touch</a>!
            </p>
          </section>
        </div>
      </>
  );
}
