import { Skeleton } from '../skeleton'

export function PixelsTableSkeleton() {
  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-neutral-200">
            <tr className="text-neutral-1000">
              <th className="py-3 px-6 font-medium font-araboto">Nome</th>
              <th className="py-3 px-6 font-medium font-araboto">Pixel ID</th>
              <th className="py-3 px-6 font-medium font-araboto">Status</th>
              <th className="py-3 px-6 font-medium font-araboto">Tipo</th>
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
                  <Skeleton className="h-4 w-24 rounded" />
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-10 h-6 rounded-full" />
                    <Skeleton className="h-4 w-12 rounded" />
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-5 h-5 rounded" />
                    <Skeleton className="h-4 w-20 rounded" />
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
