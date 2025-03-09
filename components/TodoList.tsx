import { Todo } from "@/utils/interface";
import React, { useState } from "react";

type Props = {
  todos: Todo[];
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, newTitle: string) => Promise<void>;
};

const TodoList = (props: Props) => {
  const { todos, onDelete, onUpdate } = props;
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>("");
  const [showDeleteHint, setShowDeleteHint] = useState<number | null>(null);

  if (!todos || todos.length === 0) {
    return (
      <div className="text-center text-gray-500 text-lg">
        タスクがありません
      </div>
    );
  }

  const handleEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  };

  const handleUpdate = async (id: number) => {
    if (editingTitle.trim() === "") return;
    await onUpdate(id, editingTitle);
    setEditingId(null);
  };

  const handleDeleteHover = (id: number) => {
    const timer = setTimeout(() => {
      setShowDeleteHint(id);
    }, 1000);
    return () => clearTimeout(timer);
  };

  return (
    <div className="max-h-[calc(100vh-200px)] overflow-y-auto px-4">
      <ul className="space-y-3 w-full max-w-2xl mx-auto">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex justify-between items-center bg-orange-200 rounded-lg p-4 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
          >
            {editingId === todo.id ? (
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className="p-2 rounded-lg outline-none flex-1 min-w-0"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleUpdate(todo.id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  autoFocus
                />
                <button
                  onClick={() => handleUpdate(todo.id)}
                  className="text-sm text-green-600 hover:text-green-800 px-3 py-1 rounded-lg hover:bg-green-100 transition-colors"
                >
                  保存
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  キャンセル
                </button>
              </div>
            ) : (
              <li
                className="font-medium cursor-pointer flex-1 text-lg"
                onClick={() => handleEdit(todo)}
              >
                ✅{todo.title}
              </li>
            )}
            <div className="relative ml-4">
              <span
                className="cursor-pointer hover:text-red-600 transition-colors duration-200 text-xl"
                onClick={() => onDelete(todo.id)}
                onMouseEnter={() => handleDeleteHover(todo.id)}
                onMouseLeave={() => setShowDeleteHint(null)}
              >
                ✖
              </span>
              {showDeleteHint === todo.id && (
                <span className="absolute -top-8 right-0 text-sm bg-gray-800 text-white px-2 py-1 rounded shadow-lg whitespace-nowrap">
                  削除
                </span>
              )}
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
