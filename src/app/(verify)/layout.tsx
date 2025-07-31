import { Header } from '@/components/header'
import { SideBar } from '@/components/sidebar'

import React from 'react'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="bg-neutral-50 flex flex-1 w-full h-full items-start">
      <SideBar desactived />

      <div className="flex-1 h-full overflow-y-auto">
        <Header desactived />

        <div className="flex flex-col mx-auto px-6 w-full md:max-w-screen-lg 2xl:max-w-screen-xl 3xl:max-w-screen-2xl mt-4">
          <h1 className="text-lg text-neutral-950 font-araboto font-medium">
            Olá!
          </h1>

          <p className="text-neutral-500 text-base font-araboto mb-6">
            Estamos verificando seu email...
          </p>
        </div>

        {children}
      </div>
    </main>
  )
}
