import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import AnimatedBackground from '@/components/ui/animated-background';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserRound, Stethoscope } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState('patient');
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password, userType);
      toast({
        title: 'Login successful',
        description: `Welcome back to Mindful Verse!`,
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'Invalid credentials. Please try again.',
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
          <p className="text-[#4A3768]/80">Your daily dose of mindfulness</p>
        </div>

        <Tabs defaultValue="patient" className="w-full" onValueChange={(value) => setUserType(value)}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="patient" className="flex items-center gap-2">
              <UserRound size={16} />
              <span>Patient</span>
            </TabsTrigger>
            <TabsTrigger value="therapist" className="flex items-center gap-2">
              <Stethoscope size={16} />
              <span>Therapist</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="patient">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="patient-email" className="block text-sm font-medium text-[#2D1E45]">
                    Email
                  </label>
                  <Input
                    id="patient-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 bg-white border-[#7B5BA8]/20 text-[#2D1E45] placeholder:text-[#4A3768]/50 focus:border-[#7B5BA8] focus:ring-[#7B5BA8] transition-colors duration-200"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="patient-password" className="block text-sm font-medium text-[#2D1E45]">
                    Password
                  </label>
                  <Input
                    id="patient-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1 bg-white border-[#7B5BA8]/20 text-[#2D1E45] placeholder:text-[#4A3768]/50 focus:border-[#7B5BA8] focus:ring-[#7B5BA8] transition-colors duration-200"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#7B5BA8] to-[#9B7ED1] hover:from-[#9B7ED1] hover:to-[#7B5BA8] transition-all duration-300 text-white shadow-lg hover:shadow-purple-500/50 transform hover:-translate-y-0.5"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Login as Patient'}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="therapist">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="therapist-email" className="block text-sm font-medium text-[#2D1E45]">
                    Email
                  </label>
                  <Input
                    id="therapist-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 bg-white border-[#7B5BA8]/20 text-[#2D1E45] placeholder:text-[#4A3768]/50 focus:border-[#7B5BA8] focus:ring-[#7B5BA8] transition-colors duration-200"
                    placeholder="Enter your therapist email"
                  />
                </div>

                <div>
                  <label htmlFor="therapist-password" className="block text-sm font-medium text-[#2D1E45]">
                    Password
                  </label>
                  <Input
                    id="therapist-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1 bg-white border-[#7B5BA8]/20 text-[#2D1E45] placeholder:text-[#4A3768]/50 focus:border-[#7B5BA8] focus:ring-[#7B5BA8] transition-colors duration-200"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#7B5BA8] to-[#9B7ED1] hover:from-[#9B7ED1] hover:to-[#7B5BA8] transition-all duration-300 text-white shadow-lg hover:shadow-purple-500/50 transform hover:-translate-y-0.5"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Login as Therapist'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

          <div className="text-center mt-4">
            <p className="text-[#4A3768]/80">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#7B5BA8] hover:text-[#9B7ED1] font-medium transition-colors duration-300">
                Register here
              </Link>
            </p>
          </div>
      </div>
    </div>
  );
};

export default Login;