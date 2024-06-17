---
title: "ASN1Value"
---

# ASN1Value

_Implements [`ASN1Encodable`](/reference/main/ASN1Encodable)._

Represents an ASN.1 value with encoded contents.

## Constructor

```ts
//$ ASN1Class=/reference/main/ASN1Class
//$ ASN1Form=/reference/main/ASN1Form
function constructor(
	asn1Class: $$ASN1Class,
	form: $$ASN1Form,
	tag: number,
	contents: Uint8Array
): this;
```

### Parameters

- `asn1Class`
- `form`
- `tag`
- `contents`

### Methods

- [`bitString()`](/reference/main/bitString)
- [`boolean()`](/reference/main/boolean)
- [`contents()`](/reference/main/ASN1Boolean/contents)
- [`enumerated()`](/reference/main/enumerated)
- [`generalizedTime()`](/reference/main/generalizedTime)
- [`ia5String()`](/reference/main/ia5String)
- [`integer()`](/reference/main/integer)
- [`null()`](/reference/main/null)
- [`numericString()`](/reference/main/numericString)
- [`objectIdentifier()`](/reference/main/objectIdentifier)
- [`octetString()`](/reference/main/octetString)
- [`printableString()`](/reference/main/printableString)
- [`real()`](/reference/main/real)
- [`sequence()`](/reference/main/sequence)
- [`set()`](/reference/main/set)
- [`utcTime()`](/reference/main/utcTime)
- [`utf8String()`](/reference/main/utf8String)

## Properties

```ts
//$ ASN1Class=/reference/main/ASN1Class
//$ ASN1Form=/reference/main/ASN1Form
interface Properties {
	class: $$ASN1Class;
	form: $$ASN1Form;
	tag: number;
}
```

- `class`
- `form`
- `tag`

## Example

```ts
const sequence = new ASN1Value(ASN1Class.Universal, ASN1Form.Constructed, 16, contents).sequence();
const oid = sequence.at(0).objectIdentifier();
```
