import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Cadastro from './src/components/Cadastro';
import Chamada from './src/components/Chamada';
import FilaEspera from './src/components/FilaEspera';
import GerarSenha from './src/components/GerarSenha';
import { colors, radius, spacing, typography } from './src/theme/theme';
import { formatarSenha, proximoPacienteNaFila } from './src/utils/regras';

export default function App() {
  const [fila, setFila] = useState([]);
  const [pacienteAtual, setPacienteAtual] = useState(null);
  const [ultimaSenhaGerada, setUltimaSenhaGerada] = useState(null);
  const [contadorNormal, setContadorNormal] = useState(0);
  const [contadorPrioritario, setContadorPrioritario] = useState(0);
  const [totalCadastrados, setTotalCadastrados] = useState(0);

  const handleCadastrarEGerarSenha = (dados) => {
    let novaSenha;
    let novoContadorNormal = contadorNormal;
    let novoContadorPrioritario = contadorPrioritario;

    if (dados.prioridade) {
      novoContadorPrioritario += 1;
      novaSenha = formatarSenha('P', novoContadorPrioritario);
      setContadorPrioritario(novoContadorPrioritario);
    } else {
      novoContadorNormal += 1;
      novaSenha = formatarSenha('N', novoContadorNormal);
      setContadorNormal(novoContadorNormal);
    }

    const proximaOrdem = totalCadastrados + 1;
    setTotalCadastrados(proximaOrdem);

    const novoPaciente = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      nome: dados.nome,
      idade: dados.idade,
      sexo: dados.sexo,
      faixaEtaria: dados.faixaEtaria,
      especialidade: dados.especialidade,
      prioridade: dados.prioridade,
      senha: novaSenha,
      ordemChegada: proximaOrdem,
    };

    setFila((prevFila) => [...prevFila, novoPaciente]);
    setUltimaSenhaGerada(novoPaciente);
  };

  const handleChamarProximo = () => {
    const { proximo, novaFila } = proximoPacienteNaFila(fila);
    if (proximo) {
      setPacienteAtual(proximo);
      setFila(novaFila);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* AMBIENT GLOW EFFECTS (BACKGROUND LEVE SEM BLOQUEAR INTERAÇÃO) */}
      <View pointerEvents="none" style={styles.glowBackground}>
        <View style={[styles.glowBlob, styles.glowBlobTopLeft]} />
        <View style={[styles.glowBlob, styles.glowBlobBottomRight]} />
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* HEADER DA APLICAÇÃO */}
          <View style={styles.header}>
            <View style={styles.headerBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.headerBadgeText}>SISTEMA DE ATENDIMENTO</Text>
            </View>
            <Text style={styles.title}>PAINEL SAÚDE</Text>
            <Text style={styles.subtitle}>
              Gestão de atendimento hospitalar e triagem por prioridade
            </Text>
          </View>

          {/* 1. COMPONENTE DE CADASTRO */}
          <Cadastro onGerarSenha={handleCadastrarEGerarSenha} />

          {/* 2. COMPONENTE DE SENHA RECÉM-GERADA */}
          {ultimaSenhaGerada && <GerarSenha paciente={ultimaSenhaGerada} />}

          {/* 3. COMPONENTE DE CHAMADA ATUAL */}
          <Chamada
            pacienteAtual={pacienteAtual}
            onChamarProximo={handleChamarProximo}
            filaVazia={fila.length === 0}
          />

          {/* 4. COMPONENTE DE FILA DE ESPERA */}
          <FilaEspera fila={fila} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  glowBackground: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  glowBlob: {
    position: 'absolute',
    borderRadius: 200,
    opacity: 0.15,
  },
  glowBlobTopLeft: {
    top: -60,
    left: -60,
    width: 260,
    height: 260,
    backgroundColor: colors.accentStart,
  },
  glowBlobBottomRight: {
    bottom: 100,
    right: -80,
    width: 300,
    height: 300,
    backgroundColor: colors.cyan,
  },
  header: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    marginBottom: spacing.xs,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginRight: 6,
  },
  headerBadgeText: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  title: {
    ...typography.titleMain,
    fontSize: 28,
    marginTop: 4,
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.subtitleMain,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
});
