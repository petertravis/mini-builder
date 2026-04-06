import { useState } from "react";
import { PrototypeNav } from "@/components/PrototypeNav";
import { ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

// ─── Sample data ──────────────────────────────────────────────────────────────

const FIELD_OPTIONS = [
  { id: "o1", label: "Not Started", color: "#9ca3af" },
  { id: "o2", label: "In Progress",  color: "#3b82f6" },
  { id: "o3", label: "In Review",    color: "#f59e0b" },
  { id: "o4", label: "Complete",     color: "#22c55e" },
];

const USED_IN = [
  { id: "p1", name: "Food tabs",          type: "Project", color: "#f97316" },
  { id: "p2", name: "Grid breakdown",     type: "Project", color: "#8b5cf6" },
  { id: "p3", name: "TA Design Planning", type: "Project", color: "#6b7280" },
];

// ─── Section header ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
      {children}
    </p>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FieldEditPanel() {
  const [fieldName, setFieldName] = useState("Status");
  const [notifyCollabs, setNotifyCollabs] = useState(false);
  const [addToLibrary, setAddToLibrary] = useState(false);

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <PrototypeNav />

      <div className="flex-1 flex items-start justify-center bg-gray-100 overflow-auto py-10">
        {/* Panel card */}
        <div className="bg-white rounded-xl shadow-lg w-[420px] flex flex-col overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Edit {fieldName}</h2>
            <button className="p-1 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">

            {/* Field title + type */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-500">Field title</Label>
                <Input
                  value={fieldName}
                  onChange={(e) => setFieldName(e.target.value)}
                  className="h-9 text-sm border-gray-200"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-500">Type</Label>
                <button className="flex items-center justify-between w-full h-9 px-3 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2">
                    <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                    <span>Single Select</span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                </button>
              </div>
              <button className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                + Add a description
              </button>
            </div>

            <Separator className="bg-gray-100" />

            {/* Options */}
            <div>
              <SectionLabel>Options</SectionLabel>
              <div className="space-y-0.5">
                {FIELD_OPTIONS.map((opt) => (
                  <div
                    key={opt.id}
                    className="flex items-center gap-3 py-1.5 group/opt"
                  >
                    <div
                      className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: opt.color }}
                    >
                      <ChevronDown className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-sm text-gray-800 flex-1">{opt.label}</span>
                    <button className="opacity-0 group-hover/opt:opacity-100 text-gray-300 hover:text-gray-500 transition-all">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors mt-2">
                + Add an option
              </button>
            </div>

            <Separator className="bg-gray-100" />

            {/* Settings */}
            <div>
              <SectionLabel>Settings</SectionLabel>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="library"
                    checked={addToLibrary}
                    onCheckedChange={(v) => setAddToLibrary(!!v)}
                  />
                  <label htmlFor="library" className="text-sm text-gray-700 cursor-pointer">
                    Add to workspace field library
                  </label>
                </div>
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="notify"
                    checked={notifyCollabs}
                    onCheckedChange={(v) => setNotifyCollabs(!!v)}
                    className="mt-0.5"
                  />
                  <label htmlFor="notify" className="text-sm text-gray-700 cursor-pointer leading-snug">
                    Notify collaborators when this field's value is changed
                  </label>
                </div>
              </div>
            </div>

            <Separator className="bg-gray-100" />

            {/* Used in — neutral data section */}
            <div>
              <SectionLabel>Used in</SectionLabel>
              <div className="space-y-0.5">
                {USED_IN.map((place) => (
                  <button
                    key={place.id}
                    type="button"
                    className="flex items-center gap-3 w-full py-1.5 rounded-md hover:bg-gray-50 transition-colors text-left group/place"
                  >
                    {/* Project color dot */}
                    <div
                      className="w-5 h-5 rounded shrink-0"
                      style={{ backgroundColor: place.color, opacity: 0.85 }}
                    />
                    <span className="text-sm text-gray-800 flex-1">{place.name}</span>
                    <span className="text-xs text-gray-400 group-hover/place:text-gray-500 transition-colors">
                      {place.type}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
            <button className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 transition-colors">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
              </svg>
              Delete
            </button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-gray-200 text-gray-600 text-sm">
                Cancel
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-sm">
                Save field
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
