import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export const getUserProfile = async (uid: string) => {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
};

export const updateUserProfile = async (uid: string, data: { name: string; bio: string }) => {
  const ref = doc(db, 'users', uid);
  await setDoc(ref, data, { merge: true });
};
