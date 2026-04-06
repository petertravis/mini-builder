import { Eye, EyeOff, Columns3 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CustomField } from "@/types/custom-fields";
import { FieldTypeIcon } from "./FieldTypeIcon";

interface ColumnVisibilityMenuProps {
  fields: CustomField[];
  onToggle: (id: string) => void;
}

export function ColumnVisibilityMenu({ fields, onToggle }: ColumnVisibilityMenuProps) {
  const visibleCount = fields.filter((f) => f.visible).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 text-muted-foreground">
          <Columns3 className="h-4 w-4" />
          <span>Columns</span>
          <span className="text-xs bg-accent rounded-full px-1.5 py-0.5 ml-0.5">
            {visibleCount}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="end">
        <div className="p-2 border-b border-border">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Column visibility
          </span>
        </div>
        <div className="max-h-64 overflow-y-auto p-1">
          {fields.map((field) => (
            <button
              key={field.id}
              onClick={() => onToggle(field.id)}
              className="flex items-center justify-between w-full px-2 py-1.5 rounded-md hover:bg-accent transition-colors group"
            >
              <div className="flex items-center gap-2">
                <FieldTypeIcon type={field.type} className="h-3.5 w-3.5" />
                <span className="text-sm text-foreground">{field.name}</span>
              </div>
              {field.visible ? (
                <Eye className="h-3.5 w-3.5 text-muted-foreground" />
              ) : (
                <EyeOff className="h-3.5 w-3.5 text-muted-foreground opacity-40" />
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
