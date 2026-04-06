import { useState } from "react";
import { Pencil, ArrowUpDown, Filter, Layers, Plus, ArrowLeftRight, EyeOff, Trash2, RefreshCw } from "lucide-react";
import { CustomField, FieldType } from "@/types/custom-fields";
import { FieldTypeIcon } from "./FieldTypeIcon";
import { MiniFieldBuilder } from "./MiniFieldBuilder";
import { FieldPermissionsModal } from "./FieldPermissionsModal";
import { DeleteFieldDialog } from "./DeleteFieldDialog";
import { ConvertFieldModal } from "./ConvertFieldModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ColumnHeaderMenuProps {
  field: CustomField;
  onAddField: (name: string, type: FieldType, extras?: Partial<CustomField>) => CustomField;
  onEditField: (id: string, updates: Partial<CustomField>) => void;
  onOpenAdvanced: (fieldId?: string) => void;
  onToggleVisibility?: (id: string) => void;
  onDeleteField?: (id: string) => void;
  /** Number of other places this field is used beyond the current context */
  usedInOtherPlaces?: number;
  databaseName?: string;
}

export function ColumnHeaderMenu({
  field,
  onAddField,
  onEditField,
  onOpenAdvanced,
  onToggleVisibility,
  onDeleteField,
  usedInOtherPlaces = 0,
  databaseName,
}: ColumnHeaderMenuProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [convertOpen, setConvertOpen] = useState(false);
  const [pendingEditOpen, setPendingEditOpen] = useState(false);
  const [pendingPermissionsOpen, setPendingPermissionsOpen] = useState(false);
  const [pendingConvertOpen, setPendingConvertOpen] = useState(false);

  return (
    <div className="relative inline-flex">
      <DropdownMenu
        open={menuOpen}
        onOpenChange={(open) => {
          setMenuOpen(open);
          if (!open && pendingEditOpen) {
            setEditOpen(true);
            setPendingEditOpen(false);
          }
          if (!open && pendingPermissionsOpen) {
            setPermissionsOpen(true);
            setPendingPermissionsOpen(false);
          }
          if (!open && pendingConvertOpen) {
            setConvertOpen(true);
            setPendingConvertOpen(false);
          }
        }}
      >
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer focus:outline-none">
            <FieldTypeIcon type={field.type} className="h-3.5 w-3.5" />
            {field.name}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuItem onSelect={() => setPendingEditOpen(true)}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit field
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setPendingPermissionsOpen(true)}>
            <Layers className="h-4 w-4 mr-2" />
            Field access and permissions
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setPendingConvertOpen(true)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Convert field to
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled className="text-muted-foreground">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Sort
          </DropdownMenuItem>
          <DropdownMenuItem disabled className="text-muted-foreground">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled className="text-muted-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Add column
          </DropdownMenuItem>
          <DropdownMenuItem disabled className="text-muted-foreground">
            <ArrowLeftRight className="h-4 w-4 mr-2" />
            Move column
          </DropdownMenuItem>
          {onToggleVisibility && (
            <DropdownMenuItem onClick={() => onToggleVisibility(field.id)}>
              <EyeOff className="h-4 w-4 mr-2" />
              Hide column
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setDeleteOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete field
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <MiniFieldBuilder
        onAddField={onAddField}
        onEditField={onEditField}
        onOpenAdvanced={onOpenAdvanced}
        editingField={field}
        triggerVariant="hidden"
        externalOpen={editOpen}
        onExternalOpenChange={setEditOpen}
        disableOutsideClose
      />

      <FieldPermissionsModal
        open={permissionsOpen}
        onOpenChange={setPermissionsOpen}
        field={field}
        disableOutsideClose
      />

      {onDeleteField && (
        <DeleteFieldDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          field={field}
          onDeleteField={onDeleteField}
          usedInOtherPlaces={usedInOtherPlaces}
          databaseName={databaseName}
        />
      )}

      <ConvertFieldModal
        open={convertOpen}
        onOpenChange={setConvertOpen}
        field={field}
        onConvert={(id, newType) => onEditField(id, { type: newType, options: undefined })}
      />
    </div>
  );
}
