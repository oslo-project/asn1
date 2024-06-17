---
title: "ASN1ObjectIdentifier"
---

# ASN1ObjectIdentifier

_Implements [`ASN1Encodable`](/reference/main/ASN1Encodable)._

Represents an ASN.1 object identifier value.

See [`encodeObjectIdentifier()`](/reference/main/encodeObjectIdentifier) to encode object identifiers.

## Constructor

```ts
function constructor(encoded: Uint8Array): this;
```

### Parameters

- `encoded`: The encoded object identifier.

### Methods

- [`contents()`](/reference/main/ASN1ObjectIdentifier/contents)
- [`is()`](/reference/main/ASN1ObjectIdentifier/is)

## Properties

```ts
//$ ASN1Class=/reference/main/ASN1Class
//$ ASN1Form=/reference/main/ASN1Form
interface Properties {
	class: $$ASN1Class;
	form: $$ASN1Form;
	tag: number;
	encoded: Uint8Array;
}
```

- `class`
- `type`
- `tag`
- `encoded`: The encoded object identifier.
