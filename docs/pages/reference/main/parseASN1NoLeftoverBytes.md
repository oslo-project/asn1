---
title: "parseASN1NoLeftoverBytes()"
---

# parseASN1NoLeftoverBytes()

Parses an ASN.1-encoded data and returns an [`ASN1Value`](/reference/main/ASN1Value). See [`parseASN1()`](/reference/main/decodeASN1) for details on errors and behavior.

In addition to errors thrown by `parseASN1()`, it will also throw [`ASN1LeftoverBytesError`](/reference/main/ASN1LeftoverBytesError) if there are any leftover bytes.

## Definition

```ts
//$ ASN1Value=/reference/main/ASN1Value
function parseASN1NoLeftoverBytes(data: Uint8Array): $$ASN1Value;
```

### Parameters

- `data`
