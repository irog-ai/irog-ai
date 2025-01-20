import * as React from "react";
import { useEffect, useState } from "react";

export default function Terms() {
    useEffect(() => {
        document.title = 'Terms & Conditions — irog.ai';
    });

    return (
        <>
            <section id="terms" className="text-content page-content-container">
                <h1>Terms & Conditions</h1>
                <h3>1. Acceptance of Terms</h3>
                <p>Welcome to irog.ai, a service provided by CG Legal Technologies, LLC (“Company”, “we”, or “us”). By accessing or using our platform, including but not limited to the irog.ai dashboard, automated SMS service, and related tools (collectively, the “Service”), you (“User” or “you”) agree to be bound by these Terms of Service (“Terms”). If you do not agree to these Terms, you may not access or use the Service.</p>
                <hr/>
                <h3>2. Description of Service</h3>
                <p>The Service is designed to streamline and automate the process of collecting legal information from clients on behalf of their legal representatives. irog.ai leverages artificial intelligence to extract, simplify, and organize interrogatory questions and communicate with clients via SMS to obtain responses. The Service is intended for use by lawyers, law firms, and their authorized representatives (“Legal Representatives”).</p>
                <hr/>
                <h3>3. User Responsibilities</h3>
                <p>By using the Service, you agree to the following:</p>
                <ol>
                <li><strong>Compliance with Laws</strong>: You will use the Service in compliance with all applicable laws, regulations, and ethical obligations related to the legal profession.</li>
                <li><strong>Obtaining Consent</strong>: As a Legal Representative, you must obtain explicit, written consent from your clients (“Recipients”) before initiating any SMS interactions through irog.ai.</li>
                <li><strong>Accurate Information</strong>: You are responsible for providing accurate and complete information when using the Service.</li>
                <li><strong>No Unauthorized Use</strong>: You agree not to use the Service for any purpose other than its intended legal and transactional use.</li>
                </ol>
                <hr/>
                <h3>4. Account Registration and Security</h3>
                <ol>
                <li>To access the Service, you must create an account and provide accurate and complete registration information.</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials and all activities that occur under your account.</li>
                <li>The Company reserves the right to suspend or terminate accounts for violations of these Terms or suspicious activity.</li>
                </ol>
                <hr/>
                <h3>5. Fees and Payment Terms</h3>
                <p>If applicable, fees for the Service will be disclosed at the time of registration or contract negotiation. Users agree to pay all fees and charges in accordance with the agreed-upon terms. Failure to pay may result in suspension or termination of access to the Service.</p>
                <hr/>
                <h3>6. Privacy and Data Protection</h3>
                <p>We take the privacy and security of your data seriously. By using the Service, you consent to the collection, use, and storage of information as outlined in our <a href="/privacypolicy">Privacy Policy</a>. Key points include:</p>
                <ol>
                <li><strong>Client Data</strong>: All data collected through SMS interactions with clients is stored securely and used solely for the purpose of providing the Service.</li>
                <li><strong>Compliance</strong>: The Company adheres to all applicable data protection laws, including GDPR and CCPA, as required.</li>
                <li><strong>Disclosure</strong>: We do not share or sell client data to third parties, except as required by law or with your explicit consent.</li>
                </ol>
                <hr/>
                <h3>7. Use of SMS Services</h3>
                <ol>
                <li><strong>Transactional Purpose</strong>: All SMS messages sent through irog.ai are for transactional purposes only, such as collecting responses to interrogatories or similar legal inquiries.</li>
                <li><strong>Message Content</strong>: Legal Representatives must ensure that message content complies with applicable regulations, including CTIA and carrier guidelines for 10DLC registration.</li>
                <li><strong>Opt-In and Opt-Out</strong>: Clients must provide explicit written consent to receive SMS messages. Clients may opt out at any time by replying “STOP” to any message or by contacting the Legal Representative.</li>
                <li><strong>Message Rates</strong>: Standard messaging and data rates may apply to clients, which are their responsibility to pay.</li>
                </ol>
                <hr/>
                <h3>8. Intellectual Property Rights</h3>
                <ol>
                <li>All rights, titles, and interests in and to the Service, including but not limited to the irog.ai platform, AI models, and any related technology, are owned by CG Legal Technologies, LLC.</li>
                <li>Users retain ownership of any data they upload to the Service but grant the Company a limited, non-exclusive license to process such data for the purpose of providing the Service.</li>
                </ol>
                <hr/>
                <h3>9. Service Availability and Modifications</h3>
                <ol>
                <li>The Company makes reasonable efforts to ensure the availability of the Service but does not guarantee uninterrupted access.</li>
                <li>We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) at any time with reasonable notice.</li>
                </ol>
                <hr/>
                <h3>10. Disclaimers and Limitation of Liability</h3>
                <ol>
                <li>The Service is provided “as is” without any warranties, express or implied.</li>
                <li>The Company is not responsible for the accuracy or completeness of data provided by users or clients.</li>
                <li>To the fullest extent permitted by law, the Company’s liability is limited to the fees paid by the user for the Service in the 12 months preceding the claim.</li>
                </ol>
                <hr/>
                <h3>11. Indemnification</h3>
                <p>You agree to indemnify, defend, and hold harmless CG Legal Technologies, LLC from any claims, liabilities, damages, losses, or expenses arising from your use of the Service or your failure to comply with these Terms.</p>
                <hr/>
                <h3>12. Governing Law and Dispute Resolution</h3>
                <p>These Terms are governed by the laws of the State of Florida, without regard to its conflict of law principles. Any disputes arising from these Terms or the use of the Service shall be resolved through arbitration in accordance with the rules of the American Arbitration Association.</p>
                <hr/>
                <h3>13. Changes to the Terms</h3>
                <p>The Company reserves the right to modify these Terms at any time. Changes will be communicated to users via email or the Service dashboard, and continued use of the Service constitutes acceptance of the updated Terms.</p>
                <hr/>
                <h3>14. Contact Information</h3>
                <p>For questions regarding these Terms, please contact us at:
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
                </p>
            </section>
        </>
    );
}
