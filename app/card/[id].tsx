import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { Image } from "expo-image";
import { appColors } from "../../src/constants/colors";
import { tarotApi } from "../../src/api";
import type { TarotCard } from "../../src/api/types";

export default function CardDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [card, setCard] = useState<TarotCard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchCard();
  }, [id]);

  const fetchCard = async () => {
    try {
      const data = await tarotApi.getCardById(id);
      setCard(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-zinc-950">
        <ActivityIndicator size="large" color={appColors.primary} />
      </View>
    );
  }

  if (!card) return null;

  return (
    <ScrollView className="flex-1 bg-white dark:bg-zinc-950">
      <View className="p-6">
        <View className="items-center mb-6">
          <View className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl p-4">
            <Image
              source={{ uri: card.imageUrl }}
              style={{ width: 220, height: 374 }}
              contentFit="contain"
            />
          </View>
        </View>

        <Text className="text-3xl font-bold mb-4 text-center text-zinc-900 dark:text-white">
          {card.name}
        </Text>

        {card.upright && (
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-3 text-zinc-900 dark:text-white">
              Upright Meaning
            </Text>
            <View className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4">
              <Text className="text-zinc-700 dark:text-zinc-300 leading-6">
                {card.upright.description}
              </Text>
            </View>
          </View>
        )}

        {card.reversed && (
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-3 text-zinc-900 dark:text-white">
              Reversed Meaning
            </Text>
            <View className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4">
              <Text className="text-zinc-700 dark:text-zinc-300 leading-6">
                {card.reversed.description}
              </Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
