import { type ExecutionContext } from "../variableResolver.js";

type ActionInput = Record<string, any>;

export const currentTime = async (inputs: ActionInput, context: ExecutionContext) => {
    console.log(`   🕒 Getting Current Timestamp...`);

    const now = new Date();

    return {
        "ISO": now.toISOString(),              
        "UNIX": Math.floor(now.getTime() / 1000),
        "UNIX_MS": now.getTime(),              
        "READABLE": now.toLocaleString(),   
        "STATUS": "Success"
    };
};