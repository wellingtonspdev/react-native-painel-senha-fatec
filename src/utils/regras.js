/**
 * REGRAS DE NEGÓCIO DO PAINEL DE SENHAS (FUNÇÕES PURAS)
 */

export const FAIXA_ETARIA_NOMES = {
  CRIANCA: 'Criança',
  ADOLESCENTE: 'Adolescente',
  ADULTO_JOVEM: 'Adulto Jovem',
  MEIA_IDADE: 'Meia-idade',
  IDOSO: 'Idoso',
};

export const ESPECIALIDADES_POR_FAIXA = {
  [FAIXA_ETARIA_NOMES.CRIANCA]: ['Pediatria', 'Neuropediatria'],
  [FAIXA_ETARIA_NOMES.ADOLESCENTE]: [
    'Endocrinologia Pediátrica',
    'Psiquiatria Infantil e Adolescente',
  ],
  [FAIXA_ETARIA_NOMES.ADULTO_JOVEM]: ['Dermatologia', 'Ginecologia/Urologia'],
  [FAIXA_ETARIA_NOMES.MEIA_IDADE]: ['Cardiologia', 'Ortopedia'],
  [FAIXA_ETARIA_NOMES.IDOSO]: ['Geriatria', 'Oftalmologia'],
};

/**
 * Identifica a faixa etária com base na idade numérica.
 * Decisão de projeto:
 * - 0 a 12: Criança
 * - 13 a 18: Adolescente
 * - 19 a 40: Adulto Jovem
 * - 41 a 59: Meia-idade (adotado 41-59 para resolver sobreposição do enunciado 41-60 vs 60+)
 * - 60+: Idoso
 */
export function obterFaixaEtaria(idade) {
  if (idade === null || idade === undefined || idade === '') {
    return null;
  }

  const numIdade = typeof idade === 'string' ? Number(idade.trim()) : Number(idade);

  if (Number.isNaN(numIdade) || numIdade < 0 || !Number.isFinite(numIdade)) {
    return null;
  }

  if (numIdade <= 12) return FAIXA_ETARIA_NOMES.CRIANCA;
  if (numIdade <= 18) return FAIXA_ETARIA_NOMES.ADOLESCENTE;
  if (numIdade <= 40) return FAIXA_ETARIA_NOMES.ADULTO_JOVEM;
  if (numIdade <= 59) return FAIXA_ETARIA_NOMES.MEIA_IDADE;
  return FAIXA_ETARIA_NOMES.IDOSO;
}

/**
 * Retorna as especialidades médicas permitidas para a idade informada.
 */
export function obterEspecialidades(idade) {
  const faixa = obterFaixaEtaria(idade);
  if (!faixa) return [];
  return ESPECIALIDADES_POR_FAIXA[faixa] || [];
}

/**
 * Critério de prioridade adotado no projeto:
 * Pacientes com idade >= 60 anos (Idosos) possuem prioridade de atendimento.
 */
export function isPrioritario(idade) {
  if (idade === null || idade === undefined || idade === '') {
    return false;
  }
  const numIdade = typeof idade === 'string' ? Number(idade.trim()) : Number(idade);
  if (Number.isNaN(numIdade) || numIdade < 0) {
    return false;
  }
  return numIdade >= 60;
}

/**
 * Formata a senha com prefixo e zeros à esquerda (ex: P-001, N-002).
 */
export function formatarSenha(tipo, numero) {
  const prefixo = tipo === 'P' ? 'P' : 'N';
  const numFormatado = String(numero).padStart(3, '0');
  return `${prefixo}-${numFormatado}`;
}

/**
 * Validação dos campos de cadastro de paciente.
 */
export function validarCadastro({ nome, idade, sexo, especialidade }) {
  const erros = {};

  // Validação de nome
  if (!nome || typeof nome !== 'string' || nome.trim().length === 0) {
    erros.nome = 'Informe o nome do paciente';
  }

  // Validação de idade
  if (idade === null || idade === undefined || idade === '') {
    erros.idade = 'Informe a idade';
  } else {
    const numIdade = typeof idade === 'string' ? Number(idade.trim()) : Number(idade);
    if (Number.isNaN(numIdade) || !Number.isInteger(numIdade)) {
      erros.idade = 'A idade deve ser um número inteiro';
    } else if (numIdade < 0) {
      erros.idade = 'A idade não pode ser negativa';
    } else if (numIdade > 130) {
      erros.idade = 'Informe uma idade válida';
    }
  }

  // Validação de sexo
  if (!sexo || (sexo !== 'Masculino' && sexo !== 'Feminino')) {
    erros.sexo = 'Selecione o sexo';
  }

  // Validação de especialidade
  if (!especialidade) {
    erros.especialidade = 'Selecione a especialidade';
  } else {
    const especialidadesValidas = obterEspecialidades(idade);
    if (especialidadesValidas.length > 0 && !especialidadesValidas.includes(especialidade)) {
      erros.especialidade = 'Especialidade incompatível com a faixa etária';
    }
  }

  return {
    valido: Object.keys(erros).length === 0,
    erros,
  };
}

/**
 * Algoritmo da fila com prioridade:
 * 1. Primeiro prioritário da fila (FIFO entre prioritários).
 * 2. Se não houver prioritários, primeiro normal da fila (FIFO entre normais).
 */
export function proximoPacienteNaFila(fila = []) {
  if (!fila || fila.length === 0) {
    return { proximo: null, novaFila: [] };
  }

  // Busca o índice do primeiro paciente prioritário
  const indicePrioritario = fila.findIndex((paciente) => paciente.prioridade === true);

  if (indicePrioritario !== -1) {
    const proximo = fila[indicePrioritario];
    const novaFila = [
      ...fila.slice(0, indicePrioritario),
      ...fila.slice(indicePrioritario + 1),
    ];
    return { proximo, novaFila };
  }

  // Caso não haja prioritário, chama o primeiro da fila normal
  const proximo = fila[0];
  const novaFila = fila.slice(1);
  return { proximo, novaFila };
}
