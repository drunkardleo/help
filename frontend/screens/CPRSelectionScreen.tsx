import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import { router } from 'expo-router';
import { AnimatedCard } from '../components/AnimatedCard';

const CPRSelectionScreen = () => {
  const { t } = useLanguage();

  const cprTypes = [
    { id: 'adult', icon: 'user', iconSet: 'FontAwesome5', title: t.cpr.adult, color: '#3B82F6', bg: '#EFF6FF' },
    { id: 'child', icon: 'child', iconSet: 'FontAwesome5', title: t.cpr.child, color: '#8B5CF6', bg: '#F3E8FF' },
    { id: 'baby', icon: 'baby', iconSet: 'FontAwesome5', title: t.cpr.baby, color: '#E02C03', bg: '#FFF1F0' }
  ];

  const handleCPRSelect = (type: string) => {
    router.push(`/emergency-guide?id=cpr&type=${type}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <AnimatedCard onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </AnimatedCard>
        <Text style={styles.headerTitle}>{t.cpr.title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="heart-pulse" size={48} color="#36D1B6" />
        </View>
        <Text style={styles.title}>{t.cpr.selectType}</Text>
        
        <View style={styles.cardsContainer}>
          {cprTypes.map((type) => (
            <AnimatedCard
              key={type.id}
              style={styles.cprCard}
              onPress={() => handleCPRSelect(type.id)}
            >
              <View style={[styles.iconContainer, { backgroundColor: type.bg }]}>
                <FontAwesome5 name={type.icon} size={28} color={type.color} />
              </View>
              <Text style={styles.cprTitle}>{type.title}</Text>
              <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
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
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E6F9F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 28,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  cardsContainer: {
    width: '100%',
    gap: 16,
  },
  cprCard: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cprTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
});

export default CPRSelectionScreen;