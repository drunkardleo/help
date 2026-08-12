import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import { router } from 'expo-router';

const CPRSelectionScreen = () => {
  const { t } = useLanguage();

  const cprTypes = [
    { id: 'adult', icon: 'person', title: t.cpr.adult, color: '#3498DB' },
    { id: 'child', icon: 'person-outline', title: t.cpr.child, color: '#9B59B6' },
    { id: 'baby', icon: 'heart', title: t.cpr.baby, color: '#E74C3C' }
  ];

  const handleCPRSelect = (type: string) => {
    router.push(`/emergency-guide?id=cpr&type=${type}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.cpr.title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="heart-pulse" size={60} color="#27AE60" />
        </View>
        <Text style={styles.title}>{t.cpr.selectType}</Text>
        
        <View style={styles.cardsContainer}>
          {cprTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[styles.cprCard, { borderColor: type.color }]}
              onPress={() => handleCPRSelect(type.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: type.color + '20' }]}>
                <Ionicons name={type.icon as any} size={50} color={type.color} />
              </View>
              <Text style={styles.cprTitle}>{type.title}</Text>
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
    padding: 20,
    alignItems: 'center'
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8F8F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 24
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 32,
    textAlign: 'center'
  },
  cardsContainer: {
    width: '100%',
    gap: 20
  },
  cprCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 3,
    gap: 20
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cprTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495E',
    flex: 1
  }
});

export default CPRSelectionScreen;