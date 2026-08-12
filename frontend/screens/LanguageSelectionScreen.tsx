import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageCode } from '../data/translations';
import { router } from 'expo-router';

const LanguageSelectionScreen = () => {
  const { setLanguage, t } = useLanguage();

  const languages: { code: LanguageCode; name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'mr', name: 'मराठी' },
    { code: 'mai', name: 'मैथिली' },
    { code: 'bho', name: 'भोजपुरी' },
    { code: 'bn', name: 'বাংলা' }
  ];

  const handleLanguageSelect = async (code: LanguageCode) => {
    await setLanguage(code);
    router.replace('/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>भाषाएँ</Text>
        <Text style={styles.subtitle}>Languages</Text>
        
        <View style={styles.grid}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={styles.languageButton}
              onPress={() => handleLanguageSelect(lang.code)}
              activeOpacity={0.7}
            >
              <Text style={styles.languageText}>{lang.name}</Text>
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
    padding: 24,
    alignItems: 'center'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 40,
    marginBottom: 8
  },
  subtitle: {
    fontSize: 18,
    color: '#7F8C8D',
    marginBottom: 40
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    width: '100%',
    maxWidth: 400
  },
  languageButton: {
    width: '45%',
    minWidth: 140,
    backgroundColor: '#3498DB',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  languageText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF'
  }
});

export default LanguageSelectionScreen;