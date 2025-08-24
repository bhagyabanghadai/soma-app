import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Signup = () => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #d9f0c4 0%, #a67c52 100%)',
      }}
    >
      <Card className="w-full max-w-md card-3d">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden border-2 border-[#57A639]">
            <img 
              src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
              alt="SOMA Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-[#4B3F2F]">Join SOMA</CardTitle>
          <p className="text-[#4D4D4D]">Start your smart farming journey today</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="Enter your full name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Create a password" />
          </div>
          <Button className="w-full bg-[#F4D35E] hover:bg-yellow-500 text-gray-900 font-bold">
            Create Account
          </Button>
          <div className="text-center">
            <span className="text-[#4D4D4D]">Already have an account? </span>
            <Link href="/login" className="text-[#57A639] hover:underline font-medium">
              Sign in →
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;