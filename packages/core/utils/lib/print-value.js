'use strict';

// Code copied from the yup library (https://github.com/jquense/yup)
// https://github.com/jquense/yup/blob/2778b88bdacd5260d593c6468793da2e77daf21f/src/util/printValue.ts

const { toString } = Object.prototype;
const errorToString = Error.prototype.toString;
const regExpToString = RegExp.prototype.toString;
const symbolToString = typeof Symbol !== 'undefined' ? Symbol.prototype.toString : () => '';

const SYMBOL_REGEXP = /^Symbol\((.*)\)(.*)$/;

function printNumber(val) {
  if (val != +val) return 'NaN';
  const isNegativeZero = val === 0 && 1 / val < 0;
  return isNegativeZero ? '-0' : `${val}`;
}

function printSimpleValue(val, quoteStrings = false) {
  if (val == null || val === true || val === false) return `${val}`;

  const typeOf = typeof val;
  if (typeOf === 'number') return printNumber(val);
  if (typeOf === 'string') return quoteStrings ? `"${val}"` : val;
  if (typeOf === 'function') return `[Function ${val.name || 'anonymous'}]`;
  if (typeOf === 'symbol') return symbolToString.call(val).replace(SYMBOL_REGEXP, 'Symbol($1)');

  const tag = toString.call(val).slice(8, -1);
  if (tag === 'Date') return Number.isNaN(val.getTime()) ? `${val}` : val.toISOString(val);
  if (tag === 'Error' || val instanceof Error) return `[${errorToString.call(val)}]`;
  if (tag === 'RegExp') return regExpToString.call(val);

  return null;
}

function printValue(value, quoteStrings) {
  const result = printSimpleValue(value, quoteStrings);
  if (result !== null) return result;

  return JSON.stringify(
    value,
    function replacer(key, value) {
      const result = printSimpleValue(this[key], quoteStrings);
      if (result !== null) return result;
      return value;
    },
    2
  );
}

module.exports = printValue;
