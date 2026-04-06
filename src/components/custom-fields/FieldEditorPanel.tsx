import { useState, useEffect } from "react";
import { ArrowLeft, X, Trash2, Plus, Users, ChevronDown, MoreHorizontal } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { FieldTypeIcon } from "./FieldTypeIcon";
import { CustomField, FieldType, ALL_FIELD_TYPES, FIELD_TYPE_META, SelectOption } from "@/types/custom-fields";

const FIELD_USED_IN = [
  { id: "p1", name: "Food tabs",           type: "Project", color: "#f97316" },
  { id: "p2", name: "Grid breakdown",      type: "Project", color: "#8b5cf6" },
  { id: "p3", name: "TA Design Planning",  type: "Project", color: "#6b7280" },
];

interface FieldEditorPanelProps {
  field: CustomField;
  onUpdate: (id: string, updates: Partial<CustomField>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
  onBack?: () => void;
}

export function FieldEditorPanel({ field, onUpdate, onDelete, onClose, onBack }: FieldEditorPanelProps) {
  const [name, setName] = useState(field.name);
  const [type, setType] = useState<FieldType>(field.type);
  const [description, setDescription] = useState(field.description ?? "");
  const [options, setOptions] = useState<SelectOption[]>(field.options ?? []);
  const [currencyCode, setCurrencyCode] = useState(field.currencyCode ?? "USD");
  const [maxRating, setMaxRating] = useState(field.maxRating ?? 5);
  const [formula, setFormula] = useState(field.formula ?? "");
  const [addToLibrary, setAddToLibrary] = useState(false);
  const [notifyOnChange, setNotifyOnChange] = useState(false);
  const [accessLevel, setAccessLevel] = useState("database-members");
  const [usedIn, setUsedIn] = useState(FIELD_USED_IN);

  useEffect(() => {
    setName(field.name);
    setType(field.type);
    setDescription(field.description ?? "");
    setOptions(field.options ?? []);
    setCurrencyCode(field.currencyCode ?? "USD");
    setMaxRating(field.maxRating ?? 5);
    setFormula(field.formula ?? "");
  }, [field]);

  const handleSave = () => {
    onUpdate(field.id, {
      name,
      type,
      description: description || undefined,
      options: type === "select" || type === "multi-select" ? options : undefined,
      currencyCode: type === "currency" ? currencyCode : undefined,
      maxRating: type === "rating" ? maxRating : undefined,
      formula: type === "formula" ? formula : undefined,
    });
  };

  const addOption = () => {
    const colors = [
      "hsl(0, 72%, 51%)", "hsl(36, 80%, 50%)", "hsl(150, 50%, 45%)",
      "hsl(210, 60%, 50%)", "hsl(280, 60%, 55%)", "hsl(330, 55%, 50%)",
    ];
    setOptions([...options, { id: `opt-${Date.now()}`, label: "", color: colors[options.length % colors.length] }]);
  };

  const updateOption = (idx: number, label: string) => {
    setOptions(options.map((o, i) => (i === idx ? { ...o, label } : o)));
  };

  const removeOption = (idx: number) => {
    setOptions(options.filter((_, i) => i !== idx));
  };

  const showOptions = type === "select" || type === "multi-select";

  return (
    <div className="w-96 border-l border-border bg-card h-full flex flex-col animate-slide-in-right">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        {onBack && (
          <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}
        <h3 className="text-sm font-semibold text-foreground flex-1">Edit {field.name}</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Detail section */}
        <div className="space-y-0.5">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Detail</span>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Field title</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} className="h-9 text-sm" />
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

        {description ? (
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this field..."
              className="text-sm min-h-[60px] resize-none"
            />
          </div>
        ) : (
          <button
            onClick={() => setDescription(" ")}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Plus className="h-3 w-3" />
            Add a description
          </button>
        )}

        <Separator />

        {/* Options section (select types) */}
        {showOptions && (
          <>
            <div className="space-y-2">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Options</span>
              {options.map((opt, idx) => (
                <div key={opt.id} className="flex items-center gap-2.5 py-1">
                  <div className="w-5 h-5 rounded-md shrink-0 flex items-center justify-center" style={{ backgroundColor: opt.color }}>
                    <ChevronDown className="h-3 w-3 text-white" />
                  </div>
                  <Input
                    value={opt.label}
                    onChange={(e) => updateOption(idx, e.target.value)}
                    className="h-7 text-xs flex-1 border-none shadow-none px-0 focus-visible:ring-0"
                    placeholder="Option label"
                  />
                  <button onClick={() => removeOption(idx)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <button onClick={addOption} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors py-1">
                <Plus className="h-3 w-3" />
                Add an option
              </button>
            </div>
            <Separator />
          </>
        )}

        {/* Type-specific config */}
        {type === "currency" && (
          <>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Currency</Label>
              <Select value={currencyCode} onValueChange={setCurrencyCode}>
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["USD", "EUR", "GBP", "JPY", "CAD", "AUD"].map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Separator />
          </>
        )}

        {type === "rating" && (
          <>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Max rating</Label>
              <Select value={String(maxRating)} onValueChange={(v) => setMaxRating(Number(v))}>
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[3, 5, 7, 10].map((n) => (
                    <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Separator />
          </>
        )}

        {type === "formula" && (
          <>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Formula</Label>
              <Textarea
                value={formula}
                onChange={(e) => setFormula(e.target.value)}
                placeholder="e.g. {Hours} * {Rate}"
                className="text-sm min-h-[60px] resize-none font-mono text-xs"
              />
            </div>
            <Separator />
          </>
        )}

        {/* Settings section */}
        <div className="space-y-3">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Settings</span>
          <label className="flex items-start gap-2.5 cursor-pointer">
            <Checkbox
              checked={addToLibrary}
              onCheckedChange={(v) => setAddToLibrary(!!v)}
              className="mt-0.5"
            />
            <span className="text-sm text-foreground leading-snug">Add to workspace field library</span>
          </label>
          <label className="flex items-start gap-2.5 cursor-pointer">
            <Checkbox
              checked={notifyOnChange}
              onCheckedChange={(v) => setNotifyOnChange(!!v)}
              className="mt-0.5"
            />
            <span className="text-sm text-foreground leading-snug">Notify collaborators when this field's value is changed</span>
          </label>
        </div>

        <Separator />

        {/* Access section */}
        <div className="space-y-3">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Access</span>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Invite with email</Label>
            <div className="flex gap-2">
              <Input placeholder="Add members by name or email" className="h-8 text-sm flex-1" />
              <Select defaultValue="editor">
                <SelectTrigger className="h-8 text-xs w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="h-8 text-xs">
                Invite
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Access settings</Label>
            <Select value={accessLevel} onValueChange={setAccessLevel}>
              <SelectTrigger className="h-8 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="database-members">Database members</SelectItem>
                <SelectItem value="workspace-members">Workspace members</SelectItem>
                <SelectItem value="specific-people">Specific people only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Field members</Label>
            <div className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <span className="text-sm text-foreground">Admins and Editors</span>
              </div>
              <span className="text-xs text-muted-foreground">Field admin</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Used in section */}
        <div className="space-y-2">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Used in</span>
          <div className="space-y-0.5">
            {usedIn.map((place) => (
              <div
                key={place.id}
                className="relative flex items-center gap-3 px-1 py-1.5 rounded-md hover:bg-accent transition-colors group/place"
              >
                <div className="w-5 h-5 rounded shrink-0" style={{ backgroundColor: place.color }} />
                <span className="text-sm text-foreground flex-1">{place.name}</span>
                <span className="text-xs text-muted-foreground group-hover/place:opacity-0 transition-opacity">{place.type}</span>

                {/* More button — visible on hover */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="absolute right-5 opacity-0 group-hover/place:opacity-100 p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-all"
                    >
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-52 p-1" side="left" align="start" sideOffset={4}>
                    <button
                      type="button"
                      onClick={() => setUsedIn((prev) => prev.filter((p) => p.id !== place.id))}
                      className="flex items-center gap-2 w-full px-2 py-1.5 rounded text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <X className="h-3.5 w-3.5 shrink-0" />
                      Remove from {place.name}
                    </button>
                  </PopoverContent>
                </Popover>
              </div>
            ))}
            {usedIn.length === 0 && (
              <p className="text-xs text-muted-foreground px-1 py-1">Not used anywhere else.</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1"
          onClick={() => onDelete(field.id)}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-7 text-xs px-3" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" className="h-7 text-xs px-3" onClick={handleSave}>
            Save field
          </Button>
        </div>
      </div>
    </div>
  );
}
