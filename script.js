// URL pública da implantação do Google Apps Script (/exec)
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

function enviarPorJsonp(dados) {
  return new Promise((resolve, reject) => {
    const callbackName = `mariaAliceCallback_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    const script = document.createElement("script");
    const timeout = setTimeout(() => {
      limpar();
      reject(new Error("O servidor não confirmou o registro. Verifique a implantação pública do Apps Script."));
    }, 15000);

    function limpar() {
      clearTimeout(timeout);
      delete window[callbackName];
      if (script.parentNode) script.parentNode.removeChild(script);
    }

    window[callbackName] = (resposta) => {
      limpar();
      if (resposta && resposta.success) resolve(resposta);
      else reject(new Error(resposta?.message || "A planilha não confirmou o registro."));
    };

    const params = new URLSearchParams({
      action: "confirmar",
      callback: callbackName,
      ...dados
    });

    script.src = `${GOOGLE_SCRIPT_URL}?${params.toString()}`;
    script.async = true;
    script.onerror = () => {
      limpar();
      reject(new Error("Não foi possível acessar o Apps Script. A implantação pode estar exigindo login."));
    };
    document.body.appendChild(script);
  });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  statusBox.className = "form-status";
  statusBox.textContent = "";

  const formData = new FormData(form);
  const adultos = Number(formData.get("adultos") || 0);
  const criancas = Number(formData.get("criancas") || 0);
  const protocolo = `MA-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const dados = {
    protocolo,
    dataHora: new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }),
    responsavel: formData.get("responsavel") || "",
    whatsapp: formData.get("whatsapp") || "",
    adultos: String(adultos),
    criancas: String(criancas),
    totalPessoas: String(adultos + criancas),
    convidados: formData.get("convidados") || "",
    observacoes: formData.get("observacoes") || "",
    ciente: formData.get("ciente") ? "Sim" : "Não"
  };

  submitButton.disabled = true;
  submitButton.textContent = "Registrando na planilha...";

  try {
    const resposta = await enviarPorJsonp(dados);
    form.reset();
    document.getElementById("adultos").value = 1;
    document.getElementById("criancas").value = 0;
    statusBox.className = "form-status success";
    statusBox.textContent = `Presença registrada com sucesso! Protocolo: ${resposta.protocolo}. Esperamos vocês com carinho. 💕`;
  } catch (error) {
    console.error("Falha ao registrar:", error);
    statusBox.className = "form-status error";
    statusBox.textContent = "A confirmação NÃO foi registrada. No Apps Script, configure: Executar como EU e Quem pode acessar: QUALQUER PESSOA. Depois implante uma nova versão.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Confirmar minha presença";
  }
});

const partyDate = new Date("2026-08-15T12:00:00-03:00");

function updateCountdown() {
  const distance = partyDate.getTime() - Date.now();
  const countdown = document.querySelector(".countdown");
  if (!countdown) return;

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
