# Präsentations-Proposal: GRACE-Konfigurationsprozess
## Bachelorarbeit Kolloquium - 20 Minuten

**Autor:** Aleksandar Topić
**Datum:** März 2026
**Zielgruppe:** Akademisch mit Business-Fokus
**Format:** LaTeX Beamer (VK Template)
**Sprache:** Deutsch mit englischen Fachbegriffen

---

## Roter Faden der Präsentation

**Kernbotschaft:** Von fragmentiertem Wissen zu strukturierter, LLM-gestützter Automatisierung – Eine praxisvalidierte Drei-Artefakte-Architektur für APS-Konfiguration

**Narrative Structure:**
1. **Problem** → Fragmentiertes Wissen blockiert Skalierung und Delegieren von Arbeit
2. **Forschungsfragen** → Wie externalisieren, welche Artefakte, wie automatisieren?
3. **Methodik** → Action Research mit iterativer Artefakt-Entwicklung
4. **Lösung** → Drei-Artefakte-Architektur (Fragebogen → Workbook → SOPs)
5. **Innovation** → Master Creator (LLM-gestützte Automatisierung)
6. **Validierung** → 47% Zeitersparnis, 81% Fehlerreduktion, 98,1% Vollständigkeit
7. **Ausblick** → Transferierbarkeit auf andere Enterprise-Systeme

---

## Folienstruktur (19 Folien, ~20 Minuten)

### **TEIL 1: EINFÜHRUNG & KONTEXT** (4 Min, Folien 1-4)

#### **Folie 1: Titelfolie** ⏱️ 30 Sek
**Layout:** VK Blue Background
```latex
\title{GRACE-Konfigurationsprozess: Erhebung, Dokumentation und Optimierung}
\subtitle{mittels systematischer Wissenserfassung und LLM-gestützter Automatisierung}
\author{Aleksandar Topić (677502)}
\institute{Hochschule Worms · Fachbereich Informatik\\
Bachelorarbeit im Unternehmen seitcom GmbH}
```

**Sprechernotizen:**
- Begrüßung
- Thema vorstellen: Optimierung eines komplexen Konfigurationsprozesses
- Unternehmen: seitcom GmbH, GRACE APS-System

---

#### **Folie 2: Agenda** ⏱️ 30 Sek
**Layout:** Table of Contents Style
```
1. Einführung & Problemstellung
2. Forschungsfragen & Zielsetzung
3. Methodisches Vorgehen (Action Research)
4. Drei-Artefakte-Architektur
   → Fragebogen, Entity Mapping, SOPs
5. Master Creator (LLM-Tool)
6. Evaluation & Ergebnisse
7. Fazit & Ausblick
```

**Visuelle Elemente:**
- Nummerierte Liste mit Icons
- Hervorhebung der Eigenleistung (Punkt 4-5)

**Sprechernotizen:**
- Schneller Überblick über Struktur
- Betonen: Fokus auf Eigenleistung (Artefakte + Master Creator)
- Timeboxing: "In den nächsten 20 Minuten..."

---

#### **Folie 3: GRACE & seitcom GmbH** ⏱️ 1 Min
**Layout:** Two-column (Text links, Grafik rechts)

**Inhalt Links:**
- **GRACE** = Green Renewable AI-powered Computing Environment
- Advanced Planning and Scheduling (APS) System
- Revolutioniert industrielle Produktionsplanung
- **Unterschied zu ERP:** Nicht nur grobe Planung, sondern CO₂-optimierte Feinplanung

**Pilotphase:**
- 7 Kundenwerke
- 5-köpfiges Konfigurationsteam
- 6-8 Wochen manchmal sogar Monate initiale Konfiguration pro Kunde

**Inhalt Rechts:**

**Sprechernotizen:**
- GRACE ist nicht "nur" ein weiteres APS-System
- Möglichkeit von hoher Komplexität beim Modellieren/Konfigurieren macht es aufwendig
- Kleines Team, hoher Konfigurationsaufwand → Skalierungsproblem

---

#### **Folie 4: Problemstellung** ⏱️ 2 Min
**Layout:** Problem-focused mit Icons/Grafiken

**Zentrale Herausforderung:**
```
┌─────────────────────────────────────┐
│  FRAGMENTIERTES WISSEN              │
│  ≈ "Code as Documentation"          │
└─────────────────────────────────────┘
```

**Drei konkrete Probleme (mit Icons):**

1. **📊 Komplexität**
   - 6 Entitätstypen (Materials, Machines, Products, Processes, BOMs, Recipes)
   - Komplexe Abhängigkeiten und Validierungsregeln
   - Keine Single Source of Truth

2. **🔀 Fragmentierung**
   - Wissen verteilt: Azure DevOps Wikis, E-Mails, Git-Historie, persönliche Erfahrung
   - Keine strukturierte Dokumentation
   - Hohe Abhängigkeit von wenigen Experten

3. **⏰ Konsequenzen**
   - **6-8 Wochen** manchmal sogar Monate initiale Konfiguration
   - **10-15 Fehler** pro Iteration
   - **60-70%** Vollständigkeit (Ist-Analyse)
   - Mehrere Überarbeitungsschleifen

**Visuelle Elemente:**
- Datenblöcke (`\dblock`) für Zahlen
- Icons für die drei Problemfelder
- Evtl. Diagramm: Fragmentierung visualisieren

**Sprechernotizen:**
- Polanyi [1966]: "We can know more than we can tell" → Tacit Knowledge
- Konkret: Konfigurationsmitarbeiter wissen intuitiv Validierungsregeln, aber nicht dokumentiert
- Levallet & Chan [2019]: Wissensverlust bei Mitarbeiterwechsel ohne Externalisierung
- Problem betrifft BEIDE Seiten: Intern (seitcom) UND Kunden

---

### **TEIL 2: FORSCHUNG & METHODIK** (4 Min, Folien 5-7)

#### **Folie 5: Forschungsfragen** ⏱️ 1,5 Min
**Layout:** Numbered boxes mit Highlighting

**Vier zentrale Forschungsfragen:**

```
╔══════════════════════════════════════════════════════════╗
║ FF1: Systematische Wissensexternalisierung              ║
║ Wie kann fragmentiertes Konfigurationswissen            ║
║ systematisch externalisiert werden?                     ║
╚══════════════════════════════════════════════════════════╝

┌──────────────────────────────────────────────────────────┐
│ FF2: Notwendige Artefakte                                │
│ Welche Artefakte sind für reproduzierbaren               │
│ Wissenstransfer erforderlich?                            │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ FF3: LLM-gestützte Automatisierung                       │
│ Inwieweit kann LLM-Automatisierung den                   │
│ Konfigurationsprozess optimieren?                        │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ FF4: Quantifizierbare Verbesserungen                     │
│ Welche Verbesserungen bei Zeit, Vollständigkeit          │
│ und Fehlerrate sind erreichbar?                          │
└──────────────────────────────────────────────────────────┘
```

**Mapping:**
- FF1 + FF2 → **Theorie** (Wissensexternalisierung)
- FF3 → **Praxis** (LLM-Automatisierung)
- FF4 → **Empirische Validierung**

**Sprechernotizen:**
- FF1+FF2: Konzeptionelle Dimension (WIE externalisieren, WAS braucht man)
- FF3: Praktische Umsetzung (KI-gestützte Automatisierung)
- FF4: Empirischer Nachweis (messbare Verbesserungen)
- Alle vier Fragen bilden zusammen den Untersuchungsrahmen

---

#### **Folie 6: Zielsetzung** ⏱️ 1 Min
**Layout:** Three-goal structure

**Drei komplementäre Ziele:**

**🎯 Primärziel:**
Entwicklung einer **Drei-Artefakte-Architektur** zur systematischen Wissensexternalisierung
- Strukturierter Erhebungsfragebogen
- Entity Mapping Workbook (JSON-Schemata)
- Standard Operating Procedures (SOPs)

**🎯 Sekundärziel:**
Entwicklung eines **synthetischen Demo-Werks** zur Validierung
- Realistische Pigmentpaste-Produktion
- Empirische Grundlage für Artefakt-Entwicklung
- Präsentation auf EC Conference Digitalisation

**🎯 Tertiärziel:**
**Master Creator** - LLM-gestütztes Automatisierungstool
- Chat-basierte Konfigurationsgenerierung
- Lokales 7B-Modell (Datensouveränität: GDPR, NDA)
- Integration aller drei Artefakte

**Visuelle Elemente:**
- Drei Boxen mit Highlighting
- Icons für jedes Ziel

**Sprechernotizen:**
- Ko-Evolution: Artefakte entwickeln sich mit Demo-Werk
- Demo-Werk hat Doppelfunktion: Entwicklung UND Validierung
- Master Creator baut auf allen Artefakten auf

---

#### **Folie 7: Methodisches Vorgehen - Action Research** ⏱️ 1,5 Min
**Layout:** Cycle diagram + Text

**Action Research nach Lewin [1946]:**

**Warum Action Research?**
- Forscher ist Teil des Problemkontexts (embedded)
- Traditionelle Experteninterviews nicht praktikabel (Ressourcenbeschränkungen)
- Iterative Entwicklung und Validierung erforderlich

**Forschungszyklus (Grafik):**
```
    ┌─────────────┐
    │  Diagnose   │ ← Ist-Analyse
    └──────┬──────┘
           ↓
    ┌─────────────┐
    │   Planung   │ ← Artefakt-Design
    └──────┬──────┘
           ↓
    ┌─────────────┐
    │    Aktion   │ ← Implementation
    └──────┬──────┘
           ↓
    ┌─────────────┐
    │ Evaluation  │ ← Validierung
    └──────┬──────┘
           ↓
      (Iteration)
```

**Iterationen:**
1. **Fragebogen** (v1a → v1b → v2: 96 → 15 Kernfragen)
2. **Entity Mapping Workbook** (Reverse Engineering)
3. **SOPs** (3 Prozesse standardisiert)

**Visuelle Elemente:**
- Action Research Cycle (kann aus Internet/Literatur übernommen werden)
- Zeitleiste der Iterationen

**Sprechernotizen:**
- Action Research = praxisorientierte Forschungsmethode
- Besonders geeignet wenn Forscher im Problemkontext embedded ist
- Drei große Iterationszyklen für die drei Artefakte
- Evaluationsdesign folgt später (Folie 12)

---

### **TEIL 3: EIGENLEISTUNG - DREI-ARTEFAKTE-ARCHITEKTUR** (6 Min, Folien 8-11)

#### **Folie 8: Drei-Artefakte-Architektur - Überblick** ⏱️ 1,5 Min
**Layout:** Three-column architecture

**Architektur nach SECI-Modell (Nonaka & Takeuchi [1995]):**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   ARTEFAKT 1    │    │   ARTEFAKT 2    │    │   ARTEFAKT 3    │
│                 │    │                 │    │                 │
│  GRACE Onb.     │ →  │ Entity Mapping  │ →  │  Standard       │
│  Fragebogen     │    │   Workbook      │    │  Operating      │
│                 │    │                 │    │  Procedures     │
│  (15 Fragen)    │    │ (JSON-Schemata) │    │  (SOPs 01-03)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        ↓                       ↓                       ↓
  Externalisiert         Kombiniert              Internalisiert
  implizites Wissen    explizites Schema-      durch standard.
                           wissen                Arbeitsanweisung
```

**SECI-Mapping:**
- **Socialization → Externalization:** Fragebogen (Tacit → Explicit)
- **Externalization → Combination:** Workbook (Explicit → Structured)
- **Combination → Internalization:** SOPs (Structured → Actionable)

**Problemlösung:**
| Artefakt | Adressierte Problemfelder |
|----------|---------------------------|
| Fragebogen | Fragmentierung, Vollständigkeit |
| Workbook | Fragmentierung, Standardisierung, Wissensträgerabhängigkeit |
| SOPs | Wissensträgerabhängigkeit, Standardisierung, Reproduzierbarkeit |

**Visuelle Elemente:**
- SECI-Modell Grafik (aus Internet/Literatur)
- Drei-Spalten-Layout mit Pfeilen
- Tabelle: Problemlösung

**Sprechernotizen:**
- SECI = Socialization, Externalization, Combination, Internalization
- Drei Artefakte bilden kompletten Wissenstransfer-Zyklus
- Jedes Artefakt adressiert spezifische Problemfelder aus Ist-Analyse
- Zusammen bilden sie vollständige Lösung

---

#### **Folie 9: Artefakt 1 - GRACE Onboarding Fragebogen** ⏱️ 1,5 Min
**Layout:** Before/After comparison

**Evolution nach DeVellis [2017]:**
```
v1a: 96 Fragen (Ad-hoc Kommunikation)
         ↓ Skalenentwicklung
v1b: Strukturierung in 6 Themenblöcke
         ↓ Reduktion
v2:  15 Kernfragen (Finales Design)
```

**Sechs Themenblöcke:**
1. Grundlagen (IT-Landschaft, ERP-System)
2. Produktionsdetails (Fertigungstyp, Losgrößen)
3. Planung (Planungshorizont, Restriktionen)
4. Ressourcen (Maschinen, Kapazitäten)
5. Next Steps (Implementierungsplan)
6. Erwartungen (KPIs, Erfolgskriterien)

**Wirkung:**
- ✅ Verhindert Ad-hoc-Kommunikation
- ✅ Stellt sicher: Alle 6 Entitätstypen werden systematisch erfasst
- ✅ Reduziert fragmentiertes Wissen (beide Seiten: intern & extern)

**Datenblöcke:**
```
\dblock{96 → 15}{Fragen reduziert}
\dblock{6}{Themenblöcke}
```

**Visuelle Elemente:**
- Before/After Vergleich
- Themenblöcke als Icons
- Evtl. Screenshot aus Anhang/Fragebogen

**Sprechernotizen:**
- Skalenentwicklung nach DeVellis [2017]: systematische Fragebogen-Konstruktion
- Reduktion von 96 auf 15 Fragen durch Fokussierung auf Kernfragen
- Verhindert: "Ich brauche Titanium Dioxide, PEG 400, Tego..." (Code-Sprache)
- Natürlichsprachige, strukturierte Erhebung
- Dabei wurde j

---

#### **Folie 10: Artefakt 2 - Entity Mapping Workbook** ⏱️ 1,5 Min
**Layout:** Schema visualization

**Basiert auf Chen [1976] Entity-Relationship-Modell:**

**6 GRACE-Entitätstypen dokumentiert:**
```
Materials → Machines → Products
    ↓          ↓          ↓
  BOMs  ←  Processes  → Recipes
```

**JSON-Schema für jeden Typ:**
- **Feldspezifikationen** (ID, Name, Attribute)
- **Datentypen** (String, Number, Array, Boolean)
- **Validierungsregeln** (Required, Min/Max, Regex)
- **Abhängigkeiten** (Foreign Keys, Cardinalities)

**Entwicklungsmethode:**
- **Reverse Engineering** der GRACE JSON-Strukturen
- Keine öffentliche API-Dokumentation → selbst erarbeitet
- Dokumentiert alle 6 Entitätstypen vollständig

**Wirkung:**
- ✅ Defragmentiert Wissen (zentrale technische Referenz)
- ✅ Ermöglicht Nachvollziehbarkeit ohne Expertenkontakt
- ✅ Grundlage für Master Creator (Strukturvorgabe)

**Visuelle Elemente:**
- ER-Diagramm (Anhang/ER-Diagramm/ER_UML_Card.pdf)
- JSON-Schema Beispiel (Code-Block)
- Evtl. Screenshot aus Workbook

**Sprechernotizen:**
- Chen [1976]: Entity-Relationship-Modellierung als Grundlage
- Workbook = technische Übersetzung des ER-Modells in JSON-Schemata
- Reverse Engineering notwendig, da GRACE keine öffentliche Doku hat
- Kritisch für Master Creator: LLM braucht strukturierte Vorgaben

---

#### **Folie 11: Artefakt 3 - Standard Operating Procedures** ⏱️ 1,5 Min
**Layout:** Process flow + BPMN

**Drei operationalisierte Prozesse:**

**SOP 01: Kundenworkshop durchführen**
- Strukturiertes Interview gemäß Fragebogen
- 6 Themenblöcke abarbeiten
- Output: Vollständige Workshop-Dokumentation

**SOP 02: Master Creator nutzen**
- Ollama-Server starten
- Workshop-Protokoll in natürlichsprachige Prompts transformieren
- LLM generiert JSON-Strukturen für alle 6 Entity-Typen
- 6-Punkte-Validierung durchführen

**SOP 03: JSONs in GRACE importieren**
- Generierte JSONs über GRACE-UI importieren (~30 Min)
- Validierungsfehler beheben (typischerweise 3-5 Fehler aus 6-Punkte-Checkliste)
- Finale Konfiguration übergeben

**BPMN-Prozessmodelle:**
- v1a: Manuelle Konfiguration über GRACE UI
- v1b: Importer-basierte Konfiguration (partiell automatisiert)
- v2: Master Creator (LLM-generiert, JavaScript-validiert, Auto-Correction)

**Visuelle Elemente:**
- BPMN-Diagramme (Anhang/Prozesse/bpmn-v2.pdf)
- Drei SOPs als Boxen mit Pfeilen
- Vergleich v1a vs v1b vs v2

**Sprechernotizen:**
- SOPs operationalisieren die Drei-Artefakte-Architektur
- Prozessmodelle zeigen Evolution: manuell → semi-automatisch → LLM-gestützt
- BPMN dient auch als Evaluationswerkzeug (Prozessvergleich)
- SOPs + Workbook + Fragebogen = vollständiger Wissenstransfer

---

### **TEIL 4: INNOVATION - MASTER CREATOR** (4 Min, Folien 12-13)

#### **Folie 12: Master Creator - Architektur & Funktionsweise** ⏱️ 2,5 Min
**Layout:** Architecture diagram + Feature list

**System-Architektur:**
```
┌─────────────────────────────────────────────────┐
│         Master Creator UI (Chat-Interface)       │
│              (app.js, index.html)                │
└────────────────────┬────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────┐
│       System Prompt + Session Context           │
│  • Fragebogen-Daten (strukturiert)              │
│  • Entity Mapping Workbook (JSON-Schemata)      │
│  • SOPs (Arbeitsanweisungen)                    │
└────────────────────┬────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────┐
│     Ollama (Local LLM: qwen2.5-coder 7B)        │
│     • On-Premise Deployment (<16GB vRAM)        │
│     • GDPR/NDA-compliant (keine Cloud)          │
└────────────────────┬────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────┐
│    6-Punkte JavaScript-Validierung              │
│  ✓ Vollständigkeit aller Entity-Typen           │
│  ✓ ID-Konsistenz (keine Duplikate)              │
│  ✓ Zeiteinheiten (Sekunden, nicht Minuten)      │
│  ✓ BOM-baseQuantity (Summe der Items)           │
│  ✓ Product-Material-Referenz (korrekt)          │
│  ✓ ID-Eindeutigkeit (keine Duplikate)           │
└────────────────────┬────────────────────────────┘
                     ↓
              JSON Export für GRACE
```

**Charakteristika:**

**Neue Lane: Master Creator als eigenständiger Akteur**
- Explizite Modellierung der LLM-Aktivitäten im BPMN
- Nicht nur "Tool", sondern prozessrelevanter Akteur

**Frontloading:**
- Vorbereitung (Fragebogen, Workshop-Planung) dominiert
- Nicht die Implementierung (wie v1a/v1b)

**Minimale Iteration:**
- Fehlerkorrektur-Schleife deutlich kleiner als v1a/v1b
- 6-Punkte-Checkliste reduziert Fehlerquellen präventiv

**Scaffolding-Ansatz (80/20):**
- LLM generiert 80% korrekte Basis-Konfiguration
- 20% manuelle Nacharbeit (komplexe Strukturen)

**Visuelle Elemente:**
- Architektur-Diagramm (Anhang/Architektur/Master_Creator_Arch.pdf adaptiert)
- BPMN v2 (Anhang/Prozesse/bpmn-v2.pdf)
- Screenshot Master Creator UI

**Sprechernotizen:**
- Entscheidung für lokales 7B-Modell: Datensouveränität vor Performance
- Hummel et al. [2021]: Lokale LLM-Deployments für GDPR/NDA-Compliance
- Gupta et al. [2025]: 7B-Modelle ausreichend für strukturierte Datengenerierung
- Scaffolding: Komplexe Strukturen (Process-Links, variable Formeln) brauchen noch manuelle Arbeit

---

#### **Folie 13: Master Creator - Workflow** ⏱️ 1,5 Min
**Layout:** Step-by-step process

**7 Schritte vom Workshop zur Konfiguration:**

**Prozessschritte Master Creator (LLM):**
1. **Master Creator starten:** Ollama-Server + UI (localhost:9000)

2. **Informationen transformieren:** Workshop-Protokoll → natürlichsprachige Prompts
   - "I need Titanium Dioxide, PEG 400, Tego" → Strukturierte Anforderung

3. **Entities generieren:** LLM generiert JSON für alle 6 Entity-Typen
   - System-Prompt + Session-Context aus Workbook

4. **6-Punkte-Validierung:** JavaScript-Validierung prüft:
   - Vollständigkeit, ID-Konsistenz, Zeiteinheiten, BOM-baseQuantity, etc.

5. **JSON Export:** Validierte JSONs einzeln/kombiniert exportieren

**Prozessschritte Kunde (v1a/v1b):**
6. **Agenda + Fragebogen erhalten:** Klare Erwartungshaltung, Vorbereitung

7. **Workshop-Teilnahme:** Aktive Mitwirkung statt passive Datenbereitstellung

8. **Informationen ableiten:** Aus Workshop-Summary lernen (Chat-Summarization)

**Strukturelle Prozessunterschiede:**

| Dimension | v1a | v1b | v2 (Master Creator) |
|-----------|-----|-----|---------------------|
| **Sequentialität** | Hoch parallel | Sequentiell | Frontloaded parallel |
| **Fehlerbehandlung** | 1-2 Wochen iterativ | 1 Woche iterativ | 6-Punkte präventiv |
| **Automatisierung** | Keine (nur UI) | Partiell (Importer-API) | Hoch (LLM + Validierung) |

**Visuelle Elemente:**
- Flowchart der 7 Schritte
- Tabelle: Prozessvergleich
- Evtl. Screenshots vom Workflow

**Sprechernotizen:**
- v2 unterscheidet sich fundamental: Workshop-Vorbereitung zählt mehr als Implementation
- Kunde wird aktiver Part (nicht passiver Datenlieferant)
- Fehlerprävention statt Fehlerkorrektur

---

### **TEIL 5: EVALUATION & ERGEBNISSE** (5 Min, Folien 14-16)

#### **Folie 14: Evaluationsdesign** ⏱️ 1,5 Min
**Layout:** Experimental setup

**Within-Subjects-Design (n=18):**

**Experimentaufbau:**
- **Probanden:** 3 Gruppen à 6 Personen
  - Proband 1: Erfahrene Master-Creator-Nutzer (6 Durchläufe)
  - Proband 2: Mittlere Erfahrung (6 Durchläufe)
  - Proband 3: Neulinge (6 Durchläufe)

- **Aufgabe:** Synthetische Produktionsumgebung konfigurieren
  - 3 Materials, 2 Machines, 1 Product, 1 BOM, 1 Process, 1 Rezept
  - Realistische Komplexität (Pigmentpaste-Produktion)

- **Bedingungen:**
  - **Bedingung 1:** Manuelle Konfiguration über GRACE UI (v1a)
  - **Bedingung 2:** Master Creator gestützte Konfiguration (v2)

**Gemessene Metriken:**
1. **Zeit:** Bis zur vollständigen Konfiguration
2. **Fehler:** Anzahl Validierungsfehler beim Import
3. **Vollständigkeit:** 6-Punkte-Validierungscheckliste erfüllt

**Validierung:**
- Statistische Validität: Within-Subjects Design, n=18
- **ABER:** Nicht direkt auf Real-World übertragbar (kontrolliertes Setting)

**Visuelle Elemente:**
- Experimentdesign-Diagramm
- Tabelle: 3 Probanden × 6 Durchläufe = 18 Datenpunkte
- Metriken-Übersicht

**Sprechernotizen:**
- Within-Subjects = jeder Proband macht beide Bedingungen (reduziert Varianz)
- Synthetisches Demo-Werk = kontrollierte Bedingungen, aber eingeschränkte Generalisierbarkeit
- Lerneffekt über 6 Durchläufe hinweg beobachtbar (Proband 1 vs 3)

---

#### **Folie 15: Ergebnisse - Quantitative Verbesserungen** ⏱️ 2 Min
**Layout:** Results dashboard mit großen Zahlen

**Zentrale Befunde:**

```
┌─────────────────────────────────────────────────────────┐
│                   ZEITREDUKTION                          │
│                      47%                                 │
│              8:03 Min → 4:18 Min                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  FEHLERREDUKTION                         │
│                      81%                                 │
│           5,00 → 0,94 Fehler/Konfiguration               │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│            VOLLSTÄNDIGKEITSVERBESSERUNG                  │
│                 86,1% → 98,1%                            │
│            (+11,9 Prozentpunkte)                         │
└─────────────────────────────────────────────────────────┘
```

**Zwei-Stufen-Verbesserung:**
1. **Wissensstrukturierung allein:** 60-70% (Baseline) → 86,1% (+16-26 pp)
   - Durch Drei-Artefakte-Architektur (ohne LLM)
2. **LLM-Automatisierung zusätzlich:** 86,1% → 98,1% (+12 pp)
   - Durch Master Creator

**Experimentdaten (Tabelle aus Arbeit, Seite 73):**

| Metrik | GRACE-UI | Master Creator | Verbesserung |
|--------|----------|----------------|--------------|
| Zeit/Konfiguration | 8:03 Min (±1:44) | 4:18 Min (±0:58) | **47%** |
| Fehler/Konfiguration | 5,00 (±2,54) | 0,94 (±0,78) | **81%** |
| Checklisten-Punkte | 5,17/6 (±1,00) | 5,89/6 (±0,19) | **+0,72** |
| Vollständigkeit | 86,1% | 98,1% | **+12 pp** |

**Lerneffekt:**
- Alle Probanden zeigen Zeitverbesserung über 6 Durchläufe:
  - Proband 1: 5:45 → 2:45 Min
  - Proband 2: 6:20 → 3:55 Min
  - Proband 3: 5:14 → 2:58 Min

**Visuelle Elemente:**
- Große Zahlen in `\dblock`-Boxen
- Tabelle 8 aus Arbeit (Seite 73)
- Balkendiagramm: GRACE-UI vs Master Creator

**Sprechernotizen:**
- 47% Zeitreduktion = halbe Konfigurationszeit
- 81% Fehlerreduktion = fast fehlerfreie Konfiguration
- Zwei-Stufen-Verbesserung zeigt: Strukturierung UND Automatisierung notwendig
- LLM allein würde ohne strukturierte Wissensaufbereitung nicht funktionieren

---

#### **Folie 16: NAS-Crash-Rekonstruktion - Praxisvalidierung** ⏱️ 1,5 Min
**Layout:** Case study format

**Ungeplante Validierung unter Realbedingungen:**

**Vorfall:**
- NAS-Crash führte zum vollständigen Verlust der Demo-Werk-Konfiguration
- Pigmentpaste-Produktion: 27 Materials, 8 Machines, 3 Products, 6 Processes, 3 BOMs, 3 Rezepte
- Ursprüngliche manuelle Erstellung: **2 Monate Kalenderlaufzeit**

**Rekonstruktion mit Master Creator:**
- **80% der Konfiguration in 20% der ursprünglichen Arbeitszeit**
- Manuelle Nacharbeit nur für komplexe Strukturen:
  - Process-Links (Prozessabhängigkeiten)
  - Variable Formeln (itemAssociationRules)
  - Prozessformeln

**Validierungswert:**
- Ergänzt standardisiertes Experiment (n=18)
- Zeigt Praxistauglichkeit unter realen Produktionsbedingungen
- Demonstriert Skalierbarkeit auf komplexe Konfigurationen

**Methodische Einordnung:**
- Explorative Evidenz (n=1, kein kontrolliertes Setting)
- Zeigt: Externalisierung als notwendige Voraussetzung
  - Ohne JSON-Konfigurationen als Referenz wäre teilweise Rekonstruktion unmöglich gewesen

**Visuelle Elemente:**
- Vorher/Nachher-Vergleich: 2 Monate vs. 20% der Zeit
- Demo-Werk-Daten: 27 Materials, 8 Machines, etc.
- Evtl. Screenshot vom rekonstruierten Demo-Werk

**Sprechernotizen:**
- NAS-Crash = ungeplantes "Realexperiment"
- Bestätigt Kernthese: Externalisierung (in welcher Form auch immer) als Voraussetzung für LLM-Automatisierung
- Scaffolding-Ansatz bestätigt: Komplexe Strukturen brauchen noch Handarbeit
- Diese Evidenz ist explorativ, nicht konfirmatorisch (keine Wiederholbarkeit)

---

### **TEIL 6: FAZIT & AUSBLICK** (2 Min, Folien 17-18)

#### **Folie 17: Fazit** ⏱️ 1 Min
**Layout:** Summary boxes

**Beantwortung der Forschungsfragen:**

**FF1: Systematische Externalisierung**
✅ **Gelöst:** Drei-Artefakte-Architektur (Fragebogen, Workbook, SOPs)
- SECI-Modell operationalisiert: Tacit → Explicit → Structured → Actionable

**FF2: Notwendige Artefakte**
✅ **Gelöst:** Drei Artefakte identifiziert und validiert
- Fragebogen: Vollständigkeit +20-30 pp
- Workbook: Standardisierung, Wissensträgerunabhängigkeit
- SOPs: Reproduzierbarkeit, Prozessstabilität

**FF3: LLM-Automatisierung**
✅ **Gelöst:** Master Creator erreicht 47% Zeitreduktion, 81% Fehlerreduktion
- **ABER:** Nur in Kombination mit strukturierter Wissensexternalisierung
- Lokales 7B-Modell ausreichend für strukturierte Generierung (Datensouveränität)

**FF4: Quantifizierbare Verbesserungen**
✅ **Validiert:** Within-Subjects-Experiment (n=18)
- Zeit: 8:03 Min → 4:18 Min (47%)
- Fehler: 5,00 → 0,94 (81%)
- Vollständigkeit: 86,1% → 98,1% (+12 pp)

**Kernerkenntnis:**
Die Arbeit validiert LLM-gestützte Konfigurationsansätze für APS-Systeme unter realen Produktionsbedingungen. Sie demonstriert, dass **systematische Externalisierung notwendig ist**, wenn man erfolgreiche LLM-Automatisierung in komplexen Enterprise-Domänen produzieren will.

**Visuelle Elemente:**
- 4 Checkboxen für FF1-FF4
- Zentrale Erkenntnis hervorgehoben

**Sprechernotizen:**
- Alle Forschungsfragen beantwortet
- Zwei-Stufen-Verbesserung zeigt: LLM allein reicht nicht
- Drei-Artefakte-Architektur = notwendige Voraussetzung (nicht optional)

---

#### **Folie 18: Ausblick & Weiterentwicklung** ⏱️ 1 Min
**Layout:** Future directions

**Technische Weiterentwicklung:**

**1. Architektur-Erweiterungen:**
- Versionierung, Test-Standards, Wartungsinfrastruktur
- Code-Struktur: 3 Dateien (MVP) → Produktionsreife Architektur

**2. UUID-Standardisierung:**
- Entity Mapping Workbook: aktuell kebab-case IDs
- GRACE Standard: UUIDs
- Zukünftige Versionen: UUID-Konvention integrieren

**3. Sonderfälle abdecken:**
- 6-Punkte-Checkliste deckt Standard-Validierung ab
- Ausgiebige Praxistests unter diversen Produktionsszenarien erforderlich

**Organisatorische Potenziale:**

**4. Transferierbarkeit auf andere Enterprise-Systeme:**
- Drei-Artefakte-Architektur nicht GRACE-spezifisch
- Anwendbar auf: ERP, MES, SCM-Systeme mit komplexer Konfiguration
- Wissensfragmentierung ist domänenübergreifendes Problem

**5. Automatisierungsvisionen:**
- Vollautomatische Konfigurationsgenerierung (aktuell: Scaffolding 80/20)
- Konversationelle Fehlerbehebung (LLM erklärt Validierungsfehler)
- Integration in bestehende DevOps-Pipelines

**Forschungsperspektive:**

**6. Einordnung in Stand der Forschung:**
- LLMs in Operations Research (Fan et al. [2024], Yu et al. [2025])
- Wissensexternalisierung (Nonaka & Takeuchi [1995], Levallet & Chan [2019])
- Lokale Deployment-Strategien (Hui [2024], Gupta et al. [2025])

**Visuelle Elemente:**
- Roadmap-Grafik: Jetzt → Nächste Schritte → Vision
- Icons für technische/organisatorische/Forschungs-Dimensionen

**Sprechernotizen:**
- MVP-Status: Funktioniert, aber produktive Nutzung erfordert Erweiterungen
- Transferierbarkeit: Kernbeitrag für andere Enterprise-Systeme
- Forschungslücke geschlossen: LLM-Automatisierung in APS-Konfiguration

---

#### **Folie 19: Vielen Dank & Fragen** ⏱️ Variable
**Layout:** End page mit Kontaktdaten

**Inhalt:**
```
Vielen Dank für Ihre Aufmerksamkeit!

Fragen?
```

**Kontakt:**
- Aleksandar Topić
- topicaleks.mannheim@gmail.com
- Hochschule Worms · Fachbereich Informatik

**QR-Code:** (optional)
- Link zu Arbeit, GitHub, oder LinkedIn

**Visuelle Elemente:**
- VK Template End Page (wie in demo_slides.pdf)
- QR-Code (optional)

---

## Zeitmanagement

| Abschnitt | Folien | Zeit | Anteil |
|-----------|--------|------|--------|
| Einführung & Kontext | 1-4 | 4 Min | 20% |
| Forschung & Methodik | 5-7 | 4 Min | 20% |
| Drei-Artefakte-Architektur | 8-11 | 6 Min | 30% |
| Master Creator | 12-13 | 4 Min | 20% |
| Evaluation & Ergebnisse | 14-16 | 5 Min | 25% |
| Fazit & Ausblick | 17-18 | 2 Min | 10% |
| **GESAMT** | **19** | **~20 Min** | **100%** |

**Puffer:** 5 Minuten für Fragen / Diskussion einplanen

---

## Visualisierungs-Checkliste

**Aus der Arbeit übernehmen:**
- ✅ ER-Diagramm (Anhang/ER-Diagramm/ER_UML_Card.pdf)
- ✅ BPMN-Prozessmodelle v1a, v1b, v2 (Anhang/Prozesse/)
- ✅ Architektur Master Creator (Anhang/Architektur/Master_Creator_Arch.pdf)
- ✅ Experiment-Ergebnistabellen (Seite 73: Tabelle 5-8)
- ✅ 6-Punkte-Validierungscheckliste (implizit aus Text)

**Aus Internet/Literatur:**
- ✅ SECI-Modell (Nonaka & Takeuchi)
- ✅ Action Research Cycle (Lewin)

**Neu erstellen/vereinfachen:**
- ✅ Drei-Artefakte-Architektur Übersicht (vereinfachtes Diagramm)
- ✅ Master Creator Workflow (7 Schritte)
- ✅ Problemstellung Visualisierung (3 Probleme mit Icons)
- ✅ Ergebnisse Dashboard (große Zahlen)

**Screenshots (falls vorhanden):**
- ⚠️ Master Creator UI (falls verfügbar)
- ⚠️ GRACE System Interface (falls verfügbar)
- ⚠️ Demo-Werk (falls verfügbar)

---

## LaTeX Beamer Umsetzungshinweise

**VK Template Commands nutzen:**
```latex
% Große Zahlen/Datenblöcke
\dblock{47\%}{Zeitreduktion}
\dblock{81\%}{Fehlerreduktion}

% Definition-Boxen
\ddef{Drei-Artefakte-Architektur}{
  Strukturierte Wissensexternalisierung durch...
}

% Content-Boxen
\dbox{
  \begin{itemize}
    \item Fragebogen
    \item Workbook
    \item SOPs
  \end{itemize}
}

% Separated blocks
\dblocksep{FF1}{Externalisierung}
```

**Farbschema beibehalten:**
- Primärfarbe: VK Blau (#5181B8 oder ähnlich)
- Akzente: Grau für Text, Weiß für Hintergründe
- Hervorhebungen: Blau für wichtige Elemente

**Sections & Subsections:**
```latex
\section{Einführung}
\subsection{Problemstellung}

\section{Methodik}
\subsection{Action Research}

% etc.
```

---

## Sprechgeschwindigkeit & Pacing

**Empfohlenes Tempo:**
- **Einführung:** Langsam, klar (Problem verstehen lassen)
- **Methodik:** Mittel (bekannte Konzepte)
- **Eigenleistung (Artefakte + Master Creator):** Langsamer (Kernbeitrag, Details wichtig)
- **Evaluation:** Zügig (Zahlen sprechen für sich)
- **Fazit:** Langsam (Take-aways festigen)

**Pausen einplanen:**
- Nach komplexen Folien (z.B. SECI-Modell, Architektur)
- Nach großen Zahlen (Publikum Zeit zum Verarbeiten geben)
- Vor Fazit (Übergang markieren)

---

## Backup-Folien (Optional, nicht in 20 Min)

**Falls Fragen zu Details kommen:**

**Backup 1: Ist-Analyse Details**
- Teamstruktur bei seitcom
- Aktueller Konfigurationsprozess v1a Schritt-für-Schritt
- Identifizierte Problemfelder (Tabelle)

**Backup 2: Technische Details Master Creator**
- Ollama-Integration
- Prompt Engineering (System-Prompt + Session-Context)
- JavaScript-Validierung Code-Beispiele

**Backup 3: Experiment-Rohdaten**
- Tabellen 5-7 (Proband 1-3 Details)
- Statistische Tests (falls durchgeführt)

**Backup 4: Literaturvergleich**
- Fan et al. [2024]: LLM in OR
- Yu et al. [2025]: SmartAPS
- Wasserkrug et al. [2024]: LLM-Limitationen für Optimierung

---

## Dos & Don'ts

**✅ DOS:**
- Roter Faden klar kommunizieren (Problem → Lösung → Validierung)
- Eigenleistung (Artefakte + Master Creator) betonen
- Zahlen wirken lassen (47%, 81%, 98,1%)
- Praxisbezug herstellen (NAS-Crash, seitcom)
- Akademische Einordnung (SECI, Action Research, Stand der Forschung)

**❌ DON'TS:**
- Nicht zu technisch werden (Code-Details nur auf Nachfrage)
- Nicht bei Grundlagen verweilen (APS, ERP bekannt voraussetzen)
- Nicht über Limitationen jammern (sachlich benennen, aber positiv abschließen)
- Nicht zu schnell durch Ergebnisse (Highlights geben lassen)

---

## Fragen antizipieren

**Mögliche kritische Fragen:**

**1. "Warum nur n=18? Ist das statistisch valide?"**
**Antwort:** Within-Subjects Design reduziert benötigte Stichprobengröße. Experimentelle Validität gegeben, aber Real-World-Generalisierbarkeit eingeschränkt. NAS-Crash-Rekonstruktion ergänzt als explorative Evidenz unter Praxisbedingungen.

**2. "Warum lokales 7B-Modell statt Cloud-LLM (GPT-4)?"**
**Antwort:** Datensouveränität hat Priorität (GDPR, NDA-Verpflichtungen). Kundenkonfigurationen enthalten sensitive Produktionsdaten. Gupta et al. [2025] zeigen: 7B-Modelle ausreichend für strukturierte Generierung. Vollständigkeit 98,1% validiert Designentscheidung.

**3. "Transferierbarkeit: Funktioniert das nur für GRACE?"**
**Antwort:** Drei-Artefakte-Architektur ist domänenunabhängig. Wissensfragmentierung ist generelles Problem bei Enterprise-Systemen (ERP, MES, SCM). SECI-Modell ist etabliertes Framework. Master Creator müsste angepasst werden (System-Prompt, Schemata), aber Prinzip übertragbar.

**4. "Was ist mit den 20% manueller Nacharbeit?"**
**Antwort:** Scaffolding-Ansatz (80/20) ist bewusste Designentscheidung. Komplexe Strukturen (Process-Links, variable Formeln) erfordern Domänenwissen. Ziel war nicht 100% Automatisierung, sondern signifikante Beschleunigung + Fehlerreduktion. Zukünftige Iterationen können Automatisierungsgrad erhöhen.

**5. "Limitationen der Arbeit?"**
**Antwort:**
- Technisch: Hardware-Limitierung (7B-Modell), keine UUID-Standardisierung
- Methodisch: Experimentelle Generalisierbarkeit (n=18, synthetisches Setting)
- Konzeptionell: Scaffolding erfordert weiterhin manuelle Nacharbeit
- ABER: Alle Limitationen transparent dokumentiert (Kapitel 7.8), bewusste Trade-offs

---

## Erfolgsmetriken für Präsentation

**Du weißt, die Präsentation war erfolgreich, wenn:**
- ✅ Roter Faden klar erkennbar (Problem → Drei-Artefakte → Master Creator → Validierung)
- ✅ Eigenleistung deutlich (nicht nur "ich hab ein LLM integriert")
- ✅ Praxisrelevanz kommuniziert (seitcom profitiert, transferierbar)
- ✅ Akademischer Beitrag klar (Wissensexternalisierung als Voraussetzung für LLM-Automatisierung)
- ✅ Zahlen hängenbleiben (47%, 81%, 98,1%)
- ✅ Fragen zielen auf Details, nicht auf Grundverständnis

---

**Ende des Proposals**

Nächster Schritt: LaTeX Beamer Umsetzung mit VK Template
