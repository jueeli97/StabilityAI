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

// ===== BACKEND CONNECTION =====
const API_URL = "http://localhost:5000";

document.getElementById("planForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById("submitBtn");
    submitBtn.textContent = "⏳ Generating your plan...";
    submitBtn.disabled = true;

    const userProfile = {
        situation: document.getElementById("situation").value,
        salary: parseFloat(document.getElementById("salary").value),
        numChildren: parseInt(document.getElementById("numChildren").value),
        childAges: document.getElementById("childAges").value,
        rent: parseFloat(document.getElementById("rent").value),
        totalDebt: parseFloat(document.getElementById("totalDebt").value),
        monthlyDebtPayment: parseFloat(document.getElementById("monthlyDebtPayment").value),
        savings: parseFloat(document.getElementById("savings").value),
    };

    try {
        const res = await fetch(`${API_URL}/api/gemini/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userProfile }),
        });

        const data = await res.json();
        displayResults(data);
    } catch (err) {
        alert("Something went wrong. Make sure your backend is running!");
        console.error(err);
    } finally {
        submitBtn.textContent = "✨ Generate My Plan";
        submitBtn.disabled = false;
    }
});

function displayResults(data) {
    const results = document.getElementById("results");
    results.style.display = "block";
    results.scrollIntoView({ behavior: "smooth" });

    const budget = data.budgetBreakdown;
    const icons = {
        housing: "🏠", children: "👶", food: "🛒",
        debt: "💳", emergency: "🚨", investment: "📈", personal: "💜"
    };

    results.innerHTML = `
        <h3>✨ Your Personalized Financial Plan</h3>

        <h4 style="margin-bottom:12px; color:#7C5CFC;">Monthly Budget Breakdown</h4>
        <div class="budget-grid">
            ${Object.entries(budget).map(([key, val]) => `
                <div class="budget-item">
                    <div class="label">${icons[key] || "💰"} ${key.charAt(0).toUpperCase() + key.slice(1)}</div>
                    <div class="amount">$${val}</div>
                </div>
            `).join("")}
        </div>

        <h4 style="margin-bottom:12px; color:#7C5CFC;">🎯 Your Next 30 Days</h4>
        <ul class="action-list">
            ${data.priorityActions.map(a => `<li>${a}</li>`).join("")}
        </ul>

        <h4 style="margin-bottom:12px; color:#7C5CFC;">📅 6-Month Plan</h4>
        <ul class="action-list">
            ${data.sixMonthPlan.map(a => `<li>${a}</li>`).join("")}
        </ul>

        <h4 style="margin-bottom:12px; color:#7C5CFC;">💡 Special Tips</h4>
        <ul class="action-list">
            ${data.specialTips.map(a => `<li>${a}</li>`).join("")}
        </ul>

        <button class="speak-btn" onclick="speakPlan('${data.voiceSummary.replace(/'/g, "\\'")}')">
            🔊 Read My Plan Aloud
        </button>
    `;
}

async function speakPlan(text) {
    try {
        const res = await fetch(`${API_URL}/api/speak/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
        });

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.play();
    } catch (err) {
        alert("Voice feature failed. Check ElevenLabs API key.");
        console.error(err);
    }
}