import { Skeleton } from "@/components/ui/skeleton";
export default function AdminLoading() { return <div><Skeleton className="h-10 w-64" /><Skeleton className="mt-3 h-5 w-96 max-w-full" /><div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-32 rounded-xl" />)}</div></div>; }
