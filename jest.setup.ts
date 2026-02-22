// expo-secure-store — native module, unusable in Node
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn().mockResolvedValue(null),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

// expo-router — navigation not available in test environment
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  router: {
    push: jest.fn(),
    replace: jest.fn(),
  },
}));

// @expo/vector-icons — renders as a plain string tag in tests
jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons',
}));

// lucide-react-native — SVG-based, not renderable in Node
jest.mock('lucide-react-native', () => ({
  Check: 'Check',
  X: 'X',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
}));

// react-native-reanimated — UI thread animations, mock for safety
jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock')
);
