'use client'

import * as Dialog from '@radix-ui/react-dialog'
import {
  MagnifyingGlassIcon,
  XCircleIcon,
  SquaresFourIcon,
  ChartLineIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  LifebuoyIcon,
} from '@phosphor-icons/react'
import { JSX, useState } from 'react'

import { SubscriptionWidget } from './subscription-card'
import { ChargebackControlWidget } from './chargeback-control-card'
import { NetVolumeWidget } from './net-volume-card'
import { PaymentStatusCard } from './status-card'
import { PaymentMethods } from './payment-methodscard'
import { TransactionsWidget } from './transactions-card'
import { GrossVolumeWidget } from './gross-volume-card'
import { RefusedVolumeWidget } from './refused-volume-card'
import { SupportWidget } from './support-card'
import { TopAffiliatesWidget } from './top-affiliates'

type Widget = {
  id: string
  name: string
  category: string
  description: string
}

const widgets: Widget[] = [
  {
    id: 'subscription',
    name: 'Subscription Performance',
    category: 'Analytics',
    description: 'Novas assinaturas e churn',
  },
  {
    id: 'net-volume',
    name: 'Net Volume',
    category: 'Analytics',
    description: 'Volume líquido mensal',
  },
  {
    id: 'gross-volume',
    name: 'Gross Volume',
    category: 'Analytics',
    description: 'Volume bruto processado',
  },
  {
    id: 'refused-volume',
    name: 'Refused Volume',
    category: 'Analytics',
    description: 'Pagamentos recusados',
  },
  {
    id: 'status',
    name: 'Payment Status',
    category: 'Pagamentos',
    description: 'Aprovados, pendentes, recusados',
  },
  {
    id: 'methods',
    name: 'Payment Methods',
    category: 'Pagamentos',
    description: 'Desempenho por método',
  },
  {
    id: 'transactions',
    name: 'Recent Transactions',
    category: 'Pagamentos',
    description: 'Últimas vendas',
  },
  {
    id: 'chargeback',
    name: 'Chargeback Control',
    category: 'Risco',
    description: 'Acompanhamento de chargebacks',
  },
  {
    id: 'affiliates',
    name: 'Top Affiliates',
    category: 'Afiliação',
    description: 'Ranking de afiliados',
  },
  {
    id: 'support',
    name: 'Account Manager',
    category: 'Suporte',
    description: 'Contato direto com gerente',
  },
]

const widgetComponents: Record<string, JSX.Element> = {
  subscription: <SubscriptionWidget />,
  'net-volume': <NetVolumeWidget />,
  'gross-volume': <GrossVolumeWidget />,
  'refused-volume': <RefusedVolumeWidget />,
  status: <PaymentStatusCard />,
  methods: <PaymentMethods />,
  transactions: <TransactionsWidget />,
  chargeback: <ChargebackControlWidget />,
  affiliates: <TopAffiliatesWidget />,
  support: <SupportWidget />,
}

const categories = [
  { label: 'Todos Widgets', icon: <SquaresFourIcon size={18} /> },
  { label: 'Analytics', icon: <ChartLineIcon size={18} /> },
  { label: 'Pagamentos', icon: <CreditCardIcon size={18} /> },
  { label: 'Risco', icon: <ShieldCheckIcon size={18} /> },
  { label: 'Afiliação', icon: <UserCircleIcon size={18} /> },
  { label: 'Suporte', icon: <LifebuoyIcon size={18} /> },
] as const

export function WidgetsModal({
  onClose,
  onSelect,
}: {
  open: boolean
  onClose: () => void
  onSelect: (widgetId: string) => void
}) {
  const [query, setQuery] = useState('')
  const [activeCat, setActiveCat] = useState('Todos Widgets')

  const filtered = widgets.filter(
    (w) =>
      (activeCat === 'Todos Widgets' || w.category === activeCat) &&
      w.name.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
      <Dialog.Content
        onOpenAutoFocus={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={onClose}
        className="fixed left-1/2 top-1/2 h-[80vh] w-[1590px] -translate-x-1/2 z-50 -translate-y-1/2 rounded-2xl bg-white border border-neutral-200 shadow-xl flex flex-col overflow-hidden"
      >
        <div className="flex justify-between p-6 pb-4">
          <div>
            <Dialog.Title className="text-2xl font-medium font-araboto text-neutral-1000">
              Biblioteca de Widgets.
            </Dialog.Title>
            <Dialog.Description className="text-neutral-700 mt-1">
              Selecione os widgets que deseja adicionar ao seu painel.
            </Dialog.Description>
          </div>

          <Dialog.Close asChild>
            <button
              type="button"
              className="text-neutral-400 hover:text-red-secondary-600 transition-colors"
              aria-label="Fechar"
              onClick={onClose}
            >
              <XCircleIcon size={30} weight="fill" />
            </button>
          </Dialog.Close>
        </div>

        <div className="flex items-center gap-3 w-full bg-neutral-100/20 border-y border-neutral-200 py-3 px-6">
          <div className="relative flex-1">
            <MagnifyingGlassIcon
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              placeholder="Buscar widgets..."
              className="w-full rounded-lg border transition-all duration-300 border-neutral-300 bg-neutral-50 py-2 pl-9 pr-3 text-sm placeholder-neutral-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {/* sidebar + grid ---------------------------------------- */}
        <div className="flex items-start flex-1 overflow-hidden min-h-0">
          <aside className="w-56 h-full border-r border-neutral-200 p-4 space-y-2">
            <h3 className="font-semibold text-neutral-800 mb-2">Categorias</h3>
            {categories.map(({ label, icon }) => (
              <button
                key={label}
                onClick={() => setActiveCat(label)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                  activeCat === label
                    ? 'bg-zhex-base-500/10 text-zhex-base-500 font-medium'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                {icon}
                {label}
              </button>
            ))}
          </aside>

          {/* main --------------------------------------------------- */}
          {/* grid */}
          <div className="grid flex-1 max-h-[95%] pb-10 auto-rows-[1fr] grid-cols-3 gap-4 px-6 pt-5 overflow-y-auto">
            {filtered.map((w) => (
              <button
                key={w.id}
                onClick={() => {
                  onSelect(w.id)
                  onClose()
                }}
              >
                <div className="pointer-events-none">
                  {widgetComponents[w.id]}
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full flex items-center justify-center py-10 text-neutral-500">
                Nenhum widget encontrado
              </div>
            )}
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  )
}
