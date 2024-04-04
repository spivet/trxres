/**
 * 将能量租赁时长统一转换成天，目前时长有3种单位：天、小时、分钟
 * pledgeDay，pledgeHour，pledgeMinute，三者按顺序取第一个不为0的值，转换成天
 */
export function pledgeTimeToDay(pledgeDay: number, pledgeHour: number, pledgeMinute: number): number {
  return pledgeDay || pledgeHour / 24 || pledgeMinute / 1440
}
