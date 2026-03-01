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