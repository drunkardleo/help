import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, StatusBar,
  Pressable, TextInput, Alert, Platform, Animated,
  PermissionsAndroid, Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as SMS from 'expo-sms';
import { useLanguage } from '../contexts/LanguageContext';
import { router } from 'expo-router';
import { AnimatedCard } from '../components/AnimatedCard';
import DirectSms from '../modules/direct-sms';

interface Contact {
  id: string;
  name: string;
  number: string;
}

const CONTACTS_KEY = '@helpmate_sos_contacts';
const HOLD_DURATION = 3000;

const SOSScreen = () => {
  const { t } = useLanguage();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [lastCoords, setLastCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isSending, setIsSending] = useState(false);

  const holdAnim = useRef(new Animated.Value(0)).current;
  const isHolding = useRef(false);
  const triggerRef = useRef(false);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const raw = await AsyncStorage.getItem(CONTACTS_KEY);
      if (raw) setContacts(JSON.parse(raw));
    } catch (e) {
      console.error('Error loading contacts:', e);
    }
  };

  const persistContacts = async (next: Contact[]) => {
    setContacts(next);
    try {
      await AsyncStorage.setItem(CONTACTS_KEY, JSON.stringify(next));
    } catch (e) {
      console.error('Error saving contacts:', e);
    }
  };

  const handleAddContact = () => {
    const digits = number.replace(/[^0-9]/g, '');
    if (digits.length < 10 || digits.length > 15) {
      Alert.alert(t.sos.invalidNumber);
      return;
    }
    if (!name.trim()) {
      Alert.alert(t.sos.invalidName);
      return;
    }
    const newContact: Contact = { id: String(Date.now()), name: name.trim(), number: digits };
    persistContacts([...contacts, newContact]);
    setName('');
    setNumber('');
  };

  const handleDeleteContact = (id: string) => {
    persistContacts(contacts.filter((c) => c.id !== id));
  };

  const getLocation = async (): Promise<{ latitude: number; longitude: number } | null> => {
    try {
      const isServiceEnabled = await Location.hasServicesEnabledAsync();
      if (!isServiceEnabled) {
        setLocationStatus('error');
        return null;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationStatus('error');
        return null;
      }

      let loc = await Location.getCurrentPositionAsync({ 
        accuracy: Location.Accuracy.Balanced 
      }).catch(() => null);

      if (!loc) {
        loc = await Location.getLastKnownPositionAsync();
      }

      if (loc) {
        const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
        setLastCoords(coords);
        setLocationStatus('ready');
        return coords;
      }

      setLocationStatus('error');
      return null;
    } catch (e) {
      console.warn('Location retrieval warning:', e);
      setLocationStatus('error');
      return null;
    }
  };

  const triggerSOS = async () => {
    if (contacts.length === 0) {
      Alert.alert(t.sos.noRecipients);
      return;
    }

    setIsSending(true);
    setLocationStatus('loading');

    const coords = await getLocation();
    const numbers = contacts.map((c) => c.number);
    const primaryNumber = contacts[0]?.number;

    let message = t.sos.smsBody;
    if (coords) {
      message += ` https://www.google.com/maps/search/?api=1&query=${coords.latitude},${coords.longitude}`;
    } else {
      message += ` ${t.sos.locationUnavailable}`;
    }

    try {
      let smsSent = false;
      if (Platform.OS === 'android' && DirectSms) {
        let hasSmsPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.SEND_SMS);
        if (!hasSmsPermission) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.SEND_SMS,
            {
              title: "SMS Permission",
              message: "HelpMate needs permission to send emergency SOS messages directly to your contacts.",
              buttonPositive: "Allow"
            }
          );
          hasSmsPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
        }

        if (hasSmsPermission) {
          await DirectSms.sendDirectSms(numbers, message);
          smsSent = true;
        }
      }

      if (!smsSent) {
        const isAvailable = await SMS.isAvailableAsync();
        if (Platform.OS === 'web' || !isAvailable) {
          Alert.alert(t.sos.title, t.sos.smsNotAvailable + (coords ? `\n\n${message}` : ''));
        } else {
          await SMS.sendSMSAsync(numbers, message);
        }
      }

      if (primaryNumber) {
        if (Platform.OS === 'android' && DirectSms?.makeDirectCall) {
          let hasCallPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CALL_PHONE);
          if (!hasCallPermission) {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.CALL_PHONE,
              {
                title: "Call Permission",
                message: "HelpMate needs permission to automatically call your emergency contact during an SOS.",
                buttonPositive: "Allow"
              }
            );
            hasCallPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
          }

          if (hasCallPermission) {
            await DirectSms.makeDirectCall(primaryNumber);
          } else {
            const phoneUrl = `tel:${primaryNumber}`;
            const canCall = await Linking.canOpenURL(phoneUrl);
            if (canCall) {
              await Linking.openURL(phoneUrl);
            }
          }
        } else {
          const phoneUrl = `tel:${primaryNumber}`;
          const canCall = await Linking.canOpenURL(phoneUrl);
          if (canCall) {
            await Linking.openURL(phoneUrl);
          }
        }
      }
    } catch (e) {
      console.error('SOS error:', e);
      Alert.alert(t.sos.title, t.sos.smsFailed);
    } finally {
      setIsSending(false);
      isHolding.current = false;
      Animated.timing(holdAnim, { toValue: 0, duration: 150, useNativeDriver: false }).start();
    }
  };

  const handlePressIn = () => {
    if (isSending) return;
    isHolding.current = true;
    triggerRef.current = false;
    Animated.timing(holdAnim, { toValue: 1, duration: HOLD_DURATION, useNativeDriver: false }).start();
  };

  const handlePressOut = () => {
    if (isSending) return;
    if (triggerRef.current) return;
    isHolding.current = false;
    Animated.timing(holdAnim, { toValue: 0, duration: 150, useNativeDriver: false }).start();
  };

  const handleLongPress = () => {
    if (isSending) return;
    triggerRef.current = true;
    triggerSOS();
  };

  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.04, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const fillHeight = holdAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 200] });
  const fillOpacity = holdAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  const locationText = () => {
    switch (locationStatus) {
      case 'loading': return t.sos.locationLoading;
      case 'ready':
        return lastCoords
          ? `${t.sos.locationReady}: ${lastCoords.latitude.toFixed(5)}, ${lastCoords.longitude.toFixed(5)}`
          : t.sos.locationReady;
      case 'error': return t.sos.locationError;
      default: return t.sos.locationIdle;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <AnimatedCard onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </AnimatedCard>
        <Text style={styles.headerTitle}>{t.sos.title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.subtitle}>{t.sos.subtitle}</Text>

        <Animated.View style={[styles.sosCircle, { transform: [{ scale: pulse }] }]}>
          <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onLongPress={handleLongPress}
            delayLongPress={HOLD_DURATION}
            style={styles.sosButton}
          >
            <View style={styles.sosButtonInner}>
              <Animated.View
                style={[
                  styles.sosFill,
                  { height: fillHeight, opacity: fillOpacity },
                ]}
              />
              <View style={styles.sosContent}>
                <Ionicons name="nuclear" size={34} color="#FFFFFF" />
                <Text style={styles.sosText}>SOS</Text>
              </View>
            </View>
          </Pressable>
        </Animated.View>

        <Text style={styles.holdInstruction}>{t.sos.holdToSend}</Text>

        <View style={[styles.locationRow, locationStatus === 'error' && styles.locationRowError]}>
          <Ionicons
            name={locationStatus === 'loading' ? 'sync' : locationStatus === 'ready' ? 'location' : 'location-outline'}
            size={16}
            color={locationStatus === 'ready' ? '#16A34A' : '#64748B'}
          />
          <Text style={styles.locationText} numberOfLines={2}>
            {locationText()}
          </Text>
        </View>

        <Text style={styles.offlineNote}>{t.sos.offlineNote}</Text>

        <View style={styles.contactsSection}>
          <Text style={styles.sectionTitle}>{t.sos.contactsTitle}</Text>

          {contacts.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={28} color="#CBD5E1" />
              <Text style={styles.emptyText}>{t.sos.noContacts}</Text>
            </View>
          ) : (
            contacts.map((contact) => (
              <View key={contact.id} style={styles.contactCard}>
                <View style={styles.contactAvatar}>
                  <Text style={styles.contactAvatarText}>{contact.name.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactNumber}>+{contact.number}</Text>
                </View>
                <Pressable onPress={() => handleDeleteContact(contact.id)} hitSlop={8}>
                  <Ionicons name="trash-outline" size={20} color="#DC2626" />
                </Pressable>
              </View>
            ))
          )}

          <Text style={styles.addContactTitle}>{t.sos.addContact}</Text>
          <View style={styles.formRow}>
            <TextInput
              style={[styles.input, styles.nameInput]}
              placeholder={t.sos.namePlaceholder}
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={[styles.input, styles.numberInput]}
              placeholder={t.sos.numberPlaceholder}
              placeholderTextColor="#94A3B8"
              value={number}
              onChangeText={setNumber}
              keyboardType="phone-pad"
            />
            <AnimatedCard style={styles.addButton} onPress={handleAddContact}>
              <Ionicons name="add" size={20} color="#FFFFFF" />
            </AnimatedCard>
          </View>
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
    paddingTop: 16,
    paddingBottom: 40,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 28,
  },
  sosCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#E02C03',
  },
  sosButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#DC2626',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E02C03',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  sosButtonInner: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  sosFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#991B1B',
  },
  sosContent: {
    alignItems: 'center',
    gap: 6,
  },
  sosText: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 2,
  },
  holdInstruction: {
    marginTop: 20,
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    maxWidth: '100%',
  },
  locationRowError: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  locationText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#475569',
    flex: 1,
  },
  offlineNote: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: '500',
    color: '#94A3B8',
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  contactsSection: {
    width: '100%',
    marginTop: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 28,
    gap: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderStyle: 'dashed',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#94A3B8',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 10,
    gap: 12,
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E6F9F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactAvatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F766E',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  contactNumber: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  addContactTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 8,
    marginBottom: 10,
  },
  formRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    height: 46,
    fontSize: 14,
    color: '#0F172A',
  },
  nameInput: {
    flex: 1,
  },
  numberInput: {
    flex: 1.4,
  },
  addButton: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#36D1B6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SOSScreen;
