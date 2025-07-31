import { Skeleton } from '../skeleton'

export function ProductInformationsSkeleton() {
  return (
    <>
      <div className="flex items-start justify-between w-full gap-5">
        {/* Formulário à esquerda */}
        <div className="w-full max-w-[780px]">
          <div className="flex flex-col gap-4">
            {/* Nome do produto */}
            <div className="flex flex-col gap-4">
              <Skeleton className="h-5 w-32 rounded" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>

            {/* Tipo e Garantia */}
            <div className="flex gap-4">
              <div className="flex flex-col gap-4 w-full">
                <Skeleton className="h-5 w-16 rounded" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
              <div className="flex flex-col gap-4 w-full">
                <Skeleton className="h-5 w-20 rounded" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            </div>

            {/* Idioma e Categoria */}
            <div className="flex gap-4">
              <div className="flex flex-col gap-4 w-full">
                <Skeleton className="h-5 w-16 rounded" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
              <div className="flex flex-col gap-4 w-full">
                <Skeleton className="h-5 w-20 rounded" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            </div>

            {/* Descrição */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-40 rounded" />
              <Skeleton className="h-4 w-12 rounded" />
            </div>
            <Skeleton className="h-24 w-full rounded-lg" />

            {/* Pagamento e Landing Page */}
            <div className="flex gap-4">
              <div className="flex flex-col gap-4 w-full">
                <Skeleton className="h-5 w-20 rounded" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
              <div className="flex flex-col gap-4 w-full">
                <Skeleton className="h-5 w-24 rounded" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Upload de imagem à direita */}
        <div className="w-full rounded-lg py-6 px-5 border border-neutral-200 max-w-[490px]">
          <div>
            <Skeleton className="h-5 w-32 rounded mb-2" />

            {/* Área de upload */}
            <div className="border-2 border-dashed border-zhex-base-500 rounded-xl p-6 flex flex-col items-center justify-center mb-4 min-h-[140px]">
              <Skeleton className="w-6 h-6 rounded mb-2" />
              <Skeleton className="h-4 w-48 rounded mb-1" />
              <Skeleton className="h-3 w-32 rounded" />
            </div>

            {/* Grid de imagens */}
            <div className="flex gap-4 mt-2">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-[100px] h-[100px] border-2 border-dashed border-zhex-base-500 rounded-xl flex items-center justify-center relative bg-neutral-50"
                >
                  <Skeleton className="w-16 h-16 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Seção de informações para suporte */}
      <div className="w-full mt-6">
        <Skeleton className="h-5 w-48 rounded mb-1" />
        <Skeleton className="h-4 w-64 rounded mb-4" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Nome */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-16 rounded" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>

          {/* E-mail */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-20 rounded" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>

          {/* Telefone */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-20 rounded" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </>
  )
}
