import { useEffect } from "react";
import { useLocation } from "wouter";
import { completeMagicLinkSignIn } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

export default function MagicLinkCallback() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const completeSignIn = async () => {
      try {
        const user = await completeMagicLinkSignIn();
        if (user) {
          toast({
            title: "Success!",
            description: "You have been successfully signed in.",
          });
          setLocation("/dashboard");
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        setLocation("/login");
      }
    };

    completeSignIn();
  }, [setLocation, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50">
      <Card className="w-[350px]">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
          <p className="text-center mt-4">Completing sign in...</p>
        </CardContent>
      </Card>
    </div>
  );
}
