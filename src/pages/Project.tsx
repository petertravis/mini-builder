import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomFields } from "@/hooks/useCustomFields";
import { MiniFieldBuilder } from "@/components/custom-fields/MiniFieldBuilder";
import { ColumnHeaderMenu } from "@/components/custom-fields/ColumnHeaderMenu";
import { FieldEditorPanel } from "@/components/custom-fields/FieldEditorPanel";
import { ColumnsSidePanel } from "@/components/custom-fields/ColumnsSidePanel";
import { WorkflowPanel } from "@/components/workflow/WorkflowPanel";
import { ArrowLeft, Columns3, Filter, ArrowUpDown, MoreHorizontal, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomField } from "@/types/custom-fields";
import { PrototypeNav } from "@/components/PrototypeNav";

const PROJECT_FIELDS_INITIAL: CustomField[] = [
  {
    id: "pf1", name: "Status", type: "select", required: false, visible: true,
    options: [
      { id: "ps1", label: "To Do", color: "hsl(20, 10%, 60%)" },
      { id: "ps2", label: "In Progress", color: "hsl(210, 60%, 50%)" },
      { id: "ps3", label: "Done", color: "hsl(150, 50%, 45%)" },
    ],
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "pf2", name: "Priority", type: "select", required: false, visible: true,
    options: [
      { id: "pp1", label: "High", color: "hsl(0, 72%, 51%)" },
      { id: "pp2", label: "Medium", color: "hsl(36, 80%, 50%)" },
      { id: "pp3", label: "Low", color: "hsl(150, 50%, 45%)" },
    ],
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "pf3", name: "Assignee", type: "people", required: false, visible: true,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "pf4", name: "Due Date", type: "date", required: false, visible: true,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "pf5", name: "Tags", type: "multi-select", required: false, visible: false,
    options: [
      { id: "pt1", label: "Bug", color: "hsl(0, 72%, 51%)" },
      { id: "pt2", label: "Feature", color: "hsl(210, 60%, 50%)" },
      { id: "pt3", label: "Improvement", color: "hsl(150, 50%, 45%)" },
    ],
    createdAt: new Date("2024-02-01"),
  },
];

const TASKS = [
  { id: "tk1", title: "Fix closing credits", values: { pf1: "ps2", pf2: "pp1", pf3: "Sarah Chen", pf4: "2024-02-15" } },
  { id: "tk2", title: "Update intro sequence", values: { pf1: "ps1", pf2: "pp2", pf3: "James Park", pf4: "2024-02-20" } },
  { id: "tk3", title: "Review color grading", values: { pf1: "ps3", pf2: "pp3", pf3: "Ana Ruiz", pf4: "2024-01-30" } },
  { id: "tk4", title: "Add subtitle track", values: { pf1: "ps2", pf2: "pp2", pf3: "Mike Torres", pf4: "2024-03-01" } },
  { id: "tk5", title: "Finalize sound mix", values: { pf1: "ps1", pf2: "pp1", pf3: "Lena Okafor", pf4: "2024-03-10" } },
  { id: "tk6", title: "Approve final cut", values: { pf1: "ps1", pf2: "pp3", pf3: "Sarah Chen", pf4: "2024-03-15" } },
];

function CellValue({ fieldId, value, fields }: { fieldId: string; value?: string; fields: CustomField[] }) {
  const field = fields.find((f) => f.id === fieldId);
  if (!field || !value || value === "—") return <span className="text-xs text-muted-foreground">—</span>;

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

  return <span className="text-xs text-foreground">{value}</span>;
}

type SidePanel = "none" | "columns" | "workflow" | "editor";

export default function Project() {
  const navigate = useNavigate();
  const { fields, addField, updateField, deleteField, toggleVisibility } = useCustomFields(PROJECT_FIELDS_INITIAL);
  const [advancedEditId, setAdvancedEditId] = useState<string | null>(null);
  const [sidePanel, setSidePanel] = useState<SidePanel>("none");

  const visibleFields = fields.filter((f) => f.visible);
  const advancedField = fields.find((f) => f.id === advancedEditId) ?? null;

  const togglePanel = (panel: SidePanel) => {
    setSidePanel((prev) => (prev === panel ? "none" : panel));
  };

  const openAdvanced = (fieldId?: string) => {
    if (fieldId) {
      setAdvancedEditId(fieldId);
      setSidePanel("editor");
    }
  };

  const handleDeleteFromPanel = (id: string) => {
    deleteField(id);
    setSidePanel("workflow");
    setAdvancedEditId(null);
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <PrototypeNav />
      <header className="border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-base font-semibold text-gray-900">Episode Tasks</h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          className={`gap-1.5 text-xs border-gray-200 ${sidePanel === "workflow" ? "bg-gray-100 text-gray-900" : "text-gray-500"}`}
          onClick={() => togglePanel("workflow")}
        >
          <Settings2 className="h-3.5 w-3.5" />
          Workflow
        </Button>
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
                onClick={() => togglePanel("columns")}
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
                  <th className="text-left px-6 py-2 text-xs font-medium text-gray-400 w-64">
                    Task
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
                {TASKS.map((task) => (
                  <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-2.5 text-sm font-medium text-gray-800">{task.title}</td>
                    {visibleFields.map((field) => (
                      <td key={field.id} className="px-4 py-2.5">
                        <CellValue fieldId={field.id} value={task.values[field.id as keyof typeof task.values]} fields={fields} />
                      </td>
                    ))}
                    <td className="px-2">
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {sidePanel === "editor" && advancedField && (
          <FieldEditorPanel
            field={advancedField}
            onUpdate={updateField}
            onDelete={handleDeleteFromPanel}
            onClose={() => { setSidePanel("none"); setAdvancedEditId(null); }}
            onBack={() => { setSidePanel("workflow"); setAdvancedEditId(null); }}
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

        {sidePanel === "workflow" && (
          <WorkflowPanel
            open
            onClose={() => setSidePanel("none")}
            fields={fields}
            onAddField={addField}
            onEditField={updateField}
            onOpenAdvanced={openAdvanced}
          />
        )}
      </div>
    </div>
  );
}
