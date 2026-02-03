import { useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function TermsOfService() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get today's date
  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container max-w-4xl mx-auto px-4 pt-32 sm:pt-[120px] pb-12 md:pt-12">
        <div className="prose prose-slate max-w-none">
          <h1 className="text-4xl font-serif mb-8">Terms of Service</h1>
          
          <p className="text-muted-foreground mb-8">
            <strong>Last Updated:</strong> {today}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-serif mt-8 mb-4">1. Introduction and Acceptance</h2>
            <p>
              Welcome to Shikshaq ("Company," "we," "our," or "us"). By accessing or using our website located at <strong>www.shikshaq.in</strong> (the "Platform"), you agree to be bound by these Terms of Service ("Terms") and our Privacy Policy.
            </p>
            <p className="bg-muted p-4 rounded-lg border-l-4 border-primary my-4">
              <strong>PLEASE READ CAREFULLY:</strong> These Terms constitute a legally binding agreement between you and Shikshaq. If you do not agree to these Terms, you must not access or use the Platform. By clicking "I Agree," signing up, or using the Platform, you acknowledge that you have read, understood, and agreed to be bound by these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif mt-8 mb-4">2. Nature of Service (Intermediary Status)</h2>
            <h3 className="text-xl font-semibold mt-6 mb-3">2.1 Platform Only</h3>
            <p>Shikshaq acts solely as a technology intermediary that connects students/parents ("Students") with independent tutors ("Teachers").</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">2.2 No Employer-Employee Relationship</h3>
            <p>Teachers are independent contractors and not employees, agents, partners, or representatives of Shikshaq. We do not direct, control, or supervise the manner in which classes are conducted.</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">2.3 No Agency</h3>
            <p>Shikshaq is not an agent for either the Student or the Teacher. We do not have the authority to bind either party to any agreement.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif mt-8 mb-4">3. Eligibility</h2>
            <h3 className="text-xl font-semibold mt-6 mb-3">3.1 Age Requirement</h3>
            <p>You must be at least 18 years old to create an account.</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">3.2 Minors</h3>
            <p>If you are a student under 18, you may only use the Platform under the supervision of a parent or legal guardian who agrees to be bound by these Terms. The Parent/Guardian assumes full responsibility for the minor's use of the Platform.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif mt-8 mb-4">4. Disclaimers regarding Teachers (Crucial Liability Shield)</h2>
            <p>To the fullest extent permitted by Indian law, specifically the Information Technology Act, 2000:</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">4.1 No Warranty of Quality</h3>
            <p>Shikshaq makes no representations or warranties regarding the teaching skills, credentials, academic background, character, or suitability of any Teacher.</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">4.2 No Background Checks</h3>
            <p>Unless explicitly stated otherwise, Shikshaq does not conduct criminal background checks or police verification of Teachers. It is the sole responsibility of the Student/Parent to verify the Teacher's credentials and identity before engaging their services.</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">4.3 User Responsibility</h3>
            <p>You agree that you are solely responsible for conducting your own due diligence before meeting a Teacher or allowing them into your home.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif mt-8 mb-4">5. Limitation of Liability (The "We Are Not Accountable" Clause)</h2>
            <h3 className="text-xl font-semibold mt-6 mb-3">5.1 Interactions Off-Platform</h3>
            <p>Shikshaq is not liable for any interactions, conduct, or transactions that occur off the Platform, including but not limited to:</p>
            <ul>
              <li>In-person home tuition sessions.</li>
              <li>Phone calls or WhatsApp messages.</li>
              <li>Private monetary transactions.</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">5.2 No Liability for Conduct</h3>
            <p>In no event shall Shikshaq be liable for any direct, indirect, punitive, incidental, special, or consequential damages arising out of:</p>
            <ul>
              <li>Physical or emotional injury, bodily harm, or distress caused by a Teacher or Student.</li>
              <li>Property damage, theft, or loss of items during home visits.</li>
              <li>Academic failure or lack of progress by the Student.</li>
              <li>Sexual harassment, misconduct, or inappropriate behavior by any user.</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">5.3 Cap on Liability</h3>
            <p>To the maximum extent permitted by law, Shikshaq's total liability to you for any claim arising out of these Terms shall be limited to the amount of fees paid by you to Shikshaq in the 3 months preceding the claim, or ₹1,000 (Indian Rupees One Thousand), whichever is lower.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif mt-8 mb-4">6. User Conduct and Safety</h2>
            <h3 className="text-xl font-semibold mt-6 mb-3">6.1 Prohibited Content</h3>
            <p>Users shall not transmit any content that is grossly harmful, harassing, blasphemous, defamatory, obscene, pornographic, pedophilic, libelous, invasive of another's privacy, or racially/ethnically objectionable.</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">6.2 Safety Disputes</h3>
            <p>If a dispute arises between a Student and Teacher (e.g., fee non-payment, scheduling, behavior), Shikshaq is under no obligation to become involved or resolve the dispute. You release Shikshaq from all claims, demands, and damages arising out of such disputes.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif mt-8 mb-4">7. Payments and Fees</h2>
            <h3 className="text-xl font-semibold mt-6 mb-3">7.1 Direct Tuition Payments</h3>
            <p>Tuition fees for classes are negotiated and paid directly between the Student and the Teacher. Shikshaq is not a party to these transactions, does not hold funds on behalf of users, and is not responsible for refunds, non-payment, or fee disputes arising from these direct interactions.</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">7.2 Student Access Fees</h3>
            <p>Shikshaq reserves the right to charge Students a subscription or one-time fee to access Teacher contact details or premium features. Any such fee will be clearly disclosed on the Platform prior to payment and is non-refundable.</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">7.3 Teacher Platform Fees</h3>
            <ul>
              <li><strong>Current Status:</strong> Listing a profile on Shikshaq is currently free for Teachers.</li>
              <li><strong>Future Rights:</strong> Shikshaq reserves the absolute right to introduce listing fees, subscription plans, or lead-generation fees for Teachers in the future.</li>
              <li><strong>Notification:</strong> We will provide reasonable notice to Teachers before implementing any mandatory fees. Continued use of the Platform after such fees are introduced constitutes your agreement to the new pricing structure.</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">7.4 Taxes</h3>
            <p>Users (both Students and Teachers) are solely responsible for determining their own tax liabilities and reporting any income generated through connections made on the Platform. Shikshaq is not responsible for withholding or paying taxes on behalf of any user.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif mt-8 mb-4">8. Indemnification</h2>
            <p>You agree to defend, indemnify, and hold harmless Shikshaq, its founders, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses (including legal fees) arising out of:</p>
            <ul>
              <li>Your violation of these Terms.</li>
              <li>Your violation of any third-party right, including privacy rights.</li>
              <li>Your interaction with any other User (Student or Teacher).</li>
              <li>Any claim that your content caused damage to a third party.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif mt-8 mb-4">9. Termination</h2>
            <p>Shikshaq reserves the right to suspend or terminate your account immediately, without notice, if we believe you have violated these Terms or posed a safety risk to our community.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif mt-8 mb-4">10. Governing Law and Jurisdiction</h2>
            <p>These Terms shall be governed by the laws of India. You agree that any legal action or proceeding arising out of or relating to these Terms shall be brought exclusively in the courts located in Kolkata, West Bengal.</p>
          </section>

          <div className="mt-12 p-6 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-sm">
              <strong>Email:</strong> join.shikshaq@gmail.com<br />
              <strong>WhatsApp:</strong> +91 8240980312
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

