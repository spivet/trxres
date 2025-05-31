import { storeToRefs } from 'pinia'
import useConfigStore from '@/store/config'

function useRentalTime() {
  const { config } = storeToRefs(useConfigStore())

  const rentalTimeList = [
    {
      label: 'm10',
      value: 'm10',
    },
    {
      label: 'h1',
      value: 'h1',
    },
    {
      label: 'h3',
      value: 'h3',
    },
    {
      label: 'day1',
      value: 'day1',
      time: 1,
    },
    ...Array.from({ length: 29 }, (_, i) => ({
      label: `day${i + 2}`,
      value: `day${i + 2}`,
      time: i + 2,
    })),
  ]

  function getUnitPrice(u: string, t = 1) {
    let priceSun = 0
    let time = 1

    switch (u) {
      case 'm10':
        priceSun = config.value.sun_10m || 0
        break
      case 'h1':
        priceSun = config.value.sun_1h || 0
        break
      case 'h3':
        priceSun = config.value.sun_3h || 0
        break
      case 'day1':
        priceSun = config.value.sun_1d || 0
        break
      case 'day2':
        priceSun = config.value.sun_2d || 0
        time = 2
        break
      // day3及以后的价格
      default:
        priceSun = config.value.defaultEnergyPrice || 0
        time = t
    }

    return {
      priceSun,
    }
  }

  return {
    getUnitPrice,
    rentalTimeList,
  }
}

export default useRentalTime
