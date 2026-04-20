import { useState } from "react";
import { Eye, EyeOff, X, ArrowLeft, Plus, ChevronDown } from "lucide-react";
import { CustomField, FieldType, ALL_FIELD_TYPES, FIELD_TYPE_META, SelectOption } from "@/types/custom-fields";
import { FieldTypeIcon } from "./FieldTypeIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

interface ColumnsSidePanelProps {
  open: boolean;
  onClose: () => void;
  fields: CustomField[];
  onToggleVisibility: (id: string) => void;
  onAddField: (name: string, type: FieldType, extras?: Partial<CustomField>) => CustomField;
  onEditField: (id: string, updates: Partial<CustomField>) => void;
  onOpenAdvanced: (fieldId?: string) => void;
  title?: string;
}

export function ColumnsSidePanel({
  open,
  onClose,
  fields,
  onToggleVisibility,
  onAddField,
  onOpenAdvanced,
  title = "Fields",
}: ColumnsSidePanelProps) {
  const [view, setView] = useState<"list" | "create">("list");

  // Create form state
  const [name, setName] = useState("");
  const [type, setType] = useState<FieldType>("text");
  const [options, setOptions] = useState<SelectOption[]>([
    { id: "opt-1", label: "", color: "hsl(150, 50%, 45%)" },
    { id: "opt-2", label: "", color: "hsl(0, 72%, 51%)" },
  ]);
  const [addToLibrary, setAddToLibrary] = useState(false);
  const [notifyOnChange, setNotifyOnChange] = useState(false);

  const showOptions = type === "select" || type === "multi-select";
  const canCreate = name.trim().length > 0;

  const resetForm = () => {
    setName("");
    setType("text");
    setOptions([
      { id: "opt-1", label: "", color: "hsl(150, 50%, 45%)" },
      { id: "opt-2", label: "", color: "hsl(0, 72%, 51%)" },
    ]);
    setAddToLibrary(false);
    setNotifyOnChange(false);
  };

  const handleCreate = () => {
    if (!canCreate) return;
    const newField = onAddField(name.trim(), type, {
      options: showOptions ? options.filter((o) => o.label.trim()) : undefined,
    });
    resetForm();
    setView("list");
  };

  const handleBack = () => {
    resetForm();
    setView("list");
  };

  const addOption = () => {
    const colors = ["hsl(210, 60%, 50%)", "hsl(280, 60%, 55%)", "hsl(36, 80%, 50%)", "hsl(330, 55%, 50%)"];
    setOptions([...options, { id: `opt-${Date.now()}`, label: "", color: colors[options.length % colors.length] }]);
  };

  const updateOption = (idx: number, label: string) => {
    setOptions(options.map((o, i) => (i === idx ? { ...o, label } : o)));
  };

  const removeOption = (idx: number) => {
    setOptions(options.filter((_, i) => i !== idx));
  };

  if (!open) return null;

  // ── Create view ──────────────────────────────────────────────────────────────
  if (view === "create") {
    return (
      <div className="w-80 border-l border-border bg-card h-full flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <button onClick={handleBack} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h3 className="text-sm font-semibold text-foreground flex-1">Create field</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Field name <span className="text-red-400">*</span>
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Priority, Stage, Status..."
              className="h-9 text-sm"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Field type</Label>
            <Select value={type} onValueChange={(v) => setType(v as FieldType)}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ALL_FIELD_TYPES.map((ft) => (
                  <SelectItem key={ft} value={ft}>
                    <div className="flex items-center gap-2">
                      <FieldTypeIcon type={ft} className="h-3.5 w-3.5" />
                      <span>{FIELD_TYPE_META[ft].label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Plus className="h-3 w-3" />
            Add description
          </button>

          {showOptions && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Options <span className="text-red-400">*</span>
                </Label>
                {options.map((opt, idx) => (
                  <div key={opt.id} className="flex items-center gap-2.5 py-0.5">
                    <div
                      className="w-5 h-5 rounded-md shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: opt.color }}
                    >
                      <ChevronDown className="h-3 w-3 text-white" />
                    </div>
                    <Input
                      value={opt.label}
                      onChange={(e) => updateOption(idx, e.target.value)}
                      className="h-7 text-xs flex-1 border-none shadow-none px-0 focus-visible:ring-0"
                      placeholder="Type an option name"
                    />
                    <button onClick={() => removeOption(idx)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addOption}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
                >
                  <Plus className="h-3 w-3" />
                  Add an option
                </button>
              </div>
            </>
          )}

          <Separator />

          <div className="space-y-3">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">Settings</Label>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <Checkbox checked={addToLibrary} onCheckedChange={(v) => setAddToLibrary(!!v)} className="mt-0.5" />
              <span className="text-sm text-foreground leading-snug">Add to workspace field library</span>
            </label>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <Checkbox checked={notifyOnChange} onCheckedChange={(v) => setNotifyOnChange(!!v)} className="mt-0.5" />
              <span className="text-sm text-foreground leading-snug">Notify collaborators when this field's value is changed</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" className="h-7 text-xs px-3" onClick={handleBack}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="h-7 text-xs px-3 bg-blue-600 hover:bg-blue-700"
            onClick={handleCreate}
            disabled={!canCreate}
          >
            Create field
          </Button>
        </div>
      </div>
    );
  }

  // ── List view ─────────────────────────────────────────────────────────────────
  return (
    <div className="w-80 border-l border-border bg-card flex flex-col shrink-0 animate-slide-in-right">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground flex-1">{title}</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Added to project row */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-border">
        <span className="text-sm font-medium text-foreground">Added to project</span>
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs gap-1 border-gray-200"
          onClick={() => { onClose(); onOpenAdvanced(); }}
        >
          <Plus className="h-3 w-3" />
          Add field
        </Button>
      </div>

      {/* Field list */}
      <div className="flex-1 overflow-y-auto py-1">
        {fields.map((field) => (
          <div
            key={field.id}
            className="flex items-center gap-3 px-4 py-2.5 group hover:bg-accent/50 transition-colors"
          >
            <FieldTypeIcon type={field.type} className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="text-sm text-foreground flex-1 truncate">{field.name}</span>
            <button
              onClick={() => onToggleVisibility(field.id)}
              className={`transition-colors ${field.visible ? "text-primary" : "text-muted-foreground/40"}`}
            >
              {field.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
