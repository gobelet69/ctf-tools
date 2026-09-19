# CTF Tools

A lightweight, privacy-first collection of browser-based tools for Capture The Flag challenges.

Live site: [https://ctf.111iridescence.org](https://ctf.111iridescence.org)

The project contains **101 tools** across areas such as:
- Encoding
- Cryptography
- XOR
- Hashes
- RSA / Modular Arithmetic
- JWT
- Web
- Forensics
- Steganography
- Networking
- Binary / Reversing
- Text
- PCAP
- ZIP inspection
- QR
- CTF Workbench

## Core Philosophy

- static website
- native HTML
- vanilla JavaScript
- minimal CSS
- no frontend framework
- no backend
- local processing
- no tracking
- no analytics
- no runtime CDN
- native browser APIs preferred
- dependencies hosted locally
- lightweight homepage

101 tools implemented
101 browser-tested
0 planned

*(Note: some specialized binary/file tools were validated primarily for load stability and parser behavior rather than exhaustive semantic correctness.)*

## Feature Highlights

- **CTF Workbench pipeline:** Chain operations together (e.g. Hex Decode → Base64 Decode → ROT13).
- **XOR toolkit:** Single-byte brute force, repeating-key, and known-plaintext XOR helpers.
- **RSA/modular arithmetic helpers:** Compute modular inverse, CRT, and RSA parameters entirely client-side using `BigInt`.
- **PCAP viewer:** Lightweight native triage parser.
- **ZIP inspector:** Safely inspect the central directory and CRC checksums without decompression.
- **Hex viewer:** Fast paginated hex dump.
- **Strings extractor:** Extract printable ASCII from binary files.
- **Entropy analysis:** Calculate Shannon entropy.
- **Steganography tools:** Bit planes, LSB extraction, and channel separation.
- **ELF/PE triage:** Rapid header inspection.
- **Packet decoder:** Decode manual hex packet dumps.
- **What Is This?:** Heuristic auto-detection for encoded strings.
- **JWT decoder:** Local JWT inspection.
- **Hidden Unicode character viewer:** Detect Zero-Width Spaces and confusables.

## Privacy

- pasted challenge data is processed locally
- uploaded files stay in the browser
- no backend upload
- no account
- no analytics
- `localStorage` is only used for favorites, recents, scratchpad and similar local preferences

## Security

- no `eval()`
- no `new Function()`
- user-controlled data is rendered safely through `textContent`, `createElement`, and `value`
- binary parsers apply bounds checks
- ZIP inspector does not decompress archive contents to prevent ZIP bombs
- PCAP parser limits packet processing to prevent infinite loops
- Canvas image tools reject oversized images to prevent memory exhaustion
- *Files are still untrusted input and malformed data may produce errors.*
