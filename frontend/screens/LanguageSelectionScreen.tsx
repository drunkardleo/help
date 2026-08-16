import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageCode } from '../data/translations';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedCard } from '../components/AnimatedCard';
import { PageTransition } from '../components/PageTransition';
import { Audio } from 'expo-av';

interface LangOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
}

const languages: LangOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली' },
  { code: 'bho', name: 'Bhojpuri', nativeName: 'भोजपुरी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
];

const audioFiles: Record<string, any> = {
  en: require('../assets/audio/english.wav'),
  hi: require('../assets/audio/hindi.wav'),
  mr: require('../assets/audio/marathi.wav'),
  mai: require('../assets/audio/maithili.wav'),
  bho: require('../assets/audio/bhojpuri.wav'),
  bn: require('../assets/audio/bengali.wav'),
};

const LanguageSelectionScreen = () => {
  const { setLanguage } = useLanguage();
  const [speakingCode, setSpeakingCode] = useState<LanguageCode | null>(null);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);

  const isMountedRef = useRef(true);
  const currentSoundRef = useRef<Audio.Sound | null>(null);

  const highlightAnims = useRef<Record<string, Animated.Value>>({
    en: new Animated.Value(0),
    hi: new Animated.Value(0),
    mr: new Animated.Value(0),
    mai: new Animated.Value(0),
    bho: new Animated.Value(0),
    bn: new Animated.Value(0),
  }).current;

  useEffect(() => {
    isMountedRef.current = true;

    const initialDelayTimer = setTimeout(() => {
      if (isMountedRef.current) {
        startAudioSequence();
      }
    }, 3500);

    return () => {
      isMountedRef.current = false;
      clearTimeout(initialDelayTimer);
      stopAudio();
    };
  }, []);

  useEffect(() => {
    languages.forEach((lang) => {
      Animated.timing(highlightAnims[lang.code], {
        toValue: lang.code === speakingCode ? 1 : 0,
        duration: 400,
        useNativeDriver: false,
      }).start();
    });
  }, [speakingCode]);

  const stopAudio = async () => {
    isMountedRef.current = false;
    try {
      if (currentSoundRef.current) {
        await currentSoundRef.current.stopAsync();
        await currentSoundRef.current.unloadAsync();
        currentSoundRef.current = null;
      }
    } catch (e) {}
  };

  const startAudioSequence = async () => {
    await stopAudio();
    isMountedRef.current = true;
    setIsPlayingSequence(true);

    for (let i = 0; i < languages.length; i++) {
      if (!isMountedRef.current) break;

      const lang = languages[i];
      setSpeakingCode(lang.code);

      await playAudioTrack(lang.code);

      if (!isMountedRef.current) break;
      await new Promise((res) => setTimeout(res, 500));
    }

    if (isMountedRef.current) {
      setSpeakingCode(null);
      setIsPlayingSequence(false);
    }
  };

  const playAudioTrack = (code: LanguageCode): Promise<void> => {
    return new Promise(async (resolve) => {
      let resolved = false;
      const finish = async () => {
        if (!resolved) {
          resolved = true;
          if (currentSoundRef.current) {
            try {
              await currentSoundRef.current.unloadAsync();
            } catch (e) {}
            currentSoundRef.current = null;
          }
          resolve();
        }
      };

      const timeout = setTimeout(finish, 3000);

      try {
        if (currentSoundRef.current) {
          await currentSoundRef.current.stopAsync();
          await currentSoundRef.current.unloadAsync();
          currentSoundRef.current = null;
        }

        const { sound } = await Audio.Sound.createAsync(
          audioFiles[code],
          { shouldPlay: true },
          (status) => {
            if (status.isLoaded && status.didJustFinish) {
              clearTimeout(timeout);
              finish();
            }
          }
        );

        currentSoundRef.current = sound;
      } catch (err) {
        clearTimeout(timeout);
        finish();
      }
    });
  };

  const handleLanguageSelect = async (code: LanguageCode) => {
    await stopAudio();
    await setLanguage(code);
    router.replace('/home');
  };

  const handleBack = async () => {
    await stopAudio();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/home');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <PageTransition>
      
      <View style={styles.header}>
        <AnimatedCard onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </AnimatedCard>

        <Text style={styles.headerTitle}>भाषा</Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.globeHeaderIcon}>
          <Ionicons name="globe-outline" size={44} color="#334155" />
        </View>

        <Text style={styles.title}>Select Language</Text>
        <Text style={styles.subtitle}>अपनी भाषा चुनें</Text>
        
        <View style={styles.grid}>
          {languages.map((lang) => {
            const isSpeaking = speakingCode === lang.code;
            const anim = highlightAnims[lang.code];

            const backgroundColor = anim.interpolate({
              inputRange: [0, 1],
              outputRange: ['#FFFFFF', '#FFFBEB'],
            });

            const borderColor = anim.interpolate({
              inputRange: [0, 1],
              outputRange: ['#E2E8F0', '#F59E0B'],
            });

            const borderWidth = anim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 2],
            });

            return (
              <Animated.View
                key={lang.code}
                style={[
                  styles.cardWrapper,
                  {
                    backgroundColor,
                    borderColor,
                    borderWidth,
                  },
                  isSpeaking && styles.metallicGlassHighlight,
                ]}
              >
                <AnimatedCard
                  style={styles.languageButtonInner}
                  onPress={() => handleLanguageSelect(lang.code)}
                >
                  {isSpeaking && <View style={styles.glassSheen} />}

                  {isSpeaking && (
                    <View style={styles.speakerBadge}>
                      <Ionicons name="volume-medium" size={14} color="#B45309" />
                    </View>
                  )}

                  <Text style={[styles.nativeText, isSpeaking && styles.goldText]}>
                    {lang.nativeName}
                  </Text>
                  <Text style={[styles.englishText, isSpeaking && styles.goldSubtext]}>
                    {lang.name}
                  </Text>
                </AnimatedCard>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>
      </PageTransition>
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
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  headerSpacer: {
    width: 40,
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
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
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
    justifyContent: 'space-between',
    rowGap: 16,
    width: '100%',
  },
  cardWrapper: {
    width: '48%',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  languageButtonInner: {
    width: '100%',
    paddingVertical: 22,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    position: 'relative',
  },
  metallicGlassHighlight: {
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  glassSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: 'rgba(254, 243, 199, 0.9)',
  },
  speakerBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  nativeText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  englishText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
  },
  goldText: {
    color: '#78350F',
    fontWeight: '800',
  },
  goldSubtext: {
    color: '#92400E',
    fontWeight: '600',
  },
});

export default LanguageSelectionScreen;