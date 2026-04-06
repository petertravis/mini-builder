import { useState, useEffect } from "react";
import { Search, Plus, LayoutGrid, Database } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FieldTypeIcon } from "./FieldTypeIcon";
import { FieldEditorPanel } from "./FieldEditorPanel";
import { CustomField, FieldType, FIELD_TYPE_META } from "@/types/custom-fields";

type FilterScope = "local" | "all";
type ObjectType = "database" | "project";

interface FieldIndexModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fields: CustomField[];
  onAddField: (name: string, type: FieldType, extras?: Partial<CustomField>) => CustomField;
  onUpdateField: (id: string, updates: Partial<CustomField>) => void;
  onDeleteField: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  initialEditFieldId?: string | null;
  databaseName?: string;
  objectType?: ObjectType;
}

export function FieldIndexModal({
  open,
  onOpenChange,
  fields,
  onAddField,
  onUpdateField,
  onDeleteField,
  onToggleVisibility,
  initialEditFieldId,
  databaseName = "Episodes",
  objectType = "database",
}: FieldIndexModalProps) {
  const [search, setSearch] = useState("");
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [scope, setScope] = useState<FilterScope>("local");

  const localLabel = objectType === "project" ? "From this project" : "From this database";

  useEffect(() => {
    if (open) {
      setSelectedFieldId(initialEditFieldId ?? null);
      setSearch("");
    }
  }, [open, initialEditFieldId]);

  const filteredFields = fields.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedField = fields.find((f) => f.id === selectedFieldId) ?? null;

  const handleAddNew = () => {
    const newField = onAddField("New Field", "text");
    setSelectedFieldId(newField.id);
  };

  const handleDelete = (id: string) => {
    onDeleteField(id);
    if (selectedFieldId === id) setSelectedFieldId(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[88vh] p-0 gap-0 flex overflow-hidden [&>button:last-child]:hidden">
        {/* Left sidebar nav */}
        <div className="w-48 shrink-0 border-r border-border bg-secondary/20 flex flex-col">
          <div className="px-4 py-4">
            <h2 className="text-base font-semibold text-foreground">Custom fields</h2>
          </div>
          <nav className="px-2 space-y-0.5">
            <button
              onClick={() => setScope("all")}
              className={`flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md transition-colors ${
                scope === "all" ? "bg-accent text-foreground font-medium" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              All custom fields
            </button>
            <button
              onClick={() => setScope("local")}
              className={`flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md transition-colors ${
                scope === "local" ? "bg-accent text-foreground font-medium" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              }`}
            >
              <Database className="h-4 w-4" />
              {localLabel}
            </button>
          </nav>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="px-5 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">
              {scope === "local" ? localLabel : "All custom fields"}
            </h3>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-2 px-5 py-2 border-b border-border">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search fields..."
                className="h-8 text-sm pl-8"
                tabIndex={-1}
              />
            </div>
            <Button size="sm" className="h-8 gap-1.5 text-xs" onClick={handleAddNew}>
              <Plus className="h-3.5 w-3.5" />
              New field
            </Button>
          </div>

          {/* Field list */}
          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-5 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                    <th className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Values</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFields.map((field) => (
                    <tr
                      key={field.id}
                      onClick={() => setSelectedFieldId(field.id)}
                      className={`border-b border-border cursor-pointer transition-colors hover:bg-accent/50 ${
                        selectedFieldId === field.id ? "bg-accent" : ""
                      }`}
                    >
                      <td className="px-5 py-2.5">
                        <div className="flex items-center gap-2">
                          <FieldTypeIcon type={field.type} />
                          <span className="font-medium text-foreground">{field.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <FieldValuesPreview field={field} />
                      </td>
                    </tr>
                  ))}
                  {filteredFields.length === 0 && (
                    <tr>
                      <td colSpan={2} className="px-5 py-8 text-center text-muted-foreground text-sm">
                        No fields found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Side panel editor */}
            {selectedField && (
              <FieldEditorPanel
                field={selectedField}
                onUpdate={onUpdateField}
                onDelete={handleDelete}
                onClose={() => setSelectedFieldId(null)}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FieldValuesPreview({ field }: { field: CustomField }) {
  if ((field.type === "select" || field.type === "multi-select") && field.options?.length) {
    const shown = field.options.slice(0, 3);
    const remaining = field.options.length - 3;
    return (
      <div className="flex items-center gap-1 flex-wrap">
        {shown.map((opt) => (
          <span
            key={opt.id}
            className="text-xs px-2 py-0.5 rounded font-medium"
            style={{ backgroundColor: `${opt.color}20`, color: opt.color }}
          >
            {opt.label}
          </span>
        ))}
        {remaining > 0 && (
          <span className="text-xs text-muted-foreground">+{remaining}</span>
        )}
      </div>
    );
  }

  return (
    <span className="text-xs text-muted-foreground">
      {FIELD_TYPE_META[field.type].label}
    </span>
  );
}
