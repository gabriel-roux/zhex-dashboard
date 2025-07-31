import { Skeleton } from '../skeleton'

export function RepresentativesFormSkeleton() {
  return (
    <div className="space-y-6 mt-6">
      {/* Lista de representantes */}
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="border border-neutral-200 rounded-lg bg-white">
          {/* Header do representante */}
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-32 rounded" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-16 rounded" />
              <Skeleton className="h-8 w-20 rounded" />
            </div>
          </div>

          {/* Conteúdo do formulário */}
          <div className="px-6 pb-6">
            {/* Dados pessoais */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Nome */}
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-12 rounded" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>

              {/* Sobrenome */}
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-20 rounded" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>

              {/* Data de Nascimento */}
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-32 rounded" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>

              {/* CPF */}
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-8 rounded" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-16 rounded" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>

              {/* Telefone */}
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-16 rounded" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>

              {/* Endereço completo em uma linha */}
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

              {/* Politicamente exposto */}
              <div className="flex items-center gap-2 col-span-full">
                <Skeleton className="w-5 h-5 rounded" />
                <Skeleton className="h-4 w-80 rounded" />
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Botão adicionar representante */}
      <div className="flex justify-center">
        <Skeleton className="h-8 w-48 rounded" />
      </div>
    </div>
  )
}
