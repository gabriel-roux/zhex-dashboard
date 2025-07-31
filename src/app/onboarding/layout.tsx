import { UserProps } from '@/@types/user'
import { VerifyTokenWithProgressDto } from '@/@types/onboarding'
import { Header } from '@/components/header'
import { SideBar } from '@/components/sidebar'
import { OnboardingProvider } from '@/contexts/onboarding/provider'

import { cookies } from 'next/headers'
import React from 'react'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Get search params from SSR headers
  const requestUrl = (await cookies()).get('requestUrl')?.value
  const token = requestUrl?.split('token=')[1]

  // Fetch user data and onboarding progress
  let user = {} as UserProps
  let onboardingProgress = null
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/onboarding/verify-token?token=${token?.replace('/onboarding?token=', '')}`)
    const data = await response.json() as VerifyTokenWithProgressDto

    if (data.user?.id) {
      user = data.user
      onboardingProgress = data.onboardingProgress
    }
  } catch (error) {
    console.error(error)
  }

  return (
    <main className="bg-neutral-50 flex flex-1 w-full h-full items-start">
      <SideBar desactived />

      <div className="flex-1 h-full overflow-y-auto">
        <Header desactived />

        <div className="flex flex-col mx-auto px-6 w-full md:max-w-screen-lg 2xl:max-w-screen-xl 3xl:max-w-screen-2xl mt-4">
          <h1 className="text-lg text-neutral-950 font-araboto font-medium">
            Olá, {user.firstName}!
          </h1>

          <p className="text-neutral-500 text-base font-araboto mb-6">
            Parabéns! Crie sua empresa para ter acesso total a nossa plataforma!
          </p>
        </div>

        <OnboardingProvider
          onboardingProgress={onboardingProgress}
          user={user}
          token={token?.replace('/onboarding?token=', '') || ''}
        >
          {children}
        </OnboardingProvider>
      </div>
    </main>
  )
}
