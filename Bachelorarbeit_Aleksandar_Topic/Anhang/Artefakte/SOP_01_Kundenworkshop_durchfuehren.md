# SOP 01: Kundenworkshop durchführen

**Version:** 1.0
**Datum:** 13. Januar 2026
**Gültigkeitsbereich:** GRACE-Onboarding für Neukunden
**Verantwortlich:** Konfigurationsteam
**Zielgruppe:** Teammitglieder, die Kundengespräche führen

---

## 1. Zweck und Geltungsbereich

### 1.1 Zweck
Diese SOP beschreibt den strukturierten Ablauf eines Kundenworkshops zur Erhebung aller notwendigen Informationen für die GRACE-Konfiguration.

### 1.2 Geltungsbereich
- Anwendbar auf alle Neukunden-Onboardings
- Gilt für erste Konfigurationsgespräche
- Optional nutzbar für Rekonfigurationen bei bestehenden Kunden

### 1.3 Ziele
- Vollständige Erhebung konfigurationsrelevanter Informationen
- Systematische Dokumentation des Kundenkontexts
- Basis für die spätere Konfigurationsgenerierung mit dem Master Creator

---

## 2. Vorbereitung

### 2.1 Erforderliche Unterlagen
- [ ] GRACE-Onboarding-Fragebogen (Kompakt-Version, 15 Fragen)
- [ ] Laptop/Tablet für Notizen
- [ ] Entity-Mapping-Workbook (Referenz)
- [ ] Beispiel-Konfiguration (optional, zur Veranschaulichung)

### 2.2 Zeitplanung
- **Dauer:** 2-3 Stunden
- **Empfohlenes Format:** Präsenz-Workshop oder Videokonferenz
- **Teilnehmer:** 2-4 Personen (Kunde + seitcom)

### 2.3 Vorab-Kommunikation
- Terminbestätigung mind. 48h vorher
- Agenda an Kunden senden
- Bei Bedarf: NDA abschließen

---

## 3. Workshop-Ablauf

### 3.1 Einleitung (15 Minuten)

**Begrüßung und Vorstellung**
- Vorstellungsrunde
- Ziele des Workshops klären
- Zeitplan kommunizieren

**GRACE-Überblick**
- Kurze Präsentation: Was ist GRACE?
- Welche Probleme löst GRACE?
- Wie funktioniert der Konfigurationsprozess?

**Erwartungsmanagement**
- Erklären, welche Informationen benötigt werden
- Klarstellen, dass Details später präzisiert werden können
- Vertraulichkeit zusichern (NDA, DSGVO)

### 3.2 Informationserhebung (90-120 Minuten)

Die Informationserhebung erfolgt strukturiert anhand des **GRACE-Onboarding-Fragebogens (Kompakt)**. Die 15 Fragen sind in thematische Blöcke gegliedert:

#### Block 1: Werk und Organisation (5 Minuten)
**Frage 1-2:** Werksinformationen
- Werkname und Standort
- Hauptprodukte
- Besonderheiten des Standorts

**Ziel:** Grundverständnis der Produktionsumgebung

---

#### Block 2: Materialien (15-20 Minuten)
**Frage 3-4:** Materialkatalog
- Welche Rohstoffe werden verwendet?
- Welche Zwischen- und Endprodukte gibt es?
- Mengeneinheiten (kg, L, Tonnen, etc.)

**Dokumentation:**
```
Material: [Name]
Typ: Rohstoff / Zwischenprodukt / Endprodukt
Einheit: [kg/L/Stück/...]
Besonderheiten: [Lagerbedingungen, Lieferanten, etc.]
```

**Hinweis:** Nicht alle Details müssen sofort geklärt werden. Grobe Übersicht reicht.

---

#### Block 3: Maschinen und Anlagen (20-25 Minuten)
**Frage 5-7:** Maschinenpark
- Welche Produktionsanlagen gibt es?
- Wie viele Einheiten pro Maschinentyp?
- Betriebskosten bekannt? (wenn ja, notieren; wenn nein, später klären)

**Dokumentation:**
```
Maschine: [Name]
Typ: Mixer / Dissolver / Pumpe / ...
Anzahl: [X] Einheiten
Betriebskosten: [€/h] oder "unbekannt"
Besonderheiten: [Kapazität, Einschränkungen]
```

**Typische Maschinentypen in der Chemieindustrie:**
- Mixer (High-Speed, Low-Speed)
- Dissolver
- Pumpen
- Rohrleitungssysteme
- Filter
- Abfüllanlagen

---

#### Block 4: Produkte (10-15 Minuten)
**Frage 8-9:** Produktkatalog
- Welche Endprodukte werden hergestellt?
- Produktionsmengen pro Produkt (typische Batch-Größen)

**Dokumentation:**
```
Produkt: [Name]
Typische Batch-Größe: [X] kg/L
Produktionsfrequenz: täglich / wöchentlich / monatlich
```

---

#### Block 5: Produktionsprozesse (30-40 Minuten)
**Frage 10-12:** Prozessabläufe
- Welche Prozessschritte gibt es für jedes Produkt?
- Zeitangaben pro Schritt (Minuten/Stunden)
- Reihenfolge der Schritte

**Dokumentation:**
```
Produkt: [Name]
Prozess:
  Schritt 1: [Name] - Dauer: [X] Minuten
  Schritt 2: [Name] - Dauer: [X] Minuten
  Schritt 3: [Name] - Dauer: [X] Minuten
```

**Wichtig:** Zeiten in Minuten erfassen (werden später in Sekunden umgerechnet)

**Typische Prozessschritte:**
- Dosierung (Dosing)
- Mischen (Mixing)
- Dispersion
- Filtration
- Abfüllung (Packout)
- Qualitätskontrolle

---

#### Block 6: Stücklisten (BOMs) (15-20 Minuten)
**Frage 13-14:** Zusammensetzung der Produkte
- Welche Materialien werden für jedes Produkt benötigt?
- Mengenangaben pro Material

**Dokumentation:**
```
Produkt: [Name]
BOM (Stückliste):
  - [Material 1]: [X] kg
  - [Material 2]: [Y] kg
  - [Material 3]: [Z] kg
Gesamtmenge: [Summe] kg
```

**Wichtig:** Gesamtmenge muss exakt der Summe der Einzelmengen entsprechen

---

#### Block 7: Rezepte (5 Minuten)
**Frage 15:** Zusammenhänge klären
- Welches Produkt verwendet welche BOM und welchen Prozess?

**Dokumentation:**
```
Rezept: [Produktname]
  -> Verwendet BOM: [BOM-Name]
  -> Verwendet Prozess: [Prozess-Name]
```

**Hinweis:** Diese Verknüpfungen werden später im Master Creator automatisch erstellt.

---

### 3.3 Abschluss und Nachbereitung (15 Minuten)

**Zusammenfassung**
- Erhobene Informationen kurz rekapitulieren
- Offene Punkte identifizieren
- Klären, wer fehlende Informationen nachliefert

**Nächste Schritte kommunizieren**
- Erklären, dass Konfiguration erstellt wird
- Zeitrahmen nennen (mit Master Creator: Stunden statt Wochen)
- Kontaktperson für Rückfragen benennen

**Dokumentation abschließen**
- Workshop-Protokoll erstellen
- An Kunden zur Bestätigung senden
- In internem System ablegen

---

## 4. Dokumentation

### 4.1 Workshop-Protokoll erstellen

Unmittelbar nach dem Workshop:

1. **Notizen strukturieren** anhand der 15 Fragen
2. **Workshop-Protokoll erstellen** (Markdown oder Word)
3. **An Kunden senden** zur Bestätigung
4. **In Projektordner ablegen**

### 4.2 Protokoll-Template

```markdown
# GRACE-Onboarding Workshop Protokoll

**Datum:** [TT.MM.JJJJ]
**Kunde:** [Firmenname]
**Werk:** [Werkname, Standort]
**Teilnehmer:** [Namen]
**Dauer:** [Start-Ende]

## 1. Werksinformationen
[...]

## 2. Materialien
[...]

## 3. Maschinen
[...]

## 4. Produkte
[...]

## 5. Prozesse
[...]

## 6. Stücklisten (BOMs)
[...]

## 7. Rezepte
[...]

## 8. Offene Punkte
- [ ] [Punkt 1]
- [ ] [Punkt 2]

## 9. Nächste Schritte
[...]
```

---

## 5. Qualitätssicherung

### 5.1 Checkliste: Workshop erfolgreich durchgeführt

Nach jedem Workshop prüfen:

- [ ] Alle 15 Fragen des Kompakt-Fragebogens beantwortet
- [ ] Mindestens 3 Materialien dokumentiert
- [ ] Mindestens 2 Maschinen dokumentiert
- [ ] Mindestens 1 Produkt vollständig erfasst (inkl. BOM + Prozess)
- [ ] Zeitangaben für Prozessschritte erfasst
- [ ] Offene Punkte klar dokumentiert
- [ ] Workshop-Protokoll erstellt
- [ ] Protokoll an Kunden versendet

### 5.2 Häufige Probleme und Lösungen

| Problem | Lösung |
|---------|--------|
| **Kunde kennt Betriebskosten nicht** | Mit 0 € notieren, später optional ergänzen |
| **Zeitangaben für Prozesse unklar** | Grobe Schätzung erfragen, später präzisieren |
| **BOM-Mengen nicht verfügbar** | Typische Batch-Größen erfragen, Details später |
| **Prozessschritte zu komplex** | Auf Haupt-Schritte reduzieren, Details später ergänzen |
| **Kunde überfordert mit Details** | Fokus auf 1-2 Beispielprodukte, nicht alle auf einmal |

---

## 6. Übergabe an nächsten Prozessschritt

### 6.1 Ausgabe des Workshops
- [OK] Ausgefüllter Fragebogen (digital)
- [OK] Workshop-Protokoll (Markdown/Word)
- [OK] Optional: Fotos von Whiteboards/Flipcharts
- [OK] Liste offener Punkte

### 6.2 Nächster Prozessschritt
-> **SOP 02: Master Creator nutzen**
- Workshop-Protokoll wird als Input für den Master Creator verwendet
- Informationen werden in strukturierte JSON-Entities umgewandelt

---

## 7. Anhang

### 7.1 Kompakt-Fragebogen (15 Fragen)

Siehe: `GRACE_Onboarding_Fragebogen_KOMPAKT.md`

### 7.2 Vollversion-Fragebogen (96 Fragen)

Siehe: `GRACE_Onboarding_Fragebogen.md`

**Hinweis:** Die Vollversion dient als Brainstorming-Basis. Für Kundengespräche wird die Kompakt-Version empfohlen.

---

## 8. Revisionsverlauf

| Version | Datum | Änderungen | Autor |
|---------|-------|------------|-------|
| 1.0 | 13.01.2026 | Initiale Erstellung | Konfigurationsteam |

---

**Ende SOP 01**
