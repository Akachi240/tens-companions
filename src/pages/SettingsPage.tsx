import { useState, useEffect } from "react";
import { useProfile } from "@/context/ProfileContext";
import { UserPlus, Trash2, Pill, Plus, X, CheckCircle2, Bell } from "lucide-react";

export default function SettingsPage() {
  const {
    profiles,
    activeProfile,
    activeProfileId,
    setActiveProfileId,
    addProfile,
    deleteProfile,
    addMedication,
    removeMedication,
  } = useProfile();

  const [newName, setNewName] = useState("");
  const [newCondition, setNewCondition] = useState("");
  const [newMed, setNewMed] = useState("");

  const handleAddProfile = () => {
    if (!newName.trim()) return;
    addProfile(newName.trim(), newCondition.trim());
    setNewName("");
    setNewCondition("");
  };

  const handleAddMed = () => {
    if (!newMed.trim()) return;
    addMedication(newMed.trim());
    setNewMed("");
  };

  return (
    <div className="container max-w-2xl py-10">
      <h1 className="font-display text-3xl font-bold text-foreground mb-8">Settings</h1>

      {/* Add Profile */}
      <div className="medical-card-elevated mb-6">
        <h2 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-primary" /> Add Patient Profile
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            placeholder="Patient name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            placeholder="Primary condition"
            value={newCondition}
            onChange={(e) => setNewCondition(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={handleAddProfile}
            className="px-5 py-2.5 rounded-xl gradient-medical-bg text-primary-foreground font-semibold hover:opacity-90 transition whitespace-nowrap"
          >
            <Plus className="h-4 w-4 inline mr-1" /> Add
          </button>
        </div>
      </div>

      {/* Profile List */}
      <div className="medical-card-elevated mb-6">
        <h2 className="font-display text-lg font-bold text-foreground mb-4">Patient Profiles</h2>
        {profiles.length === 0 ? (
          <p className="text-muted-foreground text-sm">No profiles yet. Add one above.</p>
        ) : (
          <div className="space-y-2">
            {profiles.map((p) => (
              <div
                key={p.id}
                className={`flex items-center justify-between p-4 rounded-xl border transition cursor-pointer ${
                  p.id === activeProfileId
                    ? "border-primary bg-secondary"
                    : "border-border hover:border-primary/40"
                }`}
                onClick={() => setActiveProfileId(p.id)}
              >
                <div className="flex items-center gap-3">
                  {p.id === activeProfileId && (
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  )}
                  <div>
                    <div className="font-medium text-foreground">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.primaryCondition || "No condition"}</div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteProfile(p.id);
                  }}
                  className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Medications */}
      {activeProfile && (
        <div className="medical-card-elevated">
          <h2 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Pill className="h-5 w-5 text-primary" /> Current Medications
          </h2>
          <p className="text-sm text-muted-foreground mb-4">Managing for: {activeProfile.name}</p>

          <div className="flex gap-3 mb-4">
            <input
              placeholder="Add medication..."
              value={newMed}
              onChange={(e) => setNewMed(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddMed()}
              className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={handleAddMed}
              className="px-4 py-2.5 rounded-xl gradient-medical-bg text-primary-foreground font-semibold hover:opacity-90 transition"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {activeProfile.medications.length === 0 ? (
            <p className="text-muted-foreground text-sm">No medications listed.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {activeProfile.medications.map((med) => (
                <span
                  key={med}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium"
                >
                  {med}
                  <button
                    onClick={() => removeMedication(med)}
                    className="hover:text-destructive transition"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
