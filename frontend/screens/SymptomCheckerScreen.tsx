import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import { router } from 'expo-router';
import { matchSymptomsToEmergency } from '../utils/symptomMatcher';
import emergenciesData from '../data/emergencies.json';

const SymptomCheckerScreen = () => {
  const { t, language } = useLanguage();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [result, setResult] = useState<{ emergencyId: string; title: string } | null>(null);

  const symptoms = [
    { id: 'chestPain', label: t.symptoms.chestPain, icon: 'heart-dislike' },
    { id: 'heavyBleeding', label: t.symptoms.heavyBleeding, icon: 'water' },
    { id: 'breathingDifficulty', label: t.symptoms.breathingDifficulty, icon: 'fitness' },
    { id: 'unconscious', label: t.symptoms.unconscious, icon: 'alert-circle' },
    { id: 'burnInjury', label: t.symptoms.burnInjury, icon: 'flame' },
    { id: 'bonePain', label: t.symptoms.bonePain, icon: 'body' },
    { id: 'weakPulse', label: t.symptoms.weakPulse, icon: 'pulse' },
    { id: 'dizziness', label: t.symptoms.dizziness, icon: 'refresh' },
    { id: 'vomitingBlood', label: t.symptoms.vomitingBlood, icon: 'warning' },
    { id: 'suddenWeakness', label: t.symptoms.suddenWeakness, icon: 'analytics' },
    { id: 'coldSweating', label: t.symptoms.coldSweating, icon: 'thermometer' }
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.symptoms.title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subtitle}>{t.symptoms.subtitle}</Text>

        {}
        <View style={styles.symptomsContainer}>
          {symptoms.map((symptom) => {
            const isSelected = selectedSymptoms.includes(symptom.id);
            return (
              <TouchableOpacity
                key={symptom.id}
                style={[styles.symptomCard, isSelected && styles.symptomCardSelected]}
                onPress={() => toggleSymptom(symptom.id)}
                activeOpacity={0.7}
              >
                <View style={styles.symptomContent}>
                  <Ionicons 
                    name={symptom.icon as any} 
                    size={24} 
                    color={isSelected ? '#FFFFFF' : '#3498DB'} 
                  />
                  <Text style={[styles.symptomText, isSelected && styles.symptomTextSelected]}>
                    {symptom.label}
                  </Text>
                </View>
                <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                  {isSelected && <Ionicons name="checkmark" size={18} color="#FFFFFF" />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {}
        {result && (
          <View style={styles.resultContainer}>
            <View style={styles.resultHeader}>
              <Ionicons name="information-circle" size={32} color="#27AE60" />
              <Text style={styles.resultTitle}>{t.symptoms.result}</Text>
            </View>
            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>{t.symptoms.recommended}</Text>
              <Text style={styles.resultEmergency}>{result.title}</Text>
              <TouchableOpacity style={styles.viewGuideButton} onPress={handleViewGuide} activeOpacity={0.8}>
                <Text style={styles.viewGuideButtonText}>{t.symptoms.viewGuide}</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Ionicons name="refresh" size={20} color="#7F8C8D" />
              <Text style={styles.resetButtonText}>Check Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {}
        {!result && (
          <TouchableOpacity 
            style={[styles.checkButton, selectedSymptoms.length === 0 && styles.checkButtonDisabled]} 
            onPress={handleCheck}
            disabled={selectedSymptoms.length === 0}
            activeOpacity={0.8}
          >
            <Text style={styles.checkButtonText}>{t.symptoms.checkButton}</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1'
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50'
  },
  scrollContent: {
    padding: 20
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 24,
    textAlign: 'center'
  },
  symptomsContainer: {
    gap: 12,
    marginBottom: 24
  },
  symptomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ECF0F1'
  },
  symptomCardSelected: {
    backgroundColor: '#3498DB',
    borderColor: '#3498DB'
  },
  symptomContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1
  },
  symptomText: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '500'
  },
  symptomTextSelected: {
    color: '#FFFFFF'
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#BDC3C7',
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkboxSelected: {
    backgroundColor: '#27AE60',
    borderColor: '#27AE60'
  },
  checkButton: {
    flexDirection: 'row',
    backgroundColor: '#3498DB',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    elevation: 4,
    shadowColor: '#3498DB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6
  },
  checkButtonDisabled: {
    backgroundColor: '#BDC3C7',
    elevation: 0,
    shadowOpacity: 0
  },
  checkButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold'
  },
  resultContainer: {
    marginTop: 8,
    marginBottom: 24
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#27AE60'
  },
  resultCard: {
    backgroundColor: '#E8F8F5',
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#27AE60',
    marginBottom: 16
  },
  resultLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 8
  },
  resultEmergency: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20
  },
  viewGuideButton: {
    flexDirection: 'row',
    backgroundColor: '#27AE60',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  viewGuideButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    gap: 8
  },
  resetButtonText: {
    fontSize: 16,
    color: '#7F8C8D',
    fontWeight: '500'
  }
});

export default SymptomCheckerScreen;