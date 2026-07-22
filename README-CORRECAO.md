# Correção da landing page da Maria Alice

## O que foi corrigido

1. A contagem regressiva agora possui segundos e atualiza a cada 1 segundo.
2. O envio passou a usar formulário codificado e `no-cors`, evitando o bloqueio do navegador entre o GitHub Pages e o Google Apps Script.
3. O Apps Script agora lê os dados por `e.parameter`.
4. Foram incluídos parâmetros de versão nos arquivos CSS e JavaScript para evitar que o GitHub Pages/Chrome exiba uma versão antiga em cache.

## Configuração obrigatória do Apps Script

A implantação mostrada anteriormente estava configurada como **“Executar como: usuário com acesso ao app da Web”**. Essa opção obriga cada convidado a autorizar uma conta Google e impede o funcionamento público esperado.

Faça exatamente isto:

1. Na planilha, abra **Extensões > Apps Script**.
2. Substitua todo o código pelo arquivo `google-apps-script.gs` deste pacote.
3. Salve.
4. Clique em **Implantar > Gerenciar implantações**.
5. Clique no lápis da implantação `Niver_Maria`.
6. Em **Executar como**, selecione **Eu**.
7. Em **Quem pode acessar**, selecione **Qualquer pessoa**.
8. Em “Versão”, selecione **Nova versão**.
9. Clique em **Implantar** e autorize.
10. Copie a URL terminada em `/exec`.
11. Caso a URL tenha mudado, substitua a constante `GOOGLE_SCRIPT_URL` no início do `script.js`.

## Atualização no GitHub

Substitua no repositório os arquivos:

- `index.html`
- `script.js`
- `google-apps-script.gs` (este fica no Apps Script, não é necessário para o site)

O `style.css` pode ser mantido, mas este pacote também contém uma cópia.

Depois, pressione `Ctrl + F5` na página publicada para ignorar o cache.
