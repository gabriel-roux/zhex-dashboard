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
import Link from 'next/link'
import { Button } from '../button'

// Mock user accounts data
const userAccounts = [
  {
    id: '1',
    name: 'Rich Brown',
    email: 'richbrown@mail.com',
    avatar: '/avatars/rich-1.jpg',
    isActive: true,
  },
  {
    id: '2',
    name: 'Rich Brown',
    email: 'richardB324@mail.com',
    avatar: '/avatars/rich-2.jpg',
    isActive: false,
  },
]

interface ProfileMenuProps {
  children: ReactNode
}

export function ProfileMenu({ children }: ProfileMenuProps) {
  const [darkMode, setDarkMode] = useState(false)
  const [activeAccountId, setActiveAccountId] = useState('1')
  const [open, setOpen] = useState(false)

  const handleAccountSwitch = (accountId: string) => {
    setActiveAccountId(accountId)
    // TODO: Implementar lógica de troca de conta
  }

  const handleManageAccount = () => {
    // TODO: Implementar gerenciamento de conta
    console.log('Manage account')
  }

  const handleLogout = () => {
    // TODO: Implementar logout
    console.log('Logout')
  }

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        {children}
      </DropdownMenu.Trigger>

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
                    {userAccounts.map((account) => (
                      <button
                        key={account.id}
                        type="button"
                        onClick={() => handleAccountSwitch(account.id)}
                        className={`
                          w-full flex items-center gap-3 p-2.5 rounded-lg transition-all duration-150 group
                          ${account.id === activeAccountId
                            ? 'bg-neutral-50 ring-1 ring-neutral-200'
                            : 'hover:bg-neutral-25'
                          }
                        `}
                      >
                        {/* Avatar */}
                        <div className="relative">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neutral-600 to-neutral-700 flex items-center justify-center text-white font-medium text-sm">
                            {account.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          {account.id === activeAccountId && (
                            <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                              <CheckIcon size={8} className="text-white" weight="bold" />
                            </div>
                          )}
                        </div>

                        {/* Account Info */}
                        <div className="flex-1 text-left">
                          <div className="font-araboto font-medium text-neutral-800 text-sm">
                            {account.name}
                          </div>
                          <div className="text-neutral-400 text-xs mt-0.5">
                            {account.email}
                          </div>
                        </div>

                        {/* Active Indicator */}
                        {account.id === activeAccountId && (
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Add Company Button */}
                  <Link href="/onboarding">
                    <Button
                      variant="ghost"
                      size="full"
                      className="flex items-center justify-center gap-2 !py-2.5 mt-2 border-dashed"
                    >
                      <PlusCircleIcon size={16} />
                      <span className="font-araboto text-sm">
                        Adicionar Empresa
                      </span>
                    </Button>
                  </Link>
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
                  <button
                    type="button"
                    onClick={handleManageAccount}
                    className="w-full flex items-center gap-3 py-2.5 px-1 rounded-lg hover:bg-neutral-25 transition-colors"
                  >
                    <UserGearIcon size={18} className="text-neutral-500" />
                    <span className="text-neutral-700 font-araboto text-sm">
                      Gerenciar Conta
                    </span>
                  </button>

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
