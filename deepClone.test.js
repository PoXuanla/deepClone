// sum.test.js
import { expect, test } from "vitest";
import { deepClone } from "./deepClone";

test("function references", () => {
  const obj = {
    func: () => "original",
  };
  const clonedObj = deepClone(obj);
  expect(clonedObj.func()).toBe("original");
  expect(clonedObj.func !== obj.func).toBe(true);
});

test("RegExp objects", () => {
  const obj = {
    regex: /test/,
  };
  const clonedObj = deepClone(obj);
  expect(clonedObj.regex instanceof RegExp).toBe(true);
  expect(clonedObj.regex.source).toBe("test");
  expect(clonedObj.regex !== obj.regex).toBe(true);
});

test("symbol properties", () => {
  const symbolKey = Symbol("key");
  const symbolKey2 = Symbol("key2");

  const obj = {
    [symbolKey]: "value",
    [symbolKey2]: {},
  };
  const clonedObj = deepClone(obj, { checkSymBolKey: true });
  expect(clonedObj[symbolKey]).toBe("value");
  expect(clonedObj[symbolKey2] !== obj[symbolKey2]).toBe(true);
});

test("nested arrays", () => {
  const arr = [
    [1, 2, [3, 4]],
    [5, 6],
  ];
  const clonedArr = deepClone(arr);
  expect(clonedArr[0][2][1]).toBe(4);
  expect(clonedArr !== arr).toBe(true);
  expect(clonedArr[0] !== arr[0]).toBe(true);
});

test("nested objects", () => {
  const obj = {
    nested: {
      a: 1,
      b: {
        c: 2,
      },
    },
  };
  const clonedObj = deepClone(obj);
  expect(clonedObj.nested.b.c).toBe(2);
  expect(clonedObj !== obj).toBe(true);
  expect(clonedObj.nested !== obj.nested).toBe(true);
});

test("empty objects and arrays", () => {
  const obj = {
    emptyObj: {},
    emptyArr: [],
  };
  const clonedObj = deepClone(obj);
  expect(clonedObj.emptyObj !== obj.emptyObj).toBe(true);
  expect(clonedObj.emptyArr !== obj.emptyArr).toBe(true);
});

test("Date objects", () => {
  const obj = {
    date: new Date("2022-01-01"),
  };
  const clonedObj = deepClone(obj);
  expect(clonedObj.date instanceof Date).toBe(true);
  expect(clonedObj.date.getTime()).toBe(obj.date.getTime());
  expect(clonedObj.date !== obj.date).toBe(true);
});

test("falsy values", () => {
  const obj = {
    zero: 0,
    emptyString: "",
    isFalse: false,
  };
  const clonedObj = deepClone(obj);
  expect(clonedObj.zero === obj.zero).toBe(true);
  expect(clonedObj.emptyString === obj.emptyString).toBe(true);
  expect(clonedObj.isFalse === obj.isFalse).toBe(true);
});

test("Map and Set with objects", () => {
  const map = new Map();
  map.set({ key: "obj1" }, "value1");
  map.set({ key: "obj2" }, "value2");

  const set = new Set([{ key: "obj1" }, { key: "obj2" }]);

  const clonedMap = deepClone(map);
  const clonedSet = deepClone(set);

  expect(clonedMap.size).toBe(2);
  expect(clonedMap !== map).toBe(true);
  expect(clonedSet.size).toBe(2);
  expect(clonedSet !== set).toBe(true);
});

test("mixed data types", () => {
  const obj = {
    number: 42,
    str: "hello",
    nested: { bool: true, arr: [1, "two", { key: "value" }] },
  };
  const clonedObj = deepClone(obj);

  expect(clonedObj.number).toBe(42);
  expect(clonedObj.str).toBe("hello");
  expect(clonedObj.nested.bool).toBe(true);
  expect(clonedObj.nested.arr[2].key).toBe("value");
  expect(clonedObj !== obj).toBe(true);
  expect(clonedObj.nested !== obj.nested).toBe(true);
  expect(clonedObj.nested.arr[2] !== obj.nested.arr[2]).toBe(true);
});

test("custom value", () => {
  const obj = {
    number: 42,
    str: "hello",
    nested: { bool: true, arr: [1, "two", { key: undefined }] },
  };
  const cb = (value) => {
    if (typeof value === "number") return "number";
    if (value === undefined) return null;

    return "NoCallBackResult";
  };

  const clonedObj = deepClone(obj, { customValueFn: cb });

  expect(clonedObj.number).toBe("number");
  expect(clonedObj.nested.arr[0]).toBe("number");
  expect(clonedObj.nested.arr[2].key).toBe(null);
});

test("circular object", () => {
  const obj = {};
  const obj2 = {
    b: obj,
    c: 30,
  };
  obj.a = obj2;

  const arr = [];
  const arr2 = [arr, 30];
  arr[0] = arr2;

  const clonedObj = deepClone(obj, { handleCircular: true });
  expect(Object.keys(clonedObj.a.b).length).toBe(0);
  expect(clonedObj.a.c).toBe(30);

  const cloneArr = deepClone(arr, { handleCircular: true });
  expect(Array.isArray(cloneArr[0][0])).toBe(true);
  expect(cloneArr[0][0].length).toBe(0);
  expect(cloneArr[0][1]).toBe(30);
});
