import React from 'react';
import { View, Text } from 'react-native';

interface CustomHeaderProps {
  title: string;
  subtitle: string;
}

export const CustomHeader: React.FC<CustomHeaderProps> = ({ title, subtitle }) => {
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      paddingHorizontal: 20,
    }}>
      <Text style={{ 
        color: '#fff', 
        fontSize: 24, 
        fontWeight: 'bold',
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        textAlign: 'center',
        marginBottom: 4,
      }}>
        {title}
      </Text>
      <Text style={{ 
        color: 'rgba(255,255,255,0.9)', 
        fontSize: 12,
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        textAlign: 'center',
      }}>
        {subtitle}
      </Text>
    </View>
  );
}; 