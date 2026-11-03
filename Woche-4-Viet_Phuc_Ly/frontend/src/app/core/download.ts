import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

/**
 * Lädt eine Datei (z. B. PDF) MIT Token herunter.
 * Ein normaler <a href> würde den Authorization-Header nicht mitschicken –
 * deshalb holen wir die Datei per HttpClient (Interceptor hängt das Token an)
 * und lösen den Download über eine temporäre Object-URL aus.
 */
export function downloadFile(http: HttpClient, url: string, fileName: string): Observable<void> {
  return http.get(url, { responseType: 'blob' }).pipe(
    map((blob) => {
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    }),
  );
}
