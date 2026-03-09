# APS Master Creator - Fixed Version

**One intelligent app to create ALL 6 entity types with smart AI detection and auto-dependency creation.**

---

## What's Fixed

This version fixes all the critical issues from the previous implementation:

### 1. Product Material References
- **Before**: AI invented ingredients (e.g., "titanium-dioxide" when user said "white pigment paste")
- **Now**: Product material.id matches the product being produced
- Example: "I produce White Pigment Paste" → material.id = "white-pigment-paste"

### 2. Machine Defaults
- **Before**: AI invented initialUnits, operatingCosts, set isSpatial=true
- **Now**: Uses proper defaults:
  - `initialUnits`: Counts from user message ("a mixer" = 1, "3 mixers" = 3)
  - `operatingCosts`: User's value or 0 (never guessed)
  - `isSpatial`: false (unless user specifies)
  - `unitsAutoGrow`: false

### 3. Process Time Conversion
- **Before**: Used `unitId: "minutes"` with raw values
- **Now**: ALWAYS uses `unitId: "s"` and converts minutes to seconds
- Example: "mixing 15 min" → `{value: 900, unitId: "s"}`

### 4. BOM baseQuantity
- **Before**: Wrong calculation
- **Now**: Always equals SUM of all item quantities
- Example: 30g + 10g + 10g → baseQuantity: 50

### 5. ID Consistency
- **Before**: AI created entities with one ID, then referenced different IDs
- **Now**: Consistent ID generation and validation
- Recipes can now be created successfully!

### 6. Download Functionality
- **Before**: One combined JSON file
- **Now**: Separate download buttons for each entity type
  - materials.json (just materials array)
  - machines.json (just machines array)
  - products.json (just products array)
  - etc.

---

## Quick Start

```bash
# 1. Start Ollama
ollama run qwen2.5-coder:7b

# 2. Start Master Creator
cd /workspace/master-creator
python3 -m http.server 9000

# 3. Open in browser
http://localhost:9000
```

---

## How It Works

The AI has been trained with **strict rules**:

### Core Principles:
1. **NEVER invent data** - Only use what the user actually said
2. **Use defaults** - For missing fields, use sensible defaults
3. **Be LITERAL** - Don't try to be smart or use domain knowledge
4. **No guessing** - If unclear, ask the user

### Smart Detection
The AI automatically detects which entity type you're creating:

```
"I need Titanium Dioxide" → Material
"We have 3 mixers at $50/hour" → Machine
"We produce White Paste" → Product
"Mixing 15 min → Filtering 10 min" → Process
"For 1000kg: 500kg A, 300kg B" → BOM
"Recipe for White Paste" → Recipe
```

### Auto-Creation
- **Products**: Auto-creates matching material
- **BOMs**: Auto-creates referenced materials
- **Recipes**: Validates all dependencies exist

---

## Download Options

**Download All (Combined)**
- One JSON file with all entity types
- Format: `{materials: [...], machines: [...], ...}`

**Individual Downloads**
- Click specific buttons to download each type separately
- `materials.json` → `[{...}, {...}]`
- `machines.json` → `[{...}, {...}]`
- etc.

---

## Example Workflow

### Step 1: Create Product
```
You: "I produce White Pigment Paste"
AI: Creates product + auto-creates material "white-pigment-paste"
Product material references itself, not ingredients!
```

### Step 2: Create Machines
```
You: "I have a dissolver, a pump, and a mixer"
AI: Creates 3 machines, each with initialUnits: 1
No invented costs, all defaults!
```

### Step 3: Create Process
```
You: "mixing 15 min, dispersion 10 min, filtration 20 min"
AI: Creates process with steps in SECONDS
{value: 900, unitId: "s"}, {value: 600, unitId: "s"}, {value: 1200, unitId: "s"}
```

### Step 4: Create BOM
```
You: "For white paste: 30g titanium dioxide, 10g peg 400, 10g tego"
AI: Creates BOM with baseQuantity = 50
Sum of items calculated correctly!
```

### Step 5: Create Recipe
```
You: "Create recipe for white pigment paste using the BOM and process"
AI: Creates recipe with correct ID references
No more ID mismatches!
```

### Step 6: Download
Click individual download buttons to get separate JSON files for each entity type!

---

## Validation

Click "Validate" to check:
- All product material references exist
- All BOM material references exist
- All recipe dependencies exist (material, BOM, process)

---

## Visual Indicators

- **Regular cards** - Blue border (user-created)
- **AUTO cards** - Yellow border with "AUTO" badge (auto-created)
- **Green messages** - Success notifications
- **Yellow messages** - Warnings (duplicates)
- **Red messages** - Errors (validation failures)

---

## System Prompt Architecture

The AI uses ONE comprehensive system prompt that includes:

1. **CRITICAL RULES** (top of prompt)
   - Never invent data
   - Use defaults
   - Be literal

2. **Entity-Specific Sections** (6 sections)
   - Each entity type has detailed rules
   - Examples of correct behavior
   - Common mistakes to avoid

3. **Response Format** (standardized)
   - `[ENTITY_TYPE: material/machine/...]`
   - Brief explanation
   - JSON code block
   - Follow-up question

---

## Key Differences from Old Version

| Issue | Old Behavior | New Behavior |
|-------|--------------|--------------|
| Product material | Guessed "titanium-dioxide" | Uses "white-pigment-paste" |
| Machine units | Invented 5, 3, 4, 2 | Counts: 1, 1, 1, 1 |
| Machine costs | Invented $100, $50, $75 | Uses 0 or user's value |
| Process times | `unitId: "minutes"` | `unitId: "s"` (converted) |
| BOM baseQuantity | Wrong (1) | Correct sum (50) |
| Recipe IDs | Mismatched | Consistent |
| Download | One combined file | Separate per type |

---

## Technical Details

### Validation Rules

**Materials**:
- `id`: lowercase-with-hyphens
- `name`: required

**Machines**:
- `operatingCosts`: required, defaults to {type: "Constant", value: 0}
- `isSpatial`: boolean, defaults to false
- `initialUnits`: number, defaults to 1
- `unitsAutoGrow`: boolean, defaults to false

**Products**:
- `material.id`: must match product being produced
- Auto-creates material if doesn't exist

**Processes**:
- `processingTime.unitId`: MUST be "s" (seconds)
- Values must be in seconds (AI converts from minutes)

**BOMs**:
- `baseQuantity`: MUST equal sum of item quantities
- `unitId`: extracted from user message
- Auto-creates materials for items

**Recipes**:
- Validates all dependencies exist before creation
- No auto-creation (too complex)

---

## Architecture

```
User Message
    ↓
AI (with strict system prompt)
    ↓
Detects entity type via [ENTITY_TYPE: ...]
    ↓
Generates JSON (literal, no invention)
    ↓
Validation (strict rules)
    ↓
Auto-creation (if applicable)
    ↓
Display + Storage
```

---

## Troubleshooting

### "AI is not responding"
```bash
ollama run qwen2.5-coder:7b
```

### "Process times showing minutes instead of seconds"
- Check the raw JSON - should be `unitId: "s"`
- Display shows user-friendly format (15 min)
- Underlying data is in seconds (900)

### "Recipe cannot be created - missing entities"
- Check the exact IDs of your entities
- Make sure material, BOM, and process all exist
- IDs must match exactly (case-sensitive, hyphenated)

### "Download not working"
- Check browser console for errors
- Make sure entities exist before downloading
- Try individual downloads instead of combined

---

**Built with STRICT RULES - No more guessing, no more mistakes!**
