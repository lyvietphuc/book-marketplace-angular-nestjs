# Feature 01 – Validation

- [ ] `npx prisma migrate reset` läuft ohne Fehler durch und führt den Seed aus.
- [ ] In Prisma Studio: Tabellen `User`, `Shop`, `Book`, `Order`, `OrderItem` gefüllt; `email` und `orderNumber` unique.
- [ ] Registrierung mit `"role":"MERCHANT"` → Rolle `MERCHANT`; mit `"role":"ADMIN"` → 400.
- [ ] `GET /auth/me` zeigt die Rolle.
- [ ] Payload des JWT enthält nur `sub`, `role`, `iat`, `exp`.
- [ ] Ein Kunden-Token auf einem `@Roles('MERCHANT')`-Endpunkt → 403.
