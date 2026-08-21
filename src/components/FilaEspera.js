import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Badge from './Badge';
import { colors, radius, shadows, spacing, typography } from '../theme/theme';

export default function FilaEspera({ fila }) {
  const totalPacientes = fila.length;
  const totalPrioritarios = fila.filter((p) => p.prioridade).length;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIndicator} />
          <Text style={styles.cardTitle}>Fila de Espera</Text>
        </View>
        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>
            {totalPacientes} {totalPacientes === 1 ? 'paciente' : 'pacientes'}
          </Text>
        </View>
      </View>

      {totalPrioritarios > 0 && (
        <View style={styles.priorityAlert}>
          <Text style={styles.priorityAlertText}>
            ⭐ {totalPrioritarios} {totalPrioritarios === 1 ? 'paciente prioritário' : 'pacientes prioritários'} na fila
          </Text>
        </View>
      )}

      {totalPacientes > 0 ? (
        <View style={styles.listContainer}>
          {fila.map((paciente, index) => {
            const isPrioritario = paciente.prioridade;
            return (
              <View
                key={paciente.id}
                style={[
                  styles.patientItem,
                  isPrioritario && styles.patientItemPrioritario,
                  index === totalPacientes - 1 && styles.patientItemLast,
                ]}
              >
                <View style={styles.ticketCol}>
                  <Text
                    style={[
                      styles.ticketCode,
                      { color: isPrioritario ? colors.amber : colors.cyan },
                    ]}
                  >
                    {paciente.senha}
                  </Text>
                  <Text style={styles.orderText}>#{paciente.ordemChegada}</Text>
                </View>

                <View style={styles.infoCol}>
                  <Text style={styles.patientName} numberOfLines={1} ellipsizeMode="tail">
                    {paciente.nome}
                  </Text>
                  <Text style={styles.patientSub} numberOfLines={1} ellipsizeMode="tail">
                    {paciente.especialidade}
                  </Text>
                  <View style={styles.badgesRow}>
                    <Badge label={paciente.faixaEtaria} variant="primary" />
                    {isPrioritario ? (
                      <Badge label="PRIORITÁRIO" variant="amber" />
                    ) : (
                      <Badge label="NORMAL" variant="neutral" />
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Nenhum paciente aguardando</Text>
          <Text style={styles.emptySubtitle}>
            A fila está vazia no momento. Novos pacientes cadastrados aparecerão aqui.
          </Text>
        </View>
      )}
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
    marginBottom: spacing.xxl,
    ...shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIndicator: {
    width: 4,
    height: 18,
    borderRadius: radius.full,
    backgroundColor: colors.cyan,
    marginRight: spacing.sm,
  },
  cardTitle: {
    ...typography.cardTitle,
  },
  counterBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  counterText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  priorityAlert: {
    backgroundColor: colors.amberBg,
    borderWidth: 1,
    borderColor: colors.amberBorder,
    borderRadius: radius.md,
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  priorityAlertText: {
    color: colors.amber,
    fontSize: 12,
    fontWeight: '700',
  },
  listContainer: {
    gap: 8,
  },
  patientItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
  },
  patientItemPrioritario: {
    backgroundColor: 'rgba(252, 211, 77, 0.06)',
    borderColor: colors.amberBorder,
  },
  patientItemLast: {
    marginBottom: 0,
  },
  ticketCol: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: spacing.md,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.08)',
    minWidth: 72,
  },
  ticketCode: {
    ...typography.ticketMedium,
    fontSize: 20,
    lineHeight: 24,
  },
  orderText: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  infoCol: {
    flex: 1,
    paddingLeft: spacing.md,
  },
  patientName: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  patientSub: {
    color: colors.cyan,
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 6,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emptyContainer: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  emptyTitle: {
    ...typography.cardTitle,
    color: colors.textSecondary,
    fontSize: 15,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    ...typography.bodySecondary,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
});
