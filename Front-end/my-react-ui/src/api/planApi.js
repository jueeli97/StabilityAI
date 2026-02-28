import { postJson } from "./client.js";

export async function generatePlan(payload){
  // expects POST /generate-plan
  return postJson("/generate-plan", payload);
}