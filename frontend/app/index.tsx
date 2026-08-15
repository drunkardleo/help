import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { HealIcon } from '../components/HealIcon';

export default function Index() {
  const router = useRouter();

  const logoScale = useRef(new Animated.Value(0.85)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.2)),
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      router.replace('/language-select');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.centerSection}>
        <Animated.View
          style={{
            transform: [{ scale: logoScale }],
            opacity: logoOpacity,
          }}
        >
          <HealIcon size={180} />
        </Animated.View>

        <Animated.View style={[styles.textWrapper, { opacity: contentOpacity }]}>
          <Text style={styles.appTitle}>प्रथम सहाय</Text>
          <Text style={styles.appSubtitle}>First Aid & Emergency Guide</Text>
        </Animated.View>
      </View>

      <Animated.View style={[styles.footer, { opacity: contentOpacity }]}>
        <View style={styles.loaderBar}>
          <View style={styles.loaderProgress} />
        </View>
        <Text style={styles.footerText}>Instant Emergency Care</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 56,
  },
  centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 160,
    height: 160,
  },
  textWrapper: {
    alignItems: 'center',
    marginTop: 20,
  },
  appTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 6,
    letterSpacing: 0.2,
  },
  footer: {
    alignItems: 'center',
    gap: 12,
  },
  loaderBar: {
    width: 48,
    height: 3,
    backgroundColor: '#F1F5F9',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loaderProgress: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E02C03',
    borderRadius: 2,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
});