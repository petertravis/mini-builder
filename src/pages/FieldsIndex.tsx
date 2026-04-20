import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FieldTypeIcon } from "@/components/custom-fields/FieldTypeIcon";
import { FieldEditorPanel } from "@/components/custom-fields/FieldEditorPanel";
import { PrototypeNav } from "@/components/PrototypeNav";
import { useCustomFields } from "@/hooks/useCustomFields";
import { CustomField, FIELD_TYPE_META } from "@/types/custom-fields";

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

export default function FieldsIndex() {
  const { fields, addField, updateField, deleteField } = useCustomFields();
  const [search, setSearch] = useState("");
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [showCreatePanel, setShowCreatePanel] = useState(false);

  const filteredFields = fields.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );
  const selectedField = fields.find((f) => f.id === selectedFieldId) ?? null;

  const handleAddNew = () => {
    setSelectedFieldId(null);
    setShowCreatePanel(true);
  };

  const handleCreate = (name: string, type: import("@/types/custom-fields").FieldType, extras?: Partial<import("@/types/custom-fields").CustomField>) => {
    const newField = addField(name, type, extras);
    setShowCreatePanel(false);
    setSelectedFieldId(newField.id);
  };

  const handleDelete = (id: string) => {
    deleteField(id);
    if (selectedFieldId === id) setSelectedFieldId(null);
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <PrototypeNav />
      <div className="flex-1 flex min-h-0">
        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="px-5 py-3 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">Custom fields</h3>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-2 px-5 py-2 border-b border-gray-200">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search fields..."
                className="h-8 text-sm pl-8 border-gray-200"
              />
            </div>
            <Button size="sm" className="h-8 gap-1.5 text-xs bg-blue-600 hover:bg-blue-700" onClick={handleAddNew}>
              <Plus className="h-3.5 w-3.5" />
              New field
            </Button>
          </div>

          {/* Field list + editor */}
          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left">
                    <th className="px-5 py-2 text-xs font-medium text-gray-400">Name</th>
                    <th className="px-3 py-2 text-xs font-medium text-gray-400">Values</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFields.map((field) => (
                    <tr
                      key={field.id}
                      onClick={() => setSelectedFieldId(field.id)}
                      className={`border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedFieldId === field.id ? "bg-blue-50" : ""
                      }`}
                    >
                      <td className="px-5 py-2.5">
                        <div className="flex items-center gap-2">
                          <FieldTypeIcon type={field.type} />
                          <span className="font-medium text-gray-800">{field.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <FieldValuesPreview field={field} />
                      </td>
                    </tr>
                  ))}
                  {filteredFields.length === 0 && (
                    <tr>
                      <td colSpan={2} className="px-5 py-8 text-center text-gray-400 text-sm">
                        No fields found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {showCreatePanel && (
              <FieldEditorPanel
                onAdd={handleCreate}
                onClose={() => setShowCreatePanel(false)}
              />
            )}
            {!showCreatePanel && selectedField && (
              <FieldEditorPanel
                field={selectedField}
                onUpdate={updateField}
                onDelete={handleDelete}
                onClose={() => setSelectedFieldId(null)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
