"use client";

import { useActionState } from "react";
import { Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/app/admin/dang-nhap/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, { error: undefined });
  return <form action={action} className="grid gap-5"><div className="grid gap-2"><Label htmlFor="email">Email nhân viên</Label><Input id="email" name="email" type="email" autoComplete="username" required /></div><div className="grid gap-2"><Label htmlFor="password">Mật khẩu</Label><Input id="password" name="password" type="password" autoComplete="current-password" minLength={8} required /></div>{state.error ? <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm font-semibold text-destructive">{state.error}</p> : null}<Button type="submit" size="lg" disabled={pending}>{pending ? <Loader2 className="animate-spin" aria-hidden="true" /> : <LogIn aria-hidden="true" />}{pending ? "Đang đăng nhập" : "Đăng nhập"}</Button></form>;
}
