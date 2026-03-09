# GRACE Entity-Mapping-Workbook

**Version:** 1.0
**Datum:** 13. Januar 2026
**Zweck:** JSON-Schema-Dokumentation für alle GRACE-Entitäten zur Verwendung im Konfigurationsprozess

---

## Übersicht der Entity-Typen

GRACE-Konfigurationen bestehen aus sechs grundlegenden Entity-Typen, die in spezifischer Abhängigkeit zueinander stehen:

| Entity-Typ | Beschreibung | Abhängigkeiten |
|------------|--------------|----------------|
| **Material** | Rohstoffe, Substanzen, Pigmente, Produkte | Keine |
| **Machine** | Produktionsressourcen, Maschinen, Anlagen | Keine |
| **Product** | Hergestellte Erzeugnisse | Material |
| **Process** | Produktionsabläufe mit Prozessschritten | Optional: Machine |
| **BOM** | Stücklisten (Bill of Materials) | Material |
| **Recipe** | Vollständige Produktionsrezepte | Material, BOM, Process |

---

## Entity-Typ 1: MATERIAL

### Beschreibung
Materialien repräsentieren Rohstoffe, Substanzen, Pigmente oder Zwischen- und Endprodukte im Produktionsprozess.

### JSON-Struktur

```json
{
  "id": "string",
  "name": "string",
  "comment": "string"
}
```

### Feldspezifikation

| Feld | Datentyp | Required | Beschreibung | Default | Constraints |
|------|----------|----------|--------------|---------|-------------|
| `id` | string | ✅ Ja | Eindeutiger Bezeichner | - | Format: `lowercase-with-hyphens`, Regex: `^[a-z0-9-]+$` |
| `name` | string | ✅ Ja | Anzeigename des Materials | - | Menschenlesbar, keine Sonderzeichen empfohlen |
| `comment` | string | ❌ Nein | Optionale Beschreibung oder Verwendungshinweis | `""` | Freitext |

### Beispiele

**Beispiel 1: Rohstoff**
```json
{
  "id": "titanium-dioxide",
  "name": "Titanium Dioxide",
  "comment": "Weißes Pigment für Farbherstellung"
}
```

**Beispiel 2: Ohne Kommentar**
```json
{
  "id": "peg-400",
  "name": "PEG 400",
  "comment": ""
}
```

### Besonderheiten
- Materialien haben keine Abhängigkeiten zu anderen Entities
- Werden automatisch erstellt, wenn von Products oder BOMs referenziert
- ID-Konvention: Produktname in Kleinbuchstaben mit Bindestrichen

---

## Entity-Typ 2: MACHINE

### Beschreibung
Maschinen repräsentieren Produktionsressourcen wie Mixer, Dissolver, Pumpen oder andere Anlagen.

### JSON-Struktur

```json
{
  "id": "string",
  "name": "string",
  "operatingCosts": {
    "type": "string",
    "value": number
  },
  "isSpatial": boolean,
  "initialUnits": number,
  "unitsAutoGrow": boolean
}
```

### Feldspezifikation

| Feld | Datentyp | Required | Beschreibung | Default | Constraints |
|------|----------|----------|--------------|---------|-------------|
| `id` | string | ✅ Ja | Eindeutiger Bezeichner | - | Format: `lowercase-with-hyphens`, Regex: `^[a-z0-9-]+$` |
| `name` | string | ✅ Ja | Anzeigename der Maschine | - | Menschenlesbar |
| `operatingCosts` | object | ✅ Ja | Betriebskosten-Objekt | - | Siehe Sub-Struktur |
| `operatingCosts.type` | string | ✅ Ja | Kostentyp | `"Constant"` | Werte: `"Constant"` oder `"Variable"` |
| `operatingCosts.value` | number | ✅ Ja | Kostenwert pro Zeiteinheit | `0` | ≥ 0, keine negativen Werte |
| `isSpatial` | boolean | ✅ Ja | Räumliche Ressource | `false` | `true` nur bei expliziter Anforderung |
| `initialUnits` | number | ✅ Ja | Anzahl verfügbarer Einheiten | `1` | ≥ 1, bei "3 Mixer" = 3 |
| `unitsAutoGrow` | boolean | ✅ Ja | Automatische Kapazitätserweiterung | `false` | Standard immer `false` |

### Beispiele

**Beispiel 1: Einzelne Maschine ohne Kosten**
```json
{
  "id": "high-speed-mixer",
  "name": "High Speed Mixer",
  "operatingCosts": {
    "type": "Constant",
    "value": 0
  },
  "isSpatial": false,
  "initialUnits": 1,
  "unitsAutoGrow": false
}
```

**Beispiel 2: Mehrere Maschinen mit Betriebskosten**
```json
{
  "id": "dissolver",
  "name": "Dissolver",
  "operatingCosts": {
    "type": "Constant",
    "value": 50
  },
  "isSpatial": false,
  "initialUnits": 3,
  "unitsAutoGrow": false
}
```

### Besonderheiten
- Bei mehreren identischen Maschinen: `initialUnits` entspricht der Anzahl
- `operatingCosts.value` wird NIEMALS geraten - bei Unklarheit: 0
- `isSpatial` und `unitsAutoGrow` sind standardmäßig immer `false`
- Mehrere unterschiedliche Maschinen werden als separate Entities angelegt

---

## Entity-Typ 3: PRODUCT

### Beschreibung
Products repräsentieren hergestellte Erzeugnisse und verweisen auf das resultierende Material.

### JSON-Struktur

```json
{
  "id": "string",
  "name": "string",
  "material": {
    "version": number,
    "id": "string"
  }
}
```

### Feldspezifikation

| Feld | Datentyp | Required | Beschreibung | Default | Constraints |
|------|----------|----------|--------------|---------|-------------|
| `id` | string | ✅ Ja | Eindeutiger Bezeichner | - | Format: `{produktname}-prod`, Regex: `^[a-z0-9-]+$` |
| `name` | string | ✅ Ja | Produktname | - | Exakter Name des Produkts |
| `material` | object | ✅ Ja | Referenz zum resultierenden Material | - | Siehe Sub-Struktur |
| `material.version` | number | ✅ Ja | Versionsangabe | `1` | Immer `1` |
| `material.id` | string | ✅ Ja | Material-ID | - | **WICHTIG:** Entspricht dem Produktnamen (nicht Zutat!) |

### Beispiele

**Beispiel 1: Blaue Pigmentpaste**
```json
{
  "id": "blue-pigment-paste-prod",
  "name": "Blue Pigment Paste",
  "material": {
    "version": 1,
    "id": "blue-pigment-paste"
  }
}
```

**Beispiel 2: Weißpaste**
```json
{
  "id": "white-paste-prod",
  "name": "White Paste",
  "material": {
    "version": 1,
    "id": "white-paste"
  }
}
```

### Besonderheiten
- **KRITISCH:** `material.id` referenziert das Produkt selbst, NICHT die Zutaten!
- Bei Detektion von "produce" oder "manufacture" → Product-Entity erstellen
- Wenn referenziertes Material nicht existiert, wird es automatisch erstellt
- ID-Suffix: immer `-prod` anhängen

---

## Entity-Typ 4: PROCESS

### Beschreibung
Prozesse bilden Produktionsabläufe mit mehreren zeitlich sequenzierten Prozessschritten ab.

### JSON-Struktur

```json
{
  "id": "string",
  "name": "string",
  "steps": [
    {
      "id": "string",
      "name": "string",
      "processingTime": {
        "type": "string",
        "value": number,
        "unitId": "string"
      },
      "resourceDemands": [],
      "isParallelizable": boolean
    }
  ],
  "links": []
}
```

### Feldspezifikation

| Feld | Datentyp | Required | Beschreibung | Default | Constraints |
|------|----------|----------|--------------|---------|-------------|
| `id` | string | ✅ Ja | Eindeutiger Bezeichner | - | Format: `lowercase-with-hyphens` |
| `name` | string | ✅ Ja | Prozessname | - | Beschreibend |
| `steps` | array | ✅ Ja | Array von Prozessschritten | - | Mindestens 1 Schritt |
| `steps[].id` | string | ✅ Ja | Schritt-ID | - | Format: `step-1`, `step-2`, ... |
| `steps[].name` | string | ✅ Ja | Schrittname | - | z.B. "Dosing", "Mixing" |
| `steps[].processingTime` | object | ✅ Ja | Zeitangabe-Objekt | - | Siehe Sub-Struktur |
| `steps[].processingTime.type` | string | ✅ Ja | Zeittyp | `"Constant"` | Standard: `"Constant"` |
| `steps[].processingTime.value` | number | ✅ Ja | Zeitwert in Sekunden | - | **IMMER in Sekunden!** |
| `steps[].processingTime.unitId` | string | ✅ Ja | Zeiteinheit | `"s"` | **MUSS immer `"s"` sein!** |
| `steps[].resourceDemands` | array | ✅ Ja | Maschinenressourcen-Anforderungen | `[]` | Standard: leeres Array |
| `steps[].isParallelizable` | boolean | ✅ Ja | Parallelisierbarkeit | `false` | Standard: `false` |
| `links` | array | ✅ Ja | Verknüpfungen zwischen Schritten | `[]` | Standard: leeres Array |

### Zeitumrechnung (KRITISCH)

| Eingabe | Umrechnung | Wert in `value` |
|---------|------------|-----------------|
| 5 min | 5 × 60 | 300 |
| 10 min | 10 × 60 | 600 |
| 15 min | 15 × 60 | 900 |
| 20 min | 20 × 60 | 1200 |
| 1 h | 60 × 60 | 3600 |

### Beispiele

**Beispiel 1: Einfacher Mischprozess**
```json
{
  "id": "mixing-dispersion-filtration",
  "name": "Mixing Dispersion Filtration Process",
  "steps": [
    {
      "id": "step-1",
      "name": "Mixing",
      "processingTime": {
        "type": "Constant",
        "value": 900,
        "unitId": "s"
      },
      "resourceDemands": [],
      "isParallelizable": false
    },
    {
      "id": "step-2",
      "name": "Dispersion",
      "processingTime": {
        "type": "Constant",
        "value": 600,
        "unitId": "s"
      },
      "resourceDemands": [],
      "isParallelizable": false
    },
    {
      "id": "step-3",
      "name": "Filtration",
      "processingTime": {
        "type": "Constant",
        "value": 1200,
        "unitId": "s"
      },
      "resourceDemands": [],
      "isParallelizable": false
    }
  ],
  "links": []
}
```

### Besonderheiten
- **KRITISCH:** `processingTime.unitId` MUSS IMMER `"s"` sein, NIEMALS `"min"` oder `"minutes"`
- Zeitangaben in Minuten müssen in Sekunden umgerechnet werden (× 60)
- `resourceDemands` bleibt leer, außer explizite Maschinenanforderungen
- `links` bleibt leer (sequenzielle Abfolge durch Array-Reihenfolge)
- `isParallelizable` ist standardmäßig `false`

---

## Entity-Typ 5: BOM (Bill of Materials)

### Beschreibung
BOMs (Stücklisten) definieren die Zusammensetzung eines Produkts aus Materialien mit Mengenangaben.

### JSON-Struktur

```json
{
  "id": "string",
  "name": "string",
  "baseQuantity": number,
  "unitId": "string",
  "items": [
    {
      "key": "string",
      "material": {
        "version": number,
        "id": "string"
      },
      "quantity": number
    }
  ]
}
```

### Feldspezifikation

| Feld | Datentyp | Required | Beschreibung | Default | Constraints |
|------|----------|----------|--------------|---------|-------------|
| `id` | string | ✅ Ja | Eindeutiger Bezeichner | - | Format: `{produktname}-bom` |
| `name` | string | ✅ Ja | BOM-Name | - | z.B. "Grey Pigment Paste BOM" |
| `baseQuantity` | number | ✅ Ja | Gesamtmenge | - | **MUSS exakte Summe aller Item-Quantities sein!** |
| `unitId` | string | ✅ Ja | Mengeneinheit | - | z.B. "g", "kg", "l", "ml" |
| `items` | array | ✅ Ja | Array von Materialien | - | Mindestens 1 Item |
| `items[].key` | string | ✅ Ja | Laufende Nummer | - | Format: "1", "2", "3", ... |
| `items[].material` | object | ✅ Ja | Materialreferenz | - | Siehe Sub-Struktur |
| `items[].material.version` | number | ✅ Ja | Versionsangabe | `1` | Immer `1` |
| `items[].material.id` | string | ✅ Ja | Material-ID | - | Muss existierendes Material referenzieren |
| `items[].quantity` | number | ✅ Ja | Menge des Materials | - | > 0 |

### Berechnung von baseQuantity (KRITISCH)

```
baseQuantity = Summe aller items[].quantity
```

**Beispiel:**
- Item 1: 10g
- Item 2: 60g
- Item 3: 10g
- Item 4: 20g
- **baseQuantity = 10 + 60 + 10 + 20 = 100g**

### Beispiele

**Beispiel 1: Graue Pigmentpaste**
```json
{
  "id": "grey-pigment-paste-bom",
  "name": "Grey Pigment Paste BOM",
  "baseQuantity": 100,
  "unitId": "g",
  "items": [
    {
      "key": "1",
      "material": {
        "version": 1,
        "id": "grey-pigment"
      },
      "quantity": 10
    },
    {
      "key": "2",
      "material": {
        "version": 1,
        "id": "titanium-dioxide"
      },
      "quantity": 60
    },
    {
      "key": "3",
      "material": {
        "version": 1,
        "id": "peg-400"
      },
      "quantity": 10
    },
    {
      "key": "4",
      "material": {
        "version": 1,
        "id": "tego"
      },
      "quantity": 20
    }
  ]
}
```

### Besonderheiten
- **KRITISCH:** `baseQuantity` wird automatisch durch JavaScript berechnet, da LLMs schlecht in Mathematik sind
- Wenn referenzierte Materialien nicht existieren, werden sie automatisch erstellt
- ID-Suffix: immer `-bom` anhängen
- `items[].key` ist sequenziell nummeriert ("1", "2", "3", ...)

---

## Entity-Typ 6: RECIPE

### Beschreibung
Rezepte verbinden Material, BOM und Process zu einer vollständigen Produktionsdefinition.

### JSON-Struktur

```json
{
  "id": "string",
  "name": "string",
  "resultingMaterial": {
    "version": number,
    "id": "string"
  },
  "bom": {
    "version": number,
    "id": "string"
  },
  "productionProcess": {
    "version": number,
    "id": "string"
  }
}
```

### Feldspezifikation

| Feld | Datentyp | Required | Beschreibung | Default | Constraints |
|------|----------|----------|--------------|---------|-------------|
| `id` | string | ✅ Ja | Eindeutiger Bezeichner | - | Format: `{produktname}-recipe` |
| `name` | string | ✅ Ja | Rezeptname | - | z.B. "Purple Pigment Paste Recipe" |
| `resultingMaterial` | object | ✅ Ja | Referenz zum Endprodukt-Material | - | Siehe Sub-Struktur |
| `resultingMaterial.version` | number | ✅ Ja | Versionsangabe | `1` | Immer `1` |
| `resultingMaterial.id` | string | ✅ Ja | Material-ID des Endprodukts | - | Muss existieren |
| `bom` | object | ✅ Ja | Referenz zur Stückliste | - | Siehe Sub-Struktur |
| `bom.version` | number | ✅ Ja | Versionsangabe | `1` | Immer `1` |
| `bom.id` | string | ✅ Ja | BOM-ID | - | Muss existieren |
| `productionProcess` | object | ✅ Ja | Referenz zum Prozess | - | Siehe Sub-Struktur |
| `productionProcess.version` | number | ✅ Ja | Versionsangabe | `1` | Immer `1` |
| `productionProcess.id` | string | ✅ Ja | Process-ID | - | Muss existieren |

### Prozessname zu Process-ID Konvertierung

**Wichtig:** Process-ID wird aus Prozessname abgeleitet, KEIN Suffix `-process`!

| Prozessname | Process-ID |
|-------------|------------|
| "Dosing Mixing Filtration Packout Process" | `dosing-mixing-filtration-packout` |
| "Mixing Dispersion Filtration Process" | `mixing-dispersion-filtration` |
| "Simple Mixing Process" | `simple-mixing` |

**Konvertierungsregel:**
1. Prozessname nehmen
2. "Process" am Ende entfernen
3. In Kleinbuchstaben konvertieren
4. Leerzeichen durch Bindestriche ersetzen

### Beispiele

**Beispiel 1: Purple Pigment Paste**
```json
{
  "id": "purple-pigment-paste-recipe",
  "name": "Purple Pigment Paste Recipe",
  "resultingMaterial": {
    "version": 1,
    "id": "purple-pigment-paste"
  },
  "bom": {
    "version": 1,
    "id": "purple-pigment-paste-bom"
  },
  "productionProcess": {
    "version": 1,
    "id": "dosing-mixing-filtration-packout"
  }
}
```

### Besonderheiten
- **Abhängigkeiten:** Alle drei referenzierten Entities (Material, BOM, Process) MÜSSEN existieren!
- Recipes werden erst am Ende erstellt, nachdem alle Abhängigkeiten vorhanden sind
- Master Creator verwendet Session-Context, um existierende Entity-IDs automatisch zu erkennen
- Alle `version`-Felder sind immer `1`
- ID-Suffix: immer `-recipe` anhängen

---

## Validierungs-Checkliste

Vor dem Export einer Konfiguration sollten folgende 6 Punkte geprüft werden:

### ✅ 6-Punkte-Checkliste

| Nr. | Validierungspunkt | Beschreibung |
|-----|-------------------|--------------|
| 1 | **Vollständigkeit** | Alle 6 Entity-Typen vorhanden (sofern relevant) |
| 2 | **ID-Konsistenz** | Keine kaputten Referenzen zwischen Entities |
| 3 | **Zeiteinheiten** | Alle Process-Steps haben `unitId: "s"` (Sekunden) |
| 4 | **BOM baseQuantity** | baseQuantity = exakte Summe aller Item-Quantities |
| 5 | **Product Material** | Product.material.id referenziert korrektes Material (Produkt selbst) |
| 6 | **ID-Duplikate** | Keine duplizierten IDs innerhalb eines Entity-Typs |

---

## ID-Namenskonventionen

Einheitliche ID-Konventionen gewährleisten Konsistenz und Nachvollziehbarkeit:

| Entity-Typ | ID-Format | Beispiel |
|------------|-----------|----------|
| Material | `lowercase-with-hyphens` | `titanium-dioxide` |
| Machine | `lowercase-with-hyphens` | `high-speed-mixer` |
| Product | `{produktname}-prod` | `white-paste-prod` |
| Process | `lowercase-with-hyphens` | `mixing-dispersion-filtration` |
| BOM | `{produktname}-bom` | `white-paste-bom` |
| Recipe | `{produktname}-recipe` | `white-paste-recipe` |

**Regel:** Keine Großbuchstaben, keine Leerzeichen, keine Sonderzeichen außer Bindestrichen.

---

## Häufige Fehlerquellen

### ❌ Fehler 1: Product material.id ist Zutat statt Produkt
**Falsch:**
```json
{
  "id": "blue-pigment-paste-prod",
  "name": "Blue Pigment Paste",
  "material": {"version": 1, "id": "titanium-dioxide"} // ❌ FALSCH
}
```

**Richtig:**
```json
{
  "id": "blue-pigment-paste-prod",
  "name": "Blue Pigment Paste",
  "material": {"version": 1, "id": "blue-pigment-paste"} // ✅ RICHTIG
}
```

---

### ❌ Fehler 2: Zeiteinheit in Minuten statt Sekunden
**Falsch:**
```json
{
  "processingTime": {
    "type": "Constant",
    "value": 15,
    "unitId": "min" // ❌ FALSCH
  }
}
```

**Richtig:**
```json
{
  "processingTime": {
    "type": "Constant",
    "value": 900,
    "unitId": "s" // ✅ RICHTIG (15 min × 60 = 900 s)
  }
}
```

---

### ❌ Fehler 3: BOM baseQuantity falsch berechnet
**Falsch:**
```json
{
  "baseQuantity": 90, // ❌ FALSCH (10+60+10+20 = 100)
  "items": [
    {"quantity": 10},
    {"quantity": 60},
    {"quantity": 10},
    {"quantity": 20}
  ]
}
```

**Richtig:**
```json
{
  "baseQuantity": 100, // ✅ RICHTIG
  "items": [
    {"quantity": 10},
    {"quantity": 60},
    {"quantity": 10},
    {"quantity": 20}
  ]
}
```

---

### ❌ Fehler 4: Process-ID mit `-process` Suffix
**Falsch:**
```json
{
  "productionProcess": {
    "version": 1,
    "id": "dosing-mixing-filtration-packout-process" // ❌ FALSCH
  }
}
```

**Richtig:**
```json
{
  "productionProcess": {
    "version": 1,
    "id": "dosing-mixing-filtration-packout" // ✅ RICHTIG
  }
}
```

---

## Export-Formate

Entities können einzeln oder kombiniert exportiert werden:

### Einzelexport
- `materials.json` - Nur Materialien
- `machines.json` - Nur Maschinen
- `products.json` - Nur Produkte
- `processes.json` - Nur Prozesse
- `boms.json` - Nur BOMs
- `recipes.json` - Nur Rezepte

### Gesamtexport
```json
{
  "materials": [...],
  "machines": [...],
  "products": [...],
  "processes": [...],
  "boms": [...],
  "recipes": [...]
}
```

Dateiname: `aps-all-{timestamp}.json`

---

## Revisionsverlauf

| Version | Datum | Änderungen |
|---------|-------|------------|
| 1.0 | 13.01.2026 | Initiale Erstellung basierend auf Master Creator v2.0 |

---

**Ende des Mapping-Workbooks**
