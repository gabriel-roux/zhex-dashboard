import { Skeleton } from '@/components/skeleton'

export function TransactionsRowSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-neutral-100">
          {/* ID */}
          <td className="py-3 px-4">
            <Skeleton className="h-4 w-16 rounded" />
          </td>

          {/* Produtos */}
          <td className="py-3 px-4">
            <Skeleton className="h-4 w-48 rounded" />
          </td>

          {/* Nome e E-mail */}
          <td className="py-3 px-4">
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-40 rounded" />
              <Skeleton className="h-3 w-52 rounded" />
            </div>
          </td>

          {/* Status (badge) */}
          <td className="py-3 px-4">
            <Skeleton className="h-6 w-24 rounded-full" />
          </td>

          {/* Valor */}
          <td className="py-3 px-4">
            <Skeleton className="h-4 w-20 rounded" />
          </td>

          {/* Pagamento */}
          <td className="py-3 px-4">
            <Skeleton className="h-4 w-28 rounded" />
          </td>

          {/* Data (direita) */}
          <td className="py-3 px-4">
            <div className="flex justify-end">
              <Skeleton className="h-4 w-24 rounded" />
            </div>
          </td>
        </tr>
      ))}
    </>
  )
}
