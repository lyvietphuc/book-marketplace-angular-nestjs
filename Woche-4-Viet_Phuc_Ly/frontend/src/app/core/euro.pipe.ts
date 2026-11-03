import { Pipe, PipeTransform } from '@angular/core';

const FORMAT = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });

/** Cent-Betrag als Euro anzeigen: {{ 1999 | euro }} -> "19,99 €" */
@Pipe({ name: 'euro' })
export class EuroPipe implements PipeTransform {
  transform(cents: number | null | undefined): string {
    return cents == null ? '' : FORMAT.format(cents / 100);
  }
}
