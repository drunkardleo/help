import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Linking, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import { router, useLocalSearchParams } from 'expo-router';
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

const EmergencyGuideScreen = () => {
  const { t, language } = useLanguage();
  const params = useLocalSearchParams();
  const emergencyId = params.id as string;
  const cprType = params.type as string | undefined;

  const [currentStep, setCurrentStep] = useState(0);
  const [emergency, setEmergency] = useState<Emergency | null>(null);
  const [steps, setSteps] = useState<any[]>([]);
  const [title, setTitle] = useState('');

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

  const handleEmergencyCall = () => {
    Linking.openURL('tel:112');
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

  const handleFinish = () => {
    router.back();
  };

  if (!emergency || steps.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#2C3E50" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Loading...</Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>
    );
  }

  const progress = ((currentStep + 1) / steps.length) * 100;
  
  
  const currentStepText = typeof steps[currentStep] === 'object' 
    ? (steps[currentStep][language] || steps[currentStep].en)
    : steps[currentStep];
  
  
  const currentStepData = steps[currentStep];
  const hasImage = currentStepData && typeof currentStepData === 'object' && currentStepData.image;
  const stepImage = hasImage ? emergencyImages[currentStepData.image] : null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {}
        <Text style={styles.stepIndicator}>
          {t.guide.stepOf.replace('{{current}}', (currentStep + 1).toString()).replace('{{total}}', steps.length.toString())}
        </Text>

        {}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>

        {}
        {stepImage ? (
          <Image 
            source={stepImage} 
            style={styles.stepImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={60} color="#BDC3C7" />
            <Text style={styles.placeholderText}>{t.guide.imagePlaceholder}</Text>
          </View>
        )}

        {}
        <View style={styles.stepContent}>
          <Text style={styles.stepNumber}>Step {currentStep + 1}</Text>
          <Text style={styles.stepText}>{currentStepText}</Text>
        </View>

        {}
        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={[styles.navButton, currentStep === 0 && styles.navButtonDisabled]}
            onPress={handlePrevious}
            disabled={currentStep === 0}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={20} color={currentStep === 0 ? '#BDC3C7' : '#3498DB'} />
            <Text style={[styles.navButtonText, currentStep === 0 && styles.navButtonTextDisabled]}>
              {t.guide.previous}
            </Text>
          </TouchableOpacity>

          {currentStep === steps.length - 1 ? (
            <TouchableOpacity
              style={[styles.navButton, styles.finishButton]}
              onPress={handleFinish}
              activeOpacity={0.7}
            >
              <Text style={styles.finishButtonText}>{t.guide.finish}</Text>
              <Ionicons name="checkmark" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.navButton}
              onPress={handleNext}
              activeOpacity={0.7}
            >
              <Text style={styles.navButtonText}>{t.guide.next}</Text>
              <Ionicons name="chevron-forward" size={20} color="#3498DB" />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergencyCall} activeOpacity={0.8}>
          <Ionicons name="call" size={24} color="#FFFFFF" />
          <Text style={styles.emergencyButtonText}>{t.guide.callEmergency}</Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100
  },
  stepIndicator: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '600'
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#ECF0F1',
    borderRadius: 4,
    marginBottom: 24,
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#27AE60',
    borderRadius: 4
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#ECF0F1',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24
  },
  stepImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 24
  },
  placeholderText: {
    fontSize: 14,
    color: '#95A5A6',
    marginTop: 8
  },
  stepContent: {
    marginBottom: 32
  },
  stepNumber: {
    fontSize: 12,
    color: '#3498DB',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase'
  },
  stepText: {
    fontSize: 18,
    color: '#2C3E50',
    lineHeight: 28
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3498DB',
    gap: 8
  },
  navButtonDisabled: {
    borderColor: '#ECF0F1'
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3498DB'
  },
  navButtonTextDisabled: {
    color: '#BDC3C7'
  },
  finishButton: {
    backgroundColor: '#27AE60',
    borderColor: '#27AE60'
  },
  finishButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF'
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#ECF0F1'
  },
  emergencyButton: {
    flexDirection: 'row',
    backgroundColor: '#E74C3C',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    elevation: 4,
    shadowColor: '#E74C3C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6
  },
  emergencyButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold'
  }
});

export default EmergencyGuideScreen;