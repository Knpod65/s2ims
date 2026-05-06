import { Skeleton } from '@/components/ui/index'

export default function Loading() {
  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-7 w-52" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-36" />
      </div>
      <div className="card overflow-hidden">
        <div className="border-b border-white/[0.08] p-3 flex gap-4">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-4 flex-1" />)}
        </div>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="border-b border-white/[0.04] p-3 flex gap-4">
            {[...Array(5)].map((_, j) => <Skeleton key={j} className="h-3 flex-1" />)}
          </div>
        ))}
      </div>
    </div>
  )
}
