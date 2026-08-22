import React, { useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Badge from './Badge';
import {
  colors,
  radius,
  shadows,
  spacing,
  typography,
} from '../theme/theme';
import {
  isPrioritario,
  obterEspecialidades,
  obterFaixaEtaria,
  validarCadastro,
} from '../utils/regras';

export default function Cadastro({ onGerarSenha }) {
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [sexo, setSexo] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [erros, setErros] = useState({});
  const [focusedInput, setFocusedInput] = useState(null);

  const [buttonScale] = useState(new Animated.Value(1));

  const faixaEtaria = obterFaixaEtaria(idade);
  const especialidadesDisponiveis = obterEspecialidades(idade);
  const ehPrioritario = isPrioritario(idade);

  const handleIdadeChange = (texto) => {
    // Permite apenas dígitos
    const textoLimpo = texto.replace(/[^0-9]/g, '');
    setIdade(textoLimpo);
    // Limpa a especialidade selecionada se a nova faixa não a contiver
    const novasEspecialidades = obterEspecialidades(textoLimpo);
    if (!novasEspecialidades.includes(especialidade)) {
      setEspecialidade('');
    }
    if (erros.idade) {
      setErros((prev) => ({ ...prev, idade: undefined }));
    }
  };

  const handleNomeChange = (texto) => {
    setNome(texto);
    if (erros.nome) {
      setErros((prev) => ({ ...prev, nome: undefined }));
    }
  };

  const handleSexoSelect = (opcao) => {
    setSexo(opcao);
    if (erros.sexo) {
      setErros((prev) => ({ ...prev, sexo: undefined }));
    }
  };

  const handleEspecialidadeSelect = (esp) => {
    setEspecialidade(esp);
    if (erros.especialidade) {
      setErros((prev) => ({ ...prev, especialidade: undefined }));
    }
  };

  const onPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleSubmit = () => {
    const validacao = validarCadastro({
      nome,
      idade,
      sexo,
      especialidade,
    });

    if (!validacao.valido) {
      setErros(validacao.erros);
      return;
    }

    setErros({});

    onGerarSenha({
      nome: nome.trim(),
      idade: parseInt(idade, 10),
      sexo,
      faixaEtaria,
      especialidade,
      prioridade: ehPrioritario,
    });

    // Limpa os campos após o cadastro com sucesso
    setNome('');
    setIdade('');
    setSexo('');
    setEspecialidade('');
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerIndicator} />
        <Text style={styles.cardTitle}>Cadastro do Paciente</Text>
      </View>

      {/* CAMPO NOME */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Nome Completo</Text>
        <TextInput
          style={[
            styles.input,
            focusedInput === 'nome' && styles.inputFocused,
            erros.nome && styles.inputError,
          ]}
          placeholder="Ex: Wellington Silva"
          placeholderTextColor={colors.textMuted}
          value={nome}
          onChangeText={handleNomeChange}
          onFocus={() => setFocusedInput('nome')}
          onBlur={() => setFocusedInput(null)}
          autoCapitalize="words"
        />
        {erros.nome ? <Text style={styles.errorText}>{erros.nome}</Text> : null}
      </View>

      {/* CAMPO IDADE */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Idade</Text>
        <TextInput
          style={[
            styles.input,
            focusedInput === 'idade' && styles.inputFocused,
            erros.idade && styles.inputError,
          ]}
          placeholder="Ex: 28"
          placeholderTextColor={colors.textMuted}
          value={idade}
          onChangeText={handleIdadeChange}
          onFocus={() => setFocusedInput('idade')}
          onBlur={() => setFocusedInput(null)}
          keyboardType="numeric"
          maxLength={3}
        />
        {erros.idade ? <Text style={styles.errorText}>{erros.idade}</Text> : null}
      </View>

      {/* IDENTIFICAÇÃO DA FAIXA ETÁRIA E PRIORIDADE */}
      {faixaEtaria ? (
        <View style={styles.faixaPreviewContainer}>
          <Text style={styles.sublabel}>Faixa Etária Identificada:</Text>
          <View style={styles.badgesRow}>
            <Badge label={faixaEtaria} variant="primary" />
            {ehPrioritario ? (
              <Badge label="Prioritário (60+)" variant="amber" />
            ) : (
              <Badge label="Atendimento Normal" variant="neutral" />
            )}
          </View>
        </View>
      ) : null}

      {/* CAMPO SEXO */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Sexo</Text>
        <View style={styles.chipsRow}>
          {['Masculino', 'Feminino'].map((opcao) => {
            const isSelected = sexo === opcao;
            return (
              <Pressable
                key={opcao}
                onPress={() => handleSexoSelect(opcao)}
                style={[
                  styles.chip,
                  isSelected && styles.chipSelected,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    isSelected && styles.chipTextSelected,
                  ]}
                >
                  {opcao}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {erros.sexo ? <Text style={styles.errorText}>{erros.sexo}</Text> : null}
      </View>

      {/* CAMPO ESPECIALIDADE */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Especialidade Médica</Text>
        {especialidadesDisponiveis.length > 0 ? (
          <View style={styles.chipsRow}>
            {especialidadesDisponiveis.map((esp) => {
              const isSelected = especialidade === esp;
              return (
                <Pressable
                  key={esp}
                  onPress={() => handleEspecialidadeSelect(esp)}
                  style={[
                    styles.chipSpecialty,
                    isSelected && styles.chipSpecialtySelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipSpecialtyText,
                      isSelected && styles.chipSpecialtyTextSelected,
                    ]}
                  >
                    {esp}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptySpecialtyBox}>
            <Text style={styles.emptySpecialtyText}>
              Digite uma idade válida acima para listar as especialidades.
            </Text>
          </View>
        )}
        {erros.especialidade ? (
          <Text style={styles.errorText}>{erros.especialidade}</Text>
        ) : null}
      </View>

      {/* BOTÃO GERAR SENHA */}
      <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
        <Pressable
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={handleSubmit}
          style={styles.buttonWrapper}
        >
          <View style={styles.primaryButton}>
            <Text style={styles.buttonText}>GERAR SENHA</Text>
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundCard,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerIndicator: {
    width: 4,
    height: 18,
    borderRadius: radius.full,
    backgroundColor: colors.accentStart,
    marginRight: spacing.sm,
  },
  cardTitle: {
    ...typography.cardTitle,
  },
  fieldGroup: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.label,
    marginBottom: spacing.xs,
  },
  sublabel: {
    ...typography.bodySecondary,
    fontSize: 12,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    color: colors.textPrimary,
    fontSize: 15,
  },
  inputFocused: {
    borderColor: colors.inputBorderFocus,
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
  },
  inputError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerBg,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  faixaPreviewContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 2,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.md,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    minWidth: 100,
    alignItems: 'center',
  },
  chipSelected: {
    backgroundColor: colors.purpleBg,
    borderColor: colors.accentStart,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  chipSpecialty: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.md,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    marginBottom: 6,
  },
  chipSpecialtySelected: {
    backgroundColor: colors.cyanBg,
    borderColor: colors.cyan,
  },
  chipSpecialtyText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  chipSpecialtyTextSelected: {
    color: colors.cyan,
    fontWeight: '700',
  },
  emptySpecialtyBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderStyle: 'dashed',
  },
  emptySpecialtyText: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
  },
  buttonWrapper: {
    borderRadius: radius.md,
    overflow: 'hidden',
    marginTop: spacing.sm,
    ...shadows.glowPurple,
  },
  primaryButton: {
    backgroundColor: colors.accentStart,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  buttonText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
