// ----------------- Subject Tabs -----------------
const subjectButtons = document.querySelectorAll(".subject-btn");
const tabContents = document.querySelectorAll(".tab-content");

subjectButtons.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    subjectButtons.forEach(b => b.classList.remove("active"));
    tabContents.forEach(t => t.classList.remove("active"));
    btn.classList.add("active");
    tabContents[index].classList.add("active");
  });
});

// ----------------- Dark Mode -----------------
const themeBtn = document.querySelector(".theme-btn");
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeBtn.textContent = document.body.classList.contains("dark")
    ? "☀️ Light Mode"
    : "🌙 Dark Mode";
});

// ----------------- AI Study Helper -----------------
const OPENAI_API_KEY = "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"; // 🔒 Replace with your API key

const sections = document.querySelectorAll(".tab-content");
sections.forEach(section => {
  const input = section.querySelector("textarea");
  const btn = section.querySelector("button");
  const output = section.querySelector(".ai-output");
  const voiceBtn = section.querySelector(".voice-btn"); // optional voice button

  if (!input || !btn || !output) return;

  // Fetch AI Answer
  const fetchAIAnswer = async (prompt) => {
    try {
      output.textContent = "Thinking... 🤖";

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 2000,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      output.textContent = data.choices?.[0]?.message?.content || "No response found.";
    } catch (err) {
      output.textContent = "Error: " + err.message;
      console.error(err);
    }
  };

  // Button click
  btn.addEventListener("click", () => {
    const prompt = input.value.trim();
    if (!prompt) {
      output.textContent = "Please type a question!";
      return;
    }
    fetchAIAnswer(prompt);
  });

  // Enter key triggers AI helper
  input.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      btn.click();
    }
  });

  // ----------------- Voice Command -----------------
  if (voiceBtn && "webkitSpeechRecognition" in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    voiceBtn.addEventListener("click", () => {
      recognition.start();
    });

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      input.value = transcript;
      fetchAIAnswer(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };
  }
});

// ----------------- Flashcards Tab -----------------
const flashcardContainer = document.querySelector(".flashcards-scroll");
const flashcardInput = document.getElementById("flashcard-input");
const flashcardAddBtn = document.getElementById("add-flashcard");

const loadFlashcards = () => {
  const saved = JSON.parse(localStorage.getItem("flashcards") || "[]");
  flashcardContainer.innerHTML = "";
  saved.forEach(text => createFlashcard(text, false));
};

const createFlashcard = (text, save = true) => {
  const card = document.createElement("div");
  card.classList.add("flashcard");
  card.textContent = text;

  card.addEventListener("click", () => {
    card.classList.toggle("flipped");
    card.textContent = card.classList.contains("flipped") ? "❓" : text;
  });

  flashcardContainer.appendChild(card);

  if (save) {
    const saved = JSON.parse(localStorage.getItem("flashcards") || "[]");
    saved.push(text);
    localStorage.setItem("flashcards", JSON.stringify(saved));
  }
};

flashcardAddBtn.addEventListener("click", () => {
  const text = flashcardInput.value.trim();
  if (!text) return;
  createFlashcard(text);
  flashcardInput.value = "";
});

loadFlashcards();
