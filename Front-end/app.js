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


const acc30Btn = document.getElementById("acc30Btn");
const acc30Body = document.getElementById("acc30Body");

acc30Btn?.addEventListener("click", () => {
  acc30Btn.classList.toggle("open");
  acc30Body.classList.toggle("open");
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
  renderPartnerCarousel();
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


function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

function computeStabilityScore({ income, rent, debtTotal, apr, monthlySave }) {
  // Simple heuristic so you always show a score (0–100)
  const inc = Number(income || 0);
  const rentRatio = inc ? Number(rent || 0) / inc : 0;
  const saveRatio = inc ? Number(monthlySave || 0) / inc : 0;
  const debtRatio = inc ? Number(debtTotal || 0) / (inc * 6) : 0; // debt vs ~6 months income
  const aprScore = 1 - clamp(Number(apr || 0) / 30, 0, 1);

  let score =
    100
    - (rentRatio * 35)
    - (debtRatio * 35)
    + (saveRatio * 45)
    + (aprScore * 10);

  return Math.round(clamp(score, 0, 100));
}

function setScoreChip(score) {
  const chip = document.getElementById("kpiScoreChip");
  const sub = document.getElementById("kpiScoreSub");
  if (!chip || !sub) return;

  if (score >= 75) { chip.textContent = "Strong"; sub.textContent = "Trend: improving"; }
  else if (score >= 55) { chip.textContent = "Stable"; sub.textContent = "Trend: steady"; }
  else { chip.textContent = "At Risk"; sub.textContent = "Trend: needs focus"; }
}


// function renderBudget(items) {
//   budgetGrid.innerHTML = "";
//   const rows = items || [];

//   // total for % allocation visuals
//   const total = rows.reduce((sum, it) => sum + (Number(it.amount ?? it.value) || 0), 0) || 1;

//   rows.forEach((it) => {
//     const amount = Number(it.amount ?? it.value) || 0;
//     const pct = Math.max(0, Math.min(100, (amount / total) * 100));

//     const div = document.createElement("div");
//     div.className = "chip budget-chip";
//     div.innerHTML = `
//       <div class="chip-top">
//         <div class="t">${it.label ?? "Item"}</div>
//         <div class="pct">${Math.round(pct)}%</div>
//       </div>
//       <div class="n">${money(amount)}</div>
//       <div class="mini-bar" aria-hidden="true">
//         <div class="mini-fill" style="width:${pct}%"></div>
//       </div>
//     `;
//     budgetGrid.appendChild(div);
//   });
// }


function renderBudget(items) {
  budgetGrid.innerHTML = "";
  const rows = items || [];

  const total = rows.reduce((sum, it) => sum + (Number(it.amount ?? it.value) || 0), 0) || 1;

  rows.forEach((it) => {
    const amount = Number(it.amount ?? it.value) || 0;
    const pct = Math.max(0, Math.min(100, (amount / total) * 100));

    const div = document.createElement("div");
    div.className = "chip budget-chip";
    div.innerHTML = `
      <div class="chip-top">
        <div class="t">${it.label ?? "Item"}</div>
        <div class="pct">${Math.round(pct)}%</div>
      </div>
      <div class="n">${money(amount)}</div>
      <div class="mini-bar" aria-hidden="true">
        <div class="mini-fill" style="width:${pct}%"></div>
      </div>
    `;

    budgetGrid.appendChild(div);
  });
}


function renderSteps(container, stepsArr) {
  if (!container) return; // ✅ prevents "Cannot set properties of null"
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

    const score = computeStabilityScore({
      income: Number(data.income),
      rent: Number(data.rent),
      debtTotal: Number(data.debtTotal),
      apr: Number(data.apr),
      monthlySave: outMonthlySave,
    });

    outScore.textContent = score;
    setScoreChip(score); // you already have this

    updateKpiRings({
      score,
      debtMonths: parseMonths(outDebt),
      income: Number(data.income),
      monthlySave: outMonthlySave,
    });           // backend doesn't provide score
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


// ===== VOICE MODAL =====

const VOICE_QUESTIONS = [
  {
    key: "persona",
    question: "First, what's your current situation? For example, are you a single mom, recently divorced, restarting financially, or a student?",
    label: "Persona",
    type: "text",
    options: ["single_mom", "divorced", "restarting", "student"],
  },
  {
    key: "income",
    question: "What is your monthly income in dollars? Just say the number.",
    label: "Monthly Income",
    type: "number",
  },
  {
    key: "dependents",
    question: "How many dependents do you have?",
    label: "Dependents",
    type: "number",
  },
  {
    key: "rent",
    question: "How much do you pay each month for housing or rent?",
    label: "Housing / Rent",
    type: "number",
  },
  {
    key: "debtTotal",
    question: "What is your total debt amount across all loans and credit cards?",
    label: "Total Debt",
    type: "number",
  },
  {
    key: "apr",
    question: "What is your average interest rate or APR as a percentage? For example, say 19.9 for 19.9 percent.",
    label: "Avg APR %",
    type: "number",
  },
  {
    key: "goal",
    question: "Finally, what is your primary goal? Say: become debt-free, build emergency fund, or debt and savings together.",
    label: "Primary Goal",
    type: "text",
    options: ["debt_free", "save_more", "both"],
  },
];

let voiceStep = 0;
let voiceAnswers = {};
let currentTranscript = "";
let recognition = null;
let isListening = false;
const API_URL = "http://127.0.0.1:5000";

// Modal open/close
document.getElementById("openVoiceModal").addEventListener("click", () => {
  document.getElementById("voiceModal").style.display = "flex";
  voiceStep = 0;
  voiceAnswers = {};
  currentTranscript = "";
  resetModalUI();
});

document.getElementById("closeVoiceModal").addEventListener("click", () => {
  closeVoiceModal();
});

document.getElementById("voiceModal").addEventListener("click", (e) => {
  if (e.target === document.getElementById("voiceModal")) closeVoiceModal();
});

function closeVoiceModal() {
  stopListening();
  document.getElementById("voiceModal").style.display = "none";
}

function resetModalUI() {
  document.getElementById("voiceQuestionBox").textContent = "Press Start to begin your voice session.";
  document.getElementById("voiceAnswerBox").style.display = "none";
  document.getElementById("voiceAnswerText").textContent = "";
  document.getElementById("voiceStatus").textContent = "";
  document.getElementById("voiceProgressFill").style.width = "0%";
  document.getElementById("voiceStepLabel").textContent = "Step 0 of 7";
  document.getElementById("voiceAnswersList").innerHTML = "";
  document.getElementById("voiceStartBtn").style.display = "inline-flex";
  document.getElementById("voiceRetryBtn").style.display = "none";
  document.getElementById("voiceNextBtn").style.display = "none";
  document.getElementById("avatarRing").classList.remove("speaking", "listening");
  document.getElementById("voiceModalSubtitle").textContent = "I'll ask you a few questions to build your personalized plan.";
}

async function speakQuestion(text) {
  setAvatarState("speaking");
  setVoiceStatus("Speaking...");
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(`${API_URL}/api/speak/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) { setVoiceStatus(""); return; }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    return new Promise((resolve) => {
      audio.onended = resolve;
      audio.onerror = resolve;
      audio.play().catch(resolve);
    });
  } catch (err) {
    setVoiceStatus("");
  }
}

function startListening() {
  if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
    setVoiceStatus("❌ Your browser doesn't support voice input. Please use Chrome.");
    return;
  }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SR();
  recognition.lang = "en-US";
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => { isListening = true; setAvatarState("listening"); setVoiceStatus("🎙️ Listening... speak now"); };
  recognition.onresult = (event) => {
    let final = "", interim = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const t = event.results[i][0].transcript;
      if (event.results[i].isFinal) final += t; else interim += t;
    }
    currentTranscript = (final || interim).trim();
    document.getElementById("voiceAnswerText").textContent = currentTranscript;
    document.getElementById("voiceAnswerBox").style.display = "block";
  };
  recognition.onend = () => {
    isListening = false;
    setAvatarState("idle");
    if (currentTranscript) {
      setVoiceStatus("✅ Got it! Confirm or retry.");
      document.getElementById("voiceRetryBtn").style.display = "inline-flex";
      document.getElementById("voiceNextBtn").style.display = "inline-flex";
    } else {
      setVoiceStatus("Didn't catch that. Try again.");
      document.getElementById("voiceRetryBtn").style.display = "inline-flex";
    }
  };
  recognition.onerror = (e) => {
    isListening = false;
    setAvatarState("idle");
    setVoiceStatus(`Error: ${e.error}. Please retry.`);
    document.getElementById("voiceRetryBtn").style.display = "inline-flex";
  };
  recognition.start();
}

function stopListening() {
  if (recognition && isListening) { recognition.stop(); isListening = false; }
}

function parseVoiceAnswer(transcript, q) {
  if (q.type === "number") {
    const numMatch = transcript.replace(/,/g, "").match(/[\d.]+/);
    if (numMatch) return parseFloat(numMatch[0]);
    const wordMap = { zero: 0, a: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90, hundred: 100, thousand: 1000, grand: 1000, k: 1000 };
    const words = transcript.toLowerCase().replace(/\$/g, "").split(/[\s,]+/);
    let total = 0, current = 0;
    for (const w of words) {
      if (wordMap[w] !== undefined) {
        const val = wordMap[w];
        if (val === 100) {
          // "hundred" multiplies current chunk (default to 1 if current is 0)
          current = (current === 0 ? 1 : current) * 100;
        } else if (val === 1000) {
          // "thousand/grand/k" multiplies current chunk (default to 1 if current is 0)
          total += (current === 0 ? 1 : current) * 1000;
          current = 0;
        } else {
          current += val;
        }
      }
    }
    return total + current || null;
  }
  if (q.key === "persona") {
    const l = transcript.toLowerCase();
    if (l.includes("single")) return "single_mom";
    if (l.includes("divorce")) return "divorced";
    if (l.includes("restart")) return "restarting";
    if (l.includes("student")) return "student";
  }
  if (q.key === "goal") {
    const l = transcript.toLowerCase();
    if (l.includes("debt") && l.includes("sav")) return "both";
    if (l.includes("debt")) return "debt_free";
    if (l.includes("sav") || l.includes("emergency")) return "save_more";
  }
  return transcript;
}

async function startVoiceSession() {
  document.getElementById("voiceStartBtn").style.display = "none";
  voiceStep = 0;
  voiceAnswers = {};
  await askVoiceQuestion(voiceStep);
}

async function askVoiceQuestion(step) {
  if (step >= VOICE_QUESTIONS.length) { await finishVoiceSession(); return; }
  const q = VOICE_QUESTIONS[step];
  currentTranscript = "";
  document.getElementById("voiceQuestionBox").textContent = q.question;
  document.getElementById("voiceAnswerBox").style.display = "none";
  document.getElementById("voiceAnswerText").textContent = "";
  document.getElementById("voiceRetryBtn").style.display = "none";
  document.getElementById("voiceNextBtn").style.display = "none";
  document.getElementById("voiceProgressFill").style.width = `${(step / VOICE_QUESTIONS.length) * 100}%`;
  document.getElementById("voiceStepLabel").textContent = `Step ${step + 1} of ${VOICE_QUESTIONS.length}`;
  await speakQuestion(q.question);
  startListening();
}

function retryAnswer() {
  currentTranscript = "";
  document.getElementById("voiceAnswerBox").style.display = "none";
  document.getElementById("voiceRetryBtn").style.display = "none";
  document.getElementById("voiceNextBtn").style.display = "none";
  setVoiceStatus("");
  startListening();
}

function confirmAndNext() {
  const q = VOICE_QUESTIONS[voiceStep];
  const parsed = parseVoiceAnswer(currentTranscript, q);
  if (parsed === null || parsed === "") { setVoiceStatus("Couldn't parse that. Please retry."); return; }
  voiceAnswers[q.key] = parsed;
  const list = document.getElementById("voiceAnswersList");
  const item = document.createElement("div");
  item.className = "voice-collected-answer";
  // Show currency format for money fields, plain number for others
  const moneyKeys = ["income", "rent", "debtTotal"];
  let displayVal = parsed;
  if (moneyKeys.includes(q.key) && typeof parsed === "number") {
    displayVal = parsed.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  }
  item.innerHTML = `<span class="vca-label">${q.label}</span><span class="vca-value">${displayVal}</span>`;
  list.appendChild(item);
  voiceStep++;
  askVoiceQuestion(voiceStep);
}

async function finishVoiceSession() {
  setAvatarState("speaking");
  document.getElementById("voiceProgressFill").style.width = "100%";
  document.getElementById("voiceStepLabel").textContent = "Complete!";
  document.getElementById("voiceQuestionBox").textContent = "Amazing! Building your plan now...";
  document.getElementById("voiceModalSubtitle").textContent = "Generating your personalized plan ✨";
  setVoiceStatus("⏳ Sending to AI...");

  // Also populate the form fields so the UI reflects what was collected
  const fieldMap = { persona: "persona", income: "income", dependents: "dependents", rent: "rent", debtTotal: "debtTotal", apr: "apr", goal: "goal" };
  Object.entries(fieldMap).forEach(([key, id]) => {
    const el = document.getElementById(id);
    if (el && voiceAnswers[key] !== undefined) el.value = voiceAnswers[key];
  });

  closeVoiceModal();

  // Show loading state immediately — no form validation needed
  // Scroll to the results section so the user can see the loading state
  document.getElementById("planForm")?.scrollIntoView({ behavior: "smooth", block: "center" });
  if (emptyState) emptyState.classList.add("hidden");
  if (loadingState) loadingState.classList.remove("hidden");
  if (resultsState) resultsState.classList.add("hidden");
  if (generateBtn) { generateBtn.disabled = true; }
  if (btnSpinner) btnSpinner.style.display = "inline-block";

  try {
    const res = await fetch(`${API_URL}/api/gemini/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userProfile: {
          situation: voiceAnswers.persona,
          salary: Number(voiceAnswers.income) || 0,
          numChildren: Number(voiceAnswers.dependents) || 0,
          childAges: "N/A",
          rent: Number(voiceAnswers.rent) || 0,
          totalDebt: Number(voiceAnswers.debtTotal) || 0,
          monthlyDebtPayment: 0,
          savings: 0,
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

    const bb = payload.budgetBreakdown || {};
    const budget = Object.entries(bb).map(([label, amount]) => ({
      label: label.charAt(0).toUpperCase() + label.slice(1),
      amount
    }));

    const outDebt = bb.debt
      ? `${Math.max(6, Math.round(Number(voiceAnswers.debtTotal) / Math.max(1, bb.debt)))} mo`
      : "—";
    const outMonthlySave = bb.emergency || bb.investment || 0;

    outScore.textContent = "—";
    outDebtEta.textContent = outDebt;
    outSave.textContent = money(outMonthlySave);
    outMethod.textContent = "Personalized";

    renderBudget(budget);
    renderSteps(nextSteps, payload.priorityActions || []);
    renderSteps(sixMonthSteps, payload.sixMonthPlan || []);
    aiSummary.textContent =
      payload.voiceSummary ||
      "Your plan is ready. Review the steps and start with your next 30 days.";

    window.__VOICE_TEXT__ = payload.voiceSummary || aiSummary.textContent;

    audioPlayer.classList.add("hidden");
    audioPlayer.removeAttribute("src");

    showResults();
    showToast("Plan generated successfully ✅");
    // Scroll to results so user sees the plan
    document.getElementById("resultsState")?.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (err) {
    console.error("Voice plan generation error:", err);
    if (loadingState) loadingState.classList.add("hidden");
    if (emptyState) emptyState.classList.remove("hidden");
    showToast("Could not connect to backend. Check API URL / server.");
  } finally {
    if (generateBtn) generateBtn.disabled = false;
    if (btnSpinner) btnSpinner.style.display = "none";
  }
}

function setVoiceStatus(msg) { document.getElementById("voiceStatus").textContent = msg; }

function setAvatarState(state) {
  const ring = document.getElementById("avatarRing");
  ring.classList.remove("speaking", "listening");
  if (state === "speaking") ring.classList.add("speaking");
  if (state === "listening") ring.classList.add("listening");
}


function setRing(el, pct0to100) {
  if (!el) return;
  const pct = clamp(Number(pct0to100) || 0, 0, 100);
  el.style.setProperty("--pct", pct);
  el.dataset.pct = String(pct);
}

function parseMonths(text) {
  const m = String(text || "").match(/(\d+)\s*mo/i);
  return m ? Number(m[1]) : null;
}

function parseMoney(text) {
  const n = String(text || "").replace(/[^0-9.]/g, "");
  const v = Number(n);
  return Number.isFinite(v) ? v : null;
}

function updateKpiRings({ score, debtMonths, income, monthlySave }) {
  const rings = document.querySelectorAll(".kpi-ring");
  const scoreRing = rings[0];
  const debtRing = rings[1];
  const saveRing = rings[2];

  // Score ring = score%
  setRing(scoreRing, score);

  // Debt ring: faster payoff => higher ring fill
  // map 0..36 months -> 100..0 (cap)
  if (debtMonths != null) {
    const debtPct = 100 - clamp((debtMonths / 36) * 100, 0, 100);
    setRing(debtRing, debtPct);
  }

  // Savings ring: % of income saved, target 20% = 100%
  if (income > 0 && monthlySave != null) {
    const ratio = clamp((monthlySave / (income * 0.20)) * 100, 0, 100);
    setRing(saveRing, ratio);
  }
}

// ================= PARTNER CAROUSEL =================
const PARTNERS = [
  {
    emoji: "💳",
    logoBg: "linear-gradient(135deg,#c0392b,#e74c3c)",
    name: "Capital One",
    type: "Banking & Credit Cards",
    desc: "Fee-free checking, high-yield savings, and credit cards with cash back rewards — all in one place.",
    tags: ["No Fees", "Cash Back", "FDIC Insured"],
    highlight: "Cash Back",
    cta: "Explore Capital One",
    url: "https://www.capitalone.com",
  },
  {
    emoji: "🏦",
    logoBg: "linear-gradient(135deg,#1a3a8f,#2d5be3)",
    name: "Marcus by Goldman Sachs",
    type: "High-Yield Savings",
    desc: "No-fee high-yield savings account. Great for building your emergency fund fast.",
    tags: ["FDIC Insured", "No Fees", "High APY"],
    highlight: "High APY",
    cta: "Open Account",
    url: "https://www.marcus.com",
  },
  {
    emoji: "📉",
    logoBg: "linear-gradient(135deg,#6B21A8,#a855f7)",
    name: "Tally",
    type: "Debt Management",
    desc: "Automates credit card debt payoff using the avalanche method to save on interest.",
    tags: ["Debt Payoff", "Auto-Pay", "Low APR"],
    highlight: "Debt Payoff",
    cta: "Reduce My Debt",
    url: "https://www.meettally.com",
  },
  {
    emoji: "📈",
    logoBg: "linear-gradient(135deg,#065f46,#10b981)",
    name: "Ellevest",
    type: "Investment Platform",
    desc: "Built for women. Goal-based investing plans designed around real-life financial milestones.",
    tags: ["Women-Focused", "Goal Planning", "ETFs"],
    highlight: "Women-Focused",
    cta: "Start Investing",
    url: "https://www.ellevest.com",
  },
  {
    emoji: "🛡️",
    logoBg: "linear-gradient(135deg,#7c2d12,#f97316)",
    name: "Self Financial",
    type: "Credit Building",
    desc: "Credit-builder loans that report to all 3 bureaus. Rebuild your score while saving.",
    tags: ["Credit Builder", "No Hard Pull", "Savings"],
    highlight: "Credit Builder",
    cta: "Build Credit",
    url: "https://www.self.inc",
  },
  {
    emoji: "💳",
    logoBg: "linear-gradient(135deg,#1e3a5f,#0ea5e9)",
    name: "SoFi",
    type: "Loans & Banking",
    desc: "Personal loans at competitive rates plus banking and investing all in one place.",
    tags: ["Personal Loans", "No Fees", "Banking"],
    highlight: "No Fees",
    cta: "Explore Options",
    url: "https://www.sofi.com",
  },
  {
    emoji: "🌱",
    logoBg: "linear-gradient(135deg,#14532d,#22c55e)",
    name: "Acorns",
    type: "Micro-Investing",
    desc: "Round up everyday purchases and invest the spare change. Start with as little as $5.",
    tags: ["Micro-Invest", "Auto Round-Up", "ETFs"],
    highlight: "Micro-Invest",
    cta: "Start Saving",
    url: "https://www.acorns.com",
  },
];

let partnerIndex = 0;
const VISIBLE = 2; // cards visible at once

function renderPartnerCarousel() {
  const track = document.getElementById("partnerTrack");
  const dotsWrap = document.getElementById("partnerDots");
  if (!track || !dotsWrap) return;

  // Build cards
  track.innerHTML = PARTNERS.map((p, i) => `
    <a class="partner-card" href="${p.url}" target="_blank" rel="noopener noreferrer" data-index="${i}">
      <div class="partner-card-top">
        <div class="partner-logo" style="background:${p.logoBg}">${p.emoji}</div>
        <div>
          <div class="partner-name">${p.name}</div>
          <div class="partner-type">${p.type}</div>
        </div>
      </div>
      <div class="partner-desc">${p.desc}</div>
      <div class="partner-tags">
        ${p.tags.map(t => `<span class="partner-tag${t === p.highlight ? " highlight" : ""}">${t}</span>`).join("")}
      </div>
      <div class="partner-cta">${p.cta}</div>
    </a>
  `).join("");

  // Build dots (one per slide position)
  const totalSlides = PARTNERS.length - VISIBLE + 1;
  dotsWrap.innerHTML = Array.from({ length: totalSlides }, (_, i) =>
    `<button class="partner-dot${i === 0 ? " active" : ""}" data-pos="${i}" aria-label="Slide ${i + 1}"></button>`
  ).join("");

  dotsWrap.querySelectorAll(".partner-dot").forEach(d => {
    d.addEventListener("click", () => goToPartner(Number(d.dataset.pos)));
  });

  partnerIndex = 0;
  updatePartnerTrack();

  document.getElementById("partnerPrev")?.addEventListener("click", () => {
    goToPartner(partnerIndex - 1);
  });
  document.getElementById("partnerNext")?.addEventListener("click", () => {
    goToPartner(partnerIndex + 1);
  });
}

function goToPartner(pos) {
  const totalSlides = PARTNERS.length - VISIBLE + 1;
  partnerIndex = Math.max(0, Math.min(pos, totalSlides - 1));
  updatePartnerTrack();
}

function updatePartnerTrack() {
  const track = document.getElementById("partnerTrack");
  if (!track) return;
  // card width = (100% - gap) / 2 — but we use CSS flex so we shift by card+gap units
  const cardEl = track.querySelector(".partner-card");
  if (!cardEl) return;
  const cardW = cardEl.offsetWidth + 12; // 12 = gap
  track.style.transform = `translateX(-${partnerIndex * cardW}px)`;

  // update dots
  document.querySelectorAll(".partner-dot").forEach((d, i) => {
    d.classList.toggle("active", i === partnerIndex);
  });
}
