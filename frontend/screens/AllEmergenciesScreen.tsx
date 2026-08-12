import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import { router } from 'expo-router';
import emergenciesData from '../data/emergencies.json';

const AllEmergenciesScreen = () => {
  const { t, language } = useLanguage();

  const emergencyIcons: Record<string, string> = {
    bleeding: 'water',
    burns: 'flame',
    choking: 'alert-circle',
    fracture: 'body',
    shock: 'flash',
    heart_attack: 'heart',
    cpr: 'medical'
  };

  const emergencyColors: Record<string, string> = {
    bleeding: '#E74C3C',
    burns: '#E67E22',
    choking: '#F39C12',
    fracture: '#3498DB',
    shock: '#9B59B6',
    heart_attack: '#C0392B',
    cpr: '#27AE60'
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.emergencies.title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subtitle}>{t.emergencies.selectEmergency}</Text>
        
        <View style={styles.emergenciesGrid}>
          {emergenciesData.emergencies.map((emergency: any) => (
            <TouchableOpacity
              key={emergency.id}
              style={styles.emergencyCard}
              onPress={() => handleEmergencyPress(emergency.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: emergencyColors[emergency.id] + '20' }]}>
                <Ionicons 
                  name={emergencyIcons[emergency.id] as any} 
                  size={40} 
                  color={emergencyColors[emergency.id]} 
                />
              </View>
              <Text style={styles.emergencyTitle}>{getEmergencyTitle(emergency)}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 24,
    textAlign: 'center'
  },
  emergenciesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16
  },
  emergencyCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ECF0F1',
    gap: 12
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emergencyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34495E',
    textAlign: 'center'
  }
});

export default AllEmergenciesScreen;