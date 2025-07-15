"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

const SAVED_PRODUCTS_KEY = "skinai-saved-products";

export function useSavedProducts() {
  const { toast } = useToast();
  const [savedProductIds, setSavedProductIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const storedItem = window.localStorage.getItem(SAVED_PRODUCTS_KEY);
      if (storedItem) {
        setSavedProductIds(JSON.parse(storedItem));
      }
    } catch (error) {
      console.error("Failed to read from localStorage", error);
      setSavedProductIds([]);
    }
  }, []);

  const isSaved = useCallback(
    (productId: string) => savedProductIds.includes(productId),
    [savedProductIds]
  );

  const toggleSave = useCallback(
    (productId: string, productName: string) => {
      let newSavedIds: string[] = [];
      const isCurrentlySaved = savedProductIds.includes(productId);

      if (isCurrentlySaved) {
        newSavedIds = savedProductIds.filter((id) => id !== productId);
        toast({ title: "Unsaved", description: `${productName} has been removed.` });
      } else {
        newSavedIds = [...savedProductIds, productId];
        toast({ title: "Saved!", description: `${productName} has been saved.` });
      }

      setSavedProductIds(newSavedIds);

      try {
        window.localStorage.setItem(SAVED_PRODUCTS_KEY, JSON.stringify(newSavedIds));
      } catch (error) {
        console.error("Failed to write to localStorage", error);
        // revert state if local storage fails
        setSavedProductIds(savedProductIds);
        toast({ variant: 'destructive', title: "Error", description: "Could not update saved products." });
      }
    },
    [savedProductIds, toast]
  );

  return { savedProductIds, isSaved, toggleSave };
}
