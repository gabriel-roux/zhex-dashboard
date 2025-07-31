import * as Slider from '@radix-ui/react-slider'
import {
  MegaphoneIcon,
  ShoppingCartSimpleIcon,
  GlobeIcon,
  UsersThreeIcon,
  VideoCameraIcon,
  TrendUpIcon,
  MonitorIcon,
  StorefrontIcon,
} from '@phosphor-icons/react'
import { Option } from '@/components/option'
import { BuildingIcon, UserIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { motion } from 'framer-motion' // suave animação no thumb
import { CreateCompanyProfileData, businessTypeMapping, companySizeMapping } from '@/@types/onboarding'
import { Button } from '@/components/button'

interface InitOnboardingProps {
  onSubmit: (data: CreateCompanyProfileData) => Promise<unknown>
  isLoading: boolean
  error: string | null
  onClearError: () => void
  setCurrentStep: (step: number) => void
}

export function InitOnboarding({
  onSubmit,
  isLoading,
  error,
  onClearError,
  setCurrentStep,
}: InitOnboardingProps) {
  // slider steps
  const sizeSteps = [
    { value: 1, label: '1‑10' },
    { value: 2, label: '11‑50' },
    { value: 3, label: '51‑200' },
    { value: 4, label: '201‑500' },
    { value: 5, label: '+500' },
  ]

  const [sizeValue, setSizeValue] = useState<number[]>([1])

  // PF / PJ
  const [personType, setPersonType] = useState<'pf' | 'pj'>('pf')

  // company type selection
  const companyTypes = [
    'Tráfego Direto',
    'Produtor de Infoprodutos',
    'Afiliado de Marketing',
    'E‑commerce de Nicho',
    'SaaS / Ferramenta B2B',
    'Marketplace',
    'Influencer / Creator',
    'Agência Global',
  ]
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)

  const displaySize = sizeSteps.find(
    (s) => s.value === Math.round(sizeValue[0]),
  )!

  const handleSubmit = async () => {
    if (!selectedCompany) {
      alert('Selecione um tipo de empresa')
      return
    }

    try {
      const data: CreateCompanyProfileData = {
        companyType: personType === 'pf'
          ? 'INDIVIDUAL'
          : 'CORPORATION',
        businessType: businessTypeMapping[selectedCompany],
        companySize: companySizeMapping[displaySize.label],
      }

      const result = await onSubmit(data) as { nextStep?: { step: number; title: string; description: string } }

      if (result?.nextStep) {
        const nextStepIndex = result.nextStep.step - 1

        setCurrentStep(nextStepIndex)
      }
    } catch (err) {
      console.error('Erro ao criar perfil:', err)
    }
  }

  // Limpar erro quando mudar os campos
  const handlePersonTypeChange = (type: 'pf' | 'pj') => {
    setPersonType(type)
    onClearError()
  }

  const handleCompanyTypeChange = (type: string) => {
    setSelectedCompany(type)
    onClearError()
  }

  const handleSizeChange = (value: number[]) => {
    setSizeValue(value)
    onClearError()
  }

  return (
    <>
      <div className="flex flex-col">
        <h2 className="text-lg font-araboto font-semibold text-neutral-950">
          Conte-nos sobre a empresa.
        </h2>

        <p className="text-neutral-500 font-araboto">
          Compartilhe o essencial do seu negócio e ajustaremos a Zhex para você.
        </p>
      </div>

      <div className="flex items-center gap-4 mt-4">
        <Option
          label="Pessoa Física ( PF )"
          icon={UserIcon}
          selected={personType === 'pf'}
          onSelect={() => handlePersonTypeChange('pf')}
        />
        <Option
          label="Pessoa Jurídica ( PJ )"
          icon={BuildingIcon}
          selected={personType === 'pj'}
          onSelect={() => handlePersonTypeChange('pj')}
        />
      </div>

      <div className="mt-6 flex flex-col gap-4 w-full">
        <h2 className="text-lg font-araboto font-semibold text-neutral-950">
          Que tipo de empresa você é?
        </h2>
        <div
          className="
                grid gap-3 mt-2 w-full
                grid-cols-[repeat(auto-fill,minmax(230px,max-content))]
                justify-start
              "
        >
          {companyTypes.map((type) => (
            <Option
              key={type}
              label={type}
              icon={
                type === 'Tráfego Direto'
                  ? MegaphoneIcon
                  : type === 'Produtor de Infoprodutos'
                    ? MonitorIcon
                    : type === 'Afiliado de Marketing'
                      ? UsersThreeIcon
                      : type === 'E‑commerce de Nicho'
                        ? ShoppingCartSimpleIcon
                        : type === 'SaaS / Ferramenta B2B'
                          ? TrendUpIcon
                          : type === 'Marketplace'
                            ? StorefrontIcon
                            : type === 'Influencer / Creator'
                              ? VideoCameraIcon
                              : GlobeIcon
              }
              selected={selectedCompany === type}
              onSelect={() => handleCompanyTypeChange(type)}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 w-full">
        <h2 className="text-lg font-araboto font-semibold text-neutral-950">
          Qual é o tamanho da sua empresa?
        </h2>

        {/* Size slider ------------------------------------------------ */}
        <p className="font-araboto text-lg text-neutral-1000">
          <span className="text-zhex-base-500 font-medium">
            {displaySize.label}
          </span>{' '}
          Pessoas
        </p>

        <Slider.Root
          className="relative flex w-full touch-none select-none items-center h-3 max-w-[600px]"
          min={1}
          max={5}
          step={0.1}
          value={sizeValue}
          onValueChange={handleSizeChange}
          onValueCommit={(v) => handleSizeChange([Math.round(v[0])])}
        >
          <Slider.Track className="relative h-1.5 w-full grow rounded-full bg-neutral-100">
            <Slider.Range className="absolute h-full rounded-full bg-zhex-base-500" />
          </Slider.Track>
          <Slider.Thumb asChild>
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="
                h-6 w-6 rounded-full bg-white border-2 border-zhex-base-500
                focus:outline-none focus:ring-2 focus:ring-zhex-base-300
              "
            />
          </Slider.Thumb>
        </Slider.Root>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Botão de submit */}
      <div className="flex items-center gap-4 mt-8">
        <Button
          size="large"
          loading={isLoading}
          onClick={handleSubmit}
          disabled={isLoading || !selectedCompany}
          variant="primary"
          className="w-[222px]"
        >
          Continuar
        </Button>
      </div>
    </>
  )
}
