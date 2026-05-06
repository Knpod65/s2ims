import { Skeleton, SkeletonCard } from '@/components/ui/index'

export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-5 py-8 space-y-6">
      <Skeleton className="h-8 w-56" />
      <div className="flex gap-3">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-36" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    </div>
  )
}
