/**
 * IMPORTANTE AO IMPLANTAR:
 * 1. Tipo: Aplicativo da Web
 * 2. Executar como: EU (proprietário do projeto)
 * 3. Quem pode acessar: Qualquer pessoa
 */

const NOME_DA_ABA = "Confirmações";

function doPost(e) {
  try {
    const dados = e.parameter || {};
    const planilha = SpreadsheetApp.getActiveSpreadsheet();
    let aba = planilha.getSheetByName(NOME_DA_ABA);

    if (!aba) {
      aba = planilha.insertSheet(NOME_DA_ABA);
      aba.appendRow([
        "Data/Hora", "Responsável", "WhatsApp", "Adultos", "Crianças",
        "Total", "Lista de convidados", "Observações", "Ciente sobre pagamento"
      ]);
      aba.getRange(1, 1, 1, 9).setFontWeight("bold");
      aba.setFrozenRows(1);
    }

    aba.appendRow([
      dados.dataHora || Utilities.formatDate(new Date(), "America/Sao_Paulo", "dd/MM/yyyy HH:mm:ss"),
      dados.responsavel || "",
      dados.whatsapp || "",
      Number(dados.adultos || 0),
      Number(dados.criancas || 0),
      Number(dados.totalPessoas || 0),
      dados.convidados || "",
      dados.observacoes || "",
      dados.ciente || "Não"
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (erro) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, message: String(erro) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ success: true, message: "Integração ativa." }))
    .setMimeType(ContentService.MimeType.JSON);
}
