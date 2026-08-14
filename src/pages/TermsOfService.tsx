import { useEffect } from 'react';
import { LegalLayout } from '@/components/LegalLayout';
import { usePageMeta } from '@/hooks/usePageMeta';

const SECTIONS = [
  {
    title: '1. Introduction and Acceptance',
    body: (
      <>
        <p style={{ maxWidth: '66ch', fontSize: 16, lineHeight: 1.7, color: '#4A443E' }}>
          Welcome to Shikshaq ("Company," "we," "our," or "us"). By accessing or using our website located at <strong>www.shikshaq.in</strong> (the "Platform"), you agree to be bound by these Terms of Service ("Terms") and our Privacy Policy.
        </p>
        <p style={{ maxWidth: '66ch', fontSize: 16, lineHeight: 1.7, color: '#4A443E', marginTop: 14, padding: 16, borderRadius: 12, background: '#FFF4E8' }}>
          <strong>PLEASE READ CAREFULLY:</strong> These Terms constitute a legally binding agreement between you and Shikshaq. If you do not agree to these Terms, you must not access or use the Platform. By clicking "I Agree," signing up, or using the Platform, you acknowledge that you have read, understood, and agreed to be bound by these Terms.
        </p>
      </>
    ),
  },
  {
    title: '2. Nature of Service (Intermediary Status)',
    body: (
      <>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginTop: 16, marginBottom: 6, color: '#1F1F1F' }}>2.1 Platform Only</h3>
        <p style={{ maxWidth: '66ch', fontSize: 16, lineHeight: 1.7, color: '#4A443E' }}>Shikshaq acts solely as a technology intermediary that connects students/parents ("Students") with independent tutors ("Teachers").</p>

        <h3 style={{ fontSize: 16, fontWeight: 700, marginTop: 16, marginBottom: 6, color: '#1F1F1F' }}>2.2 No Employer-Employee Relationship</h3>
        <p style={{ maxWidth: '66ch', fontSize: 16, lineHeight: 1.7, color: '#4A443E' }}>Teachers are independent contractors and not employees, agents, partners, or representatives of Shikshaq. We do not direct, control, or supervise the manner in which classes are conducted.</p>

        <h3 style={{ fontSize: 16, fontWeight: 700, marginTop: 16, marginBottom: 6, color: '#1F1F1F' }}>2.3 No Agency</h3>
        <p style={{ maxWidth: '66ch', fontSize: 16, lineHeight: 1.7, color: '#4A443E' }}>Shikshaq is not an agent for either the Student or the Teacher. We do not have the authority to bind either party to any agreement.</p>
      </>
    ),
  },
  {
    title: '3. Eligibility',
    body: (
      <>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginTop: 16, marginBottom: 6, color: '#1F1F1F' }}>3.1 Age Requirement</h3>
        <p style={{ maxWidth: '66ch', fontSize: 16, lineHeight: 1.7, color: '#4A443E' }}>You must be at least 18 years old to create an account.</p>

        <h3 style={{ fontSize: 16, fontWeight: 700, marginTop: 16, marginBottom: 6, color: '#1F1F1F' }}>3.2 Minors</h3>
        <p style={{ maxWidth: '66ch', fontSize: 16, lineHeight: 1.7, color: '#4A443E' }}>If you are a student under 18, you may only use the Platform under the supervision of a parent or legal guardian who agrees to be bound by these Terms. The Parent/Guardian assumes full responsibility for the minor's use of the Platform.</p>
      </>
    ),
  },
  {
    title: '4. Disclaimers regarding Teachers (Crucial Liability Shield)',
    body: (
      <>
        <p style={{ maxWidth: '66ch', fontSize: 16, lineHeight: 1.7, color: '#4A443E' }}>To the fullest extent permitted by Indian law, specifically the Information Technology Act, 2000:</p>

        <h3 style={{ fontSize: 16, fontWeight: 700, marginTop: 16, marginBottom: 6, color: '#1F1F1F' }}>4.1 No Warranty of Quality</h3>
        <p style={{ maxWidth: '66ch', fontSize: 16, lineHeight: 1.7, color: '#4A443E' }}>Shikshaq makes no representations or warranties regarding the teaching skills, credentials, academic background, character, or suitability of any Teacher.</p>

        <h3 style={{ fontSize: 16, fontWeight: 700, marginTop: 16, marginBottom: 6, color: '#1F1F1F' }}>4.2 No Background Checks</h3>
        <p style={{ maxWidth: '66ch', fontSize: 16, lineHeight: 1.7, color: '#4A443E' }}>Unless explicitly stated otherwise, Shikshaq does not conduct criminal background checks or police verification of Teachers. It is the sole responsibility of the Student/Parent to verify the Teacher's credentials and identity before engaging their services.</p>

        <h3 style={{ fontSize: 16, fontWeight: 700, marginTop: 16, marginBottom: 6, color: '#1F1F1F' }}>4.3 User Responsibility</h3>
        <p style={{ maxWidth: '66ch', fontSize: 16, lineHeight: 1.7, color: '#4A443E' }}>You agree that you are solely responsible for conducting your own due diligence before meeting a Teacher or allowing them into your home.</p>
      </>
    ),
  },
  {
    title: '5. Limitation of Liability (The "We Are Not Accountable" Clause)',
    body: (
      <>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginTop: 16, marginBottom: 6, color: '#1F1F1F' }}>5.1 Interactions Off-Platform</h3>
        <p style={{ maxWidth: '66ch', fontSize: 16, lineHeight: 1.7, color: '#4A443E' }}>Shikshaq is not liable for any interactions, conduct, or transactions that occur off the Platform, including but not limited to:</p>
        <ul style={{ maxWidth: '66ch', fontSize: 16, lineHeight: 1.7, color: '#4A443E', paddingLeft: 20, listStyleType: 'disc' }}>
          <li>In-person home tuition sessions.</li>
          <li>Phone calls or WhatsApp messages.</li>
          <li>Private monetary transactions.</li>
        </ul>

        <h3 style={{ fontSize: 16, fontWeight: 700, marginTop: 16, marginBottom: 6, color: '#1F1F1F' }}>5.2 No Liability for Conduct</h3>
        <p style={{ maxWidth: '66ch', fontSize: 16, lineHeight: 1.7, color: '#4A443E' }}>In no event shall Shikshaq be liable for any direct, indirect, punitive, incidental, special, or consequential damages arising out of:</p>
        <ul style={{ maxWidth: '66ch', fontSize: 16, lineHeight: 1.7, color: '#4A443E', paddingLeft: 20, listStyleType: 'disc' }}>
          <li>Physical or emotional injury, bodily harm, or distress caused by a Teacher or Student.</li>
          <li>Property damage, theft, or loss of items during home visits.</li>
          <li>Academic failure or lack of progress by the Student.</li>
          <li>Sexual harassment, misconduct, or inappropriate behavior by any user.</li>
        </ul>

        <h3 style={{ fontSize: 16, fontWeight: 700, marginTop: 16, marginBottom: 6, color: '#1F1F1F' }}>5.3 Cap on Liability</h3>
        <p style={{ maxWidth: '66ch', fontSize: 16, lineHeight: 1.7, color: '#4A443E' }}>To the maximum extent permitted by law, Shikshaq's total liability to you for any claim arising out of these Terms shall be limited to the amount of fees paid by you to Shikshaq in the 3 months preceding the claim, or ₹1,000 (Indian Rupees One Thousand), whichever is lower.</p>
      </>
    ),
  },
  {
    title: '6. User Conduct and Safety',
    body: (
      <>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginTop: 16, marginBottom: 6, color: '#1F1F1F' }}>6.1 Prohibited Content</h3>
        <p style={{ maxWidth: '66ch', fontSize: 16, lineHeight: 1.7, color: '#4A443E' }}>Users shall not transmit any content that is grossly harmful, harassing, blasphemous, defamatory, obscene, pornographic, pedophilic, libelous, invasive of another's privacy, or racially/ethnically objectionable.</p>

        <h3 style={{ fontSize: 16, fontWeight: 700, marginTop: 16, marginBottom: 6, color: '#1F1F1F' }}>6.2 Safety Disputes</h3>
        <p style={{ maxWidth: '66ch', fontSize: 16, lineHeight: 1.7, color: '#4A443E' }}>If a dispute arises between a Student and Teacher (e.g., fee non-payment, scheduling, behavior), Shikshaq is under no obligation to become involved or resolve the dispute. You release Shikshaq from all claims, demands, and damages arising out of such disputes.</p>
      </>
    ),
  },
  {
    title: '7. Payments and Fees',
    body: (
      <>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginTop: 16, marginBottom: 6, color: '#1F1F1F' }}>7.1 Direct Tuition Payments</h3>
        <p style={{ maxWidth: '66ch', fontSize: 16, lineHeight: 1.7, color: '#4A443E' }}>Tuition fees for classes are negotiated and paid directly between the Student and the Teacher. Shikshaq is not a party to these transactions, does not hold funds on behalf of users, and is not responsible for refunds, non-payment, or fee disputes arising from these direct interactions.</p>

        <h3 style={{ fontSize: 16, fontWeight: 700, marginTop: 16, marginBottom: 6, color: '#1F1F1F' }}>7.2 Student Access Fees</h3>
        <p style={{ maxWidth: '66ch', fontSize: 16, lineHeight: 1.7, color: '#4A443E' }}>Shikshaq reserves the right to charge Students a subscription or one-time fee to access Teacher contact details or premium features. Any such fee will be clearly disclosed on the Platform prior to payment and is non-refundable.</p>

        <h3 style={{ fontSize: 16, fontWeight: 700, marginTop: 16, marginBottom: 6, color: '#1F1F1F' }}>7.3 Teacher Platform Fees</h3>
        <ul style={{ maxWidth: '66ch', fontSize: 16, lineHeight: 1.7, color: '#4A443E', paddingLeft: 20, listStyleType: 'disc' }}>
          <li><strong>Current Status:</strong> Listing a profile on Shikshaq is currently free for Teachers.</li>
          <li><strong>Future Rights:</strong> Shikshaq reserves the absolute right to introduce listing fees, subscription plans, or lead-generation fees for Teachers in the future.</li>
          <li><strong>Notification:</strong> We will provide reasonable notice to Teachers before implementing any mandatory fees. Continued use of the Platform after such fees are introduced constitutes your agreement to the new pricing structure.</li>
        </ul>

        <h3 style={{ fontSize: 16, fontWeight: 700, marginTop: 16, marginBottom: 6, color: '#1F1F1F' }}>7.4 Taxes</h3>
        <p style={{ maxWidth: '66ch', fontSize: 16, lineHeight: 1.7, color: '#4A443E' }}>Users (both Students and Teachers) are solely responsible for determining their own tax liabilities and reporting any income generated through connections made on the Platform. Shikshaq is not responsible for withholding or paying taxes on behalf of any user.</p>
      </>
    ),
  },
  {
    title: '8. Indemnification',
    body: (
      <>
        <p style={{ maxWidth: '66ch', fontSize: 16, lineHeight: 1.7, color: '#4A443E' }}>You agree to defend, indemnify, and hold harmless Shikshaq, its founders, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses (including legal fees) arising out of:</p>
        <ul style={{ maxWidth: '66ch', fontSize: 16, lineHeight: 1.7, color: '#4A443E', paddingLeft: 20, listStyleType: 'disc' }}>
          <li>Your violation of these Terms.</li>
          <li>Your violation of any third-party right, including privacy rights.</li>
          <li>Your interaction with any other User (Student or Teacher).</li>
          <li>Any claim that your content caused damage to a third party.</li>
        </ul>
      </>
    ),
  },
  {
    title: '9. Termination',
    body: (
      <p style={{ maxWidth: '66ch', fontSize: 16, lineHeight: 1.7, color: '#4A443E' }}>Shikshaq reserves the right to suspend or terminate your account immediately, without notice, if we believe you have violated these Terms or posed a safety risk to our community.</p>
    ),
  },
  {
    title: '10. Governing Law and Jurisdiction',
    body: (
      <p style={{ maxWidth: '66ch', fontSize: 16, lineHeight: 1.7, color: '#4A443E' }}>These Terms shall be governed by the laws of India. You agree that any legal action or proceeding arising out of or relating to these Terms shall be brought exclusively in the courts located in Kolkata, West Bengal.</p>
    ),
  },
];

export default function TermsOfService() {
  usePageMeta(
    'Terms of Service | Shikshaq',
    'The terms that govern your use of Shikshaq, the free tutor-student matchmaking platform connecting students with verified tuition teachers in Kolkata.'
  );

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <LegalLayout
      title="Terms of Service"
      lastUpdated="Updated on January 24, 2026"
      sections={SECTIONS}
      currentPath="/terms-of-service"
    />
  );
}
