import { useState } from "react";
import { ArrowLeft, ChevronRight, ChevronDown, FileText, FolderKanban, LayoutList, Plus, Settings2, Users, X, Zap } from "lucide-react";
import { CustomField, FieldType, ALL_FIELD_TYPES, FIELD_TYPE_META, SelectOption } from "@/types/custom-fields";
import { FieldTypeIcon } from "../custom-fields/FieldTypeIcon";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

type WorkflowView = "main" | "fields" | "create";

interface WorkflowPanelProps {
  open: boolean;
  onClose: () => void;
  fields: CustomField[];
  onAddField: (name: string, type: FieldType, extras?: Partial<CustomField>) => CustomField;
  onEditField: (id: string, updates: Partial<CustomField>) => void;
  onOpenAdvanced: (fieldId?: string) => void;
}

const DEFAULT_NEW_OPTIONS: SelectOption[] = [
  { id: "opt-wf-1", label: "", color: "hsl(150, 50%, 45%)" },
  { id: "opt-wf-2", label: "", color: "hsl(0, 72%, 51%)" },
];

export function WorkflowPanel({
  open,
  onClose,
  fields,
  onAddField,
  onEditField,
  onOpenAdvanced,
}: WorkflowPanelProps) {
  const [view, setView] = useState<WorkflowView>("main");

  // Create form state
  const [createName, setCreateName] = useState("");
  const [createNameTouched, setCreateNameTouched] = useState(false);
  const [createType, setCreateType] = useState<FieldType>("select");
  const [createOptions, setCreateOptions] = useState<SelectOption[]>(DEFAULT_NEW_OPTIONS);
  const [createAddToLibrary, setCreateAddToLibrary] = useState(false);
  const [createNotifyOnChange, setCreateNotifyOnChange] = useState(false);
  const [createAccessLevel, setCreateAccessLevel] = useState("database-members");

  const showCreateOptions = createType === "select" || createType === "multi-select";
  const canCreate = createName.trim().length > 0;

  const resetCreate = () => {
    setCreateName("");
    setCreateNameTouched(false);
    setCreateType("select");
    setCreateOptions([
      { id: `opt-wf-${Date.now()}-1`, label: "", color: "hsl(150, 50%, 45%)" },
      { id: `opt-wf-${Date.now()}-2`, label: "", color: "hsl(0, 72%, 51%)" },
    ]);
    setCreateAddToLibrary(false);
    setCreateNotifyOnChange(false);
    setCreateAccessLevel("database-members");
  };

  const handleCreate = () => {
    if (!canCreate) return;
    onAddField(createName.trim(), createType, {
      options: showCreateOptions ? createOptions.filter((o) => o.label.trim()) : undefined,
    });
    resetCreate();
    setView("fields");
  };

  const addCreateOption = () => {
    const colors = ["hsl(210, 60%, 50%)", "hsl(280, 60%, 55%)", "hsl(36, 80%, 50%)", "hsl(330, 55%, 50%)"];
    setCreateOptions((prev) => [
      ...prev,
      { id: `opt-wf-${Date.now()}`, label: "", color: colors[prev.length % colors.length] },
    ]);
  };

  const updateCreateOption = (idx: number, label: string) => {
    setCreateOptions((prev) => prev.map((o, i) => (i === idx ? { ...o, label } : o)));
  };

  const removeCreateOption = (idx: number) => {
    setCreateOptions((prev) => prev.filter((_, i) => i !== idx));
  };

  if (!open) return null;

  // ── Create view ───────────────────────────────────────────────────────────────
  if (view === "create") {
    return (
      <div className="w-96 border-l border-border bg-card flex flex-col shrink-0 animate-slide-in-right">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <button
            onClick={() => { resetCreate(); setView("fields"); }}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h3 className="text-sm font-semibold text-foreground flex-1">Create field</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="space-y-0.5">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Detail</span>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Field title <span className="text-red-400">*</span>
            </Label>
            <Input
              value={createName}
              onChange={(e) => { setCreateName(e.target.value); setCreateNameTouched(true); }}
              onBlur={() => setCreateNameTouched(true)}
              className={`h-9 text-sm ${!createName.trim() && createNameTouched ? "border-red-300 focus-visible:ring-red-200" : ""}`}
              placeholder="e.g. Priority"
              autoFocus
            />
            {!createName.trim() && createNameTouched && (
              <p className="text-xs text-red-500">Field title is required</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Field type</Label>
            <Select value={createType} onValueChange={(v) => setCreateType(v as FieldType)}>
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

          <button
            onClick={() => {}}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Plus className="h-3 w-3" />
            Add a description
          </button>

          {showCreateOptions && (
            <>
              <Separator />
              <div className="space-y-2">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Options</span>
                {createOptions.map((opt, idx) => (
                  <div key={opt.id} className="flex items-center gap-2.5 py-1">
                    <div className="w-5 h-5 rounded-md shrink-0 flex items-center justify-center" style={{ backgroundColor: opt.color }}>
                      <ChevronDown className="h-3 w-3 text-white" />
                    </div>
                    <Input
                      value={opt.label}
                      onChange={(e) => updateCreateOption(idx, e.target.value)}
                      className="h-7 text-xs flex-1 border-none shadow-none px-0 focus-visible:ring-0"
                      placeholder="Option label"
                    />
                    <button onClick={() => removeCreateOption(idx)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <button onClick={addCreateOption} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors py-1">
                  <Plus className="h-3 w-3" />
                  Add an option
                </button>
              </div>
            </>
          )}

          <Separator />

          {/* Settings */}
          <div className="space-y-3">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Settings</span>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <Checkbox checked={createAddToLibrary} onCheckedChange={(v) => setCreateAddToLibrary(!!v)} className="mt-0.5" />
              <span className="text-sm text-foreground leading-snug">Add to workspace field library</span>
            </label>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <Checkbox checked={createNotifyOnChange} onCheckedChange={(v) => setCreateNotifyOnChange(!!v)} className="mt-0.5" />
              <span className="text-sm text-foreground leading-snug">Notify collaborators when this field's value is changed</span>
            </label>
          </div>

          <Separator />

          {/* Access */}
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
              <Select value={createAccessLevel} onValueChange={setCreateAccessLevel}>
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
        </div>

        <div className="p-3 border-t border-border flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" className="h-7 text-xs px-3" onClick={() => { resetCreate(); setView("fields"); }}>
            Cancel
          </Button>
          <Button size="sm" className="h-7 text-xs px-3" onClick={handleCreate} disabled={!canCreate}>
            Create field
          </Button>
        </div>
      </div>
    );
  }

  // ── Fields view ───────────────────────────────────────────────────────────────
  if (view === "fields") {
    return (
      <div className="w-96 border-l border-border bg-card flex flex-col shrink-0 animate-slide-in-right">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <button
            onClick={() => setView("main")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h3 className="text-sm font-semibold text-foreground flex-1">Fields</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-3 flex items-center justify-between border-b border-border">
          <span className="text-sm font-semibold text-foreground">Added to project</span>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs gap-1 border-gray-200"
            onClick={() => setView("create")}
          >
            <Plus className="h-3 w-3" />
            Add field
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {fields.map((field) => (
            <button
              key={field.id}
              onClick={() => onOpenAdvanced(field.id)}
              className="w-full flex items-start gap-3 px-5 py-3.5 hover:bg-accent/50 transition-colors text-left border-b border-border/50"
            >
              <FieldTypeIcon type={field.type} className="h-5 w-5 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-foreground block">{field.name}</span>
                <FieldSubline field={field} />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Main workflow view ────────────────────────────────────────────────────────
  return (
    <div className="w-96 border-l border-border bg-card flex flex-col shrink-0 animate-slide-in-right">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground flex-1">Workflow</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">This project</span>
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
            Add
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">View and edit features on this project</p>

        <div className="space-y-2">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Intake</span>
          <WorkflowItem icon={FileText} label="Forms" count={1} />
          <WorkflowItem icon={LayoutList} label="Task types and templates" count={2} />
        </div>

        <div className="space-y-2">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Organize</span>
          <WorkflowItem icon={FolderKanban} label="Sections" count={4} />
          <WorkflowItem
            icon={Settings2}
            label="Fields"
            count={fields.length}
            onClick={() => setView("fields")}
          />
        </div>

        <div className="space-y-2">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Automate</span>
          <WorkflowItem icon={Zap} label="Rules" count={1} />
        </div>
      </div>
    </div>
  );
}

function WorkflowItem({
  icon: Icon,
  label,
  count,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  count?: number;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border hover:bg-accent/50 transition-colors text-left"
    >
      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
      <span className="text-sm text-foreground flex-1">{label}</span>
      {count != null && (
        <span className="text-xs text-muted-foreground bg-secondary rounded-full px-2 py-0.5">{count}</span>
      )}
      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
    </button>
  );
}

function FieldSubline({ field }: { field: CustomField }) {
  if ((field.type === "select" || field.type === "multi-select") && field.options?.length) {
    const shown = field.options.slice(0, 3);
    const remaining = field.options.length - 3;
    return (
      <div className="flex items-center gap-1 flex-wrap mt-0.5">
        {shown.map((opt) => (
          <span key={opt.id} className="inline-flex items-center gap-1 text-xs">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: opt.color }} />
            <span className="text-muted-foreground">{opt.label}</span>
          </span>
        ))}
        {remaining > 0 && (
          <span className="text-xs text-muted-foreground">+{remaining}</span>
        )}
      </div>
    );
  }
  return (
    <span className="text-xs text-muted-foreground mt-0.5 block">
      {field.description?.trim() || "No description provided"}
    </span>
  );
}
