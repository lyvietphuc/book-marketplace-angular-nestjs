/**
 * Basis-URL des NestJS-Backends.
 * Im Entwicklungsmodus leitet der Angular-Dev-Server alle Anfragen an /api
 * an http://localhost:3000 weiter (siehe proxy.conf.json). Vorteil:
 * Frontend und API haben denselben Ursprung (kein CORS nötig).
 */
export const API_URL = '/api';
