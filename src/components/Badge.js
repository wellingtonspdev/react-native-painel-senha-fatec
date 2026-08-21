import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, typography } from '../theme/theme';

export default function Badge({ label, variant = 'neutral', style }) {
  const getBadgeStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.purpleBg,
          borderColor: colors.purpleBorder,
          textColor: colors.accentStart,
        };
      case 'cyan':
        return {
          backgroundColor: colors.cyanBg,
          borderColor: colors.cyanBorder,
          textColor: colors.cyan,
        };
      case 'amber':
        return {
          backgroundColor: colors.amberBg,
          borderColor: colors.amberBorder,
          textColor: colors.amber,
        };
      case 'success':
        return {
          backgroundColor: colors.successBg,
          borderColor: colors.successBorder,
          textColor: colors.success,
        };
      case 'danger':
        return {
          backgroundColor: colors.dangerBg,
          borderColor: colors.dangerBorder,
          textColor: colors.danger,
        };
      case 'neutral':
      default:
        return {
          backgroundColor: colors.grayBg,
          borderColor: colors.grayBorder,
          textColor: colors.textSecondary,
        };
    }
  };

  const current = getBadgeStyle();

  return (
    <View style={[styles.badge, { backgroundColor: current.backgroundColor, borderColor: current.borderColor }, style]}>
      <Text style={[styles.text, { color: current.textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
    marginRight: 6,
    marginBottom: 4,
  },
  text: {
    ...typography.badgeText,
  },
});
