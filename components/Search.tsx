// Imports for React Native components

// Imports for Expo Router navigation and URL parameter handling
import { router, useLocalSearchParams, usePathname } from "expo-router";
import { useState } from "react"; // State management hook
import { Image, TextInput, TouchableOpacity, View } from "react-native";
import { useDebouncedCallback } from "use-debounce";
// Imports for icons and debouncing utility
import icons from "@/constants/icons";

// Search component definition
const Search = () => {
  // biome-ignore lint/correctness/noUnusedVariables: Only take the path name for search params
  const path = usePathname(); // Get the current pathname (unused in this component)
  // Get local search parameters, specifically the 'query' parameter
  const params = useLocalSearchParams<{ query?: string }>();
  // State to manage the search input value, initialized from URL parameters
  const [search, setSearch] = useState(params.query);

  // Debounced callback to update the URL search parameter after a delay
  const debouncedSearch = useDebouncedCallback(
    (text: string) => {
      router.setParams({ query: text }); // Update the 'query' URL parameter
    },
    500 // 500ms delay for debouncing
  );

  // Handler for text input changes
  const handleSearch = (text: string) => {
    setSearch(text); // Update the local search state immediately
    debouncedSearch(text); // Trigger the debounced search to update URL
  };

  return (
    // Main container for the search input and filter button
    <View className="flex flex-row items-center justify-between w-full px-4 rounded-lg bg-accent-100 border border-primary-100 mt-5 py-2">
      {/* Container for the search icon and text input */}
      <View className="flex-1 flex flex-row items-center justify-start z-50">
        {/* Search icon */}
        <Image source={icons.search} className="size-5" />
        {/* Text input for search query */}
        <TextInput
          value={search} // Controlled component: input value from state
          onChangeText={handleSearch} // Handle text changes
          placeholder="Search for anything" // Placeholder text
          className="text-sm font-rubik text-black-300 ml-2 flex-1" // Styling for the input
        />
      </View>

      {/* Touchable opacity for the filter icon (currently no action) */}
      <TouchableOpacity>
        <Image source={icons.filter} className="size-5" />
      </TouchableOpacity>
    </View>
  );
};

export default Search;
