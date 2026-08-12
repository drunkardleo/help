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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.globeHeaderIcon}>
          <Ionicons name="globe-outline" size={48} color="#36D1B6" />
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 40,
    alignItems: 'center',
  },
  globeHeaderIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E6F9F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 36,
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
    borderColor: '#F1F5F9',
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