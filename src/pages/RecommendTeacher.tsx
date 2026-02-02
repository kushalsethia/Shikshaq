import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { useRequireRole } from '@/hooks/use-require-role';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, User, Phone, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { Link } from 'react-router-dom';

const recommendSchema = z.object({
  yourName: z.string().min(2, 'Name must be at least 2 characters'),
  yourContact: z.string().min(10, 'Contact number must be at least 10 digits'),
  teacherName: z.string().min(2, 'Teacher name must be at least 2 characters'),
  teacherContact: z.string().min(10, 'Teacher contact number must be at least 10 digits'),
});

export default function RecommendTeacher() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    yourName: '',
    yourContact: '',
    teacherName: '',
    teacherContact: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Ensure user has selected a role
  useRequireRole();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Handle phone number input - only allow digits
    if (name === 'yourContact' || name === 'teacherContact') {
      const digitsOnly = value.replace(/\D/g, '');
      setFormData({ ...formData, [name]: digitsOnly });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is signed in
    if (!user) {
      toast.error('Please sign in to submit a recommendation');
      navigate('/auth');
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const result = recommendSchema.safeParse(formData);
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        setLoading(false);
        return;
      }

      // Submit to Supabase with user_id
      const { error } = await supabase
        .from('teacher_recommendations')
        .insert({
          user_id: user.id,
          recommender_name: formData.yourName,
          recommender_contact: `+91${formData.yourContact}`,
          teacher_name: formData.teacherName,
          teacher_contact: `+91${formData.teacherContact}`,
          status: 'pending',
        });

      if (error) {
        if (import.meta.env.DEV) {
          console.error('Error submitting recommendation:', error);
        }
        throw new Error(error.message || 'Failed to submit recommendation');
      }
      
      toast.success('Thank you! Your recommendation has been submitted.');
      
      // Reset form
      setFormData({
        yourName: '',
        yourContact: '',
        teacherName: '',
        teacherContact: '',
      });
      
      // Optionally navigate back or show success page
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit recommendation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container pt-32 sm:pt-[120px] pb-8 md:pt-16 md:pb-16">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Side - Text */}
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground leading-tight">
                We'd love to have the best teachers out there, on-board with us
              </h1>
            </div>

            {/* Right Side - Form Card - Dark theme like in the image */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 md:p-12 border border-gray-700 shadow-xl relative overflow-hidden">
            {/* Background blur effect */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div 
                className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"
                style={{
                  transform: 'translate(30%, -30%)',
                }}
              />
            </div>
            
            <div className="relative z-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Your Name */}
              <div className="space-y-2">
                <Label htmlFor="yourName" className="text-gray-200">Your Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="yourName"
                    name="yourName"
                    type="text"
                    placeholder="FULL NAME"
                    value={formData.yourName}
                    onChange={handleInputChange}
                    className={`pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-gray-600 ${errors.yourName ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.yourName && (
                  <p className="text-sm text-red-400">{errors.yourName}</p>
                )}
              </div>

              {/* Your Contact Number */}
              <div className="space-y-2">
                <Label htmlFor="yourContact" className="text-gray-200">Your Contact Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <div className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                    +91
                  </div>
                  <Input
                    id="yourContact"
                    name="yourContact"
                    type="tel"
                    placeholder=""
                    value={formData.yourContact}
                    onChange={handleInputChange}
                    className={`pl-16 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-gray-600 ${errors.yourContact ? 'border-red-500' : ''}`}
                    maxLength={10}
                  />
                </div>
                {errors.yourContact && (
                  <p className="text-sm text-red-400">{errors.yourContact}</p>
                )}
              </div>

              {/* Teacher's Name */}
              <div className="space-y-2">
                <Label htmlFor="teacherName" className="text-gray-200">Teacher's Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="teacherName"
                    name="teacherName"
                    type="text"
                    placeholder="FULL NAME"
                    value={formData.teacherName}
                    onChange={handleInputChange}
                    className={`pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-gray-600 ${errors.teacherName ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.teacherName && (
                  <p className="text-sm text-red-400">{errors.teacherName}</p>
                )}
              </div>

              {/* Teacher's Contact Number */}
              <div className="space-y-2">
                <Label htmlFor="teacherContact" className="text-gray-200">Teacher's Contact Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <div className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                    +91
                  </div>
                  <Input
                    id="teacherContact"
                    name="teacherContact"
                    type="tel"
                    placeholder=""
                    value={formData.teacherContact}
                    onChange={handleInputChange}
                    className={`pl-16 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-gray-600 ${errors.teacherContact ? 'border-red-500' : ''}`}
                    maxLength={10}
                  />
                </div>
                {errors.teacherContact && (
                  <p className="text-sm text-red-400">{errors.teacherContact}</p>
                )}
              </div>

              {/* Sign-in reminder */}
              {!user && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center gap-3">
                  <Lock className="w-5 h-5 text-yellow-500" />
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">
                    You need to sign in to submit a recommendation. You'll be redirected to sign in when you click "Send Message".
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-12 bg-black text-white hover:bg-gray-900" 
                disabled={loading}
              >
                {loading ? 'Sending...' : user ? 'Send Message' : 'Sign in to Submit'}
              </Button>
            </form>
            </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

