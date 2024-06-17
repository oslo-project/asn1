---
title: "ASN1Encodable"
---

# ASN1Encodable

## Definition

```ts
//$ ASN1Class=/reference/main/ASN1Class
//$ ASN1Form=/reference/main/ASN1Form
interface ASN1Encodable {
	class: $$ASN1Class;
	form: $$ASN1Form;
	tag: number;

	contents(): Uint8Array;
}
```

### Properties

- `class`
- `form`
- `tag`

### Methods

- `contents()`: Returns the encoded contents.
