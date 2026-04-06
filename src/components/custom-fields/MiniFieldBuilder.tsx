import { useState, useRef, useCallback } from "react";
import { Plus, Settings2, X, Pencil, ChevronDown, ClipboardList } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { FieldTypeIcon } from "./FieldTypeIcon";
import { CustomField, FieldType, ALL_FIELD_TYPES, FIELD_TYPE_META, SelectOption } from "@/types/custom-fields";

// ─── Used-in popover ──────────────────────────────────────────────────────────

const FIELD_USED_IN = [
  { id: "p1", name: "Food tabs",           type: "Project", emoji: "🍜" },
  { id: "p2", name: "Grid breakdown",      type: "Project", emoji: "🟣" },
  { id: "p3", name: "TA Design Planning",  type: "Project", emoji: "📋" },
];

function UsedInPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="font-semibold underline decoration-dotted underline-offset-2 cursor-pointer hover:text-amber-900 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          3 other places
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-56 p-0 shadow-lg"
        side="top"
        align="start"
        sideOffset={6}
        onPointerDownOutside={(e) => e.stopPropagation()}
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

interface MiniFieldBuilderProps {
  onAddField: (name: string, type: FieldType, extras?: Partial<CustomField>) => CustomField;
  onEditField?: (id: string, updates: Partial<CustomField>) => void;
  onOpenAdvanced: (fieldId?: string) => void;
  editingField?: CustomField | null;
  triggerVariant?: "add-column" | "edit" | "add-button" | "icon-edit" | "hidden";
  externalOpen?: boolean;
  onExternalOpenChange?: (open: boolean) => void;
  /** Grace period (ms) after opening during which outside clicks are ignored */
  dismissGracePeriod?: number;
  disableOutsideClose?: boolean;
}

export function MiniFieldBuilder({
  onAddField,
  onEditField,
  onOpenAdvanced,
  editingField,
  triggerVariant = editingField ? "edit" : "add-button",
  externalOpen,
  onExternalOpenChange,
  dismissGracePeriod = 0,
  disableOutsideClose = false,
}: MiniFieldBuilderProps) {
  const openTimestamp = useRef(0);
  const optionRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = onExternalOpenChange ?? setInternalOpen;
  const [name, setName] = useState(editingField?.name ?? "");
  const [type, setType] = useState<FieldType>(editingField?.type ?? "text");
  const [options, setOptions] = useState<SelectOption[]>(editingField?.options ?? []);

  const isEditing = !!editingField;
  const [usedInExpanded, setUsedInExpanded] = useState(false);
  const showOptions = type === "select" || type === "multi-select";

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) {
      openTimestamp.current = Date.now();
    }
    setOpen(isOpen);
    if (isOpen && editingField) {
      setName(editingField.name);
      setType(editingField.type);
      setOptions(editingField.options ?? []);
    } else if (isOpen) {
      setName("");
      setType("text");
      setOptions([]);
    }
  };

  const handleOutsideInteraction = (e: Event) => {
    if (disableOutsideClose || (dismissGracePeriod > 0 && Date.now() - openTimestamp.current < dismissGracePeriod)) {
      e.preventDefault();
    }
  };

  const handleSave = () => {
    if (!name.trim()) return;
    if (isEditing && onEditField) {
      onEditField(editingField.id, {
        name,
        type,
        options: showOptions ? options : undefined,
      });
    } else {
      onAddField(name, type, {
        options: showOptions ? options : undefined,
      });
    }
    setOpen(false);
  };

  const addOption = useCallback((focusAfter = true) => {
    const colors = [
      "hsl(0, 72%, 51%)", "hsl(36, 80%, 50%)", "hsl(150, 50%, 45%)",
      "hsl(210, 60%, 50%)", "hsl(280, 60%, 55%)", "hsl(330, 55%, 50%)",
    ];
    setOptions((prev) => {
      const next = [...prev, { id: `opt-${Date.now()}`, label: "", color: colors[prev.length % colors.length] }];
      if (focusAfter) {
        // Focus the new input on the next render tick
        setTimeout(() => optionRefs.current[next.length - 1]?.focus(), 0);
      }
      return next;
    });
  }, []);

  const updateOption = (idx: number, label: string) => {
    setOptions(options.map((o, i) => (i === idx ? { ...o, label } : o)));
  };

  const removeOption = (idx: number) => {
    setOptions((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      // Focus the previous option or the "add option" link after deletion
      setTimeout(() => optionRefs.current[Math.max(0, idx - 1)]?.focus(), 0);
      return next;
    });
  };

  const handleOptionKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (idx === options.length - 1) {
        // On last option: create a new one and focus it
        addOption(true);
      } else {
        // Move to next option
        optionRefs.current[idx + 1]?.focus();
      }
    } else if (e.key === "Tab" && !e.shiftKey) {
      if (idx < options.length - 1) {
        e.preventDefault();
        optionRefs.current[idx + 1]?.focus();
      }
      // Last option: let natural tab flow continue
    } else if (e.key === "Tab" && e.shiftKey) {
      if (idx > 0) {
        e.preventDefault();
        optionRefs.current[idx - 1]?.focus();
      }
      // First option: let natural shift+tab flow continue
    } else if (e.key === "Backspace" && options[idx].label === "") {
      e.preventDefault();
      removeOption(idx);
    }
  };

  const trigger = (() => {
    switch (triggerVariant) {
      case "add-column":
        return (
          <button className="flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors">
            <Plus className="h-4 w-4" />
          </button>
        );
      case "edit":
        return (
          <button className="flex items-center gap-1.5 px-2 py-1 text-sm rounded-md hover:bg-accent transition-colors">
            <FieldTypeIcon type={editingField!.type} className="h-3.5 w-3.5" />
            <span className="text-muted-foreground">{editingField!.name}</span>
          </button>
        );
      case "icon-edit":
        return (
          <button className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-all">
            <Pencil className="h-3.5 w-3.5" />
          </button>
        );
      case "hidden":
        return <span aria-hidden className="absolute inset-0 pointer-events-none" />;
      default:
        return (
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
            <Plus className="h-4 w-4" />
            Add field
          </Button>
        );
    }
  })();

  return (
    <Popover open={open} onOpenChange={handleOpen} modal={disableOutsideClose}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        className="w-80 p-0 flex flex-col max-h-[480px]"
        align="start"
        onPointerDownOutside={handleOutsideInteraction}
        onInteractOutside={handleOutsideInteraction}
        onFocusOutside={handleOutsideInteraction}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <FieldTypeIcon type={type} className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-semibold text-gray-900">
              {isEditing ? `${FIELD_TYPE_META[type].label} field` : "New field"}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 min-h-0">
          {/* Field title */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-gray-500">
              Field title <span className="text-red-400">*</span>
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priority"
              className="h-8 text-sm border-gray-200"
              autoFocus
            />
          </div>

          {/* Type selector — only shown when creating */}
          {!isEditing && (
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-500">Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as FieldType)}>
                <SelectTrigger className="h-8 text-sm border-gray-200">
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
          )}

          {/* Options */}
          {showOptions && (
            <>
              <Separator className="bg-gray-100" />
              <div className="space-y-1">
                <Label className="text-xs font-medium text-gray-500">Options</Label>
                <div className="space-y-0.5 mt-1">
                  {options.map((opt, idx) => (
                    <div key={opt.id} className="flex items-center gap-2 py-0.5 group/opt">
                      <div
                        className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center"
                        style={{ backgroundColor: opt.color }}
                      >
                        <ChevronDown className="h-2.5 w-2.5 text-white" />
                      </div>
                      <Input
                        ref={(el) => { optionRefs.current[idx] = el; }}
                        value={opt.label}
                        onChange={(e) => updateOption(idx, e.target.value)}
                        onKeyDown={(e) => handleOptionKeyDown(e, idx)}
                        className="h-6 text-xs flex-1 border-transparent shadow-none px-1 focus-visible:border-gray-200 focus-visible:ring-0"
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
                  onClick={() => addOption(true)}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors mt-1 py-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add an option
                </button>
              </div>
            </>
          )}
        </div>

        {/* "Used in other places" warning — sticky, outside scroll area */}
        {isEditing && (
          <div className="shrink-0 px-4 py-2">
            {/* Warning banner — rounded when collapsed, rounded-t when expanded */}
            <button
              type="button"
              onClick={() => setUsedInExpanded((v) => !v)}
              className={`flex items-center gap-2 w-full bg-amber-50 border border-amber-200 px-3 py-2 text-left hover:bg-amber-100 transition-colors ${usedInExpanded ? "rounded-t-lg" : "rounded-lg"}`}
            >
              <Settings2 className="h-3.5 w-3.5 text-amber-500 shrink-0" />
              <p className="text-xs text-amber-800 flex-1">
                Used in <span className="font-semibold">3 other places</span>. Changes apply everywhere.
              </p>
              <ChevronDown
                className={`h-3 w-3 text-amber-400 shrink-0 transition-transform duration-150 ${usedInExpanded ? "rotate-180" : ""}`}
              />
            </button>

            {/* Expanded place list — appears below banner, connected to its bottom edge */}
            {usedInExpanded && (
              <div className="border-l border-r border-b border-gray-200 rounded-b-lg overflow-hidden">
                {FIELD_USED_IN.map((place, i) => (
                  <button
                    key={place.id}
                    type="button"
                    className={`flex items-center gap-2.5 w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors ${
                      i < FIELD_USED_IN.length - 1 ? "border-b border-gray-100" : ""
                    }`}
                  >
                    <div className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center shrink-0">
                      <ClipboardList className="h-3 w-3 text-gray-400" />
                    </div>
                    <span className="text-xs font-medium text-gray-700 flex-1 truncate">{place.name}</span>
                    <span className="text-xs text-gray-400 shrink-0">{place.type}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <Separator className="bg-gray-100" />

        {/* Footer */}
        <div className="px-4 py-2.5 flex items-center justify-between shrink-0">
          <button
            onClick={() => {
              setOpen(false);
              onOpenAdvanced(editingField?.id);
            }}
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            Advanced settings
          </button>
          <div className="flex gap-2">
            {isEditing && (
              <Button variant="outline" size="sm" className="h-7 text-xs border-gray-200 text-gray-600" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            )}
            <Button size="sm" className="h-7 text-xs px-3 bg-blue-600 hover:bg-blue-700" onClick={handleSave} disabled={!name.trim()}>
              {isEditing ? "Save" : "Add field"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
