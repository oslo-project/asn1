---
title: "ASN1SpecialReal"
---

# ASN1SpecialReal

_Implements [`ASN1Encodable`](/reference/main/ASN1Encodable)._

Represents an ASN.1 special real value.

## Constructor

```ts
//$ RealDecimalEncodingFormat=/reference/main/RealDecimalEncodingFormat
function constructor(value: $$RealDecimalEncodingFormat): this;
```

### Parameters

- `value`

### Methods

- [`contents()`](/reference/main/ASN1SpecialReal/contents)

## Properties

```ts
//$ ASN1Class=/reference/main/ASN1Class
//$ ASN1Form=/reference/main/ASN1Form
//$ RealDecimalEncodingFormat=/reference/main/RealDecimalEncodingFormat
interface Properties {
	class: $$ASN1Class;
	form: $$ASN1Form;
	tag: number;
	value: $$RealDecimalEncodingFormat;
}
```

- `class`
- `type`
- `tag`
- `value`
