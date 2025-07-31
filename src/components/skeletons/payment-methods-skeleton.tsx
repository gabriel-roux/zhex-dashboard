import { Skeleton } from '../skeleton'

export function PaymentMethodsTableSkeleton() {
  return (
    <div className="flex-1 my-3">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-neutral-400 text-sm">
              <th className="py-3 font-normal">Forma de pagamento</th>
              <th className="py-3 font-normal">Tipo</th>
              <th className="py-3 font-normal">Região</th>
              <th className="py-3 font-normal" />
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, idx) => (
              <tr key={idx} className="border-b last:border-b-0">
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <Skeleton className="h-5 w-32 rounded" />
                  </div>
                </td>
                <td className="py-3">
                  <Skeleton className="h-4 w-24 rounded" />
                </td>
                <td className="py-3">
                  <Skeleton className="h-4 w-28 rounded" />
                </td>
                <td className="py-3">
                  <div className="flex justify-end">
                    <Skeleton className="h-8 w-16 rounded" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
