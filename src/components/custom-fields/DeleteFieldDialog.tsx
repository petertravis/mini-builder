import { useState } from "react";
import { cn } from "@/lib/utils";
import { CustomField } from "@/types/custom-fields";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

const FIELD_USED_IN = [
  { id: "p1", name: "Food tabs",          type: "Project", color: "#f97316" },
  { id: "p2", name: "Grid breakdown",     type: "Project", color: "#8b5cf6" },
  { id: "p3", name: "TA Design Planning", type: "Project", color: "#6b7280" },
];

interface DeleteFieldDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  field: CustomField;
  onDeleteField: (id: string) => void;
  usedInOtherPlaces?: number;
  databaseName?: string;
}

export function DeleteFieldDialog({
  open,
  onOpenChange,
  field,
  onDeleteField,
  usedInOtherPlaces = 0,
  databaseName = "this project",
}: DeleteFieldDialogProps) {
  const [deleteEverywhere, setDeleteEverywhere] = useState(false);
  const [confirmName, setConfirmName] = useState("");

  const isGlobal = usedInOtherPlaces > 0;
  const canDelete = !deleteEverywhere || confirmName === field.name;

  const handleOpenChange = (val: boolean) => {
    if (!val) { setDeleteEverywhere(false); setConfirmName(""); }
    onOpenChange(val);
  };

  const handleDelete = () => {
    onDeleteField(field.id);
    handleOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete the "{field.name}" field from {databaseName}?</AlertDialogTitle>
          <AlertDialogDescription>
            This is a permanent action that cannot be undone. Existing values on tasks will
            be deleted and any rules or automations that use this field will stop working.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {isGlobal && (
          <div className={cn(
            "rounded-lg border transition-colors",
            deleteEverywhere ? "border-red-200 bg-red-50" : "border-gray-200 bg-gray-50"
          )}>
            {/* Checkbox row */}
            <label
              htmlFor="delete-everywhere"
              className="flex items-center gap-3 px-3 py-2.5 cursor-pointer"
            >
              <Checkbox
                id="delete-everywhere"
                checked={deleteEverywhere}
                onCheckedChange={(checked) => setDeleteEverywhere(checked === true)}
              />
              <span className={cn(
                "text-sm font-medium transition-colors",
                deleteEverywhere ? "text-red-700" : "text-gray-700"
              )}>
                Also delete from {usedInOtherPlaces} other {usedInOtherPlaces === 1 ? "place" : "places"}
              </span>
            </label>

            {/* Places list — always visible */}
            <div className="border-t border-gray-200 divide-y divide-gray-100">
              {FIELD_USED_IN.map((place) => (
                <div
                  key={place.id}
                  className="flex items-center gap-2.5 px-3 py-2"
                >
                  <div className="w-4 h-4 rounded shrink-0" style={{ backgroundColor: place.color }} />
                  <span className={cn(
                    "text-sm flex-1 transition-colors",
                    deleteEverywhere ? "text-red-800" : "text-gray-600"
                  )}>
                    {place.name}
                  </span>
                  <span className="text-xs text-gray-400">{place.type}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Helper text + confirmation — only when "delete everywhere" is checked */}
        {deleteEverywhere && (
          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">This will remove the field and all its data across your organization, affecting:</p>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-0.5">
                <li>Tasks in projects, portfolios, and My tasks</li>
                <li>Templates, dashboards, and bundles</li>
                <li>Rules, automations, and formulas using this field</li>
              </ul>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">
                Type <span className="font-medium text-gray-700">"{field.name}"</span> to confirm:
              </label>
              <Input
                value={confirmName}
                onChange={(e) => setConfirmName(e.target.value)}
                placeholder={field.name}
                autoFocus
              />
            </div>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={handleDelete} disabled={!canDelete}>
            {deleteEverywhere ? "Delete field everywhere" : `Delete field from ${databaseName}`}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
