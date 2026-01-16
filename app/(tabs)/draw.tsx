import { View, Text, Pressable, FlatList, ActivityIndicator } from "react-native";
import { useState } from "react";
import { Image } from "expo-image";
import { router } from "expo-router";
import { tarotApi } from "../../src/api";
import type { DrawnCard } from "../../src/api/types";

export default function DrawScreen() {
  const [count, setCount] = useState(3);
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState<DrawnCard[]>([]);

  const handleDraw = async () => {
    try {
      setLoading(true);
      const data = await tarotApi.drawCards({ count });
      setCards(data.cards);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white dark:bg-zinc-950 p-6">
      <Text className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white">
        Draw Cards
      </Text>
      <Text className="text-zinc-600 dark:text-zinc-400 mb-6">
        Draw random cards for quick insights
      </Text>

      <View className="flex-row gap-2 mb-6">
        {[1, 3, 5, 10].map((n) => (
          <Pressable
            key={n}
            onPress={() => setCount(n)}
            className={`flex-1 py-3 rounded-lg ${count === n ? 'bg-violet-600' : 'bg-zinc-100 dark:bg-zinc-800'}`}
          >
            <Text className={`text-center font-semibold ${count === n ? 'text-white' : 'text-zinc-700 dark:text-zinc-300'}`}>
              {n}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={handleDraw}
        disabled={loading}
        className={`py-4 rounded-xl items-center mb-6 ${loading ? 'bg-zinc-300 dark:bg-zinc-700' : 'bg-violet-600'}`}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-semibold text-base">
            Draw {count} {count === 1 ? 'Card' : 'Cards'}
          </Text>
        )}
      </Pressable>

      {cards.length > 0 && (
        <FlatList
          data={cards}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/card/${item.id}`)}
              className="mr-4 w-[150px]"
            >
              <View className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-3">
                <Image
                  source={{ uri: item.imageUrl }}
                  style={{ width: 126, height: 210 }}
                  contentFit="contain"
                />
                <Text className="text-xs mt-2 text-center font-semibold text-zinc-900 dark:text-white">
                  {item.name}
                </Text>
                {item.reversed && (
                  <Text className="text-xs text-violet-600 dark:text-violet-400 text-center mt-1">
                    Reversed
                  </Text>
                )}
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}
