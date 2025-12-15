"use client";

import { useEffect, useState, FormEvent } from "react";
import { User } from "firebase/auth";
import { onAuthStateChange, signOut } from "@/lib/auth";
import { subscribeToTodos, addTodo, toggleTodo, deleteTodo, Todo } from "@/lib/todos";
import AuthForm from "./components/AuthForm";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState("");
  const [addingTodo, setAddingTodo] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setTodos([]);
      return;
    }

    const unsubscribe = subscribeToTodos(user.uid, (todosList) => {
      setTodos(todosList);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddTodo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !newTodoText.trim() || addingTodo) return;

    setAddingTodo(true);
    try {
      await addTodo(user.uid, newTodoText.trim());
      setNewTodoText("");
    } catch (error) {
      console.error("Error adding todo:", error);
    } finally {
      setAddingTodo(false);
    }
  };

  const handleToggleTodo = async (id: string, completed: boolean) => {
    if (!user) return;
    try {
      await toggleTodo(user.uid, id, !completed);
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    if (!user) return;
    try {
      await deleteTodo(user.uid, id);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#3A6EA5" }}>
        <div className="xp-panel" style={{ padding: "12px 24px", fontSize: "11px", color: "#000000" }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  // Calculate statistics
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const pendingTodos = totalTodos - completedTodos;
  const completionPercentage = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#3A6EA5" }}>
      <div className="xp-window w-full max-w-2xl">
        {/* Window Title Bar */}
        <div className="xp-title-bar">
          <span>My To-Do List - Stay Organized, Get Things Done!</span>
          <div className="flex gap-1">
            <button
              onClick={handleSignOut}
              className="xp-button-raised"
              style={{ fontSize: "10px", padding: "1px 6px", minWidth: "60px" }}
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Window Content */}
        <div className="xp-panel" style={{ padding: "8px" }}>
          {/* Welcome Message */}
          <div className="mb-3">
            <div className="xp-panel" style={{ padding: "6px", background: "#E8F4FD", border: "1px solid #B0D4F1" }}>
              <p style={{ fontSize: "10px", color: "#000000", margin: 0 }}>
                <strong>Welcome back, {user.email?.split('@')[0] || 'User'}!</strong> Ready to tackle your tasks today?
              </p>
            </div>
          </div>

          {/* Statistics */}
          {totalTodos > 0 && (
            <div className="mb-3">
              <div className="xp-panel" style={{ padding: "6px" }}>
                <div className="flex justify-between items-center gap-4" style={{ fontSize: "10px", color: "#000000" }}>
                  <div>
                    <strong>Total:</strong> {totalTodos}
                  </div>
                  <div>
                    <strong>Completed:</strong> {completedTodos}
                  </div>
                  <div>
                    <strong>Pending:</strong> {pendingTodos}
                  </div>
                  <div>
                    <strong>Progress:</strong> {completionPercentage}%
                  </div>
                </div>
              </div>
            </div>
          )}
          <form onSubmit={handleAddTodo} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                placeholder="Add a new todo..."
                className="xp-input flex-1"
                disabled={addingTodo}
              />
              <button
                type="submit"
                disabled={addingTodo || !newTodoText.trim()}
                className="xp-button-raised"
                style={{ minWidth: "60px" }}
              >
                {addingTodo ? "Adding..." : "Add"}
              </button>
            </div>
          </form>

          <div className="space-y-1">
            {todos.length === 0 ? (
              <div className="xp-panel p-8 text-center" style={{ color: "#000000" }}>
                <div style={{ fontSize: "12px", fontWeight: "bold", marginBottom: "8px" }}>
                  Your list is empty!
                </div>
                <div style={{ fontSize: "11px", marginBottom: "12px" }}>
                  Start organizing your tasks and boost your productivity.
                </div>
                <div className="xp-panel" style={{ padding: "6px", background: "#FFF9E6", border: "1px solid #FFE69C", marginTop: "8px" }}>
                  <p style={{ fontSize: "9px", color: "#000000", margin: 0, lineHeight: "1.4" }}>
                    <strong>Tip:</strong> Add your first task above to get started. You can mark tasks as complete and delete them when done!
                  </p>
                </div>
              </div>
            ) : (
              todos.map((todo) => (
                <div
                  key={todo.id}
                  className="xp-panel flex items-center gap-3"
                  style={{ padding: "6px" }}
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleTodo(todo.id, todo.completed)}
                    className="xp-checkbox"
                  />
                  <span
                    className="flex-1"
                    style={{
                      fontSize: "11px",
                      color: todo.completed ? "#808080" : "#000000",
                      textDecoration: todo.completed ? "line-through" : "none",
                    }}
                  >
                    {todo.text}
                  </span>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="xp-button-raised"
                    style={{ fontSize: "10px", padding: "1px 8px" }}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Helpful Tips */}
          {totalTodos > 0 && (
            <div className="mt-3">
              <div className="xp-panel" style={{ padding: "6px", background: "#F0F0F0", border: "1px solid #D4D0C8" }}>
                <p style={{ fontSize: "9px", color: "#000000", margin: 0, lineHeight: "1.4" }}>
                  <strong>Quick Tips:</strong> Check off completed tasks • Delete tasks you no longer need • Your data syncs automatically
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
