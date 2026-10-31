# Run Length Encoding

Compresses and decompresses text by replacing runs of repeated characters with the character and a count.

## Usage

```js
import { encode, decode } from './src/index.js';

const compressed = encode('aaabbc');   // 'a3b2c'
const original = decode('a3b2c');      // 'aaabbc'
```

## Why

RLE is the simplest compression scheme that still teaches the core tension of the genre: the format has to mark its own boundaries without costing more than the repetition it removes. This library picks the most compact marker — the character itself followed by a bare decimal count with no delimiter — and accepts the consequence that the decoder must greedily consume digits after every character.

## Edge case

Digits are ordinary characters. The string `555` encodes to `53`, which looks like the number fifty-three but is actually `5` (the character) followed by `3` (the count). The decoder reads exactly one character, then all following digits, so this is unambiguous in the codec. It is only confusing to a human reading the compressed form.

## Performance

The window keeps a bounded buffer, so `push` is constant time and memory does not
grow with the length of the stream. `peak` and `trough` are linear in the window
size, which is the trade that keeps `push` cheap.

## Limitations

Values are coerced to floats, so very large integers lose precision. If you need
exact integer aggregates over a window, this is the wrong tool.

## Contributing

Issues and pull requests are welcome. Please keep the dependency list empty —
that constraint is the point of the project, not an oversight.

