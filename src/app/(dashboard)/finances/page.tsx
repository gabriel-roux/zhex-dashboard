import { NivelDiamond } from '@/assets/images/nivel-diamond'
import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { BankIcon, ArrowUpIcon, CalendarDotsIcon } from '@phosphor-icons/react/dist/ssr'
import ProgressBarBg from '@/assets/images/progress-bar-bg.png'
import BrazilFlag from '@/assets/images/flags/brazil.svg'
import Image from 'next/image'
import { TinyChart } from '../widgets/cash-flow'
import { FinancesList } from './finances-list'

export default function FinancesPage() {
  return (
    <>
      <Container className="mt-6 px-2">
        <h1 className="text-lg text-neutral-950 font-araboto font-medium">
          Financeiro
        </h1>

        <p className="text-neutral-500 text-base font-araboto mb-6">
          Gerencie suas finanças e solicitações de saques.
        </p>
      </Container>

      <Container className="flex items-start justify-between gap-8">
        <div className="w-full max-w-[785px] bg-white rounded-lg py-6 px-5 mb-8 border border-neutral-200">
          <div className="flex items-center gap-3 mb-4">
            <Image src={BrazilFlag} alt="Brazil" width={60} height={48} />
            <div>
              <p className="text-neutral-500 font-araboto font-medium text-sm">Total para saque</p>
              <h2 className="text-2xl font-bold text-neutral-1000 font-araboto">R$ 147.673,45</h2>
            </div>
          </div>

          <p className="text-neutral-600 font-araboto text-sm mb-6">
            D-1, it is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
          </p>

          <div className="flex gap-3">
            <Button variant="primary" size="medium" className="flex items-center gap-2 h-11 text-base">
              <ArrowUpIcon weight="bold" size={18} />
              Retirar agora
            </Button>

            <Button variant="ghost" size="medium" className="flex items-center gap-2 h-11 text-base">
              <CalendarDotsIcon weight="bold" size={18} />
              Agendar transferência
            </Button>
          </div>

          <div className="w-full h-[1px] bg-neutral-200 my-5" />

          {/* Componente de Nível */}
          <div className="flex flex-col gap-2">
            <div>
              <span className="text-neutral-1000 font-bold">Seu nível: </span>
              <span className="text-neutral-600">Silver</span>
            </div>

            {/* Progress Bar */}
            <div className="relative">
              <div className="w-full h-3 bg-neutral-200/10 rounded-full" style={{ backgroundImage: `url(${ProgressBarBg.src})` }}>
                <div className="h-full bg-gradient-to-t from-zhex-base-500 to-[#012C72] rounded-full relative" style={{ width: '60%' }}>
                  <div
                    className="absolute -translate-x-1/2 w-6 h-6 rounded-full bg-white flex items-center justify-center border-2 border-zhex-base-500 shadow-md"
                    style={{
                      left: '99%',
                      top: '50%',
                      transform: 'translateY(-50%)',
                    }}
                  >
                    <NivelDiamond nivel="silver" />
                  </div>
                </div>

              </div>
            </div>

            {/* Texto descritivo */}
            <div className="space-y-2 mt-3">
              <p className="text-neutral-500 text-base">
                Você faturou até 50k e por isso está no <span className="font-bold">Silver</span>. Fature + 20k e vá para o nível <span className="font-bold">GOLD</span>.
                Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC.
              </p>
            </div>

            {/* Link Saiba mais */}
            <a href="#" className="text-zhex-base-500 underline text-base font-medium hover:text-zhex-base-600 transition-colors">
              Saiba mais sobre os níveis.
            </a>
          </div>
        </div>

        <div className="w-full max-w-[480px] h-[435px] rounded-lg border border-[#EAEEF4] bg-gradient-to-br from-zhex-secondary-400/20 from-[16%] to-zhex-base-500/20 p-6 flex flex-col gap-3">
          <header className="w-full flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-1.5 text-neutral-1000 font-medium text-lg">
              <BankIcon size={20} />
              Fluxo de Caixa
            </h2>
          </header>
          <div className="">
            <p className="text-base font-medium text-neutral-600">
              Saldo Total:
            </p>
            <span className="text-2xl font-semibold font-araboto">
              R$ 423.244,93
            </span>
          </div>

          <div
            className="bg-gradient-to-br from-zhex-base-500/5 to-[46%] to-white rounded-lg border border-neutral-100 transition-shadow data-[state=open]:shadow-smq mb-3"
          >
            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex flex-col gap-1">
                <p className="text-base font-medium text-neutral-600">
                  Disponível em breve:
                </p>
                <span className="text-neutral-1000 font-bold text-xl font-araboto">R$ 23.244,93</span>
              </div>

              <TinyChart />
            </div>

            <p className="text-neutral-600 font-araboto text-sm px-4 pb-2">
              D-1, it is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
            </p>

          </div>
          <div
            className="bg-gradient-to-br from-zhex-base-500/5 to-[46%] to-white rounded-lg border border-neutral-100 transition-shadow data-[state=open]:shadow-sm"
          >
            <div className="flex items-center justify-between px-4 py-2 gap-3">
              <div className="flex flex-col gap-1">
                <p className="text-base font-medium text-neutral-600">
                  Saldo em reserva:
                </p>
                <span className="text-neutral-1000 font-bold text-xl font-araboto">R$ 23.244,93</span>
              </div>

              <TinyChart />
            </div>

            <p className="text-neutral-600 font-araboto text-sm px-4 pb-2">
              D-1, it is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
            </p>

          </div>
        </div>
      </Container>

      <FinancesList />
    </>
  )
}
