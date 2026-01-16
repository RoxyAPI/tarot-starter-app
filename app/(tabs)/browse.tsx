import { View, Text, FlatList, ActivityIndicator, Pressable } from "react-native";
import { useState, useEffect } from "react";
import { Image } from "expo-image";
import { router } from "expo-router";
import { appColors } from "../../src/constants/colors";
import { hasApiKey, tarotApi } from "../../src/api";
import type { BasicCard } from "../../src/api/types";

export default function BrowseCardsScreen() {
  const [cards, setCards] = useState<BasicCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'major' | 'minor'>('all');

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const data = await tarotApi.getCards();
      setCards(data.cards);
    } catch {
      setError("Failed to load cards");
    } finally {
      setLoading(false);
    }
  };

  const filteredCards = cards.filter(card => {
    if (filter === 'all') return true;
    return card.arcana === filter;
  });

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-zinc-950">
        <ActivityIndicator size="large" color={appColors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center px-6 bg-white dark:bg-zinc-950">
        <Text className="text-lg font-semibold text-red-500 mb-4">
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-zinc-950">
      <View className="flex-row p-4 gap-2">
        <Pressable
          onPress={() => setFilter('all')}
          className={`flex-1 py-2 px-4 rounded-lg ${filter === 'all' ? 'bg-violet-600' : 'bg-zinc-100 dark:bg-zinc-800'}`}
        >
          <Text className={`text-center font-semibold ${filter === 'all' ? 'text-white' : 'text-zinc-700 dark:text-zinc-300'}`}>
            All
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setFilter('major')}
          className={`flex-1 py-2 px-4 rounded-lg ${filter === 'major' ? 'bg-violet-600' : 'bg-zinc-100 dark:bg-zinc-800'}`}
        >
          <Text className={`text-center font-semibold ${filter === 'major' ? 'text-white' : 'text-zinc-700 dark:text-zinc-300'}`}>
            Major
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setFilter('minor')}
          className={`flex-1 py-2 px-4 rounded-lg ${filter === 'minor' ? 'bg-violet-600' : 'bg-zinc-100 dark:bg-zinc-800'}`}
        >
          <Text className={`text-center font-semibold ${filter === 'minor' ? 'text-white' : 'text-zinc-700 dark:text-zinc-300'}`}>
            Minor
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={filteredCards}
        numColumns={3}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 8 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/card/${item.id}`)}
            className="flex-1 p-2"
          >
            <View className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-2">
              <Image
                source={{ uri: item.imageUrl }}
                style={{ width: '100%', aspectRatio: 0.6 }}
                contentFit="contain"
              />
              <Text className="text-xs text-center mt-1 text-zinc-700 dark:text-zinc-300" numberOfLines={2}>
                {item.name}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}
