/**
 * react-native-web mendukung state `hovered` pada Pressable, tetapi tipe
 * RN intinya belum mengekspose properti ini. Augmentasi agar komponen
 * hover-aware tetap type-safe di kedua platform.
 */
import 'react-native';

declare module 'react-native' {
  interface PressableStateCallbackType {
    readonly hovered?: boolean;
    readonly pressed?: boolean;
  }
}
