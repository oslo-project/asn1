---
title: "decodeASN1()"
---

# decodeASN1()

Decodes an ASN.1-encoded data and returns the decoded values as [`ASN1Value`](/reference/main/ASN1Value) (e.g. `ASN1Integer`) and the number of bytes decoded. Use [`decodeASN1NoLeftoverBytes()`](/reference/main/decodeASN1NoLeftoverBytes) if you don't expect any leftover bytes.

Supported universal values are decoded as:

- [`ASN1BitString`](/reference/main/ASN1BitString)
- [`ASN1Boolean`](/reference/main/ASN1Boolean)
- [`ASN1Enumerated`](/reference/main/ASN1Enumerated)
- [`ASN1GeneralizedTime`](/reference/main/ASN1GeneralizedTime)
- [`ASN1IA5String`](/reference/main/ASN1IA5String)
- [`ASN1Integer`](/reference/main/ASN1Integer)
- [`ASN1Null`](/reference/main/ASN1Null)
- [`ASN1NumericString`](/reference/main/ASN1NumericString)
- [`ASN1ObjectIdentifier`](/reference/main/ASN1ObjectIdentifier)
- [`ASN1OctetString`](/reference/main/ASN1OctetString)
- [`ASN1PrintableString`](/reference/main/ASN1PrintableString)
- [`ASN1RealBinaryEncoding`](/reference/main/ASN1RealBinaryEncoding)
- [`ASN1RealDecimalEncoding`](/reference/main/ASN1RealDecimalEncoding)
- [`ASN1RealZero`](/reference/main/ASN1RealZero)
- [`ASN1Sequence`](/reference/main/ASN1Sequence)
- [`ASN1Set`](/reference/main/ASN1Set)
- [`ASN1SpecialReal`](/reference/main/ASN1SpecialReal)
- [`ASN1UTCTime`](/reference/main/ASN1UTCTime)
- [`ASN1UTF8String`](/reference/main/ASN1UTF8String)

All other values are decoded as [`ASN1EncodedValue`](/reference/main/ASN1EncodedValue)

It can throw one of:

- [`ASN1InvalidError`](/reference/main/ASN1InvalidError): Invalid ASN.1 DER
- [`ASN1TooDeepError`](/reference/main/CBORTooDeepError): The ASN.1 data is too deep

Implementations may not strictly adhere to DER and this function may accept BER-encoded values.

## Definition

```ts
//$ ASN1Value=/reference/main/ASN1Value
function decodeASN1(data: Uint8Array, maxDepth: number): [data: $$ASN1Value, size: number];
```

### Parameters

- `data`
- `maxDepth`: How much nesting is allowed
