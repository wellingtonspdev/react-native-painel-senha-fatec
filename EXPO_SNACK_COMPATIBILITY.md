# Guia de Compatibilidade: Expo Snack & Git Importer

Este documento registra a causa raiz técnica, o diagnóstico e o procedimento para solucionar e prevenir falhas de importação de repositórios Git no **Expo Snack** (`https://snack.expo.dev`).

---

## 1. O Problema

Ao utilizar a funcionalidade **"Import git repository"** no Expo Snack informando a URL de um repositório GitHub, o processo falha com o seguinte erro:

```text
An error occurred during import. This could be because the data provided was invalid, or because the repository referenced is not a properly formatted Expo project.

Failed to create snack:
Error generating snackObj:
Error parsing files:
Failed to upload file asset

VALIDATION_ERROR
"$": Required
isTransient: false
requestId: "c425a8c5-fac6-445f-a951-12723173841b"
```

---

## 2. Causa Raiz Técnica

O importador Git do Expo Snack segue o seguinte fluxo durante a importação:

1. **Clona/Varre a árvore remota do Git:** O backend do Snack percorre todos os arquivos rastreados no repositório remoto.
2. **Classificação dos arquivos (`CODE` vs `ASSET`):**
   - Arquivos com extensões de texto padrão (`.js`, `.jsx`, `.ts`, `.tsx`, `.json`, `.md`, `.css`, `.html`) são classificados como `CODE` e inseridos inline no payload (`snackObj`).
   - Qualquer arquivo com extensão não reconhecida (ex.: `.mjs`), arquivos binários (ex.: `.png`, `.jpg`, `.ttf`) ou arquivos sem extensão padrão (ex.: `.gitignore`) é classificado pelo Snack SDK como `ASSET`.
3. **Disparo de Upload de Assets:**
   - Para cada item classificado como `ASSET`, o importador tenta fazer o upload do arquivo para a infraestrutura de CDN/S3 do Expo.
4. **Falha de Validação na API do Expo:**
   - Durante importações anônimas ou com metadados incompletos na requisição do importador, a API do Expo rejeita o corpo da requisição com `VALIDATION_ERROR ("$": Required)`, abortando em cascata o parser de arquivos e a criação do Snack.

---

## 3. Checklist de Arquivos Problemáticos no Repositório

Para o Snack conseguir importar o repositório sem disparar o uploader com falha, os seguintes arquivos **NÃO** devem estar presentes no rastreamento da branch importada:

| Tipo de Arquivo | Exemplo | Motivo da Rejeição pelo Snack |
|---|---|---|
| Arquivos de configuração de Git | `.gitignore` | Arquivo sem extensão é tratado como asset pelo parser do Snack. |
| Referências a assets inexistentes | `app.json` com `web.favicon` | O Snack tenta resolver assets locais que falham no upload. |
| Lockfiles muito extensos | `package-lock.json` | Desnecessário para o Snack e pode gerar ruído/timeout no parsing. |
| Imagens e Binários locais | `assets/*.png`, `screenshots/*.png` | O importador tenta fazer upload e falha com `VALIDATION_ERROR`. |
| Extensões não mapeadas | `*.mjs`, `*.sh` | Extensões não listadas como código padrão viram assets. |

---

## 4. Solução Aplicada

1. **Remoção do tracking do Git dos arquivos não compatíveis:**
   - `.gitignore` (removido do Git tracking)
   - `package-lock.json` (removido do Git tracking)
2. **Limpeza do `app.json`:**
   - Removida referência ao `"web": { "favicon": "./assets/favicon.png" }`.
3. **Estrutura Mínima Compatível Mantida no Git:**
   ```text
   .
   ├── App.js
   ├── EXPO_SNACK_COMPATIBILITY.md
   ├── README.md
   ├── __tests__/
   │   └── regras.test.js
   ├── app.json
   ├── babel.config.js
   ├── package.json
   ├── scripts/
   │   └── test-runner.js
   └── src/
       ├── components/
       │   ├── Badge.js
       │   ├── Cadastro.js
       │   ├── Chamada.js
       │   ├── FilaEspera.js
       │   └── GerarSenha.js
       ├── theme/
       │   └── theme.js
       └── utils/
           └── regras.js
   ```

---

## 5. Problema Adicional: `Cannot read properties of undefined (reading 'ReactCurrentOwner')` com `expo-linear-gradient`

### Diagnóstico:
No runtime Web preview do Expo Snack, pacotes que acessam internos privados do React (`React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner`), como versões antigas ou web de `expo-linear-gradient`, geram crash no carregamento do bundle (`TypeError: Cannot read properties of undefined (reading 'ReactCurrentOwner')`).

### Solução:
Substituir `LinearGradient` por componentes visuais nativos (`View` / `Pressable`) com estilos de cor sólida e bordas semânticas do tema, eliminando a dependência do `expo-linear-gradient` para garantir compatibilidade 100% universal em Web, Android e iOS no Snack.

---

## 6. Como Evitar o Problema em Novos Projetos

1. **Nunca versione imagens locais de documentação no mesmo branch do app** se o repositório for destinado a importação no Expo Snack (use URLs públicas do GitHub).
2. **Não versione arquivos sem extensão** (como `.gitignore`) na branch do Snack.
3. **Mantenha o `app.json` sem referências a assets locais não existentes.**
4. **Evite pacotes dependentes de React internals legados** (ex: `expo-linear-gradient` em botões simples) para visualização Web estável no Snack.

