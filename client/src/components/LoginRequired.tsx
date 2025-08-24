import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, User, ArrowRight } from "lucide-react";

interface LoginRequiredProps {
  feature: string;
}

const LoginRequired = ({ feature }: LoginRequiredProps) => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1464822759798-6a8b28bbfe9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <Card className="w-full max-w-md shadow-2xl bg-white/95 backdrop-blur-md border border-white/20">
        <CardHeader className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-yellow-500 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">Login Required</CardTitle>
          <p className="text-gray-700">Access to {feature} requires authentication</p>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-center">
              <User className="w-5 h-5 text-yellow-600 mr-2" />
              <span className="text-sm text-yellow-800 font-medium">Premium Feature</span>
            </div>
          </div>

          <p className="text-gray-600">
            To access {feature} and other advanced farming tools, please sign up or log in to your SOMA account.
          </p>
          
          <div className="space-y-4">
            <Link href="/signup">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 text-lg shadow-lg">
                Create Account
              </Button>
            </Link>
            
            <Link href="/login">
              <Button 
                variant="outline"
                className="w-full border-green-600 text-green-600 hover:bg-green-50 font-bold py-3 text-lg"
              >
                Sign In
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="text-center pt-4 border-t border-gray-200">
            <Link href="/" className="text-sm text-green-600 hover:text-green-700 hover:underline">
              ← Back to Homepage
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginRequired;