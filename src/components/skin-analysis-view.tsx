
'use client';

import { useState, useCallback, ChangeEvent } from 'react';
import Image from 'next/image';
import { analyzeSkinCondition } from '@/ai/flows/analyze-skin-condition';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  UploadCloud,
  Sparkles,
  AlertCircle,
  Droplets,
  Wind,
  Bot,
  Sun,
  RefreshCw,
} from 'lucide-react';
import { ProductCarousel } from './product-carousel';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';


type AnalysisResult = {
  concerns: string[];
  report: string;
};

const concernIcons: { [key: string]: React.ElementType } = {
  dryness: Wind,
  oiliness: Droplets,
  acne: AlertCircle,
  wrinkles: RefreshCw,
  'sun-damage': Sun,
  default: Bot,
};

export function SkinAnalysisView() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const { toast } = useToast();

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setAnalysis(null);
      setError(null);
    }
  };

  const saveAnalysisToFirestore = async (result: AnalysisResult, photoDataUri: string) => {
    if (!user) return;
    try {
      const historyRef = collection(db, "users", user.uid, "analysisHistory");
      await addDoc(historyRef, {
        ...result,
        photoDataUri,
        timestamp: serverTimestamp(),
      });
      toast({ title: "Analysis Saved", description: "Your analysis report has been saved to your history." });
    } catch (e) {
      console.error("Error saving analysis to Firestore: ", e);
      toast({ variant: 'destructive', title: "Save Failed", description: "Could not save your analysis to your history." });
    }
  };


  const handleAnalysis = useCallback(async () => {
    if (!photo) return;
    setIsLoading(true);
    setError(null);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(photo);
      reader.onload = async () => {
        const photoDataUri = reader.result as string;
        const result = await analyzeSkinCondition({ photoDataUri });
        setAnalysis(result);
        if (user) {
          await saveAnalysisToFirestore(result, photoDataUri);
        }
      };
    } catch (e) {
      setError('An error occurred during analysis. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [photo, user]);

  const resetState = () => {
    setPhoto(null);
    setPhotoPreview(null);
    setAnalysis(null);
    setIsLoading(false);
    setError(null);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="flex gap-2 pt-4">
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
          </CardContent>
        </Card>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Analysis Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    if (analysis) {
      return (
        <div className="space-y-8">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Bot className="text-primary" /> Your Skin Analysis Report
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Identified Concerns
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.concerns.length > 0 ? (
                    analysis.concerns.map((concern) => {
                      const Icon =
                        concernIcons[
                          concern.toLowerCase().replace(/\s+/g, '-')
                        ] || concernIcons.default;
                      return (
                        <Badge
                          variant="secondary"
                          key={concern}
                          className="text-base py-1 px-3"
                        >
                          <Icon className="w-4 h-4 mr-2" />
                          {concern}
                        </Badge>
                      );
                    })
                  ) : (
                    <p className="text-muted-foreground">
                      No specific concerns identified.
                    </p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Detailed Assessment
                </h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {analysis.report}
                </p>
              </div>
            </CardContent>
          </Card>
          <ProductCarousel concerns={analysis.concerns} />
          <div className="text-center pt-4">
            <Button onClick={resetState} variant="outline">
              Start New Analysis
            </Button>
          </div>
        </div>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Start Your Skin Analysis</CardTitle>
          <CardDescription>
            Upload a clear, well-lit photo of your face for the most accurate
            results.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="photo-upload" className="cursor-pointer">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted rounded-lg p-10 text-center hover:border-primary transition-colors">
                {photoPreview ? (
                  <div className="relative w-48 h-48 rounded-full overflow-hidden">
                    <Image
                      src={photoPreview}
                      alt="Selected photo"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-12 h-12 text-muted-foreground" />
                    <span className="mt-2 font-medium">
                      Click to upload a photo
                    </span>
                    <span className="text-xs text-muted-foreground">
                      PNG, JPG, or WEBP
                    </span>
                  </>
                )}
              </div>
            </Label>
            <Input
              id="photo-upload"
              type="file"
              accept="image/png, image/jpeg, image/webp"
              className="sr-only"
              onChange={handlePhotoChange}
            />
          </div>
          <Button
            onClick={handleAnalysis}
            disabled={!photo || isLoading}
            className="w-full"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Analyze with AI
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">{renderContent()}</div>
    </div>
  );
}
