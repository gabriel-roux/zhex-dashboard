import { Skeleton } from '../skeleton'

export function LoginHistorySkeleton() {
  return (
    <>

      {/* Content Area - Table */}
      <div className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-neutral-200">
              <tr className="text-neutral-1000">
                <th className="py-3 px-6 font-medium font-araboto">Dispositivo</th>
                <th className="py-3 px-6 font-medium font-araboto">Localização</th>
                <th className="py-3 px-6 font-medium font-araboto">IP</th>
                <th className="py-3 px-6 font-medium font-araboto">Status</th>
                <th className="py-3 px-6 font-medium font-araboto">Última Atividade</th>
                <th className="py-3 px-6 font-medium font-araboto">Ações</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 3 }).map((_, index) => (
                <tr key={index} className="border-b last:border-b-0">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-5 h-5 rounded" />
                      <div className="flex flex-col gap-1">
                        <Skeleton className="h-4 w-32 rounded" />
                        <Skeleton className="h-3 w-48 rounded" />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-4 h-4 rounded" />
                      <Skeleton className="h-4 w-24 rounded" />
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Skeleton className="h-4 w-20 rounded" />
                  </td>
                  <td className="py-4 px-6">
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </td>
                  <td className="py-4 px-6">
                    <Skeleton className="h-4 w-32 rounded" />
                  </td>
                  <td className="py-4 px-6">
                    <Skeleton className="w-8 h-8 rounded-lg" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
