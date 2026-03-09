// APS Master Creator - Fixed Version
console.log('APS Master Creator Loading...');

// ====================================
// STORAGE
// ====================================
let materials = [];
let machines = [];
let products = [];
let processes = [];
let boms = [];
let recipes = [];
let conversationHistory = [];

// ====================================
// CONFIGURATION
// ====================================
const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL_NAME = 'qwen2.5-coder:7b';

// ====================================
// MASTER SYSTEM PROMPT
// ====================================
const SYSTEM_PROMPT = `You are an APS Configuration Assistant.

═══════════════════════════════════════════════════════════════════════
STEP 1: DETECT ENTITY TYPE - CHECK KEYWORDS IN THIS ORDER!
═══════════════════════════════════════════════════════════════════════

1. If user says "produce" or "manufacture" → PRODUCT (not material!)
2. If user says "machine", "equipment", "mixer", "pump", "dissolver", "pipe", "washer", "disperser", "extruder", "strainer" → MACHINE
3. If user describes steps with "→" or "min" or "process" → PROCESS
4. If user says "bom" or lists ingredients with quantities → BOM
5. If user says "recipe" → RECIPE
6. Otherwise → MATERIAL

CRITICAL: "I produce X" = PRODUCT, not material!
CRITICAL: Use EXACTLY what user said, don't copy from examples!

═══════════════════════════════════════════════════════════════════════
UNIVERSAL RULES FOR ALL ENTITY TYPES:
═══════════════════════════════════════════════════════════════════════

1. NEVER invent or guess data
2. Use EXACT names/values from user's message
3. Use defaults for missing fields
4. IDs are lowercase-with-hyphens
5. MULTIPLE ENTITIES: Create SEPARATE code blocks for each entity
   - "a mixer, a pump, a dissolver" = 3 separate JSON code blocks
   - The app will automatically process all blocks and combine them

═══════════════════════════════════════════════════════════════

ENTITY TYPE 1: MATERIAL
When user mentions: materials, substances, pigments, ingredients

Structure:
{
  "id": "lowercase-with-hyphens",
  "name": "Human Readable Name",
  "comment": "Optional description or empty string"
}

Example:
User: "I need Titanium Dioxide"
You create:
{
  "id": "titanium-dioxide",
  "name": "Titanium Dioxide",
  "comment": ""
}

═══════════════════════════════════════════════════════════════

ENTITY TYPE 2: MACHINE
When user mentions: machines, equipment, mixers, dissolvers, pumps

Structure:
{
  "id": "lowercase-with-hyphens",
  "name": "Human Readable Name",
  "operatingCosts": {"type": "Constant", "value": 0},
  "isSpatial": false,
  "initialUnits": 1,
  "unitsAutoGrow": false
}

CRITICAL RULES FOR MACHINES:
- operatingCosts.value: Use user's value if provided, otherwise 0 (NEVER guess!)
- initialUnits: Count from user message ("a mixer" = 1, "3 mixers" = 3, "mixer" = 1)
- isSpatial: ALWAYS false (unless user specifically says spatial)
- unitsAutoGrow: ALWAYS false

MULTIPLE MACHINES: Create SEPARATE code blocks for each machine!

Example 1: User says "I have a dissolver, a pump, and a mixer"
Create THREE separate JSON blocks:

\`\`\`json
{"id": "dissolver", "name": "Dissolver", "operatingCosts": {"type": "Constant", "value": 0}, "isSpatial": false, "initialUnits": 1, "unitsAutoGrow": false}
\`\`\`

\`\`\`json
{"id": "pump", "name": "Pump", "operatingCosts": {"type": "Constant", "value": 0}, "isSpatial": false, "initialUnits": 1, "unitsAutoGrow": false}
\`\`\`

\`\`\`json
{"id": "mixer", "name": "Mixer", "operatingCosts": {"type": "Constant", "value": 0}, "isSpatial": false, "initialUnits": 1, "unitsAutoGrow": false}
\`\`\`

Example 2: User says "I have 3 mixers at $50/hour"
Create ONE JSON block:

\`\`\`json
{"id": "mixer", "name": "Mixer", "operatingCosts": {"type": "Constant", "value": 50}, "isSpatial": false, "initialUnits": 3, "unitsAutoGrow": false}
\`\`\`

═══════════════════════════════════════════════════════════════

ENTITY TYPE 3: PRODUCT
Triggered by: "produce", "manufacture"

Structure:
{
  "id": "product-name-prod",
  "name": "Product Name",
  "material": {"version": 1, "id": "product-name"}
}

CRITICAL RULES:
1. Extract product name from user message (e.g., "blue pigment paste")
2. Use that EXACT name for the product
3. material.id = same as product name (hyphenated)
4. DO NOT invent ingredients!

STEP-BY-STEP:
User says: "I produce blue pigment paste"
Step 1: Detect "produce" → PRODUCT
Step 2: Extract name: "blue pigment paste"
Step 3: Create product with that name
Step 4: material.id = "blue-pigment-paste" (same as product!)

Example:
{
  "id": "blue-pigment-paste-prod",
  "name": "Blue Pigment Paste",
  "material": {"version": 1, "id": "blue-pigment-paste"}
}

The material is the PRODUCT ITSELF, not ingredients!

═══════════════════════════════════════════════════════════════

ENTITY TYPE 4: PROCESS
When user describes: steps, workflow, sequence, arrows (→)

Structure:
{
  "id": "process-name",
  "name": "Process Name",
  "steps": [
    {
      "id": "step-1",
      "name": "Step Name",
      "processingTime": {"type": "Constant", "value": 300, "unitId": "s"},
      "resourceDemands": [],
      "isParallelizable": false
    }
  ],
  "links": []
}

CRITICAL RULES FOR PROCESSES:
- processingTime.unitId MUST ALWAYS be "s" (seconds), NEVER "minutes" or "min"
- If user says minutes, CONVERT to seconds: 5min=300, 10min=600, 15min=900, 20min=1200
- resourceDemands: ALWAYS empty array [] (unless user specifies machines)
- isParallelizable: ALWAYS false

Example:
User: "mixing 15 min, dispersion 10 min, filtration 20 min"
You create:
{
  "id": "mixing-dispersion-filtration",
  "name": "Mixing Dispersion Filtration Process",
  "steps": [
    {"id": "step-1", "name": "Mixing", "processingTime": {"type": "Constant", "value": 900, "unitId": "s"}, "resourceDemands": [], "isParallelizable": false},
    {"id": "step-2", "name": "Dispersion", "processingTime": {"type": "Constant", "value": 600, "unitId": "s"}, "resourceDemands": [], "isParallelizable": false},
    {"id": "step-3", "name": "Filtration", "processingTime": {"type": "Constant", "value": 1200, "unitId": "s"}, "resourceDemands": [], "isParallelizable": false}
  ],
  "links": []
}

═══════════════════════════════════════════════════════════════

ENTITY TYPE 5: BOM (Bill of Materials)
When user lists: ingredients, quantities, "for X we need Y"

Structure:
{
  "id": "bom-name",
  "name": "BOM Name",
  "baseQuantity": 50,
  "unitId": "g",
  "items": [
    {"key": "1", "material": {"version": 1, "id": "material-id"}, "quantity": 30}
  ]
}

CRITICAL RULES FOR BOMS:
- baseQuantity: MUST equal EXACT SUM of all item quantities
  CALCULATE: Add up ALL quantities before setting baseQuantity
  Example: 10g + 60g + 10g + 20g = 100g (NOT 90g!)
- unitId: Extract from user message ("g", "kg", "l")
- items[].key: Use "1", "2", "3" etc.
- items[].material.version: ALWAYS 1

STEP-BY-STEP FOR BOM:
User: "grey pigment 10g, titanium dioxide 60g, peg 400 10g, tego 20g"
Step 1: List items with quantities: 10, 60, 10, 20
Step 2: Calculate sum: 10 + 60 + 10 + 20 = 100
Step 3: Set baseQuantity = 100 (the EXACT sum, no rounding!)

Example:
{
  "id": "grey-pigment-paste-bom",
  "name": "Grey Pigment Paste BOM",
  "baseQuantity": 100,
  "unitId": "g",
  "items": [
    {"key": "1", "material": {"version": 1, "id": "grey-pigment"}, "quantity": 10},
    {"key": "2", "material": {"version": 1, "id": "titanium-dioxide"}, "quantity": 60},
    {"key": "3", "material": {"version": 1, "id": "peg-400"}, "quantity": 10},
    {"key": "4", "material": {"version": 1, "id": "tego"}, "quantity": 20}
  ]
}

═══════════════════════════════════════════════════════════════

ENTITY TYPE 6: RECIPE
When user says: "recipe", "connect"

Structure:
{
  "id": "recipe-name",
  "name": "Recipe Name",
  "resultingMaterial": {"version": 1, "id": "material-id"},
  "bom": {"version": 1, "id": "bom-id"},
  "productionProcess": {"version": 1, "id": "process-id"}
}

CRITICAL RULES FOR RECIPES:
1. Look at the EXISTING ENTITIES list at the top of the message
2. Extract product name from user message (e.g., "purple pigment paste")
3. Find matching entities from the existing list:
   - Find BOM with matching product name (e.g., "purple-pigment-paste-bom")
   - Find Process that was created in this session
4. Build recipe using EXACT IDs from the existing entities list
5. All version fields are ALWAYS 1

IMPORTANT: Use the EXACT process ID from the existing entities list!
Don't convert or modify it - just copy the exact ID you see!

CONVERTING PROCESS NAME TO ID:
User says: "Dosing Mixing Filtration Packout Process"
Step 1: Take the name: "Dosing Mixing Filtration Packout Process"
Step 2: Remove common words: "Dosing Mixing Filtration Packout" (remove "Process")
Step 3: Convert to lowercase: "dosing mixing filtration packout"
Step 4: Replace spaces with hyphens: "dosing-mixing-filtration-packout"
Result: productionProcess.id = "dosing-mixing-filtration-packout"

DO NOT add "-process" suffix! The ID is just the name converted to lowercase-with-hyphens!

Example 1:
Context shows:
- Processes: dosing-mixing-filtration-packout (Dosing Mixing Filtration Packout Process)
- BOMs: purple-pigment-paste-bom (Purple Pigment Paste BOM)
- Materials: purple-pigment-paste

User: "create recipe for purple pigment paste"

You see the existing entities and use their EXACT IDs:

\`\`\`json
{
  "id": "purple-pigment-paste-recipe",
  "name": "Purple Pigment Paste Recipe",
  "resultingMaterial": {"version": 1, "id": "purple-pigment-paste"},
  "bom": {"version": 1, "id": "purple-pigment-paste-bom"},
  "productionProcess": {"version": 1, "id": "dosing-mixing-filtration-packout"}
}
\`\`\`

You used the EXACT process ID from the context: "dosing-mixing-filtration-packout"

═══════════════════════════════════════════════════════════════

RESPONSE FORMAT:
First line: [ENTITY_TYPE: material/machine/product/process/bom/recipe]
Brief explanation
JSON code block
Simple follow-up question

EXAMPLE RESPONSE:
[ENTITY_TYPE: material]
I'll create Titanium Dioxide as a material.

\`\`\`json
{
  "id": "titanium-dioxide",
  "name": "Titanium Dioxide",
  "comment": ""
}
\`\`\`

What is this material used for?

═══════════════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════════════════
CRITICAL EXAMPLES - LEARN FROM THESE!
═══════════════════════════════════════════════════════════════════════

Example 1: User says "I produce blue pigment paste"
CORRECT:
[ENTITY_TYPE: product]
{
  "id": "blue-pigment-paste-prod",
  "name": "Blue Pigment Paste",
  "material": {"version": 1, "id": "blue-pigment-paste"}
}

WRONG:
- Creating material instead of product ❌
- Using "white" instead of "blue" ❌
- Using "titanium-dioxide" as material ❌

Example 2: User says "I have a mixer, a pump, and a dissolver"
CORRECT: Create 3 SEPARATE JSON blocks:
\`\`\`json
{"id": "mixer", ...}
\`\`\`
\`\`\`json
{"id": "pump", ...}
\`\`\`
\`\`\`json
{"id": "dissolver", ...}
\`\`\`

WRONG:
- Creating 1 machine with initialUnits: 3 ❌
- Putting all 3 in one JSON array ❌
- Multiple JSON objects without separate code blocks ❌

Example 3: User says "we have 1 mixer, 1 pump, pipe system"
CORRECT: Create 3 separate machines (mixer, pump, pipe-system)
WRONG: Only creating 2 machines and forgetting pipe system ❌

Example 4: User says "grey pigment 10g, titanium dioxide 60g, peg 400 10g, tego 20g"
CORRECT: baseQuantity = 100 (10+60+10+20 = 100)
WRONG: baseQuantity = 90 (miscalculated) ❌

Example 5: User says "create recipe for purple pigment paste, process is Dosing Mixing Filtration Packout Process"
CORRECT:
- resultingMaterial.id = "purple-pigment-paste"
- bom.id = "purple-pigment-paste-bom"
- productionProcess.id = "dosing-mixing-filtration-packout" (name without "Process", lowercased, hyphenated)

WRONG:
- productionProcess.id = "dosing-mixing-filtration-packout-process" (added "-process") ❌
- productionProcess.id = "mixing-dispersion-filtration" (invented different ID) ❌
- resultingMaterial.id = "purple-pigment" (shortened) ❌

═══════════════════════════════════════════════════════════════════════
FINAL CHECKLIST BEFORE RESPONDING:
═══════════════════════════════════════════════════════════════════════

1. ✓ Did I detect the entity type correctly by checking keywords?
2. ✓ Did I use the EXACT name from user's message?
3. ✓ Did I avoid copying from examples/welcome message?
4. ✓ Did I use defaults instead of inventing values?
5. ✓ For products: Is material.id = product name (not an ingredient)?

REMEMBER:
- NEVER invent data
- Use defaults for missing fields
- Be LITERAL - use what user ACTUALLY said
- Convert minutes to seconds ALWAYS
- Product material = product itself, not ingredients
- BOM baseQuantity = sum of items`;

// ====================================
// INITIALIZATION
// ====================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Initializing...');

    // Sidebar toggle
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarState = localStorage.getItem('sidebarCollapsed');

    // Restore sidebar state
    if (sidebarState === 'true') {
        sidebar.classList.add('collapsed');
    }

    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        const isCollapsed = sidebar.classList.contains('collapsed');
        localStorage.setItem('sidebarCollapsed', isCollapsed);
    });

    document.getElementById('send-btn').addEventListener('click', handleSendMessage);
    document.getElementById('download-btn').addEventListener('click', handleDownloadAll);
    document.getElementById('validate-btn').addEventListener('click', handleValidate);
    document.getElementById('summarize-btn').addEventListener('click', handleSummarizeChat);
    document.getElementById('clear-btn').addEventListener('click', handleClear);

    document.getElementById('user-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleSendMessage();
    });

    // Tab switching
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    // Sidebar navigation
    document.querySelectorAll('.stat-item').forEach(item => {
        item.addEventListener('click', () => {
            const tabName = item.dataset.tab;
            if (tabName) switchTab(tabName);
        });
    });

    showWelcomeMessage();
    console.log('✅ Ready!');
});

function showWelcomeMessage() {
    addMessage('assistant', `Welcome to the APS Master Creator!

I can create ANY entity type:
• Materials - "I need Titanium Dioxide"
• Machines - "We have 3 mixers at $50/hour"
• Products - "We produce White Paste"
• Processes - "Dosing (5min) → Mixing (15min)"
• BOMs - "For 1000kg: 500kg Titanium, 300kg Wax"
• Recipes - "Recipe for White Paste"

Just tell me what you want to create!`);
}

// ====================================
// MESSAGE HANDLING
// ====================================
function handleSendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    if (!message) return alert('⚠️ Type something!');

    addMessage('user', message);
    input.value = '';

    conversationHistory.push({role: 'user', content: message});
    sendToAI(message);
}

async function sendToAI(userMessage) {
    showThinkingIndicator();

    // Build context summary of existing entities
    let contextSummary = '';

    if (materials.length > 0 || machines.length > 0 || products.length > 0 ||
        processes.length > 0 || boms.length > 0 || recipes.length > 0) {

        contextSummary = '\n\n═══ EXISTING ENTITIES IN THIS SESSION ═══\n';

        if (materials.length > 0) {
            contextSummary += `Materials: ${materials.map(m => m.id).join(', ')}\n`;
        }
        if (machines.length > 0) {
            contextSummary += `Machines: ${machines.map(m => m.id).join(', ')}\n`;
        }
        if (products.length > 0) {
            contextSummary += `Products: ${products.map(p => p.id).join(', ')}\n`;
        }
        if (processes.length > 0) {
            contextSummary += `Processes: ${processes.map(p => `${p.id} (${p.name})`).join(', ')}\n`;
        }
        if (boms.length > 0) {
            contextSummary += `BOMs: ${boms.map(b => `${b.id} (${b.name})`).join(', ')}\n`;
        }
        if (recipes.length > 0) {
            contextSummary += `Recipes: ${recipes.map(r => r.id).join(', ')}\n`;
        }

        contextSummary += '═══════════════════════════════════════\n\n';
    }

    // Prepend context to user message
    const messageWithContext = contextSummary + userMessage;

    try {
        const response = await fetch(OLLAMA_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                model: MODEL_NAME,
                prompt: messageWithContext,
                system: SYSTEM_PROMPT,
                stream: false,
                options: {temperature: 0.7, num_predict: 1000}
            })
        });

        if (!response.ok) throw new Error('AI not responding');

        const data = await response.json();
        const aiResponse = data.response;

        removeThinkingIndicator();
        addMessage('assistant', aiResponse);

        conversationHistory.push({role: 'assistant', content: aiResponse});

        processAIResponse(aiResponse);

    } catch (error) {
        removeThinkingIndicator();
        addMessage('error', '❌ Could not connect to AI.\n\nMake sure Ollama is running:\nollama run qwen2.5-coder:7b');
        console.error('Error:', error);
    }
}

// ====================================
// PROCESS AI RESPONSE
// ====================================
function processAIResponse(text) {
    // Detect entity type
    const typeMatch = text.match(/\[ENTITY_TYPE:\s*(\w+)\]/i);
    const entityType = typeMatch ? typeMatch[1].toLowerCase() : null;

    // Extract JSON
    const jsonRegex = /```json\s*([\s\S]*?)\s*```/g;
    const matches = text.matchAll(jsonRegex);

    for (const match of matches) {
        try {
            const data = JSON.parse(match[1]);

            if (entityType === 'material') handleMaterial(data);
            else if (entityType === 'machine') handleMachine(data);
            else if (entityType === 'product') handleProduct(data);
            else if (entityType === 'process') handleProcess(data);
            else if (entityType === 'bom') handleBOM(data);
            else if (entityType === 'recipe') handleRecipe(data);

        } catch (error) {
            console.error('JSON parse error:', error);
        }
    }

    updateAllCounts();
}

// ====================================
// ENTITY HANDLERS
// ====================================
function handleMaterial(data) {
    if (!validateMaterial(data)) return;

    if (materials.find(m => m.id === data.id)) {
        addMessage('warning', `⚠️ Material "${data.id}" already exists.`);
        return;
    }

    materials.push(data);
    displayMaterial(data);
    addMessage('notification', `✅ Created material: ${data.name}`);
}

function handleMachine(data) {
    if (!validateMachine(data)) return;

    if (machines.find(m => m.id === data.id)) {
        addMessage('warning', `⚠️ Machine "${data.id}" already exists.`);
        return;
    }

    machines.push(data);
    displayMachine(data);
    addMessage('notification', `✅ Created machine: ${data.name}`);
}

function handleProduct(data) {
    // Auto-create material if doesn't exist
    const materialId = data.material.id;
    if (!materials.find(m => m.id === materialId)) {
        const autoMaterial = {
            id: materialId,
            name: data.name, // Use product name for material name
            comment: "Auto-created for product"
        };
        materials.push(autoMaterial);
        displayMaterial(autoMaterial, true);
        addMessage('notification', `🔄 Auto-created material: ${materialId}`);
    }

    if (!validateProduct(data)) return;

    if (products.find(p => p.id === data.id)) {
        addMessage('warning', `⚠️ Product "${data.id}" already exists.`);
        return;
    }

    products.push(data);
    displayProduct(data);
    addMessage('notification', `✅ Created product: ${data.name}`);
}

function handleProcess(data) {
    if (!validateProcess(data)) return;

    if (processes.find(p => p.id === data.id)) {
        addMessage('warning', `⚠️ Process "${data.id}" already exists.`);
        return;
    }

    processes.push(data);
    displayProcess(data);
    addMessage('notification', `✅ Created process: ${data.name} with ${data.steps.length} step(s)`);
}

function handleBOM(data) {
    // Auto-calculate baseQuantity from items (AI is bad at math!)
    if (data.items && data.items.length > 0) {
        const calculatedSum = data.items.reduce((total, item) => total + item.quantity, 0);
        if (data.baseQuantity !== calculatedSum) {
            addMessage('notification', `🔧 Auto-corrected baseQuantity from ${data.baseQuantity} to ${calculatedSum}`);
            data.baseQuantity = calculatedSum;
        }
    }

    // Auto-create materials for items if they don't exist
    data.items.forEach(item => {
        const matId = item.material.id;
        if (!materials.find(m => m.id === matId)) {
            const autoMat = {
                id: matId,
                name: matId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                comment: "Auto-created from BOM"
            };
            materials.push(autoMat);
            displayMaterial(autoMat, true);
            addMessage('notification', `🔄 Auto-created material: ${matId}`);
        }
    });

    if (!validateBOM(data)) return;

    if (boms.find(b => b.id === data.id)) {
        addMessage('warning', `⚠️ BOM "${data.id}" already exists.`);
        return;
    }

    boms.push(data);
    displayBOM(data);
    addMessage('notification', `✅ Created BOM: ${data.name} with ${data.items.length} item(s)`);
}

function handleRecipe(data) {
    // Check dependencies
    const missing = [];

    if (!materials.find(m => m.id === data.resultingMaterial.id)) {
        missing.push(`Material: ${data.resultingMaterial.id}`);
    }
    if (!boms.find(b => b.id === data.bom.id)) {
        missing.push(`BOM: ${data.bom.id}`);
    }
    if (!processes.find(p => p.id === data.productionProcess.id)) {
        missing.push(`Process: ${data.productionProcess.id}`);
    }

    if (missing.length > 0) {
        addMessage('error', `❌ Recipe cannot be created. Missing:\n${missing.join('\n')}\n\nCreate these first!`);
        return;
    }

    if (!validateRecipe(data)) return;

    if (recipes.find(r => r.id === data.id)) {
        addMessage('warning', `⚠️ Recipe "${data.id}" already exists.`);
        return;
    }

    recipes.push(data);
    displayRecipe(data);
    addMessage('notification', `✅ Created recipe: ${data.name}`);
}

// ====================================
// VALIDATORS
// ====================================
function validateMaterial(m) {
    const errors = [];
    if (!m.id || !/^[a-z0-9-]+$/.test(m.id)) errors.push('Invalid id');
    if (!m.name) errors.push('Missing name');

    if (errors.length > 0) {
        addMessage('error', '❌ Validation failed:\n' + errors.join('\n'));
        return false;
    }
    return true;
}

function validateMachine(m) {
    const errors = [];
    if (!m.id || !/^[a-z0-9-]+$/.test(m.id)) errors.push('Invalid id');
    if (!m.name) errors.push('Missing name');
    if (!m.operatingCosts) errors.push('Missing operatingCosts');
    if (typeof m.isSpatial !== 'boolean') errors.push('isSpatial must be boolean');
    if (typeof m.initialUnits !== 'number') errors.push('initialUnits must be number');

    if (errors.length > 0) {
        addMessage('error', '❌ Validation failed:\n' + errors.join('\n'));
        return false;
    }
    return true;
}

function validateProduct(p) {
    const errors = [];
    if (!p.id || !/^[a-z0-9-]+$/.test(p.id)) errors.push('Invalid id');
    if (!p.name) errors.push('Missing name');
    if (!p.material || !p.material.id) errors.push('Missing material reference');

    if (errors.length > 0) {
        addMessage('error', '❌ Validation failed:\n' + errors.join('\n'));
        return false;
    }
    return true;
}

function validateProcess(p) {
    const errors = [];
    if (!p.id || !/^[a-z0-9-]+$/.test(p.id)) errors.push('Invalid id');
    if (!p.name) errors.push('Missing name');

    // Validate all steps have unitId: "s"
    if (p.steps) {
        p.steps.forEach((step, i) => {
            if (step.processingTime && step.processingTime.unitId !== 's') {
                errors.push(`Step ${i+1}: processingTime.unitId must be "s" (seconds), got "${step.processingTime.unitId}"`);
            }
        });
    }

    if (errors.length > 0) {
        addMessage('error', '❌ Validation failed:\n' + errors.join('\n'));
        return false;
    }
    return true;
}

function validateBOM(b) {
    const errors = [];
    if (!b.id || !/^[a-z0-9-]+$/.test(b.id)) errors.push('Invalid id');
    if (!b.name) errors.push('Missing name');
    if (typeof b.baseQuantity !== 'number') errors.push('Missing baseQuantity');
    if (!b.unitId) errors.push('Missing unitId');

    // Check if baseQuantity matches sum of items
    if (b.items && b.items.length > 0) {
        const sum = b.items.reduce((total, item) => total + item.quantity, 0);
        if (b.baseQuantity !== sum) {
            errors.push(`baseQuantity (${b.baseQuantity}) should equal sum of items (${sum})`);
        }
    }

    if (errors.length > 0) {
        addMessage('error', '❌ Validation failed:\n' + errors.join('\n'));
        return false;
    }
    return true;
}

function validateRecipe(r) {
    const errors = [];
    if (!r.id || !/^[a-z0-9-]+$/.test(r.id)) errors.push('Invalid id');
    if (!r.name) errors.push('Missing name');
    if (!r.resultingMaterial || !r.resultingMaterial.id) errors.push('Missing resultingMaterial');
    if (!r.bom || !r.bom.id) errors.push('Missing bom');
    if (!r.productionProcess || !r.productionProcess.id) errors.push('Missing productionProcess');

    if (errors.length > 0) {
        addMessage('error', '❌ Validation failed:\n' + errors.join('\n'));
        return false;
    }
    return true;
}

// ====================================
// DISPLAY FUNCTIONS
// ====================================
function displayMaterial(m, autoCreated = false) {
    const panel = document.getElementById('materials-panel');
    removeEmptyState(panel);

    const card = document.createElement('div');
    card.className = 'entity-card' + (autoCreated ? ' auto-created' : '');
    card.innerHTML = `
        <h3>${esc(m.name)}${autoCreated ? '<span class="badge">AUTO</span>' : ''}</h3>
        <p><strong>ID:</strong> ${esc(m.id)}</p>
        ${m.comment ? `<p><strong>Description:</strong> ${esc(m.comment)}</p>` : ''}
    `;
    panel.appendChild(card);
}

function displayMachine(m) {
    const panel = document.getElementById('machines-panel');
    removeEmptyState(panel);

    const card = document.createElement('div');
    card.className = 'entity-card';
    card.innerHTML = `
        <h3>${esc(m.name)}</h3>
        <p><strong>ID:</strong> ${esc(m.id)}</p>
        <p><strong>Operating Cost:</strong> $${m.operatingCosts.value}/hr</p>
        <p><strong>Units:</strong> ${m.initialUnits} (Auto-grow: ${m.unitsAutoGrow ? 'Yes' : 'No'})</p>
        <p><strong>Spatial:</strong> ${m.isSpatial ? 'Yes' : 'No'}</p>
    `;
    panel.appendChild(card);
}

function displayProduct(p) {
    const panel = document.getElementById('products-panel');
    removeEmptyState(panel);

    const card = document.createElement('div');
    card.className = 'entity-card';
    card.innerHTML = `
        <h3>${esc(p.name)}</h3>
        <p><strong>ID:</strong> ${esc(p.id)}</p>
        <p><strong>Material:</strong> ${esc(p.material.id)} (v${p.material.version})</p>
    `;
    panel.appendChild(card);
}

function displayProcess(p) {
    const panel = document.getElementById('processes-panel');
    removeEmptyState(panel);

    const stepsHtml = (p.steps || []).map(s => {
        const timeInSeconds = s.processingTime.value;
        const timeDisplay = timeInSeconds >= 60
            ? `${Math.floor(timeInSeconds / 60)} min`
            : `${timeInSeconds} s`;
        return `<div style="background:#f0f0f0; padding:8px; margin:5px 0; border-radius:5px;">
            <strong>${esc(s.name)}:</strong> ${timeDisplay}
        </div>`;
    }).join('');

    const card = document.createElement('div');
    card.className = 'entity-card';
    card.innerHTML = `
        <h3>${esc(p.name)}</h3>
        <p><strong>ID:</strong> ${esc(p.id)}</p>
        <p><strong>Steps:</strong> ${p.steps.length}</p>
        ${stepsHtml}
    `;
    panel.appendChild(card);
}

function displayBOM(b) {
    const panel = document.getElementById('boms-panel');
    removeEmptyState(panel);

    const itemsHtml = (b.items || []).map(i =>
        `<div style="background:#f0f0f0; padding:8px; margin:5px 0; border-radius:5px;">
            <strong>${esc(i.material.id)}:</strong> ${i.quantity} ${b.unitId}
        </div>`
    ).join('');

    const card = document.createElement('div');
    card.className = 'entity-card';
    card.innerHTML = `
        <h3>${esc(b.name)}</h3>
        <p><strong>ID:</strong> ${esc(b.id)}</p>
        <p><strong>Base Quantity:</strong> ${b.baseQuantity} ${b.unitId}</p>
        <p><strong>Items:</strong> ${b.items.length}</p>
        ${itemsHtml}
    `;
    panel.appendChild(card);
}

function displayRecipe(r) {
    const panel = document.getElementById('recipes-panel');
    removeEmptyState(panel);

    const card = document.createElement('div');
    card.className = 'entity-card';
    card.innerHTML = `
        <h3>${esc(r.name)}</h3>
        <p><strong>ID:</strong> ${esc(r.id)}</p>
        <p><strong>Produces:</strong> ${esc(r.resultingMaterial.id)}</p>
        <p><strong>BOM:</strong> ${esc(r.bom.id)}</p>
        <p><strong>Process:</strong> ${esc(r.productionProcess.id)}</p>
    `;
    panel.appendChild(card);
}

// ====================================
// HELPER FUNCTIONS
// ====================================
function addMessage(role, text) {
    const div = document.createElement('div');
    div.className = `message ${role}`;
    div.textContent = text;
    document.getElementById('messages').appendChild(div);
    document.getElementById('messages').scrollTop = 9999;
}

function showThinkingIndicator() {
    addMessage('assistant', '💭 Thinking...');
}

function removeThinkingIndicator() {
    const last = document.getElementById('messages').lastElementChild;
    if (last && last.textContent === '💭 Thinking...') last.remove();
}

function removeEmptyState(panel) {
    const empty = panel.querySelector('.empty-state');
    if (empty) empty.remove();
}

function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.entity-panel').forEach(p => p.classList.remove('active'));

    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-panel`).classList.add('active');
}

function updateAllCounts() {
    const counts = {
        materials: materials.length,
        machines: machines.length,
        products: products.length,
        processes: processes.length,
        boms: boms.length,
        recipes: recipes.length
    };

    Object.keys(counts).forEach(type => {
        // Update tab counts
        document.getElementById(`count-${type}`).textContent = counts[type];
        // Update sidebar counts
        document.getElementById(`count-${type}-sidebar`).textContent = counts[type];
    });
}

function esc(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ====================================
// DOWNLOAD FUNCTIONS
// ====================================
function handleDownloadAll() {
    const config = {
        materials: materials,
        machines: machines,
        products: products,
        processes: processes,
        boms: boms,
        recipes: recipes
    };

    const total = materials.length + machines.length + products.length +
                  processes.length + boms.length + recipes.length;

    if (total === 0) {
        alert('⚠️ Nothing to download!');
        return;
    }

    const blob = new Blob([JSON.stringify(config, null, 2)], {type: 'application/json'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `aps-all-${Date.now()}.json`;
    link.click();

    addMessage('notification', `✅ Downloaded all entities (${total} total)`);
}

// Individual download functions
window.downloadMaterials = function() {
    if (materials.length === 0) return alert('⚠️ No materials to download!');
    downloadJSON(materials, 'materials.json');
    addMessage('notification', `✅ Downloaded ${materials.length} material(s)`);
};

window.downloadMachines = function() {
    if (machines.length === 0) return alert('⚠️ No machines to download!');
    downloadJSON(machines, 'machines.json');
    addMessage('notification', `✅ Downloaded ${machines.length} machine(s)`);
};

window.downloadProducts = function() {
    if (products.length === 0) return alert('⚠️ No products to download!');
    downloadJSON(products, 'products.json');
    addMessage('notification', `✅ Downloaded ${products.length} product(s)`);
};

window.downloadProcesses = function() {
    if (processes.length === 0) return alert('⚠️ No processes to download!');
    downloadJSON(processes, 'processes.json');
    addMessage('notification', `✅ Downloaded ${processes.length} process(es)`);
};

window.downloadBOMs = function() {
    if (boms.length === 0) return alert('⚠️ No BOMs to download!');
    downloadJSON(boms, 'boms.json');
    addMessage('notification', `✅ Downloaded ${boms.length} BOM(s)`);
};

window.downloadRecipes = function() {
    if (recipes.length === 0) return alert('⚠️ No recipes to download!');
    downloadJSON(recipes, 'recipes.json');
    addMessage('notification', `✅ Downloaded ${recipes.length} recipe(s)`);
};

function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
}

// ====================================
// ACTIONS
// ====================================
function handleValidate() {
    const errors = [];

    // Check product references
    products.forEach(p => {
        if (!materials.find(m => m.id === p.material.id)) {
            errors.push(`Product "${p.name}" references missing material: ${p.material.id}`);
        }
    });

    // Check BOM references
    boms.forEach(b => {
        b.items.forEach(item => {
            if (!materials.find(m => m.id === item.material.id)) {
                errors.push(`BOM "${b.name}" references missing material: ${item.material.id}`);
            }
        });
    });

    // Check recipe references
    recipes.forEach(r => {
        if (!materials.find(m => m.id === r.resultingMaterial.id)) {
            errors.push(`Recipe "${r.name}" references missing material: ${r.resultingMaterial.id}`);
        }
        if (!boms.find(b => b.id === r.bom.id)) {
            errors.push(`Recipe "${r.name}" references missing BOM: ${r.bom.id}`);
        }
        if (!processes.find(p => p.id === r.productionProcess.id)) {
            errors.push(`Recipe "${r.name}" references missing process: ${r.productionProcess.id}`);
        }
    });

    if (errors.length === 0) {
        addMessage('notification', '✅ Configuration is valid! All references are correct.');
    } else {
        addMessage('error', `❌ Validation errors:\n${errors.join('\n')}`);
    }
}

async function handleSummarizeChat() {
    const messagesContainer = document.getElementById('messages');
    const allMessages = messagesContainer.querySelectorAll('.message');

    if (allMessages.length === 0) {
        addMessage('warning', '⚠️ Kein Chat zum Zusammenfassen!');
        return;
    }

    // Collect only user and assistant messages (not notifications)
    let chatHistory = '';
    allMessages.forEach(msg => {
        if (msg.classList.contains('user')) {
            chatHistory += `User: ${msg.textContent}\n\n`;
        } else if (msg.classList.contains('assistant')) {
            chatHistory += `Assistant: ${msg.textContent}\n\n`;
        }
    });

    if (!chatHistory.trim()) {
        addMessage('warning', '⚠️ Keine relevanten Chat-Nachrichten gefunden!');
        return;
    }

    addMessage('assistant', '💭 Erstelle Zusammenfassung...');

    const summaryPrompt = `Du bist ein technischer Assistent. Fasse das folgende Konfigurationsgespräch für ein APS-System zusammen.

Extrahiere ALLE wichtigen Informationen strukturiert nach:

# Konfigurationszusammenfassung

## Werk-Informationen
- Name:
- Branche:
- Besonderheiten:

## Materialien
- Liste aller erwähnten Materialien mit Details

## Maschinen
- Liste aller Maschinen mit Anzahl, Kosten, etc.

## Produkte
- Liste aller Produkte

## Prozesse
- Beschreibung der Produktionsprozesse mit Schritten und Zeiten

## Stücklisten (BOMs)
- Welche Materialien für welches Produkt

## Rezepte
- Vollständige Rezepte (BOM + Prozess + Produkt)

## Offene Punkte
- Was fehlt noch?
- Was muss nachgefragt werden?

Sei präzise und vollständig. Nutze Markdown-Formatierung.

--- CHAT-VERLAUF ---
${chatHistory}
--- ENDE ---

Zusammenfassung:`;

    try {
        const response = await fetch(OLLAMA_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                model: MODEL_NAME,
                prompt: summaryPrompt,
                stream: false,
                options: {temperature: 0.3, num_predict: 2000}
            })
        });

        if (!response.ok) throw new Error('Ollama request failed');

        const data = await response.json();
        const summary = data.response;

        // Remove "Thinking..." message
        const messages = document.getElementById('messages');
        const last = messages.lastElementChild;
        if (last && last.textContent.includes('💭')) last.remove();

        // Display summary
        addMessage('assistant', summary);

        // Add download button
        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = '💾 Zusammenfassung als Markdown speichern';
        downloadBtn.className = 'sidebar-btn btn-download-action';
        downloadBtn.style.margin = '10px auto';
        downloadBtn.style.display = 'block';
        downloadBtn.onclick = () => {
            const blob = new Blob([summary], {type: 'text/markdown'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `chat-zusammenfassung-${new Date().toISOString().split('T')[0]}.md`;
            a.click();
            URL.revokeObjectURL(url);
            addMessage('notification', '✅ Zusammenfassung heruntergeladen');
        };
        messages.appendChild(downloadBtn);

    } catch (error) {
        console.error('Summary error:', error);
        const messages = document.getElementById('messages');
        const last = messages.lastElementChild;
        if (last && last.textContent.includes('💭')) last.remove();
        addMessage('error', '❌ Fehler beim Erstellen der Zusammenfassung. Läuft Ollama?');
    }
}

function handleClear() {
    if (!confirm('⚠️ Clear ALL entities? This cannot be undone!')) return;

    materials = [];
    machines = [];
    products = [];
    processes = [];
    boms = [];
    recipes = [];
    conversationHistory = [];

    ['materials', 'machines', 'products', 'processes', 'boms', 'recipes'].forEach(type => {
        const panel = document.getElementById(`${type}-panel`);
        panel.innerHTML = '<div class="empty-state">Cleared! Start creating...</div>';
    });

    updateAllCounts();
    addMessage('notification', '🗑️ All entities cleared');
}

console.log('✅ Master Creator loaded!');
