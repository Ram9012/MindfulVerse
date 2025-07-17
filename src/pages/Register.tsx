import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import AnimatedBackground from '@/components/ui/animated-background';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: 'Password mismatch',
        description: 'Passwords do not match. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      await register(username, email, password);
      toast({
        title: 'Registration successful',
      });
      navigate('/login');
    } catch (error) {
      console.error('Registration error details:', error);
      let errorMessage = 'Could not create account. Please try again.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'error' in error) {
        // Handle API error response format
        errorMessage = String((error as {error: string}).error);
      }
      
      toast({
        title: 'Registration failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2D1E45] to-[#4A3768] flex items-center justify-center p-4 relative">
      <AnimatedBackground />
      <div className="w-full max-w-md space-y-6 bg-white/95 p-8 rounded-3xl shadow-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-purple-500/20">
        <div className="text-center space-y-2">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#7B5BA8] to-[#9B7ED1] p-1">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <span className="text-3xl">🧘</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[#2D1E45]">Mindful Verse</h1>
          <p className="text-[#4A3768]/80">Create your mindfulness journey</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[#2D1E45]">
                Name
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1 bg-white border-[#7B5BA8]/20 text-[#2D1E45] placeholder:text-[#4A3768]/50 focus:border-[#7B5BA8] focus:ring-[#7B5BA8] transition-colors duration-200"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#2D1E45]">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 bg-white border-[#7B5BA8]/20 text-[#2D1E45] placeholder:text-[#4A3768]/50 focus:border-[#7B5BA8] focus:ring-[#7B5BA8] transition-colors duration-200"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#2D1E45]">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 bg-white border-[#7B5BA8]/20 text-[#2D1E45] placeholder:text-[#4A3768]/50 focus:border-[#7B5BA8] focus:ring-[#7B5BA8] transition-colors duration-200"
                placeholder="Create a password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#2D1E45]">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 bg-white border-[#7B5BA8]/20 text-[#2D1E45] placeholder:text-[#4A3768]/50 focus:border-[#7B5BA8] focus:ring-[#7B5BA8] transition-colors duration-200"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#7B5BA8] to-[#9B7ED1] hover:from-[#9B7ED1] hover:to-[#7B5BA8] transition-all duration-300 text-white shadow-lg hover:shadow-purple-500/50 transform hover:-translate-y-0.5"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Register'}
          </Button>

          <div className="text-center mt-4">
            <p className="text-[#4A3768]/80">
              Already have an account?{' '}
              <Link to="/login" className="text-[#7B5BA8] hover:text-[#9B7ED1] font-medium transition-colors duration-300">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
  };

export default Register;