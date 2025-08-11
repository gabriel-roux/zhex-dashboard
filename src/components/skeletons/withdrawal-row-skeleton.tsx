import { Skeleton } from '../skeleton'

export function WithdrawalRowSkeleton() {
  return (
    <tr className="border-b border-neutral-100">
      <td className="py-4 px-6">
        <Skeleton className="w-4 h-4 rounded" />
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="w-20 h-4 rounded" />
        </div>
      </td>
      <td className="py-4 px-6">
        <Skeleton className="w-24 h-4 rounded" />
      </td>
      <td className="py-4 px-6">
        <Skeleton className="w-32 h-4 rounded" />
      </td>
      <td className="py-4 px-6">
        <Skeleton className="w-24 h-6 rounded-full" />
      </td>
      <td className="py-4 px-6">
        <Skeleton className="w-20 h-4 rounded" />
      </td>
    </tr>
  )
}
