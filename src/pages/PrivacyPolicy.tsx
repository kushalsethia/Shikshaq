import { useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function PrivacyPolicy() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container max-w-4xl mx-auto px-4 pt-32 sm:pt-[120px] pb-12 md:pt-12">
        <div className="prose prose-slate max-w-none">
          <h1 className="text-4xl font-serif mb-8">Privacy Policy</h1>
          
          <p className="text-muted-foreground mb-8">
            <strong>Last Updated:</strong> January 24, 2026
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-serif mt-8 mb-4">1. Introduction</h2>
            <p>
              Welcome to ShikshAq ("we," "our," or "us"). We are committed to protecting your privacy and ensuring transparency about how we collect, use, and safeguard your personal information. This Privacy Policy explains our practices regarding data collection, use, and disclosure when you use our website located at <strong>www.shikshaq.in</strong> (the "Service").
            </p>
            <p>
              By using our Service, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with our policies and practices, please do not use our Service.
            </p>
            <p>
              <strong>Consent:</strong> In accordance with the Digital Personal Data Protection Act, 2023, your consent to this Privacy Policy must be free, specific, informed, unconditional, and unambiguous. By creating an account, signing up, or using our Service, you provide your explicit consent to the collection, processing, and use of your personal information as described in this Privacy Policy. You have the right to withdraw your consent at any time, as described in Section 7 ("Your Rights and Choices").
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif mt-8 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">2.1 Information You Provide</h3>
            <p>We collect information that you voluntarily provide when you:</p>
            <ul>
              <li><strong>Create an Account:</strong> When you sign up using Google OAuth, we collect your email address, full name, and profile picture from your Google account.</li>
              <li><strong>Complete Your Profile:</strong> As a student, we may collect your phone number, address, date of birth, age, school/college name, grade/class, school board, and guardian email address.</li>
              <li><strong>Guardian Accounts:</strong> We collect your phone number, address, relationship to student, and information about the student you are managing (name, date of birth, grade, school board).</li>
              <li><strong>Submit Feedback:</strong> We collect your rating, comments, and optionally your email address (if you are not logged in).</li>
              <li><strong>Interact with Teachers:</strong> When you like teachers, upvote teachers, or leave comments, we collect this interaction data.</li>
              <li><strong>Recommend Teachers:</strong> When you recommend a teacher, we collect the teacher information you provide.</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">2.2 Automatically Collected Information</h3>
            <ul>
              <li><strong>Authentication Data:</strong> We store authentication session tokens in your browser's localStorage to maintain your login session.</li>
              <li><strong>Usage Data:</strong> We may collect information about how you access and use our Service, including pages visited, time spent on pages, and navigation patterns.</li>
              <li><strong>Device Information:</strong> We may collect information about your device, including browser type, operating system, and device identifiers.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif mt-8 mb-4">3. How We Use Your Information</h2>
            <p>We use the collected information for the following purposes:</p>
            <ul>
              <li><strong>To Provide and Maintain Our Service:</strong> To create and manage your account, authenticate you, and provide access to our platform.</li>
              <li><strong>To Personalize Your Experience:</strong> To show you relevant teachers based on your preferences, grade, subjects, and location.</li>
              <li><strong>To Enable Communication:</strong> To facilitate direct communication between students/parents and teachers via WhatsApp.</li>
              <li><strong>To Improve Our Service:</strong> To analyze usage patterns, gather feedback, and enhance user experience.</li>
              <li><strong>To Provide Customer Support:</strong> To respond to your inquiries, provide technical support, and address your concerns.</li>
              <li><strong>To Send Notifications:</strong> To send you important updates about your account or our Service (you can opt out of non-essential communications).</li>
              <li><strong>To Ensure Security:</strong> To detect, prevent, and address technical issues, fraud, or security threats.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif mt-8 mb-4">4. Third-Party Services and Data Sharing</h2>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">4.1 Google OAuth</h3>
            <p>
              When you sign in with Google, we use Google OAuth 2.0 to authenticate you. We only request the following scopes: <strong>openid</strong>, <strong>email</strong>, and <strong>profile</strong>. We do not request or store Google access tokens or refresh tokens. We only receive your basic profile information (email, name, profile picture) and a secure session token from our authentication provider (Supabase).
            </p>
            <p>
              Your Google account data is processed according to <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google's Privacy Policy</a>. We do not have access to your Google password or other Google account data beyond what you authorize.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">4.2 Supabase</h3>
            <p>
              We use Supabase as our backend service provider for database storage and authentication. Your data is stored securely on Supabase's servers. Supabase processes your data according to their <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline">Privacy Policy</a> and <a href="https://supabase.com/security" target="_blank" rel="noopener noreferrer" className="text-primary underline">Security practices</a>.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">4.3 Google Gemini AI</h3>
            <p>
              We use Google Gemini AI to power our chatbot feature. When you interact with the chatbot, your messages are sent to Google's Gemini API to generate responses. Your chat messages are processed according to <a href="https://ai.google.dev/gemini-api/terms" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google's Gemini API Terms</a>. We do not store your chat conversations permanently.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">4.4 Data Sharing</h3>
            <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
            <ul>
              <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information.</li>
              <li><strong>Service Providers:</strong> With trusted third-party service providers who assist us in operating our Service (e.g., Supabase for database and authentication, Vercel for hosting).</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or government regulation.</li>
              <li><strong>Protection of Rights:</strong> To protect our rights, privacy, safety, or property, or that of our users or others.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif mt-8 mb-4">5. Data Storage and Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-none space-y-2">
              <li>a) Encryption of data in transit using HTTPS/TLS</li>
              <li>b) Secure authentication through Supabase Auth</li>
              <li>c) Row-level security policies in our database</li>
              <li>d) Regular security assessments and updates</li>
              <li>e) Limited access to personal data on a need-to-know basis</li>
            </ul>
            <p>
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif mt-8 mb-4">6. Cookies and Local Storage</h2>
            <p>
              We use browser localStorage to store your authentication session tokens. This allows you to remain logged in across browser sessions. The session tokens are encrypted and managed by Supabase Auth.
            </p>
            <p>
              We do not use cookies for tracking or advertising purposes. You can clear your browser's localStorage at any time, which will log you out of the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif mt-8 mb-4">7. Your Rights and Choices</h2>
            <p>You have the following rights regarding your personal information:</p>
            <ul>
              <li><strong>Access:</strong> You can access and review your personal information through your account dashboard.</li>
              <li><strong>Correction:</strong> You can update or correct your personal information at any time through your account settings.</li>
              <li><strong>Deletion:</strong> You can request deletion of your account and associated data by contacting us at <a href="mailto:join.shikshaq@gmail.com" className="text-primary underline">join.shikshaq@gmail.com</a>.</li>
              <li><strong>Data Portability:</strong> You can request a copy of your data in a machine-readable format.</li>
              <li><strong>Withdraw Consent:</strong> You can withdraw your consent for data processing at any time, though this may limit your ability to use certain features of the Service.</li>
              <li><strong>Opt-Out:</strong> You can opt out of non-essential communications from us.</li>
              <li><strong>Right to Nominate:</strong> In accordance with the Digital Personal Data Protection Act, 2023, you have the right to nominate an individual who shall exercise your rights in the event of your death or incapacity. To nominate someone, please contact us with the nominee's details and your explicit consent for such nomination.</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us using the information provided in the "Contact Us" section below.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif mt-8 mb-4">8. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. Specifically:
            </p>
            <ul>
              <li><strong>Account Data:</strong> Retained until you delete your account or request deletion.</li>
              <li><strong>Feedback:</strong> Retained for service improvement purposes, but can be anonymized upon request.</li>
              <li><strong>Interaction Data:</strong> (likes, upvotes, comments) Retained as long as your account is active.</li>
              <li><strong>Authentication Data:</strong> Session tokens are automatically deleted when you log out or after a period of inactivity.</li>
            </ul>
            <p>
              When you delete your account, we will delete or anonymize your personal information, except where we are required to retain it for legal or regulatory purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif mt-8 mb-4">9. Children's Privacy</h2>
            <p>
              Our Service is designed to connect students, parents, and guardians with tuition teachers. We recognize that students of various ages, including those in primary and secondary education, may use our Service.
            </p>
            <p>
              <strong>For Minors Under 18:</strong> In accordance with Indian law, including the Indian Contract Act, 1872 and the Digital Personal Data Protection Act, 2023, we do not knowingly collect personal information from minors (under the age of 18) without parental consent declaration. If you are under 18 years of age, you may only use our Service with the involvement and consent of a parent or guardian.
            </p>
            <p>
              <strong>Parental Consent Required:</strong> Before collecting any personal information from a user under 18, we require a declaration that parental consent has been obtained. By creating an account or using our Service, users under 18 (or their parents/guardians) declare that they have obtained appropriate parental consent. Parents and guardians are responsible for supervising their children's use of our Service and ensuring they understand how to use it safely.
            </p>
            <p>
              <strong>Parental Rights:</strong> Parents and guardians have the right to:
            </p>
            <ul>
              <li>Review the personal information collected from their child</li>
              <li>Request deletion of their child's personal information</li>
              <li>Refuse further collection of their child's personal information</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p>
              If you are a parent or guardian and believe we have collected information from your child without proper consent, please contact us immediately at <a href="mailto:join.shikshaq@gmail.com" className="text-primary underline">join.shikshaq@gmail.com</a> or our Grievance Officer (details provided in Section 13).
            </p>
            <p>
              We do not knowingly collect personal information from minors under 18 without parental consent declaration. If we become aware that we have collected such information without proper consent declaration, we will take steps to delete it promptly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif mt-8 mb-4">10. International Data Transfers</h2>
            <p>
              Our Service uses third-party services that may process your information in countries outside of India, including the United States and other countries where these services operate. Specifically:
            </p>
            <ul>
              <li><strong>Google Services:</strong> When you use Google OAuth for authentication or interact with our AI chatbot (powered by Google Gemini), your data is processed by Google's servers, which are located primarily in the United States and other countries where Google operates.</li>
              <li><strong>Supabase:</strong> Our database and authentication services are hosted by Supabase, which may store your data in data centers located outside of India, depending on your Supabase project's region configuration.</li>
              <li><strong>Hosting Services:</strong> Our website is hosted on platforms that may process your data in various global locations.</li>
            </ul>
            <p>
              These countries may have data protection laws that differ from those in India. By using our Service, you consent to the transfer of your information to these countries. We ensure that our service providers implement appropriate safeguards to protect your information in accordance with this Privacy Policy and applicable data protection standards.
            </p>
            <p>
              If you are located in a region with specific data protection requirements (such as the European Union under GDPR), please contact us to discuss how we can accommodate your data residency preferences.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif mt-8 mb-4">11. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif mt-8 mb-4">12. Contact Us</h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>
            <ul>
              <li><strong>Email:</strong> <a href="mailto:join.shikshaq@gmail.com" className="text-primary underline">join.shikshaq@gmail.com</a></li>
              <li><strong>WhatsApp:</strong> <a href="https://wa.me/918240980312" target="_blank" rel="noopener noreferrer" className="text-primary underline">+91 8240980312</a></li>
              <li><strong>Website:</strong> <a href="https://www.shikshaq.in" className="text-primary underline">www.shikshaq.in</a></li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif mt-8 mb-4">13. Grievance Officer</h2>
            <p>
              In accordance with the Information Technology Act, 2000 and the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, we have designated a Grievance Officer to address your concerns and complaints regarding:
            </p>
            <ul>
              <li>Violation of your privacy rights</li>
              <li>Unauthorized access or use of your personal information</li>
              <li>Any other grievances related to data protection or privacy</li>
            </ul>
            <p>
              <strong>Grievance Officer:</strong>
            </p>
            <ul>
              <li><strong>Name:</strong> Krish Goenka</li>
              <li><strong>Designation:</strong> Grievance Officer</li>
              <li><strong>Email:</strong> <a href="mailto:krishgoenka96749@gmail.com" className="text-primary underline">krishgoenka96749@gmail.com</a></li>
              <li><strong>Phone/WhatsApp:</strong> <a href="https://wa.me/918240980312" target="_blank" rel="noopener noreferrer" className="text-primary underline">+91 8240980312</a></li>
              <li><strong>Official Correspondence Address:</strong> Madhuvan, 17/1G, Alipore Road, Kolkata - 700027, West Bengal, India.</li>
            </ul>
            <p>
              <strong>Response Time:</strong> We will acknowledge your grievance within 24 hours and resolve it within 15 days from the date of receipt, in accordance with applicable Indian laws.
            </p>
            <p>
              When contacting the Grievance Officer, please provide:
            </p>
            <ul>
              <li>Your name and contact information</li>
              <li>Description of the grievance</li>
              <li>Relevant details and supporting documents (if any)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif mt-8 mb-4">14. Governing Law</h2>
            <p>
              This Privacy Policy is governed by and construed in accordance with the laws of India. Any disputes arising from or relating to this Privacy Policy shall be subject to the exclusive jurisdiction of the courts in Kolkata, West Bengal, India.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}


