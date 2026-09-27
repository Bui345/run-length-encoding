/**
 * Core Run Length Encoding logic.
 *
 * Format: a run of N identical characters (N >= 2) is encoded as the
 * character followed by the decimal count. A lone character is emitted
 * verbatim. Decompression reverses this by reading a character and then as
 * many following digits as are present.
 *
 * The format is deliberately line-oriented-agnostic: newlines are treated
 * as ordinary characters so that '\n\n\n' encodes to '\n3'. This keeps the
 * codec a pure byte/char stream and avoids special cases in callers.
 */

/**
 * Encode a string using run length encoding.
 *
 * Runs of two or more of the same character are replaced by the character
 * followed by its decimal count. Single characters pass through unchanged.
 *
 * Because digits are themselves valid characters, a run of digits like
 * '555' encodes to '53'. The decoder reads one character then greedily
 * consumes digits, so '53' unambiguously decodes back to '555' — the '5'
 * is the character and '3' is the count. This works because the character
 * slot is always exactly one char.
 *
 * @param {string} input - The text to compress.
 * @returns {string} The compressed text.
 * @throws {TypeError} If input is not a string.
 */
export function encode(input) {
  if (typeof input !== 'string') {
    throw new TypeError(`encode expected a string, got ${typeof input}`);
  }
  if (input.length === 0) {
    return '';
  }

  let out = '';
  let i = 0;
  const len = input.length;
  while (i < len) {
    const ch = input[i];
    let count = 1;
    while (i + count < len && input[i + count] === ch) {
      count++;
    }
    if (count >= 2) {
      out += ch + String(count);
    } else {
      out += ch;
    }
    i += count;
  }
  return out;
}

/**
 * Decode a string produced by {@link encode}.
 *
 * Reads one character, then consumes any following ASCII digits as the run
 * count. If no digits follow, the character is a singleton.
 *
 * @param {string} input - The compressed text.
 * @returns {string} The original uncompressed text.
 * @throws {TypeError} If input is not a string.
 * @throws {Error} If the input is malformed (empty string, or a count of
 *   zero, or a count that overflows the safe integer range).
 */
export function decode(input) {
  if (typeof input !== 'string') {
    throw new TypeError(`decode expected a string, got ${typeof input}`);
  }
  if (input.length === 0) {
    throw new Error('decode: input is empty');
  }

  let out = '';
  let i = 0;
  const len = input.length;
  while (i < len) {
    const ch = input[i];
    i++;

    let digits = '';
    while (i < len && input[i] >= '0' && input[i] <= '9') {
      digits += input[i];
      i++;
    }

    if (digits === '') {
      out += ch;
    } else {
      const count = Number(digits);
      if (!Number.isSafeInteger(count) || count < 1) {
        throw new Error(`decode: invalid run count '${digits}'`);
      }
      out += ch.repeat(count);
    }
  }
  return out;
}
