
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SavedProducts } from '@/components/saved-products';
import { Home, Leaf, LogIn, LogOut, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function SavedPage() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: "Logged out successfully."});
      router.push('/');
    } catch (error) {
      toast({ variant: 'destructive', title: "Error logging out.", description: (error as Error).message });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 pl-6">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">SkinAI Advisor</span>
          </Link>
          <nav className="flex items-center space-x-2 pr-6">
            <Button variant="ghost" asChild>
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
            </Button>
            {!loading &&
              (user ? (
                <Button onClick={handleLogout} variant="ghost">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/login">
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Register
                    </Link>
                  </Button>
                </>
              ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto py-8 px-4">
          <div className="max-w-4xl mx-auto">
            {user ? (
              <Card>
                <CardHeader>
                  <CardTitle>Your Saved Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <SavedProducts />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Please Log In</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>You need to be logged in to see your saved products.</p>
                  <Button asChild className="mt-4">
                    <Link href="/login">Login</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <footer className="py-6 md:px-8 md:py-0 bg-background border-t">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by a developer🤖.
          </p>
        </div>
      </footer>
    </div>
  );
}
