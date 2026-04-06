import { useState, useRef, useCallback } from "react";
import { PrototypeNav } from "@/components/PrototypeNav";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, Plus, X, Sparkles, AlertTriangle, ChevronDown } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SelectOption {
  id: string;
  label: string;
  color: string;
}

// ─── Sample data ──────────────────────────────────────────────────────────────

const INITIAL_OPTIONS: SelectOption[] = [
  { id: "o1", label: "Option 1", color: "#34a853" },
  { id: "o2", label: "Option 2", color: "#ea4335" },
];

const COLORS = [
  "#4285f4", "#fbbc04", "#ea4335", "#34a853", "#673ab7", "#e91e63",
];

// ─── "Used in" places data ────────────────────────────────────────────────────

const FIELD_USED_IN = [
  { id: "p1", name: "Food tabs",       type: "Project", emoji: "🍜" },
  { id: "p2", name: "Grid breakdown",  type: "Project", emoji: "🟣" },
  { id: "p3", name: "TA Design Planning", type: "Project", emoji: "📋" },
];

// ─── Used-in popover ──────────────────────────────────────────────────────────

function UsedInPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="font-semibold underline decoration-dotted underline-offset-2 cursor-pointer hover:text-amber-900 transition-colors">
          3 other places
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-56 p-0 shadow-lg"
        side="top"
        align="start"
        sideOffset={6}
      >
        <div className="px-3 py-2 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Used in</p>
        </div>
        <div className="py-1">
          {FIELD_USED_IN.map((place) => (
            <div
              key={place.id}
              className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <span className="text-base leading-none">{place.emoji}</span>
              <div className="min-w-0">
                <p className="text-sm text-gray-800 truncate">{place.name}</p>
                <p className="text-xs text-gray-400">{place.type}</p>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ─── Option pill ──────────────────────────────────────────────────────────────

function OptionPill({ option }: { option: SelectOption }) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-md text-white text-xs font-medium leading-5"
      style={{ backgroundColor: option.color }}
    >
      {option.label}
    </span>
  );
}

// ─── Field editor content (shown inside the flyout popover) ───────────────────

interface FieldEditorProps {
  options: SelectOption[];
  onOptionsChange: (opts: SelectOption[]) => void;
  onClose: () => void;
}

function FieldEditor({ options, onOptionsChange, onClose }: FieldEditorProps) {
  const [localName, setLocalName] = useState("test low");
  const [localOptions, setLocalOptions] = useState<SelectOption[]>(options);
  const [usedInExpanded, setUsedInExpanded] = useState(false);
  const optionRefs = useRef<(HTMLInputElement | null)[]>([]);

  const addOption = useCallback(() => {
    setLocalOptions((prev) => {
      const next = [
        ...prev,
        { id: `opt-${Date.now()}`, label: "", color: COLORS[prev.length % COLORS.length] },
      ];
      setTimeout(() => optionRefs.current[next.length - 1]?.focus(), 0);
      return next;
    });
  }, []);

  const updateOption = (idx: number, label: string) =>
    setLocalOptions((prev) => prev.map((o, i) => (i === idx ? { ...o, label } : o)));

  const removeOption = (idx: number) => {
    setLocalOptions((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      setTimeout(() => optionRefs.current[Math.max(0, idx - 1)]?.focus(), 0);
      return next;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      idx === localOptions.length - 1 ? addOption() : optionRefs.current[idx + 1]?.focus();
    } else if (e.key === "Tab" && !e.shiftKey && idx < localOptions.length - 1) {
      e.preventDefault();
      optionRefs.current[idx + 1]?.focus();
    } else if (e.key === "Tab" && e.shiftKey && idx > 0) {
      e.preventDefault();
      optionRefs.current[idx - 1]?.focus();
    } else if (e.key === "Backspace" && localOptions[idx].label === "") {
      e.preventDefault();
      removeOption(idx);
    }
  };

  return (
    <div className="w-80 p-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-gray-400 flex items-center justify-center shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
          </div>
          <span className="text-sm font-semibold text-gray-900">Single-select field</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="px-4 py-3 space-y-4">
        {/* Field title */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-gray-500">
            Field title <span className="text-red-400">*</span>
          </Label>
          <Input
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            className="h-8 text-sm border-gray-200"
            autoFocus
          />
        </div>

        {/* Options */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-gray-500">Options</Label>
          <div className="space-y-0.5 mt-1">
            {localOptions.map((opt, idx) => (
              <div key={opt.id} className="flex items-center gap-2 py-1 group/opt">
                <div
                  className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: opt.color }}
                >
                  <ChevronDown className="h-3 w-3 text-white" />
                </div>
                <Input
                  ref={(el) => { optionRefs.current[idx] = el; }}
                  value={opt.label}
                  onChange={(e) => updateOption(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className="h-7 text-sm flex-1 border-transparent shadow-none px-1 focus-visible:border-gray-200 focus-visible:ring-0"
                  placeholder="Option label"
                />
                <button
                  onClick={() => removeOption(idx)}
                  className="opacity-0 group-hover/opt:opacity-100 text-gray-300 hover:text-gray-500 transition-all"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addOption}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors mt-1 py-1"
          >
            <Plus className="h-3.5 w-3.5" />
            Add an option
          </button>
        </div>

        {/* Warning */}
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setUsedInExpanded((v) => !v)}
            className="flex items-center gap-2 w-full bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-left hover:bg-amber-100 transition-colors"
          >
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
            <p className="text-xs text-amber-800 flex-1">
              Used in <span className="font-semibold">3 other places</span>. Changes apply everywhere.
            </p>
            <ChevronDown
              className={`h-3 w-3 text-amber-400 shrink-0 transition-transform duration-150 ${usedInExpanded ? "rotate-180" : ""}`}
            />
          </button>

          {usedInExpanded && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {FIELD_USED_IN.map((place, i) => (
                <button
                  key={place.id}
                  type="button"
                  className={`flex items-center gap-2.5 w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors ${
                    i < FIELD_USED_IN.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  <div className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center shrink-0">
                    <svg className="h-3 w-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                  </div>
                  <span className="text-xs font-medium text-gray-700 flex-1 truncate">{place.name}</span>
                  <span className="text-xs text-gray-400 shrink-0">{place.type}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <Separator className="bg-gray-100" />

      {/* Footer */}
      <div className="px-4 py-2.5 flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs border-gray-200 text-gray-600"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          className="h-7 text-xs px-3 bg-blue-600 hover:bg-blue-700"
          onClick={() => { onOptionsChange(localOptions); onClose(); }}
          disabled={!localName.trim()}
        >
          Save
        </Button>
      </div>
    </div>
  );
}

type PopoverView = "picker" | "editor";

// ─── Main page ────────────────────────────────────────────────────────────────

export default function RuleBuilder() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverView, setPopoverView] = useState<PopoverView>("picker");
  const [options, setOptions] = useState<SelectOption[]>(INITIAL_OPTIONS);

  const fieldName = "test low";

  const handleDoThisClick = () => {
    setPanelOpen(true);
  };

  const handleOpenPicker = () => {
    setPopoverView("picker");
    setPopoverOpen(true);
  };

  const handleEditField = () => {
    // Switch the same popover to editor view — stays anchored to the same trigger
    setPopoverView("editor");
  };

  const handlePopoverOpenChange = (open: boolean) => {
    setPopoverOpen(open);
    if (!open) setPopoverView("picker"); // reset to picker when closed
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <PrototypeNav />

      <div className="flex-1 flex min-h-0">
        {/* Canvas */}
        <div className="flex-1 flex items-start justify-start p-8 bg-gray-100 overflow-auto">
          <div className="flex items-center mt-8 ml-4">
            {/* WHEN card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm w-52 px-4 py-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center">
                  <ChevronRight className="h-3 w-3 text-gray-500" />
                </div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">When</span>
              </div>
              <p className="text-sm text-gray-800 font-medium leading-snug pl-7">
                Task is moved to a section
              </p>
            </div>

            {/* Connector */}
            <div className="flex items-center">
              <div className="w-6 h-px bg-gray-300" />
              <button className="w-6 h-6 rounded-full border border-gray-300 bg-white flex items-center justify-center text-gray-400 hover:bg-gray-50 shadow-sm">
                <Plus className="h-3 w-3" />
              </button>
              <div className="w-6 h-px bg-gray-300" />
            </div>

            {/* DO THIS card */}
            <button
              onClick={handleDoThisClick}
              className={`bg-white rounded-lg border shadow-sm w-52 px-4 py-3 text-left transition-all ${
                panelOpen
                  ? "border-blue-400 ring-2 ring-blue-100"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                </div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Do this</span>
              </div>
              <p className="text-sm text-gray-800 font-medium leading-snug pl-7">
                Set{" "}
                <span className="font-semibold text-gray-900">{fieldName}</span>{" "}
                to{" "}
                <span className="inline-flex items-center px-1.5 py-0.5 rounded border border-dashed border-gray-400 text-gray-500 text-xs">
                  Unspecified
                </span>
              </p>
            </button>
          </div>
        </div>

        {/* Right panel — always shows action details, never changes */}
        {panelOpen && (
          <div className="w-72 border-l border-gray-200 bg-white flex flex-col shrink-0">
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <span>Do this</span>
                <ChevronRight className="h-3 w-3" />
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1 rounded-md text-gray-400 hover:bg-gray-100 transition-colors">
                  {/* trash */}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                </button>
                <button className="p-1 rounded-md text-gray-400 hover:bg-gray-100 transition-colors">
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setPanelOpen(false)}
                  className="p-1 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Heading */}
            <div className="px-4 pt-3 pb-2">
              <h2 className="text-sm font-semibold text-gray-900">Set {fieldName} to</h2>
            </div>

            {/* Choose an option (static dropdown display) */}
            <div className="px-4 pb-3 border-b border-gray-100">
              <Label className="text-xs text-gray-500 mb-1.5 block">Choose an option</Label>
              <div className="flex items-center justify-between h-8 px-3 rounded-md border border-gray-200 bg-white text-sm text-gray-700 cursor-default select-none">
                <span>Set {fieldName} to</span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
              </div>
            </div>

            {/* Option value picker */}
            <div className="px-4 pt-3">
              <Label className="text-xs text-gray-500 mb-2 block">
                Choose an option for {fieldName}
              </Label>

              {/* Single popover — picker and editor share the same trigger */}
              <Popover open={popoverOpen} onOpenChange={handlePopoverOpenChange}>
                <PopoverTrigger asChild>
                  <button
                    onClick={handleOpenPicker}
                    className={`flex items-center justify-between w-full h-8 px-2 rounded-md border text-xs transition-colors ${
                      popoverOpen
                        ? "border-blue-400 bg-blue-50 ring-1 ring-blue-200"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-gray-400">—</span>
                    <Plus className="h-3.5 w-3.5 text-gray-400" />
                  </button>
                </PopoverTrigger>

                <PopoverContent
                  className="p-0 shadow-lg"
                  style={{ width: popoverView === "editor" ? "320px" : "256px" }}
                  align="start"
                  side="bottom"
                  sideOffset={4}
                >
                  {popoverView === "picker" ? (
                    <>
                      {/* Use AI */}
                      <button className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-50 transition-colors">
                        <div className="w-5 h-5 rounded flex items-center justify-center bg-blue-50 shrink-0">
                          <Sparkles className="h-3 w-3 text-blue-500" />
                        </div>
                        <span className="text-blue-600 text-xs font-medium">Use AI</span>
                      </button>

                      <Separator className="bg-gray-100" />

                      {/* Options */}
                      <div className="py-1">
                        {options.map((opt) => (
                          <button
                            key={opt.id}
                            className="flex items-center gap-2 w-full px-3 py-1.5 hover:bg-gray-50 transition-colors"
                          >
                            <OptionPill option={opt} />
                          </button>
                        ))}
                      </div>

                      <Separator className="bg-gray-100" />

                      {/* Edit field */}
                      <button
                        onClick={handleEditField}
                        className="flex items-center w-full px-3 py-2 text-xs text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors"
                      >
                        Edit field
                      </button>
                    </>
                  ) : (
                    <FieldEditor
                      options={options}
                      onOptionsChange={setOptions}
                      onClose={() => handlePopoverOpenChange(false)}
                    />
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
