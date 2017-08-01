/* eslint-disable no-use-before-define */
import {
  isDate,
  isNumber,
  isString,
  isPlainObject,
  isFunction,
  get,
} from 'lodash';
import {isMatch} from 'micromatch';

function coerce(rule, val) {
  if (isNumber(val)) {
    return Number(rule);
  }
  if (isDate(val)) {
    return new Date(rule).getTime();
  }
  return rule;
}

function toCompare(val) {
  if (isDate(val)) {
    return val.getTime();
  }
  return val;
}

const OPS = {
  $and: (rules, values) => check(rules, values, true),
  $or: (rules, values) => check(rules, values, false),
  $not: (rules, values) => !check(rules, values, true),
  $gte: (rule, val) => toCompare(val) >= coerce(rule, val),
  $gt: (rule, val) => toCompare(val) > coerce(rule, val),
  $lt: (rule, val) => toCompare(val) < coerce(rule, val),
  $lte: (rule, val) => toCompare(val) <= coerce(rule, val),
  $eq: (rule, val) => coerce(rule, val) === toCompare(val),
  $like: (rule, val) => isString(rule) && isString(val) &&
    isMatch(val.toLowerCase(), rule.toLowerCase().replace(/%/g, '*')),
  $includes: (rule, val) => (Array.isArray(val) ? val.includes(rule) : [val].includes(rule)),
  $oneOf: (rule, val) => rule.includes(val),
  $ne: (rule, val) => coerce(rule, val) !== val,
};

function op(key, rule, value) {
  return OPS[key](rule, value);
}

function isOp(key) {
  return OPS[key];
}

function check(rules, values, and = true) {
  if (isFunction(rules)) {
    return rules(values);
  }
  if (isFunction(values)) {
    return check(rules, values(rules), and);
  }
  const method = and ? 'every' : 'some';
  if (Array.isArray(rules)) {
    return rules[method](rule => check(rule, values));
  }
  if (!isPlainObject(rules)) {
    return op('$eq', rules, values);
  }
  return Object.keys(rules)[method]((key) => {
    if (isOp(key)) {
      return op(key, rules[key], values);
    }
    if (get(values, key)) {
      return check(rules[key], get(values, key));
    }
    return false;
  });
}

export default function conditions(rules) {
  return values => check(rules, values);
}
