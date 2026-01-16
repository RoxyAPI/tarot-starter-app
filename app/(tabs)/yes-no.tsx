import { View, Text, ScrollView, Pressable, TextInput, ActivityIndicator } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { appColors } from "../../src/constants/colors";
import { tarotApi } from "../../src/api";
import type { YesNoResponse } from "../../src/api/types";
import { Image } from "expo-image";

export default function YesNoScreen() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<YesNoResponse | null>(null);

  const handleSubmit = async () => {
    if (!question.trim()) return;

    try {
      setLoading(true);
      const data = await tarotApi.getYesNo({ 
        question: question.trim(),
        seed: question.trim().toLowerCase().replace(/\s+/g, '-')
      });
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-zinc-950">
      <View className="p-6">
        <Text className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white">
          Ask a Yes/No Question
        </Text>
        <Text className="text-zinc-600 dark:text-zinc-400 mb-6">
          The cards will provide guidance on your question
        </Text>

        <TextInput
          value={question}
          onChangeText={setQuestion}
          placeholder="Enter your question..."
          placeholderTextColor={appColors.gray[400]}
          multiline
          numberOfLines={4}
          className="border border-zinc-300 dark:border-zinc-700 rounded-xl p-4 mb-4 min-h-[100px] bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
          style={{ textAlignVertical: 'top' }}
        />

        <Pressable
          onPress={handleSubmit}
          disabled={!question.trim() || loading}
          className={`py-4 rounded-xl items-center ${question.trim() && !loading ? 'bg-violet-600' : 'bg-zinc-300 dark:bg-zinc-700'}`}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold text-base">
              Ask the Cards
            </Text>
          )}
        </Pressable>

        {result && (
          <View className="mt-8">
            <View className="items-center mb-6">
              <Text className="text-5xl font-bold mb-2 text-zinc-900 dark:text-white">
                {result.answer.toUpperCase()}
              </Text>
              <Text className="text-zinc-600 dark:text-zinc-400 text-base">
                Confidence: {result.strength}
              </Text>
            </View>

            <Pressable 
              onPress={() => router.push(`/card/${result.card.id}`)}
              className="items-center mb-6"
            >
              <View className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl p-4">
                <Image
                  source={{ uri: result.card.imageUrl }}
                  style={{ width: 180, height: 300 }}
                  contentFit="contain"
                />
              </View>
              <Text className="text-lg font-semibold mt-4 text-zinc-900 dark:text-white">
                {result.card.name}
              </Text>
            </Pressable>

            <View className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4">
              <Text className="text-zinc-700 dark:text-zinc-300 leading-6">
                {result.interpretation}
              </Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
