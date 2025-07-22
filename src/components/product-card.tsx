import ProductCoverImg from '@/assets/images/product-cover.png'
import Image from 'next/image'

export function ProductCard() {
  return (
    <div className="relative w-[300px] h-[360px] rounded-lg border border-neutral-200 overflow-hidden">
      {/* Blur background with fade-out gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={ProductCoverImg}
          alt="Product Cover"
          fill
          className="object-cover filter blur-lg scale-110 opacity-40"
        />
        {/* fade overlay to mask blur gradually */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
      </div>
      <div className="relative z-10 flex flex-col h-full p-5">
        <div className="w-full h-[135px] rounded-lg overflow-hidden mb-4 flex justify-center">
          <Image
            src={ProductCoverImg}
            alt="Product Cover"
            className="w-[90px] h-[135px]"
          />
        </div>

        <div className="flex flex-col gap-3 mt-6">
          <span className="py-1 px-3 rounded-lg bg-neutral-200/50 text-neutral-500 font-semibold text-sm flex items-center gap-2 w-fit">
            <div className="w-1.5 h-1.5 rounded bg-neutral-500" />
            Inativo
          </span>

          <h3 className="text-neutral-1000 font-medium font-araboto leading-snug text-base">
            Curso de Programação Avançada: JavaScript
          </h3>

          <div className="w-full h-[1px] bg-neutral-200" />

          <div className="flex items-center justify-between text-sm text-neutral-500">
            <div className="flex flex-col gap-1">
              <span className="text-sm">Preço</span>
              <span className="font-medium text-sm font-araboto text-neutral-1000">
                R$ 199,90
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm">Vendas</span>
              <span className="font-medium text-sm font-araboto text-neutral-1000">
                45
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm">Tipo</span>
              <span className="font-medium text-sm font-araboto text-neutral-1000">
                Físico
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
