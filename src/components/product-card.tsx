import Image from 'next/image'

interface ProductImage {
  id: string
  fileUrl: string
  fileName: string
}

interface Product {
  id: string
  name: string
  description: string
  type: string
  category: string
  status: string
  currency: string
  defaultImage: ProductImage | null
  createdAt: string
  updatedAt: string
}

interface ProductCardProps {
  product?: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product?.defaultImage?.fileUrl
  const status = product?.status || 'Inativo'
  const name = product?.name || 'Produto sem nome'
  const type = product?.type === 'RECURRING'
    ? 'Digital'
    : 'Físico'
  const isActive = status === 'ACTIVE'

  return (
    <div className="relative w-[300px] h-[360px] rounded-lg border border-neutral-200 overflow-hidden">
      {/* Blur background with fade-out gradient */}
      <div className="absolute inset-0">
        <Image
          src={imageUrl!}
          width={300}
          height={360}
          alt="Product Cover"
          className="object-cover filter blur-lg scale-110 opacity-40"
        />
        {/* fade overlay to mask blur gradually */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
      </div>
      <div className="relative z-10 flex flex-col h-full p-5">
        <div className="w-full h-[150px] rounded-lg overflow-hidden mb-4 flex justify-center">
          <Image
            src={imageUrl!}
            alt="Product Cover"
            width={360}
            height={150}
            className="w-[360px] h-[150px] rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-3 mt-6">
          <span className={`py-1 px-3 rounded-lg font-semibold text-sm flex items-center gap-2 w-fit ${
            isActive
              ? 'bg-green-100 text-green-700'
              : 'bg-neutral-200/50 text-neutral-500'
          }`}
          >
            <div className={`w-1.5 h-1.5 rounded ${
              isActive
? 'bg-green-500'
: 'bg-neutral-500'
            }`}
            />
            {isActive
              ? 'Ativo'
              : 'Inativo'}
          </span>

          <h3 className="text-neutral-1000 font-medium font-araboto leading-snug text-base">
            {name}
          </h3>

          <div className="w-full h-[1px] bg-neutral-200" />

          <div className="flex items-center justify-between text-sm text-neutral-500">
            <div className="flex flex-col gap-1">
              <span className="text-sm">Categoria</span>
              <span className="font-medium text-sm font-araboto text-neutral-1000">
                {product?.category || 'N/A'}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm">Moeda</span>
              <span className="font-medium text-sm font-araboto text-neutral-1000">
                {product?.currency || 'BRL'}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm">Tipo</span>
              <span className="font-medium text-sm font-araboto text-neutral-1000">
                {type}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
