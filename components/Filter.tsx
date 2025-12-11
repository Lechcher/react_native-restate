import { router, useLocalSearchParams } from "expo-router"; // Navigation and URL parameter handling
import { useState } from "react"; // State management hook
import { ScrollView, Text, TouchableOpacity } from "react-native"; // UI components from React Native
// Imports for React, Expo Router, and React Native components
import { categories } from "@/constants/data"; // Data for filter categories

// Filter component definition
const Filter = () => {
  // Get local search parameters to pre-select a filter category
  const params = useLocalSearchParams<{ filter?: string }>();
  // State to manage the currently selected category, defaulting to "All" or the URL parameter
  const [selectedCategory, setSelectedCategory] = useState(
    params.filter || "All"
  );

  // Handler function for when a category is selected
  const handleCategorySelect = (category: string) => {
    // If the same category is selected again, deselect it and clear the filter
    if (category === selectedCategory) {
      setSelectedCategory("All");
      router.setParams({ filter: "" }); // Clear the filter in the URL
      return;
    }

    // Set the newly selected category and update the URL parameter
    setSelectedCategory(category);
    router.setParams({ filter: category });
  };

  return (
    // Horizontal scroll view for displaying filter categories
    <ScrollView
      horizontal // Enable horizontal scrolling
      showsHorizontalScrollIndicator={false} // Hide the scroll indicator
      className="mt-3 mb-2" // Tailwind CSS classes for margin
    >
      {/* Map through the categories data to render each filter item */}
      {categories.map((item) => (
        // Touchable opacity for each category button
        <TouchableOpacity
          onPress={() => handleCategorySelect(item.category)} // Handle category selection on press
          key={item.category} // Unique key for list rendering
          // Dynamic styling based on whether the category is selected
          className={`flex flex-col items-start mr-4 px-4 py-2 rounded-full ${selectedCategory === item.category ? "bg-primary-300" : "bg-primary-100 border border-primary-200"}`}
        >
          {/* Text displaying the category title */}
          <Text
            // Dynamic styling for text based on whether the category is selected
            className={`text-sm ${selectedCategory === item.category ? "text-white font-rubik-bold mt-0.5" : "text-black-300 font-rubik"}`}
          >
            {item.title}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default Filter;
