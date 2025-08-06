
"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, arrayUnion, arrayRemove } from "firebase/firestore";

const GUEST_SAVED_PRODUCTS_KEY = "skinai-guest-saved-products";

export function useSavedProducts() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [savedProductIds, setSavedProductIds] = useState<string[]>([]);

  const getSavedProductsFromFirestore = useCallback(async (userId: string) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        return userDoc.data().savedProducts || [];
      }
    } catch (error) {
      console.error("Failed to read from Firestore", error);
      toast({ variant: "destructive", title: "Error", description: "Could not fetch saved products." });
    }
    return [];
  }, [toast]);
  
  useEffect(() => {
    const loadSavedProducts = async () => {
      if (user) {
        // User is logged in, fetch from Firestore
        const firestoreIds = await getSavedProductsFromFirestore(user.uid);
        
        // Check for guest products in local storage
        const guestItem = window.localStorage.getItem(GUEST_SAVED_PRODUCTS_KEY);
        const guestIds = guestItem ? JSON.parse(guestItem) : [];

        if (guestIds.length > 0) {
          // Merge guest products with firestore products
          const mergedIds = [...new Set([...firestoreIds, ...guestIds])];
          const userDocRef = doc(db, "users", user.uid);
          await setDoc(userDocRef, { savedProducts: mergedIds }, { merge: true });
          setSavedProductIds(mergedIds);
          window.localStorage.removeItem(GUEST_SAVED_PRODUCTS_KEY);
        } else {
          setSavedProductIds(firestoreIds);
        }
      } else {
        // User is a guest, use local storage
        try {
          const storedItem = window.localStorage.getItem(GUEST_SAVED_PRODUCTS_KEY);
          if (storedItem) {
            setSavedProductIds(JSON.parse(storedItem));
          } else {
            setSavedProductIds([]);
          }
        } catch (error) {
          console.error("Failed to read from localStorage", error);
          setSavedProductIds([]);
        }
      }
    };

    loadSavedProducts();
  }, [user, getSavedProductsFromFirestore]);

  const isSaved = useCallback(
    (productId: string) => savedProductIds.includes(productId),
    [savedProductIds]
  );

  const toggleSave = useCallback(
    async (productId: string, productName: string) => {
      if (user) {
        // Logged-in user logic (Firestore)
        const userDocRef = doc(db, "users", user.uid);
        const isCurrentlySaved = savedProductIds.includes(productId);
        
        try {
          if (isCurrentlySaved) {
            await setDoc(userDocRef, { savedProducts: arrayRemove(productId) }, { merge: true });
            setSavedProductIds(ids => ids.filter(id => id !== productId));
            toast({ title: "Unsaved", description: `${productName} has been removed.` });
          } else {
            await setDoc(userDocRef, { savedProducts: arrayUnion(productId) }, { merge: true });
            setSavedProductIds(ids => [...ids, productId]);
            toast({ title: "Saved!", description: `${productName} has been saved.` });
          }
        } catch (error) {
           toast({ variant: 'destructive', title: "Error", description: "Could not update saved products." });
        }
      } else {
        // Guest user logic (local storage)
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
          window.localStorage.setItem(GUEST_SAVED_PRODUCTS_KEY, JSON.stringify(newSavedIds));
        } catch (error) {
          console.error("Failed to write to localStorage", error);
          setSavedProductIds(savedProductIds); // revert
          toast({ variant: 'destructive', title: "Error", description: "Could not update saved products." });
        }
      }
    },
    [savedProductIds, toast, user]
  );

  return { savedProductIds, isSaved, toggleSave };
}
