"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  initialAdminActionState,
  type AdminActionState,
} from "@/lib/admin/action-state";
import { cn } from "@/lib/utils";

export type AdminFormAction = (
  previousState: AdminActionState,
  formData: FormData,
) => Promise<AdminActionState>;

export function AdminActionForm({
  action,
  className,
  children,
}: {
  action: AdminFormAction;
  className?: string;
  children: React.ReactNode;
}) {
  const [state, formAction] = useActionState(action, initialAdminActionState);

  return (
    <form action={formAction} className={className}>
      {children}
      {state.status !== "idle" ? (
        <p
          role={state.status === "error" ? "alert" : "status"}
          className={cn(
            "rounded-lg p-3 text-sm font-semibold",
            state.status === "error" ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success",
          )}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

export function AdminSubmitButton({
  children,
  pendingLabel = "Đang lưu...",
  ...props
}: React.ComponentProps<typeof Button> & { pendingLabel?: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" {...props} disabled={pending || props.disabled}>
      {pending ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
      {pending ? pendingLabel : children}
    </Button>
  );
}
