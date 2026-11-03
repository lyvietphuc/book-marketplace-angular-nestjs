// src/common/money.ts
/** Alle Geldbeträge werden als ganze Cent-Beträge gespeichert. */
export const VAT_RATE_BOOKS = 0.07; // ermäßigter MwSt.-Satz für Bücher in Deutschland
export const FREE_SHIPPING_FROM_CENTS = 2000; // ab 20 € versandkostenfrei (pro Shop)
export const SHIPPING_CENTS = 299;

export function shippingFor(subtotalCents: number): number {
  return subtotalCents >= FREE_SHIPPING_FROM_CENTS ? 0 : SHIPPING_CENTS;
}

/** Enthaltene MwSt. aus einem Bruttobetrag: brutto - brutto / 1,07 */
export function includedVat(grossCents: number): number {
  return Math.round(grossCents - grossCents / (1 + VAT_RATE_BOOKS));
}

export function formatEuro(cents: number): string {
  return (cents / 100).toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR',
  });
}
