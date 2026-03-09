# Neue Thesis-Gliederung (Optimiert)

**Stand:** 2025-01-31
**Prinzip:** ERST Problem zeigen, DANN Lösungsansatz erklären

---

## Kapitelstruktur

### 1. Einleitung
- Problemstellung
- Forschungsfrage
- Aufbau der Arbeit

### 2. Grundlagen ✅ ÜBERARBEITET
- APS (Advanced Planning and Scheduling)
  - Definition und Einordnung
  - GRACE-Entitätsmodell (6 Typen)
- Entity-Relationship-Modellierung
  - Grundlagen und Notation
  - Kardinalitäten und referenzielle Integrität
  - ~~ERM der GRACE-Grundentitäten~~ → ENTFERNT (gehört in Evaluierung)
- Prozessmodellierung mit BPMN
  - Notation und Symbolik
  - Anwendung in dieser Arbeit (OHNE v2 zu erwähnen!)
- Wissensmanagement
  - SECI-Modell nach Nonaka & Takeuchi
  - Tacit vs. Explicit Knowledge
  - Action Research nach Lewin (nur Definition, KEINE Begründung)
  - ~~LLM-gestützte Wissensexternalisierung~~ → ENTFERNT (gehört in Implementation)
- Large Language Models (LLMs)
  - Grundlagen (Transformer, Attention, strukturierte Datengenerierung)
  - LLMs im Operations Management (allgemein, OHNE SmartAPS-Tabelle)
  - ~~Lokale Deployment-Architektur~~ → ENTFERNT (gehört in Methodik)
  - ~~Multilinguale LLM-Performance~~ → ENTFERNT (gehört in Methodik)
- Datenhoheit und Compliance
  - Definition nach Hummel
  - DSGVO, NDA, Kundenvertrauen
  - Allgemeiner Satz zur IT-Architektur (OHNE "lokale LLM-Deployment")
- Skalenentwicklung und Fragebogendesign
  - Prinzipien nach DeVellis (OHNE "96→15" explizit zu nennen)
  - Kodierleitfaden-Prinzip nach Mayring

**Status:** ✅ Fertig überarbeitet (03Grundlagen.tex)

---

### 3. Ist-Analyse ✅ ÜBERARBEITET
- Einleitung: Status quo der GRACE-Konfiguration
- Stakeholder und Teamstruktur
  - 3-4 Personen
  - Engpass-Risiko
  - 7 Kundenwerke in Pilotphase
- Aktuelle Konfigurationsprozesse
  - Manuelle Konfiguration über GRACE UI (5 Schritte, 8 Wochen)
  - Importer-basierte Konfiguration (20% der Projekte, 1-2 Wochen Entwicklung)
- Identifizierte Probleme (5 Problemfelder)
  1. Fragmentierung des Konfigurationswissens (48% doppelte Materialien, etc.)
  2. Wissensträgerabhängigkeit
  3. Fehlende Standardisierung
  4. Anforderungen an Datenhoheit (NEU!)
  5. Quantitative Problemmanifestationen (10-15 Fehler, 60-70% Vollständigkeit)

**Entfernt und verschoben:**
- ❌ "Datenerhebung und Methodik" → gehört ins Methodik-Kapitel
- ❌ NAS-Crash Story → gehört in Evaluierung als Validierung

**Status:** ✅ Fertig überarbeitet (05IstAnalyse.tex)

---

### 4. Methodik 🚧 TODO
**Ziel:** Erklären, WIE ich vorgegangen bin, um das Problem zu lösen

**Inhalte (zu integrieren):**
- Begründung für Action Research (aus Grundlagen entfernt)
  - Instabiles Zielsystem (GRACE Pilotphase)
  - Ressourcenknappheit (Team 3-4 Personen)
  - Eingebetteter Forscher
- Forschungszyklus (Plan-Act-Observe-Reflect)
  - **WICHTIG:** Demo-Werk wurde WÄHREND der Thesis erstellt, NICHT vorher!
- Datenerhebung (aus Ist-Analyse verschoben)
  - Teilnehmende Beobachtung
  - JSON-Analyse und Reverse Engineering
  - Informelle Expertengespräche (Maschinenführer-Kollege)
  - Limitationen (fehlende Doku, NDA, Software-Bugs)
- Technische Infrastruktur (aus Grundlagen verschoben)
  - Lokale Deployment-Architektur (Ollama, qwen2.5-coder, MacBook M4)
  - Multilinguale LLM-Performance → Begründung für englische Prompts
  - Trade-off: Datensouveränität vs. Performance

**Verfügbare Drafts:**
- `04Methodik.tex` (?)
- `04_Methodik_Draft_v1.tex`
- `04_2_Forschungszyklus_Draft_v2.tex`

**Status:** 🚧 Noch nicht überarbeitet (Drafts müssen gesichtet werden)

---

### 5. Konzept/Design (Drei-Artefakte-Architektur)
**Ziel:** WAS ist meine Lösung?

**Inhalte:**
- Überblick Drei-Artefakte-Architektur
- Artefakt 1: GRACE Onboarding Fragebogen
  - Entwicklung nach DeVellis (96→15 Fragen) ← HIER darf es konkret werden!
  - Vollversion vs. Kompaktversion
- Artefakt 2: Entity Mapping Workbook
  - JSON-Schemas für 6 Entitätstypen
  - Feldstrukturen, Validierungsregeln, Defaults
- Artefakt 3: Standard Operating Procedures
  - SOP 01: Kundenworkshop
  - SOP 02: Master Creator Nutzung
  - SOP 03: GRACE Import

**Status:** Noch nicht überarbeitet

---

### 6. Implementation (Master Creator)
**Ziel:** WIE habe ich es technisch umgesetzt?

**Inhalte:**
- LLM-gestützte Wissensexternalisierung (aus Grundlagen verschoben) ← HIER darf es konkret werden!
  - Paper: llm:tacit_knowledge2025
  - Master Creator als Externalisierungswerkzeug
  - Strukturierte Konversation → JSON
- Master Creator Architektur
  - Automatische Entitätserkennung
  - Dependency Management
  - 6-Punkte-Validierung
  - Chat-Summarization

**Status:** Noch nicht überarbeitet

---

### 7. Evaluation
**Ziel:** Funktioniert die Lösung?

**Inhalte:**
- 3-Pillar Framework
  1. Zeitreduktion (Demo-Werk 98.8%, Kundenkonfig 98.6%)
  2. Vollständigkeit & Fehlerrate (60-70% → 90-95%, 10-15 → 3-5 Fehler)
  3. Reproduzierbarkeit (10-15 → 1-2 Git-Iterationen)
- BPMN-Prozessvergleich (aus Ist-Analyse verschoben)
  - Manuelle Konfiguration
  - Importer-basierte Konfiguration
  - LLM-gestützte Konfiguration (v2)
- NAS-Crash Validierung (aus Ist-Analyse verschoben)
  - Rekonstruktion der Demo-Daten
  - Validierung der These: Dokumentierte Artefakte beschleunigen Wiederherstellung
- SmartAPS-Vergleich (aus Grundlagen verschoben, mit korrigierten Metriken)
- Dependency Chain Visualisierung (aus Grundlagen verschoben)

**Status:** Teilweise geschrieben, muss noch integriert werden

---

### 8. Fazit
- Zusammenfassung
- Limitationen
- Ausblick / Future Work

---

## Wichtige Verschiebungen im Überblick

### Aus Grundlagen ENTFERNT → woanders hin:
1. ✅ Subsubsection "LLM-gestützte Wissensexternalisierung" → **Implementation**
2. ✅ Subsubsection "ERM der GRACE-Grundentitäten" (Dependency Chain) → **Evaluierung**
3. ✅ Subsubsection "Multilinguale LLM-Performance" → **Methodik / Technische Infrastruktur**
4. ✅ Subsubsection "Lokale Deployment-Architektur" → **Methodik / Technische Infrastruktur**
5. ✅ SmartAPS-Vergleichstabelle → **Evaluierung** (mit korrigierten Metriken)
6. ✅ BPMN Prozessvariante v2 → **Evaluierung** (nicht in Grundlagen erwähnen!)

### Aus Ist-Analyse ENTFERNT → woanders hin:
1. ✅ Sektion "Datenerhebung und Methodik" → **Methodik-Kapitel**
2. ✅ NAS-Crash Story → **Evaluierung** als Validierung

---

## Nächste Schritte

1. ✅ Grundlagen überarbeitet (03Grundlagen.tex)
2. ✅ Ist-Analyse überarbeitet (05IstAnalyse.tex)
3. 🚧 **TODO:** Methodik-Drafts sichten und auswählen
   - Drei Drafts vergleichen
   - Beste Version wählen / kombinieren
   - Inhalte aus Grundlagen + Ist-Analyse integrieren
4. ⏳ Konzept/Design überarbeiten
5. ⏳ Implementation überarbeiten
6. ⏳ Evaluation überarbeiten (Inhalte aus Grundlagen + Ist-Analyse integrieren)
7. ⏳ Abstract schreiben
8. ⏳ Einleitung überarbeiten

---

**Deadline:** 5. Februar 2026 (~5 Tage verbleibend)
