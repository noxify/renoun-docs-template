import { create } from "zustand"

interface SidebarStore {
  showSidebar: boolean
  toggleSidebar: () => void
  setSidebar: (value: boolean) => void
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  showSidebar: true,
  toggleSidebar: () => set((state) => ({ showSidebar: !state.showSidebar })),
  setSidebar: (value) => set(() => ({ showSidebar: value })),
}))
