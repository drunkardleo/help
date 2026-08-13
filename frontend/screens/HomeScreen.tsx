import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Linking, StatusBar, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import { router } from 'expo-router';
import { AnimatedCard } from '../components/AnimatedCard';
import { PageTransition } from '../components/PageTransition';
import emergenciesData from '../data/emergencies.json';

const HomeScreen = () => {
  const { t, language } = useLanguage();

  const handleEmergencyCall = async () => {
    const phoneUrl = 'tel:112';
    try {
      const supported = await Linking.canOpenURL(phoneUrl);
      if (supported) {
        await Linking.openURL(phoneUrl);
      } else {
        Alert.alert(
          'Emergency Call (112)',
          'Calling 112 is not supported on this device/simulator. Please dial 112 on your phone.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Emergency Call (112)',
        'Please dial 112 on your phone for emergency assistance.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleLanguageSwitch = () => {
    router.push('/language-select');
  };

  const criticalEmergencies = [
    { id: 'bleeding' },
    { id: 'heart_attack' },
    { id: 'choking' },
    { id: 'shock' }
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
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <PageTransition>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>HelpMate</Text>
          <AnimatedCard onPress={handleLanguageSwitch} style={styles.languageButton}>
            <Ionicons name="globe-outline" size={18} color="#334155" />
            <Text style={styles.languageText}>{language.toUpperCase()}</Text>
          </AnimatedCard>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="heart-pulse" size={44} color="#334155" />
          </View>
          <Text style={styles.appTitle}>प्रथम सहाय</Text>
          <Text style={styles.appSubtitle}>First Aid for Everyone</Text>
        </View>

        {/* Emergency Call Button */}
        <AnimatedCard onPress={handleEmergencyCall} style={styles.emergencyButton} scaleTo={0.97}>
          <Ionicons name="call" size={22} color="#FFFFFF" />
          <Text style={styles.emergencyButtonText}>{t.home.callEmergency}</Text>
        </AnimatedCard>

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>{t.home.disclaimer}</Text>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>{t.home.quickActions}</Text>
        <View style={styles.quickActionsContainer}>
          <AnimatedCard 
            style={styles.quickActionCard}
            onPress={() => router.push('/all-emergencies')}
          >
            <View style={styles.actionIconCircle}>
              <Ionicons name="alert-circle-outline" size={30} color="#334155" />
            </View>
            <Text style={styles.quickActionText}>{t.home.allEmergencies}</Text>
          </AnimatedCard>

          <AnimatedCard 
            style={styles.quickActionCard}
            onPress={() => router.push('/symptom-checker')}
          >
            <View style={styles.actionIconCircle}>
              <MaterialCommunityIcons name="stethoscope" size={30} color="#334155" />
            </View>
            <Text style={styles.quickActionText}>{t.home.checkSymptoms}</Text>
          </AnimatedCard>
        </View>

        {/* Critical Section */}
        <View style={styles.criticalHeader}>
          <View style={styles.criticalDot} />
          <Text style={styles.criticalTitle}>{t.home.critical}</Text>
        </View>
        
        <View style={styles.criticalGrid}>
          {criticalEmergencies.map((item) => (
            <AnimatedCard
              key={item.id}
              style={styles.criticalCard}
              onPress={() => router.push(`/emergency-guide?id=${item.id}`)}
            >
              <View style={styles.criticalIconContainer}>
                {item.id === 'bleeding' && <FontAwesome5 name="tint" size={26} color="#334155" />}
                {item.id === 'heart_attack' && <FontAwesome5 name="heart" size={26} color="#334155" />}
                {item.id === 'choking' && <FontAwesome5 name="wind" size={26} color="#334155" />}
                {item.id === 'shock' && <FontAwesome5 name="bolt" size={26} color="#334155" />}
              </View>
              <Text style={styles.criticalCardText}>{getEmergencyTitle(item.id)}</Text>
            </AnimatedCard>
          ))}
        </View>
      </ScrollView>
      </PageTransition>

      <AnimatedCard style={styles.floatingSosWrap} onPress={() => router.push('/sos')}>
        <View style={styles.floatingSosButton}>
          <Ionicons name="nuclear" size={24} color="#FFFFFF" />
          <Text style={styles.floatingSosText}>SOS</Text>
        </View>
      </AnimatedCard>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 6,
  },
  languageText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  appSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#64748B',
  },
  emergencyButton: {
    flexDirection: 'row',
    backgroundColor: '#B91C1C',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#B91C1C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  emergencyButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  disclaimer: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 32,
    paddingHorizontal: 12,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  quickActionCard: {
    flex: 1,
    height: 160,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
  },
  floatingSosWrap: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    shadowColor: '#E02C03',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 10,
  },
  floatingSosButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#B91C1C',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#E02C03',
    gap: 1,
  },
  floatingSosText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },
  criticalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  criticalDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#B91C1C',
    marginRight: 8,
  },
  criticalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  criticalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 14,
  },
  criticalCard: {
    width: '47.5%',
    height: 160,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  criticalIconContainer: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  criticalCardText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
  },
});

export default HomeScreen;