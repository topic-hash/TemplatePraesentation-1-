# SOP 03: JSONs in GRACE importieren

**Version:** 1.0
**Datum:** 13. Januar 2026
**Gültigkeitsbereich:** GRACE-Konfigurationsimport
**Verantwortlich:** Konfigurationsteam
**Zielgruppe:** Teammitglieder mit GRACE-Zugriff

---

## 1. Zweck und Geltungsbereich

### 1.1 Zweck
Diese SOP beschreibt den Import von generierten JSON-Konfigurationsdateien in das GRACE-System.

### 1.2 Geltungsbereich
- Anwendbar auf alle GRACE-Instanzen (Kunden und intern)
- Gilt für Neukonfigurationen und Updates
- Nutzung nach Abschluss von SOP 02 (Master Creator)

### 1.3 Ziele
- Fehlerfreier Import aller 6 Entity-Typen
- Überprüfung der Import-Ergebnisse
- Dokumentation von Problemen

---

## 2. Voraussetzungen

### 2.1 Technische Voraussetzungen
- [ ] GRACE-Zugriff (Login-Credentials)
- [ ] Browser (Chrome, Firefox, Edge)
- [ ] Stabile Internetverbindung (bei Cloud-Deployment)
- [ ] 6 JSON-Dateien aus SOP 02 verfügbar

### 2.2 Erforderliche Dateien
- [ ] `materials.json`
- [ ] `machines.json`
- [ ] `products.json`
- [ ] `processes.json`
- [ ] `boms.json`
- [ ] `recipes.json`

### 2.3 Zugangsdaten
- **URL:** [GRACE-Instanz-URL]
- **Benutzername:** [username]
- **Passwort:** [aus Credential-Manager]

---

## 3. Import-Ablauf

### 3.1 Import-Reihenfolge (WICHTIG!)

Die Import-Reihenfolge muss eingehalten werden, da Abhängigkeiten zwischen Entities bestehen:

| Schritt | Entity-Typ | Datei | Abhängigkeiten | Dauer (ca.) |
|---------|------------|-------|----------------|-------------|
| 1 | **Materials** | `materials.json` | Keine | 30 Sek. |
| 2 | **Machines** | `machines.json` | Keine | 30 Sek. |
| 3 | **Products** | `products.json` | Materials | 30 Sek. |
| 4 | **Processes** | `processes.json` | Optional: Machines | 1 Min. |
| 5 | **BOMs** | `boms.json` | Materials | 30 Sek. |
| 6 | **Recipes** | `recipes.json` | Materials, BOMs, Processes | 30 Sek. |

**Gesamtdauer:** ~4-5 Minuten

**Wichtig:** Wenn die Reihenfolge nicht eingehalten wird, schlagen Imports fehl (fehlende Referenzen).

---

### 3.2 Schritt 1: GRACE-System öffnen

1. Browser öffnen
2. GRACE-URL aufrufen
3. Login-Credentials eingeben
4. Auf "Configuration" oder "Import" navigieren

**Hinweis:** Genaue Navigation hängt von GRACE-Version ab.

---

### 3.3 Schritt 2: Materials importieren

1. **Import-Button für Materials suchen**
   - In GRACE-UI: "Import Materials" oder "Materials -> Import"

2. **Datei auswählen**
   - Klick auf "Browse" oder "Datei auswählen"
   - `materials.json` auswählen

3. **Import starten**
   - Klick auf "Import" oder "Upload"
   - Warten auf Bestätigung

4. **Erfolgsmeldung prüfen**
   - [OK] "Successfully imported X materials"
   - Bei Fehler: Siehe Abschnitt 7 (Fehlerbehebung)

5. **Importierte Materials prüfen**
   - In GRACE-UI: Materials-Liste öffnen
   - Anzahl prüfen (sollte mit Master Creator übereinstimmen)
   - Stichprobe: 2-3 Materials öffnen und Details prüfen

---

### 3.4 Schritt 3: Machines importieren

1. **Import-Button für Machines suchen**
2. **Datei auswählen:** `machines.json`
3. **Import starten**
4. **Erfolgsmeldung prüfen:** [OK] "Successfully imported X machines"
5. **Importierte Machines prüfen:**
   - initialUnits korrekt?
   - operatingCosts übernommen?

---

### 3.5 Schritt 4: Products importieren

**Voraussetzung:** Materials müssen bereits importiert sein!

1. **Import-Button für Products suchen**
2. **Datei auswählen:** `products.json`
3. **Import starten**
4. **Erfolgsmeldung prüfen:** [OK] "Successfully imported X products"
5. **Material-Referenzen prüfen:**
   - Öffne 1-2 Products
   - Prüfe ob Material korrekt verlinkt ist

**Häufiger Fehler:**
- [FEHLER] "Material not found: [material-id]"
- **Lösung 1:** Prüfen ob Version-Mismatch (siehe 7.2) - HÄUFIGSTE URSACHE!
- **Lösung 2:** Materials-Import wiederholen

---

### 3.6 Schritt 5: Processes importieren

**Voraussetzung:** Optional Machines (falls Process resourceDemands nutzt)

1. **Import-Button für Processes suchen**
2. **Datei auswählen:** `processes.json`
3. **Import starten**
4. **Erfolgsmeldung prüfen:** [OK] "Successfully imported X processes"
5. **Process-Steps prüfen:**
   - Öffne 1-2 Processes
   - Prüfe Anzahl Steps
   - Prüfe Zeitangaben (sollten in Sekunden sein)

**Zeiteinheiten-Check:**
- Alle processingTime.unitId sollten "s" sein
- Falls "min" erscheint: JSON war fehlerhaft

---

### 3.7 Schritt 6: BOMs importieren

**Voraussetzung:** Materials müssen bereits importiert sein!

1. **Import-Button für BOMs suchen**
2. **Datei auswählen:** `boms.json`
3. **Import starten**
4. **Erfolgsmeldung prüfen:** [OK] "Successfully imported X boms"
5. **BOM-Items prüfen:**
   - Öffne 1-2 BOMs
   - Prüfe baseQuantity
   - Prüfe Items (Material-Referenzen korrekt?)

**baseQuantity-Check:**
- Summe der Items sollte baseQuantity entsprechen
- Master Creator hat dies bereits korrigiert

---

### 3.8 Schritt 7: Recipes importieren

**Voraussetzung:** Materials, BOMs UND Processes müssen bereits importiert sein!

1. **Import-Button für Recipes suchen**
2. **Datei auswählen:** `recipes.json`
3. **Import starten**
4. **Erfolgsmeldung prüfen:** [OK] "Successfully imported X recipes"
5. **Recipe-Verknüpfungen prüfen:**
   - Öffne alle Recipes
   - Prüfe resultingMaterial (korrekt verlinkt?)
   - Prüfe BOM (korrekt verlinkt?)
   - Prüfe productionProcess (korrekt verlinkt?)

**Häufige Fehler:**
- [FEHLER] "BOM not found: [bom-id]"
- [FEHLER] "Process not found: [process-id]"
- [FEHLER] "Material not found" (in Recipe context)
- **Lösung 1:** Prüfen ob Version-Mismatch (siehe 7.2) - HÄUFIGSTE URSACHE!
- **Lösung 2:** Abhängigkeiten prüfen, ggf. vorherige Schritte wiederholen

---

## 4. Validierung nach Import

### 4.1 Vollständigkeits-Check

Nach Abschluss aller Imports prüfen:

| Entity-Typ | Soll (Master Creator) | Ist (GRACE) | Status |
|------------|----------------------|-------------|--------|
| Materials | [X] | [Y] | [ ] |
| Machines | [X] | [Y] | [ ] |
| Products | [X] | [Y] | [ ] |
| Processes | [X] | [Y] | [ ] |
| BOMs | [X] | [Y] | [ ] |
| Recipes | [X] | [Y] | [ ] |

**Soll = Ist?** -> [OK] Import erfolgreich
**Soll ≠ Ist?** -> [FEHLER] Fehlende Entities, Import wiederholen

### 4.2 Funktionstest (Stichprobe)

**Scenario:** Recipe vollständig auflösen

1. Recipe öffnen (z.B. "Purple Pigment Paste Recipe")
2. resultingMaterial öffnen -> sollte zu Material führen
3. BOM öffnen -> sollte Items mit Materials zeigen
4. productionProcess öffnen -> sollte Steps zeigen

**Erwartetes Ergebnis:**
- Alle Referenzen auflösbar
- Keine "Entity not found"-Fehler
- Zeitangaben in Sekunden

---

## 5. Import-Protokoll erstellen

Nach jedem Import-Vorgang dokumentieren:

### 5.1 Import-Protokoll Template

```markdown
# GRACE-Import Protokoll

**Datum:** [TT.MM.JJJJ HH:MM]
**Kunde/Werk:** [Name]
**GRACE-Instanz:** [URL]
**Importiert von:** [Name]

## Import-Details

| Entity-Typ | Anzahl (JSON) | Anzahl (GRACE) | Status | Fehler |
|------------|---------------|----------------|--------|--------|
| Materials | X | Y | [OK]/[FEHLER] | - |
| Machines | X | Y | [OK]/[FEHLER] | - |
| Products | X | Y | [OK]/[FEHLER] | - |
| Processes | X | Y | [OK]/[FEHLER] | - |
| BOMs | X | Y | [OK]/[FEHLER] | - |
| Recipes | X | Y | [OK]/[FEHLER] | - |

## Validierung
- [ ] Vollständigkeits-Check durchgeführt
- [ ] Funktionstest (Recipe-Auflösung) erfolgreich
- [ ] Keine Fehler in GRACE-Logs

## Probleme
[Liste aller aufgetretenen Probleme und Lösungen]

## Nächste Schritte
[Was muss noch getan werden?]
```

---

## 6. Qualitätssicherung

### 6.1 Checkliste: Import erfolgreich

- [ ] Alle 6 Entity-Typen importiert
- [ ] Anzahl Entities stimmt überein (Master Creator vs. GRACE)
- [ ] Stichproben-Funktionstest bestanden
- [ ] Keine Fehler in GRACE-Logs
- [ ] Import-Protokoll erstellt
- [ ] Kunde informiert (bei Kunden-Deployment)

### 6.2 GRACE-spezifische Checks

**Falls GRACE Validierungsfehler zeigt:**
- GRACE-Logs prüfen
- Fehlerhafte Entity identifizieren
- JSON-Datei korrigieren
- Import wiederholen

---

## 7. Fehlerbehebung

### 7.1 Häufige Import-Fehler

| Fehler | Ursache | Lösung |
|--------|---------|--------|
| **"Material not found"** (mit korrekter ID) | **VERSION-MISMATCH** (siehe 7.3!) | Versionen auf 1 normalisieren |
| **"Material not found"** (falsche Reihenfolge) | Products/BOMs vor Materials importiert | Materials zuerst importieren |
| **"BOM not found"** | Recipes vor BOMs importiert | Importreihenfolge einhalten |
| **"Process not found"** | Recipes vor Processes importiert | Importreihenfolge einhalten |
| **"Invalid ID format"** | ID enthält Großbuchstaben/Sonderzeichen | JSON korrigieren, neu importieren |
| **"Duplicate ID"** | Entity mit gleicher ID existiert bereits | Vorhandene Entity löschen oder ID ändern |
| **"Invalid unitId"** | Zeiteinheit nicht "s" | JSON korrigieren (min -> s) |
| **"baseQuantity mismatch"** | Summe ≠ baseQuantity | Sollte nicht passieren (Master Creator korrigiert) |

### 7.2 Version-Management Fehler (KRITISCH!)

**Häufigster Fehler nach Demo-Data-Analyse - Betrifft 90% der Import-Probleme**

#### Symptome

[OK] Materials importieren **erfolgreich**
[FEHLER] BOMs/Products/Recipes Import schlägt fehl: **"Material not found"**
- IDs sind **korrekt**
- Materials existieren in GRACE
- Importreihenfolge wurde **eingehalten**
- Trotzdem: "Material not found" Fehler

#### Ursache: Version-Mismatch

**GRACE-Verhalten:**
1. GRACE-Export erstellt Entities mit historischen Versionsnummern (v4, v5, v6)
2. Neuimport erstellt ALLE Entities als **Version 1**
3. Referenzen mit v4-v6 finden importierte Entities (v1) nicht

**Konkretes Beispiel aus Demo-Data:**

**Schritt 1: Materials importieren**
```json
// materials.json
{
  "id": "peg-400",
  "name": "PEG 400"
}
```
-> GRACE erstellt: `peg-400` mit **version 1**

**Schritt 2: BOMs importieren (FEHLER)**
```json
// boms.json (aus GRACE-Export)
{
  "items": [
    {
      "material": {
        "version": 6,  // [FEHLER] Sucht Version 6
        "id": "peg-400"
      }
    }
  ]
}
```
-> GRACE sucht: `peg-400` Version **6**
-> GRACE findet: `peg-400` Version **1**
-> **Fehler: "Material not found"**

#### Empirische Validierung (Demo-Config)

**Vor Version-Normalisierung:**
- 29 BOM items referenzierten Materials mit v5-v6
- 3 Products referenzierten Materials mit v4-v6
- **32 broken references gesamt**
- Import schlägt komplett fehl

**Nach Version-Normalisierung (alle -> v1):**
- **0 broken references**
- Import erfolgreich

#### Lösung A: Master Creator nutzen (EMPFOHLEN)

[OK] **Master Creator normalisiert automatisch alle Versionen auf 1**

Keine manuelle Korrektur erforderlich!

#### Lösung B: Manuelle Korrektur (falls Master Creator nicht verwendet)

**1. Betroffene Dateien identifizieren:**
```bash
# In Projektordner wechseln
cd /pfad/zu/jsons/

# Prüfen ob Version-Mismatches existieren
grep -r '"version": [2-9]' *.json

# Beispiel-Ausgabe (Problem vorhanden):
# boms.json:      "version": 6,
# boms.json:      "version": 5,
# products.json:  "version": 4,
```

**2. JSONs korrigieren:**

**boms.json - Alle Material-Referenzen:**
```json
// VORHER (fehlerhaft)
{
  "items": [
    {"material": {"version": 6, "id": "peg-400"}},
    {"material": {"version": 5, "id": "titanium-dioxide"}}
  ]
}

// NACHHER (korrekt)
{
  "items": [
    {"material": {"version": 1, "id": "peg-400"}},
    {"material": {"version": 1, "id": "titanium-dioxide"}}
  ]
}
```

**products.json - Material-Referenzen:**
```json
// VORHER (fehlerhaft)
{
  "material": {"version": 4, "id": "blue-pigment-paste"}
}

// NACHHER (korrekt)
{
  "material": {"version": 1, "id": "blue-pigment-paste"}
}
```

**recipes.json - resultingMaterial-Referenzen:**
```json
// VORHER (fehlerhaft)
{
  "resultingMaterial": {"version": 6, "id": "white-pigment-paste"}
}

// NACHHER (korrekt)
{
  "resultingMaterial": {"version": 1, "id": "white-pigment-paste"}
}
```

**3. Validierung nach Korrektur:**
```bash
# Erneut prüfen - sollte LEER sein
grep -r '"version": [2-9]' *.json

# Keine Ausgabe = alles korrekt
```

**4. Import wiederholen:**
- Import-Ablauf von vorne starten (Schritt 3.2 - 3.8)
- Sollte jetzt funktionieren

#### Warum passiert das?

**Fragmentiertes Wissen manifestiert sich in Daten:**

Demo-Data-Analyse zeigte:
- 48% duplicate materials
- 3 simultane ID-Konventionen (numeric, UUID, kebab-case)
- Version-Inkonsistenzen v1-v6
- Fehlende standardisierte Export/Import-Procedures

**Root Cause:** Kein zentrales Konfigurations-Management, kein Governance

**Master Creator löst dies durch:**
- Konsistente ID-Konvention (kebab-case)
- Version-Normalisierung (alle v1)
- 6-Punkte Validierungs-Checkliste
- Automatische Referential Integrity Checks

---

### 7.3 GRACE-Instabilität

**Problem:** GRACE in Pilotphase, Bugs möglich

**Symptome:**
- Import schlägt ohne Fehlermeldung fehl
- Entities verschwinden nach Import
- UI zeigt falsche Anzahl

**Lösungsansätze:**
1. GRACE neu laden (F5)
2. Browser-Cache leeren
3. In anderem Browser testen
4. GRACE-Support kontaktieren
5. Import zu späterem Zeitpunkt wiederholen

**Dokumentation:**
- Alle Fehler im Import-Protokoll festhalten
- Screenshots von Fehlermeldungen
- An Entwicklungsteam weitergeben

---

## 8. Nach dem Import

### 8.1 Kunde informieren

**E-Mail-Template:**

```
Betreff: GRACE-Konfiguration erfolgreich importiert

Hallo [Kundenname],

die Konfiguration für [Werkname] wurde erfolgreich in GRACE importiert:

- Materials: [X]
- Machines: [X]
- Products: [X]
- Processes: [X]
- BOMs: [X]
- Recipes: [X]

Die Konfiguration ist nun bereit für erste Tests.

Nächste Schritte:
- [...]

Bei Fragen stehe ich gerne zur Verfügung.

Beste Grüße,
[Name]
```

### 8.2 Interne Dokumentation

- Import-Protokoll in Projektordner ablegen
- Git-Commit mit Zeitstempel
- Eintrag im Projektmanagement-Tool

---

## 9. Anhang

### 9.1 GRACE-Systeminfo

**GRACE ist:**
- APS-System (Advanced Planning & Scheduling)
- In Pilotphase (7 Werke)
- Entwicklungsbedingte Instabilitäten möglich

**GRACE ist NICHT:**
- Teil dieser SOP (Out of Scope)
- Vollständig stabil
- Feature-complete

**Wichtig:** Bei GRACE-Problemen nicht die Konfiguration in Frage stellen, sondern GRACE-Entwicklung kontaktieren.

### 9.2 Support-Kontakte

**Bei JSON-Problemen:**
- Konfigurationsteam kontaktieren
- Master Creator erneut nutzen

**Bei GRACE-Problemen:**
- GRACE-Support kontaktieren
- Entwicklungsteam informieren

### 9.3 Typische Import-Dauer

| Konfigurationsgröße | Gesamtdauer |
|---------------------|-------------|
| **Klein** (3 Produkte) | ~5 Min. |
| **Mittel** (10 Produkte) | ~10 Min. |
| **Groß** (20+ Produkte) | ~20 Min. |

**Hinweis:** Reine Import-Zeit, ohne Validierung

---

## 10. Revisionsverlauf

| Version | Datum | Änderungen | Autor |
|---------|-------|------------|-------|
| 1.0 | 13.01.2026 | Initiale Erstellung | Konfigurationsteam |
| 1.1 | 23.01.2026 | + Version-Management Fehler-Sektion (7.2) - kritischer Import-Blocker aus Demo-Data Analyse | Konfigurationsteam |

---

**Ende SOP 03**
