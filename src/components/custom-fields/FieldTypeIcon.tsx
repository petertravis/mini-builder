import {
  Type, Hash, Calendar, ChevronDown, CheckSquare,
  Tags, DollarSign, FunctionSquare, Link, Paperclip,
  Star, Users,
} from "lucide-react";
import { FieldType } from "@/types/custom-fields";
import { cn } from "@/lib/utils";

const iconMap: Record<FieldType, React.ElementType> = {
  text: Type,
  number: Hash,
  date: Calendar,
  select: ChevronDown,
  checkbox: CheckSquare,
  "multi-select": Tags,
  currency: DollarSign,
  formula: FunctionSquare,
  relation: Link,
  file: Paperclip,
  rating: Star,
  people: Users,
};

const colorMap: Record<FieldType, string> = {
  text: "text-field-text",
  number: "text-field-number",
  date: "text-field-date",
  select: "text-field-select",
  checkbox: "text-field-checkbox",
  "multi-select": "text-field-multi-select",
  currency: "text-field-currency",
  formula: "text-field-formula",
  relation: "text-field-relation",
  file: "text-field-file",
  rating: "text-field-rating",
  people: "text-field-people",
};

interface FieldTypeIconProps {
  type: FieldType;
  className?: string;
}

export function FieldTypeIcon({ type, className }: FieldTypeIconProps) {
  const Icon = iconMap[type];
  return <Icon className={cn("h-4 w-4", colorMap[type], className)} />;
}
