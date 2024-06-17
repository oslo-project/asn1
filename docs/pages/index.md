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
import { parseASN1NoLeftoverBytes } from "@oslojs/asn1";

const encoded = new Uint8Array([0x02, 0x01, 0x01]);
const parsed = parseASN1NoLeftoverBytes(encoded);
const oid = parsed.sequence().at(0).objectIdentifier();
if (!oid.is("1.2.840.10045.4.3.2")) {
	throw new Error("Invalid OID");
}
```

> This library only supports DER and not CER or BER.

## Installation

```
npm i @oslojs/asn1
```
