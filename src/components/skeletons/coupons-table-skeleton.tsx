import { Skeleton } from '../skeleton'

export function CouponsTableSkeleton() {
  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-neutral-200">
            <tr className="text-neutral-1000">
              <th className="py-3 px-6 font-medium font-araboto">Nome</th>
              <th className="py-3 px-6 font-medium font-araboto">Código</th>
              <th className="py-3 px-6 font-medium font-araboto">Desconto</th>
              <th className="py-3 px-6 font-medium font-araboto">Status</th>
              <th className="py-3 px-6 font-medium font-araboto">Validade</th>
              <th className="py-3 px-6 font-medium font-araboto">Limite de uso</th>
              <th className="py-3 px-6 font-medium font-araboto">Ações</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, idx) => (
              <tr key={idx} className="border-b last:border-b-0">
                <td className="py-4 px-6">
                  <Skeleton className="h-5 w-32 rounded" />
                </td>
                <td className="py-4 px-6">
                  <Skeleton className="h-4 w-20 rounded" />
                </td>
                <td className="py-4 px-6">
                  <Skeleton className="h-5 w-16 rounded" />
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-10 h-6 rounded-full" />
                    <Skeleton className="h-4 w-12 rounded" />
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-4 h-4 rounded" />
                    <Skeleton className="h-4 w-20 rounded" />
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-4 h-4 rounded" />
                    <Skeleton className="h-4 w-8 rounded" />
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-8 h-8 rounded-lg" />
                    <Skeleton className="w-8 h-8 rounded-lg" />
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
