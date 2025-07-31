import { Skeleton } from '../skeleton'

export function BankFormSkeleton() {
  return (
    <div className="space-y-6 mt-6">
      <div className="flex flex-col gap-4">
        {/* Select banco */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-16 rounded" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-4 w-48 rounded mt-1" />
        </div>

        {/* Agência e Conta */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-20 rounded" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-12 rounded" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-32 rounded" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>

        {/* Informações adicionais */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-5 h-5 rounded" />
            <Skeleton className="h-4 w-96 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}
