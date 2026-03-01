const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});



// ===== HERO PREVIEW CAROUSEL =====
const slides = [
  {
    chip: "Budget",
    title: "Monthly Budget Breakdown",
    sub: "A plan aligned to your real-life expenses.",
    score: "72",
    debt: "18 mo",
    save: "$420",
    bars: [
      { label: "Essentials", value: 55 },
      { label: "Debt", value: 20 },
      { label: "Savings", value: 15 },
      { label: "Flexible", value: 10 },
    ],
    note: "Tip: Automate savings weekly for consistency.",
  },
  {
    chip: "Debt",
    title: "Debt Payoff Timeline",
    sub: "Prioritize high-interest debt to save more.",
    score: "74",
    debt: "14 mo",
    save: "$300",
    bars: [
      { label: "Card (APR)", value: 60 },
      { label: "Loan", value: 25 },
      { label: "Other", value: 15 },
      { label: "—", value: 0 },
    ],
    note: "Tip: Avalanche method reduces total interest paid.",
  },
  {
    chip: "Scenario",
    title: "Scenario Planning",
    sub: "Know what happens if income changes suddenly.",
    score: "70",
    debt: "20 mo",
    save: "$250",
    bars: [
      { label: "Rent", value: 40 },
      { label: "Childcare", value: 22 },
      { label: "Essentials", value: 28 },
      { label: "Flex", value: 10 },
    ],
    note: "Tip: Build 3 months of essentials as a safety buffer.",
  },
];

let currentSlide = 0;

const previewChip = document.getElementById("previewChip");
const slideTitle = document.getElementById("slideTitle");
const slideSub = document.getElementById("slideSub");
const scoreValue = document.getElementById("scoreValue");
const debtValue = document.getElementById("debtValue");
const saveValue = document.getElementById("saveValue");
const miniNote = document.getElementById("miniNote");
const dots = document.querySelectorAll(".dot");

function renderBars(bars) {
  const barsWrap = document.getElementById("bars");
  barsWrap.innerHTML = bars
    .map(
      (b) => `
      <div class="bar-row">
        <span>${b.label}</span>
        <div class="bar"><div class="bar-fill" style="width:${b.value}%"></div></div>
        <span>${b.value ? b.value + "%" : ""}</span>
      </div>
    `
    )
    .join("");

  // trigger animation (reflow)
  requestAnimationFrame(() => {
    const fills = barsWrap.querySelectorAll(".bar-fill");
    fills.forEach((fill) => {
      const w = fill.style.width;
      fill.style.width = "0%";
      requestAnimationFrame(() => (fill.style.width = w));
    });
  });
}

function setSlide(index) {
  currentSlide = index;
  const s = slides[index];

  previewChip.textContent = s.chip;
  slideTitle.textContent = s.title;
  slideSub.textContent = s.sub;
  scoreValue.textContent = s.score;
  debtValue.textContent = s.debt;
  saveValue.textContent = s.save;
  miniNote.textContent = s.note;

  renderBars(s.bars);

  dots.forEach((d) => d.classList.remove("active"));
  dots[index].classList.add("active");
}

dots.forEach((d) => {
  d.addEventListener("click", () => setSlide(Number(d.dataset.slide)));
});

// Auto rotate
setSlide(0);
setInterval(() => {
  setSlide((currentSlide + 1) % slides.length);
}, 3800);






// ================= HOW-IT-WORKS: Reveal on Scroll =================
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) e.target.classList.add("is-visible");
  });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

// ================= FORM + RESULTS =================
const form = document.getElementById("planForm");
const generateBtn = document.getElementById("generateBtn");
const btnSpinner = generateBtn.querySelector(".btn-spinner");

const emptyState = document.getElementById("emptyState");
const loadingState = document.getElementById("loadingState");
const resultsState = document.getElementById("resultsState");

const toast = document.getElementById("toast");

// Output nodes
const outScore = document.getElementById("outScore");
const outDebtEta = document.getElementById("outDebtEta");
const outSave = document.getElementById("outSave");
const outMethod = document.getElementById("outMethod");

const budgetGrid = document.getElementById("budgetGrid");
const nextSteps = document.getElementById("nextSteps");
const sixMonthSteps = document.getElementById("sixMonthSteps");
const aiSummary = document.getElementById("aiSummary");

// Accordion
const accBtn = document.getElementById("accBtn");
const accBody = document.getElementById("accBody");
const accChev = document.getElementById("accChev");

accBtn?.addEventListener("click", () => {
  accBtn.classList.toggle("open");
  accBody.classList.toggle("open");
});

// Voice
const voiceBtn = document.getElementById("voiceBtn");
const voiceSpinner = document.getElementById("voiceSpinner");
const audioPlayer = document.getElementById("audioPlayer");

// ---- Helpers
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 2600);
}

function setLoading(isLoading) {
  generateBtn.disabled = isLoading;
  btnSpinner.style.display = isLoading ? "inline-block" : "none";

  emptyState.classList.toggle("hidden", isLoading);
  loadingState.classList.toggle("hidden", !isLoading);
  resultsState.classList.add("hidden");
}

function showResults() {
  loadingState.classList.add("hidden");
  emptyState.classList.add("hidden");
  resultsState.classList.remove("hidden");
}

function clearErrors() {
  document.querySelectorAll(".error").forEach(e => e.textContent = "");
  document.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));
}

function setError(fieldId, msg) {
  const field = document.getElementById(fieldId);
  const err = document.querySelector(`[data-error-for="${fieldId}"]`);
  if (field) field.classList.add("input-error");
  if (err) err.textContent = msg;
}

function isNonNegativeNumber(v) {
  return v !== "" && !Number.isNaN(Number(v)) && Number(v) >= 0;
}

function validateForm(data) {
  clearErrors();
  let ok = true;

  if (!data.persona) { setError("persona", "Please select a persona."); ok = false; }

  const numberFields = ["income", "dependents", "rent", "debtTotal", "apr"];
  numberFields.forEach((f) => {
    if (!isNonNegativeNumber(data[f])) { setError(f, "Enter a valid number (0 or more)."); ok = false; }
  });

  if (isNonNegativeNumber(data.dependents) && !Number.isInteger(Number(data.dependents))) {
    setError("dependents", "Dependents must be a whole number.");
    ok = false;
  }

  if (isNonNegativeNumber(data.apr) && (Number(data.apr) > 60)) {
    setError("apr", "APR looks too high. Please enter 0–60.");
    ok = false;
  }

  if (!data.goal) { setError("goal", "Please choose a primary goal."); ok = false; }

  // sanity check: expenses should not be wildly higher than income (soft warning)
  const income = Number(data.income || 0);
  const expenses = Number(data.rent || 0);
  if (income > 0 && expenses > income * 1.25) {
    showToast("Heads up: expenses exceed income. We’ll still generate a recovery plan.");
  }

  return ok;
}

function money(n) {
  const val = Number(n);
  if (Number.isNaN(val)) return n ?? "—";
  return val.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function renderBudget(items) {
  budgetGrid.innerHTML = "";
  (items || []).forEach((it) => {
    const div = document.createElement("div");
    div.className = "chip";
    div.innerHTML = `
      <div class="t">${it.label ?? "Item"}</div>
      <div class="n">${money(it.amount ?? it.value)}</div>
    `;
    budgetGrid.appendChild(div);
  });
}

function renderSteps(container, stepsArr) {
  container.innerHTML = "";
  (stepsArr || []).forEach((s, idx) => {
    const row = document.createElement("div");
    row.className = "step";
    row.innerHTML = `
      <div class="dot">${idx + 1}</div>
      <div class="txt">${s}</div>
    `;
    container.appendChild(row);
  });
}

// ---- Submit handler
form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  // const data = {
  //   persona: document.getElementById("persona").value.trim(),
  //   income: document.getElementById("income").value.trim(),
  //   dependents: document.getElementById("dependents").value.trim(),
  //   rent: document.getElementById("rent").value.trim(),
  //   childcare: document.getElementById("childcare").value.trim(),
  //   essentials: document.getElementById("essentials").value.trim(),
  //   transport: document.getElementById("transport").value.trim(),
  //   debtTotal: document.getElementById("debtTotal").value.trim(),
  //   apr: document.getElementById("apr").value.trim(),
  //   goal: document.getElementById("goal").value.trim(),
  // };


  const data = {
    persona: document.getElementById("persona").value.trim(),
    income: document.getElementById("income").value.trim(),
    dependents: document.getElementById("dependents").value.trim(),
    rent: document.getElementById("rent").value.trim(),
    debtTotal: document.getElementById("debtTotal").value.trim(),
    apr: document.getElementById("apr").value.trim(),
    goal: document.getElementById("goal").value.trim(),
  };

  if (!validateForm(data)) {
    showToast("Please fix the highlighted fields.");
    return;
  }

  setLoading(true);

  try {
    // 👇 Change this to your backend URL if needed
    // const API_BASE = "http://localhost:8000";
    const API_BASE = "http://127.0.0.1:5000";

    // const res = await fetch(`${API_BASE}/api/plan`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     persona: data.persona,
    //     income: Number(data.income),
    //     dependents: Number(data.dependents),
    //     expenses: {
    //       rent: Number(data.rent),
    //       childcare: Number(data.childcare),
    //       essentials: Number(data.essentials),
    //       transport: Number(data.transport),
    //     },
    //     debt: {
    //       total: Number(data.debtTotal),
    //       apr: Number(data.apr),
    //     },
    //     goal: data.goal,
    //   }),
    // });

    // Backend might return JSON OR text. Handle both.
    const res = await fetch(`${API_BASE}/api/gemini/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userProfile: {
          situation: data.persona,                 // maps to situation in backend
          salary: Number(data.income),             // backend expects salary
          numChildren: Number(data.dependents),    // backend expects numChildren
          childAges: "N/A",                        // your form doesn’t collect this yet
          rent: Number(data.rent),
          totalDebt: Number(data.debtTotal),
          monthlyDebtPayment: 0,                   // your form doesn’t collect this yet
          savings: 0                               // your form doesn’t collect this yet
        }
      }),
    });

    const contentType = res.headers.get("content-type") || "";
    let payload;
    if (contentType.includes("application/json")) {
      payload = await res.json();
    } else {
      payload = { ai_summary: await res.text() };
    }

    // transform backend -> UI shape
    const bb = payload.budgetBreakdown || {};
    const budget = Object.entries(bb).map(([label, amount]) => ({
      label: label.charAt(0).toUpperCase() + label.slice(1),
      amount
    }));

    // Simple derived metrics (optional)
    const outDebt = bb.debt ? `${Math.max(6, Math.round(Number(data.debtTotal) / Math.max(1, bb.debt)))} mo` : "—";
    const outMonthlySave = bb.emergency || bb.investment || 0;

    outScore.textContent = "—";             // backend doesn't provide score
    outDebtEta.textContent = outDebt;
    outSave.textContent = money(outMonthlySave);
    outMethod.textContent = "Personalized";

    renderBudget(budget);
    renderSteps(nextSteps, payload.priorityActions || []);
    renderSteps(sixMonthSteps, payload.sixMonthPlan || []);
    aiSummary.textContent =
      payload.voiceSummary ||
      "Your plan is ready. Review the steps and start with your next 30 days.";

    // Store voiceSummary so voice button can read it
    window.__VOICE_TEXT__ = payload.voiceSummary || aiSummary.textContent;

    // Normalize possible response shapes
    // Recommended JSON shape (you can match in backend):
    // {
    //   score: 72,
    //   debt_eta: "18 months",
    //   monthly_savings: 420,
    //   method: "Avalanche",
    //   budget: [{label:"Housing", amount:800}, ...],
    //   next_30_days: ["...", "..."],
    //   six_month_plan: ["...", "..."],
    //   ai_summary: "..."
    // }

    // outScore.textContent = payload.score ?? "—";
    // outDebtEta.textContent = payload.debt_eta ?? payload.debtFreeTimeline ?? "—";
    // outSave.textContent = payload.monthly_savings != null ? money(payload.monthly_savings) : (payload.savings ?? "—");
    // outMethod.textContent = payload.method ?? "Recommended";

    // const budget = payload.budget ?? payload.budget_breakdown ?? [];
    // renderBudget(budget);

    // renderSteps(nextSteps, payload.next_30_days ?? payload.nextSteps ?? []);
    // renderSteps(sixMonthSteps, payload.six_month_plan ?? payload.sixMonthPlan ?? []);

    // aiSummary.textContent = payload.ai_summary ?? payload.summary ?? "Your plan is ready. Review the steps and start with your next 30 days.";

    // Reset voice UI each generation
    audioPlayer.classList.add("hidden");
    audioPlayer.removeAttribute("src");

    showResults();
    showToast("Plan generated successfully ✅");
  } catch (err) {
    console.error(err);
    loadingState.classList.add("hidden");
    emptyState.classList.remove("hidden");
    showToast("Could not connect to backend. Check API URL / server.");
  } finally {
    generateBtn.disabled = false;
    btnSpinner.style.display = "none";
  }
});

// ---- Voice button
voiceBtn?.addEventListener("click", async () => {
  const text = aiSummary.textContent?.trim();
  if (!text) {
    showToast("Generate a plan first.");
    return;
  }

  try {
    voiceBtn.disabled = true;
    voiceSpinner.style.display = "inline-block";

    // const API_BASE = "http://localhost:8000";
    const API_BASE = "http://127.0.0.1:5000";

    // const res = await fetch(`${API_BASE}/api/voice`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ text }),
    // });


    const res = await fetch(`${API_BASE}/api/speak/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: window.__VOICE_TEXT__ || text }),
    });

    // Expect either:
    // A) JSON: { audio_url: "..." }
    // B) audio bytes: Content-Type audio/mpeg
    const ct = res.headers.get("content-type") || "";

    if (ct.includes("application/json")) {
      const j = await res.json();
      audioPlayer.src = j.audio_url;
    } else {
      const blob = await res.blob();
      audioPlayer.src = URL.createObjectURL(blob);
    }

    audioPlayer.classList.remove("hidden");
    audioPlayer.play().catch(() => { });
    showToast("Voice ready 🎧");
  } catch (e) {
    console.error(e);
    showToast("Voice generation failed. Check /api/voice.");
  } finally {
    voiceBtn.disabled = false;
    voiceSpinner.style.display = "none";
  }
});