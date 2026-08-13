import { Skeleton } from "@/components/ui/skeleton";

export default function PublicLoading() {
  return <div className="paper-page"><div className="site-container section-space"><Skeleton className="h-12 w-2/3 max-w-xl rounded-[18px_10px_18px_10px]" /><Skeleton className="mt-4 h-5 w-full max-w-2xl rounded-full" /><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 8 }).map((_, index) => <div key={index} className="paper-product-card overflow-hidden"><Skeleton className="aspect-[4/3] w-full rounded-none" /><div className="space-y-3 p-5"><Skeleton className="h-4 w-1/3 rounded-full" /><Skeleton className="h-6 w-full rounded-full" /><Skeleton className="h-5 w-1/2 rounded-full" /><Skeleton className="h-10 w-full rounded-full" /></div></div>)}</div></div></div>;
}
