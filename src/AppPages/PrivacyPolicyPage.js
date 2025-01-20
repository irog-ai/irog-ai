import * as React from "react";
import { useEffect, useState } from "react";

export default function PrivacyPolicy() {
    useEffect(() => {
        document.title = 'Privacy Policy — irog.ai';
    });

    return (
        <>
            <section id="privacy-policy" className="text-content page-content-container">
                <h1>Privacy Policy</h1>
                <p>Effective Date: November 21, 2024</p>
                <p>
                    CG Legal Technologies, LLC ("we," "our," or "us") is committed to
                    protecting your privacy. This Privacy Policy outlines how we collect, use,
                    disclose, and safeguard your personal information when you visit our
                    website or use our services.
                </p>
                <ol>
                    <li>
                        <h3>1. Information We Collect</h3>
                        <ul>
                            <li>
                                <h4>(a) Personal Information</h4>
                                <p>We may collect the following personal information:</p>
                                <ul>
                                    <li>
                                        Identifiers: Name, email address, postal address, phone number.
                                    </li>
                                    <li>
                                        Commercial Information: Records of products or services
                                        purchased.
                                    </li>
                                    <li>
                                        Internet Activity: Browsing history, search history, and
                                        interactions with our website.
                                    </li>
                                    <li>Geolocation Data: Physical location or movements.</li>
                                    <li>Professional Information: Job title, employer.</li>
                                    <li>Inferences: Preferences, characteristics, behavior.</li>
                                </ul>
                            </li>
                            <li>
                                <h4>(b) Non-Personal Information</h4>
                                <ul>
                                    <li>
                                        Device Information: IP address, browser type, operating system.
                                    </li>
                                    <li>
                                        Usage Data: Pages visited, time spent on pages, navigation
                                        patterns.
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <h4>(c) Cookies and Tracking Technologies</h4>
                                <p>
                                    We use cookies and similar technologies to enhance your
                                    experience. You can manage your cookie preferences through your
                                    browser settings.
                                </p>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <h3>2. How We Use Your Information</h3>
                        <p>We use the collected information for purposes including:</p>
                        <ul>
                            <li>Providing and improving our services.</li>
                            <li>Processing transactions and fulfilling orders.</li>
                            <li>Communicating with you about your account or transactions.</li>
                            <li>Personalizing your experience on our website.</li>
                            <li>Conducting analytics and research.</li>
                            <li>Complying with legal obligations.</li>
                        </ul>
                    </li>
                    <li>
                        <h3>3. How We Share Your Information</h3>
                        <p>
                            We do not sell your personal information. We may share your
                            information with:
                        </p>
                        <ul>
                            <li>
                                Service Providers: Third parties that perform services on our
                                behalf.
                            </li>
                            <li>Legal Obligations: Authorities when required by law.</li>
                            <li>
                                Business Transfers: In connection with mergers, acquisitions, or
                                asset sales.
                            </li>
                        </ul>
                    </li>
                    <li>
                        <h3>4. Your Rights and Choices</h3>
                        <p>
                            Depending on your jurisdiction, you may have the following rights
                            regarding your personal information:
                        </p>
                        <ul>
                            <li>
                                Access: Request information about the personal data we hold about
                                you.
                            </li>
                            <li>Correction: Request correction of inaccurate personal data.</li>
                            <li>Deletion: Request deletion of your personal data.</li>
                            <li>
                                Opt-Out: Opt-out of the sale of your personal data or targeted
                                advertising.
                            </li>
                            <li>
                                Data Portability: Request a copy of your personal data in a portable
                                format.
                            </li>
                        </ul>
                        <p>To exercise these rights, please contact us at stop@irog.ai.</p>
                        <p>
                            <b>California Residents</b>: Under the California Consumer Privacy Act
                            (CCPA), you have specific rights regarding your personal information.
                            {/*                        For more details, please refer to our [California Privacy Notice].*/}
                        </p>
                        <p>
                            <b>Virginia Residents</b>: Under the Virginia Consumer Data Protection
                            Act (VCDPA), you have the right to access, correct, delete, and obtain
                            a copy of your personal data. You can also opt out of the processing
                            of your personal data for targeted advertising.
                        </p>
                        <p>
                            <b>Colorado Residents</b>: Under the Colorado Privacy Act (CPA), you
                            have similar rights to access, correct, delete, and obtain a copy of
                            your personal data, as well as opt out of certain data processing
                            activities.
                        </p>
                        <p>
                            <b>Connecticut Residents</b>: Under the Connecticut Data Privacy Act
                            (CTDPA), you have rights to access, correct, delete, and obtain a copy
                            of your personal data, and to opt out of targeted advertising and
                            sales of personal data.
                        </p>
                        <p>
                            <b>Utah Residents</b>: Under the Utah Consumer Privacy Act (UCPA), you
                            have rights to access and delete your personal data, and to opt out of
                            the sale of personal data.
                        </p>
                    </li>
                    <li>
                        <h3>5. Data Security</h3>
                        <p>
                            We implement reasonable security measures to protect your personal
                            information. However, no method of transmission over the internet is
                            entirely secure.
                        </p>
                    </li>
                    <li>
                        <h3>6. Data Retention</h3>
                        <p>
                            We retain your personal information only as long as necessary to
                            fulfill the purposes outlined in this policy or as required by law.
                        </p>
                    </li>
                    <li>
                        <h3>7. Children's Privacy</h3>
                        <p>
                            Our services are not directed to individuals under 13. We do not
                            knowingly collect personal information from children.
                        </p>
                    </li>
                    <li>
                        <h3>8. Changes to This Policy</h3>
                        <p>
                            We may update this Privacy Policy periodically. We will notify you of
                            significant changes by posting the new policy on our website.
                        </p>
                    </li>
                    <li>
                        <h3>9. Contact Us</h3>
                        <p>
                            If you have questions or concerns about this Privacy Policy, please
                            contact us at:
                            <br/>
                            <br/>
                            CG Legal Technologies, LLC
                            <br/>
                            www.irog.ai
                            <br/>
                            3217 Atlantic Blvd.
                            <br/>
                            Jacksonville FL 32207
                            <br/>
                            cg@flalaw.pro
                            <br/>
                            904-349-3005
                        </p>
                    </li>
                </ol>
            </section>

        </>
    );
}
