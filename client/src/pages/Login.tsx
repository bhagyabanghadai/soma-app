import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Shield } from "lucide-react";

const Login = () => {
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
          <div className="w-20 h-20 mx-auto mb-4 bg-green-600 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
            <Leaf className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">Welcome Back</CardTitle>
          <p className="text-gray-700">Sign in to your SOMA account</p>
        </CardHeader>
        <CardContent className="space-y-6">
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
              placeholder="Enter your password" 
              className="border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input type="checkbox" id="remember" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-700">Remember me</label>
            </div>
            <a href="#" className="text-sm text-green-600 hover:text-green-700 hover:underline">
              Forgot password?
            </a>
          </div>

          <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 text-lg shadow-lg">
            Sign In
          </Button>
          
          <div className="text-center">
            <span className="text-gray-700">New to SOMA? </span>
            <Link href="/signup" className="text-green-600 hover:text-green-700 hover:underline font-medium">
              Create an account →
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

export default Login;