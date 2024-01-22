function deepCopyFunction(originalFunction) {
  const functionString = originalFunction.toString();
  const clonedFunction = new Function("return " + functionString)();
  return clonedFunction;
}

export const deepClone = (
  obj,
  options = {
    customValueFn: undefined,
    checkSymBolKey: false,
    handleCircular: false,
  },
  hash = undefined
) => {
  // 自訂處理指定型別的 object value
  const callBackResult = options.customValueFn
    ? options.customValueFn(obj)
    : undefined;
  if (options.customValueFn && callBackResult !== "NoCallBackResult")
    return callBackResult;

  if (typeof obj === "function") return deepCopyFunction(obj);
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);

  if (obj === null || typeof obj !== "object") return obj;

  if (hash && hash.get(obj)) return new obj.constructor();

  const newObj = new obj.constructor();

  if (options.handleCircular) {
    hash = hash ?? new Map();
    hash.set(obj, true);
  }

  if (obj instanceof Map) {
    for (const key of obj.keys()) {
      newObj.set(
        key,
        deepClone(
          obj.get(key),
          options,
          options.handleCircular ? new Map(hash) : undefined
        )
      );
    }
  }

  if (obj instanceof Set) {
    for (const item of obj.values()) {
      newObj.add(
        deepClone(
          item,
          options,
          options.handleCircular ? new Map(hash) : undefined
        )
      );
    }
  }

  if (options.checkSymBolKey) {
    const symbolKeys = Object.getOwnPropertySymbols(obj);
    const regularKeys = Object.keys(obj);
    const allKeys = [...regularKeys, ...symbolKeys];
    for (const key of allKeys) {
      newObj[key] = deepClone(
        obj[key],
        options,
        options.handleCircular ? new Map(hash) : undefined
      );
    }
  } else {
    for (const key in obj) {
      if (obj.hasOwnProperty(key))
        newObj[key] = deepClone(
          obj[key],
          options,
          options.handleCircular ? new Map(hash) : undefined
        );
    }
  }

  return newObj;
};
