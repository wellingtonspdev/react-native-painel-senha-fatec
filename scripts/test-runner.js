const assert = require('assert');
const {
  obterFaixaEtaria,
  obterEspecialidades,
  isPrioritario,
  formatarSenha,
  validarCadastro,
  proximoPacienteNaFila,
  FAIXA_ETARIA_NOMES,
} = require('../src/utils/regras');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`❌ FAIL: ${name}`);
    console.error(err);
    failed++;
  }
}

console.log('--- EXECUTANDO TESTES DE REGRAS DE NEGÓCIO ---');

// Matriz de Idades
test('0 anos deve ser Criança com Pediatria e Neuropediatria', () => {
  assert.strictEqual(obterFaixaEtaria(0), FAIXA_ETARIA_NOMES.CRIANCA);
  assert.deepStrictEqual(obterEspecialidades(0), ['Pediatria', 'Neuropediatria']);
});

test('12 anos deve ser Criança com Pediatria e Neuropediatria', () => {
  assert.strictEqual(obterFaixaEtaria(12), FAIXA_ETARIA_NOMES.CRIANCA);
  assert.deepStrictEqual(obterEspecialidades(12), ['Pediatria', 'Neuropediatria']);
});

test('13 anos deve ser Adolescente com Endocrinologia Pediátrica e Psiquiatria Infantil e Adolescente', () => {
  assert.strictEqual(obterFaixaEtaria(13), FAIXA_ETARIA_NOMES.ADOLESCENTE);
  assert.deepStrictEqual(obterEspecialidades(13), [
    'Endocrinologia Pediátrica',
    'Psiquiatria Infantil e Adolescente',
  ]);
});

test('18 anos deve ser Adolescente', () => {
  assert.strictEqual(obterFaixaEtaria(18), FAIXA_ETARIA_NOMES.ADOLESCENTE);
});

test('19 anos deve ser Adulto Jovem com Dermatologia e Ginecologia/Urologia', () => {
  assert.strictEqual(obterFaixaEtaria(19), FAIXA_ETARIA_NOMES.ADULTO_JOVEM);
  assert.deepStrictEqual(obterEspecialidades(19), ['Dermatologia', 'Ginecologia/Urologia']);
});

test('40 anos deve ser Adulto Jovem', () => {
  assert.strictEqual(obterFaixaEtaria(40), FAIXA_ETARIA_NOMES.ADULTO_JOVEM);
});

test('41 anos deve ser Meia-idade com Cardiologia e Ortopedia', () => {
  assert.strictEqual(obterFaixaEtaria(41), FAIXA_ETARIA_NOMES.MEIA_IDADE);
  assert.deepStrictEqual(obterEspecialidades(41), ['Cardiologia', 'Ortopedia']);
});

test('59 anos deve ser Meia-idade', () => {
  assert.strictEqual(obterFaixaEtaria(59), FAIXA_ETARIA_NOMES.MEIA_IDADE);
});

test('60 anos deve ser Idoso com Geriatria e Oftalmologia', () => {
  assert.strictEqual(obterFaixaEtaria(60), FAIXA_ETARIA_NOMES.IDOSO);
  assert.deepStrictEqual(obterEspecialidades(60), ['Geriatria', 'Oftalmologia']);
});

test('61 anos deve ser Idoso', () => {
  assert.strictEqual(obterFaixaEtaria(61), FAIXA_ETARIA_NOMES.IDOSO);
});

// Prioridade
test('isPrioritario deve retornar true apenas para >= 60', () => {
  assert.strictEqual(isPrioritario(0), false);
  assert.strictEqual(isPrioritario(12), false);
  assert.strictEqual(isPrioritario(18), false);
  assert.strictEqual(isPrioritario(40), false);
  assert.strictEqual(isPrioritario(59), false);
  assert.strictEqual(isPrioritario(60), true);
  assert.strictEqual(isPrioritario(61), true);
  assert.strictEqual(isPrioritario(90), true);
});

// Senha
test('formatarSenha deve formatar com prefixo e 3 dígitos', () => {
  assert.strictEqual(formatarSenha('N', 1), 'N-001');
  assert.strictEqual(formatarSenha('N', 25), 'N-025');
  assert.strictEqual(formatarSenha('P', 2), 'P-002');
  assert.strictEqual(formatarSenha('P', 105), 'P-105');
});

// Validação
test('validarCadastro deve invalidar dados incorretos ou incompletos', () => {
  assert.strictEqual(validarCadastro({ nome: '', idade: '20', sexo: 'Masculino', especialidade: 'Dermatologia' }).valido, false);
  assert.strictEqual(validarCadastro({ nome: 'Ana', idade: '', sexo: 'Feminino', especialidade: 'Pediatria' }).valido, false);
  assert.strictEqual(validarCadastro({ nome: 'Ana', idade: 'abc', sexo: 'Feminino', especialidade: 'Pediatria' }).valido, false);
  assert.strictEqual(validarCadastro({ nome: 'Ana', idade: '-5', sexo: 'Feminino', especialidade: 'Pediatria' }).valido, false);
  assert.strictEqual(validarCadastro({ nome: 'Ana', idade: '20', sexo: '', especialidade: 'Dermatologia' }).valido, false);
  assert.strictEqual(validarCadastro({ nome: 'Ana', idade: '20', sexo: 'Feminino', especialidade: '' }).valido, false);
});

test('validarCadastro deve aprovar dados corretos', () => {
  const res = validarCadastro({
    nome: 'Maria Silva',
    idade: '65',
    sexo: 'Feminino',
    especialidade: 'Geriatria',
  });
  assert.strictEqual(res.valido, true);
  assert.strictEqual(Object.keys(res.erros).length, 0);
});

// Cenário do Enunciado de Prioridade
test('Algoritmo de fila deve processar N-001, N-002, P-001, N-003, P-002 na ordem correta', () => {
  const filaInicial = [
    { id: '1', senha: 'N-001', prioridade: false, nome: 'Normal 1' },
    { id: '2', senha: 'N-002', prioridade: false, nome: 'Normal 2' },
    { id: '3', senha: 'P-001', prioridade: true, nome: 'Prioritário 1' },
    { id: '4', senha: 'N-003', prioridade: false, nome: 'Normal 3' },
    { id: '5', senha: 'P-002', prioridade: true, nome: 'Prioritário 2' },
  ];

  const ordemChamada = [];
  let filaAtual = filaInicial;

  while (filaAtual.length > 0) {
    const { proximo, novaFila } = proximoPacienteNaFila(filaAtual);
    ordemChamada.push(proximo.senha);
    filaAtual = novaFila;
  }

  assert.deepStrictEqual(ordemChamada, [
    'P-001',
    'P-002',
    'N-001',
    'N-002',
    'N-003',
  ]);
});

console.log(`\n--- RESULTADO: ${passed} PASSOU / ${failed} FALHOU ---`);
if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
