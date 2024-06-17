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

- [`bitString()`](/reference/main/ASN1Value/bitString)
- [`boolean()`](/reference/main/ASN1Value/boolean)
- [`contents()`](/reference/main/ASN1Value/ASN1Boolean/contents)
- [`enumerated()`](/reference/main/ASN1Value/enumerated)
- [`generalizedTime()`](/reference/main/ASN1Value/generalizedTime)
- [`ia5String()`](/reference/main/ASN1Value/ia5String)
- [`integer()`](/reference/main/ASN1Value/integer)
- [`null()`](/reference/main/ASN1Value/null)
- [`numericString()`](/reference/main/ASN1Value/numericString)
- [`objectIdentifier()`](/reference/main/ASN1Value/objectIdentifier)
- [`octetString()`](/reference/main/ASN1Value/octetString)
- [`printableString()`](/reference/main/ASN1Value/printableString)
- [`real()`](/reference/main/ASN1Value/real)
- [`sequence()`](/reference/main/ASN1Value/sequence)
- [`set()`](/reference/main/ASN1Value/set)
- [`utcTime()`](/reference/main/ASN1Value/utcTime)
- [`utf8String()`](/reference/main/ASN1Value/utf8String)

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
