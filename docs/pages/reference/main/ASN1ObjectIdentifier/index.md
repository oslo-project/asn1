---
title: "ASN1ObjectIdentifier"
---

# ASN1ObjectIdentifier

_Implements [`ASN1Value`](/reference/main/ASN1Value)._

Represents an ASN.1 object identifier value.

See [`encodeObjectIdentifier()`](/reference/main/encodeObjectIdentifier) to encode object identifiers.

## Constructor

```ts
function constructor(encodedIdentifier: Uint8Array): this;
```

### Parameters

- `encodedIdentifier`: The encoded object identifier.

### Methods

- [`encodeContents()`](/reference/main/ASN1ObjectIdentifier/encodeContents)

## Properties

```ts
//$ ASN1Class=/reference/main/ASN1Class
//$ ASN1EncodingType=/reference/main/ASN1EncodingType
interface Properties {
	class: $$ASN1Class;
	type: $$ASN1EncodingType;
	tag: number;
	encodedId: Uint8Array;
}
```

- `class`
- `type`
- `tag`
- `encodedId`: The encoded object identifier.
