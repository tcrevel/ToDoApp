import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuthStore } from "@/lib/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { resendVerificationEmail } from "@/lib/auth";
import { auth } from "@/lib/firebase";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const { user, loading } = useAuthStore();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/login");
    }
  }, [user, loading, setLocation]);

  const handleResendVerification = async () => {
    try {
      if (auth.currentUser) {
        await resendVerificationEmail(auth.currentUser);
        toast({
          title: "Verification Email Sent",
          description: "Please check your inbox and verify your email address.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (user && !user.emailVerified && user.email && !user.email.endsWith('@gmail.com')) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert className="max-w-md">
          <AlertDescription className="space-y-4">
            <p>Please verify your email address to access the dashboard.</p>
            <p className="text-sm text-muted-foreground">
              Can't find the verification email?
            </p>
            <Button variant="outline" onClick={handleResendVerification}>
              Resend Verification Email
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return user ? <>{children}</> : null;
}