import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from 'firebase/firestore';
import { db } from './firebase';

export const addTodo = async (uid: string, text: string) => {
  const ref = collection(db, 'todos');
  const docRef = await addDoc(ref, {
    uid,
    text,
    createdAt: new Date(),
  });
  return docRef.id;
};

export const fetchTodos = async (uid: string) => {
  const ref = collection(db, 'todos');
  const q = query(ref, where('uid', '==', uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    text: doc.data().text,
  }));
};

export const deleteTodo = async (id: string) => {
  await deleteDoc(doc(db, 'todos', id));
};