import { useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { CustomField, FieldType } from "@/types/custom-fields";
import { FieldTypeIcon } from "./FieldTypeIcon";
import { MiniFieldBuilder } from "./MiniFieldBuilder";

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
  onEditField,
  onOpenAdvanced,
  title = "Show/hide columns",
}: ColumnsSidePanelProps) {
  if (!open) return null;

  return (
    <div className="w-80 border-l border-border bg-card flex flex-col shrink-0 animate-slide-in-right">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground flex-1">{title}</h3>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Description + Add */}
      <div className="px-4 py-3 flex items-start justify-between gap-2 border-b border-border">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Show, hide, and reorder columns in this view
        </p>
        <MiniFieldBuilder
          onAddField={onAddField}
          onEditField={onEditField}
          onOpenAdvanced={onOpenAdvanced}
          editingField={null}
          triggerVariant="add-button"
        />
      </div>

      {/* Field list */}
      <div className="flex-1 overflow-y-auto py-1">
        {fields.map((field) => (
          <div
            key={field.id}
            className="flex items-center gap-3 px-4 py-2.5 group hover:bg-accent/50 transition-colors"
          >
            <FieldTypeIcon type={field.type} className="h-4 w-4 shrink-0" />
            <span className="text-sm text-foreground flex-1 truncate">{field.name}</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onToggleVisibility(field.id)}
                className={`transition-colors ${
                  field.visible
                    ? "text-primary"
                    : "text-muted-foreground/40"
                }`}
              >
                {field.visible ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
