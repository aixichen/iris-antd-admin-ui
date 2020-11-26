import { OptionType } from './data.d';

export const yesNo: OptionType[] = [
  {
    label: '是',
    value: 1,
  },
  {
    label: '否',
    value: 2,
  },
];

export async function getYesNo() {
  return yesNo;
}
