import { Skeleton } from '../skeleton'

export function ProductCardSkeleton() {
  return (
    <div className="relative w-[300px] h-[360px] rounded-lg border border-neutral-200 overflow-hidden">
      {/* Blur background skeleton */}
      <div className="absolute inset-0">
        <Skeleton className="w-full h-full" />
        {/* fade overlay to mask blur gradually */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-col h-full p-5">
        {/* Imagem principal */}
        <div className="w-full h-[150px] rounded-lg overflow-hidden mb-4 flex justify-center">
          <Skeleton className="w-[360px] h-[150px] rounded-lg" />
        </div>

        <div className="flex flex-col gap-3 mt-6">
          {/* Status badge */}
          <Skeleton className="py-1 px-3 rounded-lg w-16 h-6" />

          {/* Título */}
          <Skeleton className="h-5 rounded w-3/4" />

          {/* Linha divisória */}
          <div className="w-full h-[1px] bg-neutral-200" />

          {/* Informações do produto */}
          <div className="flex items-center justify-between text-sm text-neutral-500">
            <div className="flex flex-col gap-1">
              <span className="text-sm">Categoria</span>
              <Skeleton className="h-4 rounded w-12" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm">Moeda</span>
              <Skeleton className="h-4 rounded w-8" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm">Tipo</span>
              <Skeleton className="h-4 rounded w-10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
