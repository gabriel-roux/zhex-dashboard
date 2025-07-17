"use client";

import {
  ArrowRightIcon,
  ArrowsOutSimpleIcon,
  ReceiptIcon,
} from "@phosphor-icons/react";

/**
 * Card: Transações recentes
 *
 * Exibe lista tabular compacta (cliente, produto, valor). Mock estático —
 * troque por dados da API / GraphQL.
 */
export function TransactionsWidget() {
  const rows = Array.from({ length: 4 }).map((_, i) => ({
    id: i,
    client: "Julia Correa",
    email: "julia.correa@gmail.com",
    product: "Protocolo Pele Perfeita",
    amount: 47.9,
  }));

  return (
    <div className="w-full h-[380px] bg-white border border-neutral-200 rounded-lg py-5 px-4 flex flex-col">
      {/* Header ---------------------------------------------------- */}
      <header className="flex items-start justify-between pb-4">
        <h3 className="text-neutral-1000 font-araboto text-lg flex items-center gap-2 font-medium">
          <ReceiptIcon size={22} weight="bold" className="-mt-0.5" />
          Transações
        </h3>

        <button className="w-8 h-8 rounded-lg border text-neutral-500 border-neutral-200 hover:bg-neutral-100 transition-colors flex items-center justify-center">
          <ArrowsOutSimpleIcon size={18} weight="bold" />
        </button>
      </header>

      {/* Títulos de coluna ---------------------------------------- */}
      <div className="grid grid-cols-3 text-sm text-neutral-500 font-medium px-1">
        <span>Cliente</span>
        <span className="ml-5">Produtos</span>
        <span className="text-right">Valor</span>
      </div>

      {/* Divider tracejado */}
      <div className="border-t border-dashed border-neutral-300 my-2" />

      {/* Linhas ---------------------------------------------------- */}
      <ul className="flex-1 overflow-y-auto divide-y divide-neutral-200">
        {rows.map(({ id, client, email, product, amount }) => (
          <li
            key={id}
            className="grid grid-cols-3 items-center py-3 text-sm gap-1"
          >
            {/* Coluna 1: cliente */}
            <div>
              <p className="text-neutral-900 font-medium">{client}</p>
              <p className="text-neutral-500 text-xs">{email}</p>
            </div>

            {/* Coluna 2: produto */}
            <p className="text-neutral-800 truncate ml-5">{product}</p>

            {/* Coluna 3: valor */}
            <p className="text-neutral-1000 font-semibold text-right">
              {amount.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}