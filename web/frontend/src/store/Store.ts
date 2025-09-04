import { create } from 'zustand'
import { DropdownStateTypes } from '@/types/Store.types';


export const useDropdown = create<DropdownStateTypes>((set) => ({
  dropdown: false,
  toggleDropdown: () => set((state) => ({ dropdown: state.dropdown == true ? false : true })),
  hideDropdown: () => set(() => ({ dropdown: false })),
}))