---
title: "decodeASN1NoLeftoverBytes()"
---

# decodeASN1NoLeftoverBytes()

Decodes an ASN.1-encoded data and returns the decoded value as [`ASN1Value`](/reference/main/ASN1Value) (e.g. `ASN1Integer`). See [`decodeASN1()`](/reference/main/decodeASN1) for details on errors and behavior.

In addition to errors thrown by `decodeASN1()`, it will also throw [`ASN1LeftoverBytesError`](/reference/main/ASN1LeftoverBytesError) if there are any leftover bytes.

## Definition

```ts
//$ ASN1Value=/reference/main/ASN1Value
function decodeASN1NoLeftoverBytes(data: Uint8Array, maxDepth: number): $$ASN1Value;
```

### Parameters

- `data`
- `maxDepth`: How much nesting is allowed
