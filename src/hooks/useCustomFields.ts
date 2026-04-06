import { useState, useCallback } from "react";
import { CustomField, FieldType } from "@/types/custom-fields";

const INITIAL_FIELDS: CustomField[] = [
  {
    id: "f1",
    name: "Priority",
    type: "select",
    required: false,
    visible: true,
    options: [
      { id: "o1", label: "P1", color: "hsl(0, 72%, 51%)" },
      { id: "o2", label: "P2", color: "hsl(36, 80%, 50%)" },
      { id: "o3", label: "P3", color: "hsl(150, 50%, 45%)" },
    ],
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "f2",
    name: "Status",
    type: "select",
    required: false,
    visible: true,
    options: [
      { id: "s1", label: "Not Started", color: "hsl(20, 10%, 60%)" },
      { id: "s2", label: "In Progress", color: "hsl(210, 60%, 50%)" },
      { id: "s3", label: "In Review", color: "hsl(36, 80%, 50%)" },
      { id: "s4", label: "Complete", color: "hsl(150, 50%, 45%)" },
    ],
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "f3",
    name: "Air Date",
    type: "date",
    required: false,
    visible: true,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "f4",
    name: "Season",
    type: "number",
    required: false,
    visible: true,
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "f5",
    name: "Writer",
    type: "people",
    required: false,
    visible: true,
    createdAt: new Date("2024-02-10"),
  },
  {
    id: "f6",
    name: "Director",
    type: "people",
    required: false,
    visible: true,
    createdAt: new Date("2024-03-01"),
  },
  {
    id: "f7",
    name: "Tags",
    type: "multi-select",
    required: false,
    visible: true,
    options: [
      { id: "t1", label: "Drama", color: "hsl(280, 60%, 55%)" },
      { id: "t2", label: "Comedy", color: "hsl(36, 80%, 50%)" },
      { id: "t3", label: "Action", color: "hsl(0, 72%, 51%)" },
      { id: "t4", label: "Thriller", color: "hsl(210, 60%, 50%)" },
    ],
    createdAt: new Date("2024-03-05"),
  },
  {
    id: "f8",
    name: "Rating",
    type: "rating",
    required: false,
    visible: false,
    maxRating: 5,
    createdAt: new Date("2024-03-10"),
  },
  {
    id: "f9",
    name: "Budget",
    type: "currency",
    required: false,
    visible: false,
    currencyCode: "USD",
    createdAt: new Date("2024-03-15"),
  },
  {
    id: "f10",
    name: "Tickets",
    type: "relation",
    required: false,
    visible: true,
    relatedEntity: "Episode Tasks",
    createdAt: new Date("2024-03-20"),
  },
];

let nextId = 10;

export function useCustomFields(initialFields?: CustomField[]) {
  const [fields, setFields] = useState<CustomField[]>(initialFields ?? INITIAL_FIELDS);

  const addField = useCallback((name: string, type: FieldType, extras?: Partial<CustomField>) => {
    const newField: CustomField = {
      id: `f${nextId++}`,
      name,
      type,
      required: false,
      visible: true,
      createdAt: new Date(),
      ...extras,
    };
    setFields((prev) => [...prev, newField]);
    return newField;
  }, []);

  const updateField = useCallback((id: string, updates: Partial<CustomField>) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  }, []);

  const deleteField = useCallback((id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const toggleVisibility = useCallback((id: string) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, visible: !f.visible } : f)));
  }, []);

  return { fields, addField, updateField, deleteField, toggleVisibility };
}
