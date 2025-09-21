// 'use client';

// import { useState, useCallback, ChangeEvent, useRef } from 'react';
// import Image from 'next/image';
// import { analyzeSkinCondition } from '@/ai/flows/analyze-skin-condition';
// import { Button } from '@/components/ui/button';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Badge } from '@/components/ui/badge';
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import {
//   UploadCloud,
//   Sparkles,
//   AlertCircle,
//   Droplets,
//   Wind,
//   Bot,
//   Sun,
//   RefreshCw,
//   Loader,
// } from 'lucide-react';
// import { ProductCarousel } from './product-carousel';
// import { useAuth } from '@/hooks/use-auth';
// import { db } from '@/lib/firebase';
// import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
// import { useToast } from '@/hooks/use-toast';


// type AnalysisResult = {
//   concerns: string[];
//   report: string;
// };

// const concernIcons: { [key: string]: React.ElementType } = {
//   dryness: Wind,
//   oiliness: Droplets,
//   acne: AlertCircle,
//   wrinkles: RefreshCw,
//   'sun-damage': Sun,
//   default: Bot,
// };

// export function SkinAnalysisView() {
//   const [photo, setPhoto] = useState<File | null>(null);
//   const [photoPreview, setPhotoPreview] = useState<string | null>(null);
//   const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const { user } = useAuth();
//   const { toast } = useToast();
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setPhoto(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPhotoPreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//       setAnalysis(null);
//       setError(null);
//     }
//   };

//   const saveAnalysisToFirestore = async (result: AnalysisResult, photoDataUri: string) => {
//     if (!user) return;
//     try {
//       const historyRef = collection(db, "users", user.uid, "analysisHistory");
//       await addDoc(historyRef, {
//         ...result,
//         photoDataUri,
//         timestamp: serverTimestamp(),
//       });
//       toast({ title: "Analysis Saved", description: "Your analysis report has been saved to your history." });
//     } catch (e) {
//       console.error("Error saving analysis to Firestore: ", e);
//       toast({ variant: 'destructive', title: "Save Failed", description: "Could not save your analysis to your history." });
//     }
//   };


//   const handleAnalysis = useCallback(async () => {
//     if (!photo) return;

//     setIsLoading(true);
//     setError(null);

//     const reader = new FileReader();
//     reader.readAsDataURL(photo);
//     reader.onloadend = async () => {
//       const photoDataUri = reader.result as string;
//       let historyDocRef;

//       try {
//         // If user is logged in, create a pending record first
//         if (user) {
//           try {
//             const historyRef = collection(db, 'users', user.uid, 'analysisHistory');
//             historyDocRef = await addDoc(historyRef, {
//               photoDataUri,
//               timestamp: serverTimestamp(),
//               status: 'pending', // To indicate analysis is in progress
//               concerns: [],
//               report: 'Analysis in progress...',
//             });
//           } catch (e) {
//              console.error("Error creating pending analysis record: ", e);
//              // We can proceed without saving, but we'll show a toast.
//              toast({ variant: 'destructive', title: "Save Failed", description: "Could not create a record to save your analysis." });
//           }
//         }
        
//         // Perform the AI analysis
//         const result = await analyzeSkinCondition({ photoDataUri });
//         setAnalysis(result);
        
//         // If a pending record was created, update it with the analysis result
//         if (historyDocRef) {
//           await updateDoc(historyDocRef, {
//             ...result,
//             status: 'completed',
//           });
//           toast({ title: "Analysis Saved", description: "Your analysis report has been saved to your history." });
//         } else if (user) {
//             // This case handles if the initial pending save failed but we still want to try saving the final result.
//             await saveAnalysisToFirestore(result, photoDataUri)
//         }

//       } catch (e) {
//         setError('An error occurred during analysis. Please try again.');
//         console.error(e);
//         // If analysis fails, update the record to reflect failure
//         if (historyDocRef) {
//           await updateDoc(historyDocRef, {
//             status: 'failed',
//             report: 'Analysis failed. Please try again.',
//           });
//         }
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     reader.onerror = () => {
//         setError('An error occurred reading the file. Please try again.');
//         setIsLoading(false);
//     }
//   }, [photo, user, toast]);

//   const resetState = () => {
//     setPhoto(null);
//     setPhotoPreview(null);
//     setAnalysis(null);
//     setIsLoading(false);
//     setError(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   const renderContent = () => {
//     if (isLoading) {
//       return (
//         <Card>
//           <CardContent className="flex flex-col items-center justify-center p-12 gap-4">
//             <Loader className="w-12 h-12 animate-spin text-primary" />
//             <div className="text-center">
//               <p className="text-lg font-medium">Analyzing your skin...</p>
//               <p className="text-sm text-muted-foreground">This may take a few moments.</p>
//             </div>
//           </CardContent>
//         </Card>
//       );
//     }

//     if (error) {
//       return (
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertTitle>Analysis Failed</AlertTitle>
//           <AlertDescription>{error}</AlertDescription>
//           <Button onClick={resetState} variant="outline" className="mt-4">Try Again</Button>
//         </Alert>
//       );
//     }

//     if (analysis) {
//       return (
//         <div className="space-y-8">
//           <Card className="overflow-hidden">
//             <CardHeader>
//               <CardTitle className="text-2xl flex items-center gap-2">
//                 <Bot className="text-primary" /> Your Skin Analysis Report
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div>
//                 <h3 className="font-semibold text-lg mb-2">
//                   Identified Concerns
//                 </h3>
//                 <div className="flex flex-wrap gap-2">
//                   {analysis.concerns.length > 0 ? (
//                     analysis.concerns.map((concern) => {
//                       const Icon =
//                         concernIcons[
//                           concern.toLowerCase().replace(/\s+/g, '-')
//                         ] || concernIcons.default;
//                       return (
//                         <Badge
//                           variant="secondary"
//                           key={concern}
//                           className="text-base py-1 px-3"
//                         >
//                           <Icon className="w-4 h-4 mr-2" />
//                           {concern}
//                         </Badge>
//                       );
//                     })
//                   ) : (
//                     <p className="text-muted-foreground">
//                       No specific concerns identified.
//                     </p>
//                   )}
//                 </div>
//               </div>
//               <div>
//                 <h3 className="font-semibold text-lg mb-2">
//                   Detailed Assessment
//                 </h3>
//                 <p className="text-muted-foreground whitespace-pre-wrap">
//                   {analysis.report}
//                 </p>
//               </div>
//             </CardContent>
//           </Card>
//           <ProductCarousel concerns={analysis.concerns} />
//           <div className="text-center pt-4">
//             <Button onClick={resetState} variant="outline">
//               Start New Analysis
//             </Button>
//           </div>
//         </div>
//       );
//     }

//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>Start Your Skin Analysis</CardTitle>
//           <CardDescription>
//             Upload a clear, well-lit photo of your face for the most accurate
//             results.
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="photo-upload" className="cursor-pointer">
//               <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted rounded-lg p-10 text-center hover:border-primary transition-colors">
//                 {photoPreview ? (
//                   <div className="relative w-48 h-48 rounded-full overflow-hidden">
//                     <Image
//                       src={photoPreview}
//                       alt="Selected photo"
//                       fill
//                       className="object-cover"
//                     />
//                   </div>
//                 ) : (
//                   <>
//                     <UploadCloud className="w-12 h-12 text-muted-foreground" />
//                     <span className="mt-2 font-medium">
//                       Click to upload a photo
//                     </span>
//                     <span className="text-xs text-muted-foreground">
//                       PNG, JPG, or WEBP
//                     </span>
//                   </>
//                 )}
//               </div>
//             </Label>
//             <Input
//               id="photo-upload"
//               type="file"
//               accept="image/png, image/jpeg, image/webp"
//               className="sr-only"
//               onChange={handlePhotoChange}
//               ref={fileInputRef}
//             />
//           </div>
//           <Button
//             onClick={handleAnalysis}
//             disabled={!photo || isLoading}
//             className="w-full"
//           >
//             <Sparkles className="mr-2 h-4 w-4" />
//             Analyze with AI
//           </Button>
//         </CardContent>
//       </Card>
//     );
//   };

//   return (
//     <div className="container mx-auto py-8 px-4">
//       <div className="max-w-2xl mx-auto">{renderContent()}</div>
//     </div>
//   );
// }


'use client';

import { useState, useCallback, ChangeEvent, useRef } from 'react';
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
import {
  UploadCloud,
  Sparkles,
  AlertCircle,
  Droplets,
  Wind,
  Bot,
  Sun,
  RefreshCw,
  Loader,
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const getPhotoDataUri = (photoFile: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read file as Data URI'));
        }
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(photoFile);
    });
  };

  const handleAnalysis = useCallback(async () => {
    if (!photo) return;

    setIsLoading(true);
    setError(null);

    try {
      const photoDataUri = await getPhotoDataUri(photo);
      const result = await analyzeSkinCondition({ photoDataUri });
      
      setAnalysis(result);

      if (user) {
        await saveAnalysisToFirestore(result, photoDataUri);
      }
    } catch (e) {
      console.error(e);
      setError('An error occurred during analysis. Please try again.');
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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12 gap-4">
            <Loader className="w-12 h-12 animate-spin text-primary" />
            <div className="text-center">
              <p className="text-lg font-medium">Analyzing your skin...</p>
              <p className="text-sm text-muted-foreground">This may take a few moments.</p>
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
          <Button onClick={resetState} variant="outline" className="mt-4">Try Again</Button>
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
                      fill
                      className="object-cover"
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
              ref={fileInputRef}
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


    
