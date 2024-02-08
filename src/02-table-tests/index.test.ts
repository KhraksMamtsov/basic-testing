import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 3, b: 2, action: Action.Subtract, expected: 1 },
  { a: 3, b: 2, action: Action.Multiply, expected: 6 },
  { a: 6, b: 3, action: Action.Divide, expected: 2 },
  { a: 3, b: 2, action: Action.Exponentiate, expected: 9 },
  { a: 3, b: 2, action: 'InvalidAction', expected: null },
  { a: 'a', b: 'b', action: Action.Add, expected: null },
];

describe('simpleCalculator', () => {
  test.each(testCases)('$a $action $b === $expected', (testCase) => {
    const { expected, ...testArguments } = testCase;

    expect(simpleCalculator(testArguments)).toBe(expected);
  });
});
