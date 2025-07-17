"use client";

import {
  ArrowsOutSimpleIcon,
  ChartPieSliceIcon,
} from "@phosphor-icons/react";

/**
 * Card: Status de pagamentos
 *
 * Mocka 5 status (Aprovadas, Pendentes, Recusadas, Reembolsadas, Estornadas),
 * mostrando barra de distribuição + lista detalhada.
 */
export function PaymentStatusCard() {
  const data = [
    {
      label: "Aprovadas",
      value: 18_941.3,
      pct: 60,
      color: "bg-[#0CAF5D] text-green-secondary-500",
    },
    {
      label: "Pendentes",
      value: 8_941.3,
      pct: 20,
      color: "bg-yellow-secondary-400 text-yellow-secondary-400",
    },
    {
      label: "Recusadas",
      value: 6_941.3,
      pct: 10,
      color: "bg-red-secondary-400 text-red-secondary-400",
    },
    {
      label: "Reembolsadas",
      value: 3_941.3,
      pct: 5,
      color: "bg-zinc-400 text-zinc-400",
    },
    {
      label: "Estornadas",
      value: 3_941.3,
      pct: 5,
      color: "bg-blue-600 text-blue-600",
    },
  ];

  return (
    <div className="w-full h-[380px] bg-white border border-neutral-200 rounded-lg py-5 px-4 flex flex-col gap-6">
      {/* Header ---------------------------------------------------- */}
      <header className="flex items-start justify-between">
        <h3 className="text-neutral-1000 font-araboto text-lg flex items-center gap-2 font-medium">
          <ChartPieSliceIcon size={22} weight="bold" className="-mt-0.5" />
          Status
        </h3>

        <button className="w-8 h-8 rounded-lg border text-neutral-500 border-neutral-200 hover:bg-neutral-100 transition-colors flex items-center justify-center">
          <ArrowsOutSimpleIcon size={18} weight="bold" />
        </button>
      </header>

      {/* Barra de distribuição ------------------------------------ */}
      <div className="w-full h-2.5 overflow-hidden flex">
        {data.map(({ pct, color }, idx) => (
          <div
            key={idx}
            className={`${color.split(" ")[0]} mr-1.5 rounded-sm`}
            style={{ width: `${pct}%` }}
          />
        ))}
      </div>

      {/* Lista ----------------------------------------------------- */}
      <ul className="flex-1 flex flex-col divide-y divide-neutral-200">
        {data.map(({ label, value, pct, color }) => (
          <li key={label} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <span
                className={`w-3 h-[4px] rounded ${color.split(" ")[0]}`}
              />
              <span className="text-neutral-800">{label}</span>
            </div>

            <span className="text-neutral-1000 font-semibold font-araboto">
              {value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}{" "}
              <span className="text-neutral-500 font-normal">({pct}%)</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
