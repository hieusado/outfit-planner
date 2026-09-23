import { Link, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { OutfitCard } from '../components/OutfitCard';
import { fetchOutfits, itemCatalog, Outfit, OutfitCategory } from '../services/mockData';
import { loadOutfits, saveOutfits } from '../services/storage';

const categories: Array<'All' | OutfitCategory> = [
  'All',
  'Top',
  'Bottom',
  'Outerwear',
  'Shoes',
  'Accessories',
];

const today = new Date().toISOString().slice(0, 10);

export default function HomeScreen() {
  const router = useRouter();
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | OutfitCategory>('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const storedOutfits = await loadOutfits();
      if (storedOutfits.length > 0) {
        setOutfits(storedOutfits);
      } else {
        const remoteOutfits = await fetchOutfits();
        setOutfits(remoteOutfits);
        await saveOutfits(remoteOutfits);
      }
    } catch (err) {
      setError('Unable to load outfit data.');
      setOutfits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredOutfits = useMemo(() => {
    const term = search.trim().toLowerCase();

    return outfits.filter((outfit) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        outfit.items.some((item) => item.category === selectedCategory);

      const matchesSearch =
        term.length === 0 ||
        outfit.name.toLowerCase().includes(term) ||
        outfit.items.some((item) => item.name.toLowerCase().includes(term));

      return matchesCategory && matchesSearch;
    });
  }, [outfits, search, selectedCategory]);

  const todayCount = outfits.filter((outfit) => outfit.dateWorn === today).length;

  const topItem = useMemo(() => {
    const counts: Record<string, number> = {};

    outfits.forEach((outfit) => {
      outfit.items.forEach((item) => {
        counts[item.name] = (counts[item.name] ?? 0) + 1;
      });
    });

    const mostWorn = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return mostWorn ? `${mostWorn[0]} (${mostWorn[1]}x)` : 'No outfit logged yet';
  }, [outfits]);

  const handleMarkToday = async (id: string) => {
    const updated = outfits.map((outfit) =>
      outfit.id === id ? { ...outfit, dateWorn: today } : outfit,
    );

    setOutfits(updated);
    await saveOutfits(updated);
  };

  const handleDelete = async (id: string) => {
    const updated = outfits.filter((outfit) => outfit.id !== id);
    setOutfits(updated);
    await saveOutfits(updated);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <StatusBar barStyle="light-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#60d4c1" />
          <Text style={styles.loadingText}>Loading outfits...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.eyebrow}>OUTFIT PLANNER</Text>
            <Text style={styles.heading}>Your wardrobe</Text>
          </View>

          <Link href="/add-outfit" asChild>
            <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8}>
              <Text style={styles.primaryButtonText}>+ Add</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total outfits</Text>
            <Text style={styles.summaryValue}>{outfits.length}</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Logged today</Text>
            <Text style={styles.summaryValue}>{todayCount}</Text>
          </View>

          <View style={styles.summaryCardWide}>
            <Text style={styles.summaryLabel}>Most worn this month</Text>
            <Text style={styles.summaryValue}>{topItem}</Text>
          </View>
        </View>

        <View style={styles.searchBox}>
          <TextInput
            style={styles.input}
            placeholder="Search outfit or item"
            placeholderTextColor="#91A5B7"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
          {categories.map((category) => {
            const active = selectedCategory === category;
            return (
              <TouchableOpacity
                key={category}
                style={[styles.categoryChip, active && styles.categoryChipActive]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[styles.categoryChipText, active && styles.categoryChipTextActive]}>{category}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.noticeBar}>
          <Text style={styles.noticeText}>Offline-ready local storage is active.</Text>
        </View>

        {filteredOutfits.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No outfits match your filters.</Text>
            <Text style={styles.emptyBody}>Try another search or create a new outfit.</Text>
            <Link href="/add-outfit" asChild>
              <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.8}>
                <Text style={styles.secondaryButtonText}>Create outfit</Text>
              </TouchableOpacity>
            </Link>
          </View>
        ) : (
          filteredOutfits.map((outfit) => (
            <OutfitCard
              key={outfit.id}
              outfit={outfit}
              onView={() => router.push({ pathname: '/detail/[id]', params: { id: outfit.id } })}
              onMarkToday={() => handleMarkToday(outfit.id)}
              onDelete={() => handleDelete(outfit.id)}
              onEdit={() => router.push({ pathname: '/add-outfit', params: { outfitId: outfit.id } })}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#1a212b',
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 36,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a212b',
  },
  loadingText: {
    marginTop: 16,
    color: '#dfe8f2',
    fontSize: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  eyebrow: {
    color: '#62d3c7',
    fontWeight: '700',
    letterSpacing: 1.4,
    fontSize: 12,
    marginBottom: 6,
  },
  heading: {
    fontSize: 30,
    fontWeight: '800',
    color: '#edf5f8',
  },
  primaryButton: {
    backgroundColor: '#59d0bf',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  primaryButtonText: {
    fontWeight: '700',
    color: '#0e1d22',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 18,
    gap: 12,
  },
  summaryCard: {
    backgroundColor: '#222e39',
    padding: 14,
    borderRadius: 12,
    flexBasis: '30%',
    minWidth: 100,
    borderWidth: 1,
    borderColor: '#394a59',
  },
  summaryCardWide: {
    backgroundColor: '#222e39',
    padding: 14,
    borderRadius: 12,
    flexBasis: '100%',
    borderWidth: 1,
    borderColor: '#394a59',
  },
  summaryLabel: {
    color: '#8da0b1',
    fontSize: 12,
  },
  summaryValue: {
    marginTop: 8,
    color: '#eff8fb',
    fontSize: 18,
    fontWeight: '700',
  },
  searchBox: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#222d39',
    borderWidth: 1,
    borderColor: '#42586f',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#f2f8fa',
    fontSize: 15,
  },
  categoryRow: {
    paddingBottom: 14,
  },
  categoryChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#44637b',
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 10,
    backgroundColor: '#1f2b35',
  },
  categoryChipActive: {
    backgroundColor: '#5ad7c1',
    borderColor: '#5ad7c1',
  },
  categoryChipText: {
    color: '#dfeaf1',
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: '#10242e',
  },
  noticeBar: {
    backgroundColor: '#1d3d3d',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  noticeText: {
    color: '#79ebd5',
    fontWeight: '600',
  },
  errorText: {
    color: '#ff8a8a',
    marginBottom: 12,
  },
  emptyState: {
    backgroundColor: '#202d38',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3a4d5f',
    padding: 24,
    alignItems: 'center',
  },
  emptyTitle: {
    color: '#edf5f8',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyBody: {
    color: '#a7bac6',
    textAlign: 'center',
    marginBottom: 20,
  },
  secondaryButton: {
    backgroundColor: '#59d0bf',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  secondaryButtonText: {
    color: '#07252b',
    fontWeight: '700',
  },
});
