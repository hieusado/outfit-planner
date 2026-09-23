import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Outfit } from '../services/mockData';

interface OutfitCardProps {
  outfit: Outfit;
  onView: () => void;
  onMarkToday: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

export function OutfitCard({ outfit, onView, onMarkToday, onDelete, onEdit }: OutfitCardProps) {
  return (
    <Pressable onPress={onView} style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>{outfit.name}</Text>
          <Text style={styles.meta}>{outfit.dateWorn}</Text>
        </View>

        <TouchableOpacity style={styles.actionBadge} onPress={onMarkToday} activeOpacity={0.85}>
          <Text style={styles.actionBadgeText}>Log today</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.note}>{outfit.weatherNote}</Text>

      <View style={styles.tagRow}>
        {outfit.items.slice(0, 4).map((item) => (
          <View key={item.id} style={styles.tag}>
            <Text style={styles.tagText}>{item.name}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footerRow}>
        <TouchableOpacity style={styles.secondaryAction} onPress={onEdit} activeOpacity={0.9}>
          <Text style={styles.secondaryActionText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteAction} onPress={onDelete} activeOpacity={0.9}>
          <Text style={styles.deleteActionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#202d39',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#3d5162',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#edf5f8',
  },
  meta: {
    color: '#8ba6b8',
    marginTop: 6,
  },
  actionBadge: {
    backgroundColor: '#5ad7c1',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  actionBadgeText: {
    color: '#0d1d24',
    fontWeight: '700',
    fontSize: 11,
  },
  note: {
    color: '#bfd0db',
    marginBottom: 10,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#263a49',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: {
    color: '#dfeaf3',
    fontSize: 11,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  secondaryAction: {
    flex: 1,
    backgroundColor: '#2a3d4f',
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryActionText: {
    color: '#ebf5f9',
    fontWeight: '700',
  },
  deleteAction: {
    flex: 1,
    backgroundColor: '#3f2428',
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteActionText: {
    color: '#ffb7b7',
    fontWeight: '700',
  },
});
