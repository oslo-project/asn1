---
title: "ASN1Value"
---

# ASN1Value

## Definition

```ts
//$ ASN1Class=/reference/main/ASN1Class
//$ ASN1EncodingType=/reference/main/ASN1EncodingType
interface ASN1Value {
	class: $$ASN1Class;
	type: $$ASN1EncodingType;
	tag: number;

	encodeContents(): Uint8Array;
}
```

### Properties

- `class`
- `type`
- `tag`

### Methods

- `encodeContents()`: Encodes the contents.
