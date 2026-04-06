import { useState, useRef } from "react";
import { Users, ChevronDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FieldTypeIcon } from "./FieldTypeIcon";
import { CustomField } from "@/types/custom-fields";

interface FieldPermissionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  field: CustomField;
  children?: React.ReactNode;
  disableOutsideClose?: boolean;
}

export function FieldPermissionsModal({ open, onOpenChange, field, children, disableOutsideClose = false }: FieldPermissionsModalProps) {
  const openTimestamp = useRef(0);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("editor");
  const [addToLibrary, setAddToLibrary] = useState(false);
  const [notifyOnChange, setNotifyOnChange] = useState(false);
  const [accessLevel, setAccessLevel] = useState("database-members");

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) {
      openTimestamp.current = Date.now();
    }
    onOpenChange(isOpen);
  };

  const handleOutsideInteraction = (e: Event) => {
    if (disableOutsideClose || Date.now() - openTimestamp.current < 300) {
      e.preventDefault();
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      {children ? (
        <PopoverTrigger asChild>{children}</PopoverTrigger>
      ) : (
        <PopoverTrigger asChild>
          <span aria-hidden className="absolute inset-0 pointer-events-none" />
        </PopoverTrigger>
      )}
      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={4}
        className="w-[360px] p-0 shadow-lg border border-border rounded-lg"
        onPointerDownOutside={handleOutsideInteraction}
        onInteractOutside={handleOutsideInteraction}
        onFocusOutside={handleOutsideInteraction}
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <FieldTypeIcon type={field.type} className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground flex-1">{field.name} permissions</span>
          <button onClick={() => onOpenChange(false)} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[400px] overflow-y-auto p-4 space-y-4">
          {/* Settings */}
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground font-medium">Settings</span>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <Checkbox
                checked={addToLibrary}
                onCheckedChange={(v) => setAddToLibrary(!!v)}
                className="mt-0.5"
              />
              <span className="text-sm text-foreground leading-snug">Add to workspace field library</span>
            </label>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <Checkbox
                checked={notifyOnChange}
                onCheckedChange={(v) => setNotifyOnChange(!!v)}
                className="mt-0.5"
              />
              <span className="text-sm text-foreground leading-snug">Notify collaborators when this field's value is changed</span>
            </label>
          </div>

          <Separator />

          {/* Access */}
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground font-medium">Access</span>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs text-muted-foreground">Invite with email</span>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center border border-border rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-ring">
                <Input
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Add members by name or email"
                  className="border-0 focus-visible:ring-0 h-8 text-sm"
                />
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger className="border-0 w-auto gap-1 h-8 text-xs text-muted-foreground focus:ring-0 shrink-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" size="sm" className="h-8 text-xs" disabled={!inviteEmail.trim()}>
                Invite
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs text-muted-foreground">Access settings</span>
            <Select value={accessLevel} onValueChange={setAccessLevel}>
              <SelectTrigger className="h-8 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="database-members">Database members</SelectItem>
                <SelectItem value="workspace-members">Workspace members</SelectItem>
                <SelectItem value="specific-people">Specific people only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <span className="text-xs text-muted-foreground">Field members</span>
            <div className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <span className="text-sm text-foreground">Admins and Editors</span>
              </div>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                Field admin <ChevronDown className="h-3 w-3" />
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-sm font-medium text-foreground">
                  D
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-foreground">Dave Chen</span>
                  <span className="text-xs text-muted-foreground">davechen@alpha.com</span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                Editor <ChevronDown className="h-3 w-3" />
              </span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
