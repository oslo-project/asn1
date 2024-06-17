---
title: "ASN1BitString"
---

# ASN1BitString

_Implements [`ASN1Encodable`](/reference/main/ASN1Encodable)._

Represents an ASN.1 bit string value.

## Constructor

```ts
function constructor(bytes: Uint8Array, length: number): this;
```

### Parameters

- `bytes`: The bit string as bytes
- `length`: The size of the string in bits

### Methods

- [`contents()`](/reference/main/ASN1BitString/contents)

## Properties

```ts
//$ ASN1Class=/reference/main/ASN1Class
//$ ASN1Form=/reference/main/ASN1Form
interface Properties {
	class: $$ASN1Class;
	form: $$ASN1Form;
	tag: number;
	bytes: Uint8Array;
	length: number;
}
```

- `class`
- `type`
- `tag`
- `bytes`
- `length`
