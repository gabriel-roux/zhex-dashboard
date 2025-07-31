import { Skeleton } from '../skeleton'

export function CompanyFormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between w-full gap-5">
        {/* Formulário à esquerda */}
        <div className="w-full max-w-[780px]">
          <div className="flex flex-col gap-6">
            {/* Grid de campos */}
            <div className="flex flex-col gap-4">
              {/* Primeira linha - Nome/Razão Social */}
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-32 rounded" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>

              {/* CPF/CNPJ */}
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-16 rounded" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>

              {/* Nome Fantasia */}
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-28 rounded" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>

              {/* Telefone e Nicho de Atuação */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-5 w-20 rounded" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                </div>
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-5 w-32 rounded" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                </div>
              </div>

              {/* Website */}
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-20 rounded" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Upload de logo à direita */}
        <div className="w-full rounded-lg py-6 px-5 border border-neutral-200 max-w-[490px]">
          <div>
            <Skeleton className="h-5 w-32 rounded mb-4" />

            <div className="border-2 border-dashed border-zhex-base-500 rounded-xl p-6 flex flex-col items-center justify-center mb-4 min-h-[200px]">
              <Skeleton className="w-6 h-6 rounded mb-2" />
              <Skeleton className="h-4 w-48 rounded mb-2" />
              <Skeleton className="h-3 w-32 rounded" />
            </div>

            <div className="text-center">
              <Skeleton className="h-4 w-24 rounded mx-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* Seção de endereço */}
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex flex-col">
          <Skeleton className="h-5 w-48 rounded mb-1" />
          <Skeleton className="h-4 w-64 rounded" />
        </div>

        {/* Endereço */}
        <div className="grid grid-cols-6 gap-4 col-span-full">
          {/* CEP */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-8 rounded" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>

          {/* Endereço */}
          <div className="flex flex-col gap-2 col-span-2">
            <Skeleton className="h-5 w-20 rounded" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>

          {/* Número */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-16 rounded" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>

          {/* UF */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-6 rounded" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>

          {/* Cidade */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-16 rounded" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
