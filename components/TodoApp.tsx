"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { addTodo, fetchTodos, deleteTodo } from "@/lib/todoService";
import { Todo } from "@/types/todo";
import { Button } from "./ui/button";
import { PlusIcon, TrashIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function TodoApp() {
  const [userId, setUserId] = useState<string | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        const todos = await fetchTodos(user.uid);
        setTodos(todos);
      } else {
        setUserId(null);
        setTodos([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAdd = async () => {
    if (!input.trim() || !userId) return;
    const id = await addTodo(userId, input);
    setTodos((prev) => [...prev, { id, text: input }]);
    setInput("");
    toast.success("Task added");
  };

  const handleDelete = async (id: string) => {
    if (!userId) return;
    await deleteTodo(id);
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    toast.success("Task deleted");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <motion.h2
        className="text-3xl font-extrabold tracking-wider bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text"
        whileHover={{ scale: 1.05 }}
      >
        Todo List
      </motion.h2>

      {userId ? (
        <motion.form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleAdd();
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border px-3 py-2 w-full rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            placeholder="Add a task"
          />
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg cursor-pointer px-4 py-2 transition-all duration-200 hover:scale-105 hover:shadow-lg"
          >
            <PlusIcon />
            Add
          </Button>
        </motion.form>
      ) : (
        <p className="text-gray-500">※You need to login to add tasks</p>
      )}

      <ul className="space-y-2">
        <AnimatePresence mode="popLayout">
          {todos.map((todo) => (
            <motion.li
              key={todo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex justify-between bg-gradient-to-r from-gray-50 to-gray-100 font-semibold p-3 shadow-md rounded-lg hover:shadow-lg transition-all duration-200"
            >
              <span className="text-gray-700">{todo.text}</span>
              {userId && (
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button
                    onClick={() => handleDelete(todo.id)}
                    className="text-white bg-gradient-to-r from-red-500 to-red-600 cursor-pointer transition-all duration-200 hover:scale-105 rounded-lg"
                  >
                    <TrashIcon />
                  </Button>
                </motion.div>
              )}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </motion.div>
  );
}
