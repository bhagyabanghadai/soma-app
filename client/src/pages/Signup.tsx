import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Users, Shield } from "lucide-react";

const Signup = () => {
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
      {/* Floating farm elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse">
          <Leaf className="w-8 h-8 text-green-400" />
        </div>
        <div className="absolute bottom-32 right-20 w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse" style={{ animationDelay: '2s' }}>
          <Users className="w-7 h-7 text-green-400" />
        </div>
      </div>

      <Card className="w-full max-w-md shadow-2xl bg-white/95 backdrop-blur-md border border-white/20">
        <CardHeader className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-green-600 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
            <Leaf className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">Join SOMA</CardTitle>
          <p className="text-gray-700">Start your smart farming revolution today</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-800 font-medium">Full Name</Label>
            <Input 
              id="name" 
              placeholder="Enter your full name" 
              className="border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-800 font-medium">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="Enter your email" 
              className="border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-800 font-medium">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="Create a strong password" 
              className="border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-sm text-green-800 font-medium">Your data is secure and protected</span>
            </div>
          </div>

          <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 text-lg shadow-lg">
            Create Your Account
          </Button>
          
          <div className="text-center">
            <span className="text-gray-700">Already transforming your farm? </span>
            <Link href="/login" className="text-green-600 hover:text-green-700 hover:underline font-medium">
              Sign in here →
            </Link>
          </div>
          
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Join 10,000+ farmers already using SOMA
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;