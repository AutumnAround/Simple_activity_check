import { useState, useEffect } from "react";

type Habit = {
  text: string;
  completed: boolean;
};

export default function HabitTracker() {
  const [entries, setEntries] = useState<Habit[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<"all" | "completed" | "incomplete">("all"); // Фильтр

  useEffect(() => {
    const savedEntries = localStorage.getItem("progress");
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  const addEntry = () => {
    if (input.trim() === "") return;
    const newEntry: Habit = { text: input, completed: false };
    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem("progress", JSON.stringify(updatedEntries));
    setInput("");
  };

  const deleteEntry = (index: number) => {
    const updatedEntries = entries.filter((_, i) => i !== index);
    setEntries(updatedEntries);
    localStorage.setItem("progress", JSON.stringify(updatedEntries));
  };

  const toggleCompletion = (index: number) => {
    const updatedEntries = [...entries];
    updatedEntries[index].completed = !updatedEntries[index].completed;
    setEntries(updatedEntries);
    localStorage.setItem("progress", JSON.stringify(updatedEntries));
  };

  // Фильтрация записей
  const filteredEntries = entries.filter((entry) => {
    if (filter === "completed") return entry.completed;
    if (filter === "incomplete") return !entry.completed;
    return true;
  });

  return (
    <div>
      <h1>Habit Tracker</h1>
      <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Add Habit" />
      <button onClick={addEntry}>Add</button>

      {/* Фильтр */}
      <div>
        <button onClick={() => setFilter("all")}>Все</button>
        <button onClick={() => setFilter("completed")}>✅ Выполненные</button>
        <button onClick={() => setFilter("incomplete")}>❌ Невыполненные</button>
      </div>

      <ul>
        {filteredEntries.map((entry, index) => (
          <li key={index}>
            <input
              type="checkbox"
              checked={entry.completed}
              onChange={() => toggleCompletion(index)}
            />
            <span style={{ textDecoration: entry.completed ? "line-through" : "none" }}>
              {entry.text}
            </span>
            <button onClick={() => deleteEntry(index)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
