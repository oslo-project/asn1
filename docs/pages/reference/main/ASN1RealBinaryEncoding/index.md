---
title: "ASN1RealBinaryEncoding"
---

# ASN1RealBinaryEncoding

_Implements [`ASN1Value`](/reference/main/ASN1Value)._

Represents an ASN.1 real value with binary encoding.

## Constructor

```ts
//$ RealBinaryEncodingBase=/reference/main/RealBinaryEncodingBase
function constructor(mantissa: bigint, base: $$RealBinaryEncodingBase, exponent: bigint): this;
```

### Parameters

- `mantissa`
- `base`
- `exponent`

### Methods

- [`encodeContents()`](/reference/main/ASN1RealBinaryEncoding/encodeContents)

## Properties

```ts
//$ ASN1Class=/reference/main/ASN1Class
//$ ASN1EncodingType=/reference/main/ASN1EncodingType
//$ RealBinaryEncodingBase=/reference/main/RealBinaryEncodingBase
interface Properties {
	class: $$ASN1Class;
	type: $$ASN1EncodingType;
	mantissa: bigint;
	base: $$RealBinaryEncodingBase;
	exponent: bigint;
}
```

- `class`
- `type`
- `tag`
- `mantissa`
- `base`
- `exponent`
