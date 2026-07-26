import { Skeleton } from "@/components/ui/skeleton";

export default function PublicLoading() {
  return <div className="site-container section-space"><Skeleton className="h-12 w-2/3 max-w-xl" /><Skeleton className="mt-4 h-5 w-full max-w-2xl" /><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 8 }).map((_, index) => <div key={index} className="overflow-hidden rounded-xl border bg-card"><Skeleton className="aspect-[4/3] w-full rounded-none" /><div className="space-y-3 p-5"><Skeleton className="h-4 w-1/3" /><Skeleton className="h-6 w-full" /><Skeleton className="h-5 w-1/2" /><Skeleton className="h-10 w-full" /></div></div>)}</div></div>;
}
