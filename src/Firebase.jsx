import React, { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  addDoc,
  query,
  where,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirebaseErrorMessage } from "./utils/firebaseErrors";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBubKtu0lfWzSBt5xwNCArOGjKIxnkbsWc",
  authDomain: "nutrinuma.firebaseapp.com",
  projectId: "nutrinuma",
  storageBucket: "nutrinuma.appspot.com",
  messagingSenderId: "651443585686",
  appId: "1:651443585686:web:ed83f16df3ded392b238b7",
  measurementId: "G-5R6KHGJD2T",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Create context
const FirebaseContext = createContext();

// Custom hook to use Firebase
export const useFirebase = () => useContext(FirebaseContext);

// Provider component
export const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser?.emailVerified) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const newUser = {
              ...currentUser,
              isAdmin: userData.isAdmin || false,
            };
            console.log("Logged in user:", newUser); // Add this line
            setUser(newUser);
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const userDocRef = doc(db, "users", userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // If the user document doesn't exist, create it
        await setDoc(userDocRef, {
          email: userCredential.user.email,
          isAdmin: false,
          isVerified: true,
          isFormSubmitted: false,
        });
      }

      // Fetch the user document to ensure the state is updated correctly
      const updatedUserDoc = await getDoc(userDocRef);
      setUser({
        ...userCredential.user,
        isAdmin: updatedUserDoc.data().isAdmin || false,
      });

      return userCredential;
    } catch (error) {
      throw new Error(getFirebaseErrorMessage(error.code));
    }
  };

  const signUpWithEmail = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await sendEmailVerification(userCredential.user);
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: email,
        isVerified: false,
        isFormSubmitted: false,
        isAdmin: false,
      });
      await signOut(auth); // Sign out immediately after creating the user and sending the verification email
      return userCredential;
    } catch (error) {
      throw new Error(getFirebaseErrorMessage(error.code));
    }
  };

  const signInWithEmail = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      if (!userCredential.user.emailVerified) {
        await signOut(auth);
        throw new Error("auth/operation-not-allowed");
      }
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      if (!userDoc.exists()) {
        await signOut(auth);
        throw new Error("auth/operation-not-allowed");
      }
      if (userDoc.data().isVerified === false) {
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email: email,
          isVerified: true,
          isFormSubmitted: false,
          isAdmin: false,
        });
      }
      return userCredential;
    } catch (error) {
      throw new Error(getFirebaseErrorMessage(error.code));
    }
  };

  const resetPassword = async (email) => {
    try {
      const userSnapshot = await getDocs(collection(db, "users"));
      const userData = userSnapshot.docs
        .map((doc) => doc.data())
        .find((user) => user.email === email);
      if (!userData) {
        throw new Error("auth/user-not-found");
      }
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw new Error(getFirebaseErrorMessage(error.code));
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null); // Reset user state on sign out
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const fetchCollection = async (collectionName) => {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    const data = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    return data;
  };

  const saveFormResponse = async (userId, formResponse) => {
    const responseRef = doc(
      db,
      `users/${userId}/formresponse`,
      `${new Date().toISOString()}`,
    );
    await setDoc(responseRef, formResponse);
  };

  const markFormAsSubmitted = async (userId) => {
    const userRef = doc(db, `users/${userId}`);
    await updateDoc(userRef, {
      isFormSubmitted: true,
    });
  };

  const uploadFile = async (file) => {
    if (!file) return null;
    const fileRef = ref(storage, `uploads/${file.name}`);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
  };

  const fetchUserData = async (userId) => {
    const userDoc = await getDoc(doc(db, "users", userId));
    return userDoc.exists() ? userDoc.data() : null;
  };

  const fetchAllUserDetails = async () => {
    const usersCollection = collection(db, "users");
    const usersSnapshot = await getDocs(usersCollection);
    const users = [];

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const formResponsesSnapshot = await getDocs(
        collection(db, `users/${userDoc.id}/formresponse`),
      );
      const formResponses = formResponsesSnapshot.docs.map((doc) => doc.data());

      users.push({
        ...userData,
        id: userDoc.id,
        formResponses: formResponses,
      });
    }

    return users;
  };

  const fetchUserDetails = async (userId) => {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists()) {
      throw new Error("User not found");
    }
    const userData = userDoc.data();

    const formResponsesSnapshot = await getDocs(
      collection(db, `users/${userId}/formresponse`),
    );
    const formResponses = formResponsesSnapshot.docs.map((doc) => doc.data());

    const dietPlansSnapshot = await getDocs(
      collection(db, `users/${userId}/dietPlans`),
    );
    const dietPlans = dietPlansSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    return {
      ...userData,
      id: userId,
      formResponses: formResponses,
      dietPlans: dietPlans,
    };
  };

  const saveDietPlanForSpecificUser = async (userId, selectedWeek) => {
    const dietPlanRef = doc(
      db,
      `users/${userId}/dietPlans`,
      `${selectedWeek.startDate}`,
    );

    const dietPlanSnapshot = await getDoc(dietPlanRef);

    if (dietPlanSnapshot.exists()) {
      // If the diet plan already exists, update it
      await updateDoc(dietPlanRef, selectedWeek);
    } else {
      // If the diet plan doesn't exist, create it
      await setDoc(dietPlanRef, selectedWeek);
    }
  };

  const saveCustomDietPlan = async (newMeal) => {
    const customDietPlansRef = collection(db, "customDietPlans");
    const nameLowerCase = newMeal.name.toLowerCase();

    // Check if the custom diet plan with the same name already exists
    const existingPlansQuery = query(
      customDietPlansRef,
      where("nameLowerCase", "==", nameLowerCase),
    );
    const existingPlansSnapshot = await getDocs(existingPlansQuery);

    if (!existingPlansSnapshot.empty) {
      throw new Error(
        "This custom diet plan already exists. Please try saving with a different name.",
      );
    }

    // If no duplicate found, save the new custom diet plan
    await addDoc(customDietPlansRef, {
      ...newMeal,
      nameLowerCase,
    });
  };

  // Fetch all custom meals
  const fetchCustomMeals = async () => {
    const customDietPlansRef = collection(db, "customDietPlans");
    const snapshot = await getDocs(customDietPlansRef);
    const customMeals = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return customMeals;
  };

  // Fetch custom meals by name
  const fetchCustomMealsByName = async (name) => {
    const customDietPlansRef = collection(db, "customDietPlans");
    const nameLowerCase = name.toLowerCase();

    const queryByName = query(
      customDietPlansRef,
      where("nameLowerCase", "==", nameLowerCase),
    );
    const snapshot = await getDocs(queryByName);

    const customMeals = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return customMeals;
  };

  return (
    <FirebaseContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signUpWithEmail,
        signInWithEmail,
        resetPassword,
        logout,
        fetchCollection,
        saveFormResponse,
        markFormAsSubmitted,
        uploadFile,
        fetchUserData,
        fetchAllUserDetails,
        fetchUserDetails,
        saveDietPlanForSpecificUser,
        saveCustomDietPlan,
        fetchCustomMeals,
        fetchCustomMealsByName,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};
