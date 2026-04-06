export type FieldType =
  | "text"
  | "number"
  | "date"
  | "select"
  | "checkbox"
  | "multi-select"
  | "currency"
  | "formula"
  | "relation"
  | "file"
  | "rating"
  | "people";

export interface SelectOption {
  id: string;
  label: string;
  color?: string;
}

export interface CustomField {
  id: string;
  name: string;
  type: FieldType;
  description?: string;
  required: boolean;
  visible: boolean;
  options?: SelectOption[]; // for select / multi-select
  formula?: string; // for formula type
  relatedEntity?: string; // for relation type
  currencyCode?: string; // for currency
  maxRating?: number; // for rating
  createdAt: Date;
}

export const FIELD_TYPE_META: Record<FieldType, { label: string; icon: string }> = {
  text: { label: "Text", icon: "Type" },
  number: { label: "Number", icon: "Hash" },
  date: { label: "Date", icon: "Calendar" },
  select: { label: "Single Select", icon: "ChevronDown" },
  checkbox: { label: "Checkbox", icon: "CheckSquare" },
  "multi-select": { label: "Multi Select", icon: "Tags" },
  currency: { label: "Currency", icon: "DollarSign" },
  formula: { label: "Formula", icon: "Function" },
  relation: { label: "Relation", icon: "Link" },
  file: { label: "File", icon: "Paperclip" },
  rating: { label: "Rating", icon: "Star" },
  people: { label: "People", icon: "Users" },
};

export const ALL_FIELD_TYPES: FieldType[] = [
  "text", "number", "date", "select", "checkbox",
  "multi-select", "currency", "formula", "relation",
  "file", "rating", "people",
];
