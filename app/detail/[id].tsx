import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { itemCatalog, Item, Outfit, OutfitCategory } from '../services/mockData';
import { loadOutfits, saveOutfits } from '../services/storage';

const categories: OutfitCategory[] = ['Top', 'Bottom', 'Outerwear', 'Shoes', 'Accessories'];

export default function AddOutfitScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ outfitId?: string }>();

  const [name, setName] = useState('');
  const [weatherNote, setWeatherNote] = useState('');
  const [dateWorn, setDateWorn] = useState(new Date().toISOString().slice(0, 10));
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const outfitId = params.outfitId;
    if (!outfitId) {
      return;
    }

    const loadOutfit = async () => {
      const outfits = await loadOutfits();
      const outfit = outfits.find((entry) => entry.id === outfitId);
      if (!outfit) {
        return;
      }

      setIsEditing(true);
      setName(outfit.name);
      setWeatherNote(outfit.weatherNote);
      setDateWorn(outfit.dateWorn);
      setSelectedIds(outfit.items.map((item) => item.id));
    };

    loadOutfit();
  }, [params.outfitId]);

  const toggleItem = (itemId: string) => {
    setSelectedIds((current) =>
      current.includes(itemId)
        ? current.filter((id) => id !== itemId)
        : [...current, itemId],
    );
  };

  const selectedItems: Item[] = useMemo(
    () => itemCatalog.filter((item) => selectedIds.includes(item.id)),
    [selectedIds],
  );

  const handleSave = async () => {
    if (!name.trim() || selectedItems.length === 0) {
      return;
    }

    const outfits = await loadOutfits();
    const nextOutfit: Outfit = {
      id: isEditing ? String(params.outfitId) : `outfit-${Date.now()}`,
      name: name.trim(),
      items: selectedItems,
      dateWorn,
      weatherNote: weatherNote.trim() || 'Comfortable and weather ready.',
      createdAt: new Date().toISOString(),
    };

    const nextOutfits = isEditing
      ? outfits.map((outfit) => (outfit.id === params.outfitId ? nextOutfit : outfit))
      : [nextOutfit, ...outfits];

    await saveOutfits(nextOutfits);
    router.push('/');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>{isEditing ? 'Edit outfit' : 'Add an outfit'}</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Outfit name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Example: Rainy day layer"
            placeholderTextColor="#7f96a9"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Date worn</Text>
          <TextInput
            style={styles.input}
            value={dateWorn}
            onChangeText={setDateWorn}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#7f96a9"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Weather note</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={weatherNote}
            onChangeText={setWeatherNote}
            multiline
            numberOfLines={3}
            placeholder="Example: Light breeze, high comfort"
            placeholderTextColor="#7f96a9"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Choose items</Text>
          <View style={styles.itemGrid}>
            {itemCatalog.map((item) => {
              const active = selectedIds.includes(item.id);
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.itemButton, active && styles.itemButtonActive]}
                  onPress={() => toggleItem(item.id)}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.itemName, active && styles.itemNameActive]}>{item.name}</Text>
                  <Text style={[styles.itemMeta, active && styles.itemMetaActive]}>{item.category}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.9}>
          <Text style={styles.saveButtonText}>{isEditing ? 'Save changes' : 'Create outfit'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#1a212b',
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
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    color: '#8cb3c0',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#222d39',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#465d71',
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#eff6f8',
    fontSize: 15,
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  itemGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  itemButton: {
    backgroundColor: '#202d39',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#44637b',
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: 120,
  },
  itemButtonActive: {
    backgroundColor: '#5ad7c1',
    borderColor: '#5ad7c1',
  },
  itemName: {
    color: '#edf6fb',
    fontWeight: '700',
  },
  itemNameActive: {
    color: '#0d1f27',
  },
  itemMeta: {
    color: '#9bb2c0',
    marginTop: 4,
    fontSize: 11,
  },
  itemMetaActive: {
    color: '#19353f',
  },
  saveButton: {
    backgroundColor: '#59d0bf',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    fontWeight: '800',
    color: '#0d2027',
    fontSize: 16,
  },
});
