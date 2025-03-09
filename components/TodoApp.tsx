"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import TodoList from "./TodoList";
import {
  addTodo,
  getAllTodos,
  deleteTodo,
  updateTodo,
} from "@/utils/supabasefunction";
import { Todo } from "@/utils/interface";

const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    const getTodos = async () => {
      try {
        console.log("Fetching todos...");
        const fetchedTodos = await getAllTodos();
        console.log("Fetched todos:", fetchedTodos);
        setTodos(fetchedTodos || []);
      } catch (error) {
        console.error("Failed to fetch todos:", error);
        setTodos([]);
      }
    };
    getTodos();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (title === "") return;

    try {
      await addTodo(title);
      const todos = await getAllTodos();
      setTodos(todos || []);
      setTitle("");
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  const handleUpdate = async (id: number, newTitle: string) => {
    try {
      await updateTodo(id, newTitle);
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, title: newTitle } : todo
        )
      );
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  return (
    <section className="flex flex-col h-screen w-full max-w-5xl mx-auto px-4">
      <div className="sticky top-0 bg-white py-6 shadow-md z-10 w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Todo App</h1>
        <form
          onSubmit={handleSubmit}
          className="mb-4 flex justify-center gap-2"
        >
          <input
            type="text"
            placeholder="Add a task"
            className="shadow-lg p-3 outline-none rounded-lg w-full max-w-2xl"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          <Button className="shadow-lg border-2 px-6 py-2 rounded-lg bg-green-300 text-black hover:bg-green-400 transition-colors">
            Add
          </Button>
        </form>
      </div>
      <div className="flex-1 overflow-hidden py-4">
        <TodoList
          todos={todos}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      </div>
    </section>
  );
};

export default TodoApp;
