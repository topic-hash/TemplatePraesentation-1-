# APS CONFIGURATOR - ENTITY CARDINALITY DIAGRAM

**Version:** 1.0
**Date:** 2025-12-25
**Purpose:** Complete cardinality and relationship mapping between APS JSON object types

---

## THE TWO BASE ARRAYS (Everything else just references these)

```
    +------------------------+              +------------------------+
    |   materials[] array    |              |   machines[] array     |
    |------------------------|              |------------------------|
    | [                      |              | [                      |
    |   {id: "white-paste"}, |              |   {id: "mixer-1"},     |
    |   {id: "titanium"},    |              |   {id: "extruder-1"},  |
    |   {id: "wax"}          |              |   {id: "tank-1"}       |
    | ]                      |              | ]                      |
    +------------------------+              +------------------------+
              ^                                       ^
              |                                       |
              | 1:1 (PRODUCT)                         | N:M (PROCESS.steps)
              | 1:1 (RECIPE)                          |
              | 1:N (BOM.items)                       |
              |                                       |
         Referenced by:                          Referenced by:
         - PRODUCT                               - PROCESS.steps
         - RECIPE                                  .resourceDemands[]
         - BOM.items[]
```

---

## COMPLETE REFERENCE MAP WITH CARDINALITY

```
                            +------------------+
                            |     RECIPE       |
                            |------------------|
                            | id               |
                            | name             |
                            |                  |
                            | resultingMaterial|---+
                            | bom              |   | 1:1
                            | productionProcess|   |
                            +--------+---------+   |
                                     |             |
                    +-------1:1------+------1:1----+-------+
                    |                |                     |
                    v                v                     v
          +-------------------+  +--------+         materials[]
          |      PROCESS      |  |  BOM   |
          |-------------------|  |--------|
          | id                |  | id     |
          | name              |  | name   |
          | steps[] (1..N)    |  | items[]|
          +--------+----------+  +----+---+
                   |                  | 1..N
                   | 1..N             |
                   v                  v
         +---------------------+    +-----------+
         | Each step has:      |    | Each item:|
         | - id                |    | - key     |
         | - name              |    | - qty     |
         | - processingTime    |    | - material|
         |   {type: Constant,  |    |    .id ---+--[N:1]--> materials[]
         |    value: number,   |    +-----------+
         |    unitId: "s"}     |
         | - isParallelizable  |
         | - resourceDemands[] |
         |    (1..N)           |
         +---------+-----------+
                   | 1..N
                   v
         +-----------------+
         | Each demand:    |
         | - resourceId ---+--[N:1]--> machines[]
         | - units         |
         +-----------------+


                    +------------------+
                    |     PRODUCT      |
                    |------------------|
                    | id               |
                    | name             |
                    | material.id -----+--[1:1]--> materials[]
                    +------------------+
```

---

## DETAILED FLOW WITH CARDINALITY

```
materials[]  <--[N:1]-- BOM.items[].material.id
    ^                   (Many items reference one material)
    |
    +-----[1:1]-------- RECIPE.resultingMaterial.id
    |                   (One recipe produces one material)
    |
    +-----[1:1]-------- PRODUCT.material.id
                        (One product has one material)


machines[]   <--[N:1]-- PROCESS.steps[].resourceDemands[].resourceId
                        (Many demands reference one machine)
```

---

## CARDINALITY NOTATION LEGEND

| Notation | Meaning |
|----------|---------|
| `1:1`    | One-to-One (mandatory) |
| `1:N`    | One-to-Many (N >= 1) |
| `N:1`    | Many-to-One |
| `N:M`    | Many-to-Many |
| `1..N`   | One or more (at least 1 required) |

---

## CARDINALITY TABLE

| FROM | TO | CARDINALITY | NOTES |
|------|-------|-------------|-------|
| PRODUCT | materials[] | 1:1 | One product = one material |
| RECIPE | materials[] | 1:1 | One recipe produces one material |
| RECIPE | BOM | 1:1 | One recipe uses one BOM |
| RECIPE | PROCESS | 1:1 | One recipe follows one process |
| BOM.items[] | materials[] | N:1 (N>=1) | Many items can ref same material |
| PROCESS.steps[] | machines[] | N:M (N>=1) | Many steps, many machines |
| .resourceDemands[] | | M>=1 | Each step needs 1+ machines |

---

## PROCESS STEP STRUCTURE (MANDATORY FIELDS)

Each step MUST have:

```javascript
{
  "id": "unique-identifier",           // unique within process
  "name": "Step Name",                 // step name
  "processingTime": {                  // MANDATORY
    "type": "Constant",                // always "Constant"
    "value": 600,                      // numeric duration
    "unitId": "s"                      // "s" | "min" | "h"
  },
  "isParallelizable": false,           // true | false
  "resourceDemands": [                 // at least 1 required
    {
      "resourceId": "machine-id",
      "units": 1
    }
  ]
}
```

---

## JSON STRUCTURE EXAMPLE

```json
{
  "materials": [
    {
      "id": "white-paste",
      "name": "White Paste",
      "comment": "Finished product"
    },
    {
      "id": "titanium",
      "name": "Titanium Dioxide",
      "comment": "Raw material"
    },
    {
      "id": "wax",
      "name": "Polyethylene Wax",
      "comment": "Raw material"
    }
  ],

  "machines": [
    {
      "id": "mixer-1",
      "name": "High Speed Mixer",
      "operatingCosts": {"type": "Constant", "value": 50},
      "isSpatial": false,
      "initialUnits": 3,
      "unitsAutoGrow": false
    }
  ],

  "products": [
    {
      "id": "white-paste-prod",
      "name": "White Paste",
      "material": {
        "version": 1,
        "id": "white-paste"
      }
    }
  ],

  "boms": [
    {
      "id": "white-paste-bom",
      "name": "White Paste BOM",
      "baseQuantity": 1000,
      "unitId": "kg",
      "items": [
        {
          "key": "1",
          "material": {"version": 1, "id": "titanium"},
          "quantity": 500
        },
        {
          "key": "2",
          "material": {"version": 1, "id": "wax"},
          "quantity": 300
        }
      ]
    }
  ],

  "processes": [
    {
      "id": "mixing-process",
      "name": "Mixing Process",
      "steps": [
        {
          "id": "step-1",
          "name": "Mixing",
          "processingTime": {
            "type": "Constant",
            "value": 900,
            "unitId": "s"
          },
          "resourceDemands": [
            {
              "resourceId": "mixer-1",
              "units": 1
            }
          ],
          "isParallelizable": false
        }
      ]
    }
  ],

  "recipes": [
    {
      "id": "white-paste-recipe",
      "name": "White Paste Recipe",
      "resultingMaterial": {"version": 1, "id": "white-paste"},
      "bom": {"version": 1, "id": "white-paste-bom"},
      "productionProcess": {"version": 1, "id": "mixing-process"}
    }
  ]
}
```

---

## KEY INSIGHTS

### 1. TWO BASE ARRAYS ONLY

- `materials[]` - All materials (raw, intermediate, finished)
- `machines[]` - All equipment/resources

### 2. CARDINALITY RULES

- **PRODUCT -> materials[]**: Always 1:1
- **RECIPE -> materials[]**: Always 1:1
- **BOM items -> materials[]**: N:1 (many items can use same material)
- **Steps -> machines[]**: N:M (many-to-many relationship)

### 3. MINIMUM REQUIREMENTS

- BOM must have >= 1 item
- PROCESS must have >= 1 step
- Each step must have >= 1 resourceDemand
- Each step must have processingTime (always Constant type)

### 4. ALL REFERENCES ARE ID-BASED

- Format: `{ id: "string-value" }`
- Not embedded objects
- Simple lookups

### 5. INPUT vs OUTPUT MATERIALS

- **Same `materials[]` array**
- Distinction is **logical only**, based on usage:
  - **OUTPUT**: Referenced by `RECIPE.resultingMaterial.id` and `PRODUCT.material.id`
  - **INPUT**: Referenced by `BOM.items[].material.id`
- Typically: BOM materials ≠ RECIPE output material
- Exception: Bulk/packaging scenarios (same material, different vessel)

### 6. RECIPE IS THE CENTRAL CONNECTOR

RECIPE connects three mandatory elements:
- **WHAT** to produce: `resultingMaterial` (links to materials[])
- **WHAT** ingredients needed: `bom` (links to BOMs)
- **HOW** to make it: `productionProcess` (links to processes[])

---

## VALIDATION RULES

### Referential Integrity

All ID references MUST point to existing entities:

| Reference | Must Exist In |
|-----------|---------------|
| `PRODUCT.material.id` | `materials[]` |
| `RECIPE.resultingMaterial.id` | `materials[]` |
| `RECIPE.bom.id` | `boms[]` |
| `RECIPE.productionProcess.id` | `processes[]` |
| `BOM.items[].material.id` | `materials[]` |
| `PROCESS.steps[].resourceDemands[].resourceId` | `machines[]` |

### Required Fields

| Entity | Required Fields |
|--------|-----------------|
| MATERIAL | id, name |
| MACHINE | id, name, operatingCosts, isSpatial, initialUnits, unitsAutoGrow |
| PRODUCT | id, name, material.id |
| BOM | id, name, baseQuantity, unitId, items[] (N>=1) |
| PROCESS | id, name, steps[] (N>=1) |
| PROCESS.STEP | id, name, processingTime, resourceDemands[] (N>=1), isParallelizable |
| RECIPE | id, name, resultingMaterial.id, bom.id, productionProcess.id |

---

## END OF DOCUMENT
