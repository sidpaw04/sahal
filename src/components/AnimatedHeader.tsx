import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface AnimatedHeaderProps {
  title?: string;
  subtitle?: string;
}

export const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({ title, subtitle }) => {
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const currentImageIndex = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    const fadeIn = Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    });

    // Image cycling animation with fade transitions
    const cycleImages = Animated.loop(
      Animated.sequence([
        // Fade out
        Animated.timing(currentImageIndex, {
          toValue: 1,
          duration: 15000, // 15 seconds per image - much slower
          useNativeDriver: true,
        }),
        // Fade in
        Animated.timing(currentImageIndex, {
          toValue: 0,
          duration: 15000, // 15 seconds per image - much slower
          useNativeDriver: true,
        }),
      ])
    );

    fadeIn.start();
    cycleImages.start();

    return () => {
      cycleImages.stop();
    };
  }, [fadeAnimation, currentImageIndex]);

  const frenchImages = [
    require('../../assets/paris.jpg'),
    require('../../assets/nice.jpg'),
  ];

  return (
    <View style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
      {/* Fading Image Background */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        {/* Paris Image */}
        <Animated.Image
          source={frenchImages[0]}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
            opacity: currentImageIndex.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [1, 0, 0],
            }),
          }}
        />
        
        {/* Nice Image */}
        <Animated.Image
          source={frenchImages[1]}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
            opacity: currentImageIndex.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, 1, 0],
            }),
          }}
        />
      </Animated.View>

      {/* Overlay for better text readability */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          opacity: fadeAnimation,
        }}
      />

      {/* Header Content - Only show if title is provided */}
      {title && (
        <Animated.View 
          style={{ 
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center',
            opacity: fadeAnimation,
          }}
        >
          <Text style={{ 
            color: '#fff', 
            fontSize: 18, 
            fontWeight: 'bold',
            textShadowColor: 'rgba(0,0,0,0.8)',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 3,
          }}>
            {title}
          </Text>
          {subtitle && (
            <Text style={{ 
              color: 'rgba(255,255,255,0.9)', 
              fontSize: 12, 
              marginTop: 2,
              textShadowColor: 'rgba(0,0,0,0.8)',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 2,
            }}>
              {subtitle}
            </Text>
          )}
        </Animated.View>
      )}
    </View>
  );
}; 