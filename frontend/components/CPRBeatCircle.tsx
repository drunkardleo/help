import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

interface CPRBeatCircleProps {
  bpm?: number;
  totalBeatsPerCycle?: number;
}

export const CPRBeatCircle: React.FC<CPRBeatCircleProps> = ({
  bpm = 116,
  totalBeatsPerCycle = 30,
}) => {
  const [beatCount, setBeatCount] = useState(1);
  const [isReady, setIsReady] = useState(false);
  const beatIntervalMs = Math.round(60000 / bpm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const coreScale = useRef(new Animated.Value(1)).current;
  const wave1Scale = useRef(new Animated.Value(1)).current;
  const wave1Opacity = useRef(new Animated.Value(0.5)).current;
  const wave2Scale = useRef(new Animated.Value(1)).current;
  const wave2Opacity = useRef(new Animated.Value(0.35)).current;
  const wave3Scale = useRef(new Animated.Value(1)).current;
  const wave3Opacity = useRef(new Animated.Value(0.2)).current;

  const soundRef = useRef<Audio.Sound | null>(null);

  const triggerHaptic = () => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
    } catch {}
  };

  const playBeep = () => {
    try {
      if (soundRef.current) {
        soundRef.current.replayAsync().catch(() => {});
      }
    } catch {}
  };

  useEffect(() => {
    let isMounted = true;

    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
        });
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/audio/cpr_beep.wav'),
          { shouldPlay: false, volume: 1.0 }
        );
        if (isMounted) {
          soundRef.current = sound;
        } else {
          sound.unloadAsync();
        }
      } catch {}
    };

    setupAudio();

    return () => {
      isMounted = false;
      if (soundRef.current) {
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;
    let isMounted = true;

    const animateBeat = () => {
      wave1Scale.setValue(1);
      wave1Opacity.setValue(0.5);
      wave2Scale.setValue(1);
      wave2Opacity.setValue(0.35);
      wave3Scale.setValue(1);
      wave3Opacity.setValue(0.2);

      playBeep();
      triggerHaptic();

      Animated.parallel([
        Animated.sequence([
          Animated.timing(coreScale, {
            toValue: 1.2,
            duration: 65,
            useNativeDriver: true,
          }),
          Animated.timing(coreScale, {
            toValue: 0.95,
            duration: 110,
            useNativeDriver: true,
          }),
          Animated.timing(coreScale, {
            toValue: 1.0,
            duration: 75,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(wave1Scale, {
            toValue: 1.6,
            duration: 280,
            useNativeDriver: true,
          }),
          Animated.timing(wave1Opacity, {
            toValue: 0,
            duration: 280,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(wave2Scale, {
            toValue: 2.1,
            duration: 320,
            useNativeDriver: true,
          }),
          Animated.timing(wave2Opacity, {
            toValue: 0,
            duration: 320,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(wave3Scale, {
            toValue: 2.7,
            duration: 360,
            useNativeDriver: true,
          }),
          Animated.timing(wave3Opacity, {
            toValue: 0,
            duration: 360,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      if (isMounted) {
        setBeatCount((prev) => (prev >= totalBeatsPerCycle ? 1 : prev + 1));
      }
    };

    animateBeat();

    const interval = setInterval(() => {
      if (isMounted) {
        animateBeat();
      }
    }, beatIntervalMs);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [bpm, totalBeatsPerCycle, beatIntervalMs, isReady]);

  return (
    <View style={styles.container}>
      <View style={styles.glowOverlay} />

      <Animated.View
        style={[
          styles.rippleWave,
          {
            transform: [{ scale: wave3Scale }],
            opacity: wave3Opacity,
          },
        ]}
      />

      <Animated.View
        style={[
          styles.rippleWave,
          {
            transform: [{ scale: wave2Scale }],
            opacity: wave2Opacity,
          },
        ]}
      />

      <Animated.View
        style={[
          styles.rippleWave,
          {
            transform: [{ scale: wave1Scale }],
            opacity: wave1Opacity,
          },
        ]}
      />

      <Animated.View
        style={[
          styles.coreCircle,
          {
            transform: [{ scale: coreScale }],
          },
        ]}
      >
        <Text style={styles.pushText}>PUSH</Text>
      </Animated.View>

      <View style={styles.bottomInfo}>
        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>
            Compression <Text style={styles.counterHighlight}>{beatCount}</Text> / {totalBeatsPerCycle}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 220,
    backgroundColor: '#E02C03',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#E02C03',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  glowOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  rippleWave: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  coreCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 10,
  },
  pushText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#E02C03',
    letterSpacing: 1.2,
  },
  bottomInfo: {
    position: 'absolute',
    bottom: 12,
    alignItems: 'center',
  },
  counterBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
  },
  counterText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  counterHighlight: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
  },
});
