declare namespace API {
  interface IConfigRes {
    burnEnergy: number
    burnNet: number
    defaultEnergyPrice: number
    leftEnergy: number
    lowEnergyFee: number
    lowEnergyLimit: number
    pledgeEnergy: number
    pledgeNet: number
    price: number
    sun_10m: number
    sun_1d: number
    sun_1h: number
    sun_2d: number
    sun_3h: number
    treasureType: {
      type: 'transfer' | 'notUtransfer' | 'exchange'
      value: number
    }[]
  }
}
