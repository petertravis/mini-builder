import { useState, useEffect, useRef } from "react";
import { ArrowLeft, X, Plus, Users, ChevronDown, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FieldTypeIcon } from "./FieldTypeIcon";
import { CustomField, FieldType, ALL_FIELD_TYPES, FIELD_TYPE_META, SelectOption } from "@/types/custom-fields";

const DEFAULT_NEW_OPTIONS: SelectOption[] = [
  { id: "opt-default-1", label: "", color: "hsl(150, 50%, 45%)" },
  { id: "opt-default-2", label: "", color: "hsl(0, 72%, 51%)" },
];

const FIELD_USED_IN = [
  { id: "p1", name: "Food tabs",           type: "Project" },
  { id: "p2", name: "Grid breakdown",      type: "Project" },
  { id: "p3", name: "TA Design Planning",  type: "Project" },
  { id: "p4", name: "Season 4 Tracker",    type: "Project" },
];

interface FieldEditorPanelProps {
  /** Pass a field to edit it; omit (or pass null) to open in "Create field" mode */
  field?: CustomField | null;
  onUpdate?: (id: string, updates: Partial<CustomField>) => void;
  onAdd?: (name: string, type: FieldType, extras?: Partial<CustomField>) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
  onBack?: () => void;
}

export function FieldEditorPanel({ field, onUpdate, onAdd, onDelete, onClose, onBack }: FieldEditorPanelProps) {
  const isCreating = !field;

  const [name, setName] = useState(field?.name ?? "");
  const [nameTouched, setNameTouched] = useState(false);
  const [type, setType] = useState<FieldType>(field?.type ?? "select");
  const [description, setDescription] = useState(field?.description ?? "");
  const [options, setOptions] = useState<SelectOption[]>(field?.options ?? (!field ? DEFAULT_NEW_OPTIONS : []));
  const [currencyCode, setCurrencyCode] = useState(field?.currencyCode ?? "USD");
  const [maxRating, setMaxRating] = useState(field?.maxRating ?? 5);
  const [formula, setFormula] = useState(field?.formula ?? "");
  const [addToLibrary, setAddToLibrary] = useState(false);
  const [notifyOnChange, setNotifyOnChange] = useState(false);
  const [accessLevel, setAccessLevel] = useState("database-members");
  const [usedIn] = useState(FIELD_USED_IN);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<"close" | "back" | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!field) return;
    setName(field.name);
    setType(field.type);
    setDescription(field.description ?? "");
    setOptions(field.options ?? []);
    setCurrencyCode(field.currencyCode ?? "USD");
    setMaxRating(field.maxRating ?? 5);
    setFormula(field.formula ?? "");
  }, [field]);

  // Detect if anything has changed
  const hasChanges = isCreating
    ? name.trim() !== "" || type !== "select"
    : name !== (field?.name ?? "") ||
      type !== (field?.type ?? "text") ||
      description !== (field?.description ?? "") ||
      JSON.stringify(options) !== JSON.stringify(field?.options ?? []) ||
      currencyCode !== (field?.currencyCode ?? "USD") ||
      maxRating !== (field?.maxRating ?? 5) ||
      formula !== (field?.formula ?? "");

  // Close (with unsaved-changes guard) when clicking outside the panel
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (showDiscardDialog) return;
      if (panelRef.current?.contains(e.target as Node)) return;
      const target = e.target as Element;
      if (
        target.closest('[role="dialog"]') ||
        target.closest('[role="listbox"]') ||
        target.closest('[data-radix-popper-content-wrapper]')
      ) return;
      // In create mode, always warn before discarding
      if (isCreating) {
        setPendingAction("close");
        setShowDiscardDialog(true);
      } else {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDiscardDialog, hasChanges]);

  const canSave = name.trim().length > 0;

  const handleSave = () => {
    const extras = {
      description: description || undefined,
      options: type === "select" || type === "multi-select" ? options : undefined,
      currencyCode: type === "currency" ? currencyCode : undefined,
      maxRating: type === "rating" ? maxRating : undefined,
      formula: type === "formula" ? formula : undefined,
    };
    if (isCreating) {
      onAdd?.(name, type, extras);
    } else {
      onUpdate?.(field!.id, { name, type, ...extras });
    }
    onClose();
  };

  // Guard close/back with unsaved changes check
  const handleClose = () => {
    if (hasChanges) {
      setPendingAction("close");
      setShowDiscardDialog(true);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (hasChanges) {
      setPendingAction("back");
      setShowDiscardDialog(true);
    } else {
      onBack?.();
    }
  };

  const confirmDiscard = () => {
    setShowDiscardDialog(false);
    if (pendingAction === "close") onClose();
    else if (pendingAction === "back") onBack?.();
    setPendingAction(null);
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
  const showNameError = !name.trim() && (nameTouched || !isCreating);

  return (
    <>
      <div ref={panelRef} className="w-96 border-l border-border bg-card h-full flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          {onBack && (
            <button onClick={handleBack} className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          <h3 className="text-sm font-semibold text-foreground flex-1">
            {isCreating ? "Create field" : `Edit ${field?.name}`}
          </h3>
          <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Detail section */}
          <div className="space-y-0.5">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Detail</span>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Field title <span className="text-red-400">*</span>
            </Label>
            <Input
              value={name}
              onChange={(e) => { setName(e.target.value); setNameTouched(true); }}
              onBlur={() => setNameTouched(true)}
              className={`h-9 text-sm ${showNameError ? "border-red-300 focus-visible:ring-red-200" : ""}`}
              placeholder={isCreating ? "e.g. Priority" : "Enter a field title"}
              autoFocus={isCreating}
            />
            {showNameError && (
              <p className="text-xs text-red-500">Field title is required</p>
            )}
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
              <Checkbox checked={addToLibrary} onCheckedChange={(v) => setAddToLibrary(!!v)} className="mt-0.5" />
              <span className="text-sm text-foreground leading-snug">Add to workspace field library</span>
            </label>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <Checkbox checked={notifyOnChange} onCheckedChange={(v) => setNotifyOnChange(!!v)} className="mt-0.5" />
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
                  <SelectTrigger className="h-8 text-xs w-24"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="h-8 text-xs">Invite</Button>
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

          {/* Also used in + Delete — only shown when editing an existing field */}
          {!isCreating && (
            <>
              <Separator />

              <div className="space-y-2">
                <span className="text-xs text-muted-foreground font-medium">Also used in</span>
                <div className="space-y-0.5">
                  {usedIn.map((place) => (
                    <div key={place.id} className="flex items-center gap-3 py-1.5 group/place cursor-pointer">
                      <div className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center shrink-0">
                        <ClipboardList className="h-3 w-3 text-gray-400" />
                      </div>
                      <span className="text-sm text-foreground flex-1 group-hover/place:underline underline-offset-2">{place.name}</span>
                      <span className="text-xs text-muted-foreground shrink-0">{place.type}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <span className="text-xs text-muted-foreground font-medium">Delete</span>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-muted-foreground">Remove this field from this project only</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0 h-7 text-xs px-3 text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 hover:border-red-400"
                    onClick={() => onDelete?.(field!.id)}
                  >
                    Remove field
                  </Button>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-muted-foreground">Delete this field here and everywhere it is used</span>
                  <Button
                    size="sm"
                    className="shrink-0 h-7 text-xs px-3 bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => onDelete?.(field!.id)}
                  >
                    Delete field
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" className="h-7 text-xs px-3" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="h-7 text-xs px-3"
            onClick={handleSave}
            disabled={!canSave}
          >
            {isCreating ? "Create field" : "Save field"}
          </Button>
        </div>
      </div>

      {/* Unsaved changes dialog */}
      <AlertDialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. If you leave now they'll be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setShowDiscardDialog(false); setPendingAction(null); }}>
              Keep editing
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDiscard}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
