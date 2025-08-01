import { Trip } from '../types';

export const tripData: Trip = {
  id: '1',
  name: 'Viva la France',
  startDate: '2025-08-27',
  endDate: '2025-09-01',
  weather: {
    paris: {
      '2025-08-27': {
        high: 24,
        low: 16,
        condition: 'sunny',
        icon: '☀️',
        description: 'Perfect weather for outdoor activities',
        link: 'https://www.accuweather.com/en/fr/paris/623/weather-forecast/623?day=28'
      },
      '2025-08-28': {
        high: 26,
        low: 18,
        condition: 'partly-cloudy',
        icon: '⛅',
        description: 'Great for Eiffel Tower visit and river cruise',
        link: 'https://www.accuweather.com/en/fr/paris/623/weather-forecast/623?day=29'
      }
    },
    nice: {
      '2025-08-29': {
        high: 28,
        low: 20,
        condition: 'sunny',
        icon: '☀️',
        description: 'Perfect beach weather for Nice exploration',
        link: 'https://www.accuweather.com/en/fr/vernier/2608391/daily-weather-forecast/2608391?day=30'
      },
      '2025-08-30': {
        high: 29,
        low: 21,
        condition: 'sunny',
        icon: '☀️',
        description: 'Ideal for island day trip and beach activities',
        link: 'https://www.accuweather.com/en/fr/vernier/2608391/daily-weather-forecast/2608391?day=31'
      },
      '2025-08-31': {
        high: 27,
        low: 19,
        condition: 'partly-cloudy',
        icon: '⛅',
        description: 'Good weather for train journey and Villefranche visit',
        link: 'https://www.accuweather.com/en/fr/vernier/2608391/daily-weather-forecast/2608391?day=32'
      },
      '2025-09-01': {
        high: 25,
        low: 17,
        condition: 'sunny',
        icon: '☀️',
        description: 'Perfect final day weather for Monaco and train back',
        link: 'https://www.accuweather.com/en/fr/vernier/2608391/daily-weather-forecast/2608391?day=33'
      }
    }
  },
  days: [
    {
      id: '1',
      date: '2025-08-27',
      summary: 'Paris Arrival & Iconic Landmarks',
      activities: [
        { 
          id: '1', 
          title: 'Flight to Paris', 
          icon: 'airplane',
          location: '94390 Orly, France',
          duration: '2 hours',
          notes: 'International flight to Paris. Allow extra time for customs and baggage claim'
        },
        { 
          id: '2', 
          title: 'Check-in at Hotel', 
          icon: 'bed',
          location: '22 Av. du Professeur André Lemierre, 75020 Paris, France',
          duration: '30 minutes',
          websiteLink: 'https://all.accor.com/hotel/3239/index.en.shtml',
          notes: '🕑 Check-in from 02:00 PM - Check out up to 12:00 PM'
        },
        { 
          id: '3', 
          title: 'Louvre Museum', 
          icon: 'business',
          location: 'Rue de Rivoli, 75001 Paris',
          duration: '3 hours',
          ticketLink: 'https://www.louvre.fr/en/plan-your-visit',
          price: '€17',
          notes: 'Book tickets online to skip the queue. See Mona Lisa and Venus de Milo. Open until 6pm'
        },
        
        { 
          id: '5', 
          title: 'Café Culture Break', 
          icon: 'cafe',
          location: 'Various cafés around Louvre, 75001 Paris',
          duration: '45 minutes',
          notes: 'Traditional Parisian café experience. Try café au lait and pastries. Perfect break between landmarks'
        },
        { 
          id: '6', 
          title: 'Galeries Lafayette Haussmann', 
          icon: 'bag',
          location: '40 Bd Haussmann, 75009 Paris',
          duration: '2 hours',
          websiteLink: 'https://haussmann.galerieslafayette.com/en/',
          notes: 'Luxury department store with stunning Art Nouveau architecture. Food court on top floor with panoramic views'
        },
        { 
          id: '7', 
          title: 'Food Court & Café Culture', 
          icon: 'restaurant',
          location: 'Galeries Lafayette Food Court, 75009 Paris',
          duration: '1 hour',
          websiteLink: 'https://haussmann.galerieslafayette.com/en/restaurants/',
          notes: 'International food court with French, Asian, and Mediterranean options. Great rooftop views of Paris'
        },
        { 
          id: '8', 
          title: 'Dinner at Le Taj', 
          icon: 'restaurant',
          location: '1 Rue de la Paix, 75002 Paris',
          duration: '1.5 hours',
          websiteLink: 'https://www.letaj.fr/',
          ticketLink: 'https://www.opentable.com/r/le-taj-paris',
          price: '€45',
          notes: 'Upscale Indian restaurant with authentic cuisine. Try the butter chicken and naan bread. Reservations recommended'
        },
        { 
          id: '9', 
          title: 'Disneyland Paris', 
          icon: 'camera',
          location: 'Bd de Parc, 77777 Marne-la-Vallée, France',
          duration: '4 hours',
          ticketLink: 'https://www.disneylandparis.com/en-us/tickets/',
          price: '€89',
          websiteLink: 'https://www.disneylandparis.com/en-us/',
          notes: 'Magical evening at Disneyland! Book tickets online for better prices. Fireworks show at closing'
        },
      ],
    },
    {
      id: '2',
      date: '2025-08-28',
      summary: 'Paris Landmarks & River Cruise',
      activities: [
        
        { 
          id: '6', 
          title: 'Breakfast at Cafe', 
          icon: 'cafe',
          location: 'Café de Flore, 172 Bd Saint-Germain, 75006 Paris',
          duration: '1 hour',
          websiteLink: 'https://cafedeflore.fr',
          notes: 'Famous historic café, try the croissants and coffee. Iconic Parisian experience'
        },
        { 
          id: '4', 
          title: 'Notre Dame Cathedral', 
          icon: 'camera',
          location: '6 Parvis Notre-Dame - Pl. Jean-Paul II, 75004 Paris',
          duration: '1.5 hours',
          websiteLink: 'https://www.notredamedeparis.fr',
          notes: 'Currently under restoration, but exterior views are still impressive. Gothic architecture masterpiece'
        },
        { 
          id: '7', 
          title: 'Eiffel Tower Visit', 
          icon: 'camera',
          location: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris',
          duration: '2 hours',
          ticketLink: 'https://www.toureiffel.paris/en/rates-opening-times',
          price: '€26.10',
          notes: 'Book tickets online to skip the queue. Best views at sunset. Summit access available for extra cost'
        },
        { 
          id: '8', 
          title: 'Seine River Cruise', 
          icon: 'boat',
          location: 'Port de la Bourdonnais, 75007 Paris',
          duration: '1 hour',
          ticketLink: 'https://www.bateaux-mouches.fr/en/',
          price: '€15',
          websiteLink: 'https://www.bateaux-mouches.fr/en/',
          notes: 'Scenic cruise along the Seine. See Paris landmarks from the water. Audio guide included'
        },
        { 
          id: '9', 
          title: 'Arc de Triomphe', 
          icon: 'camera',
          location: 'Place Charles de Gaulle, 75008 Paris',
          duration: '1 hour',
          ticketLink: 'https://www.paris-arc-de-triomphe.fr/en/',
          price: '€13',
          notes: 'Climb to the top for panoramic views of Paris. Champs-Élysées views'
        },
        { 
          id: '10', 
          title: 'Champs-Élysées Walk', 
          icon: 'walk',
          location: 'Avenue des Champs-Élysées, 75008 Paris',
          duration: '1 hour',
          notes: 'Famous avenue with luxury shops and cafes. Perfect for evening stroll'
        },

      ],
    },
    {
      id: '3',
      date: '2025-08-29',
      summary: 'Arrival + Old Town + Castle Hill',
      activities: [
        { 
          id: '7', 
          title: 'Check-in & Freshen Up', 
          icon: 'bed',
          location: '7 Avenue des Pergolas, Arenas, 06200 Nice, France',
          duration: '1 hour',
          websiteLink: 'https://www.booking.com/hotel/fr/villa-des-pergolas.en-gb.html?aid=356980&label=gog235jc-10CAsoTUISdmlsbGEtZGVzLXBlcmdvbGFzSDNYA2g7iAEBmAEzuAEHyAEM2AED6AEB-AEBiAIBqAIBuAL-lKrEBsACAdICJDJhZDI4NTFkLTg5NjQtNGExNy1hYTQxLTIyNGIzN2M3OGRhOdgCAeACAQ&sid=5bca7887f698b8010c9814a0b634efe9&dist=0&keep_landing=1&sb_price_type=total&type=total&chal_t=1753909886901&force_referer=https%3A%2F%2Fwww.google.com%2F',
          notes: 'Checkin 5pm - 8pm. Checkout 8am -11am'
        },
        { 
          id: '8', 
          title: 'Tram to Jean Médecin', 
          icon: 'train',
          location: 'Tram Line 1, Nice',
          duration: '15 minutes',
          ticketLink: 'https://www.lignesdazur.com/en/tramway',
          price: '€1.50',
          notes: 'Buy tickets at tram stops or use mobile app. Single ticket valid for 74 minutes'
        },
        { 
          id: '9', 
          title: 'Place Masséna Walk', 
          icon: 'walk',
          location: 'Place Masséna, 06000 Nice',
          duration: '30 minutes',
          notes: 'Famous square with fountains and architecture. Great for photos'
        },
        { 
          id: '10', 
          title: 'Vieux Nice & Cours Saleya', 
          icon: 'walk',
          location: 'Cours Saleya, 06300 Nice',
          duration: '1 hour',
          notes: 'Historic old town with colorful buildings and flower market'
        },
        { 
          id: '11', 
          title: 'Street Food: Socca, Pan Bagnat', 
          icon: 'restaurant',
          location: 'Rue Pairolière, 06300 Nice',
          duration: '45 minutes',
          notes: 'Try traditional Niçoise street food. Socca is a chickpea pancake'
        },
        { 
          id: '12', 
          title: 'Castle Hill Views', 
          icon: 'camera',
          location: 'Colline du Château, 06300 Nice',
          duration: '1.5 hours',
          notes: 'Elevator available (€1) or walk up the stairs. Best sunset views'
        },
        { 
          id: '13', 
          title: 'Dinner in Old Town', 
          icon: 'restaurant',
          location: 'Rue de la Préfecture, 06300 Nice',
          duration: '1.5 hours',
          notes: 'Traditional Niçoise cuisine. Try salade niçoise and ratatouille'
        },
      ],
    },
    {
      id: '4',
      date: '2025-08-30',
      summary: 'Îles de Lérins Island Day',
      activities: [
        { 
          id: '14', 
          title: 'Train to Cannes', 
          icon: 'train',
          location: 'Nice Ville Station, Avenue Thiers, 06000 Nice',
          duration: '30 minutes',
          ticketLink: 'https://www.sncf-connect.com/en-en',
          price: '€6.50',
          notes: 'TER regional train. Buy tickets at station or use SNCF Connect app'
        },
        { 
          id: '15', 
          title: 'Ferry to Île Sainte-Marguerite', 
          icon: 'boat',
          location: 'Port de Cannes, 06400 Cannes',
          duration: '15 minutes',
          ticketLink: 'https://www.cannes-ilesdelerins.com/en/',
          price: '€15.50',
          notes: 'Ferry departs every 30 minutes. Book online to avoid queues. Round-trip ticket includes island access'
        },
        { 
          id: '16', 
          title: 'Explore Fort Royal', 
          icon: 'camera',
          location: 'Fort Royal, Île Sainte-Marguerite, 06400 Cannes',
          duration: '1.5 hours',
          price: '€6',
          notes: 'Historic fort with prison cells. Great views of the coast. Audio guide available'
        },
        { 
          id: '17', 
          title: 'Lunch at La Guérite', 
          icon: 'restaurant',
          location: 'La Guérite, Île Sainte-Marguerite, 06400 Cannes',
          duration: '1 hour',
          websiteLink: 'https://www.laguerite-cannes.com',
          price: '€45',
          notes: 'Beachfront restaurant with Mediterranean cuisine. Reservations recommended'
        },
        { 
          id: '18', 
          title: 'Beach & Shaded Trails', 
          icon: 'umbrella',
          location: 'Île Sainte-Marguerite, 06400 Cannes',
          duration: '2 hours',
          notes: 'Crystal clear waters, pine forest trails. Bring swimwear and hiking shoes'
        },
        { 
          id: '19', 
          title: 'Return Ferry & Train', 
          icon: 'boat',
          location: 'Port de Cannes, 06400 Cannes',
          duration: '45 minutes',
          notes: 'Last ferry departs at 6:30 PM. Return train to Nice available until 10 PM'
        },
        { 
          id: '20', 
          title: 'Light Dinner in Nice', 
          icon: 'restaurant',
          location: 'Promenade des Anglais, 06000 Nice',
          duration: '1 hour',
          notes: 'Casual dinner after a long day. Many options along the promenade'
        },
      ],
    },
    {
      id: '5',
      date: '2025-08-31',
      summary: 'Villefranche Beach Day',
      activities: [
        { 
          id: '21', 
          title: 'Train to Villefranche', 
          icon: 'train',
          location: 'Nice Ville Station, Avenue Thiers, 06000 Nice',
          duration: '15 minutes',
          ticketLink: 'https://www.sncf-connect.com/en-en',
          price: '€3.20',
          notes: 'TER regional train. Buy tickets at station or use SNCF Connect app. Trains run every 15-20 minutes'
        },
        { 
          id: '22', 
          title: 'Plage des Marinières', 
          icon: 'umbrella',
          location: 'Plage des Marinières, 06230 Villefranche-sur-Mer',
          duration: '3 hours',
          notes: 'Beautiful pebble beach with crystal clear water. Bring beach towel and sunscreen. Beach chairs available for rent (€15)'
        },
        { 
          id: '23', 
          title: 'Beachside Lunch', 
          icon: 'restaurant',
          location: 'Le Cosmo, 1 Avenue de l\'Ange Gardien, 06230 Villefranche-sur-Mer',
          duration: '1.5 hours',
          websiteLink: 'https://www.lecosmo-villefranche.com',
          price: '€35',
          notes: 'Beachfront restaurant with Mediterranean cuisine. Try the grilled fish and local rosé wine'
        },
        { 
          id: '24', 
          title: 'Villa Ephrussi Gardens', 
          icon: 'camera',
          location: '1 Avenue Ephrussi de Rothschild, 06230 Saint-Jean-Cap-Ferrat',
          duration: '2 hours',
          ticketLink: 'https://www.villa-ephrussi.com/en',
          price: '€16',
          notes: 'Stunning gardens with sea views. Audio guide included. Allow time for photos and relaxation'
        },
        { 
          id: '25', 
          title: 'Villefranche Harbor', 
          icon: 'walk',
          location: 'Port de la Santé, 06230 Villefranche-sur-Mer',
          duration: '1 hour',
          notes: 'Historic harbor with colorful buildings. Great for sunset photos. Many cafes and restaurants'
        },
        { 
          id: '26', 
          title: 'Return to Nice', 
          icon: 'train',
          location: 'Villefranche-sur-Mer Station, 06230 Villefranche-sur-Mer',
          duration: '15 minutes',
          ticketLink: 'https://www.sncf-connect.com/en-en',
          price: '€3.20',
          notes: 'Last train departs around 11 PM. Buy return ticket in advance to avoid queues'
        },
        { 
          id: '27', 
          title: 'Dinner in Central Nice', 
          icon: 'restaurant',
          location: 'Le Bistrot d\'Antoine, 27 Rue de la Préfecture, 06300 Nice',
          duration: '1.5 hours',
          websiteLink: 'https://www.lebistrotdantoine.fr',
          price: '€45',
          notes: 'Traditional Niçoise cuisine. Reservations recommended. Try the daube niçoise and local wine'
        },
      ],
    },
    {
      id: '6',
      date: '2025-09-01',
      summary: 'Departure Day',
      activities: [
        { 
          id: '28', 
          title: 'Final Breakfast', 
          icon: 'cafe',
          location: 'Café de Turin, 5 Place Garibaldi, 06300 Nice',
          duration: '1 hour',
          websiteLink: 'https://www.cafedeturin.fr',
          price: '€12',
          notes: 'Famous café for coffee and pastries. Try the pain au chocolat and café au lait'
        },
        { 
          id: '29', 
          title: 'Check-out & Luggage Storage', 
          icon: 'bed',
          location: '7 Avenue des Pergolas, Arenas, 06200 Nice',
          duration: '30 minutes',
          notes: 'Check-out by 11 AM. Store luggage at hotel or use luggage storage service at Nice Ville station (€6/day)'
        },
        { 
          id: '30', 
          title: 'Train to Airport', 
          icon: 'train',
          location: 'Nice Ville Station, Avenue Thiers, 06000 Nice',
          duration: '25 minutes',
          ticketLink: 'https://www.sncf-connect.com/en-en',
          price: '€6.20',
          notes: 'TER train to Nice Côte d\'Azur Airport. Trains run every 30 minutes. Allow extra time for security'
        },
        { 
          id: '31', 
          title: 'Flight Home', 
          icon: 'airplane',
          location: 'Nice Côte d\'Azur Airport, 06206 Nice',
          duration: '2 hours',
          notes: 'International flight. Arrive 2 hours before departure for international flights. Check-in online 24h before'
        },
      ],
    },
  ],
}; 