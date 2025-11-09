"use client"
import { SidebarTypes } from '@/types/Landing.types'
const LandingSideBar = ({ showSideBar }: SidebarTypes) => {

  return (
    <div className={`
      bg-[#131313] h-[calc(100vh-70px)] text-white w-full max-w-[360px] 
      absolute transition-transform duration-300 ease-in-out
      ${showSideBar ? 'translate-x-0' : 'translate-x-[-100%]'}
    `}>
      <ul className='flex flex-col justify-between items-center gap-1.5 h-[90%] mt-[10px]'>
        {['Features', 'About', 'Pricing', 'FAQs', 'Login',].map((item, index) => (
          <li key={index} className='text-[18px] font-medium'>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default LandingSideBar
