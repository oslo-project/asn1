---
title: "parseASN1()"
---

# parseASN1()

Parses an ASN.1-encoded data and returns an [`ASN1Value`](/reference/main/ASN1Value) and the number of bytes decoded. Use [`parseASN1NoLeftoverBytes()`](/reference/main/parseASN1NoLeftoverBytes) if you don't expect any leftover bytes.

It can throw [`ASN1ParseError`](/reference/main/ASN1ParseError) if the data is invalid.

Implementations may not strictly adhere to DER and it may accept BER-valid but DER-invalid values.

## Definition

```ts
//$ ASN1Value=/reference/main/ASN1Value
function parseASN1(data: Uint8Array): [data: $$ASN1Value, size: number];
```

### Parameters

- `data`
