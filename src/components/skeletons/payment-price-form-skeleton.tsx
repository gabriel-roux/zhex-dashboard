import { Skeleton } from '../skeleton'

export function PaymentPriceFormSkeleton() {
  return (
    <div className="w-[445px] flex flex-col gap-4">
      {/* Preço do produto */}
      <div>
        <Skeleton className="h-5 w-32 rounded mb-1" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>

      {/* Moeda base */}
      <div>
        <Skeleton className="h-5 w-24 rounded mb-1" />
        <Skeleton className="h-4 w-64 rounded mb-1" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>

      {/* Moedas habilitadas */}
      <div>
        <Skeleton className="h-5 w-36 rounded mb-1" />
        <Skeleton className="h-4 w-80 rounded mb-1" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>

      {/* Descrição de pagamento */}
      <div>
        <Skeleton className="h-5 w-40 rounded mb-1" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </div>
  )
}
