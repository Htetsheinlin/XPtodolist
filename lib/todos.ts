import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  Timestamp,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Todo {
  id: string;
  userId: string;
  text: string;
  completed: boolean;
  createdAt: Timestamp;
}

export const addTodo = async (userId: string, text: string): Promise<void> => {
  await addDoc(collection(db, "todos"), {
    userId,
    text,
    completed: false,
    createdAt: Timestamp.now(),
  });
};

export const toggleTodo = async (
  userId: string,
  id: string,
  completed: boolean
): Promise<void> => {
  const todoRef = doc(db, "todos", id);
  await updateDoc(todoRef, {
    completed,
  });
};

export const deleteTodo = async (userId: string, id: string): Promise<void> => {
  const todoRef = doc(db, "todos", id);
  await deleteDoc(todoRef);
};

export const subscribeToTodos = (
  userId: string,
  callback: (todos: Todo[]) => void
): (() => void) => {
  const q = query(collection(db, "todos"), where("userId", "==", userId));
  
  return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const todos: Todo[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Todo[];
    callback(todos);
  });
};

