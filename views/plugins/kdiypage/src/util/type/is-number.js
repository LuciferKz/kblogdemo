import isType from "./is-type";

const isNumber = function (value) {
  return isType(value, "Number");
};

export default isNumber;
