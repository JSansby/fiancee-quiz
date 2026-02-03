const QUESTIONS = [
  {
    title: "Question 1",
    text: "Who is the coolest?",
    answers: ["Bali", "Chester", "Matcha", "Snowboarding"],
    correctIndex: 3,
    correctMessage: "Very chilly indeed",
    wrongMessage: "C'mon I said COOLest",
    anyIsCorrect: false
  },
  {
    title: "Question 2",
    text: "When was our first holiday abroad together?",
    answers: ["Feb 2018", "January 2019", "Feb 2019", "June 2018"],
    correctIndex: 2,
    correctMessage: "sofa bed kings unite",
    wrongMessage: "wow, I thought you remembered everything",
    anyIsCorrect: false
  },
  {
    title: "Question 3",
    text: "On a scale of poor, how poor does your holiday addiction keep me?",
    answers: [
      "Very poor",
      "Rice and Beans",
      "Grow up, you'll never wish you saved the money",
      "I'll just take 'a little bit' out of my house pot to pay for the next holiday"
    ],
    // no correct answer -> any click acts like "it's all of the above"
    correctIndex: -1,
    correctMessage: "no correct answer",
    wrongMessage: "Shock, it's all of the above",
    anyIsCorrect: true  // special handling: allow Next after any choice
  }
];

let current = 0;
let pendingNext = false;

const qTitle = document.getElementById("qTitle");
const qText = document.getElementById("qText");
const answersEl = document.getElementById("answers");
const hint = document.getElementById("hint");
const progress = document.getElementById("progress");
const nextBtn = document.getElementById("nextBtn");

const modalOverlay = document.getElementById("modalOverlay");
const modalBadge = document.getElementById("modalBadge");
const modalMessage = document.getElementById("modalMessage");
const modalCloseBtn = document.getElementById("modalCloseBtn");

function openModal(type, message) {
  modalBadge.classList.remove("good", "bad");
  modalBadge.classList.add(type);
  modalBadge.textContent = type === "good" ? "Correct" : "Wrong";
  modalMessage.textContent = message;

  modalOverlay.classList.remove("hidden");

  // focus for accessibility + iPhone vibe
  modalCloseBtn.focus();
}

function closeModal() {
  modalOverlay.classList.add("hidden");

  // If we earned Next, show it after the modal closes
  if (pendingNext) {
    nextBtn.classList.remove("hidden");
    hint.textContent = "Go on then →";
    pendingNext = false;
  }
}

modalCloseBtn.addEventListener("click", closeModal);

// Close modal if they tap outside the modal box
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});

function renderQuestion() {
  const q = QUESTIONS[current];

  qTitle.textContent = q.title;
  qText.textContent = q.text;
  progress.textContent = "super secret quiz";
  hint.textContent = "Tap an answer";
  nextBtn.classList.add("hidden");
  pendingNext = false;

  answersEl.innerHTML = "";
  q.answers.forEach((label, idx) => {
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.type = "button";
    // A/B/C/D display
    const letter = String.fromCharCode(65 + idx);
    btn.innerHTML = `<span class="num">${letter}</span>${label}`;

    btn.addEventListener("click", () => handleAnswer(btn, idx));
    answersEl.appendChild(btn);
  });
}

function handleAnswer(button, idx) {
  const q = QUESTIONS[current];

  // Special question: “no correct answer”
  if (q.anyIsCorrect) {
    openModal("bad", q.wrongMessage);
    // allow progressing after acknowledging modal
    pendingNext = true;

    // Optional: don't fade anything here (keeps it clean)
    // If you *want* the clicked option to fade even here, uncomment:
    // button.classList.add("wrongFade");

    // Also lock buttons to stop spam taps
    [...answersEl.querySelectorAll("button")].forEach(b => (b.disabled = true));
    return;
  }

  // Normal questions with correct answer
  if (idx !== q.correctIndex) {
    openModal("bad", q.wrongMessage);
    button.classList.add("wrongFade");
    hint.textContent = "Try again 😉";
    return;
  }

  openModal("good", q.correctMessage);
  pendingNext = true;

  // lock buttons once correct is found
  [...answersEl.querySelectorAll("button")].forEach(b => (b.disabled = true));
}

nextBtn.addEventListener("click", () => {
  current++;
  if (current >= QUESTIONS.length) {
    // End screen
    qTitle.textContent = "Done ❤️";
    qText.textContent = "Now go claim your prize 😌";
    answersEl.innerHTML = "";
    nextBtn.classList.add("hidden");
    hint.textContent = "All finished!";
    // optional modal finale:
    openModal("good", "You smashed it. I love you.");
    return;
  }
  renderQuestion();
});

// Start
renderQuestion();
