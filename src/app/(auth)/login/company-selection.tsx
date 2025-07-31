'use client'

import { Button } from '@/components/button'
import { CompanyProps } from '@/@types/company'
import * as RadioGroup from '@radix-ui/react-radio-group'
import { motion } from 'framer-motion'
import { CheckIcon } from '@phosphor-icons/react'
import { useState } from 'react'

interface CompanySelectionProps {
  companies: CompanyProps[]
  onCompanySelect: (companyId: string) => void
  onBack: () => void
  isLoading?: boolean
}

export function CompanySelection({
  companies,
  onCompanySelect,
  onBack,
  isLoading = false,
}: CompanySelectionProps) {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('')

  const handleContinue = () => {
    if (selectedCompanyId) {
      onCompanySelect(selectedCompanyId)
    }
  }

  const getCompanyInitial = (name: string) => {
    return name.charAt(0).toUpperCase()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex flex-col gap-4 w-full mt-6"
    >
      <div className="text-left">
        <p className="text-neutral-600 font-araboto">
          Selecione a empresa que você deseja acessar
        </p>
      </div>

      <RadioGroup.Root
        value={selectedCompanyId}
        onValueChange={setSelectedCompanyId}
        className="flex flex-col gap-3"
      >
        {companies.map((company) => (
          <RadioGroup.Item
            key={company.id}
            value={company.id}
            className="group"
          >
            <div
              className={`
                relative flex items-center justify-between gap-4 p-4 rounded-xl border-2 cursor-pointer
                transition-all duration-200 ease-out
                ${selectedCompanyId === company.id
                  ? 'border-zhex-base-500 bg-zhex-base-50/50'
                  : 'border-neutral-200 hover:border-neutral-300 bg-white'
                }
              `}
            >
              {/* Company Avatar */}
              <div className="flex items-center gap-4">
                <div className={`
                w-12 h-12 rounded-full flex items-center justify-center text-lg font-araboto font-semibold border
                ${selectedCompanyId === company.id
                  ? 'bg-gradient-to-br from-zhex-base-500 to-zhex-base-600 text-white border-zhex-base-500'
                  : 'bg-neutral-100/60 border-neutral-200 text-neutral-700'
                }
              `}
                >
                  {getCompanyInitial(company.legalName)}
                </div>

                {/* Company Info */}
                <div className="flex-1">
                  <h3 className="font-araboto text-left font-semibold text-neutral-950 text-base">
                    {company.legalName}
                  </h3>
                  <p className="text-neutral-600 text-sm font-araboto">
                    {company.document} -{' '}
                    {company.type === 'INDIVIDUAL'
                      ? 'Pessoa Física'
                      : 'Pessoa Jurídica'}
                  </p>
                </div>
              </div>

              {/* Radio Button */}
              <div className={`
                w-6 h-6 rounded-full border-2 flex items-center justify-center
                transition-all duration-200
                ${selectedCompanyId === company.id
                  ? 'border-zhex-base-500 bg-zhex-base-500'
                  : 'border-neutral-300 bg-white'
                }
              `}
              >
                {selectedCompanyId === company.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CheckIcon size={12} weight="bold" className="text-white" />
                  </motion.div>
                )}
              </div>
            </div>
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>

      <div className="flex flex-col gap-4 mt-4">
        <Button
          size="full"
          loading={isLoading}
          variant="primary"
          className="py-3"
          disabled={!selectedCompanyId || isLoading}
          onClick={handleContinue}
        >
          Entrar Agora
        </Button>

        <Button
          type="button"
          size="full"
          variant="ghost"
          className="py-3"
          onClick={onBack}
        >
          Voltar
        </Button>
      </div>
    </motion.div>
  )
}
