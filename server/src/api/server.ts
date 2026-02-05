import express from "express";
import bodyParser from "body-parser";
import cors from "cors"; 
import { readSheet, updateCell } from "../engine/sheetWatcher.js";
import { resolveVariable, type ExecutionContext } from "../engine/variableResolver.js";
import { NODE_REGISTRY } from "../engine/nodes/index.js";
import { type RuleGroup, evaluateRuleGroup } from "../engine/logic.js";

// Keep these for the standalone testing route /webhook/:userId
import { createNexusAccount, sendTestTransaction } from "../engine/smartAccount.js";
import { validateBalance } from "../engine/guardRails.js";

const app: express.Application = express();

app.use(cors({ origin: "*" })); 
app.use(bodyParser.json());

const PORT: number = 3001;

// --- WORKFLOW ENGINE ---
app.post("/trigger-workflow", async (req, res) => {
    const workflowConfig = req.body.config;
    const manualContext = req.body.context || {}; 

    if (!workflowConfig) {
        return res.status(400).send({ error: "Missing workflow configuration." });
    }

    console.log(`\n⚙️ Triggering Workflow: ${workflowConfig.trigger.type.toUpperCase()}`);

    try {
        let itemsToProcess: any[] = [];

        // --- MODE A: GOOGLE SHEETS ---
        if (workflowConfig.trigger.type === "sheets") {
            const sheetId = workflowConfig.spreadsheetId;
            if (!sheetId) throw new Error("Spreadsheet ID required for Sheet triggers.");

            const rawRows = await readSheet(sheetId);
            
            // Default Col F (Index 5)
            const triggerCol = workflowConfig.trigger.colIndex !== undefined ? Number(workflowConfig.trigger.colIndex) : 5;
            const triggerVal = workflowConfig.trigger.value || "Pending";

            // Map rows
            itemsToProcess = rawRows
                .map((row, index) => ({ row, realIndex: index + 2 })) 
                .filter(item => {
                    // Safety check: ensure row has enough columns
                    return item.row[triggerCol] && item.row[triggerCol].toString().trim() === triggerVal;
                });

            console.log(`   📊 Sheet Mode: Found ${itemsToProcess.length} rows with '${triggerVal}' in Col ${triggerCol}.`);
        } 
        
        // --- MODE B: SINGLE ---
        else {
            itemsToProcess = [{ 
                row: [], 
                realIndex: -1, 
                initialContext: manualContext 
            }];
            console.log(`   ⚡ Single Mode: Executing 1 run.`);
        }

        if (itemsToProcess.length === 0) {
            return res.send({ status: "No items to process." });
        }

        // --- EXECUTION LOOP ---
        let processedCount = 0;

        for (const item of itemsToProcess) {
            // A. Build Context
            const context: ExecutionContext = { ...item.initialContext };
            
            // MAP SHEET COLUMNS TO VARIABLES
            if (item.row.length > 0) {
                item.row.forEach((val: any, idx: number) => {
                    // 1. Default Mapping: Column_A, Column_B
                    const colLetter = String.fromCharCode(65 + idx); 
                    context[`Column_${colLetter}`] = val;

                    // 2. [NEW] Custom Semantic Mapping
                    // Config comes as { "0": "Wallet", "1": "Amount" }
                    if (workflowConfig.columnMapping && workflowConfig.columnMapping[idx.toString()]) {
                        const varName = workflowConfig.columnMapping[idx.toString()];
                        // Clean the variable name (remove {{ }}) just in case user typed it weirdly
                        const cleanVar = varName.replace(/[{}]/g, '').trim();
                        context[cleanVar] = val;
                    }
                });
                context["ROW_INDEX"] = item.realIndex;
            }

            const identifier = item.realIndex !== -1 ? `Row ${item.realIndex}` : `Webhook Event`;
            console.log(`\n▶️ Processing ${identifier}...`);
            
            // B. Run Actions
            for (const action of workflowConfig.actions) {
                
                // Logic Gate
                if (action.rules) {
                    const resolvedRules = JSON.parse(JSON.stringify(action.rules));
                    const resolveRecursive = (group: RuleGroup) => {
                        group.rules.forEach((rule: any) => {
                            if (rule.combinator) resolveRecursive(rule);
                            else {
                                rule.valueA = resolveVariable(rule.valueA, context);
                                rule.valueB = resolveVariable(rule.valueB, context);
                            }
                        });
                    };
                    resolveRecursive(resolvedRules);
                    if (!evaluateRuleGroup(resolvedRules)) {
                        console.log(`   ⛔ Logic Blocked Action ${action.type}. Skipping.`);
                        continue; 
                    }
                }

                const nodeExecutor = NODE_REGISTRY[action.type];

                if (!nodeExecutor) {
                    console.error(`   ❌ Critical: Unknown Node Type ${action.type}`);
                    break;
                }

                try {
                    const inputs = { 
                        ...action.inputs, 
                        spreadsheetId: workflowConfig.spreadsheetId || undefined
                    };

                    const result = await nodeExecutor(inputs, context);
                    
                    if (result) {
                        Object.assign(context, result);
                    }

                    if (result && result.STATUS === "Failed") {
                        throw new Error("Node returned failure status");
                    }

                } catch (err: any) {
                    console.error(`   ❌ Workflow Aborted at ${action.type}: ${err.message}`);
                    
                    // Update Status in Sheet if failed
                    if (context["ROW_INDEX"] && workflowConfig.spreadsheetId) {
                        const colLetter = "F"; 
                        const rowIndex = context["ROW_INDEX"];
                        updateCell(workflowConfig.spreadsheetId, `Sheet1!${colLetter}${rowIndex}`, `Failed: ${err.message}`)
                            .catch(e => console.error("   ⚠️ Could not write error to sheet"));
                    }
                    
                    break; // Fail-Stop
                }
            }
            processedCount++;
        }

        res.send({ status: "Workflow Complete", processed: processedCount });

    } catch (error: any) {
        console.error("❌ Critical Workflow Error:", error);
        res.status(500).send({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Nexus Flow Engine running on http://localhost:${PORT}`);
});