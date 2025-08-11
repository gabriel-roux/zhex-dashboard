import { Skeleton } from '@/components/skeleton'
import React from 'react'

export function TransactionDetailsSkeleton() {
  return (
    <div className="w-full">
      {/* Header card */}
      <div className="w-full bg-white rounded-lg py-6 px-5 mb-10 border border-neutral-200">
        {/* Title + description */}
        <div className="mb-2">
          <Skeleton className="h-5 w-56 rounded" />
          <div className="mt-2">
            <Skeleton className="h-4 w-80 rounded" />
          </div>
        </div>

        {/* Top row: Left (title/badge) / Right (buttons) */}
        <div className="w-full mt-4 border border-neutral-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-40 rounded" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-36 rounded-lg" />
              <Skeleton className="h-10 w-28 rounded-lg" />
            </div>
          </div>
          {/* Pills */}
          <div className="flex items-center gap-3 mt-3">
            <Skeleton className="h-7 w-40 rounded-md" />
            <Skeleton className="h-7 w-40 rounded-md" />
            <Skeleton className="h-7 w-56 rounded-md" />
          </div>
        </div>

        {/* 3 cards grid */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-white border border-neutral-200 rounded-lg p-5 h-[257px]">
              <Skeleton className="h-5 w-40 mb-4 rounded" />
              <div className="grid grid-cols-2 gap-y-3">
                {Array.from({ length: 6 }).map((_, j) => (
                  <React.Fragment key={`l-${j}`}>
                    <div className="pr-3"><Skeleton className="h-4 w-24 rounded" /></div>
                    <div className="flex justify-end"><Skeleton className="h-4 w-28 rounded" /></div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Order details */}
        <div className="mt-8">
          <Skeleton className="h-5 w-48 mb-4 rounded" />
          <div className="w-full rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 bg-neutral-50 text-neutral-600 text-sm font-medium px-4 py-3">
              <div className="col-span-5"><Skeleton className="h-4 w-24 rounded" /></div>
              <div className="col-span-2"><Skeleton className="h-4 w-16 rounded" /></div>
              <div className="col-span-2"><Skeleton className="h-4 w-20 rounded" /></div>
              <div className="col-span-2"><Skeleton className="h-4 w-16 rounded" /></div>
              <div className="col-span-1 flex justify-end"><Skeleton className="h-4 w-16 rounded" /></div>
            </div>
            {[0, 1].map((i) => (
              <div key={i} className="grid grid-cols-12 items-center px-4 py-4 border-t border-neutral-100">
                <div className="col-span-5 flex items-center gap-3 min-w-0">
                  <Skeleton className="w-8 h-10 rounded-md" />
                  <Skeleton className="h-4 w-64 rounded" />
                </div>
                <div className="col-span-2"><Skeleton className="h-4 w-20 rounded" /></div>
                <div className="col-span-2"><Skeleton className="h-4 w-10 rounded" /></div>
                <div className="col-span-2"><Skeleton className="h-4 w-16 rounded" /></div>
                <div className="col-span-1 flex justify-end"><Skeleton className="h-4 w-16 rounded" /></div>
              </div>
            ))}

            <div className="px-4 py-4 border-t border-neutral-100">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <Skeleton className="h-4 w-40 rounded" />
                  <Skeleton className="h-4 w-28 rounded" />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-5 w-24 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2 cards grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {[0, 1].map((i) => (
            <div key={i} className="bg-white border border-neutral-200 rounded-lg p-5">
              <Skeleton className="h-5 w-40 mb-4 rounded" />
              <div className="grid grid-cols-2 gap-y-3">
                {Array.from({ length: 6 }).map((_, j) => (
                  <React.Fragment key={`l2-${j}`}>
                    <div className="pr-3"><Skeleton className="h-4 w-28 rounded" /></div>
                    <div className="flex justify-end"><Skeleton className="h-4 w-32 rounded" /></div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
