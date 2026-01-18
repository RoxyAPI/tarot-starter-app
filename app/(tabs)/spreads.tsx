import { View, Text, Pressable, ScrollView, TextInput, ActivityIndicator } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Image } from "expo-image";
import { LayoutGrid, Heart, Briefcase, RotateCcw } from "lucide-react-native";
import { appColors } from "../../src/constants/colors";
import { tarotApi } from "../../src/api";
import type { SpreadResponse } from "../../src/api/types";

type SpreadPosition = SpreadResponse['positions'][number];

const spreads = [
  { id: 'three-card', name: 'Three Card Spread', description: 'Past, Present, Future', icon: LayoutGrid },
  { id: 'celtic-cross', name: 'Celtic Cross', description: '10-card comprehensive reading', icon: LayoutGrid },
  { id: 'love', name: 'Love Spread', description: 'Relationship insights', icon: Heart },
  { id: 'career', name: 'Career Spread', description: 'Professional guidance', icon: Briefcase },
];

export default function SpreadsScreen() {
  const [selectedSpread, setSelectedSpread] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SpreadResponse | null>(null);

  const handleSpreadClick = (spreadId: string) => {
    setSelectedSpread(spreadId);
    setResult(null);
    setQuestion("");
  };

  const handleGetReading = async () => {
    if (!selectedSpread) return;

    try {
      setLoading(true);
      let data;
      
      switch (selectedSpread) {
        case 'three-card':
          data = await tarotApi.getThreeCardSpread({ question: question || undefined });
          break;
        case 'celtic-cross':
          data = await tarotApi.getCelticCross({ question: question || undefined });
          break;
        case 'love':
          data = await tarotApi.getLoveSpread({ question: question || undefined });
          break;
        case 'career':
          data = await tarotApi.getCareerSpread({ question: question || undefined });
          break;
      }
      
      setResult(data!);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderCard = (position: SpreadPosition) => (
    <Pressable
      key={`${position.card.id}-${position.position}`}
      onPress={() => router.push(`/card/${position.card.id}`)}
      className="mb-4"
    >
      <Text className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-500 mb-2 font-medium">
        {position.name}
      </Text>
      <View className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-3 flex-row items-center">
        <Image
          source={{ uri: position.card.imageUrl }}
          style={{ width: 60, height: 102 }}
          contentFit="contain"
        />
        <View className="flex-1 ml-3">
          <Text className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">
            {position.card.name}
          </Text>
          {position.card.reversed && (
            <View className="flex-row items-center mb-2">
              <RotateCcw size={12} color={appColors.primary} />
              <Text className="text-xs text-violet-600 dark:text-violet-400 ml-1">
                Reversed
              </Text>
            </View>
          )}
          <Text className="text-xs text-zinc-600 dark:text-zinc-400 mb-2" numberOfLines={2}>
            {position.card.meaning}
          </Text>
          <Text className="text-xs italic text-zinc-500 dark:text-zinc-500" numberOfLines={3}>
            {position.interpretation}
          </Text>
        </View>
      </View>
    </Pressable>
  );

  if (selectedSpread && !result) {
    const spread = spreads.find(s => s.id === selectedSpread)!;
    
    return (
      <ScrollView className="flex-1 bg-white dark:bg-zinc-950">
        <View className="p-6">
          <Pressable onPress={() => setSelectedSpread(null)} className="mb-4">
            <Text className="text-violet-600 dark:text-violet-400 font-medium">← Back</Text>
          </Pressable>

          <Text className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white">
            {spread.name}
          </Text>
          <Text className="text-zinc-600 dark:text-zinc-400 mb-6">
            {spread.description}
          </Text>

          <TextInput
            value={question}
            onChangeText={setQuestion}
            placeholder="Enter your question (optional)..."
            placeholderTextColor={appColors.gray[400]}
            multiline
            numberOfLines={3}
            className="border border-zinc-300 dark:border-zinc-700 rounded-xl p-4 mb-4 min-h-[80px] bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
            style={{ textAlignVertical: 'top' }}
          />

          <Pressable
            onPress={handleGetReading}
            disabled={loading}
            className={`py-4 rounded-xl items-center ${loading ? 'bg-zinc-300 dark:bg-zinc-700' : 'bg-violet-600'}`}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-base">
                Get Reading
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  if (result) {
    const spread = spreads.find(s => s.id === selectedSpread)!;
    
    return (
      <ScrollView className="flex-1 bg-white dark:bg-zinc-950">
        <View className="p-6">
          <Pressable onPress={() => setResult(null)} className="mb-4">
            <Text className="text-violet-600 dark:text-violet-400 font-medium">← New Reading</Text>
          </Pressable>

          <Text className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white">
            {spread.name}
          </Text>
          
          {question && (
            <View className="bg-violet-50 dark:bg-violet-950/30 rounded-xl p-4 mb-6">
              <Text className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-500 mb-1">
                Your Question
              </Text>
              <Text className="text-zinc-900 dark:text-white">
                {question}
              </Text>
            </View>
          )}

          {result.positions.map((position) => renderCard(position))}

          {result.summary && (
            <View className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4 mt-4">
              <Text className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-500 mb-2 font-medium">
                Summary
              </Text>
              <Text className="text-zinc-700 dark:text-zinc-300 leading-6">
                {result.summary}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white dark:bg-zinc-950">
      <View className="p-6">
        <Text className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white">
          Tarot Spreads
        </Text>
        <Text className="text-zinc-600 dark:text-zinc-400 mb-6">
          Choose a spread for detailed guidance
        </Text>

        {spreads.map((spread) => (
          <Pressable
            key={spread.id}
            onPress={() => handleSpreadClick(spread.id)}
            className="flex-row bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4 mb-3 items-center"
          >
            <View className="mr-4">
              <spread.icon size={32} color={appColors.primary} />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold mb-1 text-zinc-900 dark:text-white">
                {spread.name}
              </Text>
              <Text className="text-zinc-600 dark:text-zinc-400 text-sm">
                {spread.description}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
