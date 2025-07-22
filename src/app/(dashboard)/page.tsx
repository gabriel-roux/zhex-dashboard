import { SalesAnalysisChart } from '@/components/charts/sales-analysis'
import { Container } from '@/components/container'
import {
  ArrowsClockwiseIcon,
  CurrencyCircleDollarIcon,
  ClockCounterClockwiseIcon,
  TicketIcon,
  TagIcon,
} from '@phosphor-icons/react/ssr'
import { CashFlow } from './widgets/cash-flow'
import { DragAndDrop } from './widgets/drag-drop-flow'

export default function Dashboard() {
  return (
    <>
      <div className="flex flex-col mx-auto px-6 w-full md:max-w-screen-lg 2xl:max-w-screen-xl 3xl:max-w-screen-2xl mt-6">
        <h1 className="text-lg text-neutral-950 font-araboto font-medium">
          Olá, Filipe!
        </h1>

        <p className="text-neutral-500 text-base font-araboto mb-6">
          Terça-feira, 13 de Junho de 2025
        </p>
      </div>

      <Container className="">
        <div className="w-full rounded-lg border border-neutral-200 bg-white px-6 py-4 flex divide-x divide-neutral-200 overflow-auto">
          {[
            {
              label: 'Vendas hoje',
              value: 'R$ 43.567',
              delta: 36,
              icon: <CurrencyCircleDollarIcon size={20} />,
            },
            {
              label: 'Vendas ontem',
              value: 'R$ 3.567',
              delta: 36,
              icon: <ClockCounterClockwiseIcon size={20} />,
            },
            {
              label: 'Assinaturas renovadas',
              value: '3.567',
              delta: 36,
              icon: <ArrowsClockwiseIcon size={20} />,
            },
            {
              label: 'Ticket médio',
              value: 'R$ 3.567',
              delta: -6,
              icon: <TicketIcon size={20} />,
            },
          ].map((m) => (
            <div
              key={m.label}
              className="flex-1 min-w-[200px] flex flex-col gap-3 px-4 first:pl-0 last:pr-0"
            >
              <span className="flex items-center gap-1.5 text-neutral-700 font-medium text-lg">
                {m.icon} {m.label}
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-xl font-semibold">{m.value}</span>
                <span
                  className={`text-sm font-semibold ${
                    m.delta >= 0
                      ? 'text-green-secondary-600'
                      : 'text-red-secondary-600'
                  } flex items-center gap-1`}
                >
                  {m.delta >= 0 ? '↑' : '↓'}
                  {Math.abs(m.delta)}%{' '}
                  <span className="text-neutral-400">vs mês passado</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full flex items-start justify-between gap-5 mt-5">
          <div className="w-full max-w-[800px] h-[430px] bg-white border border-neutral-200 rounded-lg p-6 flex flex-col gap-4">
            <header className="w-full flex flex-col gap-3">
              <div className="flex w-full items-center justify-between">
                <h2 className="flex items-center gap-1.5 text-neutral-1000 font-medium text-lg">
                  <TagIcon size={20} />
                  Ánalise de vendas
                </h2>
                <button
                  type="button"
                  className="text-sm text-neutral-1000 underline font-araboto font-medium hover:text-neutral-800 transition-colors"
                >
                  Ver mais
                </button>
              </div>

              <div className="flex w-full items-center justify-between">
                {/* value + delta */}
                <div className="flex items-baseline gap-3">
                  <span className="text-xl font-semibold">R$ 143.400,50</span>
                  <span
                    className={`text-sm font-semibold ${
                      true
                        ? 'text-green-secondary-600'
                        : 'text-red-secondary-600'
                    } flex items-center gap-1`}
                  >
                    {true ? '↑' : '↓'}
                    36% <span className="text-neutral-400">vs mês passado</span>
                  </span>
                </div>

                {/* period toggle */}
                <div className="flex items-center gap-6">
                  <button
                    type="button"
                    className="flex items-center gap-1 text-neutral-500 font-araboto text-sm font-medium"
                  >
                    <span className="h-3 w-3 rounded-full border-4 border-neutral-1000 bg-neutral-0 inline-block" />
                    Este mês
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-1 text-neutral-500 font-araboto text-sm font-medium"
                  >
                    <span className="h-3 w-3 rounded-full border-4 border-neutral-400 bg-white inline-block" />
                    Mês passado
                  </button>
                </div>
              </div>
            </header>

            <SalesAnalysisChart />
          </div>

          <CashFlow />
        </div>

        <DragAndDrop />
      </Container>
    </>
  )
}
