import { useState, useRef, useEffect } from "react";
import { AlertTriangle, ArrowRight, X } from "lucide-react";
import { CustomField, FieldType, ALL_FIELD_TYPES, FIELD_TYPE_META } from "@/types/custom-fields";
import { FieldTypeIcon } from "./FieldTypeIcon";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ConvertFieldModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  field: CustomField;
  onConvert: (id: string, newType: FieldType) => void;
}

// Types that are "safe" conversions (minimal data loss risk)
const SAFE_CONVERSIONS: Partial<Record<FieldType, FieldType[]>> = {
  text: ["number", "date", "select", "multi-select"],
  number: ["text", "currency", "rating"],
  currency: ["number", "text"],
  select: ["multi-select", "text"],
  "multi-select": ["select", "text"],
  date: ["text"],
  rating: ["number", "text"],
  people: ["text"],
  formula: ["text", "number"],
  relation: [],
  checkbox: ["text"],
  file: [],
};

function isSafe(from: FieldType, to: FieldType): boolean {
  return SAFE_CONVERSIONS[from]?.includes(to) ?? false;
}

export function ConvertFieldModal({
  open,
  onOpenChange,
  field,
  onConvert,
}: ConvertFieldModalProps) {
  const [selectedType, setSelectedType] = useState<FieldType | null>(null);
  const openTimestamp = useRef(0);

  useEffect(() => {
    if (open) openTimestamp.current = Date.now();
  }, [open]);

  const otherTypes = ALL_FIELD_TYPES.filter((t) => t !== field.type);

  const handleConfirm = () => {
    if (!selectedType) return;
    onConvert(field.id, selectedType);
    setSelectedType(null);
    onOpenChange(false);
  };

  const handleClose = () => {
    setSelectedType(null);
    onOpenChange(false);
  };

  const handleOutsideInteraction = (e: Event) => {
    // Ignore outside clicks for 300ms after opening to prevent
    // the dropdown-close click from immediately dismissing the popover
    if (Date.now() - openTimestamp.current < 300) {
      e.preventDefault();
    } else {
      handleClose();
    }
  };

  return (
    <Popover open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <PopoverTrigger asChild>
        <span className="absolute inset-0 pointer-events-none" aria-hidden />
      </PopoverTrigger>
      <PopoverContent
        className="w-72 p-0"
        align="start"
        onPointerDownOutside={handleOutsideInteraction}
        onInteractOutside={handleOutsideInteraction}
        onEscapeKeyDown={handleClose}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-3 pt-3 pb-2">
          <div>
            <p className="text-sm font-semibold text-gray-900">Convert field type</p>
            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
              <FieldTypeIcon type={field.type} className="h-3 w-3" />
              {FIELD_TYPE_META[field.type].label}
              <ArrowRight className="h-2.5 w-2.5" />
              {selectedType ? (
                <span className="text-gray-600 font-medium flex items-center gap-1">
                  <FieldTypeIcon type={selectedType} className="h-3 w-3" />
                  {FIELD_TYPE_META[selectedType].label}
                </span>
              ) : (
                <span className="italic">select new type</span>
              )}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-0.5 rounded"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <Separator />

        {/* Type list */}
        <div className="p-2 space-y-0.5 max-h-64 overflow-y-auto">
          {otherTypes.map((type) => {
            const safe = isSafe(field.type, type);
            const isSelected = selectedType === type;
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-left transition-colors ${
                  isSelected
                    ? "bg-blue-50 text-gray-900"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <FieldTypeIcon type={type} className="h-3.5 w-3.5 shrink-0" />
                <span className="text-xs font-medium flex-1">{FIELD_TYPE_META[type].label}</span>
                {!safe && (
                  <AlertTriangle className="h-3 w-3 text-amber-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Warning */}
        {selectedType && !isSafe(field.type, selectedType) && (
          <>
            <Separator />
            <div className="mx-2 my-2 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-md px-2.5 py-2">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-800">
                This may affect existing values. This can't be undone.
              </p>
            </div>
          </>
        )}

        <Separator />

        {/* Footer */}
        <div className="p-2 flex justify-end gap-2">
          <Button variant="outline" size="sm" className="h-7 text-xs border-gray-200" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="h-7 text-xs bg-blue-600 hover:bg-blue-700"
            onClick={handleConfirm}
            disabled={!selectedType}
          >
            Convert
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
