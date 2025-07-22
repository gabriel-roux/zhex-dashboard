/* eslint-disable @stylistic/jsx-closing-tag-location */
'use client'

import { ArrowsOutSimpleIcon, RankingIcon } from '@phosphor-icons/react'

/**
 * Card: Top Afiliados
 *
 * Mostra ranking de afiliados, com o 1º destacado.
 * Dados de exemplo – troque pela API.
 */
export function TopAffiliatesWidget() {
  const affiliates = [
    {
      id: 1,
      name: 'Filipe Pereira',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      code: 'A23FE',
      value: 12_800,
      sales: 1_571,
      pct: 98,
    },
    {
      id: 2,
      name: 'Gabriel Fonseca',
      avatar: 'https://randomuser.me/api/portraits/men/83.jpg',
      value: 3_800,
      pct: 43,
    },
    {
      id: 3,
      name: 'Enzo Hirata',
      avatar: 'https://randomuser.me/api/portraits/men/20.jpg',
      value: 1_800,
      pct: 20,
    },
  ]

  return (
    <div className="w-full h-[380px] bg-white border border-neutral-200 rounded-lg py-5 px-4 flex flex-col">
      {/* Header ---------------------------------------------------- */}
      <header className="flex items-start justify-between pb-4">
        <h3 className="text-neutral-1000 font-araboto text-lg flex items-center gap-2 font-medium">
          <RankingIcon size={22} weight="bold" className="-mt-0.5" />
          Top Afiliados
        </h3>

        <button className="w-8 h-8 rounded-lg border text-neutral-500 border-neutral-200 hover:bg-neutral-100 transition-colors flex items-center justify-center">
          <ArrowsOutSimpleIcon size={18} weight="bold" />
        </button>
      </header>

      {/* Lista ----------------------------------------------------- */}
      <ul className="flex-1 overflow-y-auto">
        {affiliates.map((a, idx) =>
          idx === 0
            ? <li
                key={a.id}
                className="flex flex-col bg-zhex-base-500/10 rounded-2xl p-5 mb-1 gap-4"
              >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-zhex-base-500 font-semibold text-sm">
                    {a.id}
                  </span>
                  <img
                    src={a.avatar}
                    alt={a.name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium text-neutral-900">
                      {a.name}
                    </span>
                    <span className="text-neutral-500 text-sm">
                      Vendas:{' '}
                      {a.value.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                </div>

                {/* barra pct */}
                <div className="w-[80px] h-[18px] bg-neutral-200 rounded-full flex items-center">
                  <div
                    className="h-full bg-zhex-base-600 rounded-full flex items-center justify-end text-xs font-medium text-white"
                    style={{ width: `${a.pct}%` }}
                  >
                    {a.pct}%
                  </div>
                </div>
              </div>

              {/* detalhes */}
              <div className="flex items-center justify-between text-sm text-neutral-600">
                <div className="flex flex-col">
                  <span className="text-[#595959]">Código</span>
                  <span className="text-neutral-1000 font-semibold">
                    {a.code}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[#595959]">Valor</span>
                  <span className="text-neutral-1000 font-semibold">
                    {a.value.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[#595959]">Vendas</span>
                  <span className="text-neutral-1000 font-semibold">
                    {a.sales?.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            </li>
            : (
          /* outros itens simples */
              <li
                key={a.id}
                className={`flex items-center justify-between px-2 py-4 ${idx === 1
? ''
: 'border-t'} border-neutral-200`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 text-neutral-70 text-sm">{a.id}</span>
                  <img
                    src={a.avatar}
                    alt={a.name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="text-neutral-900 font-medium">{a.name}</span>
                    <span className="text-neutral-500 text-xs">
                      Vendas:{' '}
                      {a.value.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                </div>

                {/* barra pct */}
                <div className="w-[80px] h-[18px] bg-neutral-200 rounded-full flex items-center">
                  <div
                    className="h-full bg-zhex-base-600 rounded-full flex items-center justify-end text-xs font-medium text-white"
                    style={{ width: `${a.pct}%` }}
                  >
                    {a.pct}%
                  </div>
                </div>
              </li>
              ),
        )}
      </ul>
    </div>
  )
}
