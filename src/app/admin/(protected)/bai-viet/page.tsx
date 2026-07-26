import { Pencil, Trash2 } from "lucide-react";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { createPostAction, deletePostAction } from "@/app/admin/(protected)/resource-actions";
import { getAdminPosts } from "@/lib/admin/queries";
import type { Database } from "@/types/database";

type PostRow = Database["public"]["Tables"]["posts"]["Row"];

export default async function AdminPostsPage() {
  const posts = await getAdminPosts();
  return (
    <div>
      <h1 className="text-3xl font-extrabold">Bài viết</h1>
      <p className="mt-2 text-muted-foreground">Nội dung chuyên môn phải được xác minh trước khi chuyển sang trạng thái xuất bản.</p>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_420px]">
        <div className="overflow-hidden rounded-xl border bg-card">
          <Table><TableHeader><TableRow><TableHead>Tiêu đề</TableHead><TableHead>Cập nhật</TableHead><TableHead>Trạng thái</TableHead><TableHead className="text-right">Thao tác</TableHead></TableRow></TableHeader><TableBody>
            {posts.length ? posts.map((post) => <TableRow key={post.id}><TableCell><p className="font-bold">{post.title}</p><p className="text-xs text-muted-foreground">{post.slug}</p></TableCell><TableCell>{new Intl.DateTimeFormat("vi-VN").format(new Date(post.updated_at))}</TableCell><TableCell>{post.status === "published" ? "Đã xuất bản" : "Bản nháp"}</TableCell><TableCell className="text-right"><details className="relative inline-block text-left"><summary className="list-none"><Button type="button" variant="outline" size="sm"><Pencil aria-hidden="true" /> Sửa</Button></summary><div className="absolute right-0 z-10 mt-2 max-h-[75vh] w-[min(90vw,520px)] overflow-y-auto rounded-xl border bg-popover p-4 text-popover-foreground shadow-lg"><form action={createPostAction} className="grid gap-4"><input type="hidden" name="id" value={post.id} /><PostFields post={post} prefix={`post-${post.id}`} /><Button type="submit">Lưu thay đổi</Button></form><form action={deletePostAction} className="mt-2"><input type="hidden" name="id" value={post.id} /><ConfirmSubmitButton type="submit" variant="destructive" className="w-full" confirmation={`Xóa bài viết "${post.title}"?`}><Trash2 aria-hidden="true" /> Xóa bài viết</ConfirmSubmitButton></form></div></details></TableCell></TableRow>) : <TableRow><TableCell colSpan={4} className="h-32 text-center text-muted-foreground">Chưa có bài viết.</TableCell></TableRow>}
          </TableBody></Table>
        </div>
        <Card className="h-fit"><CardHeader><CardTitle>Tạo bài viết</CardTitle><CardDescription>Markdown được render và làm sạch ở phía server.</CardDescription></CardHeader><CardContent><form action={createPostAction} className="grid gap-4"><PostFields prefix="new-post" /><Button type="submit">Lưu bài viết</Button></form></CardContent></Card>
      </div>
    </div>
  );
}

function PostFields({ post, prefix }: { post?: PostRow; prefix: string }) {
  return <><Field id={`${prefix}-title`} label="Tiêu đề"><Input id={`${prefix}-title`} name="title" defaultValue={post?.title} required /></Field><Field id={`${prefix}-slug`} label="Slug"><Input id={`${prefix}-slug`} name="slug" defaultValue={post?.slug} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" /></Field><Field id={`${prefix}-excerpt`} label="Tóm tắt"><Textarea id={`${prefix}-excerpt`} name="excerpt" defaultValue={post?.excerpt ?? ""} rows={3} required /></Field><Field id={`${prefix}-content`} label="Nội dung Markdown"><Textarea id={`${prefix}-content`} name="content_markdown" defaultValue={post?.content_markdown ?? ""} rows={10} required /></Field><Field id={`${prefix}-cover`} label="Đường dẫn ảnh bìa"><Input id={`${prefix}-cover`} name="cover_path" defaultValue={post?.cover_path ?? ""} /></Field><Field id={`${prefix}-cover-alt`} label="Alt text ảnh bìa"><Input id={`${prefix}-cover-alt`} name="cover_alt" defaultValue={post?.cover_alt ?? ""} /></Field><Field id={`${prefix}-seo-title`} label="SEO title"><Input id={`${prefix}-seo-title`} name="seo_title" defaultValue={post?.seo_title ?? ""} /></Field><Field id={`${prefix}-seo-description`} label="SEO description"><Textarea id={`${prefix}-seo-description`} name="seo_description" defaultValue={post?.seo_description ?? ""} rows={2} /></Field><Field id={`${prefix}-status`} label="Trạng thái"><select id={`${prefix}-status`} name="status" defaultValue={post?.status ?? "draft"} className="h-10 rounded-md border bg-background px-3 text-sm"><option value="draft">Bản nháp</option><option value="published">Xuất bản</option></select></Field></>;
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) { return <div className="grid gap-2"><Label htmlFor={id}>{label}</Label>{children}</div>; }
