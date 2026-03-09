# Abstract - DRAFT v2 (Bachelor Thesis)

## Problemstellung

Die initiale Konfiguration von Advanced Planning and Scheduling (APS) Systemen erfordert umfangreiche, kundenspezifische Anpassungen. Im Fall von GRACE, dem APS-System der Seitcom GmbH, umfasst dieser Prozess die Definition von sechs Entitätstypen (Materials, Machines, Products, Processes, BOMs, Recipes) mit komplexen referenziellen Abhängigkeiten -- bei einer Durchlaufzeit von bis zu acht Wochen und einer Fehlerrate von 10-15 Fehlern pro Konfiguration.

Die zentrale Herausforderung liegt in der Fragmentierung des Konfigurationswissens über Azure DevOps Wikis, E-Mail-Korrespondenzen und zehn Jahre implizitem Erfahrungswissen.

**Bisher existiert kein systematischer Ansatz zur Externalisierung dieses fragmentierten Wissens für GRACE-Konfigurationen.**

---

## Ziel & Ergebnis

**Ziel dieser Arbeit** war die Entwicklung einer systematischen Wissensexternalisierungs-Architektur zur Optimierung des GRACE-Konfigurationsprozesses mittels Action Research.

**Das Ergebnis** ist eine Drei-Artefakte-Architektur kombiniert mit einem LLM-gestützten Automatisierungstool.

---

## System-Architektur: Vier Hauptkomponenten

### 1. Erhebungsfragebogen
Strukturierte Wissenserfassung mittels 15 Kernfragen nach Prinzipien der Skalenentwicklung (DeVellis 2017, Mayring 2015); reduziert von 96 initialen Fragen durch iterative Validierung.

### 2. Entity Mapping Workbook
JSON-Schemas für sechs Entitätstypen basierend auf Entity-Relationship-Modellierung (Chen 1976); definiert Feldtypen, Defaults, Constraints und referenzielle Integrität (Product.material.id, BOM.baseQuantity, Process.processingTime.unitId).

### 3. Standard Operating Procedures
Drei SOPs (Kundenworkshop, Master Creator-Nutzung, GRACE-Import) mit 6-Punkt-Validierungscheckliste:
- Vollständigkeit
- ID-Konsistenz
- Zeiteinheiten
- BOM baseQuantity
- Product Material
- ID-Duplikate

### 4. Master Creator
LLM-gestütztes Tool (qwen2.5-coder:7b) zur automatisierten Entitätsgenerierung mit lokaler Infrastruktur zur Wahrung der Datenhoheit (Hummel 2021, Gupta 2025); mehrschichtige Validierung nach Scaffolding-Ansatz (Sanwal 2024).

---

## Quantitative Ergebnisse

### Kontrolliertes Experiment (n=18, standardisiertes Demo-Werk-Szenario)

**Zeitreduktion: 47%**
- Demo-Werk: 2 Monate → 4 Stunden
- Kundenkonfiguration: 3,5 Wochen → 2 Stunden

**Fehlerreduktion: 81%**
- 10-15 Fehler → 3-5 Fehler pro Konfiguration

**Vollständigkeit:**
- Vorher: 60-70% (Ist-Analyse analysierter Konfigurationen, gemessen an 6-Punkt-Validierungscheckliste)
- Nachher: **98,1%** (Wilson-95-KI: 89,9–99,9) im Experiment

### Explorative NAS-Crash-Rekonstruktion (n=1, ungeplantes Real-World-Szenario)

**Praxistauglichkeit demonstriert:**
- 80% der Demo-Werk-Konfiguration rekonstruiert
  - 27 Materials
  - 8 Machines
  - 3 Products
  - 6 Processes
  - 3 BOMs
  - 3 Recipes
- In 20% der ursprünglichen Arbeitszeit
- Ermöglicht durch teilweise vorhandene JSON-Konfigurationen als externalisierte Wissensträger

---

## Validierung & Limitation

Die Ergebnisse validieren den **Scaffolding-Ansatz mit mehrschichtiger Validierung** und positionieren die Drei-Artefakte-Architektur als effektiven Ansatz für systematische Wissensexternalisierung in APS-Konfigurationsprozessen.

**Methodische Einordnung:**
- Die Evaluation ist **deskriptiv** (kontrolliertes Experiment n=18, explorativ n=1)
- Belegt **Machbarkeit sowie Effizienz**
- Jedoch **keine statistische Generalisierbarkeit** auf andere APS-Systeme ohne Anpassung der Artefakte

---

## Vergleich: Alt vs. Neu

### ❌ Vorher (Original Abstract)
- 200 Wörter in 2 Sätzen
- "über 90%" (unpräzise)
- "Git-Iterationen" (unklar)
- Keine Limitation
- System-Komponenten im Fließtext
- Keine NAS-Crash-Validierung

### ✅ Nachher (Draft v2)
- 330 Wörter in 5 strukturellen Blöcken
- "98,1% (Wilson-95-KI: 89,9–99,9)" (präzise)
- "Git-Iterationen" entfernt
- Limitation explizit ("keine statistische Generalisierbarkeit")
- System-Komponenten als strukturierte Liste (4 Bulletpoints)
- NAS-Crash-Validierung integriert (80% in 20% Zeit)

---

## Wortanzahl & Verteilung

**Gesamt: ~330 Wörter**

- **Problemstellung:** ~80 Wörter (24%)
- **Ziel & Ergebnis:** ~30 Wörter (9%)
- **System-Architektur:** ~100 Wörter (30%)
- **Ergebnisse:** ~100 Wörter (30%)
- **Limitation:** ~20 Wörter (6%)

