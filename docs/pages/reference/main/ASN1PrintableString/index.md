---
title: "ASN1PrintableString"
---

# ASN1PrintableString

_Implements [`ASN1Encodable`](/reference/main/ASN1Encodable)._

Represents an ASN.1 printable string value.

## Constructor

```ts
function constructor(value: Uint8Array): this;
```

### Parameters

- `value`

### Methods

- [`decodeText()`](/reference/main/ASN1PrintableString/decodeText)
- [`contents()`](/reference/main/ASN1PrintableString/contents)

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
