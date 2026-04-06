import { useState } from "react";
import { ArrowLeft, ChevronRight, Columns3, FileText, FolderKanban, LayoutList, Settings2, Workflow as WorkflowIcon, X, Zap } from "lucide-react";
import { CustomField, FieldType, FIELD_TYPE_META } from "@/types/custom-fields";
import { FieldTypeIcon } from "../custom-fields/FieldTypeIcon";
import { MiniFieldBuilder } from "../custom-fields/MiniFieldBuilder";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type WorkflowView = "main" | "fields";

interface WorkflowPanelProps {
  open: boolean;
  onClose: () => void;
  fields: CustomField[];
  onAddField: (name: string, type: FieldType, extras?: Partial<CustomField>) => CustomField;
  onEditField: (id: string, updates: Partial<CustomField>) => void;
  onOpenAdvanced: (fieldId?: string) => void;
}

export function WorkflowPanel({
  open,
  onClose,
  fields,
  onAddField,
  onEditField,
  onOpenAdvanced,
}: WorkflowPanelProps) {
  const [view, setView] = useState<WorkflowView>("main");

  if (!open) return null;

  if (view === "fields") {
    return (
      <div className="w-96 border-l border-border bg-card flex flex-col shrink-0 animate-slide-in-right">
        {/* Fields header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <button
            onClick={() => setView("main")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h3 className="text-sm font-semibold text-foreground flex-1">Fields</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Added to project + Add */}
        <div className="px-5 py-3 flex items-center justify-between border-b border-border">
          <span className="text-sm font-semibold text-foreground">Added to project</span>
          <MiniFieldBuilder
            onAddField={onAddField}
            onEditField={onEditField}
            onOpenAdvanced={onOpenAdvanced}
            editingField={null}
            triggerVariant="add-button"
          />
        </div>

        {/* Field list */}
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

  // Main workflow view
  return (
    <div className="w-96 border-l border-border bg-card flex flex-col shrink-0 animate-slide-in-right">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground flex-1">Workflow</h3>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* This project */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">This project</span>
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
            Add
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">View and edit features on this project</p>

        {/* Intake */}
        <div className="space-y-2">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Intake</span>
          <WorkflowItem icon={FileText} label="Forms" count={1} />
          <WorkflowItem icon={LayoutList} label="Task types and templates" count={2} />
        </div>

        {/* Organize */}
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

        {/* Automate */}
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
          <span
            key={opt.id}
            className="inline-flex items-center gap-1 text-xs"
          >
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
