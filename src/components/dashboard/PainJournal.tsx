import { useState, useEffect } from "react";

interface JournalEntry {
  id: string;
  date: string;
  painLevel: number;
  notes: string;
  createdAt: string;
}

const JOURNAL_KEY = "tenspilot-journal";

function loadJournal(): JournalEntry[] {
  try {
    const raw = localStorage.getItem(JOURNAL_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveJournal(entries: JournalEntry[]) {
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
}

function painColor(level: number) {
  if (level <= 3) return "bg-green-100 text-green-700";
  if (level <= 6) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}

export default function PainJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>(loadJournal);
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [painLevel, setPainLevel] = useState<number | null>(null);
  const [notes, setNotes] = useState("");

  useEffect(() => { saveJournal(entries); }, [entries]);

  const handleSave = () => {
    if (painLevel === null) return;
    const entry: JournalEntry = {
      id: crypto.randomUUID(),
      date,
      painLevel,
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
    };
    setEntries(prev => [entry, ...prev]);
    setPainLevel(null);
    setNotes("");
  };

  const recent = entries.slice(0, 5);

  return (
    <div>
      {/* Entry form */}
      <div className="medical-card mb-4">
        <h3 className="font-display text-sm font-bold text-foreground mb-3">New Entry</h3>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-white/60 bg-white/40 backdrop-blur-sm text-foreground text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <p className="text-xs text-muted-foreground mb-2">Pain Level</p>
        <div className="flex flex-wrap justify-center gap-1.5 mb-3">
          {Array.from({ length: 11 }, (_, i) => (
            <button
              key={i}
              onClick={() => setPainLevel(i)}
              className={`w-9 h-9 rounded-full border-2 font-semibold text-xs transition-all ${
                painLevel === i
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-white/60 bg-white/40 text-foreground hover:border-primary/40"
              }`}
            >
              {i}
            </button>
          ))}
        </div>
        <textarea
          placeholder="How are you feeling today?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full rounded-xl border border-white/60 bg-white/40 backdrop-blur-sm p-3 text-sm resize-none mb-3 focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-[var(--ink-subtle)]"
        />
        <button
          onClick={handleSave}
          disabled={painLevel === null}
          className="w-full py-2.5 rounded-xl gradient-medical-bg text-primary-foreground font-semibold hover:opacity-90 transition disabled:opacity-50 text-sm"
        >
          Save Entry
        </button>
      </div>

      {/* Recent entries */}
      {recent.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-display text-sm font-bold text-foreground">Recent Entries</h3>
          {recent.map((e) => (
            <div key={e.id} className="medical-card p-3 flex items-start gap-3">
              <div>
                <p className="text-xs font-bold text-foreground">{new Date(e.date).toLocaleDateString()}</p>
                <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium mt-1 ${painColor(e.painLevel)}`}>
                  {e.painLevel}/10
                </span>
              </div>
              {e.notes && (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 flex-1">{e.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
