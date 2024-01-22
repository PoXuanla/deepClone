import { deepClone } from "./deepClone.js";
const createDeepNestedObject = (depth, fieldsPerLevel) => {
  if (depth === 0) {
    return null;
  }

  const obj = {};
  for (let i = 0; i < fieldsPerLevel; i++) {
    const fieldName = `field${i}`;
    const nestedObject = createDeepNestedObject(depth - 1, fieldsPerLevel);
    obj[fieldName] = nestedObject !== null ? nestedObject : `value${i}`;
  }

  return obj;
};

const TestCase = [
  createDeepNestedObject(1, 7),
  createDeepNestedObject(2, 7),
  createDeepNestedObject(3, 7),
  createDeepNestedObject(4, 7),
  createDeepNestedObject(5, 7),
  createDeepNestedObject(6, 7),
  createDeepNestedObject(7, 7),
  createDeepNestedObject(8, 7),

];

TestCase.forEach((e) => {
  console.time("deepClone");
  deepClone(
    e,  
    { symBolKey: false }
  );
  console.timeEnd("deepClone");

  console.time("JSON");
  JSON.parse(JSON.stringify(e));
  console.timeEnd("JSON");
});
