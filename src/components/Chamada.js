import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
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

export default function Chamada({ pacienteAtual, onChamarProximo, filaVazia }) {
  const animOpacity = useRef(new Animated.Value(1)).current;
  const animScale = useRef(new Animated.Value(1)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (pacienteAtual) {
      animOpacity.setValue(0);
      animScale.setValue(0.9);
      Animated.parallel([
        Animated.timing(animOpacity, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.spring(animScale, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [pacienteAtual]);

  const onPressIn = () => {
    if (filaVazia) return;
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

  const isPrioritario = pacienteAtual?.prioridade;
  const ticketColor = isPrioritario ? colors.amber : colors.textPrimary;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.headerIndicator,
            { backgroundColor: isPrioritario ? colors.amber : colors.accentStart },
          ]}
        />
        <Text style={styles.cardTitle}>Chamada Atual</Text>
      </View>

      {pacienteAtual ? (
        <Animated.View
          style={[
            styles.calledContent,
            {
              opacity: animOpacity,
              transform: [{ scale: animScale }],
            },
          ]}
        >
          <View style={styles.ticketContainer}>
            <Text style={[styles.ticketNumber, { color: ticketColor }]}>
              {pacienteAtual.senha}
            </Text>
          </View>

          <Text style={styles.patientName}>{pacienteAtual.nome}</Text>
          <Text style={styles.ageInfo}>
            {pacienteAtual.idade} anos • {pacienteAtual.sexo}
          </Text>

          <View style={styles.badgesRow}>
            <Badge label={pacienteAtual.especialidade} variant="cyan" />
            <Badge label={pacienteAtual.faixaEtaria} variant="primary" />
            {isPrioritario && (
              <Badge label="PRIORITÁRIO" variant="amber" />
            )}
          </View>
        </Animated.View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>Nenhum paciente chamado</Text>
          <Text style={styles.emptyStateSubtitle}>
            Gere senhas e utilize o botão abaixo para chamar o próximo da fila.
          </Text>
        </View>
      )}

      {/* BOTÃO CHAMAR PRÓXIMO */}
      <Animated.View
        style={[
          styles.buttonContainer,
          { transform: [{ scale: buttonScale }] },
        ]}
      >
        <Pressable
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={onChamarProximo}
          disabled={filaVazia}
          style={[styles.buttonWrapper, filaVazia && styles.buttonDisabled]}
        >
          <View
            style={[
              styles.primaryButton,
              filaVazia && styles.primaryButtonDisabled,
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                filaVazia && styles.buttonTextDisabled,
              ]}
            >
              {filaVazia ? 'FILA VAZIA' : 'CHAMAR PRÓXIMO'}
            </Text>
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
    marginRight: spacing.sm,
  },
  cardTitle: {
    ...typography.cardTitle,
  },
  calledContent: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  ticketContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: radius.xl,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: spacing.sm,
  },
  ticketNumber: {
    ...typography.ticketLarge,
    textAlign: 'center',
  },
  patientName: {
    ...typography.titleMain,
    fontSize: 24,
    marginBottom: 2,
    textAlign: 'center',
  },
  ageInfo: {
    ...typography.bodySecondary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  emptyState: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateTitle: {
    ...typography.cardTitle,
    color: colors.textSecondary,
    fontSize: 16,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    ...typography.bodySecondary,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  buttonContainer: {
    marginTop: spacing.md,
  },
  buttonWrapper: {
    borderRadius: radius.md,
    overflow: 'hidden',
    ...shadows.glowPurple,
  },
  buttonDisabled: {
    opacity: 0.6,
    elevation: 0,
    shadowOpacity: 0,
  },
  primaryButton: {
    backgroundColor: colors.accentStart,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  primaryButtonDisabled: {
    backgroundColor: '#334155',
  },
  buttonText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
  },
  buttonTextDisabled: {
    color: colors.textMuted,
  },
});
