---
title: "ASN1SpecialReal"
---

# ASN1SpecialReal

_Implements [`ASN1Value`](/reference/main/ASN1Value)._

Represents an ASN.1 special real value.

## Constructor

```ts
//$ RealDecimalEncodingFormat=/reference/main/RealDecimalEncodingFormat
function constructor(value: $$RealDecimalEncodingFormat): this;
```

### Parameters

- `value`

### Methods

- [`encodeContents()`](/reference/main/ASN1SpecialReal/encodeContents)

## Properties

```ts
//$ ASN1Class=/reference/main/ASN1Class
//$ ASN1EncodingType=/reference/main/ASN1EncodingType
//$ RealDecimalEncodingFormat=/reference/main/RealDecimalEncodingFormat
interface Properties {
	class: $$ASN1Class;
	type: $$ASN1EncodingType;
	tag: number;
	value: $$RealDecimalEncodingFormat;
}
```

- `class`
- `type`
- `tag`
- `value`
