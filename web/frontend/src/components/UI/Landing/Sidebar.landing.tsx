"use client"
import { SidebarTypes } from '@/types/Landing.types'
const LandingSideBar = ({ showSideBar }: SidebarTypes) => {

  return (
    <div className={`
      bg-[var(--blue)] h-[calc(100vh-70px)] text-white w-full max-w-[360px] 
      absolute transition-transform duration-300 ease-in-out
      ${showSideBar ? 'translate-x-0' : 'translate-x-[-100%]'}
    `}>
      this is sidebarzzzz
    </div>
  )
}

export default LandingSideBar
