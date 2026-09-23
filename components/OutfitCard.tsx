import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Outfit } from '../../services/mockData';
import { loadOutfits } from '../../services/storage';

export default function OutfitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [outfit, setOutfit] = useState<Outfit | null>(null);

  useEffect(() => {
    const fetchOutfit = async () => {
      const outfits = await loadOutfits();
      const match = outfits.find((entry) => entry.id === id);
      setOutfit(match ?? null);
    };

    fetchOutfit();
  }, [id]);

  if (!outfit) {
    return (
      <View style={styles.screen}>
        <Text style={styles.emptyText}>Outfit not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.heading}>{outfit.name}</Text>

      <View style={styles.infoCard}>
        <Text style={styles.label}>Used on</Text>
        <Text style={styles.value}>{outfit.dateWorn}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.label}>Weather note</Text>
        <Text style={styles.value}>{outfit.weatherNote}</Text>
      </View>

      <Text style={styles.sectionTitle}>Items in outfit</Text>
      <View style={styles.itemList}>
        {outfit.items.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemMeta}>{item.category}</Text>
            <Text style={styles.itemMeta}>{item.color}</Text>
          </View>
        ))}
      </View>

      <Link href={{ pathname: '/add-outfit', params: { outfitId: outfit.id } }} asChild>
        <TouchableOpacity style={styles.editButton} activeOpacity={0.9}>
          <Text style={styles.editButtonText}>Edit outfit</Text>
        </TouchableOpacity>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#1a212b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: '#edf5f8',
    marginBottom: 18,
  },
  infoCard: {
    backgroundColor: '#22313d',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#3c5165',
  },
  label: {
    color: '#8ba6b8',
    fontSize: 12,
    marginBottom: 6,
  },
  value: {
    color: '#edf6fb',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    color: '#60d4c1',
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  itemList: {
    gap: 10,
  },
  itemRow: {
    backgroundColor: '#222e39',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#42586f',
  },
  itemName: {
    color: '#f1f8fb',
    fontWeight: '700',
    fontSize: 15,
  },
  itemMeta: {
    color: '#a7bac8',
    marginTop: 4,
  },
  editButton: {
    marginTop: 26,
    backgroundColor: '#59d0bf',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#08222d',
    fontWeight: '800',
  },
  emptyText: {
    color: '#edf5f8',
    fontSize: 18,
  },
});
