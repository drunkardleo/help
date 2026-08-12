import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageCode } from '../data/translations';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedCard } from '../components/AnimatedCard';

const LanguageSelectionScreen = () => {
  const { setLanguage } = useLanguage();

  const languages: { code: LanguageCode; name: string; nativeName: string }[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'mai', name: 'Maithili', nativeName: 'मैथिली' },
    { code: 'bho', name: 'Bhojpuri', nativeName: 'भोजपुरी' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' }
  ];

  const handleLanguageSelect = async (code: LanguageCode) => {
    await setLanguage(code);
    router.replace('/home');
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/home');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Top Header with Back Button */}
      <View style={styles.header}>
        <AnimatedCard onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </AnimatedCard>
        <Text style={styles.headerTitle}>Language / भाषा</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.globeHeaderIcon}>
          <Ionicons name="globe-outline" size={44} color="#334155" />
        </View>

        <Text style={styles.title}>Select Language</Text>
        <Text style={styles.subtitle}>अपनी भाषा चुनें</Text>
        
        <View style={styles.grid}>
          {languages.map((lang) => (
            <AnimatedCard
              key={lang.code}
              style={styles.languageButton}
              onPress={() => handleLanguageSelect(lang.code)}
            >
              <Text style={styles.nativeText}>{lang.nativeName}</Text>
              <Text style={styles.englishText}>{lang.name}</Text>
            </AnimatedCard>
          ))}
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
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  globeHeaderIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 32,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    width: '100%',
  },
  languageButton: {
    width: '47.5%',
    backgroundColor: '#FFFFFF',
    paddingVertical: 22,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  nativeText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  englishText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
  },
});

export default LanguageSelectionScreen;