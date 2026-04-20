import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomFields } from "@/hooks/useCustomFields";
import { MiniFieldBuilder } from "@/components/custom-fields/MiniFieldBuilder";
import { ColumnHeaderMenu } from "@/components/custom-fields/ColumnHeaderMenu";
import { FieldEditorPanel } from "@/components/custom-fields/FieldEditorPanel";
import { ColumnsSidePanel } from "@/components/custom-fields/ColumnsSidePanel";
import { Columns3, Filter, ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PrototypeNav } from "@/components/PrototypeNav";

const TASK_LOOKUP: Record<string, string> = {
  tk1: "Fix closing credits",
  tk2: "Update intro sequence",
  tk3: "Review color grading",
  tk4: "Add subtitle track",
  tk5: "Finalize sound mix",
  tk6: "Approve final cut",
};

const EPISODES = [
  { id: "e1", title: "Pilot", values: { f1: "o1", f2: "s4", f3: "2024-01-15", f4: "1", f5: "Sarah Chen", f6: "Mike Torres", f7: "t1,t4", f10: "tk1" } },
  { id: "e2", title: "The Setup", values: { f1: "o2", f2: "s4", f3: "2024-01-22", f4: "1", f5: "James Park", f6: "Mike Torres", f7: "t1", f10: "tk2" } },
  { id: "e3", title: "Breaking Point", values: { f1: "o1", f2: "s3", f3: "2024-01-29", f4: "1", f5: "Sarah Chen", f6: "Ana Ruiz", f7: "t3,t4", f10: "tk3,tk4" } },
  { id: "e4", title: "Aftermath", values: { f1: "o2", f2: "s2", f3: "2024-02-05", f4: "1", f5: "Lena Okafor", f6: "Ana Ruiz", f7: "t1", f10: "tk5" } },
  { id: "e5", title: "New Beginnings", values: { f1: "o3", f2: "s2", f3: "2024-02-12", f4: "1", f5: "James Park", f6: "Mike Torres", f7: "t2,t1", f10: "" } },
  { id: "e6", title: "The Reveal", values: { f1: "o1", f2: "s1", f3: "2024-02-19", f4: "1", f5: "Sarah Chen", f6: "—", f7: "t4", f10: "tk6" } },
  { id: "e7", title: "Crossroads", values: { f1: "o2", f2: "s1", f3: "2024-02-26", f4: "1", f5: "—", f6: "—", f7: "t1", f10: "" } },
  { id: "e8", title: "Season Finale", values: { f1: "o1", f2: "s1", f3: "2024-03-04", f4: "1", f5: "Sarah Chen", f6: "Mike Torres", f7: "t3,t1,t4", f10: "tk1,tk4" } },
];

function CellValue({
  fieldId,
  value,
  fields,
  onTicketClick,
}: {
  fieldId: string;
  value?: string;
  fields: ReturnType<typeof useCustomFields>["fields"];
  onTicketClick?: () => void;
}) {
  const field = fields.find((f) => f.id === fieldId);
  if (!field || !value || value === "—" || value === "") return <span className="text-xs text-gray-300">—</span>;

  if (field.type === "select" && field.options) {
    const opt = field.options.find((o) => o.id === value);
    if (opt) {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${opt.color}18`, color: opt.color }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: opt.color }} />
          {opt.label}
        </span>
      );
    }
  }

  if (field.type === "multi-select" && field.options) {
    const ids = value.split(",");
    return (
      <div className="flex flex-wrap gap-1">
        {ids.map((id) => {
          const opt = field.options?.find((o) => o.id === id);
          if (!opt) return null;
          return (
            <span key={id} className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: `${opt.color}18`, color: opt.color }}>
              {opt.label}
            </span>
          );
        })}
      </div>
    );
  }

  if (field.type === "relation") {
    const ids = value.split(",").filter(Boolean);
    if (ids.length === 0) return <span className="text-xs text-muted-foreground">—</span>;
    return (
      <div className="flex flex-wrap gap-1">
        {ids.map((id) => {
          const taskName = TASK_LOOKUP[id];
          if (!taskName) return null;
          return (
            <button
              key={id}
              onClick={(e) => {
                e.stopPropagation();
                onTicketClick?.();
              }}
              className="text-xs px-2 py-0.5 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer bg-white"
            >
              {taskName}
            </button>
          );
        })}
      </div>
    );
  }

  return <span className="text-xs text-foreground">{value}</span>;
}

export default function Index() {
  const navigate = useNavigate();
  const { fields, addField, updateField, deleteField, toggleVisibility } = useCustomFields();
  const [advancedEditId, setAdvancedEditId] = useState<string | null>(null);
  const [sidePanel, setSidePanel] = useState<"none" | "columns" | "editor" | "create">("none");

  const visibleFields = fields.filter((f) => f.visible);
  const advancedField = fields.find((f) => f.id === advancedEditId) ?? null;

  const openAdvanced = (fieldId?: string) => {
    if (fieldId) {
      setAdvancedEditId(fieldId);
      setSidePanel("editor");
    } else {
      setSidePanel("create");
    }
  };

  const handleDeleteFromPanel = (id: string) => {
    deleteField(id);
    setSidePanel("none");
    setAdvancedEditId(null);
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <PrototypeNav />
      <header className="border-b border-gray-200 px-6 py-3">
        <h1 className="text-base font-semibold text-gray-900">Episodes</h1>
      </header>

      <div className="flex-1 flex min-h-0">
        <div className="flex-1 flex flex-col min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-end px-4 py-1.5 border-b border-gray-200">
            <div className="flex items-center gap-0.5">
              <Button variant="ghost" size="sm" className="gap-1.5 text-gray-500 h-7 text-xs cursor-default hover:text-gray-700 hover:bg-gray-100">
                <Filter className="h-3.5 w-3.5" />
                Filter
              </Button>
              <Button variant="ghost" size="sm" className="gap-1.5 text-gray-500 h-7 text-xs cursor-default hover:text-gray-700 hover:bg-gray-100">
                <ArrowUpDown className="h-3.5 w-3.5" />
                Sort
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`gap-1.5 h-7 text-xs hover:bg-gray-100 ${sidePanel === "columns" ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setSidePanel(sidePanel === "columns" ? "none" : "columns")}
              >
                <Columns3 className="h-3.5 w-3.5" />
                Columns
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-white">
                  <th className="text-left px-6 py-2 text-xs font-medium text-gray-400 w-56">
                    Episode
                  </th>
                  {visibleFields.map((field) => (
                    <th key={field.id} className="text-left px-4 py-2 text-xs font-medium text-gray-400">
                      <ColumnHeaderMenu
                        field={field}
                        onAddField={addField}
                        onEditField={updateField}
                        onOpenAdvanced={openAdvanced}
                        onToggleVisibility={toggleVisibility}
                        onDeleteField={deleteField}
                        usedInOtherPlaces={3}
                        databaseName="Episodes"
                      />
                    </th>
                  ))}
                  <th className="w-10 px-1">
                    <MiniFieldBuilder
                      onAddField={addField}
                      onOpenAdvanced={openAdvanced}
                      editingField={null}
                      triggerVariant="add-column"
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {EPISODES.map((ep) => (
                  <tr key={ep.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-2.5 text-sm font-medium text-gray-800">{ep.title}</td>
                    {visibleFields.map((field) => (
                      <td key={field.id} className="px-4 py-2.5">
                        <CellValue
                          fieldId={field.id}
                          value={ep.values[field.id as keyof typeof ep.values]}
                          fields={fields}
                          onTicketClick={() => navigate("/project")}
                        />
                      </td>
                    ))}
                    <td className="px-2">
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {sidePanel === "create" && (
          <FieldEditorPanel
            onAdd={(name, type, extras) => {
              addField(name, type, extras);
              setSidePanel("none");
            }}
            onClose={() => setSidePanel("none")}
          />
        )}

        {sidePanel === "editor" && advancedField && (
          <FieldEditorPanel
            field={advancedField}
            onUpdate={updateField}
            onDelete={handleDeleteFromPanel}
            onClose={() => { setSidePanel("none"); setAdvancedEditId(null); }}
          />
        )}

        {sidePanel === "columns" && (
          <ColumnsSidePanel
            open
            onClose={() => setSidePanel("none")}
            fields={fields}
            onToggleVisibility={toggleVisibility}
            onAddField={addField}
            onEditField={updateField}
            onOpenAdvanced={openAdvanced}
            title="Show/hide columns"
          />
        )}
      </div>
    </div>
  );
}
