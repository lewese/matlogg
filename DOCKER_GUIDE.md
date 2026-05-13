# Docker Installation Guide - Matlogg App

## Steg 1: Förutsättningar
Se till att du har installerat:
- Docker (https://www.docker.com/products/docker-desktop)
- Docker Compose (kommer med Docker Desktop)

Verifiera installationen:
```bash
docker --version
docker-compose --version
```

---

## Steg 2: STARTA applikationen

Öppna terminal i projektmappen (`/Users/welenlei/vsproject/matlogg`) och kör:

```bash
docker-compose up
```

**Vad som händer:**
- Docker laddar ned PostgreSQL-image (första gången)
- Docker bygger din Node.js-app
- PostgreSQL-tjänsten startas
- Node.js-appen startas
- Du ser loggar från båda tjänsterna

**Din app är klar när du ser:**
```
app  | Server kör på port 3000
```

Besök då: http://localhost:3000

---

## Steg 3: STOPPA applikationen (utan att radera data)

I samma terminal där `docker-compose up` körs, tryck:
```
Ctrl + C
```

**Eller från en annan terminal:**
```bash
docker-compose stop
```

**Vad som händer:**
- ✅ PostgreSQL stoppas
- ✅ Node.js-appen stoppas
- ✅ **All data sparas** på PostgreSQL-volymen
- ✅ Nästa gång du kör `docker-compose up` är all data kvar!

---

## Steg 4: STARTA igen (appen och datan är kvar)

```bash
docker-compose up
```

All dina tidigare sparade måltider finns fortfarande där! 🎉

---

## Steg 5: RADERA ALLT (inklusive data) - Börja om

**Varning:** Detta raderar ALL data i databasen!

```bash
docker-compose down -v
```

**Flaggor:**
- `down` = Stoppa och ta bort containrar
- `-v` = Ta bort volymen (postgresql_data) - detta raderar all databaskonfiguration

**Efter detta:**
- Containrarna är borta
- Databasen är tom
- Nästa `docker-compose up` startar en helt ny miljö

---

## Steg 6: EXTRA - Visa status

Se vilka containrar som körs:
```bash
docker-compose ps
```

Se loggar:
```bash
docker-compose logs
```

Se loggar från bara PostgreSQL:
```bash
docker-compose logs postgres
```

Se loggar från bara Node-appen:
```bash
docker-compose logs app
```

---

## Steg 7: EXTRA - Åtkomst till PostgreSQL direkt

Om du vill se databasen direkt:

```bash
docker-compose exec postgres psql -U postgres
```

Då kan du köra SQL-kommandon direkt i databasen!

Exempel:
```sql
\dt              -- Lista alla tabeller
SELECT * FROM meals;  -- Visa alla måltider
\q              -- Avsluta
```

---

## Sammanfattning - Kommandon du behöver

| Vad du vill göra | Kommando |
|---|---|
| Starta allt | `docker-compose up` |
| Starta i bakgrunden | `docker-compose up -d` |
| Stoppa (spara data) | `docker-compose stop` eller Ctrl+C |
| Stoppa och ta bort (spara data) | `docker-compose down` |
| Radera allt (DELETE ALLT!) | `docker-compose down -v` |
| Se status | `docker-compose ps` |
| Se loggar | `docker-compose logs -f` |

---

## Felsökning

**Problem: "Port 3000 is already in use"**
- Antingen körs något annat på port 3000
- Eller en tidigare container är inte helt stöppd
- Lösning: `docker-compose down` och försök igen

**Problem: "Cannot connect to the Docker daemon"**
- Docker är inte installerat eller startad
- Starta Docker Desktop (på Mac)

**Problem: "Databaskonfigurationen är konstig"**
- Kontrollera att `postgres` service är igång: `docker-compose ps`
- Se till att du väntat några sekunder innan appen startar (den väntar på postgres)

---

## Arkitektur - Hur det fungerar

```
┌─────────────────────────────────────────┐
│         docker-compose.yml              │
├─────────────────────────────────────────┤
│                                         │
│ ┌──────────────────┐                    │
│ │   app service    │                    │
│ │  (Node.js på     │                    │
│ │   port 3000)     │                    │
│ └────────┬─────────┘                    │
│          │                              │
│          │ (network connection)         │
│          ↓                              │
│ ┌──────────────────┐                    │
│ │ postgres service │                    │
│ │  (PostgreSQL på  │                    │
│ │   port 5432)     │                    │
│ │                  │                    │
│ │ Data sparas på   │                    │
│ │ postgres_data    │                    │
│ │ (Docker volume)  │                    │
│ └──────────────────┘                    │
│                                         │
└─────────────────────────────────────────┘
```

---

Lycka till! 🚀✨
