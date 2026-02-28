import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button.jsx";
import Loader from "../ui/Loader.jsx";
import { generatePlan } from "../../api/planApi.js";
import { isRequired, toNumberOrNaN, isNonNegative, isIntNonNegative } from "../../utils/validators.js";

const PERSONAS = [
  { value:"single_mother", label:"Single Mother" },
  { value:"recently_divorced", label:"Recently Divorced" },
  { value:"career_break", label:"Career Break" }
];

function Field({ label, value, onChange, placeholder, error, type="text" }){
  return (
    <div>
      <label style={{ display:"block", fontSize: 13, fontWeight: 900, color:"var(--primary)", marginBottom: 8 }}>
        {label}
      </label>
      <input
        type={type}
        inputMode={type === "number" ? "numeric" : undefined}
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width:"100%",
          padding:"12px 12px",
          borderRadius: 16,
          border: error ? "1px solid rgba(225,29,72,0.45)" : "1px solid var(--border)",
          background:"rgba(255,255,255,0.96)",
          outline:"none",
          boxShadow: error ? "0 0 0 4px rgba(225,29,72,0.10)" : "none"
        }}
        onFocus={(e)=>{ if(!error){ e.currentTarget.style.boxShadow="var(--ring)"; e.currentTarget.style.borderColor="rgba(76,156,148,.55)"; } }}
        onBlur={(e)=>{ e.currentTarget.style.boxShadow="none"; e.currentTarget.style.borderColor = error ? "rgba(225,29,72,0.45)" : "var(--border)"; }}
      />
      {error ? <div style={{ marginTop: 8, fontSize: 12, fontWeight: 800, color:"rgb(225,29,72)" }}>{error}</div> : null}
    </div>
  );
}

export default function AssessmentForm(){
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const [form, setForm] = useState({
    persona: "",
    income: "",
    expenses: "",
    debt: "",
    dependents: ""
  });

  const errors = useMemo(() => {
    const e = {};
    if (!isRequired(form.persona)) e.persona = "Please select a persona.";

    const income = toNumberOrNaN(form.income);
    const expenses = toNumberOrNaN(form.expenses);
    const debt = toNumberOrNaN(form.debt);
    const deps = toNumberOrNaN(form.dependents);

    if (!isRequired(form.income)) e.income = "Income is required.";
    else if (!isNonNegative(income)) e.income = "Income must be 0 or more.";

    if (!isRequired(form.expenses)) e.expenses = "Expenses are required.";
    else if (!isNonNegative(expenses)) e.expenses = "Expenses must be 0 or more.";

    if (!isRequired(form.debt)) e.debt = "Debt is required.";
    else if (!isNonNegative(debt)) e.debt = "Debt must be 0 or more.";

    if (!isRequired(form.dependents)) e.dependents = "Dependents is required.";
    else if (!isIntNonNegative(deps)) e.dependents = "Dependents must be a whole number ≥ 0.";

    return e;
  }, [form]);

  const hasErrors = Object.keys(errors).length > 0;

  function set(key, value){
    setApiError("");
    setForm((p)=>({ ...p, [key]: value }));
  }

  async function onSubmit(e){
    e.preventDefault();
    if (hasErrors) return;

    setLoading(true);
    setApiError("");

    const payload = {
      persona: form.persona,
      income: Number(form.income),
      expenses: Number(form.expenses),
      debt: Number(form.debt),
      dependents: Number(form.dependents)
    };

    try{
      const res = await generatePlan(payload);
      sessionStorage.setItem("herfinance_result", JSON.stringify(res));
      nav("/results");
    }catch(err){
      setApiError(err?.message || "Failed to generate plan.");
    }finally{
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      {apiError ? (
        <div style={{
          padding: 14,
          borderRadius: 16,
          border:"1px solid rgba(225,29,72,0.25)",
          background:"#FFF1F2",
          color:"#BE123C",
          fontWeight: 900,
          marginBottom: 14
        }}>
          {apiError}
        </div>
      ) : null}

      <div style={{ display:"grid", gap: 16, gridTemplateColumns:"repeat(2, minmax(0, 1fr))" }}>
        <div>
          <label style={{ display:"block", fontSize: 13, fontWeight: 900, color:"var(--primary)", marginBottom: 8 }}>
            Persona
          </label>
          <select
            value={form.persona}
            onChange={(e)=>set("persona", e.target.value)}
            style={{
              width:"100%",
              padding:"12px 12px",
              borderRadius: 16,
              border: errors.persona ? "1px solid rgba(225,29,72,0.45)" : "1px solid var(--border)",
              background:"rgba(255,255,255,0.96)",
              color:"var(--text)",
              outline:"none",
              boxShadow: errors.persona ? "0 0 0 4px rgba(225,29,72,0.10)" : "none"
            }}
            onFocus={(e)=>{ if(!errors.persona){ e.currentTarget.style.boxShadow="var(--ring)"; e.currentTarget.style.borderColor="rgba(76,156,148,.55)"; } }}
            onBlur={(e)=>{ e.currentTarget.style.boxShadow="none"; e.currentTarget.style.borderColor = errors.persona ? "rgba(225,29,72,0.45)" : "var(--border)"; }}
          >
            <option value="">Select…</option>
            {PERSONAS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
          {errors.persona ? <div style={{ marginTop: 8, fontSize: 12, fontWeight: 800, color:"rgb(225,29,72)" }}>{errors.persona}</div> : null}

          <div style={{ marginTop: 10, fontSize: 12, color:"var(--muted)", lineHeight:1.5 }}>
            Tip: Persona helps tailor the benchmark + recovery plan language.
          </div>
        </div>

        <Field
          label="Dependents"
          value={form.dependents}
          onChange={(v)=>set("dependents", v)}
          placeholder="e.g., 1"
          error={errors.dependents}
          type="number"
        />

        <Field
          label="Monthly Income ($)"
          value={form.income}
          onChange={(v)=>set("income", v)}
          placeholder="e.g., 3000"
          error={errors.income}
          type="number"
        />

        <Field
          label="Monthly Expenses ($)"
          value={form.expenses}
          onChange={(v)=>set("expenses", v)}
          placeholder="e.g., 2200"
          error={errors.expenses}
          type="number"
        />

        <div style={{ gridColumn:"span 2" }}>
          <Field
            label="Total Debt ($)"
            value={form.debt}
            onChange={(v)=>set("debt", v)}
            placeholder="e.g., 5000"
            error={errors.debt}
            type="number"
          />
        </div>
      </div>

      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap: 14, marginTop: 18, flexWrap:"wrap" }}>
        <div style={{ color:"var(--muted)", fontWeight: 850, fontSize: 13 }}>
          {loading ? <Loader label="Generating plan…" /> : "Fill required fields to continue"}
        </div>

        <Button type="submit" disabled={loading || hasErrors}>
          {loading ? "Generating…" : "Generate Stability Plan"}
        </Button>
      </div>

      <style>{`
        @media (max-width: 900px){
          form > div[style*="grid-template-columns"]{ grid-template-columns: 1fr !important; }
          form div[style*="gridColumn"]{ grid-column: auto !important; }
        }
      `}</style>
    </form>
  );
}