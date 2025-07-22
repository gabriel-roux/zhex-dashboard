import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { ProductList } from './product-list'
import Link from 'next/link'

export default function ProductsPage() {
  return (
    <>
      <Container className="flex items-start justify-between w-full mt-6 px-2">
        <div>
          <h1 className="text-lg text-neutral-950 font-araboto font-medium">
            Gerencie seus produtos
          </h1>

          <p className="text-neutral-500 text-base font-araboto mb-6">
            Adicione, edite e remova produtos na sua empresa para facilitar a
            gestão de vendas.
          </p>
        </div>

        <Link href="/products/create">
          <Button size="medium" variant="primary">
            Adicionar produto
          </Button>
        </Link>
      </Container>

      <Container>
        <div className="w-full bg-white rounded-lg py-6 px-5 mb-10 border border-neutral-200">
          <ProductList />
        </div>
      </Container>
    </>
  )
}
