import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Linking, StatusBar, Alert, Image,
  Animated, Pressable, Platform, PermissionsAndroid
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as SMS from 'expo-sms';
import * as Haptics from 'expo-haptics';
import DirectSms from '../modules/direct-sms';
import { useLanguage } from '../contexts/LanguageContext';
import { router } from 'expo-router';
import { AnimatedCard } from '../components/AnimatedCard';
import { PageTransition } from '../components/PageTransition';

const CONTACTS_KEY = '@helpmate_sos_contacts';

const HomeScreen = () => {
  const { t, language } = useLanguage();

  const holdAnim = useRef(new Animated.Value(0)).current;
  const isHolding = useRef(false);
  const triggerRef = useRef(false);
  const [isSendingSos, setIsSendingSos] = useState(false);

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

  const handleDummyAction = () => {
    Alert.alert(
      'Custom Action',
      'This is a placeholder that you can edit and customize.',
      [{ text: 'OK' }]
    );
  };

  const handleSosPressIn = () => {
    if (isSendingSos) return;
    isHolding.current = true;
    triggerRef.current = false;
    Animated.timing(holdAnim, { toValue: 1, duration: 3000, useNativeDriver: false }).start();
  };

  const handleSosPressOut = () => {
    if (isSendingSos) return;
    if (triggerRef.current) return;
    isHolding.current = false;
    Animated.timing(holdAnim, { toValue: 0, duration: 150, useNativeDriver: false }).start();
  };

  const handleSosPress = () => {
    if (!triggerRef.current && !isSendingSos) {
      router.push('/sos');
    }
  };

  const handleSosLongPress = () => {
    if (isSendingSos) return;
    triggerRef.current = true;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (e) {}
    triggerDirectSOS();
  };

  const triggerDirectSOS = async () => {
    try {
      const raw = await AsyncStorage.getItem(CONTACTS_KEY);
      const contacts = raw ? JSON.parse(raw) : [];

      if (!contacts || contacts.length === 0) {
        Alert.alert(
          t.sos.title,
          t.sos.noRecipients,
          [
            { text: t.sos.addContact, onPress: () => router.push('/sos') },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
        return;
      }

      setIsSendingSos(true);

      let coords: { latitude: number; longitude: number } | null = null;
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }).catch(() => null) 
                     || await Location.getLastKnownPositionAsync().catch(() => null);
          if (loc) {
            coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
          }
        }
      } catch (err) {
        console.warn('Location retrieval warning:', err);
      }

      const numbers = contacts.map((c: any) => c.number);
      let message = t.sos.smsBody;
      if (coords) {
        message += ` https://www.google.com/maps/search/?api=1&query=${coords.latitude},${coords.longitude}`;
      } else {
        message += ` ${t.sos.locationUnavailable}`;
      }

      if (Platform.OS === 'android' && DirectSms) {
        let hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.SEND_SMS);
        if (!hasPermission) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.SEND_SMS,
            {
              title: "SMS Permission",
              message: "HelpMate needs permission to send emergency SOS messages directly to your contacts.",
              buttonPositive: "Allow"
            }
          );
          hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
        }

        if (hasPermission) {
          await DirectSms.sendDirectSms(numbers, message);
          Alert.alert(
            "🚨 SOS Sent",
            "Emergency messages with your live location have been sent directly to your emergency contacts."
          );
          return;
        }
      }

      const isAvailable = await SMS.isAvailableAsync();
      if (Platform.OS === 'web' || !isAvailable) {
        Alert.alert(t.sos.title, t.sos.smsNotAvailable + (coords ? `\n\n${message}` : ''));
      } else {
        await SMS.sendSMSAsync(numbers, message);
      }
    } catch (e) {
      console.error('Direct SOS error:', e);
      Alert.alert(t.sos.title, t.sos.smsFailed);
    } finally {
      setIsSendingSos(false);
      isHolding.current = false;
      Animated.timing(holdAnim, { toValue: 0, duration: 150, useNativeDriver: false }).start();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <PageTransition>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>प्रथम सहाय</Text>
          <AnimatedCard onPress={handleLanguageSwitch} style={styles.languageButton}>
            <Ionicons name="globe-outline" size={18} color="#334155" />
            <Text style={styles.languageText}>{language.toUpperCase()}</Text>
          </AnimatedCard>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image 
            source={require('../assets/images/logo.png')} 
            style={styles.heroLogo} 
            resizeMode="contain" 
          />
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
          {/* 1. All Emergencies (Red Theme) */}
          <AnimatedCard 
            style={styles.quickActionCard}
            onPress={() => router.push('/all-emergencies')}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="alert-circle" size={30} color="#DC2626" />
            </View>
            <Text style={styles.quickActionText}>{t.home.allEmergencies}</Text>
          </AnimatedCard>

          {/* 2. Check Symptoms (Blue Theme) */}
          <AnimatedCard 
            style={styles.quickActionCard}
            onPress={() => router.push('/symptom-checker')}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: '#DBEAFE' }]}>
              <MaterialCommunityIcons name="stethoscope" size={30} color="#2563EB" />
            </View>
            <Text style={styles.quickActionText}>{t.home.checkSymptoms}</Text>
          </AnimatedCard>

          {/* 3. Snake Poisoning (Green Theme) */}
          <AnimatedCard 
            style={styles.quickActionCard}
            onPress={() => router.push('/emergency-guide?id=snake_bite')}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: '#DCFCE7' }]}>
              <MaterialCommunityIcons name="snake" size={30} color="#16A34A" />
            </View>
            <Text style={styles.quickActionText}>
              {t.home.snakePoisoning || 'Snake Poisoning'}
            </Text>
          </AnimatedCard>

          {/* 4. More / Custom Action (Amber/Orange Theme) */}
          <AnimatedCard 
            style={styles.quickActionCard}
            onPress={handleDummyAction}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: '#FEF3C7' }]}>
              <MaterialCommunityIcons name="food-apple" size={28} color="#D97706" />
            </View>
            <Text style={styles.quickActionText}>
              {t.home.dummyAction || 'More'}
            </Text>
          </AnimatedCard>
        </View>
      </ScrollView>
      </PageTransition>

      <View style={styles.floatingSosWrap}>
        <Pressable
          onPressIn={handleSosPressIn}
          onPressOut={handleSosPressOut}
          onPress={handleSosPress}
          onLongPress={handleSosLongPress}
          delayLongPress={3000}
          style={({ pressed }) => [
            styles.floatingSosButton,
            pressed && { transform: [{ scale: 0.96 }] }
          ]}
        >
          <Animated.View
            style={[
              styles.sosFill,
              {
                height: holdAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 72] }),
                opacity: holdAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
              }
            ]}
          />
          <Ionicons name="nuclear" size={24} color="#FFFFFF" />
          <Text style={styles.floatingSosText}>SOS</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 18,
    gap: 6,
  },
  languageText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  heroLogo: {
    width: 110,
    height: 110,
    marginBottom: 6,
  },
  appTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  appSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  emergencyButton: {
    flexDirection: 'row',
    backgroundColor: '#B91C1C',
    height: 52,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#B91C1C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 3,
  },
  emergencyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  disclaimer: {
    fontSize: 11.5,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 8,
    lineHeight: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
    marginBottom: 24,
  },
  quickActionCard: {
    width: '48%',
    height: 136,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 10,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  actionIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  quickActionText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: -0.2,
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
    overflow: 'hidden',
    position: 'relative',
    gap: 1,
  },
  sosFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#991B1B',
  },
  floatingSosText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },
});

export default HomeScreen;