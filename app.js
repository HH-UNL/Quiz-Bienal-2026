const questions = [
  {
    category: "♻️ RESIDUOS",
    title: "¿Cómo se clasifican los residuos en la UNL?",
    hint: "Durante la Bienal vas a poder encontrar cestos y carteles que indican esta clasificación.",
    options: ["Residuos Secos y Húmedos", "Residuos Orgánicos e Inorgánicos", "Papel + Cartón + Vidrio + Otros"],
    correct: 0,
    right: "En la UNL se aplica una política de separación en origen que se encuentra alineada con la de la ciudad.",
    wrong: "La respuesta correcta es Secos y Húmedos. Esta política está alineada con la de la ciudad y responde a una cuestión de comunicación."
  },
  {
    category: "♻️ RESIDUOS",
    title: "¿Cuál de estas acciones genera menos residuos durante la Bienal?",
    hint: "",
    options: ["Usar un vaso descartable por cada bebida que consuma.", "Pedir una bolsa para cada compra", "Llevar una botella o vaso reutilizable."],
    correct: 2,
    right: "¡Correcto! Elegir elementos reutilizables, como una botella o un vaso, ayuda a reducir los residuos. La mejor forma de gestionar un residuo es evitar generarlo. 🌱",
    wrong: "Una forma sencilla de reducir residuos es evitar los productos descartables y elegir alternativas reutilizables. ¡Pequeñas decisiones pueden generar un gran cambio! ♻️"
  },
  {
    category: "⚡ ENERGÍA",
    title: "Durante la Bienal, ¿cuál de estas acciones ayuda a reducir el consumo de energía?",
    hint: "",
    options: ["Mantener las luces encendidas aunque no haya nadie", "Apagar equipos y luces cuando no son necesarios", "Usar focos halógenos de alta potencia para garantizar una buena visibilidad."],
    correct: 1,
    right: "Apagar las luces y los equipos cuando no se necesitan ayuda a reducir el consumo de energía. ¡Con pequeñas acciones hacemos una Bienal más sostenible! 🌱",
    wrong: "La opción más eficiente es apagar las luces y los equipos cuando no se necesitan. Cada pequeño gesto contribuye a un evento más sostenible. ⚡🌱"
  },
  {
    category: "⚡ ENERGÍA",
    title: "Para reducir el consumo energético en los escenarios y áreas de exposición, ¿qué opción es la más recomendable?",
    hint: "",
    options: ["Dejar aires o calefactores prendidos para garantizar una buena climatización.", "Optimizar el diseño de los espacios para aprovechar la luz natural y la ventilación cruzada.", "Utilizar luces dispersas por cuestiones estéticas."],
    correct: 1,
    right: "Aprovechar la iluminación natural y la ventilación cruzada ayuda a reducir el consumo energético y nuestro impacto. ¡Hagamos una Bienal más eficiente y sostenible! 🌱",
    wrong: "Aprovechar la iluminación natural y la ventilación cruzada permite evitar consumos innecesarios y ayuda a reducir el impacto ambiental. ⚡🌿"
  },
  {
    category: "💧 AGUA + HUELLA HÍDRICA",
    title: "¿Cuál sería una forma más efectiva de reducir el uso de agua potable en los baños y zonas de lavado de manos?",
    hint: "",
    options: ["Promover el uso de toallas de papel desechables en lugar de secadores de manos.", "Instalar canillas de bajo caudal y sistemas de descarga de inodoros eficientes.", "Ofrecer botellas de agua individuales a todos los asistentes para evitar el uso de canillas."],
    correct: 1,
    right: "Instalaciones más eficientes y un uso adecuado ayudan a reducir el consumo de agua potable. ¡Cada gota cuenta para una Bienal más sostenible! 🌱",
    wrong: "Para reducir el consumo de agua potable, es importante evitar el desperdicio e incorporar dispositivos eficientes en baños y zonas de lavado. 💧"
  },
  {
    category: "💧 AGUA + HUELLA HÍDRICA",
    title: "Cuando hablamos de “huella hídrica”, ¿a qué nos referimos?",
    hint: "",
    options: ["Al agua utilizada directa e indirectamente para producir bienes y servicios", "Al agua que podemos ver en un río o una laguna", "Solamente al agua potable que consumimos"],
    correct: 0,
    right: "La huella hídrica va mucho más allá del agua que vemos salir de una canilla. También contempla el agua utilizada para producir lo que consumimos.",
    wrong: "¡Faltó un poquito! La huella hídrica contempla también el agua utilizada para producir lo que consumimos."
  }
];

const $ = (id) => document.getElementById(id);
const intro = $("intro"), quiz = $("quiz"), result = $("result");
let index = 0, answers = Array(questions.length).fill(null), checked = false;

function showScreen(screen) {
  [intro, quiz, result].forEach(el => el.classList.add("hidden"));
  screen.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function renderQuestion() {
  const q = questions[index];
  checked = false;
  $("category").textContent = q.category;
  $("counter").textContent = `PREGUNTA ${index + 1} DE ${questions.length}`;
  $("progress").style.width = `${((index + 1) / questions.length) * 100}%`;
  $("question").textContent = q.title;
  $("questionHint").textContent = q.hint;
  $("questionHint").classList.toggle("hidden", !q.hint);
  $("feedback").className = "feedback hidden";
  $("feedback").textContent = "";
  $("answers").innerHTML = "";
  q.options.forEach((option, i) => {
    const btn = document.createElement("button");
    btn.className = "answer" + (answers[index] === i ? " selected" : "");
    btn.type = "button";
    btn.innerHTML = `<span class="letter">${String.fromCharCode(65 + i)}</span><span></span>`;
    btn.querySelector("span:last-child").textContent = option;
    btn.addEventListener("click", () => {
      if (checked) return;
      answers[index] = i;
      [...$("answers").children].forEach(el => el.classList.remove("selected"));
      btn.classList.add("selected");
      $("nextBtn").disabled = false;
    });
    $("answers").appendChild(btn);
  });
  $("backBtn").disabled = index === 0;
  $("nextBtn").disabled = answers[index] === null;
  $("nextBtn").textContent = index === questions.length - 1 ? "Ver resultado →" : "Siguiente →";
}
function revealFeedback() {
  if (answers[index] === null) return false;
  checked = true;
  const q = questions[index], correct = answers[index] === q.correct;
  const feedback = $("feedback");
  feedback.className = `feedback ${correct ? "correct" : "incorrect"}`;
  feedback.textContent = `${correct ? "✓ ¡Correcto! " : "↗ ¡Sigamos aprendiendo! "}${correct ? q.right : q.wrong}`;
  [...$("answers").children].forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add("selected");
  });
  $("nextBtn").disabled = false;
  $("nextBtn").textContent = index === questions.length - 1 ? "Ver resultado →" : "Continuar →";
  return true;
}
function onNext() {
  if (!checked) { revealFeedback(); return; }
  if (index < questions.length - 1) { index++; renderQuestion(); }
  else finishQuiz();
}
function finishQuiz() {
  const score = answers.reduce((total, answer, i) => total + (answer === questions[i].correct ? 1 : 0), 0);
  $("score").textContent = score;
  $("resultIcon").textContent = score === 6 ? "🌎" : score >= 4 ? "🌱" : "♻️";
  $("resultTitle").textContent = score === 6 ? "¡Excelente, huella positiva!" : score >= 4 ? "¡Muy bien! Vas por buen camino." : "¡Gracias por aprender y participar!";
  $("resultMessage").textContent = score === 6
    ? "Tenés muy presentes los hábitos sostenibles. ¡Compartí ese compromiso durante la Bienal!"
    : "Cada respuesta es una oportunidad para aprender. Las pequeñas acciones cotidianas ayudan a cuidar los recursos.";
  showScreen(result);
  saveResponse(score);
}
async function saveResponse(score) {
  const status = $("saveStatus");
  const cfg = window.QUIZ_CONFIG || {};
  if (!cfg.supabaseUrl || !cfg.supabaseAnonKey) {
    status.textContent = "La web funciona, pero todavía no está conectada a la base de datos. Para registrar participaciones, configurá Supabase siguiendo README.md.";
    return;
  }
  const payload = {
    score,
    total_questions: questions.length,
    answers: answers.map((answer, i) => ({
      question: questions[i].title,
      selected_option: questions[i].options[answer],
      correct: answer === questions[i].correct
    })),
    submitted_at: new Date().toISOString()
  };
  try {
    const response = await fetch(`${cfg.supabaseUrl}/rest/v1/${cfg.tableName || "quiz_responses"}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": cfg.supabaseAnonKey,
        "Authorization": `Bearer ${cfg.supabaseAnonKey}`,
        "Prefer": "return=minimal"
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    status.textContent = "✓ Tu participación quedó registrada. ¡Gracias por sumar a una Bienal más sostenible!";
  } catch (err) {
    console.error("No se pudo guardar la respuesta:", err);
    status.textContent = "No pudimos registrar tu participación en este momento. Podés mostrar el resultado igualmente; el equipo debe revisar la conexión a la base de datos.";
  }
}
$("startBtn").addEventListener("click", () => { index = 0; answers = Array(questions.length).fill(null); renderQuestion(); showScreen(quiz); });
$("nextBtn").addEventListener("click", onNext);
$("backBtn").addEventListener("click", () => { if (index > 0) { index--; renderQuestion(); } });
$("restartBtn").addEventListener("click", () => { index = 0; answers = Array(questions.length).fill(null); showScreen(intro); });
