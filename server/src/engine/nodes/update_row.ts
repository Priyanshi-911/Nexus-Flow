import { resolveVariable, type ExecutionContext } from "../variableResolver.js";
import { updateCell } from "../sheetWatcher.js";
import { Sanitize } from "../utils/inputSanitizer.js"; // Reuse your sanitizer!

type ActionInput = Record<string, any>;

export const updateRow = async (inputs: ActionInput, context: ExecutionContext) => {
    const val = resolveVariable(inputs.value, context);
    
    // FIX: Parse string "5" into number 5
    const colIdx = Sanitize.number(inputs.colIndex); 
    const rowIndex = context["ROW_INDEX"];
    
    if (!val) {
        console.log("   ⚠️ No value to write. Skipping update.");
        return { "STATUS": "Failed" }; 
    }

    // Convert 0 -> A, 1 -> B, etc.
    const colLetter = String.fromCharCode(65 + colIdx);
    
    // Note: This logic only works for Columns A-Z. 
    // If you need columns beyond Z (AA, AB...), let me know, and we can add a helper.

    await updateCell(
        inputs.spreadsheetId, 
        `Sheet1!${colLetter}${rowIndex}`, 
        val
    );

    console.log(`   📝 Updated Sheet Cell ${colLetter}${rowIndex}: ${val}`);
}