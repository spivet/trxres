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

  interface ICheckSubsidyRes {
    totalReceivedLimit: number // 总次数
    remaining: number // 剩余次数
    isReceived: boolean // 今日是否已领取
    monthRemain: number // 用户本月剩余领取次数
    monthLimit: number // 用户每月领取限额
    monthIPRemain: number // 本月当前IP剩余领取次数
    monthIpLimit: number // 每月IP剩余领取次数
  }

  interface IBalanceRes {
    balance: number // 可用 TRX 余额，单位 SUN
    energyTotal: number // 总能量
    energyUsed: number // 已用能量
    bandWidthTotal: number // 总带宽
    bandWidthUsed: number // 已用带宽
  }
}
