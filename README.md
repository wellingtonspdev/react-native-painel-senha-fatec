# Painel Saúde — Atividade Prática 02 | PainelSenha

Aplicação desenvolvida em **React Native + Expo** para a disciplina de **Programação para Dispositivos Móveis II** (FATEC). O projeto simula um sistema de atendimento hospitalar e triagem de pacientes em **uma única tela**, com geração de senhas normais e prioritárias, identificação de faixas etárias, especialidades médicas e fila com ordenação por prioridade.

---

## 📌 Restrição Arquitetural Crítica: Tela Única

> **IMPORTANTE**: Toda a aplicação opera estritamente dentro de **UMA ÚNICA TELA**. Não são utilizados `React Navigation`, `Stack Navigator`, `Tabs`, rotas ou páginas separadas. Toda a experiência de cadastro, emissão de senhas, chamada e visualização da fila ocorre via scroll vertical e estado unificado.

---

## 🚀 Tecnologias Utilizadas

- **React Native** (v0.74.5)
- **Expo** (~51.0.0)
- **Expo Status Bar** (~1.12.1)
- **React Hooks** (`useState`, `useEffect`, `useRef`)
- **React Native Animated** (animações nativas leves)
- **Jest** (suíte de testes unitários para regras de negócio e fila)

---

## 📁 Estrutura do Projeto

```text
atividade-pratica-02-painel-senha/
│
├── App.js                         # Tela única principal com orquestração do estado
├── app.json                       # Configurações do Expo
├── package.json                   # Metadados e dependências
├── README.md                      # Documentação completa do projeto
├── babel.config.js                # Preset do Babel para Expo e Jest
│
├── __tests__/
│   └── regras.test.js             # Testes unitários com Jest (faixas, prioridades, fila)
│
└── src/
    ├── components/
    │   ├── Badge.js               # Chips/badges reutilizáveis com variantes visuais
    │   ├── Cadastro.js            # Formulário de paciente, faixas etárias e especialidades
    │   ├── GerarSenha.js          # Cartão com animação da senha recém-gerada
    │   ├── Chamada.js             # Painel de destaque do paciente chamado e botão de chamada
    │   └── FilaEspera.js          # Lista de espera com contadores e badges de prioridade
    │
    ├── theme/
    │   └── theme.js               # Tokens visuais (cores dark, glassmorphism, tipografia, sombras)
    │
    └── utils/
        └── regras.js              # Funções puras de regras de negócio, faixas, prioridades e fila
```

---

## 📋 Regras de Negócio e Decisões de Projeto

### 1. Faixas Etárias e Especialidades Médicas

| Faixa Etária | Idades | Especialidades Disponíveis |
| :--- | :--- | :--- |
| **Criança** | `0` a `12` anos | `Pediatria`, `Neuropediatria` |
| **Adolescente** | `13` a `18` anos | `Endocrinologia Pediátrica`, `Psiquiatria Infantil e Adolescente` |
| **Adulto Jovem** | `19` a `40` anos | `Dermatologia`, `Ginecologia/Urologia` |
| **Meia-idade** | `41` a `59` anos | `Cardiologia`, `Ortopedia` |
| **Idoso** | `60` ou mais | `Geriatria`, `Oftalmologia` |

> ⚠️ **Decisão sobre a Ambiguidade dos 60 anos**:  
> O enunciado original apresentava sobreposição ao declarar simultaneamente "41–60 anos" e "60 ou mais". Para eliminar a ambiguidade de forma determinística, adotou-se estritamente:
> - **41 a 59 anos** → `Meia-idade`
> - **60 anos ou mais** → `Idoso`  
> Essa regra está isolada na função pura `obterFaixaEtaria` em `src/utils/regras.js`.

### 2. Critério de Prioridade

> ⚠️ **Decisão sobre Critério de Prioridade**:  
> O enunciado exige a priorização de chamadas, mas não define a regra de concessão. Como decisão de projeto, definiu-se que **pacientes com idade ≥ 60 anos (Idosos)** recebem **Atendimento Prioritário** (`prioridade = true`). As demais faixas etárias recebem atendimento normal (`prioridade = false`).  
> A regra está centralizada na função `isPrioritario(idade)` em `src/utils/regras.js`.

### 3. Formato e Contadores de Senhas

- **Senhas Normais**: `N-001`, `N-002`, `N-003`, etc.
- **Senhas Prioritárias**: `P-001`, `P-002`, `P-003`, etc.
- Os contadores são independentes (`contadorNormal` e `contadorPrioritario`) e não se repetem na sessão.

### 4. Algoritmo de Fila com Prioridade (FIFO por Categoria)

A chamada de pacientes atende ao seguinte algoritmo:
1. Se houver pacientes prioritários na fila, o primeiro prioritário que chegou é chamado (FIFO entre prioritários).
2. Se não houver nenhum paciente prioritário na fila, o primeiro paciente normal é chamado (FIFO entre normais).
3. O paciente chamado é removido da fila e exibido com grande destaque no painel `Chamada Atual`.

**Exemplo de fluxo testado:**
- Fila de entrada: `N-001`, `N-002`, `P-001`, `N-003`, `P-002`
- Ordem de chamadas: `P-001` ➔ `P-002` ➔ `N-001` ➔ `N-002` ➔ `N-003`

---

## 🎨 Identidade Visual e Design

- **Dark Glassmorphism**: Fundo `#0f172a`, cards com fundo translúcido `rgba(30, 41, 59, 0.60)`, bordas suaves `rgba(255, 255, 255, 0.10)` e sombras sutis.
- **Gradientes Acentuados**: `#8b5cf6` (Roxo) ➔ `#6366f1` (Índigo) nos botões de ação e destaques principais.
- **Acentos Semânticos**:
  - `Cyan (#67e8f9)`: Especialidades médicas e detalhes informativos.
  - `Amber (#fcd34d)`: Destaques de prioridade e senhas prioritárias.
  - `Vermelho (#f87171)`: Mensagens de validação de formulário inline.
  - `Verde (#34d399)`: Indicadores de status ativo.
- **Micro-animações**: Transições suaves de entrada (`opacity` e `scale`) via `Animated` nativo para novos tickets gerados e chamadas.

---

## 🧪 Como Executar os Testes

O projeto conta com suíte automatizada de testes cobrindo todas as idades limítrofes, validações e algoritmo de ordenação da fila.

```bash
npm test
```

### Casos de Teste Validados:
- **Matriz de Idades**: `0`, `12`, `13`, `18`, `19`, `40`, `41`, `59`, `60`, `61` anos e idades inválidas/negativas.
- **Especialidades Médicas**: Mapeamento exclusivo e correto para cada faixa etária.
- **Critério de Prioridade**: `< 60` anos = normal, `>= 60` anos = prioritário.
- **Formatação de Senhas**: `N-001`, `P-001`, com 3 dígitos padronizados.
- **Validações de Formulário**: Bloqueio de submissão para nome vazio, idade inválida/negativa, sexo não selecionado e especialidade vazia.
- **Ordenação da Fila**: Preservação de FIFO e precedência total de prioritários.

---

## 📱 Como Executar o Aplicativo Localmente

1. Clone o repositório ou navegue até o diretório:
   ```bash
   cd atividade-pratica-02-painel-senha
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor Metro/Expo:
   ```bash
   npx expo start
   ```

4. Para testar no dispositivo físico:
   - Abra o aplicativo **Expo Go** (Android ou iOS).
   - Escaneie o QR Code exibido no terminal.

---

## 🌐 Compatibilidade com Expo Snack

O código foi 100% projetado para ser copiado diretamente para o [Snack Expo](https://snack.expo.dev):

1. Crie um novo Snack no [snack.expo.dev](https://snack.expo.dev).
2. Adicione os arquivos da pasta `src/` mantendo os mesmos caminhos relativos:
   - `src/theme/theme.js`
   - `src/utils/regras.js`
   - `src/components/Badge.js`
   - `src/components/Cadastro.js`
   - `src/components/GerarSenha.js`
   - `src/components/Chamada.js`
   - `src/components/FilaEspera.js`
3. Cole o conteúdo de App.js no App.js do Snack.
4. O Snack resolverá automaticamente o runtime padrão sem dependências nativas adicionais.
