import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { encode, decode } from '../src/index.js';

describe('encode', () => {
  it('throws on non-string input', () => {
    assert.throws(() => encode(42), TypeError);
    assert.throws(() => encode(null), TypeError);
  });

  it('returns empty string for empty input', () => {
    assert.equal(encode(''), '');
  });

  it('passes a single character through unchanged', () => {
    assert.equal(encode('a'), 'a');
  });

  it('encodes a run of identical characters', () => {
    assert.equal(encode('aaa'), 'a3');
    assert.equal(encode('aa'), 'a2');
  });

  it('leaves a run of one untouched', () => {
    assert.equal(encode('ab'), 'ab');
  });

  it('encodes mixed runs and singletons', () => {
    assert.equal(encode('aaabbc'), 'a3b2c');
  });

  it('treats digits as ordinary characters', () => {
    assert.equal(encode('555'), '53');
  });

  it('treats newlines as ordinary characters', () => {
    assert.equal(encode('\n\n\n'), '\n3');
  });
});

describe('decode', () => {
  it('throws on non-string input', () => {
    assert.throws(() => decode(42), TypeError);
    assert.throws(() => decode(null), TypeError);
  });

  it('throws on empty input', () => {
    assert.throws(() => decode(''), Error);
  });

  it('decodes a singleton', () => {
    assert.equal(decode('a'), 'a');
  });

  it('decodes a run', () => {
    assert.equal(decode('a3'), 'aaa');
  });

  it('decodes mixed runs and singletons', () => {
    assert.equal(decode('a3b2c'), 'aaabbc');
  });

  it('decodes digit characters correctly', () => {
    assert.equal(decode('53'), '555');
  });

  it('throws on a run count of zero', () => {
    assert.throws(() => decode('a0'), Error);
  });
});

describe('round-trip', () => {
  const cases = [
    'a',
    'aaabbc',
    '555',
    '\n\n\n',
    'no repeats here',
    'aaaaaaaabbbbbbbbccccccccddddddddeeeeeeee',
  ];

  for (const text of cases) {
    it(`round-trips ${JSON.stringify(text)}`, () => {
      assert.equal(decode(encode(text)), text);
    });
  }
});
