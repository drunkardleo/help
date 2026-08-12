import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import { router } from 'expo-router';
import { AnimatedCard } from '../components/AnimatedCard';
import emergenciesData from '../data/emergencies.json';

const AllEmergenciesScreen = () => {
  const { t, language } = useLanguage();

  const emergencyIcons: Record<string, { name: string; set: string }> = {
    bleeding: { name: 'tint', set: 'FontAwesome5' },
    burns: { name: 'fire', set: 'FontAwesome5' },
    choking: { name: 'wind', set: 'FontAwesome5' },
    fracture: { name: 'bone', set: 'FontAwesome5' },
    shock: { name: 'bolt', set: 'FontAwesome5' },
    heart_attack: { name: 'heart', set: 'FontAwesome5' },
    cpr: { name: 'heart-pulse', set: 'MaterialCommunityIcons' }
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
    <SafeAreaView style={styles.container}>
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
            const config = emergencyIcons[emergency.id] || { name: 'alert-circle', set: 'Ionicons' };
            return (
              <AnimatedCard
                key={emergency.id}
                style={styles.emergencyCard}
                onPress={() => handleEmergencyPress(emergency.id)}
              >
                <View style={styles.iconContainer}>
                  {config.set === 'FontAwesome5' && (
                    <FontAwesome5 name={config.name} size={24} color="#334155" />
                  )}
                  {config.set === 'MaterialCommunityIcons' && (
                    <MaterialCommunityIcons name={config.name as any} size={26} color="#334155" />
                  )}
                  {config.set === 'Ionicons' && (
                    <Ionicons name={config.name as any} size={26} color="#334155" />
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
    paddingHorizontal: 24,
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
    gap: 16,
  },
  emergencyCard: {
    width: '47.5%',
    backgroundColor: '#FFFFFF',
    paddingVertical: 22,
    paddingHorizontal: 14,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
  },
});

export default AllEmergenciesScreen;