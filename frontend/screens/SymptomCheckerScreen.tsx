import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
  Linking,
  TouchableOpacity,
  Platform
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import { router } from 'expo-router';
import { checkSymptoms } from '../utils/symptomMatcher';
import {
  SymptomCheckResult,
  SymptomId,
  TriageSeverity
} from '../types/symptomChecker.types';
import { AnimatedCard } from '../components/AnimatedCard';
import emergenciesData from '../data/emergencies.json';

interface SymptomOption {
  id: SymptomId;
  label: string;
  icon: string;
}

const SymptomCheckerScreen = () => {
  const insets = useSafeAreaInsets();
  const { t, language } = useLanguage();
  const [selectedSymptoms, setSelectedSymptoms] = useState<SymptomId[]>([]);
  const [triageResult, setTriageResult] = useState<SymptomCheckResult | null>(
    null
  );

  const symptoms: SymptomOption[] = [
    { id: 'chestPain', label: t.symptoms.chestPain, icon: 'heart' },
    { id: 'radiatingPain', label: t.symptoms.radiatingPain, icon: 'bolt' },
    { id: 'breathingDifficulty', label: t.symptoms.breathingDifficulty, icon: 'wind' },
    { id: 'notBreathing', label: t.symptoms.notBreathing, icon: 'lungs-virus' },
    { id: 'noPulse', label: t.symptoms.noPulse, icon: 'heartbeat' },
    { id: 'heavyBleeding', label: t.symptoms.heavyBleeding, icon: 'tint' },
    { id: 'vomitingBlood', label: t.symptoms.vomitingBlood, icon: 'exclamation-triangle' },
    { id: 'unconscious', label: t.symptoms.unconscious, icon: 'user-alt-slash' },
    { id: 'burnInjury', label: t.symptoms.burnInjury, icon: 'fire' },
    { id: 'extensiveBurn', label: t.symptoms.extensiveBurn, icon: 'fire-alt' },
    { id: 'snakeBiteMarks', label: t.symptoms.snakeBiteMarks, icon: 'skull-crossbones' },
    { id: 'swellingAtBiteSite', label: t.symptoms.swellingAtBiteSite, icon: 'band-aid' },
    { id: 'numbnessOrTingling', label: t.symptoms.numbnessOrTingling, icon: 'feather-alt' },
    { id: 'weakPulse', label: t.symptoms.weakPulse, icon: 'wave-square' },
    { id: 'suddenWeakness', label: t.symptoms.suddenWeakness, icon: 'battery-quarter' },
    { id: 'coldSweating', label: t.symptoms.coldSweating, icon: 'temperature-low' },
    { id: 'dizziness', label: t.symptoms.dizziness, icon: 'sync-alt' },
    { id: 'nauseaVomiting', label: t.symptoms.nauseaVomiting, icon: 'dizzy' },
    { id: 'bonePain', label: t.symptoms.bonePain, icon: 'bone' }
  ];

  const toggleSymptom = (symptomId: SymptomId) => {
    if (selectedSymptoms.includes(symptomId)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptomId));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptomId]);
    }
  };

  const handleCheck = () => {
    if (selectedSymptoms.length === 0) {
      Alert.alert('No Symptoms Selected', t.symptoms.selectAtLeastOne);
      return;
    }

    const result = checkSymptoms(selectedSymptoms);
    setTriageResult(result);
  };

  const handleCallEmergency = (phone = '108') => {
    const phoneUrl = `tel:${phone}`;
    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(phoneUrl);
        } else {
          Alert.alert(
            `Emergency Call (${phone})`,
            `Calling ${phone} is not supported on this device/simulator. Please dial ${phone} directly on your phone.`
          );
        }
      })
      .catch(() => {
        Alert.alert(
          `Emergency Call (${phone})`,
          `Please dial ${phone} immediately on your phone.`
        );
      });
  };

  const getEmergencyTitle = (emergencyId: string) => {
    const emergency = emergenciesData.emergencies.find(
      (e: any) => e.id === emergencyId
    );
    if (!emergency) return emergencyId;
    if (typeof emergency.title === 'object') {
      return (
        (emergency.title as Record<string, string>)[language] ||
        (emergency.title as Record<string, string>).en
      );
    }
    return emergency.title;
  };

  const getSeverityBadgeStyle = (severity: TriageSeverity) => {
    switch (severity) {
      case TriageSeverity.CRITICAL:
        return {
          container: styles.badgeCritical,
          text: styles.badgeCriticalText,
          label: t.symptoms.severityCritical
        };
      case TriageSeverity.URGENT:
        return {
          container: styles.badgeUrgent,
          text: styles.badgeUrgentText,
          label: t.symptoms.severityUrgent
        };
      case TriageSeverity.FIRST_AID:
      default:
        return {
          container: styles.badgeFirstAid,
          text: styles.badgeFirstAidText,
          label: t.symptoms.severityFirstAid
        };
    }
  };

  const handleViewGuide = (emergencyId: string) => {
    router.push(`/emergency-guide?id=${emergencyId}`);
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setTriageResult(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <AnimatedCard onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </AnimatedCard>
        <Text style={styles.headerTitle}>{t.symptoms.title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          !triageResult && { paddingBottom: 100 + insets.bottom }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {triageResult && triageResult.isCritical && (
          <View style={styles.criticalBanner}>
            <View style={styles.criticalBannerHeader}>
              <Ionicons name="warning" size={22} color="#DC2626" />
              <Text style={styles.criticalBannerTitle} numberOfLines={1}>
                {t.symptoms.criticalAlertTitle}
              </Text>
            </View>
            <Text style={styles.criticalBannerSub}>
              {t.symptoms.criticalAlertSub}
            </Text>
            <View style={styles.criticalButtonRow}>
              <TouchableOpacity
                style={styles.call108Button}
                activeOpacity={0.85}
                onPress={() => handleCallEmergency('108')}
              >
                <Ionicons name="call" size={16} color="#FFFFFF" />
                <Text style={styles.call108ButtonText} numberOfLines={1}>
                  {t.symptoms.callAmbulanceBtn}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.call112Button}
                activeOpacity={0.85}
                onPress={() => handleCallEmergency('112')}
              >
                <Ionicons name="call-outline" size={16} color="#DC2626" />
                <Text style={styles.call112ButtonText} numberOfLines={1}>
                  {t.symptoms.callEmergency112}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {triageResult && (
          <View style={styles.resultContainer}>
            {triageResult.fallback && (
              <View style={styles.fallbackCard}>
                <View style={styles.fallbackHeader}>
                  <Ionicons name="alert-circle" size={26} color="#EA580C" />
                  <Text style={styles.fallbackTitle}>
                    {t.symptoms.fallbackTitle}
                  </Text>
                </View>
                <Text style={styles.fallbackDesc}>
                  {t.symptoms.fallbackDesc}
                </Text>
                <View style={styles.fallbackButtonRow}>
                  <TouchableOpacity
                    style={styles.call108Button}
                    activeOpacity={0.85}
                    onPress={() => handleCallEmergency('108')}
                  >
                    <Ionicons name="call" size={16} color="#FFFFFF" />
                    <Text style={styles.call108ButtonText} numberOfLines={1}>
                      {t.symptoms.callAmbulanceBtn}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.call112OutlineButton}
                    activeOpacity={0.85}
                    onPress={() => handleCallEmergency('112')}
                  >
                    <Ionicons name="call-outline" size={16} color="#0F172A" />
                    <Text style={styles.call112OutlineText} numberOfLines={1}>
                      {t.symptoms.callEmergency112}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {triageResult.primary && (
              <View style={styles.resultCard}>
                <View style={styles.resultHeaderRow}>
                  <Text style={styles.resultBadgeText}>
                    {t.symptoms.recommended}
                  </Text>
                  {(() => {
                    const badge = getSeverityBadgeStyle(
                      triageResult.primary.severity
                    );
                    return (
                      <View style={[styles.badgeBase, badge.container]}>
                        <Text style={[styles.badgeTextBase, badge.text]}>
                          {badge.label}
                        </Text>
                      </View>
                    );
                  })()}
                </View>

                <Text style={styles.resultEmergencyTitle}>
                  {getEmergencyTitle(triageResult.primary.emergencyId)}
                </Text>

                <View style={styles.confidenceRow}>
                  <Text style={styles.confidenceText}>
                    Match Confidence: {triageResult.primary.confidence}%
                  </Text>
                  {triageResult.primary.hardFlagTriggered && (
                    <View style={styles.hardFlagTag}>
                      <Ionicons name="shield-checkmark" size={12} color="#DC2626" />
                      <Text style={styles.hardFlagTagText}>Red Flag Priority</Text>
                    </View>
                  )}
                </View>

                <AnimatedCard
                  style={[
                    styles.viewGuideButton,
                    triageResult.primary.severity === TriageSeverity.CRITICAL
                      ? styles.viewGuideButtonCritical
                      : styles.viewGuideButtonStandard
                  ]}
                  onPress={() =>
                    handleViewGuide(triageResult.primary!.emergencyId)
                  }
                >
                  <Text style={styles.viewGuideButtonText}>
                    {t.symptoms.viewGuide}
                  </Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                </AnimatedCard>
              </View>
            )}

            {triageResult.secondary && triageResult.secondary.length > 0 && (
              <View style={styles.secondarySection}>
                <Text style={styles.secondarySectionTitle}>
                  {t.symptoms.alsoPossible}
                </Text>
                {triageResult.secondary.map((match) => {
                  const badge = getSeverityBadgeStyle(match.severity);
                  return (
                    <View key={match.emergencyId} style={styles.secondaryCard}>
                      <View style={styles.secondaryCardTop}>
                        <Text style={styles.secondaryEmergencyTitle}>
                          {getEmergencyTitle(match.emergencyId)}
                        </Text>
                        <View style={[styles.badgeBase, badge.container]}>
                          <Text style={[styles.badgeTextBase, badge.text]}>
                            {badge.label}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.secondaryCardBottom}>
                        <Text style={styles.secondaryConfidence}>
                          Confidence: {match.confidence}%
                        </Text>
                        <TouchableOpacity
                          style={styles.secondaryGuideButton}
                          onPress={() => handleViewGuide(match.emergencyId)}
                        >
                          <Text style={styles.secondaryGuideText}>
                            {t.symptoms.viewGuide}
                          </Text>
                          <Ionicons
                            name="chevron-forward"
                            size={16}
                            color="#36D1B6"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            <TouchableOpacity
              style={styles.resetButton}
              activeOpacity={0.8}
              onPress={handleReset}
            >
              <Ionicons name="refresh" size={18} color="#334155" />
              <Text style={styles.resetButtonText}>{t.symptoms.checkAgain}</Text>
            </TouchableOpacity>
          </View>
        )}

        {!triageResult && (
          <>
            <Text style={styles.subtitle}>{t.symptoms.subtitle}</Text>
            <View style={styles.symptomsContainer}>
              {symptoms.map((symptom) => {
                const isSelected = selectedSymptoms.includes(symptom.id);
                return (
                  <AnimatedCard
                    key={symptom.id}
                    style={[
                      styles.symptomCard,
                      isSelected && styles.symptomCardSelected
                    ]}
                    onPress={() => toggleSymptom(symptom.id)}
                  >
                    <View style={styles.symptomContent}>
                      <View
                        style={[
                          styles.iconContainer,
                          isSelected && styles.iconContainerSelected
                        ]}
                      >
                        <FontAwesome5
                          name={symptom.icon}
                          size={17}
                          color={isSelected ? '#FFFFFF' : '#36D1B6'}
                        />
                      </View>
                      <Text
                        style={[
                          styles.symptomText,
                          isSelected && styles.symptomTextSelected
                        ]}
                      >
                        {symptom.label}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.checkbox,
                        isSelected && styles.checkboxSelected
                      ]}
                    >
                      {isSelected && (
                        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                      )}
                    </View>
                  </AnimatedCard>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>

      {!triageResult && (
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom > 0 ? insets.bottom + 12 : 16 }]}>
          <AnimatedCard
            style={[
              styles.checkButton,
              selectedSymptoms.length === 0 && styles.checkButtonDisabled
            ]}
            onPress={handleCheck}
          >
            <Text style={styles.checkButtonText}>
              {t.symptoms.checkButton}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </AnimatedCard>
        </View>
      )}
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40
  },
  scrollContentWithBottomBar: {
    paddingBottom: 100
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 18,
    textAlign: 'center'
  },
  criticalBanner: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20
  },
  criticalBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6
  },
  criticalBannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#991B1B',
    flex: 1,
    letterSpacing: -0.3
  },
  criticalBannerSub: {
    fontSize: 13,
    color: '#7F1D1D',
    lineHeight: 18,
    marginBottom: 14,
    fontWeight: '500'
  },
  criticalButtonRow: {
    flexDirection: 'row',
    gap: 10
  },
  call108Button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12
  },
  call108ButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14
  },
  call112Button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FEE2E2',
    borderColor: '#F87171',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12
  },
  call112ButtonText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 14
  },
  fallbackCard: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FDBA74',
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    marginBottom: 18
  },
  fallbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8
  },
  fallbackTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#9A3412',
    flex: 1
  },
  fallbackDesc: {
    fontSize: 13.5,
    color: '#7C2D12',
    lineHeight: 19,
    marginBottom: 14
  },
  fallbackButtonRow: {
    flexDirection: 'row',
    gap: 10
  },
  call112OutlineButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12
  },
  call112OutlineText: {
    color: '#0F172A',
    fontWeight: '600',
    fontSize: 14
  },
  symptomsContainer: {
    gap: 10,
    marginBottom: 20
  },
  symptomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1
  },
  symptomCardSelected: {
    backgroundColor: '#E6F9F5',
    borderColor: '#36D1B6',
    borderWidth: 1.5
  },
  symptomContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
    paddingRight: 10
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconContainerSelected: {
    backgroundColor: '#36D1B6'
  },
  symptomText: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '600',
    flex: 1
  },
  symptomTextSelected: {
    color: '#0F172A',
    fontWeight: '700'
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkboxSelected: {
    backgroundColor: '#36D1B6',
    borderColor: '#36D1B6'
  },
  checkButton: {
    flexDirection: 'row',
    backgroundColor: '#36D1B6',
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#36D1B6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4
  },
  checkButtonDisabled: {
    backgroundColor: '#CBD5E1',
    shadowOpacity: 0,
    elevation: 0
  },
  checkButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700'
  },
  resultContainer: {
    marginTop: 4,
    marginBottom: 24
  },
  resultCard: {
    backgroundColor: '#F8FAFC',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16
  },
  resultHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  resultBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B'
  },
  badgeBase: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1
  },
  badgeTextBase: {
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  badgeCritical: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444'
  },
  badgeCriticalText: {
    color: '#B91C1C'
  },
  badgeUrgent: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B'
  },
  badgeUrgentText: {
    color: '#B45309'
  },
  badgeFirstAid: {
    backgroundColor: '#E6F9F5',
    borderColor: '#36D1B6'
  },
  badgeFirstAidText: {
    color: '#0F766E'
  },
  resultEmergencyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    letterSpacing: -0.5
  },
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16
  },
  confidenceText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500'
  },
  hardFlagTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6
  },
  hardFlagTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B91C1C'
  },
  viewGuideButton: {
    flexDirection: 'row',
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  viewGuideButtonCritical: {
    backgroundColor: '#DC2626'
  },
  viewGuideButtonStandard: {
    backgroundColor: '#0F172A'
  },
  viewGuideButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700'
  },
  secondarySection: {
    marginBottom: 16
  },
  secondarySectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 10
  },
  secondaryCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8
  },
  secondaryCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  secondaryEmergencyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A'
  },
  secondaryCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  secondaryConfidence: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500'
  },
  secondaryGuideButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  secondaryGuideText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#36D1B6'
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    marginTop: 6
  },
  resetButtonText: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '700'
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 10
  }
});

export default SymptomCheckerScreen;