---
title: "ASN1RealDecimalEncoding"
---

# ASN1RealDecimalEncoding

_Implements [`ASN1Encodable`](/reference/main/ASN1Encodable)._

Represents an ASN.1 real value with decimal encoding.

## Constructor

```ts
//$ RealDecimalEncodingFormat=/reference/main/RealDecimalEncodingFormat
function constructor(encodingFormat: $$RealDecimalEncodingFormat, value: Uint8Array): this;
```

### Parameters

- `encodingFormat`
- `value`

### Methods

- [`contents()`](/reference/main/ASN1RealDecimalEncoding/contents)

## Properties

```ts
//$ ASN1Class=/reference/main/ASN1Class
//$ ASN1Form=/reference/main/ASN1Form
//$ RealDecimalEncodingFormat=/reference/main/RealDecimalEncodingFormat
interface Properties {
	class: $$ASN1Class;
	form: $$ASN1Form;
	encodingFormat: $$RealDecimalEncodingFormat;
	value: Uint8Array;
}
```

- `class`
- `type`
- `tag`
- `value`
