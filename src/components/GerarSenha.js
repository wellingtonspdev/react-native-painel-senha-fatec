import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Badge from './Badge';
import { colors, radius, shadows, spacing, typography } from '../theme/theme';

export default function GerarSenha({ paciente }) {
  const animOpacity = useRef(new Animated.Value(0)).current;
  const animScale = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    if (paciente) {
      animOpacity.setValue(0);
      animScale.setValue(0.92);
      Animated.parallel([
        Animated.timing(animOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(animScale, {
          toValue: 1,
          friction: 6,
          tension: 50,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [paciente]);

  if (!paciente) {
    return null;
  }

  const isPrioritario = paciente.prioridade;
  const ticketColor = isPrioritario ? colors.amber : colors.cyan;

  return (
    <Animated.View
      style={[
        styles.card,
        isPrioritario && styles.cardPrioritario,
        {
          opacity: animOpacity,
          transform: [{ scale: animScale }],
        },
      ]}
    >
      <View style={styles.headerRow}>
        <View
          style={[
            styles.indicator,
            { backgroundColor: isPrioritario ? colors.amber : colors.cyan },
          ]}
        />
        <Text style={styles.cardTitle}>Senha Recém-Gerada</Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.ticketNumber, { color: ticketColor }]}>
          {paciente.senha}
        </Text>

        <Text style={styles.patientName}>{paciente.nome}</Text>
        <Text style={styles.specialtyText}>{paciente.especialidade}</Text>

        <View style={styles.badgesRow}>
          <Badge
            label={paciente.faixaEtaria}
            variant="primary"
          />
          {isPrioritario ? (
            <Badge label="PRIORITÁRIO" variant="amber" />
          ) : (
            <Badge label="NORMAL" variant="neutral" />
          )}
          <Badge label={`Sexo: ${paciente.sexo}`} variant="neutral" />
        </View>
      </View>
    </Animated.View>
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
  cardPrioritario: {
    borderColor: colors.amberBorder,
    backgroundColor: 'rgba(30, 41, 59, 0.75)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  indicator: {
    width: 4,
    height: 18,
    borderRadius: radius.full,
    marginRight: spacing.sm,
  },
  cardTitle: {
    ...typography.cardTitle,
  },
  content: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  ticketNumber: {
    ...typography.ticketLarge,
    fontSize: 44,
    marginVertical: spacing.xs,
  },
  patientName: {
    ...typography.titleMain,
    fontSize: 20,
    marginBottom: 2,
    textAlign: 'center',
  },
  specialtyText: {
    ...typography.bodySecondary,
    color: colors.cyan,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});
