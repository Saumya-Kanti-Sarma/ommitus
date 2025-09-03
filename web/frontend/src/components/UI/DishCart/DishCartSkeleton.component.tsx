import React from 'react'

const DishCartSkeleton = ({ length = 7 }) => {
  return (
    Array.from({ length: length }).map((_, i) => (
      <div
        key={i}
        className="bg-[var(--white)] rounded-xl shadow-md overflow-hidden max-w-[320px] w-full animate-pulse max-md:mx-auto max-md:my-0"
      >
        <div className="w-full h-40 bg-[var(--light-gray)]" />
        <div className="p-4 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div className="h-4 w-24 bg-[var(--light-gray)] rounded" />
            <div className="w-3 h-3 bg-[var(--light-gray)] rounded-full" />
          </div>
          <div className="h-3 w-20 bg-[var(--light-gray)] rounded" />
          <div className="flex gap-4">
            <div className="h-3 w-16 bg-[var(--light-gray)] rounded" />
            <div className="h-3 w-16 bg-[var(--light-gray)] rounded" />
          </div>
        </div>
      </div>
    ))
  )
}

export default DishCartSkeleton
