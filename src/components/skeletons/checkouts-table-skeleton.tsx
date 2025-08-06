export function CheckoutsTableSkeleton() {
  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-neutral-200">
            <tr className="text-neutral-1000">
              <th className="py-3 px-6 font-medium font-araboto">Nome</th>
              <th className="py-3 px-6 font-medium font-araboto text-center">Links de pagamento</th>
              <th className="py-3 px-6 font-medium font-araboto">Criado em</th>
              <th className="py-3 px-6 font-medium font-araboto text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 3 }).map((_, index) => (
              <tr key={index} className="border-b last:border-b-0">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-neutral-200 rounded animate-pulse" />
                    <div className="w-32 h-4 bg-neutral-200 rounded animate-pulse" />
                  </div>
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="w-16 h-4 bg-neutral-200 rounded animate-pulse mx-auto" />
                </td>
                <td className="py-4 px-6">
                  <div className="w-20 h-4 bg-neutral-200 rounded animate-pulse" />
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-8 h-8 bg-neutral-200 rounded-lg animate-pulse" />
                    <div className="w-8 h-8 bg-neutral-200 rounded-lg animate-pulse" />
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
