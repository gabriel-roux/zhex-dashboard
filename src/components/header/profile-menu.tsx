'use client'

import React, { ReactNode } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { motion, AnimatePresence } from 'framer-motion'
import { Switch } from '@/components/switch'
import {
  SignOutIcon,
  UserGearIcon,
  MoonIcon,
  CheckIcon,
  PlusCircleIcon,
} from '@phosphor-icons/react'
import { useState } from 'react'
import { Button } from '../button'
import { useAuth } from '@/contexts/auth/context'
import { CompanyProps } from '@/@types/company'
import { useApi } from '@/hooks/useApi'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface ProfileMenuProps {
  children: ReactNode
  companies: CompanyProps[]
  desactived?: boolean
}

export function ProfileMenu({ children, companies, desactived = false }: ProfileMenuProps) {
  const [darkMode, setDarkMode] = useState(false)
  const [switchingCompany, setSwitchingCompany] = useState(false)
  const { user, switchCompany } = useAuth()
  const router = useRouter()

  const api = useApi()
  const [open, setOpen] = useState(false)

  const { signOut } = useAuth()

  const activeAccountId = user?.companyId || ''

  const handleAccountSwitch = async (accountId: string) => {
    if (accountId === user?.companyId) return // Já está na empresa selecionada

    try {
      setSwitchingCompany(true)
      const response = await switchCompany(accountId)

      if (response.success) {
        // Fechar o menu
        setOpen(false)
        // Recarregar a página para aplicar as mudanças
        window.location.reload()
      } else {
        console.error('Erro ao trocar empresa:', response.message)
      }
    } catch (error) {
      console.error('Erro ao trocar empresa:', error)
    } finally {
      setSwitchingCompany(false)
    }
  }

  const handleLogout = () => {
    signOut()
    window.location.href = '/login'
  }

  const handleAddCompany = async () => {
    const response = await api.post('/onboarding/create-company-token')
    const { success, onboardingToken } = response.data as { success: boolean, onboardingToken: string }

    if (success) {
      router.push(`/onboarding?token=${onboardingToken}`)
    }
  }

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      {
        desactived
          ? children
          : (
            <DropdownMenu.Trigger asChild>
              {children}
            </DropdownMenu.Trigger>
            )
      }

      <DropdownMenu.Portal>
        <AnimatePresence>
          {open && (
            <DropdownMenu.Content
              className="z-50"
              sideOffset={8}
              align="end"
              asChild
            >
              <motion.div
                className="min-w-[300px] bg-white rounded-2xl border border-neutral-100 shadow-lg overflow-hidden"
                initial={{
                  opacity: 0,
                  y: -4,
                  scale: 0.98,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -4,
                  scale: 0.98,
                }}
                transition={{
                  type: 'spring',
                  duration: 0.15,
                  ease: [0.23, 1, 0.32, 1],
                }}
              >
                {/* Header Section */}
                <div className="px-4 py-3 border-b border-neutral-50">
                  <h3 className="text-neutral-700 font-araboto text-sm font-medium">
                    Trocar Empresa
                  </h3>
                  <p className="text-neutral-400 text-xs mt-0.5">
                    Selecione uma empresa para acessar
                  </p>
                </div>

                {/* Accounts Section */}
                <div className="p-3">
                  <div className="space-y-1">
                    {companies.map((company) => (
                      <button
                        key={company.id}
                        type="button"
                        onClick={() => handleAccountSwitch(company.id)}
                        className={`
                          w-full flex items-center gap-3 p-2.5 rounded-lg transition-all duration-150 group
                          ${company.id === activeAccountId
                            ? 'bg-neutral-50 ring-1 ring-neutral-200'
                            : 'hover:bg-neutral-25'
                          }
                        `}
                      >
                        {/* Avatar */}
                        <div className="relative">
                          {company.avatarUrl
                            ? (
                              <Image
                                src={company.avatarUrl}
                                alt={company.legalName}
                                width={36}
                                height={36}
                                className="rounded-full w-9 h-9 object-cover"
                              />
                              )
                            : (
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neutral-600 to-neutral-700 flex items-center justify-center text-white font-medium text-sm">
                                {company.legalName.split(' ').map(n => n[0]).join('')}
                              </div>
                              )}

                          {company.id === activeAccountId && (
                            <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                              <CheckIcon size={8} className="text-white" weight="bold" />
                            </div>
                          )}
                        </div>

                        {/* Account Info */}
                        <div className="flex-1 text-left">
                          <div className="font-araboto font-medium text-neutral-800 text-sm">
                            {company.legalName}
                          </div>
                          <div className="text-neutral-400 text-xs mt-0.5">
                            {company.document}
                          </div>
                        </div>

                        {/* Active Indicator */}
                        {company.id === activeAccountId && (
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        )}
                        {switchingCompany && company.id !== activeAccountId && (
                          <div className="w-4 h-4 border-2 border-neutral-300 border-t-zhex-base-500 rounded-full animate-spin" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Add Company Button */}
                  <Button
                    variant="ghost"
                    size="full"
                    className="flex items-center justify-center gap-2 !py-2.5 mt-2 border-dashed"
                    onClick={handleAddCompany}
                  >
                    <PlusCircleIcon size={16} />
                    <span className="font-araboto text-sm">
                      Adicionar Empresa
                    </span>
                  </Button>
                </div>

                {/* Divider */}
                <div className="h-px bg-neutral-100" />

                {/* Settings Section */}
                <div className="p-3">
                  {/* Dark Mode */}
                  <div className="flex items-center justify-between py-2.5 px-1">
                    <div className="flex items-center gap-3">
                      <MoonIcon size={18} className="text-neutral-500" />
                      <span className="text-neutral-700 font-araboto text-sm">
                        Dark Mode
                      </span>
                    </div>
                    <Switch active={darkMode} setValue={setDarkMode} />
                  </div>

                  {/* Manage Account */}
                  <Link
                    href="/my-account"
                    onClick={() => setOpen(false)}
                    className="w-full flex items-center gap-3 py-2.5 px-1 rounded-lg hover:bg-neutral-25 transition-colors"
                  >
                    <UserGearIcon size={18} className="text-neutral-500" />
                    <span className="text-neutral-700 font-araboto text-sm">
                      Gerenciar Conta
                    </span>
                  </Link>

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 py-2.5 px-1 rounded-lg hover:bg-red-25 hover:text-red-600 transition-colors group"
                  >
                    <SignOutIcon size={18} className="text-neutral-500 group-hover:text-red-500" />
                    <span className="text-neutral-700 font-araboto text-sm group-hover:text-red-600">
                      Sair
                    </span>
                  </button>
                </div>

                <DropdownMenu.Arrow className="fill-white" />
              </motion.div>
            </DropdownMenu.Content>
          )}
        </AnimatePresence>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
