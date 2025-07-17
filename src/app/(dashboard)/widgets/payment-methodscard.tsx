"use client";

import {
  ArrowRightIcon,
  ArrowsOutSimpleIcon,
  CardholderIcon,
} from "@phosphor-icons/react";
import MasterCard from "@/assets/images/methods/mastercard.svg";
import Image from "next/image";

/**
 * Card: Métodos de Pagamento
 *
 * Lista os principais meios de pagamento, percentual no período
 * e faturamento por método. Mock estático — troque por dados da API.
 */
export function PaymentMethods() {
  const methods = [
    {
      id: "master",
      label: "MasterCard",
      pct: 47,
      amount: 5_170.83,
      bar: "border-l-[3px] border-zhex-base-500 bg-zhex-base-600/40",
      icon: (
        <Image
          src={MasterCard}
          alt="Mastercard"
          quality={100}
          className="w-[16px] h-[10px]"
        />
      ),
    },
    {
      id: "paypal",
      label: "Paypal",
      pct: 47,
      amount: 1_170.83,
      bar: "border-l-[3px] border-cyan-500 bg-cyan-600/40",
      icon: (
        <Image
          src={MasterCard}
          alt="Mastercard"
          quality={100}
          className="w-5 h-4 object-contain"
        />
      ),
    },
    {
      id: "apple",
      label: "Apple Pay",
      pct: 47,
      amount: 3_170.83,
      bar: "border-l-[3px] border-neutral-500 bg-neutral-600/40",
      icon: (
        <Image
          src={MasterCard}
          alt="Mastercard"
          quality={100}
          className="w-5 h-4 object-contain"
        />
      ),
    },
    {
      id: "gpay",
      label: "Google Pay",
      pct: 47,
      amount: 2_170.83,
      bar: "border-l-[3px] border-rose-500 bg-rose-600/40",
      icon: (
        <Image
          src={MasterCard}
          alt="Mastercard"
          quality={100}
          className="w-5 h-4 object-contain"
        />
      ),
    },
  ];

  return (
    <div className="w-full h-[380px] bg-white border border-neutral-200 rounded-lg py-5 px-4 flex flex-col gap-4">
      {/* Header ---------------------------------------------------- */}
      <header className="flex items-start justify-between">
        <h3 className="text-neutral-1000 font-araboto text-lg flex items-center gap-2 font-medium">
          <CardholderIcon size={22} weight="bold" className="-mt-0.5" />
          Métodos de Pagamento
        </h3>

        <button className="w-8 h-8 rounded-lg border text-neutral-500 border-neutral-200 hover:bg-neutral-100 transition-colors flex items-center justify-center">
          <ArrowsOutSimpleIcon size={18} weight="bold" />
        </button>
      </header>

      {/* Grid ------------------------------------------------------ */}
      <div className="grid grid-cols-2 gap-4">
        {methods.map(({ id, label, pct, amount, bar, icon }) => (
          <div
            key={id}
            className="border border-neutral-200 rounded-xl py-2 px-4 flex flex-col gap-2.5"
          >
            {/* título */}
            <div className="flex items-center gap-2">
              {icon}
              <span className="font-medium text-sm text-neutral-900">
                {label}
              </span>
            </div>

            {/* barra de progresso */}
            <div className="w-full h-[22px] bg-[#F4F8FB] rounded-md">
              <div
                className={`${bar} rounded-l-[4px] h-[22px] flex items-center justify-center text-xs font-medium text-white`}
                style={{ width: `${pct}%` }}
              >
                {pct}%
              </div>
            </div>

            {/* valor */}
            <span className="text-neutral-1000 font-araboto text-xs font-medium">
              {amount.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}{" "}
              <span className="font-normal text-neutral-500">
                por este método
              </span>
            </span>
          </div>
        ))}
      </div>

      {/* Footer link --------------------------------------------- */}
      <div className="w-full border-t border-e-neutral-200 flex items-center justify-center gap-2">
        <button className="text-sm font-medium mt-4 flex items-center gap-2 text-zhex-base-500 hover:text-zhex-base-600 transition-colors">
          Ver todos métodos
          <ArrowRightIcon size={16} weight="bold" />
        </button>
      </div>
    </div>
  );
}
