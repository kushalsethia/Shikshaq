/**
 * Convert a number to its Roman numeral representation
 * @param num - The number to convert (1-12 for class numbers)
 * @returns The Roman numeral string (I, II, III, IV, V, VI, VII, VIII, IX, X, XI, XII)
 */
export function numberToRoman(num: number): string {
  const romanMap: Record<number, string> = {
    1: 'I',
    2: 'II',
    3: 'III',
    4: 'IV',
    5: 'V',
    6: 'VI',
    7: 'VII',
    8: 'VIII',
    9: 'IX',
    10: 'X',
    11: 'XI',
    12: 'XII',
  };

  return romanMap[num] || num.toString();
}

/**
 * Convert a comma-separated string of numbers to Roman numerals
 * Example: "1,2,3" -> "I, II, III"
 * @param numbersStr - Comma-separated string of numbers
 * @returns Comma-separated string of Roman numerals
 */
export function convertClassesToRoman(numbersStr: string | null): string | null {
  if (!numbersStr || numbersStr.trim() === '') {
    return null;
  }

  const numbers = numbersStr
    .split(',')
    .map((n) => parseInt(n.trim(), 10))
    .filter((n) => !isNaN(n) && n >= 1 && n <= 12)
    .sort((a, b) => a - b); // Sort ascending

  if (numbers.length === 0) {
    return null;
  }

  const romanNumerals = numbers.map((num) => numberToRoman(num));
  return romanNumerals.join(', ');
}

