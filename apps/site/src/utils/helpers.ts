import { getAddress, isAddress } from '@ethersproject/address';
import {
  complement,
  isEmpty,
  prop,
  when,
  anyPass,
  isNil,
  all,
  test,
  is,
  slice,
  curry,
  ifElse,
  compose,
  has,
  any,
  head,
  take,
  map,
  propSatisfies,
  last,
  reject,
  toString,
  cond,
  T,
  equals,
} from 'ramda';

const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;

export const truncateEthAddress = (address?: string, separator: string = '••••') => {
  if (!address) return '';
  const match = address.match(truncateRegex);
  if (!match) return address;
  return `${match[1]}${separator}${match[2]}`;
};

export const truncateENSAddress = (ensName: string, maxLength: number) => {
  if (ensName.length > maxLength) {
    return ensName.replace('.eth', '').slice(0, maxLength) + '...';
  } else {
    return ensName;
  }
};

export const isNumber = is(Number);
export const isNumberType = (value: unknown): value is number =>
  typeof value === 'number';

export const isString = is(String);

// when an array or string isn’t empty
export const notEmpty = complement(isEmpty);

export const isFalse = equals(false);

export const isEmptyOrNil = anyPass([isEmpty, isNil, isFalse]);

export const notEmptyOrNil = complement(isEmptyOrNil);

export const isValidTxHash = test(/^0x([A-Fa-f0-9]{64})$/g);



export const isAnyTrue = any(Boolean);
export const isAllTrue = all(Boolean);

export const isOdd = (number: number) => {
  return number % 2 === 1;
};


/**
 * @param min - minimum value
 * @param max - maximum value
 * @param percentage - percentage between 0 and 1
 * @returns linear interpolation between min and max
 */
export const lerp = (min: number, max: number, percentage: number): number =>
  min * (1 - percentage) + max * percentage;

/**
 * @param n - number of times to repeat the item
 * @param item - the item to repeat
 * @returns array of repeated items
 */
export function repeat<T>(n: number, item: T): T[] {
  return Array.from({ length: n }, () => item);
}


// export const convertAlchemyAttributes = (
//   attributes: AlchemyNftAttribute[]
// ): AttributeCategory[] => {
//   if (attributes === undefined) return [];
//   return attributes.map((trait) => ({
//     category: trait.trait_type,
//     attributes: [
//       {
//         // toString() because labels such as "true" aren't rendering
//         value: trait.value.toString(),
//         label: trait.value.toString(),
//         count: null,
//       },
//     ],
//   }));
// };

export const getNameOrUsername = ifElse(
  propSatisfies(notEmptyOrNil, 'name'),
  prop('name'),
  prop('username')
);


interface TruncateAddressArgs {
  address: string;
  numberOfChars: number;
}

export const truncateAddress = ({
  address,
  numberOfChars,
}: TruncateAddressArgs): string => truncateStringCenter(numberOfChars, address);

export const truncateStringCenter = curry(
  (count: number, string: string): string =>
    // defensively call the slice function only when it’s a string (vs. a null)
    when(
      isString,
      // add two characters to the first part of the slice to cater for 0x
      (str) => `${slice(0, count + 2, str)}…${slice(-count, Infinity, str)}`,
      string
    )
);