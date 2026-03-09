# GRACE Entity Relationships & Cardinalities

**Version:** 1.0
**Datum:** 23. Januar 2026
**Zweck:** Dokumentation der referenziellen Beziehungen, Kardinalitäten und Abhängigkeitsketten zwischen GRACE-Entitäten

---

## Übersicht: 6 Entity-Typen

| Entity-Typ | Abhängigkeiten | Kardinalität | Beschreibung |
|------------|----------------|--------------|--------------|
| **Material** | Keine | - | Standalone: Rohstoffe, Substanzen, Zwischen-/Endprodukte |
| **Machine** | Keine | - | Standalone: Produktionsressourcen |
| **Product** | Material | 1:1 | Produkt → genau 1 Material (Produkt selbst) |
| **BOM** | Material | 1:N | BOM → N Materialien (Zutaten/Ingredients) |
| **Process** | (Machine) | 1:N | Process → N Steps → (optional) N Machines |
| **Recipe** | Material, BOM, Process | 1:1:1 | Recipe → 1 Material + 1 BOM + 1 Process |

---

## Dependency Chain (Topologische Reihenfolge)

```
Stufe 1 (keine Dependencies):
├── Material
└── Machine

Stufe 2 (abhängig von Stufe 1):
├── Product ───────> Material (1:1 self-reference)
├── BOM ───────────> Material (1:N ingredients)
└── Process ───────> Machine (1:N optional)

Stufe 3 (abhängig von Stufe 2):
└── Recipe ────┬───> Material (1:1)
               ├───> BOM (1:1)
               └───> Process (1:1)
```

**Generierungsreihenfolge:**
1. **Stufe 1**: Materials, Machines (parallel möglich)
2. **Stufe 2**: Products, BOMs, Processes (parallel möglich, nach Stufe 1)
3. **Stufe 3**: Recipes (nur nach Stufe 2)

---

## Entity-Relationship-Diagramm (ER-Diagramm)

```
┌──────────────┐
│   Material   │◄────────────────┐
│  - id        │                 │
│  - name      │                 │
│  - comment   │                 │
└──────┬───────┘                 │
       │                         │
       │ referenced by           │
       │ (1:1)                   │
       │                         │
┌──────▼───────┐        ┌────────┴──────┐
│   Product    │        │   BOM         │
│  - id        │        │  - id         │
│  - name      │        │  - name       │
│  - material◄─┼────┐   │  - baseQty    │
└──────────────┘    │   │  - items[]◄───┼──┐
                    │   └───────────────┘  │
                    │                      │
                    │   referenced by      │ referenced by
                    │   (1:N)              │ (1:N)
                    │                      │
                    │                      │
┌──────────────┐    │   ┌──────────────┐  │
│   Machine    │    │   │   Recipe     │  │
│  - id        │    │   │  - id        │  │
│  - name      │    │   │  - name      │  │
│  - ...       │    │   │  - material──┼──┘
└──────┬───────┘    │   │  - bom───────┼──────────┐
       │            │   │  - process───┼──┐       │
       │            └───┼──────────────┘  │       │
       │ referenced by  │                 │       │
       │ (1:N optional) │                 │       │
       │                │                 │       │
┌──────▼───────┐        │                 │       │
│   Process    │        │                 │       │
│  - id        │◄───────┘                 │       │
│  - name      │                          │       │
│  - steps[]   │                          │       │
└──────────────┘                          │       │
                                          │       │
                                          └───────┘
```

---

## Referenzielle Beziehungen im Detail

### 1. Product → Material (1:1)

```json
{
  "id": "white-paste-prod",
  "name": "White Paste",
  "material": {
    "version": 1,
    "id": "white-paste"  // ← MUSS existierendes Material sein
  }
}
```

**Kardinalität:** 1 Product → genau 1 Material
**Art:** Self-reference (Produkt referenziert sich selbst, NICHT Zutaten!)
**Validierung:** `material.id` MUSS in Materials existieren

---

### 2. BOM → Material (1:N)

```json
{
  "id": "white-paste-bom",
  "name": "White Paste BOM",
  "baseQuantity": 100,
  "items": [
    {
      "key": "1",
      "material": {"version": 1, "id": "titanium-dioxide"},  // ← Material 1
      "quantity": 60
    },
    {
      "key": "2",
      "material": {"version": 1, "id": "peg-400"},          // ← Material 2
      "quantity": 30
    },
    {
      "key": "3",
      "material": {"version": 1, "id": "tego"},             // ← Material 3
      "quantity": 10
    }
  ]
}
```

**Kardinalität:** 1 BOM → N Materials (N ≥ 1)
**Art:** Ingredients/Zutaten-Referenzen
**Validierung:** Alle `items[].material.id` MÜSSEN in Materials existieren
**Constraint:** `baseQuantity` = Summe aller `items[].quantity`

---

### 3. Process → Machine (1:N optional)

```json
{
  "id": "mixing-dispersion",
  "name": "Mixing Dispersion Process",
  "steps": [
    {
      "id": "step-1",
      "name": "Mixing",
      "processingTime": {"type": "Constant", "value": 900, "unitId": "s"},
      "resourceDemands": [
        {
          "resourceId": "high-speed-mixer",  // ← Machine reference
          "quantity": 1
        }
      ]
    },
    {
      "id": "step-2",
      "name": "Dispersion",
      "processingTime": {"type": "Constant", "value": 600, "unitId": "s"},
      "resourceDemands": [
        {
          "resourceId": "dissolver",         // ← Machine reference
          "quantity": 1
        }
      ]
    }
  ]
}
```

**Kardinalität:** 1 Process → M Steps → N Machines (M ≥ 1, N ≥ 0)
**Art:** Optional (resourceDemands kann leer sein)
**Validierung:** Wenn `resourceDemands` nicht leer, dann `resourceId` MUSS in Machines existieren

---

### 4. Recipe → Material + BOM + Process (1:1:1)

```json
{
  "id": "white-paste-recipe",
  "name": "White Paste Recipe",
  "resultingMaterial": {
    "version": 1,
    "id": "white-paste"              // ← Material reference
  },
  "bom": {
    "version": 1,
    "id": "white-paste-bom"          // ← BOM reference
  },
  "productionProcess": {
    "version": 1,
    "id": "mixing-dispersion"        // ← Process reference
  }
}
```

**Kardinalität:** 1 Recipe → genau 1 Material + genau 1 BOM + genau 1 Process
**Validierung:**
- `resultingMaterial.id` MUSS in Materials existieren
- `bom.id` MUSS in BOMs existieren
- `productionProcess.id` MUSS in Processes existieren

---

## Kardinalitäten-Übersicht (Formal)

| Beziehung | Von | Nach | Typ | Kardinalität | Optional? |
|-----------|-----|------|-----|--------------|-----------|
| Product references Material | Product | Material | 1:1 | Jedes Product → genau 1 Material | Nein (required) |
| BOM references Materials | BOM | Material | 1:N | Jede BOM → N Materials (N ≥ 1) | Nein (min. 1 item) |
| Process references Machines | Process.steps[] | Machine | 1:N | Jeder Step → N Machines (N ≥ 0) | Ja (kann leer sein) |
| Recipe references Material | Recipe | Material | 1:1 | Jedes Recipe → genau 1 Material | Nein (required) |
| Recipe references BOM | Recipe | BOM | 1:1 | Jedes Recipe → genau 1 BOM | Nein (required) |
| Recipe references Process | Recipe | Process | 1:1 | Jedes Recipe → genau 1 Process | Nein (required) |

---

## Referenzielle Integritäts-Constraints

### Must-Exist-Constraints (Foreign Keys)

| Entity | Feld | Referenziert | Constraint |
|--------|------|--------------|------------|
| Product | `material.id` | Material.id | MUST EXIST |
| BOM | `items[].material.id` | Material.id | MUST EXIST |
| Process | `steps[].resourceDemands[].resourceId` | Machine.id | IF NOT EMPTY: MUST EXIST |
| Recipe | `resultingMaterial.id` | Material.id | MUST EXIST |
| Recipe | `bom.id` | BOM.id | MUST EXIST |
| Recipe | `productionProcess.id` | Process.id | MUST EXIST |

### Special Constraints

| Entity | Constraint | Beschreibung |
|--------|-----------|--------------|
| Product | `material.id` = Produktname | Material MUSS Produkt selbst sein, NICHT Zutat! |
| BOM | `baseQuantity` = Σ `items[].quantity` | Summe aller Mengen MUSS exakt gleich sein |
| Process | `processingTime.unitId` = `"s"` | IMMER Sekunden, NIEMALS Minuten |
| Recipe | Alle 3 Referenzen existieren | ALLE Dependencies MÜSSEN vor Recipe-Erstellung existieren |

---

## Abhängigkeits-Graph für Topologische Generierung

```
Materials ────┐
              ├──> Products ──┐
              │                │
              ├──> BOMs ───────┤
              │                ├──> Recipes
Machines ─────┼──> Processes ──┘
              │
              └──> (optional)
```

**Erklärung:**
1. **Materials** und **Machines** haben keine Abhängigkeiten → Stufe 1
2. **Products**, **BOMs**, **Processes** hängen von Stufe 1 ab → Stufe 2
3. **Recipes** hängen von Material (Stufe 1), BOM (Stufe 2), Process (Stufe 2) ab → Stufe 3

**Wichtig für DistributionAnalyzer:**
- Bei `TopologicalEntitySetGenerator`: Export-Klasse mit allen Entity-Listen
- Bei `GlobalEntitySetGenerator`: Separate Types, SCC-aware (Zyklen = 1 Stufe)

---

## Häufige Validierungsfehler

### ❌ Fehler 1: Product referenziert Zutat statt Produkt

```json
// FALSCH
{"id": "white-paste-prod", "material": {"id": "titanium-dioxide"}}  // ← Zutat!

// RICHTIG
{"id": "white-paste-prod", "material": {"id": "white-paste"}}      // ← Produkt!
```

### ❌ Fehler 2: BOM baseQuantity falsch berechnet

```json
// FALSCH
{"baseQuantity": 90, "items": [{"quantity": 60}, {"quantity": 30}, {"quantity": 10}]}  // 60+30+10=100 ≠ 90

// RICHTIG
{"baseQuantity": 100, "items": [{"quantity": 60}, {"quantity": 30}, {"quantity": 10}]}  // 60+30+10=100 ✓
```

### ❌ Fehler 3: Recipe erstellt bevor Dependencies existieren

```json
// FALSCH: Recipe erstellt, aber "white-paste-bom" existiert noch nicht
{"id": "white-paste-recipe", "bom": {"id": "white-paste-bom"}}  // ← BOM nicht gefunden!

// RICHTIG: Erst BOM erstellen, dann Recipe
1. Erst: BOM mit id="white-paste-bom" erstellen
2. Dann: Recipe mit bom.id="white-paste-bom" erstellen
```

### ❌ Fehler 4: Process Zeit in Minuten statt Sekunden

```json
// FALSCH
{"processingTime": {"value": 15, "unitId": "min"}}  // ← NIEMALS "min"!

// RICHTIG
{"processingTime": {"value": 900, "unitId": "s"}}  // ← IMMER "s" (15 min × 60 = 900 s)
```

---

## ID-Namenskonventionen (Cross-Reference)

| Entity | ID-Format | Beispiel | Suffix |
|--------|-----------|----------|--------|
| Material | `lowercase-with-hyphens` | `titanium-dioxide` | - |
| Machine | `lowercase-with-hyphens` | `high-speed-mixer` | - |
| Product | `{produktname}-prod` | `white-paste-prod` | `-prod` |
| Process | `lowercase-with-hyphens` | `mixing-dispersion` | - (KEIN `-process`!) |
| BOM | `{produktname}-bom` | `white-paste-bom` | `-bom` |
| Recipe | `{produktname}-recipe` | `white-paste-recipe` | `-recipe` |

**Wichtig:**
- Process-IDs haben KEIN `-process` Suffix!
- Product, BOM, Recipe haben eindeutige Suffixe zur Unterscheidung

---

## Verwendung im DistributionAnalyzer

### Dataclass-Definitionen mit korrekten Kardinalitäten

```python
from dataclasses import dataclass
from typing import List, Optional

@dataclass
class Material:
    id: str
    name: str
    comment: str = ""

@dataclass
class Machine:
    id: str
    name: str
    # ... weitere Felder

@dataclass
class MaterialReference:
    version: int  # immer 1
    id: str       # Foreign Key zu Material.id

@dataclass
class Product:
    id: str
    name: str
    material: MaterialReference  # 1:1 zu Material

@dataclass
class BOMItem:
    key: str
    material: MaterialReference  # Foreign Key zu Material.id
    quantity: float

@dataclass
class BOM:
    id: str
    name: str
    baseQuantity: float
    unitId: str
    items: List[BOMItem]  # 1:N zu Material

@dataclass
class ResourceDemand:
    resourceId: str  # Foreign Key zu Machine.id (optional)
    quantity: float

@dataclass
class ProcessStep:
    id: str
    name: str
    processingTime: dict
    resourceDemands: List[ResourceDemand]  # 1:N zu Machine (optional)
    isParallelizable: bool

@dataclass
class Process:
    id: str
    name: str
    steps: List[ProcessStep]  # 1:N Steps
    links: List

@dataclass
class Recipe:
    id: str
    name: str
    resultingMaterial: MaterialReference  # 1:1 zu Material
    bom: dict  # {"version": 1, "id": "..."} - 1:1 zu BOM
    productionProcess: dict  # {"version": 1, "id": "..."} - 1:1 zu Process
```

### Reference-Map für DistributionAnalyzer

```python
# Erwartete reference_map nach fit_structured:
reference_map = {
    (Product, "material"): (Export, "materials"),        # Product → Material pool
    (BOMItem, "material"): (Export, "materials"),        # BOM items → Material pool
    (ResourceDemand, "resourceId"): (Export, "machines"), # Process steps → Machine pool
    (Recipe, "resultingMaterial"): (Export, "materials"), # Recipe → Material pool
    (Recipe, "bom"): (Export, "boms"),                   # Recipe → BOM pool
    (Recipe, "productionProcess"): (Export, "processes"), # Recipe → Process pool
}
```

---

## Revisionsverlauf

| Version | Datum | Änderungen |
|---------|-------|------------|
| 1.0 | 23.01.2026 | Initiale Erstellung basierend auf Entity Mapping Workbook |

---

**Ende der Kardinalitäten-Dokumentation**
