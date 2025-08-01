import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';

interface AnimatedBackgroundProps {
  children: React.ReactNode;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ children }) => {
  const backgroundAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const bubble1Animation = useRef(new Animated.Value(0)).current;
  const bubble2Animation = useRef(new Animated.Value(0)).current;
  const bubble3Animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const backgroundLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundAnimation, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(backgroundAnimation, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.02,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    const bubble1Loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bubble1Animation, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(bubble1Animation, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    );

    const bubble2Loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bubble2Animation, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(bubble2Animation, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: true,
        }),
      ])
    );

    const bubble3Loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bubble3Animation, {
          toValue: 1,
          duration: 6000,
          useNativeDriver: true,
        }),
        Animated.timing(bubble3Animation, {
          toValue: 0,
          duration: 6000,
          useNativeDriver: true,
        }),
      ])
    );

    backgroundLoop.start();
    pulseLoop.start();
    bubble1Loop.start();
    bubble2Loop.start();
    bubble3Loop.start();

    return () => {
      backgroundLoop.stop();
      pulseLoop.stop();
      bubble1Loop.stop();
      bubble2Loop.stop();
      bubble3Loop.stop();
    };
  }, [backgroundAnimation, pulseAnimation, bubble1Animation, bubble2Animation, bubble3Animation]);

  return (
    <Animated.View
      style={{
        flex: 1,
        position: 'relative',
        backgroundColor: '#dbeafe',
        opacity: backgroundAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.95, 1],
        }),
        transform: [{ scale: pulseAnimation }],
      }}
    >
      {/* Animated Background Bubbles */}
      <Animated.View
        style={{
          position: 'absolute',
          top: '10%',
          right: '15%',
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          opacity: bubble1Animation,
          transform: [
            {
              scale: bubble1Animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1.2],
              }),
            },
          ],
        }}
      />
      <Animated.View
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '10%',
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          opacity: bubble2Animation,
          transform: [
            {
              scale: bubble2Animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.6, 1.4],
              }),
            },
          ],
        }}
      />
      <Animated.View
        style={{
          position: 'absolute',
          top: '60%',
          right: '5%',
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: 'rgba(251, 146, 60, 0.1)',
          opacity: bubble3Animation,
          transform: [
            {
              scale: bubble3Animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.7, 1.3],
              }),
            },
          ],
        }}
      />
      {children}
    </Animated.View>
  );
};

interface MoneyAnimatedBackgroundProps {
  children: React.ReactNode;
}

export const MoneyAnimatedBackground: React.FC<MoneyAnimatedBackgroundProps> = ({ children }) => {
  const dollarSign1 = useRef(new Animated.Value(0)).current;
  const dollarSign2 = useRef(new Animated.Value(0)).current;
  const euroSign1 = useRef(new Animated.Value(0)).current;
  const euroSign2 = useRef(new Animated.Value(0)).current;
  const coin1 = useRef(new Animated.Value(0)).current;
  const coin2 = useRef(new Animated.Value(0)).current;
  const coin3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const dollar1Loop = Animated.loop(
      Animated.sequence([
        Animated.timing(dollarSign1, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        }),
        Animated.timing(dollarSign1, {
          toValue: 0,
          duration: 8000,
          useNativeDriver: true,
        }),
      ])
    );

    const dollar2Loop = Animated.loop(
      Animated.sequence([
        Animated.timing(dollarSign2, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: true,
        }),
        Animated.timing(dollarSign2, {
          toValue: 0,
          duration: 10000,
          useNativeDriver: true,
        }),
      ])
    );

    const euro1Loop = Animated.loop(
      Animated.sequence([
        Animated.timing(euroSign1, {
          toValue: 1,
          duration: 9000,
          useNativeDriver: true,
        }),
        Animated.timing(euroSign1, {
          toValue: 0,
          duration: 9000,
          useNativeDriver: true,
        }),
      ])
    );

    const euro2Loop = Animated.loop(
      Animated.sequence([
        Animated.timing(euroSign2, {
          toValue: 1,
          duration: 11000,
          useNativeDriver: true,
        }),
        Animated.timing(euroSign2, {
          toValue: 0,
          duration: 11000,
          useNativeDriver: true,
        }),
      ])
    );

    const coin1Loop = Animated.loop(
      Animated.sequence([
        Animated.timing(coin1, {
          toValue: 1,
          duration: 7000,
          useNativeDriver: true,
        }),
        Animated.timing(coin1, {
          toValue: 0,
          duration: 7000,
          useNativeDriver: true,
        }),
      ])
    );

    const coin2Loop = Animated.loop(
      Animated.sequence([
        Animated.timing(coin2, {
          toValue: 1,
          duration: 8500,
          useNativeDriver: true,
        }),
        Animated.timing(coin2, {
          toValue: 0,
          duration: 8500,
          useNativeDriver: true,
        }),
      ])
    );

    const coin3Loop = Animated.loop(
      Animated.sequence([
        Animated.timing(coin3, {
          toValue: 1,
          duration: 9500,
          useNativeDriver: true,
        }),
        Animated.timing(coin3, {
          toValue: 0,
          duration: 9500,
          useNativeDriver: true,
        }),
      ])
    );

    dollar1Loop.start();
    dollar2Loop.start();
    euro1Loop.start();
    euro2Loop.start();
    coin1Loop.start();
    coin2Loop.start();
    coin3Loop.start();

    return () => {
      dollar1Loop.stop();
      dollar2Loop.stop();
      euro1Loop.stop();
      euro2Loop.stop();
      coin1Loop.stop();
      coin2Loop.stop();
      coin3Loop.stop();
    };
  }, [dollarSign1, dollarSign2, euroSign1, euroSign2, coin1, coin2, coin3]);

  return (
    <Animated.View
      style={{
        flex: 1,
        position: 'relative',
        backgroundColor: '#f0f9ff',
      }}
    >
      {/* Floating Dollar Signs */}
      <Animated.View
        style={{
          position: 'absolute',
          top: '15%',
          right: '20%',
          opacity: dollarSign1,
          transform: [
            {
              translateY: dollarSign1.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -20],
              }),
            },
            {
              rotate: dollarSign1.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              }),
            },
          ],
        }}
      >
        <Text style={{ fontSize: 32, color: 'rgba(34, 197, 94, 0.3)', fontWeight: 'bold' }}>$</Text>
      </Animated.View>

      <Animated.View
        style={{
          position: 'absolute',
          bottom: '25%',
          left: '15%',
          opacity: dollarSign2,
          transform: [
            {
              translateY: dollarSign2.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 15],
              }),
            },
            {
              rotate: dollarSign2.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '-360deg'],
              }),
            },
          ],
        }}
      >
        <Text style={{ fontSize: 28, color: 'rgba(34, 197, 94, 0.25)', fontWeight: 'bold' }}>$</Text>
      </Animated.View>

      {/* Floating Euro Signs */}
      <Animated.View
        style={{
          position: 'absolute',
          top: '40%',
          left: '25%',
          opacity: euroSign1,
          transform: [
            {
              translateX: euroSign1.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 10],
              }),
            },
            {
              rotate: euroSign1.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '180deg'],
              }),
            },
          ],
        }}
      >
        <Text style={{ fontSize: 30, color: 'rgba(99, 102, 241, 0.3)', fontWeight: 'bold' }}>€</Text>
      </Animated.View>

      <Animated.View
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '10%',
          opacity: euroSign2,
          transform: [
            {
              translateX: euroSign2.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -15],
              }),
            },
            {
              rotate: euroSign2.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '-180deg'],
              }),
            },
          ],
        }}
      >
        <Text style={{ fontSize: 26, color: 'rgba(99, 102, 241, 0.25)', fontWeight: 'bold' }}>€</Text>
      </Animated.View>

      {/* Floating Coins */}
      <Animated.View
        style={{
          position: 'absolute',
          top: '25%',
          left: '10%',
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: 'rgba(251, 146, 60, 0.2)',
          opacity: coin1,
          transform: [
            {
              scale: coin1.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1.2],
              }),
            },
            {
              translateY: coin1.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -10],
              }),
            },
          ],
        }}
      />

      <Animated.View
        style={{
          position: 'absolute',
          top: '70%',
          right: '30%',
          width: 35,
          height: 35,
          borderRadius: 17.5,
          backgroundColor: 'rgba(168, 85, 247, 0.2)',
          opacity: coin2,
          transform: [
            {
              scale: coin2.interpolate({
                inputRange: [0, 1],
                outputRange: [0.7, 1.3],
              }),
            },
            {
              translateY: coin2.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 12],
              }),
            },
          ],
        }}
      />

      <Animated.View
        style={{
          position: 'absolute',
          bottom: '35%',
          left: '35%',
          width: 45,
          height: 45,
          borderRadius: 22.5,
          backgroundColor: 'rgba(34, 197, 94, 0.2)',
          opacity: coin3,
          transform: [
            {
              scale: coin3.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1.1],
              }),
            },
            {
              translateX: coin3.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 8],
              }),
            },
          ],
        }}
      />

      {children}
    </Animated.View>
  );
};

interface MoneyAnimatedHeaderProps {
  title?: string;
  subtitle?: string;
}

export const MoneyAnimatedHeader: React.FC<MoneyAnimatedHeaderProps> = ({ title, subtitle }) => {
  const dollarSign1 = useRef(new Animated.Value(0)).current;
  const dollarSign2 = useRef(new Animated.Value(0)).current;
  const euroSign1 = useRef(new Animated.Value(0)).current;
  const coin1 = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fadeIn = Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    });

    const dollar1Loop = Animated.loop(
      Animated.sequence([
        Animated.timing(dollarSign1, {
          toValue: 1,
          duration: 6000,
          useNativeDriver: true,
        }),
        Animated.timing(dollarSign1, {
          toValue: 0,
          duration: 6000,
          useNativeDriver: true,
        }),
      ])
    );

    const dollar2Loop = Animated.loop(
      Animated.sequence([
        Animated.timing(dollarSign2, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        }),
        Animated.timing(dollarSign2, {
          toValue: 0,
          duration: 8000,
          useNativeDriver: true,
        }),
      ])
    );

    const euro1Loop = Animated.loop(
      Animated.sequence([
        Animated.timing(euroSign1, {
          toValue: 1,
          duration: 7000,
          useNativeDriver: true,
        }),
        Animated.timing(euroSign1, {
          toValue: 0,
          duration: 7000,
          useNativeDriver: true,
        }),
      ])
    );

    const coin1Loop = Animated.loop(
      Animated.sequence([
        Animated.timing(coin1, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(coin1, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: true,
        }),
      ])
    );

    fadeIn.start();
    dollar1Loop.start();
    dollar2Loop.start();
    euro1Loop.start();
    coin1Loop.start();

    return () => {
      dollar1Loop.stop();
      dollar2Loop.stop();
      euro1Loop.stop();
      coin1Loop.stop();
    };
  }, [fadeAnimation, dollarSign1, dollarSign2, euroSign1, coin1]);

  return (
    <View style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
      {/* Money-themed animated background */}
              <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#166534',
          }}
        >
        {/* Floating Dollar Signs */}
        <Animated.View
          style={{
            position: 'absolute',
            top: '20%',
            right: '15%',
            opacity: dollarSign1,
            transform: [
              {
                translateY: dollarSign1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -15],
                }),
              },
              {
                rotate: dollarSign1.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          }}
        >
          <Text style={{ fontSize: 24, color: 'rgba(255, 255, 255, 0.3)', fontWeight: 'bold' }}>$</Text>
        </Animated.View>

        <Animated.View
          style={{
            position: 'absolute',
            bottom: '30%',
            left: '10%',
            opacity: dollarSign2,
            transform: [
              {
                translateY: dollarSign2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 10],
                }),
              },
              {
                rotate: dollarSign2.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '-360deg'],
                }),
              },
            ],
          }}
        >
          <Text style={{ fontSize: 20, color: 'rgba(255, 255, 255, 0.25)', fontWeight: 'bold' }}>$</Text>
        </Animated.View>

        {/* Floating Euro Sign */}
        <Animated.View
          style={{
            position: 'absolute',
            top: '50%',
            left: '20%',
            opacity: euroSign1,
            transform: [
              {
                translateX: euroSign1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 8],
                }),
              },
              {
                rotate: euroSign1.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '180deg'],
                }),
              },
            ],
          }}
        >
          <Text style={{ fontSize: 22, color: 'rgba(255, 255, 255, 0.3)', fontWeight: 'bold' }}>€</Text>
        </Animated.View>

        {/* Floating Coin */}
        <Animated.View
          style={{
            position: 'absolute',
            top: '25%',
            left: '35%',
            width: 25,
            height: 25,
            borderRadius: 12.5,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            opacity: coin1,
            transform: [
              {
                scale: coin1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1.2],
                }),
              },
              {
                translateY: coin1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -8],
                }),
              },
            ],
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
          <Text
            style={{
              color: '#fff',
              fontSize: 18,
              fontWeight: 'bold',
              textShadowColor: 'rgba(0,0,0,0.8)',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 3,
            }}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: 12,
                marginTop: 2,
                textShadowColor: 'rgba(0,0,0,0.8)',
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 2,
              }}
            >
              {subtitle}
            </Text>
          )}
        </Animated.View>
      )}
    </View>
  );
};

interface TicketAnimatedBackgroundProps {
  children: React.ReactNode;
}

export const TicketAnimatedBackground: React.FC<TicketAnimatedBackgroundProps> = ({ children }) => {
  const ticket1 = useRef(new Animated.Value(0)).current;
  const ticket2 = useRef(new Animated.Value(0)).current;
  const plane1 = useRef(new Animated.Value(0)).current;
  const train1 = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fadeIn = Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    });

    const ticket1Loop = Animated.loop(
      Animated.sequence([
        Animated.timing(ticket1, {
          toValue: 1,
          duration: 6000,
          useNativeDriver: true,
        }),
        Animated.timing(ticket1, {
          toValue: 0,
          duration: 6000,
          useNativeDriver: true,
        }),
      ])
    );

    const ticket2Loop = Animated.loop(
      Animated.sequence([
        Animated.timing(ticket2, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        }),
        Animated.timing(ticket2, {
          toValue: 0,
          duration: 8000,
          useNativeDriver: true,
        }),
      ])
    );

    const plane1Loop = Animated.loop(
      Animated.sequence([
        Animated.timing(plane1, {
          toValue: 1,
          duration: 7000,
          useNativeDriver: true,
        }),
        Animated.timing(plane1, {
          toValue: 0,
          duration: 7000,
          useNativeDriver: true,
        }),
      ])
    );

    const train1Loop = Animated.loop(
      Animated.sequence([
        Animated.timing(train1, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(train1, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: true,
        }),
      ])
    );

    fadeIn.start();
    ticket1Loop.start();
    ticket2Loop.start();
    plane1Loop.start();
    train1Loop.start();

    return () => {
      ticket1Loop.stop();
      ticket2Loop.stop();
      plane1Loop.stop();
      train1Loop.stop();
    };
  }, [fadeAnimation, ticket1, ticket2, plane1, train1]);

  return (
    <View style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
      {/* Ticket-themed animated background */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(219, 234, 254, 0.3)',
        }}
      >
        {/* Floating Tickets */}
        <Animated.View
          style={{
            position: 'absolute',
            top: '20%',
            right: '15%',
            opacity: ticket1,
            transform: [
              {
                translateY: ticket1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -15],
                }),
              },
              {
                rotate: ticket1.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          }}
        >
          <Text style={{ fontSize: 24, color: 'rgba(255, 255, 255, 0.3)', fontWeight: 'bold' }}>🎫</Text>
        </Animated.View>

        <Animated.View
          style={{
            position: 'absolute',
            bottom: '30%',
            left: '10%',
            opacity: ticket2,
            transform: [
              {
                translateY: ticket2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 10],
                }),
              },
              {
                rotate: ticket2.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '-360deg'],
                }),
              },
            ],
          }}
        >
          <Text style={{ fontSize: 20, color: 'rgba(255, 255, 255, 0.25)', fontWeight: 'bold' }}>🎫</Text>
        </Animated.View>

        {/* Floating Plane */}
        <Animated.View
          style={{
            position: 'absolute',
            top: '40%',
            left: '20%',
            opacity: plane1,
            transform: [
              {
                translateX: plane1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 8],
                }),
              },
              {
                rotate: plane1.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '180deg'],
                }),
              },
            ],
          }}
        >
          <Text style={{ fontSize: 22, color: 'rgba(255, 255, 255, 0.3)', fontWeight: 'bold' }}>✈️</Text>
        </Animated.View>

        {/* Floating Train */}
        <Animated.View
          style={{
            position: 'absolute',
            top: '25%',
            left: '35%',
            width: 25,
            height: 25,
            borderRadius: 12.5,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            opacity: train1,
            transform: [
              {
                scale: train1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1.2],
                }),
              },
              {
                translateY: train1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -8],
                }),
              },
            ],
          }}
        >
          <Text style={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.4)', textAlign: 'center' }}>🚂</Text>
        </Animated.View>
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

      {/* Content */}
      <View style={{ flex: 1, zIndex: 1 }}>
        {children}
      </View>
    </View>
  );
};

interface TicketAnimatedHeaderProps {
  title?: string;
  subtitle?: string;
}

export const TicketAnimatedHeader: React.FC<TicketAnimatedHeaderProps> = ({ title, subtitle }) => {
  const ticket1 = useRef(new Animated.Value(0)).current;
  const ticket2 = useRef(new Animated.Value(0)).current;
  const plane1 = useRef(new Animated.Value(0)).current;
  const train1 = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fadeIn = Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    });

    const ticket1Loop = Animated.loop(
      Animated.sequence([
        Animated.timing(ticket1, {
          toValue: 1,
          duration: 6000,
          useNativeDriver: true,
        }),
        Animated.timing(ticket1, {
          toValue: 0,
          duration: 6000,
          useNativeDriver: true,
        }),
      ])
    );

    const ticket2Loop = Animated.loop(
      Animated.sequence([
        Animated.timing(ticket2, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        }),
        Animated.timing(ticket2, {
          toValue: 0,
          duration: 8000,
          useNativeDriver: true,
        }),
      ])
    );

    const plane1Loop = Animated.loop(
      Animated.sequence([
        Animated.timing(plane1, {
          toValue: 1,
          duration: 7000,
          useNativeDriver: true,
        }),
        Animated.timing(plane1, {
          toValue: 0,
          duration: 7000,
          useNativeDriver: true,
        }),
      ])
    );

    const train1Loop = Animated.loop(
      Animated.sequence([
        Animated.timing(train1, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(train1, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: true,
        }),
      ])
    );

    fadeIn.start();
    ticket1Loop.start();
    ticket2Loop.start();
    plane1Loop.start();
    train1Loop.start();

    return () => {
      ticket1Loop.stop();
      ticket2Loop.stop();
      plane1Loop.stop();
      train1Loop.stop();
    };
  }, [fadeAnimation, ticket1, ticket2, plane1, train1]);

  return (
    <View style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
      {/* Ticket-themed animated header background */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#1e3a8a',
        }}
      >
        {/* Floating Tickets */}
        <Animated.View
          style={{
            position: 'absolute',
            top: '20%',
            right: '15%',
            opacity: ticket1,
            transform: [
              {
                translateY: ticket1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -15],
                }),
              },
              {
                rotate: ticket1.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          }}
        >
          <Text style={{ fontSize: 24, color: 'rgba(255, 255, 255, 0.3)', fontWeight: 'bold' }}>🎫</Text>
        </Animated.View>

        <Animated.View
          style={{
            position: 'absolute',
            bottom: '30%',
            left: '10%',
            opacity: ticket2,
            transform: [
              {
                translateY: ticket2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 10],
                }),
              },
              {
                rotate: ticket2.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '-360deg'],
                }),
              },
            ],
          }}
        >
          <Text style={{ fontSize: 20, color: 'rgba(255, 255, 255, 0.25)', fontWeight: 'bold' }}>🎫</Text>
        </Animated.View>

        {/* Floating Plane */}
        <Animated.View
          style={{
            position: 'absolute',
            top: '40%',
            left: '20%',
            opacity: plane1,
            transform: [
              {
                translateX: plane1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 8],
                }),
              },
              {
                rotate: plane1.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '180deg'],
                }),
              },
            ],
          }}
        >
          <Text style={{ fontSize: 22, color: 'rgba(255, 255, 255, 0.3)', fontWeight: 'bold' }}>✈️</Text>
        </Animated.View>

        {/* Floating Train */}
        <Animated.View
          style={{
            position: 'absolute',
            top: '25%',
            left: '35%',
            width: 25,
            height: 25,
            borderRadius: 12.5,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            opacity: train1,
            transform: [
              {
                scale: train1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1.2],
                }),
              },
              {
                translateY: train1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -8],
                }),
              },
            ],
          }}
        >
          <Text style={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.4)', textAlign: 'center' }}>🚂</Text>
        </Animated.View>
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
          <Text
            style={{
              color: '#fff',
              fontSize: 18,
              fontWeight: 'bold',
              textShadowColor: 'rgba(0,0,0,0.8)',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 3,
            }}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: 12,
                marginTop: 2,
                textShadowColor: 'rgba(0,0,0,0.8)',
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 2,
              }}
            >
              {subtitle}
            </Text>
          )}
        </Animated.View>
      )}
    </View>
  );
}; 