---
title: "ASN1IA5String"
---

# ASN1IA5String

_Implements [`ASN1Encodable`](/reference/main/ASN1Encodable)._

Represents an ASN.1 IA5 string (ASCII) value.

## Constructor

```ts
function constructor(value: Uint8Array): this;
```

### Parameters

- `value`

### Methods

- [`decodeText()`](/reference/main/ASN1IA5String/decodeText)
- [`contents()`](/reference/main/ASN1IA5String/contents)

## Properties

```ts
//$ ASN1Class=/reference/main/ASN1Class
//$ ASN1Form=/reference/main/ASN1Form
interface Properties {
	class: $$ASN1Class;
	form: $$ASN1Form;
	tag: number;
	value: Uint8Array;
}
```

- `class`
- `type`
- `tag`
- `value`
