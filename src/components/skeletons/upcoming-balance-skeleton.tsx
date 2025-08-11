import { Skeleton } from '../skeleton'

export function UpcomingBalanceSkeleton() {
  return (
    <div className="flex-1 max-w-[760px] w-full">

      {/* Coluna esquerda - Recebíveis */}
      <div className="flex-1 max-w-[760px] w-full">
        <div className="space-y-4">
          {/* Rows skeleton */}
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between py-2 pb-3 border-b border-neutral-200/50 last:border-b-0">
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <span className="text-neutral-600">
                  Para o dia <Skeleton className="w-20 h-4 rounded inline-block" />
                </span>
              </div>
              <div className="text-right">
                <Skeleton className="w-24 h-5 rounded mb-1" />
                <Skeleton className="w-16 h-3 rounded" />
              </div>
            </div>
          ))}

          {/* Total */}
          <div className="mt-6 pt-4 border-t border-neutral-200">
            <div className="flex items-center justify-between">
              <Skeleton className="w-48 h-5 rounded" />
              <Skeleton className="w-32 h-6 rounded" />
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
