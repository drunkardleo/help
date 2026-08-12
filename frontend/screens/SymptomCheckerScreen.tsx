import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert, StatusBar } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import { router } from 'expo-router';
import { matchSymptomsToEmergency } from '../utils/symptomMatcher';
import { AnimatedCard } from '../components/AnimatedCard';
import emergenciesData from '../data/emergencies.json';

const SymptomCheckerScreen = () => {
  const { t, language } = useLanguage();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [result, setResult] = useState<{ emergencyId: string; title: string } | null>(null);

  const symptoms = [
    { id: 'chestPain', label: t.symptoms.chestPain, icon: 'heart', iconSet: 'FontAwesome5' },
    { id: 'heavyBleeding', label: t.symptoms.heavyBleeding, icon: 'tint', iconSet: 'FontAwesome5' },
    { id: 'breathingDifficulty', label: t.symptoms.breathingDifficulty, icon: 'wind', iconSet: 'FontAwesome5' },
    { id: 'unconscious', label: t.symptoms.unconscious, icon: 'user-alt-slash', iconSet: 'FontAwesome5' },
    { id: 'burnInjury', label: t.symptoms.burnInjury, icon: 'fire', iconSet: 'FontAwesome5' },
    { id: 'bonePain', label: t.symptoms.bonePain, icon: 'bone', iconSet: 'FontAwesome5' },
    { id: 'weakPulse', label: t.symptoms.weakPulse, icon: 'wave-square', iconSet: 'FontAwesome5' },
    { id: 'dizziness', label: t.symptoms.dizziness, icon: 'sync-alt', iconSet: 'FontAwesome5' },
    { id: 'vomitingBlood', label: t.symptoms.vomitingBlood, icon: 'exclamation-triangle', iconSet: 'FontAwesome5' },
    { id: 'suddenWeakness', label: t.symptoms.suddenWeakness, icon: 'battery-quarter', iconSet: 'FontAwesome5' },
    { id: 'coldSweating', label: t.symptoms.coldSweating, icon: 'temperature-low', iconSet: 'FontAwesome5' }
  ];

  const toggleSymptom = (symptomId: string) => {
    if (selectedSymptoms.includes(symptomId)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptomId));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptomId]);
    }
  };

  const handleCheck = () => {
    if (selectedSymptoms.length === 0) {
      Alert.alert('No Symptoms Selected', t.symptoms.selectAtLeastOne);
      return;
    }

    const match = matchSymptomsToEmergency(selectedSymptoms);
    if (match) {
      const emergency = emergenciesData.emergencies.find((e: any) => e.id === match.emergencyId);
      if (emergency) {
        const translatedTitle = typeof emergency.title === 'object' 
          ? (emergency.title[language] || emergency.title.en)
          : emergency.title;
        
        setResult({
          emergencyId: match.emergencyId,
          title: translatedTitle
        });
      }
    }
  };

  const handleViewGuide = () => {
    if (result) {
      router.push(`/emergency-guide?id=${result.emergencyId}`);
    }
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setResult(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <AnimatedCard onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </AnimatedCard>
        <Text style={styles.headerTitle}>{t.symptoms.title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>{t.symptoms.subtitle}</Text>

        <View style={styles.symptomsContainer}>
          {symptoms.map((symptom) => {
            const isSelected = selectedSymptoms.includes(symptom.id);
            return (
              <AnimatedCard
                key={symptom.id}
                style={[styles.symptomCard, isSelected && styles.symptomCardSelected]}
                onPress={() => toggleSymptom(symptom.id)}
              >
                <View style={styles.symptomContent}>
                  <View style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}>
                    <FontAwesome5 
                      name={symptom.icon} 
                      size={18} 
                      color={isSelected ? '#FFFFFF' : '#36D1B6'} 
                    />
                  </View>
                  <Text style={[styles.symptomText, isSelected && styles.symptomTextSelected]}>
                    {symptom.label}
                  </Text>
                </View>
                <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                  {isSelected && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                </View>
              </AnimatedCard>
            );
          })}
        </View>

        {result && (
          <View style={styles.resultContainer}>
            <View style={styles.resultCard}>
              <View style={styles.resultBadge}>
                <Ionicons name="checkmark-circle" size={22} color="#36D1B6" />
                <Text style={styles.resultTitle}>{t.symptoms.result}</Text>
              </View>
              <Text style={styles.resultLabel}>{t.symptoms.recommended}</Text>
              <Text style={styles.resultEmergency}>{result.title}</Text>
              <AnimatedCard style={styles.viewGuideButton} onPress={handleViewGuide}>
                <Text style={styles.viewGuideButtonText}>{t.symptoms.viewGuide}</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </AnimatedCard>
            </View>
            <AnimatedCard style={styles.resetButton} onPress={handleReset}>
              <Ionicons name="refresh" size={18} color="#64748B" />
              <Text style={styles.resetButtonText}>Check Again</Text>
            </AnimatedCard>
          </View>
        )}

        {!result && (
          <AnimatedCard 
            style={[styles.checkButton, selectedSymptoms.length === 0 && styles.checkButtonDisabled]} 
            onPress={handleCheck}
          >
            <Text style={styles.checkButtonText}>{t.symptoms.checkButton}</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </AnimatedCard>
        )}
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
  symptomsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  symptomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  symptomCardSelected: {
    backgroundColor: '#E6F9F5',
    borderColor: '#36D1B6',
  },
  symptomContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerSelected: {
    backgroundColor: '#36D1B6',
  },
  symptomText: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '600',
  },
  symptomTextSelected: {
    color: '#0F172A',
    fontWeight: '700',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#36D1B6',
    borderColor: '#36D1B6',
  },
  checkButton: {
    flexDirection: 'row',
    backgroundColor: '#36D1B6',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#36D1B6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  checkButtonDisabled: {
    backgroundColor: '#CBD5E1',
    shadowOpacity: 0,
    elevation: 0,
  },
  checkButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  resultContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  resultCard: {
    backgroundColor: '#F8FAFC',
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  resultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  resultLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 6,
  },
  resultEmergency: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  viewGuideButton: {
    flexDirection: 'row',
    backgroundColor: '#E02C03',
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  viewGuideButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    gap: 8,
  },
  resetButtonText: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '600',
  },
});

export default SymptomCheckerScreen;