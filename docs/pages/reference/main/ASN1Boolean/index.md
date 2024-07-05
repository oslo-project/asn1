---
title: "ASN1Boolean"
---

# ASN1Boolean

_Implements [`ASN1Encodable`](/reference/main/ASN1Encodable)._

Represents an ASN.1 boolean value.

## Constructor

```ts
function constructor(value: boolean): this;
```

### Parameters

- `value`

### Methods

- [`contents()`](/reference/main/ASN1Boolean/contents)

## Properties

```ts
//$ ASN1Class=/reference/main/ASN1Class
//$ ASN1Form=/reference/main/ASN1Form
interface Properties {
	class: $$ASN1Class;
	form: $$ASN1Form;
	tag: number;
	value: boolean;
}
```

- `class`
- `type`
- `tag`
- `value`
