
import { 
  auth,
  db // if you need to store user profiles in Firestore
} from './config';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  type User as FirebaseUser 
} from 'firebase/auth';
// import { doc, setDoc, getDoc } from 'firebase/firestore'; // Example for Firestore user profiles

// Re-export FirebaseUser to avoid direct firebase imports in components if preferred
export type { FirebaseUser };

export const signUp = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  // Optionally, create a user document in Firestore here
  // await setDoc(doc(db, "users", userCredential.user.uid), { email: userCredential.user.email, role: "user" });
  return userCredential.user;
};

export const signIn = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const logOut = async () => {
  await signOut(auth);
};

export const onAuthUserChanged = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Example: Get custom user data from Firestore
// export const getUserProfile = async (uid: string) => {
//   const userDocRef = doc(db, "users", uid);
//   const docSnap = await getDoc(userDocRef);
//   if (docSnap.exists()) {
//     return docSnap.data();
//   } else {
//     return null;
//   }
// };
