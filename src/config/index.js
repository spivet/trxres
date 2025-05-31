export const rentalTimeList = [
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
