const {
  obterFaixaEtaria,
  obterEspecialidades,
  isPrioritario,
  formatarSenha,
  validarCadastro,
  proximoPacienteNaFila,
  FAIXA_ETARIA_NOMES,
} = require('../src/utils/regras');

describe('Regras de Faixa Etária e Especialidades', () => {
  test('0 e 12 anos devem ser Criança com Pediatria e Neuropediatria', () => {
    expect(obterFaixaEtaria(0)).toBe(FAIXA_ETARIA_NOMES.CRIANCA);
    expect(obterFaixaEtaria(12)).toBe(FAIXA_ETARIA_NOMES.CRIANCA);
    expect(obterEspecialidades(0)).toEqual(['Pediatria', 'Neuropediatria']);
    expect(obterEspecialidades(12)).toEqual(['Pediatria', 'Neuropediatria']);
  });

  test('13 e 18 anos devem ser Adolescente com Endocrinologia Pediátrica e Psiquiatria Infantil e Adolescente', () => {
    expect(obterFaixaEtaria(13)).toBe(FAIXA_ETARIA_NOMES.ADOLESCENTE);
    expect(obterFaixaEtaria(18)).toBe(FAIXA_ETARIA_NOMES.ADOLESCENTE);
    expect(obterEspecialidades(13)).toEqual([
      'Endocrinologia Pediátrica',
      'Psiquiatria Infantil e Adolescente',
    ]);
    expect(obterEspecialidades(18)).toEqual([
      'Endocrinologia Pediátrica',
      'Psiquiatria Infantil e Adolescente',
    ]);
  });

  test('19 e 40 anos devem ser Adulto Jovem com Dermatologia e Ginecologia/Urologia', () => {
    expect(obterFaixaEtaria(19)).toBe(FAIXA_ETARIA_NOMES.ADULTO_JOVEM);
    expect(obterFaixaEtaria(40)).toBe(FAIXA_ETARIA_NOMES.ADULTO_JOVEM);
    expect(obterEspecialidades(19)).toEqual(['Dermatologia', 'Ginecologia/Urologia']);
    expect(obterEspecialidades(40)).toEqual(['Dermatologia', 'Ginecologia/Urologia']);
  });

  test('41 e 59 anos devem ser Meia-idade com Cardiologia e Ortopedia', () => {
    expect(obterFaixaEtaria(41)).toBe(FAIXA_ETARIA_NOMES.MEIA_IDADE);
    expect(obterFaixaEtaria(59)).toBe(FAIXA_ETARIA_NOMES.MEIA_IDADE);
    expect(obterEspecialidades(41)).toEqual(['Cardiologia', 'Ortopedia']);
    expect(obterEspecialidades(59)).toEqual(['Cardiologia', 'Ortopedia']);
  });

  test('60 e 61 anos devem ser Idoso com Geriatria e Oftalmologia', () => {
    expect(obterFaixaEtaria(60)).toBe(FAIXA_ETARIA_NOMES.IDOSO);
    expect(obterFaixaEtaria(61)).toBe(FAIXA_ETARIA_NOMES.IDOSO);
    expect(obterEspecialidades(60)).toEqual(['Geriatria', 'Oftalmologia']);
    expect(obterEspecialidades(61)).toEqual(['Geriatria', 'Oftalmologia']);
  });

  test('Idades inválidas ou vazias devem retornar null / array vazio', () => {
    expect(obterFaixaEtaria(-1)).toBeNull();
    expect(obterFaixaEtaria('abc')).toBeNull();
    expect(obterFaixaEtaria('')).toBeNull();
    expect(obterFaixaEtaria(null)).toBeNull();
    expect(obterEspecialidades('invalido')).toEqual([]);
  });
});

describe('Critério de Prioridade', () => {
  test('Menores de 60 anos não devem ter prioridade', () => {
    expect(isPrioritario(0)).toBe(false);
    expect(isPrioritario(12)).toBe(false);
    expect(isPrioritario(18)).toBe(false);
    expect(isPrioritario(40)).toBe(false);
    expect(isPrioritario(59)).toBe(false);
  });

  test('A partir de 60 anos deve ter prioridade (Idoso)', () => {
    expect(isPrioritario(60)).toBe(true);
    expect(isPrioritario(61)).toBe(true);
    expect(isPrioritario(85)).toBe(true);
  });

  test('Valores inválidos não devem ser prioritários', () => {
    expect(isPrioritario(-5)).toBe(false);
    expect(isPrioritario('xyz')).toBe(false);
    expect(isPrioritario('')).toBe(false);
  });
});

describe('Formatação de Senha', () => {
  test('Deve formatar senhas normais e prioritárias com 3 dígitos', () => {
    expect(formatarSenha('N', 1)).toBe('N-001');
    expect(formatarSenha('N', 42)).toBe('N-042');
    expect(formatarSenha('P', 3)).toBe('P-003');
    expect(formatarSenha('P', 100)).toBe('P-100');
  });
});

describe('Validação de Cadastro', () => {
  test('Deve rejeitar campos obrigatórios vazios ou inválidos', () => {
    // Nome vazio
    const res1 = validarCadastro({
      nome: '',
      idade: '25',
      sexo: 'Masculino',
      especialidade: 'Dermatologia',
    });
    expect(res1.valido).toBe(false);
    expect(res1.erros.nome).toBeDefined();

    // Idade vazia
    const res2 = validarCadastro({
      nome: 'Carlos',
      idade: '',
      sexo: 'Masculino',
      especialidade: 'Dermatologia',
    });
    expect(res2.valido).toBe(false);
    expect(res2.erros.idade).toBeDefined();

    // Idade texto
    const res3 = validarCadastro({
      nome: 'Carlos',
      idade: 'abc',
      sexo: 'Masculino',
      especialidade: 'Dermatologia',
    });
    expect(res3.valido).toBe(false);
    expect(res3.erros.idade).toBeDefined();

    // Idade negativa
    const res4 = validarCadastro({
      nome: 'Carlos',
      idade: '-1',
      sexo: 'Masculino',
      especialidade: 'Dermatologia',
    });
    expect(res4.valido).toBe(false);
    expect(res4.erros.idade).toBeDefined();

    // Sexo ausente
    const res5 = validarCadastro({
      nome: 'Carlos',
      idade: '25',
      sexo: '',
      especialidade: 'Dermatologia',
    });
    expect(res5.valido).toBe(false);
    expect(res5.erros.sexo).toBeDefined();

    // Especialidade ausente
    const res6 = validarCadastro({
      nome: 'Carlos',
      idade: '25',
      sexo: 'Masculino',
      especialidade: '',
    });
    expect(res6.valido).toBe(false);
    expect(res6.erros.especialidade).toBeDefined();
  });

  test('Deve aceitar cadastro com dados válidos', () => {
    const res = validarCadastro({
      nome: 'Wellington Silva',
      idade: '30',
      sexo: 'Masculino',
      especialidade: 'Dermatologia',
    });
    expect(res.valido).toBe(true);
    expect(Object.keys(res.erros).length).toBe(0);
  });
});

describe('Algoritmo da Fila de Atendimento (Prioridade FIFO)', () => {
  test('Deve priorizar chamadas P-001, P-002, N-001, N-002, N-003 para a sequência de entrada', () => {
    const filaInicial = [
      { id: '1', senha: 'N-001', prioridade: false, nome: 'Normal 1' },
      { id: '2', senha: 'N-002', prioridade: false, nome: 'Normal 2' },
      { id: '3', senha: 'P-001', prioridade: true, nome: 'Prioritário 1' },
      { id: '4', senha: 'N-003', prioridade: false, nome: 'Normal 3' },
      { id: '5', senha: 'P-002', prioridade: true, nome: 'Prioritário 2' },
    ];

    // 1ª Chamada: deve ser P-001
    const call1 = proximoPacienteNaFila(filaInicial);
    expect(call1.proximo.senha).toBe('P-001');
    expect(call1.novaFila.map((p) => p.senha)).toEqual(['N-001', 'N-002', 'N-003', 'P-002']);

    // 2ª Chamada: deve ser P-002
    const call2 = proximoPacienteNaFila(call1.novaFila);
    expect(call2.proximo.senha).toBe('P-002');
    expect(call2.novaFila.map((p) => p.senha)).toEqual(['N-001', 'N-002', 'N-003']);

    // 3ª Chamada: deve ser N-001
    const call3 = proximoPacienteNaFila(call2.novaFila);
    expect(call3.proximo.senha).toBe('N-001');
    expect(call3.novaFila.map((p) => p.senha)).toEqual(['N-002', 'N-003']);

    // 4ª Chamada: deve ser N-002
    const call4 = proximoPacienteNaFila(call3.novaFila);
    expect(call4.proximo.senha).toBe('N-002');
    expect(call4.novaFila.map((p) => p.senha)).toEqual(['N-003']);

    // 5ª Chamada: deve ser N-003
    const call5 = proximoPacienteNaFila(call4.novaFila);
    expect(call5.proximo.senha).toBe('N-003');
    expect(call5.novaFila).toEqual([]);

    // 6ª Chamada (fila vazia): deve retornar proximo null e fila vazia
    const call6 = proximoPacienteNaFila(call5.novaFila);
    expect(call6.proximo).toBeNull();
    expect(call6.novaFila).toEqual([]);
  });
});
