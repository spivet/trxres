import type { Eruda } from 'eruda'
import { ref } from 'vue'

function useEruda(times: number) {
  let eruda: Eruda | null = null
  const hackCount = ref(0)

  async function toggleEruda() {
    if (!eruda) {
      const res = await import('eruda')
      eruda = res.default
    }
    if (hackCount.value < times) {
      hackCount.value++
      if (hackCount.value >= times)
        eruda.init()
    }
    else {
      hackCount.value = 0
      eruda.destroy()
    }
  }

  return {
    toggleEruda,
  }
}

export default useEruda
