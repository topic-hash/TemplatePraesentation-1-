# SOP 02: Master Creator nutzen

**Version:** 1.0
**Datum:** 13. Januar 2026
**Gültigkeitsbereich:** GRACE-Konfigurationsgenerierung
**Verantwortlich:** Konfigurationsteam
**Zielgruppe:** Teammitglieder, die GRACE-Konfigurationen erstellen

---

## 1. Zweck und Geltungsbereich

### 1.1 Zweck
Diese SOP beschreibt die Nutzung des Master Creator zur automatisierten Generierung von GRACE-Konfigurationsdaten aus Workshop-Protokollen.

### 1.2 Geltungsbereich
- Anwendbar auf alle GRACE-Konfigurationen
- Gilt für Neukonfigurationen und Rekonfigurationen
- Nutzung nach Abschluss von SOP 01 (Kundenworkshop)

### 1.3 Ziele
- Systematische Umwandlung von Workshop-Informationen in JSON-Entities
- Qualitätssicherung durch integrierte Validierung
- Zeitersparnis gegenüber manueller JSON-Erstellung

---

## 2. Voraussetzungen

### 2.1 Technische Voraussetzungen
- [ ] Ollama installiert und laufend
- [ ] qwen2.5-coder:7b Modell verfügbar
- [ ] Master Creator Webanwendung verfügbar (Port 9000)
- [ ] Workshop-Protokoll aus SOP 01 vorliegend

### 2.2 Erforderliche Unterlagen
- [ ] Workshop-Protokoll (ausgefüllt)
- [ ] Entity-Mapping-Workbook (Referenz)
- [ ] 6-Punkte-Validierungs-Checkliste

### 2.3 Systemstart

**Ollama-Service starten:**
```bash
# Prüfen ob Ollama läuft
ollama list

# Falls nicht gestartet:
ollama serve
```

**Master Creator starten:**
```bash
cd /pfad/zum/master-creator
python -m http.server 9000
```

**Im Browser öffnen:**
```
http://localhost:9000
```

---

## 3. Arbeitsablauf

### 3.1 Übersicht der Schritte

Der Master Creator generiert 6 Entity-Typen in empfohlener Reihenfolge:

| Schritt | Entity-Typ | Abhängigkeiten | Eingabe |
|---------|------------|----------------|---------|
| 1 | **Materials** | Keine | Materialliste aus Workshop |
| 2 | **Machines** | Keine | Maschinenliste aus Workshop |
| 3 | **Products** | Materials (auto-erstellt) | Produktliste aus Workshop |
| 4 | **Processes** | Optional: Machines | Prozessschritte mit Zeitangaben |
| 5 | **BOMs** | Materials (auto-erstellt) | Stücklisten mit Mengen |
| 6 | **Recipes** | Materials, BOMs, Processes | Verknüpfungen |

**Wichtig:** Die Reihenfolge sollte eingehalten werden, da Recipes von allen anderen Entities abhängen.

---

### 3.2 Schritt 1: Materialien erstellen

**Ziel:** Alle Rohstoffe, Zwischen- und Endprodukte als Materials anlegen.

**Eingabe-Format:**
```
Ich benötige folgende Materialien:
- Titanium Dioxide (Weißpigment)
- PEG 400 (Polyethylenglykol)
- Tego (Additiv)
```

**Erwartetes Verhalten:**
- Master Creator erkennt Entity-Typ: MATERIAL
- Generiert JSON-Block für jedes Material
- Zeigt Bestätigung: "✅ Created material: [Name]"

**Anzahl Materials im Sidebar prüfen:**
- Rechte Sidebar zeigt "Materials: X"

**WARNUNG - Duplikate vermeiden:**
Demo-Data-Analyse zeigte: **48% duplicate materials** (13 von 27) durch fragmentiertes Wissen.

**Beispiel:** "PEG 400" existierte als `"3"` UND `3fc65fab-c139-...` → niemand wusste von Duplikaten

**Best Practice:**
- Vor dem Erstellen: Prüfen ob Material bereits existiert
- Konsistente Namenskonvention verwenden (kebab-case)
- Master Creator verhindert Duplikate innerhalb einer Session

**Tipps:**
- Mehrere Materialien können in einer Nachricht eingegeben werden
- Bei unklaren Einheiten: später in BOM präzisieren
- Kommentare optional, nur bei wichtigen Zusatzinfos

**Beispiel-Interaktion:**
```
User: "Ich brauche Titanium Dioxide, PEG 400 und Tego"
AI: [ENTITY_TYPE: material]
    I'll create Titanium Dioxide as a material.
    [JSON Block]
    ✅ Created material: Titanium Dioxide
    ✅ Created material: PEG 400
    ✅ Created material: Tego
```

---

### 3.3 Schritt 2: Maschinen erstellen

**Ziel:** Alle Produktionsanlagen als Machines anlegen.

**Eingabe-Format:**
```
Wir haben folgende Maschinen:
- 1 High Speed Mixer
- 2 Dissolver
- 1 Pump
- 1 Pipe System
```

**Erwartetes Verhalten:**
- Master Creator erkennt Schlüsselwörter ("mixer", "dissolver", "pump", "pipe")
- Generiert separate JSON-Blöcke für jede Maschine
- Setzt `initialUnits` korrekt (1, 2, 1, 1)
- Standardwerte: `operatingCosts: 0`, `isSpatial: false`, `unitsAutoGrow: false`

**Bei bekannten Betriebskosten:**
```
Wir haben 3 Mixer mit Betriebskosten von 50€/Stunde
```

**Tipps:**
- Betriebskosten können 0 sein (werden später optional ergänzt)
- Mehrere identische Maschinen: Als eine Machine mit `initialUnits: X` anlegen
- Verschiedene Maschinen: Separate Entities erstellen

---

### 3.4 Schritt 3: Produkte erstellen

**Ziel:** Alle hergestellten Endprodukte als Products anlegen.

**Eingabe-Format (WICHTIG: Schlüsselwort "produce"):**
```
Wir produzieren Blue Pigment Paste
```

**Erwartetes Verhalten:**
- Master Creator erkennt "produce" → Entity-Typ: PRODUCT
- Generiert Product-Entity
- **Erstellt automatisch zugehöriges Material** (blue-pigment-paste)
- Zeigt: "🔄 Auto-created material: blue-pigment-paste"
- Zeigt: "✅ Created product: Blue Pigment Paste"

**KRITISCH:**
```json
{
  "id": "blue-pigment-paste-prod",
  "material": {
    "id": "blue-pigment-paste"  // Produkt selbst, NICHT Zutat!
  }
}
```

**Tipps:**
- Immer Schlüsselwort "produce" oder "manufacture" verwenden
- Material wird automatisch mit gleichem Namen erstellt
- Wenn Material schon existiert: Keine Fehlermeldung, wird referenziert

---

### 3.5 Schritt 4: Prozesse erstellen

**Ziel:** Produktionsabläufe mit Prozessschritten und Zeitangaben definieren.

**Eingabe-Format:**
```
Der Prozess für Blue Pigment Paste ist:
Dosing 5 min, Mixing 15 min, Dispersion 10 min, Filtration 20 min
```

**Erwartetes Verhalten:**
- Master Creator erkennt Prozessschritte mit Zeitangaben
- **Rechnet Minuten automatisch in Sekunden um**
- Generiert Process-Entity mit Steps-Array
- Alle Steps haben `unitId: "s"` (Sekunden!)

**Zeitumrechnung (automatisch):**
| Eingabe | Umgerechnet |
|---------|-------------|
| 5 min | 300 s |
| 10 min | 600 s |
| 15 min | 900 s |
| 20 min | 1200 s |

**Process-ID-Konvention:**
- Prozessname in lowercase mit Bindestrichen
- Beispiel: "Dosing Mixing Dispersion Filtration" → `dosing-mixing-dispersion-filtration`

**Tipps:**
- Zeitangaben können auch in Stunden sein (werden umgerechnet)
- `resourceDemands` bleibt leer (Maschinen optional zuweisen)
- Prozessschritte sind sequenziell (Array-Reihenfolge)

---

### 3.6 Schritt 5: Stücklisten (BOMs) erstellen

**Ziel:** Materialzusammensetzung für jedes Produkt definieren.

**Eingabe-Format:**
```
Für Blue Pigment Paste BOM:
Grey Pigment 10g, Titanium Dioxide 60g, PEG 400 10g, Tego 20g
```

**Erwartetes Verhalten:**
- Master Creator erkennt Schlüsselwort "BOM" → Entity-Typ: BOM
- Generiert BOM mit Items-Array
- **Berechnet baseQuantity automatisch** (10+60+10+20 = 100g)
- Erstellt fehlende Materialien automatisch
- Zeigt: "🔧 Auto-corrected baseQuantity from [falsch] to [richtig]" (falls AI falsch rechnet)

**Beispiel-Ausgabe:**
```json
{
  "id": "blue-pigment-paste-bom",
  "baseQuantity": 100,  // Automatisch berechnet!
  "unitId": "g",
  "items": [
    {"key": "1", "material": {"id": "grey-pigment"}, "quantity": 10},
    {"key": "2", "material": {"id": "titanium-dioxide"}, "quantity": 60},
    {"key": "3", "material": {"id": "peg-400"}, "quantity": 10},
    {"key": "4", "material": {"id": "tego"}, "quantity": 20}
  ]
}
```

**Tipps:**
- LLMs sind schlecht in Mathematik → JavaScript berechnet baseQuantity
- Alle Mengen müssen in derselben Einheit sein
- Fehlende Materialien werden automatisch erstellt

---

### 3.7 Schritt 6: Rezepte erstellen

**Ziel:** BOM, Process und resultierendes Material zu einem Recipe verknüpfen.

**Eingabe-Format:**
```
Erstelle Recipe für Blue Pigment Paste
```

**Erwartetes Verhalten:**
- Master Creator nutzt **Session-Context**
- Zeigt existierende Entities:
  ```
  ═══ EXISTING ENTITIES IN THIS SESSION ═══
  Materials: blue-pigment-paste, grey-pigment, titanium-dioxide, peg-400, tego
  BOMs: blue-pigment-paste-bom
  Processes: dosing-mixing-dispersion-filtration
  ═══════════════════════════════════════
  ```
- Matcht automatisch:
  - resultingMaterial: blue-pigment-paste
  - bom: blue-pigment-paste-bom
  - productionProcess: dosing-mixing-dispersion-filtration
- Generiert Recipe-Entity

**Validierung vor Recipe-Erstellung:**
- Alle 3 abhängigen Entities müssen existieren
- Fehlermeldung bei fehlenden Abhängigkeiten:
  ```
  ❌ Recipe cannot be created. Missing:
  - BOM: blue-pigment-paste-bom
  - Process: dosing-mixing-dispersion-filtration
  ```

**Tipps:**
- Recipes immer als letztes erstellen
- Bei Fehlern: Prüfen ob BOM und Process existieren
- Process-ID ohne "-process" Suffix!

---

## 4. Chat-Zusammenfassung generieren

**Zweck:** Automatische Dokumentation des Konfigurationsprozesses.

**Vorgehen:**
1. Auf Button "📝 Chat zusammenfassen" klicken
2. Master Creator generiert strukturierte Zusammenfassung:
   - Werk-Informationen
   - Alle erstellten Materialien
   - Alle erstellten Maschinen
   - Alle erstellten Produkte
   - Alle erstellten Prozesse
   - Alle erstellten BOMs
   - Alle erstellten Rezepte
   - Offene Punkte
3. Zusammenfassung als Markdown speichern

**Verwendung:**
- Als Projektdokumentation
- Für Kundenkommunikation
- Zur Übergabe an andere Teammitglieder

---

## 5. Validierung durchführen

### 5.1 Integrierte Validierung

Der Master Creator führt automatisch folgende Validierungen durch:

**Während der Generierung:**
- ID-Format prüfen (lowercase-with-hyphens)
- Zeiteinheiten prüfen (muss "s" sein)
- BOM baseQuantity auto-korrigieren
- Referenzen prüfen (bei Recipes)
- **Version-Normalisierung** (alle Entities auf v1)

**Manuell ausführen:**
1. Button "✅ Validieren" klicken
2. Master Creator prüft:
   - Product → Material Referenzen
   - BOM → Material Referenzen
   - Recipe → Material, BOM, Process Referenzen
3. Ausgabe:
   - "✅ Configuration is valid!" oder
   - "❌ Validation errors: [Liste]"

### 5.3 Version-Management (WICHTIG!)

**Automatische Version-Normalisierung:**
Master Creator setzt alle Entity-Versionen auf `1` in allen Referenzen.

**Hintergrund:**
GRACE-Exports enthalten historische Versionsnummern (v4, v5, v6), aber bei einem Neuimport werden alle Entities als Version 1 erstellt.

**Demo-Data Validation:**
In geretteten demo-configs führten Version-Mismatches zu **32 broken references**:
- 29 BOM items referenzierten Materials mit v5-v6
- 3 Products referenzierten Materials mit v4-v6
- Nach Import: Alle Materials existieren nur als v1
- Ergebnis: Import schlägt fehl

**Beispiel:**
```json
// ❌ GRACE-Export (fehlerhaft für Neuimport)
{
  "material": {"version": 6, "id": "peg-400"}
}

// ✅ Master Creator Output (korrekt)
{
  "material": {"version": 1, "id": "peg-400"}
}
```

**Automatische Korrektur:**
Master Creator normalisiert alle Versionen in:
- BOMs (items[].material.version)
- Products (material.version)
- Recipes (resultingMaterial.version)

**Ergebnis:** 32 broken → 0 broken references

### 5.2 6-Punkte-Checkliste (manuell prüfen)

Vor dem Export prüfen:

| Nr. | Prüfpunkt | Status |
|-----|-----------|--------|
| 1 | **Vollständigkeit**: Alle 6 Entity-Typen vorhanden? | ☐ |
| 2 | **ID-Konsistenz**: Keine kaputten Referenzen? | ☐ |
| 3 | **Zeiteinheiten**: Alle Prozess-Steps haben `unitId: "s"`? | ☐ |
| 4 | **BOM baseQuantity**: Summe korrekt? (auto-korrigiert) | ☐ |
| 5 | **Product Material**: Referenziert Produkt selbst, nicht Zutat? | ☐ |
| 6 | **ID-Duplikate**: Keine doppelten IDs? | ☐ |

---

## 6. Export durchführen

### 6.1 Export-Optionen

**Option A: Einzelexport (empfohlen für GRACE-Import)**
1. Auf Tab der jeweiligen Entity klicken (Materials, Machines, etc.)
2. Button "💾 Download [Entity-Type]" klicken
3. Dateien werden einzeln exportiert:
   - `materials.json`
   - `machines.json`
   - `products.json`
   - `processes.json`
   - `boms.json`
   - `recipes.json`

**Option B: Gesamtexport**
1. Button "💾 Download All" klicken
2. Datei: `aps-all-{timestamp}.json`
3. Enthält alle Entities in einem JSON-Objekt

---

## 6.3 Manuelle Nacharbeit (1-2 Stunden) - Scaffolding Approach

**80/20 Prinzip:**
Der Master Creator generiert **80% der Konfiguration automatisch** in ~5% der Zeit (5-6.5h).
Die verbleibenden **20% erfordern manuelle Nacharbeit** (1-2h).

### Was ist AUTOMATISCH generiert?

✅ **Vollständig automatisiert:**
- Materials mit IDs und Namen
- Machines mit initialUnits und operatingCosts
- Products mit Material-Referenzen
- Processes mit Steps und Zeitformeln (BinaryOperations)
- BOMs mit Items und auto-korrigiertem baseQuantity
- Recipes mit korrekten Verknüpfungen
- Referential Integrity (alle IDs korrekt, keine broken references)
- Version-Normalisierung (alle v1)

### Was erfordert MANUELLE Ergänzung?

⚠️ **Manuelle Nacharbeit (1-2h):**

**1. Process Links (Schritt-Reihenfolge):**
- Master Creator generiert Steps als sequenzielles Array
- Komplexe Abhängigkeiten (parallel/conditional) müssen manuell hinzugefügt werden
- Beispiel: `processLinks` für parallele Ausführung von Steps

**2. resourceRequirements (bedingte Maschinenzuweisung):**
- Master Creator lässt `resourceDemands` leer
- Manuelle Zuweisung: Welcher Step benötigt welche Maschine?
- Conditional logic (z.B. "verwende Mixer 1 ODER Mixer 2")

**3. itemAssociationsRules (erweiterte BOM-Mappings):**
- Recipes werden ohne `itemAssociations` generiert
- Manuelle Ergänzung für präzise Material-Step-Zuordnungen
- Beispiel: "Dosiere Material X in Step 1, Material Y in Step 2"

**4. Material-Attribute (spezifische Eigenschaften):**
- Master Creator erstellt Basis-Struktur (ID, Name)
- Erweiterte Attribute manuell ergänzen:
  - Lagerbedingungen
  - Sicherheitsdatenblätter
  - Lieferanteninformationen
  - Qualitätsparameter

### Zeit-Verhältnis (empirisch validiert)

| Phase | Dauer | Abdeckung | Methode |
|-------|-------|-----------|---------|
| Master Creator | 5-6.5h | 80% | Automatisch (LLM) |
| Manuelle Nacharbeit | 1-2h | 20% | Manuell (JSON-Editing) |
| **GESAMT** | **6.5-8.5h** | **100%** | **Kombiniert** |

**Vergleich zur manuellen Konfiguration:**
- Manuell: 8 Wochen (320h aktive Arbeit)
- Mit Master Creator: 6.5-8.5h
- **Reduktion: 94-97% aktive Arbeitszeit**

### Warum nicht 100% automatisch?

**Design-Entscheidung (MVP-Prioritierung):**
- Process links, resourceRequirements und itemAssociations sind **technisch machbar** durch LLM
- Zeit-begrenzte System-Prompt-Entwicklung fokussierte auf häufigste 80%
- Prompting-Flexibilität beweist: Fehlende Features sind durch erweiterte Prompts erreichbar

**Empirische Validierung:**
Demo-Data-Analyse zeigt erfolgreiche Generierung von:
- Variable time formulas (BinaryOperations mit `TotalQuantityOfAssignedBomItems`)
- Complex BOMs (9-10 ingredients, 2.25× mehr als simplified examples)
- Batch sizes 1155 kg (2.31× größer als examples)
- 32 cross-entity references (0 broken)

### 6.2 Export-Verzeichnis

**Empfohlene Struktur:**
```
/kunden/[kundenname]/
  ├── workshop-protokoll.md
  ├── chat-zusammenfassung.md
  ├── materials.json
  ├── machines.json
  ├── products.json
  ├── processes.json
  ├── boms.json
  └── recipes.json
```

---

## 7. Häufige Probleme und Lösungen

| Problem | Ursache | Lösung |
|---------|---------|--------|
| **AI antwortet nicht** | Ollama nicht gestartet | `ollama serve` ausführen |
| **"produce" wird als Material erkannt** | Schlüsselwort fehlt | Explizit "We produce X" schreiben |
| **BOM baseQuantity falsch** | AI-Rechenfehler | Wird automatisch korrigiert! |
| **Recipe kann nicht erstellt werden** | BOM oder Process fehlt | Prüfen: Existieren alle Abhängigkeiten? |
| **Process-ID mit "-process" Suffix** | AI-Fehler (v1.5) | Manuellin JSON korrigieren oder neu generieren |
| **Zeiteinheit "min" statt "s"** | Sollte nicht passieren (v2.0) | Falls doch: Manuell korrigieren |
| **Mehrere Maschinen als eine Entity** | Input unklar | "3 mixer" → initialUnits: 3, nicht 3 separate |

---

## 8. Qualitätssicherung

### 8.1 Checkliste: Konfiguration vollständig

Nach Abschluss der Generierung prüfen:

- [ ] Mindestens 3 Materials erstellt
- [ ] Mindestens 2 Machines erstellt
- [ ] Mindestens 1 Product erstellt
- [ ] Mindestens 1 Process erstellt (mit min. 3 Steps)
- [ ] Mindestens 1 BOM erstellt
- [ ] Mindestens 1 Recipe erstellt
- [ ] Integrierte Validierung durchgeführt (✅ grün)
- [ ] 6-Punkte-Checkliste manuell geprüft
- [ ] Chat-Zusammenfassung generiert und gespeichert
- [ ] Alle 6 JSON-Dateien exportiert

### 8.2 Typische Werte für Demo-Werk

Als Orientierung (aus Demo-Werk):

| Entity-Typ | Typische Anzahl |
|------------|-----------------|
| Materials | 20-30 |
| Machines | 10-20 |
| Products | 3-5 |
| Processes | 1-3 |
| BOMs | 3-5 |
| Recipes | 3-5 |

---

## 9. Übergabe an nächsten Prozessschritt

### 9.1 Ausgabe von SOP 02
- ✅ 6 JSON-Dateien (einzeln exportiert)
- ✅ Chat-Zusammenfassung (Markdown)
- ✅ Validierungsprotokoll (grün = OK)

### 9.2 Nächster Prozessschritt
→ **SOP 03: JSONs in GRACE importieren**
- JSON-Dateien werden in GRACE hochgeladen
- Import-Buttons in GRACE-UI nutzen

---

## 10. Anhang

### 10.1 Referenzdokumente
- **Entity-Mapping-Workbook**: Vollständige JSON-Schema-Dokumentation
- **COMPLETE-VERSION-HISTORY.md**: Master Creator Entwicklungshistorie
- **master-creator/README.md**: Technische Dokumentation

### 10.2 Keyboard Shortcuts
- **Enter**: Nachricht absenden
- **Tab-Wechsel**: Klick auf Entity-Tab (Materials, Machines, etc.)

### 10.3 Beispiel-Session

Komplette Session für "Purple Pigment Paste":

```
1. User: "Ich brauche Grey Pigment, Titanium Dioxide, PEG 400, Tego"
   → ✅ 4 Materials erstellt

2. User: "Wir haben 1 Dissolver, 1 Pump, 1 Mixer"
   → ✅ 3 Machines erstellt

3. User: "Wir produzieren Purple Pigment Paste"
   → ✅ Product + Material auto-erstellt

4. User: "Prozess: Dosing 5min, Mixing 15min, Dispersion 10min, Filtration 20min"
   → ✅ Process mit 4 Steps erstellt (Zeit in Sekunden)

5. User: "BOM für Purple Pigment Paste: Grey Pigment 10g, Titanium Dioxide 60g, PEG 400 10g, Tego 20g"
   → ✅ BOM erstellt, baseQuantity auto-korrigiert auf 100g

6. User: "Erstelle Recipe für Purple Pigment Paste"
   → ✅ Recipe erstellt (nutzt Session-Context)

7. Klick auf "✅ Validieren" → Alle OK
8. Klick auf "📝 Chat zusammenfassen" → Zusammenfassung generiert
9. Klick auf "💾 Download All" → aps-all-{timestamp}.json
```

**Gesamtdauer:** ~10-15 Minuten

---

## 11. Revisionsverlauf

| Version | Datum | Änderungen | Autor |
|---------|-------|------------|-------|
| 1.0 | 13.01.2026 | Initiale Erstellung basierend auf Master Creator v2.0 | Konfigurationsteam |
| 1.1 | 23.01.2026 | + Version-Normalisierung, Scaffolding Approach, Duplicate Warning (Demo-Data Erkenntnisse) | Konfigurationsteam |

---

**Ende SOP 02**