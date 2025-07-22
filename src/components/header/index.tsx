'use client'

import {
  CirclesFourIcon,
  MagnifyingGlassIcon,
  BellIcon,
  CaretDownIcon,
  ImageSquareIcon,
  CubeIcon,
  UsersThreeIcon,
  CurrencyDollarSimpleIcon,
  ArrowsLeftRightIcon,
  NotepadIcon,
  GlobeIcon,
  WebhooksLogoIcon,
} from '@phosphor-icons/react/ssr'

import { usePathname } from 'next/navigation'
import { ProfileMenu } from './profile-menu'
import React from 'react'

type NavLink = {
  href: string
  label: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon: React.ComponentType<any>
}

const primaryLinks: NavLink[] = [
  { href: '/', label: 'Dashboard', Icon: CirclesFourIcon },
  { href: '/products', label: 'Produtos', Icon: CubeIcon },
  { href: '/affiliates', label: 'Afiliados', Icon: UsersThreeIcon },
]

const financeLinks: NavLink[] = [
  { href: '/finances', label: 'Financeiro', Icon: CurrencyDollarSimpleIcon },
  { href: '/transactions', label: 'Transações', Icon: ArrowsLeftRightIcon },
  { href: '/orders', label: 'Pedidos', Icon: NotepadIcon },
  { href: '/analytics', label: 'Analytics', Icon: GlobeIcon },
]

const othersLinks: NavLink[] = [
  { href: '/apps', label: 'Integrações', Icon: WebhooksLogoIcon },
]

const ALL_LINKS: NavLink[] = [...primaryLinks, ...financeLinks, ...othersLinks]

interface HeaderProps {
  /** Desabilita todos os links (ex.: onboarding) */
  desactived?: boolean
}

export function Header({ desactived = false }: HeaderProps) {
  const pathname = usePathname()

  /**
   * Resolve qual link está ativo com base no pathname atual.
   * Regra: match mais longo (exceto "/" que só vale se exatamente "/").
   */
  const active =
    ALL_LINKS.filter((l) =>
      l.href === '/'
        ? pathname === '/'
        : pathname === l.href || pathname.startsWith(l.href + '/'),
    ).sort((a, b) => b.href.length - a.href.length)[0] ?? ALL_LINKS[0]

  const ActiveIcon = active.Icon
  const activeLabel = active.label

  return (
    <header className="mx-auto w-full md:max-w-screen-lg 2xl:max-w-screen-xl 3xl:max-w-screen-2xl mt-4 h-16">
      <div
        className="
          fixed top-4
          left-[calc(50%+122px)]
          -translate-x-1/2
          w-full md:max-w-screen-lg 2xl:max-w-screen-xl 3xl:max-w-screen-2xl
          bg-neutral-0 h-16 border border-neutral-100 rounded-lg
          flex items-center gap-6 px-6 justify-between
          z-50
        "
      >
        {/* Breadcrumb / page title (dinâmico por rota) */}
        <div
          className={`flex items-center gap-3 ${
            desactived
? 'text-neutral-1000/30'
: 'text-neutral-1000'
          }`}
        >
          <ActiveIcon size={20} weight="regular" className="-mt-1" />
          <span className="font-araboto font-medium text-base">
            {activeLabel}
          </span>
        </div>

        {/* Search bar */}
        <div className="flex items-center gap-5">
          <div className="relative max-w-md mx-auto cursor-pointer">
            <MagnifyingGlassIcon
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300"
            />
            <input
              type="text"
              placeholder="Buscar"
              className="w-full h-10 pl-10 pr-3 rounded-lg bg-neutral-0 border border-neutral-200 placeholder:text-neutral-300 text-neutral-900 outline-none focus:ring-1 focus:ring-zhex-base-500 transition-all duration-300"
            />
          </div>

          {/* Notification icon */}
          <button
            type="button"
            aria-label="Notificações"
            className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-neutral-50 transition-colors border border-neutral-200"
          >
            <BellIcon size={18} className="text-neutral-400" />
            {/* Dot indicator */}
            {/* <span className="absolute top-1.5 right-1.5 inline-block w-2 h-2 bg-red-secondary-500 rounded-full" /> */}
          </button>

          {/* Company selector */}
          <ProfileMenu>
            <button
              type="button"
              className="flex items-center gap-2 h-10 px-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors outline-none"
            >
              <div className="w-6 h-6 rounded-full bg-neutral-25 flex items-center justify-center border border-neutral-300">
                <ImageSquareIcon size={14} className="text-neutral-700" />
              </div>
              <span className="text-neutral-900 font-araboto text-sm">
                Sua empresa aqui
              </span>
              <CaretDownIcon size={14} className="text-neutral-400" />
            </button>
          </ProfileMenu>
        </div>
      </div>
    </header>
  )
}
