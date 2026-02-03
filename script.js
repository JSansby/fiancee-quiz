// Edit/add questions here
const QUESTIONS = [
  {
    title: "Question 1",
    text: "What is cooler?",
    answers: ["Jake", "Chester", "Matcha", "Snowboarding"],
    correctIndex: 3, // 0-based index (Snowboarding)
    onCorrectHint: "Correct 😎"
  },

  // Example next question (optional)
  {
    title: "Question 2",
    text: "Pick the best thing for a sunrise date:",
    answers: ["Sleep in", "Sunrise walk", "Laundry", "Emails"],
    correctIndex: 1,
    onCorrectHint: "You know the vibe 🌅"
  }
];

let current = 0;

const qTitle = document.getElementById("qTitle");
const qText = document.getElementById("qText");
const answersEl = document.getElementById("answers");
const feedback = document.getElementById("feedback");
const hint = document.getElementById("hint");
const progress = document.getElementById("progress");
const nextBtn = document.getElementById("nextBtn");

function setFeedback(type, text) {
  feedback.classList.remove("bad", "good", "show");
  // Force reflow so the animation restarts if you hit wrong multiple times
  void feedback.offsetWidth;
  feedback.textContent = text;
  feedback.classList.add(type, "show");
}

function renderQuestion() {
  const q = QUESTIONS[current];

  // Reset UI
  qTitle.textContent = q.title;
  qText.textContent = q.text;
  progress.textContent = `Question ${current + 1} of ${QUESTIONS.length}`;
  hint.textContent = "Tap an answer";
  nextBtn.classList.add("hidden");
  feedback.classList.remove("show", "bad", "good");
  feedback.textContent = "";

  // Build answer buttons
  answersEl.innerHTML = "";
  q.answers.forEach((label, idx) => {
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.type = "button";
    btn.innerHTML = `<span class="num">${idx + 1}</span>${label}`;

    btn.addEventListener("click", () => handleAnswer(btn, idx));
    answersEl.appendChild(btn);
  });
}

function handleAnswer(button, idx) {
  const q = QUESTIONS[current];

  if (idx !== q.correctIndex) {
    setFeedback("bad", "WRONG");
    hint.textContent = "Try again 😉";
    // Fade ONLY the tapped wrong button away
    button.classList.add("wrongFade");
    return;
  }

  setFeedback("good", "CORRECT");
  hint.textContent = q.onCorrectHint || "Nice!";
  nextBtn.classList.remove("hidden");

  // Optional: lock remaining buttons once correct is found
  [...answersEl.querySelectorAll("button")].forEach(b => (b.disabled = true));
}

nextBtn.addEventListener("click", () => {
  current++;
  if (current >= QUESTIONS.length) {
    // End screen
    qTitle.textContent = "Done ❤️";
    qText.textContent = "Now turn the card over…";
    answersEl.innerHTML = "";
    nextBtn.classList.add("hidden");
    setFeedback("good", "I LOVE YOU");
    hint.textContent = "Happy surprise moment!";
    progress.textContent = "Finished";
    return;
  }
  renderQuestion();
});

// Start
renderQuestion();
