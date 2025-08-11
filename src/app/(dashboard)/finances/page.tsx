'use client'

import { NivelDiamond } from '@/assets/images/nivel-diamond'
import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { BankIcon, ArrowUpIcon, CalendarDotsIcon } from '@phosphor-icons/react/dist/ssr'
import ProgressBarBg from '@/assets/images/progress-bar-bg.png'
import BrazilFlag from '@/assets/images/flags/brazil.svg'
import Image from 'next/image'
import { TinyChart } from '../widgets/cash-flow'
import { FinancesList } from './finances-list'
import { useApi } from '@/hooks/useApi'
import { WalletBalance } from '@/@types/wallet'
import { useEffect, useState } from 'react'
import { WithdrawBalanceModal } from './withdraw-balance-modal'
import { Skeleton } from '@/components/skeleton'

export default function FinancesPage() {
  const api = useApi()
  const [walletBalance, setWalletBalance] = useState<WalletBalance | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openWithdrawModal, setOpenWithdrawModal] = useState(false)
  useEffect(() => {
    const loadWalletBalance = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await api.get<{ success: boolean; data?: WalletBalance; message?: string }>('/wallet/balance')

        if (response.data.success && response.data.data) {
          setWalletBalance(response.data.data)
        } else {
          setError(response.data.message || 'Erro ao carregar saldo da carteira')
        }
      } catch (err) {
        const errorMessage = err instanceof Error
          ? err.message
          : 'Erro ao carregar saldo da carteira'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    loadWalletBalance()
  }, [])

  const formatCurrency = (value: number, currency: string = 'BRL') => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency,
    }).format(value)
  }

  const handleWithdraw = () => {
    setOpenWithdrawModal(true)
  }

  const handleScheduleTransfer = async () => {
    // TODO: Implementar agendamento de transferência
    console.log('Implementar agendamento de transferência')
  }

  if (error) {
    return (
      <Container className="mt-6 px-2">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Erro: {error}</p>
        </div>
      </Container>
    )
  }

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
              <h2 className="text-2xl font-bold text-neutral-1000 font-araboto">
                {loading
                  ? <Skeleton className="w-32 h-6 rounded-lg" />
                  : walletBalance
                    ? formatCurrency(walletBalance.availableBalanceInReais, walletBalance.currency)
                    : 'R$ 0,00'}
              </h2>
            </div>
          </div>

          <p className="text-neutral-600 font-araboto text-sm mb-6">
            Saldo disponível para saque imediato. Valores em processamento ficam disponíveis em D+1.
          </p>

          <div className="flex gap-3">
            {loading
              ? <Skeleton className="w-32 h-11 rounded-lg" />
              : (
                <Button
                  variant="primary"
                  size="medium"
                  className="flex items-center gap-2 h-11 text-base"
                  onClick={handleWithdraw}
                  disabled={!walletBalance || walletBalance.availableBalance <= 0}
                >
                  <ArrowUpIcon weight="bold" size={18} />
                  Retirar agora
                </Button>
                )}

            <Button
              variant="ghost"
              size="medium"
              className="flex items-center gap-2 h-11 text-base"
              onClick={handleScheduleTransfer}
            >
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

        <div className="w-full max-w-[480px] h-[418px] rounded-lg border border-[#EAEEF4] bg-gradient-to-br from-zhex-secondary-400/20 from-[16%] to-zhex-base-500/20 p-6 flex flex-col gap-3">
          <header className="w-full flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-1.5 text-neutral-1000 font-medium text-lg">
              <BankIcon size={20} />
              Fluxo de Caixa
            </h2>
          </header>
          <div className="">
            <span className="text-2xl font-semibold font-araboto">
              {loading
                ? <Skeleton className="w-32 h-6 rounded-lg" />
                : walletBalance
                  ? formatCurrency(walletBalance.totalBalanceInReais, walletBalance.currency)
                  : 'R$ 0,00'}
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
                <span className="text-neutral-1000 font-bold text-xl font-araboto">
                  {loading
                    ? <Skeleton className="w-24 h-6 rounded-lg" />
                    : walletBalance
                      ? formatCurrency(walletBalance.processingBalanceInReais, walletBalance.currency)
                      : 'R$ 0,00'}
                </span>
              </div>

              <TinyChart />
            </div>

            <p className="text-neutral-600 font-araboto text-sm px-4 pb-2">
              Valores em processamento ficam disponíveis em D+1. Estes valores ainda não podem ser sacados.
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
                <span className="text-neutral-1000 font-bold text-xl font-araboto">
                  {loading
                    ? <Skeleton className="w-24 h-6 rounded-lg" />
                    : walletBalance
                      ? formatCurrency(walletBalance.reservedBalanceInReais, walletBalance.currency)
                      : 'R$ 0,00'}
                </span>
              </div>

              <TinyChart />
            </div>

            <p className="text-neutral-600 font-araboto text-sm px-4 pb-2">
              Valores reservados para uso futuro. Estes valores não podem ser sacados.
            </p>

          </div>
        </div>
      </Container>

      <FinancesList />

      <WithdrawBalanceModal
        open={openWithdrawModal}
        onOpenChange={setOpenWithdrawModal}
        walletBalance={walletBalance}
        onWithdrawCreated={() => setOpenWithdrawModal(false)}
      />
    </>
  )
}
