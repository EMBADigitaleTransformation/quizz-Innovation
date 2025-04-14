let fragen = [];
let frageIndex = 0;
let punkte = 0;
let falschBeantwortete = [];

async function ladeFragen() {
  const res = await fetch("questions.json");
  const alleFragen = await res.json();
  const alle = Object.values(alleFragen).flat();
  fragen = alle.sort(() => 0.5 - Math.random()).slice(0, 40);
  zeigeFrage();
}

function zeigeFrage() {
  const frage = fragen[frageIndex];
  document.getElementById("feedback").classList.add("hidden");
  document.getElementById("frage").innerText = frage.frage;
  const ul = document.getElementById("antworten");
  ul.innerHTML = "";
  const shuffled = [...frage.antworten].sort(() => 0.5 - Math.random());
  shuffled.forEach((antwort) => {
    const li = document.createElement("li");
    li.textContent = antwort;
    li.onclick = () => bewerteAntwort(li, antwort === frage.richtigeAntwort, frage);
    ul.appendChild(li);
  });
  updateProgress();
}

function bewerteAntwort(element, korrekt, frage) {
  document.querySelectorAll("#antworten li").forEach(li => li.onclick = null);
  const feedback = document.getElementById("feedback");
  feedback.classList.remove("hidden");
  const text = document.getElementById("feedback-text");
  if (korrekt) {
    element.classList.add("correct");
    text.textContent = "Richtig! ✅ " + frage.erklaerung;
    punkte++;
  } else {
    element.classList.add("wrong");
    text.textContent = "Falsch ❌ " + frage.erklaerung;
    falschBeantwortete.push(frage);
  }
  document.getElementById("weiter-btn").onclick = () => {
    frageIndex++;
    if (frageIndex < fragen.length) {
      zeigeFrage();
    } else {
      zeigeErgebnis();
    }
  };
}

function updateProgress() {
  const prozent = (frageIndex / fragen.length) * 100;
  document.getElementById("progress-bar").style.width = prozent + "%";
}

function zeigeErgebnis() {
  document.getElementById("frage-container").style.display = "none";
  document.getElementById("feedback").classList.add("hidden");
  document.getElementById("ergebnis").classList.remove("hidden");
  document.getElementById("score").textContent = `Du hast ${punkte} von ${fragen.length} Fragen richtig beantwortet.`;
  localStorage.setItem("falscheFragen", JSON.stringify(falschBeantwortete));
}

function starteTrainingsmodus() {
  const gespeicherteFalsche = localStorage.getItem("falscheFragen");
  if (!gespeicherteFalsche) {
    alert("Keine falsch beantworteten Fragen vorhanden.");
    return;
  }
  const falscheFragen = JSON.parse(gespeicherteFalsche);
  fragen = falscheFragen;
  frageIndex = 0;
  punkte = 0;
  falschBeantwortete = [];
  zeigeFrage();
}

async function ladeFragenNachKapitel(kapitel) {
  const res = await fetch("questions.json");
  const alleFragen = await res.json();
  fragen = alleFragen[kapitel].sort(() => 0.5 - Math.random()).slice(0, 20);
  frageIndex = 0;
  punkte = 0;
  falschBeantwortete = [];
  zeigeFrage();
}

ladeFragen();
