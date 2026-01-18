import { View, Text, ScrollView, ActivityIndicator, Pressable } from "react-native";
import { useState, useEffect } from "react";
import { Image } from "expo-image";
import { hasApiKey, tarotApi } from "../../src/api";
import { useUserId } from "../../src/hooks/useUserId";
import type { DailyCardResponse } from "../../src/api/types";
import { RotateCcw } from "lucide-react-native";
import { appColors } from "../../src/constants/colors";

export default function DailyCardScreen() {
  const { userId, loading: userIdLoading } = useUserId();
  const [dailyCard, setDailyCard] = useState<DailyCardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userIdLoading && userId) {
      fetchDailyCard();
    }
  }, [userId, userIdLoading]);

  const fetchDailyCard = async () => {
    if (!hasApiKey()) {
      setError("API key not configured");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const today = new Date().toISOString().split('T')[0];
      const data = await tarotApi.getDailyCard({ userId: userId || "", date: today });
      setDailyCard(data);
    } catch {
      setError("Failed to load daily card");
    } finally {
      setLoading(false);
    }
  };

  if (loading || userIdLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-zinc-900">
        <ActivityIndicator size="large" color={appColors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-zinc-900 px-6">
        <Text className="text-xl font-semibold text-red-500 mb-4 text-center">{error}</Text>
        <Pressable
          onPress={fetchDailyCard}
          className="bg-violet-600 px-6 py-3 rounded-xl active:bg-violet-700"
        >
          <Text className="text-white font-semibold">Retry</Text>
        </Pressable>
      </View>
    );
  }

  if (!dailyCard) return null;

  const card = dailyCard.card;
  const isReversed = card.reversed;

  return (
    <ScrollView className="flex-1 bg-white dark:bg-zinc-950">
      <View className="px-6 pt-6 pb-8">
        <View className="items-center">
          <Text className="text-sm uppercase tracking-wider text-zinc-500 dark:text-zinc-500 mb-3 font-medium">
            {new Date(dailyCard.date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric',
              year: 'numeric'
            })}
          </Text>
          <Text className="text-4xl font-bold text-zinc-900 dark:text-white text-center">
            Your Daily Card
          </Text>
        </View>

        <View className="items-center mb-8">
          <View
            className="bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 rounded-3xl p-6 shadow-2xl"
            style={{ 
              transform: [{ rotate: isReversed ? '180deg' : '0deg' }],
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.15,
              shadowRadius: 20,
              elevation: 10
            }}
          >
            <Image
              source={{ uri: card.imageUrl }}
              style={{ width: 220, height: 374 }}
              contentFit="contain"
              transition={300}
            />
          </View>
          
          <View className="items-center">
            <Text className="text-3xl font-bold text-zinc-900 dark:text-white text-center mb-2">
              {card.name}
            </Text>
            {isReversed && (
              <View className="flex-row items-center bg-violet-50 dark:bg-violet-950/50 px-4 py-2 rounded-full">
                <RotateCcw size={16} color={appColors.primary} />
                <Text className="text-violet-600 dark:text-violet-400 ml-2 font-semibold">
                  Reversed
                </Text>
              </View>
            )}
          </View>
        </View>

        {dailyCard.dailyMessage && (
          <View className="mb-6 bg-violet-50 dark:bg-violet-950/30 rounded-2xl p-6 border border-violet-100 dark:border-violet-900/50">
            <Text className="text-base text-zinc-700 dark:text-zinc-300 leading-7 text-center">
              {dailyCard.dailyMessage}
            </Text>
          </View>
        )}

        <View className="mb-6">
          <Text className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-500 mb-3 font-medium">
            Keywords
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {card.keywords.map((keyword, index) => (
              <View
                key={index}
                className="bg-zinc-100 dark:bg-zinc-800 px-4 py-2.5 rounded-full"
              >
                <Text className="text-zinc-700 dark:text-zinc-300 text-sm font-medium">
                  {keyword}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View>
          <Text className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-500 mb-4 font-medium">
            Meaning
          </Text>
          <View className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-6">
            <Text className="text-base text-zinc-700 dark:text-zinc-300 leading-7">
              {card.meaning}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
