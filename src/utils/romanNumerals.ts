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
 * Convert a comma-separated string of numbers to Roman numerals with ranges
 * Example: "5,6,7" -> "V - VII"
 * Example: "11,12,UG" -> "XI - XII, UG"
 * @param numbersStr - Comma-separated string of numbers and other values (like UG)
 * @returns Formatted string with ranges and Roman numerals
 */
export function convertClassesToRoman(numbersStr: string | null): string | null {
  if (!numbersStr || numbersStr.trim() === '') {
    return null;
  }

  const parts = numbersStr.split(',').map((n) => n.trim()).filter((n) => n !== '');
  const numbers: number[] = [];
  const nonNumbers: string[] = [];

  // Separate numbers and non-numbers (like UG)
  parts.forEach((part) => {
    const num = parseInt(part, 10);
    if (!isNaN(num) && num >= 1 && num <= 12) {
      numbers.push(num);
    } else {
      nonNumbers.push(part);
    }
  });

  // Sort numbers
  numbers.sort((a, b) => a - b);

  const result: string[] = [];

  // Convert consecutive numbers to ranges
  if (numbers.length > 0) {
    let rangeStart = numbers[0];
    let rangeEnd = numbers[0];

    for (let i = 1; i < numbers.length; i++) {
      if (numbers[i] === rangeEnd + 1) {
        // Consecutive number, extend range
        rangeEnd = numbers[i];
      } else {
        // Gap found, output current range and start new one
        if (rangeStart === rangeEnd) {
          result.push(numberToRoman(rangeStart));
        } else {
          result.push(`${numberToRoman(rangeStart)} - ${numberToRoman(rangeEnd)}`);
        }
        rangeStart = numbers[i];
        rangeEnd = numbers[i];
      }
    }

    // Output final range
    if (rangeStart === rangeEnd) {
      result.push(numberToRoman(rangeStart));
    } else {
      result.push(`${numberToRoman(rangeStart)} - ${numberToRoman(rangeEnd)}`);
    }
  }

  // Add non-numeric values (like UG)
  result.push(...nonNumbers);

  return result.length > 0 ? result.join(', ') : null;
}

