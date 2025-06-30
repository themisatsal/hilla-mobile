import { Stack } from 'expo-router';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { ArrowLeft, X } from 'lucide-react-native';

export default function FoodAnalysisLayout() {
  const router = useRouter();
  
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Food Analysis',
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={{ marginLeft: 8 }}
            >
              <ArrowLeft size={24} color="#007AFF" />
            </TouchableOpacity>
          )
        }} 
      />
      <Stack.Screen
        name="result"
        options={{
          presentation: 'modal',
          title: 'Nutritional Analysis',
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={{ marginLeft: 8 }}
            >
              <X size={24} color="#1D1D1F" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}