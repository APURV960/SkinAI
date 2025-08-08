
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';

export type AnalysisRecord = {
  id: string;
  concerns: string[];
  report: string;
  photoDataUri?: string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  } | null;
};

export function AnalysisHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const historyRef = collection(db, "users", user.uid, "analysisHistory");
        const q = query(historyRef, orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        const historyData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AnalysisRecord));
        setHistory(historyData);
      } catch (error) {
        console.error("Error fetching analysis history: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        <p>You have no saved analysis reports.</p>
        <p>Go to the homepage to perform your first analysis!</p>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {history.map((record) => (
        <AccordionItem value={record.id} key={record.id}>
          <AccordionTrigger>
            <div className="flex justify-between w-full pr-4">
                <span>
                  Analysis from{' '}
                  {record.timestamp ? (
                    format(new Date(record.timestamp.seconds * 1000), 'PPP')
                  ) : (
                    'a few moments ago'
                  )}
                </span>
                <span className="text-sm text-muted-foreground">{record.concerns.length} concern(s)</span>
            </div>
            </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-6">
              {record.photoDataUri && (
                <div className="md:col-span-1">
                  <h4 className="font-semibold mb-2">Analysis Photo</h4>
                  <div className="relative aspect-square w-full rounded-lg overflow-hidden">
                    <Image
                    src={record.photoDataUri}
                    alt="analyzed photo"
                    fill
                    className="object-cover"
                    sizes="(max-width:760px) 100 vw, 33vw"
                    />
                  </div>
                </div>
              )}
              <div className={record.photoDataUri ? "md:col-span-2" : "md:col-span-3"}>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Identified Concerns:</h4>
                    <div className="flex flex-wrap gap-2">
                      {record.concerns.map((concern, index) => (
                        <Badge key={index} variant="secondary">{concern}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">AI Report:</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{record.report}</p>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
