import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useLanguage } from '../contexts/LanguageContext';
import { AnimatedCard } from '../components/AnimatedCard';
import snakeGuideData from '../data/snake.json';

const snakeImages: Record<string, any> = {
  indian_cobra: require('../assets/images/snakes/indian_cobra.jpg'),
  common_krait: require('../assets/images/snakes/common_krait.jpg'),
  russells_viper: require('../assets/images/snakes/russells_viper.jpg'),
  saw_scaled_viper: require('../assets/images/snakes/saw_scaled_viper.jpg'),
  king_cobra: require('../assets/images/snakes/king_cobra.jpg'),
  indian_rat_snake: require('../assets/images/snakes/indian_rat_snake.jpg'),
  checkered_keelback: require('../assets/images/snakes/checkered_keelback.jpg'),
  indian_rock_python: require('../assets/images/snakes/indian_rock_python.jpg'),
  common_sand_boa: require('../assets/images/snakes/common_sand_boa.jpg'),
  common_wolf_snake: require('../assets/images/snakes/common_wolf_snake.jpg'),
};

const langKeyMap: Record<string, string> = {
  en: 'english',
  hi: 'hindi',
  mr: 'marathi',
  bn: 'bengali',
  bho: 'bhojpuri',
  mai: 'maithili',
};

const venomStatusLabels: Record<string, { venomous: string; non_venomous: string }> = {
  english: {
    venomous: 'Poisonous (Highly Venomous)',
    non_venomous: 'Non-Poisonous (Harmless to Humans)',
  },
  hindi: {
    venomous: 'विषैला (जहरीला साँप)',
    non_venomous: 'विषहीन (बिना जहर का साँप)',
  },
  marathi: {
    venomous: 'विषारी साप (धोकादायक)',
    non_venomous: 'बिनविषारी साप (निरुपद्रवी)',
  },
  bengali: {
    venomous: 'বিষধর (মারাত্মক বিষযুক্ত)',
    non_venomous: 'নির্বিষ (মানুষের জন্য নিরাপদ)',
  },
  bhojpuri: {
    venomous: 'जहरीला साँप (विषैला)',
    non_venomous: 'बिना जहर के साँप (विषहीन)',
  },
  maithili: {
    venomous: 'विषैला साँप (घातक)',
    non_venomous: 'विषहीन साँप (सुरक्षित)',
  },
};

const sectionTitles: Record<string, { identify: string; description: string }> = {
  english: { identify: 'How to Identify', description: 'Description' },
  hindi: { identify: 'पहचान कैसे करें', description: 'विवरण' },
  marathi: { identify: 'ओळख कशी करावी', description: 'माहिती व स्वरूप' },
  bengali: { identify: 'শনাক্ত করার উপায়', description: 'বিবরণ' },
  bhojpuri: { identify: 'पहचान कइसे करीं', description: 'विवरण' },
  maithili: { identify: 'पहचान कोना करू', description: 'विवरण' },
};

export const SnakeIdentificationScreen = () => {
  const { language, t } = useLanguage();
  const insets = useSafeAreaInsets();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const snakes = snakeGuideData.snake_guide.snakes;
  const currentSnake = snakes[selectedIndex] || snakes[0];
  const langKey = langKeyMap[language] || 'english';

  const namesObj = (currentSnake.names as any)[langKey] || (currentSnake.names as any).english;
  const commonName = namesObj?.common || '';
  const regionalName = namesObj?.regional || '';

  // Title formatted as "Common - Regional"
  const formattedTitle = regionalName && regionalName !== commonName
    ? `${commonName} - ${regionalName}`
    : commonName;

  const scientificName = (currentSnake.names as any)?.scientific || '';
  const isVenomous = currentSnake.venom_status === 'venomous';

  const statusLabel = (venomStatusLabels[langKey] || venomStatusLabels.english)[
    isVenomous ? 'venomous' : 'non_venomous'
  ];

  const identifyList: string[] = (currentSnake.how_to_identify as any)[langKey] ||
    (currentSnake.how_to_identify as any).english || [];

  const shortDesc: string = (currentSnake.short_description as any)[langKey] ||
    (currentSnake.short_description as any).english || '';

  const labels = sectionTitles[langKey] || sectionTitles.english;

  const handleBack = () => {
    router.back();
  };

  const handlePrevious = () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex < snakes.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const snakeImage = snakeImages[currentSnake.id];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header with Snake Name ("Common - Regional") */}
      <View style={styles.header}>
        <AnimatedCard onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </AnimatedCard>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={2}>
            {formattedTitle}
          </Text>
          {scientificName ? (
            <Text style={styles.headerSubtitle}>{scientificName}</Text>
          ) : null}
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Main Snake Details Content */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 110 + insets.bottom }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. IMAGE */}
        <View style={styles.imageCard}>
          {snakeImage ? (
            <Image
              source={snakeImage}
              style={styles.snakeImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <MaterialCommunityIcons name="snake" size={48} color="#94A3B8" />
            </View>
          )}
        </View>

        {/* 2. POISONOUS / VENOMOUS STATUS */}
        <View
          style={[
            styles.poisonousBanner,
            isVenomous ? styles.venomousBanner : styles.nonVenomousBanner,
          ]}
        >
          <MaterialCommunityIcons
            name={isVenomous ? "alert-circle" : "check-circle"}
            size={24}
            color={isVenomous ? "#DC2626" : "#16A34A"}
          />
          <View style={styles.poisonousTextContainer}>
            <Text
              style={[
                styles.poisonousStatusText,
                isVenomous ? styles.venomousText : styles.nonVenomousText,
              ]}
            >
              {statusLabel}
            </Text>
          </View>
        </View>

        {/* 3. DESCRIPTION & HOW TO IDENTIFY */}
        <View style={styles.descriptionCard}>
          <Text style={styles.sectionHeader}>{labels.description}</Text>
          <Text style={styles.descriptionText}>{shortDesc}</Text>

          {identifyList && identifyList.length > 0 && (
            <>
              <View style={styles.divider} />
              <Text style={styles.subHeader}>{labels.identify}</Text>
              {identifyList.map((item, index) => (
                <View key={index} style={styles.featureRow}>
                  <Ionicons name="ellipse" size={7} color="#36D1B6" style={styles.bullet} />
                  <Text style={styles.featureText}>{item}</Text>
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>

      {/* 4. BOTTOM NAVIGATION: Previous & Next Buttons */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom > 0 ? insets.bottom + 12 : 16 }]}>
        <View style={styles.navRow}>
          <AnimatedCard
            style={[styles.navButton, selectedIndex === 0 && styles.navButtonDisabled]}
            onPress={handlePrevious}
          >
            <Ionicons
              name="chevron-back"
              size={20}
              color={selectedIndex === 0 ? '#CBD5E1' : '#0F172A'}
            />
            <Text
              style={[
                styles.navButtonText,
                selectedIndex === 0 && styles.navButtonTextDisabled,
              ]}
            >
              {t.guide.previous || 'Previous'}
            </Text>
          </AnimatedCard>

          <View style={styles.pageIndicatorContainer}>
            <Text style={styles.pageIndicatorText}>
              {selectedIndex + 1} / {snakes.length}
            </Text>
          </View>

          <AnimatedCard
            style={[
              styles.navButton,
              styles.nextButton,
              selectedIndex === snakes.length - 1 && styles.navButtonDisabled,
            ]}
            onPress={handleNext}
          >
            <Text
              style={[
                styles.nextButtonText,
                selectedIndex === snakes.length - 1 && styles.nextButtonTextDisabled,
              ]}
            >
              {t.guide.next || 'Next'}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={selectedIndex === snakes.length - 1 ? '#CBD5E1' : '#FFFFFF'}
            />
          </AnimatedCard>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SnakeIdentificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#64748B',
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  imageCard: {
    width: '100%',
    height: 250,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  snakeImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  poisonousBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
    gap: 10,
  },
  venomousBanner: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  nonVenomousBanner: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  poisonousTextContainer: {
    flex: 1,
  },
  poisonousStatusText: {
    fontSize: 15,
    fontWeight: '700',
  },
  venomousText: {
    color: '#991B1B',
  },
  nonVenomousText: {
    color: '#166534',
  },
  descriptionCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#334155',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  bullet: {
    marginTop: 6,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#475569',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  navButtonDisabled: {
    opacity: 0.45,
    backgroundColor: '#F8FAFC',
  },
  navButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  navButtonTextDisabled: {
    color: '#94A3B8',
  },
  nextButton: {
    backgroundColor: '#36D1B6',
    borderColor: '#36D1B6',
  },
  nextButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  nextButtonTextDisabled: {
    color: '#94A3B8',
  },
  pageIndicatorContainer: {
    paddingHorizontal: 8,
  },
  pageIndicatorText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
});
