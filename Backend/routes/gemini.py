from fastapi import APIRouter
from pydantic import BaseModel
from google import genai
from google.genai import types
import os
import json
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

class UserProfile(BaseModel):
    situation: str
    salary: float
    numChildren: int
    childAges: str
    rent: float
    totalDebt: float
    monthlyDebtPayment: float
    savings: float

class PlanRequest(BaseModel):
    userProfile: UserProfile

@router.post("/")
async def get_financial_plan(body: PlanRequest):
    u = body.userProfile

    prompt = f"""
You are a compassionate financial advisor for single mothers and recently divorced women.

USER PROFILE:
- Situation: {u.situation}
- Monthly take-home salary: ${u.salary}
- Number of children: {u.numChildren}
- Children ages: {u.childAges}
- Monthly rent/mortgage: ${u.rent}
- Total debt: ${u.totalDebt}
- Monthly debt payment: ${u.monthlyDebtPayment}
- Current savings: ${u.savings}

NATIONAL AVERAGES (BLS 2024):
- Food: $847/month
- Housing: $2,188/month
- Healthcare: $516/month
- Childcare: $547/month

STRICT RULES:
- All budget numbers must add up to the monthly salary of ${u.salary}
- You MUST include ALL 7 categories in budgetBreakdown
- Return ONLY raw JSON, no explanation, no markdown

You MUST respond with this EXACT JSON structure, no missing fields:
{{
  "budgetBreakdown": {{
    "housing": 0,
    "children": 0,
    "food": 0,
    "debt": 0,
    "emergency": 0,
    "investment": 0,
    "personal": 0
  }},
  "priorityActions": ["action1", "action2", "action3"],
  "sixMonthPlan": ["month1-2 goal", "month3-4 goal", "month5-6 goal"],
  "specialTips": ["tip1", "tip2", "tip3"],
  "voiceSummary": "A warm 2-3 sentence spoken summary of her plan"
}}"""

    raw = None

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.2,
                max_output_tokens=1000,
                thinking_config=types.ThinkingConfig(
                    thinking_budget=0  # disables thinking, saves tokens for output
                )
            )
        )

        raw = response.candidates[0].content.parts[0].text
        print("FULL RAW RESPONSE:", raw)

        clean = raw.replace("```json", "").replace("```", "").strip()

        parsed = json.loads(clean)
        return parsed

    except json.JSONDecodeError as e:
        return {"error": f"Invalid JSON from model: {str(e)}", "raw": raw}
    except Exception as e:
        return {"error": str(e)}