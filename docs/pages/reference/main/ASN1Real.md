---
title: "ASN1Real"
---

# ASN1Real

Represents an ASN.1 real value.

## Definition

```ts
//$ ASN1RealZero=/reference/main/ASN1RealZero
//$ ASN1SpecialReal=/reference/main/ASN1SpecialReal
//$ ASN1RealDecimalEncoding=/reference/main/ASN1RealDecimalEncoding
//$ ASN1RealBinaryEncoding=/reference/main/ASN1RealBinaryEncoding
type ASN1Real =
	| $$ASN1RealZero
	| $$ASN1SpecialReal
	| $$ASN1RealDecimalEncoding
	| $$ASN1RealBinaryEncoding;
```
