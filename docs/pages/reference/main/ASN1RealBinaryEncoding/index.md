---
title: "ASN1RealBinaryEncoding"
---

# ASN1RealBinaryEncoding

_Implements [`ASN1Encodable`](/reference/main/ASN1Encodable)._

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

- [`contents()`](/reference/main/ASN1RealBinaryEncoding/contents)

## Properties

```ts
//$ ASN1Class=/reference/main/ASN1Class
//$ ASN1Form=/reference/main/ASN1Form
//$ RealBinaryEncodingBase=/reference/main/RealBinaryEncodingBase
interface Properties {
	class: $$ASN1Class;
	form: $$ASN1Form;
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
