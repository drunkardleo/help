import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, Image, StatusBar, Alert, Animated, Easing } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useLanguage } from '../contexts/LanguageContext';
import { router, useLocalSearchParams } from 'expo-router';
import { AnimatedCard } from '../components/AnimatedCard';
import { CPRBeatCircle } from '../components/CPRBeatCircle';
import emergenciesData from '../data/emergencies.json';

interface Emergency {
  id: string;
  title: string | Record<string, string>;
  steps?: any[];
  subsections?: Array<{
    id: string;
    title: Record<string, string>;
    steps: any[];
  }>;
}

const emergencyImages: Record<string, any> = {
  shock_step1: require('../assets/images/shock/shock_step1.jpeg'),
  shock_step2: require('../assets/images/shock/shock_step2.jpeg'),
  shock_step3: require('../assets/images/shock/shock_step3.jpeg'),
  shock_step4: require('../assets/images/shock/shock_step4.jpeg'),
  shock_step5: require('../assets/images/shock/shock_step5.jpeg'),
  shock_step6: require('../assets/images/shock/shock_step6.jpeg'),
  shock_step7: require('../assets/images/shock/shock_step7.jpeg'),
  severe_bleeding_step_1: require('../assets/images/bleeding/severe_bleeding_step_1.jpeg'),
  severe_bleeding_step_2: require('../assets/images/bleeding/severe_bleeding_step_2.jpeg'),
  severe_bleeding_step_3: require('../assets/images/bleeding/severe_bleeding_step_3.jpeg'),
  severe_bleeding_step_4: require('../assets/images/bleeding/severe_bleeding_step_4.jpeg'),
  severe_bleeding_step_5: require('../assets/images/bleeding/severe_bleeding_step_5.jpeg'),
  severe_bleeding_step_6: require('../assets/images/bleeding/severe_bleeding_step_6.jpg'),
  severe_bleeding_step_7: require('../assets/images/bleeding/severe_bleeding_step_7.jpg'),
};

const severeBleedingAudios: Record<string, Record<number, any>> = {
  en: {
    0: require('../assets/audio/english/severe_bleeding/step1.mp3'),
    1: require('../assets/audio/english/severe_bleeding/step2.mp3'),
    2: require('../assets/audio/english/severe_bleeding/step3.mp3'),
    3: require('../assets/audio/english/severe_bleeding/step4.mp3'),
    4: require('../assets/audio/english/severe_bleeding/step5.mp3'),
    5: require('../assets/audio/english/severe_bleeding/step6.mp3'),
  },
  hi: {
    0: require('../assets/audio/hindi/severe_bleeding/step1.mp3'),
    1: require('../assets/audio/hindi/severe_bleeding/step2.mp3'),
    2: require('../assets/audio/hindi/severe_bleeding/step3.mp3'),
    3: require('../assets/audio/hindi/severe_bleeding/step4.mp3'),
    4: require('../assets/audio/hindi/severe_bleeding/step5.mp3'),
    5: require('../assets/audio/hindi/severe_bleeding/step6.mp3'),
  },
};

const burnsAudios: Record<string, Record<number, any>> = {
  en: {
    0: require('../assets/audio/english/burns/step1.mp3'),
    1: require('../assets/audio/english/burns/step2.mp3'),
    2: require('../assets/audio/english/burns/step3.mp3'),
    3: require('../assets/audio/english/burns/step4.mp3'),
    4: require('../assets/audio/english/burns/step5.mp3'),
    5: require('../assets/audio/english/burns/step6.mp3'),
    6: require('../assets/audio/english/burns/step7.mp3'),
  },
  hi: {
    0: require('../assets/audio/hindi/burns/step1.mp3'),
    1: require('../assets/audio/hindi/burns/step2.mp3'),
    2: require('../assets/audio/hindi/burns/step3.mp3'),
    3: require('../assets/audio/hindi/burns/step4.mp3'),
    4: require('../assets/audio/hindi/burns/step5.mp3'),
    5: require('../assets/audio/hindi/burns/step6.mp3'),
    6: require('../assets/audio/hindi/burns/step7.mp3'),
  },
};

const shockAudios: Record<string, Record<number, any>> = {
  en: {
    0: require('../assets/audio/english/shock/step1.mp3'),
    1: require('../assets/audio/english/shock/step2.mp3'),
    2: require('../assets/audio/english/shock/step3.mp3'),
    3: require('../assets/audio/english/shock/step4.mp3'),
    4: require('../assets/audio/english/shock/step5.mp3'),
    5: require('../assets/audio/english/shock/step6.mp3'),
    6: require('../assets/audio/english/shock/step7.mp3'),
  },
  hi: {
    0: require('../assets/audio/hindi/shock/step1.mp3'),
    1: require('../assets/audio/hindi/shock/step2.mp3'),
    2: require('../assets/audio/hindi/shock/step3.mp3'),
    3: require('../assets/audio/hindi/shock/step4.mp3'),
    4: require('../assets/audio/hindi/shock/step5.mp3'),
    5: require('../assets/audio/hindi/shock/step6.mp3'),
    6: require('../assets/audio/hindi/shock/step7.mp3'),
  },
};

const heartAttackAudios: Record<string, Record<number, any>> = {
  en: {
    0: require('../assets/audio/english/heart_attack/step1.mp3'),
    1: require('../assets/audio/english/heart_attack/step2.mp3'),
    2: require('../assets/audio/english/heart_attack/step3.mp3'),
    3: require('../assets/audio/english/heart_attack/step4.mp3'),
    4: require('../assets/audio/english/heart_attack/step5.mp3'),
    5: require('../assets/audio/english/heart_attack/step6.mp3'),
    6: require('../assets/audio/english/heart_attack/step7.mp3'),
  },
  hi: {
    0: require('../assets/audio/hindi/heart_attack/step1.mp3'),
    1: require('../assets/audio/hindi/heart_attack/step2.mp3'),
    2: require('../assets/audio/hindi/heart_attack/step3.mp3'),
    3: require('../assets/audio/hindi/heart_attack/step4.mp3'),
    4: require('../assets/audio/hindi/heart_attack/step5.mp3'),
    5: require('../assets/audio/hindi/heart_attack/step6.mp3'),
    6: require('../assets/audio/hindi/heart_attack/step7.mp3'),
  },
};

const cprAdultAudios: Record<string, Record<number, any>> = {
  en: {
    0: require('../assets/audio/english/cpr/adult/step1.mp3'),
    1: require('../assets/audio/english/cpr/adult/step2.mp3'),
    2: require('../assets/audio/english/cpr/adult/step3.mp3'),
    3: require('../assets/audio/english/cpr/adult/step4.mp3'),
    4: require('../assets/audio/english/cpr/adult/step5.mp3'),
    5: require('../assets/audio/english/cpr/adult/step6.mp3'),
    6: require('../assets/audio/english/cpr/adult/step7.mp3'),
  },
  hi: {
    0: require('../assets/audio/hindi/cpr/adult/step1.mp3'),
    1: require('../assets/audio/hindi/cpr/adult/step2.mp3'),
    2: require('../assets/audio/hindi/cpr/adult/step3.mp3'),
    3: require('../assets/audio/hindi/cpr/adult/step4.mp3'),
    4: require('../assets/audio/hindi/cpr/adult/step5.mp3'),
    5: require('../assets/audio/hindi/cpr/adult/step6.mp3'),
    6: require('../assets/audio/hindi/cpr/adult/step7.mp3'),
  },
};

const cprChildAudios: Record<string, Record<number, any>> = {
  en: {
    0: require('../assets/audio/english/cpr/child/step1.mp3'),
    1: require('../assets/audio/english/cpr/child/step2.mp3'),
    2: require('../assets/audio/english/cpr/child/step3.mp3'),
    3: require('../assets/audio/english/cpr/child/step4.mp3'),
    4: require('../assets/audio/english/cpr/child/step5.mp3'),
    5: require('../assets/audio/english/cpr/child/step6.mp3'),
    6: require('../assets/audio/english/cpr/child/step7.mp3'),
  },
  hi: {
    0: require('../assets/audio/hindi/cpr/child/step1.mp3'),
    1: require('../assets/audio/hindi/cpr/child/step2.mp3'),
    2: require('../assets/audio/hindi/cpr/child/step3.mp3'),
    3: require('../assets/audio/hindi/cpr/child/step4.mp3'),
    4: require('../assets/audio/hindi/cpr/child/step5.mp3'),
    5: require('../assets/audio/hindi/cpr/child/step6.mp3'),
    6: require('../assets/audio/hindi/cpr/child/step7.mp3'),
  },
};

const cprBabyAudios: Record<string, Record<number, any>> = {
  en: {
    0: require('../assets/audio/english/cpr/baby/step1.mp3'),
    1: require('../assets/audio/english/cpr/baby/step2.mp3'),
    2: require('../assets/audio/english/cpr/baby/step3.mp3'),
    3: require('../assets/audio/english/cpr/baby/step4.mp3'),
    4: require('../assets/audio/english/cpr/baby/step5.mp3'),
    5: require('../assets/audio/english/cpr/baby/step6.mp3'),
    6: require('../assets/audio/english/cpr/baby/step7.mp3'),
  },
  hi: {
    0: require('../assets/audio/hindi/cpr/baby/step1.mp3'),
    1: require('../assets/audio/hindi/cpr/baby/step2.mp3'),
    2: require('../assets/audio/hindi/cpr/baby/step3.mp3'),
    3: require('../assets/audio/hindi/cpr/baby/step4.mp3'),
    4: require('../assets/audio/hindi/cpr/baby/step5.mp3'),
    5: require('../assets/audio/hindi/cpr/baby/step6.mp3'),
    6: require('../assets/audio/hindi/cpr/baby/step7.mp3'),
  },
};

const snakeBiteAudios: Record<string, Record<number, any>> = {
  en: {
    0: require('../assets/audio/english/snake_poison/step1.mp3'),
    1: require('../assets/audio/english/snake_poison/step2.mp3'),
    2: require('../assets/audio/english/snake_poison/step3.mp3'),
    3: require('../assets/audio/english/snake_poison/step4.mp3'),
    4: require('../assets/audio/english/snake_poison/step5.mp3'),
    5: require('../assets/audio/english/snake_poison/step6.mp3'),
    6: require('../assets/audio/english/snake_poison/step7.mp3'),
    7: require('../assets/audio/english/snake_poison/step8.mp3'),
    8: require('../assets/audio/english/snake_poison/step9.mp3'),
    9: require('../assets/audio/english/snake_poison/step10.mp3'),
  },
  hi: {
    0: require('../assets/audio/hindi/snake_poison/step1.mp3'),
    1: require('../assets/audio/hindi/snake_poison/step2.mp3'),
    2: require('../assets/audio/hindi/snake_poison/step3.mp3'),
    3: require('../assets/audio/hindi/snake_poison/step4.mp3'),
    4: require('../assets/audio/hindi/snake_poison/step5.mp3'),
    5: require('../assets/audio/hindi/snake_poison/step6.mp3'),
    6: require('../assets/audio/hindi/snake_poison/step7.mp3'),
    7: require('../assets/audio/hindi/snake_poison/step8.mp3'),
    8: require('../assets/audio/hindi/snake_poison/step9.mp3'),
    9: require('../assets/audio/hindi/snake_poison/step10.mp3'),
  },
};






const EmergencyGuideScreen = () => {
  const insets = useSafeAreaInsets();
  const { t, language } = useLanguage();
  const params = useLocalSearchParams();
  const emergencyId = params.id as string;
  const cprType = params.type as string | undefined;

  const [currentStep, setCurrentStep] = useState(0);
  const [emergency, setEmergency] = useState<Emergency | null>(null);
  const [steps, setSteps] = useState<any[]>([]);
  const [title, setTitle] = useState('');

  const soundRef = useRef<Audio.Sound | null>(null);
  const playTokenRef = useRef<number>(0);
  const stepProgress = useRef(new Animated.Value(0)).current;

  const stopCurrentSound = async () => {
    if (soundRef.current) {
      const s = soundRef.current;
      soundRef.current = null;
      try {
        await s.stopAsync();
        await s.unloadAsync();
      } catch {}
    }
  };

  useEffect(() => {
    let isMounted = true;
    const currentToken = ++playTokenRef.current;

    const playStepAudio = async () => {
      await stopCurrentSound();

      if (!isMounted || currentToken !== playTokenRef.current) {
        return;
      }

      const activeLang = language === 'hi' ? 'hi' : 'en';
      const isBleeding = emergencyId === 'bleeding' || emergencyId === 'severe_bleeding';
      const isBurns = emergencyId === 'burns';
      const isShock = emergencyId === 'shock';
      const isHeartAttack = emergencyId === 'heart_attack';
      const isCpr = emergencyId === 'cpr';
      const isSnakeBite = emergencyId === 'snake_bite';
      const audioSource = isBleeding
        ? severeBleedingAudios[activeLang]?.[currentStep]
        : isBurns
        ? burnsAudios[activeLang]?.[currentStep]
        : isShock
        ? shockAudios[activeLang]?.[currentStep]
        : isHeartAttack
        ? heartAttackAudios[activeLang]?.[currentStep]
        : isCpr
        ? (cprType === 'baby' ? cprBabyAudios[activeLang]?.[currentStep] : cprType === 'child' ? cprChildAudios[activeLang]?.[currentStep] : cprAdultAudios[activeLang]?.[currentStep])
        : isSnakeBite
        ? snakeBiteAudios[activeLang]?.[currentStep]
        : null;

      if (!audioSource) {
        return;
      }

      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
        });

        if (!isMounted || currentToken !== playTokenRef.current) {
          return;
        }

        const { sound } = await Audio.Sound.createAsync(
          audioSource,
          { shouldPlay: true, volume: 1.0 }
        );

        if (!isMounted || currentToken !== playTokenRef.current) {
          await sound.unloadAsync().catch(() => {});
          return;
        }

        soundRef.current = sound;
      } catch {}
    };

    playStepAudio();

    return () => {
      isMounted = false;
      stopCurrentSound();
    };
  }, [currentStep, emergencyId, cprType, language]);

  useEffect(() => {
    stepProgress.setValue(0);

    if (steps.length === 0) return;

    const anim = Animated.timing(stepProgress, {
      toValue: 1,
      duration: 15000,
      easing: Easing.linear,
      useNativeDriver: false,
    });

    anim.start(({ finished }) => {
      if (finished) {
        if (currentStep < steps.length - 1) {
          setCurrentStep((prev) => prev + 1);
        }
      }
    });

    return () => {
      anim.stop();
    };
  }, [currentStep, steps.length]);

  useEffect(() => {
    const foundEmergency = emergenciesData.emergencies.find((e: any) => e.id === emergencyId);
    if (foundEmergency) {
      setEmergency(foundEmergency);
      
      if (emergencyId === 'cpr' && cprType && foundEmergency.subsections) {
        const subsection = foundEmergency.subsections.find((s: any) => s.id === cprType);
        if (subsection) {
          setSteps(subsection.steps);
          const translatedTitle = subsection.title[language] || subsection.title.en;
          setTitle(translatedTitle);
        }
      } else if (foundEmergency.steps) {
        setSteps(foundEmergency.steps);
        const translatedTitle = foundEmergency.title[language] || foundEmergency.title.en;
        setTitle(translatedTitle);
      }
    }
  }, [emergencyId, cprType, language]); 

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

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    await stopCurrentSound();
    router.back();
  };

  const handleBack = async () => {
    await stopCurrentSound();
    router.back();
  };

  if (!emergency || steps.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.header}>
          <AnimatedCard onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </AnimatedCard>
          <Text style={styles.headerTitle}>Loading...</Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>
    );
  }

  const currentStepText = typeof steps[currentStep] === 'object' 
    ? (steps[currentStep][language] || steps[currentStep].en)
    : steps[currentStep];
  
  const currentStepData = steps[currentStep];
  const hasImage = currentStepData && typeof currentStepData === 'object' && currentStepData.image;
  const stepImage = hasImage ? emergencyImages[currentStepData.image] : null;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <AnimatedCard onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </AnimatedCard>
        <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 + insets.bottom }]} showsVerticalScrollIndicator={false}>
        <Text style={styles.stepIndicator}>
          {t.guide.stepOf.replace('{{current}}', (currentStep + 1).toString()).replace('{{total}}', steps.length.toString())}
        </Text>

        <View style={styles.segmentedProgressContainer}>
          {steps.map((_, index) => {
            let widthInterpolation: any;
            if (index < currentStep) {
              widthInterpolation = '100%';
            } else if (index === currentStep) {
              widthInterpolation = stepProgress.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              });
            } else {
              widthInterpolation = '0%';
            }

            return (
              <View key={index} style={styles.segmentTrack}>
                <Animated.View
                  style={[
                    styles.segmentFill,
                    { width: widthInterpolation },
                  ]}
                />
              </View>
            );
          })}
        </View>

        {emergencyId === 'cpr' && (
          (cprType === 'adult' && currentStep === 5) ||
          (cprType === 'baby' && currentStep === 6) ||
          (cprType === 'child' && currentStep === 4) ||
          (!cprType && currentStep === 4)
        ) ? (
          <CPRBeatCircle />
        ) : stepImage ? (
          <Image 
            source={stepImage} 
            style={styles.stepImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="medical" size={48} color="#36D1B6" />
            <Text style={styles.placeholderText}>{t.guide.imagePlaceholder}</Text>
          </View>
        )}

        <View style={styles.stepContent}>
          <Text style={styles.stepNumber}>Step {currentStep + 1}</Text>
          <Text style={styles.stepText}>{currentStepText}</Text>
        </View>

        <View style={styles.navigationButtons}>
          <AnimatedCard
            style={[styles.navButton, currentStep === 0 && styles.navButtonDisabled]}
            onPress={handlePrevious}
          >
            <Ionicons name="chevron-back" size={18} color={currentStep === 0 ? '#CBD5E1' : '#0F172A'} />
            <Text style={[styles.navButtonText, currentStep === 0 && styles.navButtonTextDisabled]}>
              {t.guide.previous}
            </Text>
          </AnimatedCard>

          {currentStep === steps.length - 1 ? (
            <AnimatedCard
              style={[styles.navButton, styles.finishButton]}
              onPress={handleFinish}
            >
              <Text style={styles.finishButtonText}>{t.guide.finish}</Text>
              <Ionicons name="checkmark" size={18} color="#FFFFFF" />
            </AnimatedCard>
          ) : (
            <AnimatedCard
              style={[styles.navButton, styles.nextButton]}
              onPress={handleNext}
            >
              <Text style={styles.nextButtonText}>{t.guide.next}</Text>
              <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
            </AnimatedCard>
          )}
        </View>
      </ScrollView>

      <View style={[styles.bottomButtonContainer, { paddingBottom: insets.bottom > 0 ? insets.bottom + 12 : 16 }]}>
        <AnimatedCard style={styles.emergencyButton} onPress={handleEmergencyCall}>
          <Ionicons name="call" size={20} color="#FFFFFF" />
          <Text style={styles.emergencyButtonText}>{t.guide.callEmergency}</Text>
        </AnimatedCard>
      </View>
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
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
    letterSpacing: -0.3,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 110,
  },
  stepIndicator: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
  segmentedProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 24,
    width: '100%',
  },
  segmentTrack: {
    flex: 1,
    height: 5,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  segmentFill: {
    height: '100%',
    backgroundColor: '#36D1B6',
    borderRadius: 3,
  },
  imagePlaceholder: {
    width: '100%',
    height: 180,
    backgroundColor: '#E6F9F5',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  stepImage: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    marginBottom: 24,
  },
  placeholderText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 8,
  },
  stepContent: {
    marginBottom: 32,
    backgroundColor: '#F8FAFC',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  stepNumber: {
    fontSize: 12,
    color: '#36D1B6',
    fontWeight: '800',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  stepText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#0F172A',
    lineHeight: 26,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    gap: 6,
  },
  navButtonDisabled: {
    borderColor: '#F1F5F9',
    backgroundColor: '#F8FAFC',
  },
  navButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  navButtonTextDisabled: {
    color: '#CBD5E1',
  },
  nextButton: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  nextButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  finishButton: {
    backgroundColor: '#36D1B6',
    borderColor: '#36D1B6',
  },
  finishButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  emergencyButton: {
    flexDirection: 'row',
    backgroundColor: '#E02C03',
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#E02C03',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  emergencyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default EmergencyGuideScreen;