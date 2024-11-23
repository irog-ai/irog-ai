import * as React from "react";
import { useEffect, useState } from "react";

export default function Contactus() {
    useEffect(() => {
        document.title = 'Contact Us — irog.ai';
    });

    return (
      <div id="page-content-container">
          <section id="contact-us" className="text-content">
              <h1>Contact Us</h1>
              <h2>
                  <a href="mailto:lw@irog.ai">lw@irog.ai</a>
              </h2>
              <p>
                  If you're interested in our services, don't hesitate to get in touch via
                  the email address above.
              </p>
          </section>
      </div>
  );
}
