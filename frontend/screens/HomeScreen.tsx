import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Linking, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import { router } from 'expo-router';
import emergenciesData from '../data/emergencies.json';

const HomeScreen = () => {
  const { t, setLanguage, language } = useLanguage();

  const handleEmergencyCall = () => {
    Linking.openURL('tel:112');
  };

  const handleLanguageSwitch = () => {
    router.push('/language-select');
  };

  const criticalEmergencies = [
    { id: 'bleeding', icon: 'water', color: '#E74C3C', iconSet: 'Ionicons' },
    { id: 'heart_attack', icon: 'heart', color: '#E74C3C', iconSet: 'Ionicons' },
    { id: 'choking', icon: 'alert-circle', color: '#F39C12', iconSet: 'Ionicons' },
    { id: 'shock', icon: 'flash', color: '#9B59B6', iconSet: 'Ionicons' }
  ];

  
  const getEmergencyTitle = (emergencyId: string) => {
    const emergency = emergenciesData.emergencies.find((e: any) => e.id === emergencyId);
    if (emergency && emergency.title) {
      return emergency.title[language] || emergency.title.en;
    }
    return '';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>HelpMate</Text>
          <TouchableOpacity onPress={handleLanguageSwitch} style={styles.languageButton}>
            <Ionicons name="globe-outline" size={24} color="#34495E" />
            <Text style={styles.languageText}>{language.toUpperCase()}</Text>
          </TouchableOpacity>
        </View>

        {}
        <View style={styles.heroSection}>
          <View style={styles.iconCircle}>
            <Ionicons name="heart" size={60} color="#4ECDC4" />
          </View>
          <Text style={styles.appTitle}>{t.home.title}</Text>
          <Text style={styles.appSubtitle}>{t.home.subtitle}</Text>
        </View>

        {}
        <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergencyCall} activeOpacity={0.8}>
          <Ionicons name="call" size={24} color="#FFFFFF" />
          <Text style={styles.emergencyButtonText}>{t.home.callEmergency}</Text>
        </TouchableOpacity>

        {}
        <Text style={styles.disclaimer}>{t.home.disclaimer}</Text>

        {}
        <Text style={styles.sectionTitle}>{t.home.quickActions}</Text>
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => router.push('/all-emergencies')}
            activeOpacity={0.7}
          >
            <Ionicons name="alert-circle" size={40} color="#E74C3C" />
            <Text style={styles.quickActionText}>{t.home.allEmergencies}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => router.push('/symptom-checker')}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="stethoscope" size={40} color="#4ECDC4" />
            <Text style={styles.quickActionText}>{t.home.checkSymptoms}</Text>
          </TouchableOpacity>
        </View>

        {}
        <View style={styles.criticalHeader}>
          <View style={styles.criticalDot} />
          <Text style={styles.sectionTitle}>{t.home.critical}</Text>
        </View>
        <View style={styles.criticalGrid}>
          {criticalEmergencies.map((emergency) => (
            <TouchableOpacity
              key={emergency.id}
              style={styles.criticalCard}
              onPress={() => router.push(`/emergency-guide?id=${emergency.id}`)}
              activeOpacity={0.7}
            >
              <Ionicons name={emergency.icon as any} size={36} color={emergency.color} />
              <Text style={styles.criticalCardText}>{getEmergencyTitle(emergency.id)}</Text>
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
  scrollContent: {
    padding: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50'
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECF0F1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6
  },
  languageText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34495E'
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 32
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8F8F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8
  },
  appSubtitle: {
    fontSize: 16,
    color: '#7F8C8D'
  },
  emergencyButton: {
    flexDirection: 'row',
    backgroundColor: '#E74C3C',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    gap: 12,
    elevation: 4,
    shadowColor: '#E74C3C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6
  },
  emergencyButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold'
  },
  disclaimer: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
    lineHeight: 16
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16
  },
  quickActionsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ECF0F1',
    gap: 12
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34495E',
    textAlign: 'center'
  },
  criticalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16
  },
  criticalDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E74C3C'
  },
  criticalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16
  },
  criticalCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ECF0F1',
    gap: 12
  },
  criticalCardText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34495E',
    textAlign: 'center'
  }
});

export default HomeScreen;