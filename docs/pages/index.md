---
title: "@oslojs/asn1 documentation"
---

# @oslojs/asn1

**This package is highly experimental!**

A JavaScript library for encoding and decoding ASN.1 with Distinguished Encoding Rules (DER) by [Oslo](https://oslojs.dev).

- Runtime-agnostic
- No third-party dependencies
- Fully typed

```ts
import { decodeASN1NoLeftoverBytes, ASN1Integer } from "@oslojs/asn1";

const MAX_DEPTH = 10;
const encoded = new Uint8Array([0x02, 0x01, 0x01]);
const result = decodeASN1NoLeftoverBytes(encoded, MAX_DEPTH);
if (result instanceof ASN1Integer) {
	const value: bigint = result.value;
}
```

> This library only supports DER and not CER or BER.

## Installation

```
npm i @oslojs/asn1
```
