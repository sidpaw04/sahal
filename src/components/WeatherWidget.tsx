import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { WeatherData } from '../types';

interface WeatherWidgetProps {
  weather: WeatherData;
  date: string;
  city: string;
}

export default function WeatherWidget({ weather, date, city }: WeatherWidgetProps) {
  const handleWeatherLink = () => {
    Linking.openURL(weather.link);
  };

  return (
    <TouchableOpacity
      style={{
        backgroundColor: 'transparent',
        padding: 8,
        marginBottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
      onPress={handleWeatherLink}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, marginRight: 6 }}>{weather.icon}</Text>
        <View>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1e293b' }}>
            {city}
          </Text>
          <Text style={{ fontSize: 12, color: '#6b7280' }}>
            {weather.high}°C / {weather.low}°C
          </Text>
          <Text style={{ fontSize: 10, color: '#6b7280', fontStyle: 'italic' }}>
            {weather.description}
          </Text>
        </View>
      </View>
      <Text style={{ fontSize: 10, color: '#6366f1', fontWeight: '600' }}>
        Forecast →
      </Text>
    </TouchableOpacity>
  );
} 