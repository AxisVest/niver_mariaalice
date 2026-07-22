// URL da implantação do Google Apps Script
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxZzfFw-qbn0dLvdBtNub-bVrDhsy7cPCYg-q7-m9o_SYGDuwoeMRgoimwF-7FCe9fF/exec";

const form = document.getElementById("rsvpForm");
const statusBox = document.getElementById("formStatus");
const submitButton = form.querySelector('button[type="submit"]');
const whatsappInput = document.getElementById("whatsapp");

whatsappInput.addEventListener("input", (event) => {
  let value = event.target.value.replace(/\D/g, "").slice(0, 11);
  if (value.length > 10) value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  else if (value.length > 6) value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
  else if (value.length > 2) value = value.replace(/^(\d{2})(\d+)/, "($1) $2");
  else if (value.length > 0) value = value.replace(/^(\d*)/, "($1");
  event.target.value = value;
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  statusBox.className = "form-status";
  statusBox.textContent = "";

  const formData = new FormData(form);
  const adultos = Number(formData.get("adultos") || 0);
  const criancas = Number(formData.get("criancas") || 0);

  const payload = new URLSearchParams();
  payload.set("dataHora", new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }));
  payload.set("responsavel", formData.get("responsavel") || "");
  payload.set("whatsapp", formData.get("whatsapp") || "");
  payload.set("adultos", String(adultos));
  payload.set("criancas", String(criancas));
  payload.set("totalPessoas", String(adultos + criancas));
  payload.set("convidados", formData.get("convidados") || "");
  payload.set("observacoes", formData.get("observacoes") || "");
  payload.set("ciente", formData.get("ciente") ? "Sim" : "Não");

  submitButton.disabled = true;
  submitButton.textContent = "Enviando confirmação...";

  try {
    // no-cors evita o bloqueio do navegador no redirecionamento do Apps Script.
    // A requisição é enviada normalmente e a planilha recebe os dados.
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: payload.toString()
    });

    form.reset();
    document.getElementById("adultos").value = 1;
    document.getElementById("criancas").value = 0;
    statusBox.className = "form-status success";
    statusBox.textContent = "Presença confirmada! Ficamos muito felizes e esperamos vocês com carinho. 💕";
  } catch (error) {
    console.error("Falha ao enviar:", error);
    statusBox.className = "form-status error";
    statusBox.textContent = "Não foi possível enviar agora. Verifique sua internet e tente novamente.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Confirmar minha presença";
  }
});

const partyDate = new Date("2026-08-15T12:00:00-03:00");

function updateCountdown() {
  const distance = partyDate.getTime() - Date.now();
  const countdown = document.querySelector(".countdown");

  if (distance <= 0) {
    countdown.innerHTML = "<strong>Hoje é o grande dia! 🎉</strong>";
    return;
  }

  const days = Math.floor(distance / 86400000);
  const hours = Math.floor((distance % 86400000) / 3600000);
  const minutes = Math.floor((distance % 3600000) / 60000);
  const seconds = Math.floor((distance % 60000) / 1000);

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);
