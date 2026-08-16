import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import { router } from 'expo-router';
import { AnimatedCard } from '../components/AnimatedCard';
import emergenciesData from '../data/emergencies.json';

const AllEmergenciesScreen = () => {
  const { t, language } = useLanguage();

  const emergencyIcons: Record<string, { name: string; set: string; color: string; bg: string }> = {
    bleeding: { name: 'tint', set: 'FontAwesome5', color: '#DC2626', bg: '#FEE2E2' },
    burns: { name: 'fire', set: 'FontAwesome5', color: '#EA580C', bg: '#FFEDD5' },
    choking: { name: 'wind', set: 'FontAwesome5', color: '#0284C7', bg: '#E0F2FE' },
    fracture: { name: 'bone', set: 'FontAwesome5', color: '#7C3AED', bg: '#F3E8FF' },
    shock: { name: 'bolt', set: 'FontAwesome5', color: '#D97706', bg: '#FEF3C7' },
    heart_attack: { name: 'heart', set: 'FontAwesome5', color: '#E11D48', bg: '#FFE4E6' },
    cpr: { name: 'heart-pulse', set: 'MaterialCommunityIcons', color: '#0D9488', bg: '#CCFBF1' },
    snake_bite: { name: 'snake', set: 'MaterialCommunityIcons', color: '#16A34A', bg: '#DCFCE7' }
  };

  const handleEmergencyPress = (id: string) => {
    if (id === 'cpr') {
      router.push('/cpr-selection');
    } else {
      router.push(`/emergency-guide?id=${id}`);
    }
  };

  const getEmergencyTitle = (emergency: any) => {
    if (emergency.title && typeof emergency.title === 'object') {
      return emergency.title[language] || emergency.title.en;
    }
    return emergency.title || '';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <AnimatedCard onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </AnimatedCard>
        <Text style={styles.headerTitle}>{t.emergencies.title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>{t.emergencies.selectEmergency}</Text>
        
        <View style={styles.emergenciesGrid}>
          {emergenciesData.emergencies.map((emergency: any) => {
            const config = emergencyIcons[emergency.id] || { name: 'alert-circle', set: 'Ionicons', color: '#DC2626', bg: '#FEE2E2' };
            return (
              <AnimatedCard
                key={emergency.id}
                style={styles.emergencyCard}
                onPress={() => handleEmergencyPress(emergency.id)}
              >
                <View style={[styles.iconContainer, { backgroundColor: config.bg }]}>
                  {config.set === 'FontAwesome5' && (
                    <FontAwesome5 name={config.name} size={24} color={config.color} />
                  )}
                  {config.set === 'MaterialCommunityIcons' && (
                    <MaterialCommunityIcons name={config.name as any} size={28} color={config.color} />
                  )}
                  {config.set === 'Ionicons' && (
                    <Ionicons name={config.name as any} size={28} color={config.color} />
                  )}
                </View>
                <Text style={styles.emergencyTitle}>{getEmergencyTitle(emergency)}</Text>
              </AnimatedCard>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 24,
    textAlign: 'center',
  },
  emergenciesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
  },
  emergencyCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  emergencyTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
});

export default AllEmergenciesScreen;