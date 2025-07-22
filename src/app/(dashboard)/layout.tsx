import { Header } from '@/components/header'
import { SideBar } from '@/components/sidebar'
import React from 'react'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="bg-neutral-50 flex flex-1 w-full h-full items-start">
      <SideBar />

      <div className="flex-1 h-full overflow-y-auto">
        <Header />

        {children}
      </div>
    </main>
  )
}
