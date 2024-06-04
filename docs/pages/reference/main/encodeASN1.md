---
title: "encodeASN1()"
---

# encodeASN1()

Encodes [`ASN1Value`](/reference/main/ASN1Value) to `Uint8Array` with DER.

**Note that it does not sort items in `ASN1Set` as required in DER.**

## Definition

```ts
function encodeASN1(asn1: ASN1Value): Uint8Array;
```

### Parameters

- `asn1`
