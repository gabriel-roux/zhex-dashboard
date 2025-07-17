"use client";

import * as Collapsible from "@radix-ui/react-collapsible";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  BankIcon,
  CaretCircleDownIcon,
  CaretCircleUpIcon,
} from "@phosphor-icons/react";
import {
  Line,
  Area,
  AreaChart,
  ResponsiveContainer,
  YAxis,
  CartesianGrid,
  ComposedChart,
  Tooltip,
  XAxis,
  Bar,
} from "recharts";

function TinyChart() {
  const data = [
    { v: 30 },
    { v: 42 },
    { v: 36 },
    { v: 48 },
    { v: 42 },
    { v: 52 },
  ];

  return (
    <ResponsiveContainer width={80} height={28}>
      <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="tinyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="15%" stopColor="#0ea5e9" stopOpacity={0.7} />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* baseline Y to allow area fill */}
        <YAxis hide domain={[0, "dataMax + 10"]} />

        {/* optional thin grid */}
        <CartesianGrid
          vertical={false}
          stroke="#F3F4F6"
          strokeDasharray="2 4"
        />

        {/* area with gradient */}
        <Area
          type="linear"
          dataKey="v"
          stroke="#5C7DFA"
          strokeWidth={1.5}
          fill="url(#tinyGrad)"
          activeDot={false}
          dot={false}
          isAnimationActive
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function ProductChart() {
  const data = [
    { mes: "JAN", vendas: 24, linha: 22 },
    { mes: "FEV", vendas: 28, linha: 28 },
    { mes: "MAR", vendas: 30, linha: 30 },
    { mes: "ABR", vendas: 26, linha: 26 },
    { mes: "MAI", vendas: 34, linha: 32 },
    { mes: "JUN", vendas: 25, linha: 24 },
    { mes: "JUL", vendas: 33, linha: 31 },
    { mes: "AGO", vendas: 29, linha: 28 },
    { mes: "SET", vendas: 35, linha: 34 },
    { mes: "OUT", vendas: 28, linha: 27 },
    { mes: "NOV", vendas: 32, linha: 31 },
    { mes: "DEZ", vendas: 23, linha: 21 },
  ];

  return (
    <ResponsiveContainer width="100%" height={70}>
      <ComposedChart
        data={data}
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      >
        {/* fundo gradiente para barras */}
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A8EEF6" stopOpacity={1} />
            <stop offset="100%" stopColor="#9DB3FF" stopOpacity={1} />
          </linearGradient>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.4} />
          </linearGradient>
        </defs>

        <CartesianGrid
          vertical={false}
          stroke="#F3F4F6"
          strokeDasharray="2 6"
        />

        <XAxis
          dataKey="mes"
          tick={{ fontSize: 10, fill: "#9CA3AF" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis hide domain={[0, 40]} />

        <Tooltip
          cursor={{ stroke: "#CBD5E1", strokeDasharray: "3 3" }}
          contentStyle={{ fontSize: 12, borderRadius: 6 }}
        />

        {/* coluna de valor (gradiente azul) */}
        <Bar
          dataKey="vendas"
          barSize={12}
          radius={[6, 6, 6, 6]} /* raio no topo */
          fill="url(#barGrad)"
        />

        {/* linha pontilhada */}
        <Line
          type="monotone"
          dataKey="linha"
          stroke="#2D6EEA"
          strokeWidth={2}
          strokeDasharray="5 5"
          strokeLinecap="round"
          dot={{ r: 3, strokeWidth: 2, stroke: "#2D6EEA", fill: "#FFF" }}
          activeDot={{ r: 4, strokeWidth: 3, stroke: "#2D6EEA", fill: "#FFF" }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export function CashFlow() {
  type Section = "saldo" | "Produtos digitais" | "Produtos físicos";
  const [openSection, setOpenSection] = useState<Section | null>("saldo");

  return (
    <div className="w-full max-w-[480px] h-[430px] rounded-lg border border-[#EAEEF4] bg-gradient-to-br from-zhex-secondary-400/20 from-[16%] to-zhex-base-500/20 p-6 flex flex-col gap-3">
      <header className="w-full flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-1.5 text-neutral-1000 font-medium text-lg">
          <BankIcon size={20} />
          Fluxo de Caixa
        </h2>
        <button
          type="button"
          className="text-sm text-neutral-1000 underline font-araboto font-medium hover:text-neutral-800 transition-colors"
        >
          Ver mais
        </button>
      </header>
      <span className="text-xl font-semibold">R$ 423.244,93</span>

      {/* saldo card */}
      <Collapsible.Root
        open={openSection === "saldo"}
        onOpenChange={(open) => setOpenSection(open ? "saldo" : null)}
        className="bg-gradient-to-br from-zhex-base-500/5 to-[46%] to-white rounded-lg border border-neutral-100 transition-shadow data-[state=open]:shadow-sm"
      >
        <Collapsible.Trigger asChild>
          <div className="flex items-center justify-between px-4 py-2 cursor-pointer">
            <p className="text-base font-medium">
              Saldo disponível:{" "}
              <span className="text-neutral-700 text-base">R$ 23.244,93</span>
            </p>
            <button className="text-zhex-base-500">
              <CaretCircleDownIcon
                weight="fill"
                size={20}
                className={`text-zhex-base-500 transition-transform duration-300 ${
                  openSection === "saldo" ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </Collapsible.Trigger>

        <Collapsible.Content>
          <motion.div
            key="saldo"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="flex flex-col gap-3 px-4 py-2 overflow-hidden"
          >
            {/* bar */}
            <div className="flex w-full h-[30px] rounded">
              <div className="bg-zhex-base-500 flex-1 flex items-center justify-center text-white font-semibold rounded-l-md">
                R$ 23.000,00
              </div>
              <div className="bg-yellow-400 flex-[2] flex items-center justify-center text-white font-semibold rounded-r-md border-l border-white">
                R$ 400.000,00
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-1 text-neutral-1000 font-medium">
                <span className="h-3 w-3 rounded bg-zhex-base-500 inline-block" />
                Disponível para saque
              </div>
              <div className="flex items-center gap-1 text-neutral-1000 font-medium">
                <span className="h-3 w-3 rounded bg-yellow-secondary-400 inline-block" />
                Liberado em breve
              </div>
            </div>
          </motion.div>
        </Collapsible.Content>
      </Collapsible.Root>

      {/* categorias */}
      {(["Produtos digitais", "Produtos físicos"] as Section[]).map((cat) => (
        <Collapsible.Root
          key={cat}
          open={openSection === cat}
          onOpenChange={(open) => setOpenSection(open ? cat : null)}
          className="bg-gradient-to-br from-zhex-base-500/5 to-[46%] to-white rounded-lg border border-neutral-100 transition-shadow data-[state=open]:shadow-sm"
        >
          <Collapsible.Trigger asChild>
            <button className="w-full px-4 py-2 flex items-center justify-between">
              <span className="font-medium text-base font-araboto">{cat}</span>

              <TinyChart />

              <CaretCircleDownIcon
                size={20}
                weight="fill"
                className={`text-zhex-base-500 transition-transform duration-300 ${
                  openSection === cat ? "rotate-180" : ""
                }`}
              />
            </button>
          </Collapsible.Trigger>
          <Collapsible.Content>
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="px-4 mt-2 overflow-hidden"
            >
              <ProductChart />
            </motion.div>
          </Collapsible.Content>
        </Collapsible.Root>
      ))}

      {/* botão */}
      <button
        type="button"
        className="mt-auto w-full py-3 rounded-lg bg-zhex-base-500 text-white font-medium hover:bg-zhex-base-600 transition-colors"
      >
        Efetuar retirada
      </button>
    </div>
  );
}
