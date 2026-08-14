"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function SetPasswordForm() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setReady(Boolean(data.session)));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setReady(Boolean(session)));
    return () => data.subscription.unsubscribe();
  }, [supabase]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (password.length < 8) return setMessage("Mật khẩu cần có ít nhất 8 ký tự.");
    if (password !== confirmation) return setMessage("Hai mật khẩu chưa khớp.");
    startTransition(async () => {
      setMessage("");
      const { error } = await supabase.auth.updateUser({ password });
      if (error) return setMessage(error.message);
      router.replace("/admin");
      router.refresh();
    });
  }

  return (
    <form onSubmit={submit} className="grid gap-5">
      {!ready ? <p role="alert" className="admin-login-notice">Đang xác minh link hoặc link đã hết hạn. Nếu thông báo này không mất đi, hãy yêu cầu admin gửi lại email.</p> : null}
      <div className="grid gap-2"><Label htmlFor="new-password">Mật khẩu mới</Label><Input id="new-password" type="password" autoComplete="new-password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} disabled={!ready || pending} required /></div>
      <div className="grid gap-2"><Label htmlFor="confirm-password">Nhập lại mật khẩu</Label><Input id="confirm-password" type="password" autoComplete="new-password" minLength={8} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} disabled={!ready || pending} required /></div>
      {message ? <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm font-semibold text-destructive">{message}</p> : null}
      <Button type="submit" size="lg" disabled={!ready || pending}>{pending ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Check aria-hidden="true" />}{pending ? "Đang cập nhật" : "Lưu mật khẩu"}</Button>
    </form>
  );
}
