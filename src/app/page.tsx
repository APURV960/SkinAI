'use client';
import {useState} from 'react';
import { SkinAnalysisView } from '@/components/skin-analysis-view';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Leaf, LogIn, LogOut, UserPlus, History, Sparkles, ShieldCheck, Microscope, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';


export default function Home_Page() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: "Logged out successfully."});
    } catch (error) {
      toast({ variant: 'destructive', title: "Error logging out.", description: (error as Error).message });
    }
  };

  const LoggedOutView = () => (
    <div className="container mx-auto py-8 px-4 text-center">
      <div className="max-w-4xl mx-auto">
        <Leaf className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
          Welcome to SkinAI Advisor
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Your personal AI-powered skincare companion. Get detailed insights into your skin's health and receive personalized product recommendations.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/register">
              <UserPlus className="mr-2" /> Get Started
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/login">
              <LogIn className="mr-2" /> Login
            </Link>
          </Button>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
            <Card>
                <CardHeader className="items-center">
                    <div className="p-3 rounded-full bg-primary/10">
                        <Microscope className="h-8 w-8 text-primary"/>
                    </div>
                    <CardTitle>AI-Powered Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Upload a photo of your face and let our advanced AI analyze your skin for any concerns.
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="items-center">
                    <div className="p-3 rounded-full bg-primary/10">
                        <Sparkles className="h-8 w-8 text-primary"/>
                    </div>
                    <CardTitle>Personalized Reports</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Receive a detailed report on your skin's condition and track your progress over time with your personal history.
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="items-center">
                    <div className="p-3 rounded-full bg-primary/10">
                        <ShieldCheck className="h-8 w-8 text-primary"/>
                    </div>
                    <CardTitle>Product Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Get expert product recommendations tailored to your specific skin concerns to build your perfect skincare routine.
                    </p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pr-6 pl-6">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">SkinAI Advisor</span>
          </Link>
          <div className="md:hidden pr-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
          <nav className="hidden md:flex items-center space-x-2">
            {!loading &&
              (user ? (
                <>
                   <Button variant="ghost" asChild className="w-full" onClick={() => setIsMenuOpen(false)}>
                    <Link href="/history">
                      <History className="h-4 w-4 mr-2" />
                      History
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild className="w-full" onClick={() => setIsMenuOpen(false)}>
                    <Link href="/saved">
                      <Heart className="h-4 w-4 mr-2" />
                      Saved Products
                    </Link>
                  </Button>
                  <Button onClick={() => { handleLogout(); setIsMenuOpen(false); }} variant="ghost" className="w-full">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild className="w-full" onClick={() => setIsMenuOpen(false)}>
                    <Link href="/login">
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild className="w-full" onClick={() => setIsMenuOpen(false)}>
                    <Link href="/register">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Register
                    </Link>
                  </Button>
                </>
              ))}
          </nav>
        </div>
        {isMenuOpen && (
          <div className="md:hidden">
            <nav className="flex flex-col items-center space-y-2 py-4 border-t">
              {!loading &&
                (user ? (
                  <>
                    <Button variant="ghost" asChild className="w-full">
                      <Link href="/history">
                        <History className="h-4 w-4 mr-2" />
                        History
                      </Link>
                    </Button>
                    <Button variant="ghost" asChild className="w-full">
                      <Link href="/saved">
                        <Heart className="h-4 w-4 mr-2" />
                        Saved Products
                      </Link>
                    </Button>
                    <Button onClick={handleLogout} variant="ghost" className="w-full">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" asChild className="w-full">
                      <Link href="/login">
                        <LogIn className="h-4 w-4 mr-2" />
                        Login
                      </Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link href="/register">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Register
                      </Link>
                    </Button>
                  </>
                ))}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        { user ? <SkinAnalysisView /> : <LoggedOutView /> }
      </main>

      <footer className="py-6 md:px-8 md:py-0 bg-background border-t">
        <div className="container md:h-16 flex items-center justify-center">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
             Built by a developer🤖.
          </p>
        </div>
      </footer>
    </div>
  );
}
