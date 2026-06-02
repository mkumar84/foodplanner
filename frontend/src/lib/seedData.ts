import type { FamilyProfile, MealPlan, Recipe } from '@/types'

export const SEED_FAMILY: FamilyProfile = {
  id: 'demo-family',
  familyName: 'The Kumar Family',
  budget: { total: 150, perDay: 21, currency: 'USD' },
  cuisinePreferences: [],
  mealsPerDay: 3,
  members: [
    {
      id: 'm1', name: 'Raj', age: 38, avatar: '👨', role: 'adult',
      dietary: { style: ['omnivore', 'athlete'], allergies: [], dislikes: ['liver'], goals: ['high-protein'], cuisines: ['Indian', 'Mediterranean', 'American'] },
    },
    {
      id: 'm2', name: 'Priya', age: 35, avatar: '👩', role: 'adult',
      dietary: { style: ['vegetarian'], allergies: [], dislikes: ['mushrooms'], goals: ['balanced'], cuisines: ['Indian', 'Mediterranean', 'Italian'] },
    },
    {
      id: 'm3', name: 'Aditya', age: 12, avatar: '👦', role: 'teen',
      dietary: { style: ['omnivore'], allergies: ['Peanuts'], dislikes: ['broccoli'], goals: ['balanced'], cuisines: ['Indian', 'American', 'Italian'] },
    },
    {
      id: 'm4', name: 'Meera', age: 7, avatar: '👧', role: 'child',
      dietary: { style: ['omnivore'], allergies: [], dislikes: ['spicy food', 'onions'], goals: ['balanced'], cuisines: ['Indian', 'American', 'Italian'] },
    },
  ],
}

export const SEED_MEAL_PLAN: MealPlan = {
  id: 'demo-plan',
  weekStart: new Date().toISOString(),
  generatedAt: new Date().toISOString(),
  totalBudget: 150,
  estimatedCost: 118.40,
  slots: [
    // Monday
    { day: 0, mealType: 'breakfast', meal: { id: 'b1', name: 'Masala Oats Bowl', description: 'Creamy oats with cumin, tomatoes & herbs', cuisine: 'Indian', prepTime: 10, calories: 320, protein: 12, carbs: 52, fat: 8, emoji: '🥣', safeFor: ['m1','m2','m3','m4'], agentNote: 'Priya-safe (veg). Oats swapped for Aditya — no peanut garnish.', ingredients: [{ name: 'Rolled oats', quantity: '2', unit: 'cups', aisle: 'pantry', estimatedCost: 0.80 }, { name: 'Tomatoes', quantity: '2', unit: 'medium', aisle: 'produce', estimatedCost: 0.60 }, { name: 'Cumin seeds', quantity: '1', unit: 'tsp', aisle: 'spices', estimatedCost: 0.10 }] } },
    { day: 0, mealType: 'lunch', meal: { id: 'l1', name: 'Dal Makhani', description: 'Rich, slow-cooked black lentils with cream', cuisine: 'Indian', prepTime: 40, calories: 480, protein: 22, carbs: 58, fat: 14, emoji: '🫕', safeFor: ['m1','m2','m3','m4'], agentNote: 'Vegetarian — works for Priya. High protein for Raj\'s goals.', ingredients: [{ name: 'Black lentils', quantity: '1', unit: 'cup', aisle: 'pantry', estimatedCost: 1.20 }, { name: 'Heavy cream', quantity: '¼', unit: 'cup', aisle: 'dairy', estimatedCost: 0.80 }, { name: 'Butter', quantity: '2', unit: 'tbsp', aisle: 'dairy', estimatedCost: 0.40 }] } },
    { day: 0, mealType: 'dinner', meal: { id: 'd1', name: 'Chicken Tikka with Rice', description: 'Marinated grilled chicken with basmati & raita', cuisine: 'Indian', prepTime: 35, calories: 620, protein: 48, carbs: 62, fat: 18, emoji: '🍗', safeFor: ['m1','m3','m4'], agentNote: 'Raj + kids safe. Priya gets paneer tikka variation.', ingredients: [{ name: 'Chicken breast', quantity: '600', unit: 'g', aisle: 'meat', estimatedCost: 5.40 }, { name: 'Basmati rice', quantity: '2', unit: 'cups', aisle: 'pantry', estimatedCost: 1.00 }, { name: 'Greek yogurt', quantity: '½', unit: 'cup', aisle: 'dairy', estimatedCost: 0.90 }] } },
    // Tuesday
    { day: 1, mealType: 'breakfast', meal: { id: 'b2', name: 'Avocado Toast & Eggs', description: 'Sourdough with smashed avo, poached eggs & chili flakes', cuisine: 'Western', prepTime: 15, calories: 420, protein: 18, carbs: 38, fat: 22, emoji: '🥑', safeFor: ['m1','m2','m3','m4'], agentNote: 'No peanuts — Aditya safe. Meera gets egg without chili.', ingredients: [{ name: 'Sourdough bread', quantity: '4', unit: 'slices', aisle: 'bakery', estimatedCost: 1.20 }, { name: 'Avocado', quantity: '2', unit: 'large', aisle: 'produce', estimatedCost: 2.00 }, { name: 'Eggs', quantity: '4', unit: 'large', aisle: 'dairy', estimatedCost: 1.00 }] } },
    { day: 1, mealType: 'lunch', meal: { id: 'l2', name: 'Greek Salad Wrap', description: 'Feta, olives, cucumbers & hummus in a whole-wheat tortilla', cuisine: 'Mediterranean', prepTime: 12, calories: 380, protein: 14, carbs: 46, fat: 16, emoji: '🌯', safeFor: ['m1','m2','m3','m4'], agentNote: 'All-family safe. Vegetarian. Meera\'s wrap made mild.', ingredients: [{ name: 'Whole-wheat tortillas', quantity: '4', unit: 'large', aisle: 'bakery', estimatedCost: 1.80 }, { name: 'Feta cheese', quantity: '100', unit: 'g', aisle: 'dairy', estimatedCost: 2.00 }, { name: 'Cucumber', quantity: '1', unit: 'large', aisle: 'produce', estimatedCost: 0.80 }] } },
    { day: 1, mealType: 'dinner', meal: { id: 'd2', name: 'Pasta Primavera', description: 'Penne with roasted seasonal vegetables & parmesan', cuisine: 'Italian', prepTime: 25, calories: 520, protein: 18, carbs: 72, fat: 16, emoji: '🍝', safeFor: ['m1','m2','m3','m4'], agentNote: 'Vegetarian for Priya. Added extra veggies for Raj\'s nutrition goals.', ingredients: [{ name: 'Penne pasta', quantity: '400', unit: 'g', aisle: 'pantry', estimatedCost: 1.60 }, { name: 'Bell peppers', quantity: '3', unit: 'mixed', aisle: 'produce', estimatedCost: 2.10 }, { name: 'Parmesan', quantity: '60', unit: 'g', aisle: 'dairy', estimatedCost: 1.80 }] } },
    // Wednesday
    { day: 2, mealType: 'breakfast', meal: { id: 'b3', name: 'Banana Smoothie Bowl', description: 'Thick banana-berry smoothie with granola & honey', cuisine: 'Fusion', prepTime: 8, calories: 380, protein: 10, carbs: 68, fat: 8, emoji: '🍌', safeFor: ['m1','m2','m3','m4'], agentNote: 'Peanut-free granola selected for Aditya.', ingredients: [{ name: 'Bananas', quantity: '3', unit: 'frozen', aisle: 'produce', estimatedCost: 0.60 }, { name: 'Mixed berries', quantity: '1', unit: 'cup', aisle: 'frozen', estimatedCost: 1.80 }, { name: 'Granola', quantity: '½', unit: 'cup', aisle: 'snacks', estimatedCost: 1.00 }] } },
    { day: 2, mealType: 'lunch', meal: { id: 'l3', name: 'Lentil Soup', description: 'Hearty red lentil soup with lemon & cumin', cuisine: 'Middle Eastern', prepTime: 30, calories: 340, protein: 20, carbs: 52, fat: 6, emoji: '🥣', safeFor: ['m1','m2','m3','m4'], agentNote: 'All dietary styles covered. High protein for Raj.', ingredients: [{ name: 'Red lentils', quantity: '1.5', unit: 'cups', aisle: 'pantry', estimatedCost: 1.20 }, { name: 'Carrots', quantity: '2', unit: 'medium', aisle: 'produce', estimatedCost: 0.40 }, { name: 'Lemons', quantity: '2', unit: 'large', aisle: 'produce', estimatedCost: 0.60 }] } },
    { day: 2, mealType: 'dinner', meal: { id: 'd3', name: 'Grilled Salmon & Quinoa', description: 'Herb-crusted salmon with quinoa pilaf & steamed broccoli', cuisine: 'Mediterranean', prepTime: 30, calories: 580, protein: 46, carbs: 44, fat: 22, emoji: '🐟', safeFor: ['m1','m3','m4'], agentNote: 'High protein for Raj. Priya gets paneer & quinoa version.', ingredients: [{ name: 'Salmon fillets', quantity: '4', unit: '150g each', aisle: 'meat', estimatedCost: 12.00 }, { name: 'Quinoa', quantity: '1.5', unit: 'cups', aisle: 'pantry', estimatedCost: 2.40 }, { name: 'Broccoli', quantity: '300', unit: 'g', aisle: 'produce', estimatedCost: 1.20 }] } },
    // Thursday
    { day: 3, mealType: 'breakfast', meal: { id: 'b4', name: 'Poha', description: 'Flattened rice with mustard seeds, curry leaves & peas', cuisine: 'Indian', prepTime: 15, calories: 290, protein: 8, carbs: 54, fat: 6, emoji: '🍚', safeFor: ['m1','m2','m3','m4'], agentNote: 'Mild spice for Meera. Traditional family favourite.', ingredients: [{ name: 'Flattened rice', quantity: '2', unit: 'cups', aisle: 'pantry', estimatedCost: 0.80 }, { name: 'Green peas', quantity: '½', unit: 'cup', aisle: 'frozen', estimatedCost: 0.60 }, { name: 'Curry leaves', quantity: '1', unit: 'sprig', aisle: 'produce', estimatedCost: 0.20 }] } },
    { day: 3, mealType: 'lunch', meal: { id: 'l4', name: 'Caprese Sandwich', description: 'Fresh mozzarella, tomato & basil on ciabatta with pesto', cuisine: 'Italian', prepTime: 10, calories: 420, protein: 18, carbs: 44, fat: 20, emoji: '🥪', safeFor: ['m1','m2','m3','m4'], agentNote: 'Vegetarian for Priya. Light and refreshing.', ingredients: [{ name: 'Ciabatta rolls', quantity: '4', unit: 'medium', aisle: 'bakery', estimatedCost: 2.40 }, { name: 'Fresh mozzarella', quantity: '200', unit: 'g', aisle: 'dairy', estimatedCost: 3.20 }, { name: 'Roma tomatoes', quantity: '3', unit: 'large', aisle: 'produce', estimatedCost: 1.20 }] } },
    { day: 3, mealType: 'dinner', meal: { id: 'd4', name: 'Butter Chicken & Naan', description: 'Classic tomato-cream chicken curry with garlic naan', cuisine: 'Indian', prepTime: 40, calories: 680, protein: 44, carbs: 60, fat: 26, emoji: '🫕', safeFor: ['m1','m3','m4'], agentNote: 'Priya gets paneer makhani. Aditya-safe — no peanut-based thickener.', ingredients: [{ name: 'Chicken thighs', quantity: '700', unit: 'g', aisle: 'meat', estimatedCost: 5.60 }, { name: 'Naan bread', quantity: '6', unit: 'pieces', aisle: 'bakery', estimatedCost: 2.80 }, { name: 'Tomato purée', quantity: '400', unit: 'g', aisle: 'pantry', estimatedCost: 1.20 }] } },
    // Friday
    { day: 4, mealType: 'breakfast', meal: { id: 'b5', name: 'Veggie Omelette', description: 'Fluffy omelette with spinach, capsicum & cheese', cuisine: 'Western', prepTime: 12, calories: 360, protein: 24, carbs: 8, fat: 26, emoji: '🍳', safeFor: ['m1','m2','m3','m4'], agentNote: 'High protein for Raj. No chili for Meera.', ingredients: [{ name: 'Eggs', quantity: '8', unit: 'large', aisle: 'dairy', estimatedCost: 2.00 }, { name: 'Baby spinach', quantity: '1', unit: 'cup', aisle: 'produce', estimatedCost: 0.80 }, { name: 'Cheddar cheese', quantity: '60', unit: 'g', aisle: 'dairy', estimatedCost: 1.20 }] } },
    { day: 4, mealType: 'lunch', meal: { id: 'l5', name: 'Rainbow Buddha Bowl', description: 'Roasted chickpeas, sweet potato, kale & tahini dressing', cuisine: 'Fusion', prepTime: 25, calories: 480, protein: 18, carbs: 62, fat: 18, emoji: '🥗', safeFor: ['m1','m2','m3','m4'], agentNote: 'Vegan-friendly. All family safe.', ingredients: [{ name: 'Chickpeas', quantity: '400', unit: 'g canned', aisle: 'pantry', estimatedCost: 1.00 }, { name: 'Sweet potato', quantity: '2', unit: 'medium', aisle: 'produce', estimatedCost: 1.20 }, { name: 'Kale', quantity: '100', unit: 'g', aisle: 'produce', estimatedCost: 1.40 }] } },
    { day: 4, mealType: 'dinner', meal: { id: 'd5', name: 'Homemade Pizza Night', description: 'Thin-crust pizzas with family\'s choice of toppings', cuisine: 'Italian', prepTime: 45, calories: 560, protein: 22, carbs: 70, fat: 20, emoji: '🍕', safeFor: ['m1','m2','m3','m4'], agentNote: 'Friday fun night. Each person customises their half.', ingredients: [{ name: 'Pizza dough', quantity: '2', unit: 'balls', aisle: 'bakery', estimatedCost: 3.00 }, { name: 'Tomato sauce', quantity: '1', unit: 'cup', aisle: 'pantry', estimatedCost: 0.80 }, { name: 'Mozzarella', quantity: '250', unit: 'g', aisle: 'dairy', estimatedCost: 3.60 }] } },
    // Saturday
    { day: 5, mealType: 'breakfast', meal: { id: 'b6', name: 'Fluffy Pancakes', description: 'American-style pancakes with maple syrup & berries', cuisine: 'American', prepTime: 20, calories: 440, protein: 12, carbs: 72, fat: 14, emoji: '🥞', safeFor: ['m1','m2','m3','m4'], agentNote: 'Weekend treat. Peanut-free syrup for Aditya.', ingredients: [{ name: 'All-purpose flour', quantity: '2', unit: 'cups', aisle: 'pantry', estimatedCost: 0.60 }, { name: 'Maple syrup', quantity: '½', unit: 'cup', aisle: 'pantry', estimatedCost: 2.40 }, { name: 'Mixed berries', quantity: '1', unit: 'cup', aisle: 'produce', estimatedCost: 2.00 }] } },
    { day: 5, mealType: 'lunch', meal: { id: 'l6', name: 'Pav Bhaji', description: 'Spiced mixed vegetable mash served with buttered bread rolls', cuisine: 'Indian', prepTime: 30, calories: 420, protein: 12, carbs: 64, fat: 14, emoji: '🫓', safeFor: ['m1','m2','m3','m4'], agentNote: 'Classic Indian street food. Mild version for Meera.', ingredients: [{ name: 'Mixed vegetables', quantity: '500', unit: 'g', aisle: 'produce', estimatedCost: 2.40 }, { name: 'Pav/bread rolls', quantity: '8', unit: 'pieces', aisle: 'bakery', estimatedCost: 2.00 }, { name: 'Butter', quantity: '3', unit: 'tbsp', aisle: 'dairy', estimatedCost: 0.60 }] } },
    { day: 5, mealType: 'dinner', meal: { id: 'd6', name: 'Lamb Kofta & Hummus', description: 'Grilled spiced lamb skewers with homemade hummus & pita', cuisine: 'Middle Eastern', prepTime: 35, calories: 640, protein: 42, carbs: 48, fat: 28, emoji: '🥙', safeFor: ['m1','m3','m4'], agentNote: 'Priya gets falafel version. High protein dinner for Raj.', ingredients: [{ name: 'Ground lamb', quantity: '600', unit: 'g', aisle: 'meat', estimatedCost: 8.40 }, { name: 'Pita bread', quantity: '6', unit: 'pieces', aisle: 'bakery', estimatedCost: 2.00 }, { name: 'Chickpeas', quantity: '400', unit: 'g canned', aisle: 'pantry', estimatedCost: 1.00 }] } },
    // Sunday
    { day: 6, mealType: 'breakfast', meal: { id: 'b7', name: 'Idli & Sambar', description: 'Steamed rice cakes with lentil vegetable soup & coconut chutney', cuisine: 'South Indian', prepTime: 20, calories: 310, protein: 10, carbs: 58, fat: 4, emoji: '🍱', safeFor: ['m1','m2','m3','m4'], agentNote: 'Light and healthy. Traditional Sunday morning.', ingredients: [{ name: 'Idli batter', quantity: '2', unit: 'cups', aisle: 'pantry', estimatedCost: 1.60 }, { name: 'Mixed vegetables', quantity: '200', unit: 'g', aisle: 'produce', estimatedCost: 1.20 }, { name: 'Toor dal', quantity: '½', unit: 'cup', aisle: 'pantry', estimatedCost: 0.80 }] } },
    { day: 6, mealType: 'lunch', meal: { id: 'l7', name: 'Sunday Roast Veg Tray', description: 'Honey-roasted root vegetables with rosemary potatoes & gravy', cuisine: 'British', prepTime: 50, calories: 460, protein: 10, carbs: 72, fat: 14, emoji: '🥕', safeFor: ['m1','m2','m3','m4'], agentNote: 'Relaxed Sunday lunch. Everyone happy!', ingredients: [{ name: 'Potatoes', quantity: '600', unit: 'g', aisle: 'produce', estimatedCost: 1.40 }, { name: 'Carrots', quantity: '300', unit: 'g', aisle: 'produce', estimatedCost: 0.60 }, { name: 'Parsnips', quantity: '200', unit: 'g', aisle: 'produce', estimatedCost: 0.80 }] } },
    { day: 6, mealType: 'dinner', meal: { id: 'd7', name: 'Biryani Night', description: 'Fragrant saffron-infused rice with mixed vegetable or chicken biryani', cuisine: 'Indian', prepTime: 60, calories: 620, protein: 28, carbs: 80, fat: 20, emoji: '🍛', safeFor: ['m1','m2','m3','m4'], agentNote: 'Sunday feast. Veg biryani base — chicken added separately for Raj & kids.', ingredients: [{ name: 'Basmati rice', quantity: '3', unit: 'cups', aisle: 'pantry', estimatedCost: 1.80 }, { name: 'Mixed vegetables', quantity: '400', unit: 'g', aisle: 'produce', estimatedCost: 2.40 }, { name: 'Saffron', quantity: '1', unit: 'pinch', aisle: 'spices', estimatedCost: 0.60 }] } },
  ],
}

export const SEED_RECIPES: Recipe[] = [
  {
    id: 'r1', name: 'Classic Dal Tadka', emoji: '🍲',
    description: 'Yellow lentils tempered with garlic, cumin & dried chili',
    cuisine: 'Indian', prepTime: 10, cookTime: 30, servings: 4, difficulty: 'easy',
    tags: ['vegetarian', 'vegan', 'high-protein', 'gluten-free'],
    nutrition: { calories: 280, protein: 16, carbs: 42, fat: 8 },
    safeFor: ['vegetarian', 'vegan', 'gluten-free'],
    ingredients: [
      { name: 'Yellow lentils', quantity: '1', unit: 'cup', aisle: 'pantry', estimatedCost: 1.00 },
      { name: 'Garlic', quantity: '4', unit: 'cloves', aisle: 'produce', estimatedCost: 0.20 },
      { name: 'Cumin seeds', quantity: '1', unit: 'tsp', aisle: 'spices', estimatedCost: 0.10 },
    ],
    steps: [
      'Rinse lentils and cook with 3 cups water until soft (about 20 min)',
      'Heat ghee in a small pan over medium-high heat',
      'Add cumin seeds — let them sizzle for 30 seconds',
      'Add minced garlic and dried chili, cook 1 minute',
      'Pour the tadka over cooked dal, season with salt & lemon',
    ],
  },
  {
    id: 'r2', name: 'Mediterranean Chickpea Salad', emoji: '🥗',
    description: 'Crispy chickpeas, cucumber, tomato & feta with lemon-herb dressing',
    cuisine: 'Mediterranean', prepTime: 15, cookTime: 0, servings: 4, difficulty: 'easy',
    tags: ['vegetarian', 'gluten-free', 'heart-healthy', 'under-20-min'],
    nutrition: { calories: 320, protein: 14, carbs: 36, fat: 14 },
    safeFor: ['vegetarian', 'gluten-free'],
    ingredients: [
      { name: 'Chickpeas', quantity: '400', unit: 'g canned', aisle: 'pantry', estimatedCost: 1.00 },
      { name: 'Cucumber', quantity: '1', unit: 'large', aisle: 'produce', estimatedCost: 0.80 },
      { name: 'Feta cheese', quantity: '100', unit: 'g', aisle: 'dairy', estimatedCost: 2.00 },
    ],
    steps: [
      'Drain and rinse chickpeas, pat dry',
      'Dice cucumber, halve tomatoes, slice olives',
      'Combine all vegetables and chickpeas in a large bowl',
      'Whisk lemon juice, olive oil, oregano for dressing',
      'Toss salad with dressing, top with crumbled feta',
    ],
  },
  {
    id: 'r3', name: 'Chicken Tikka Masala', emoji: '🍗',
    description: 'Tender marinated chicken in a rich tomato-cream sauce',
    cuisine: 'Indian', prepTime: 20, cookTime: 35, servings: 4, difficulty: 'medium',
    tags: ['high-protein', 'gluten-free'],
    nutrition: { calories: 580, protein: 46, carbs: 22, fat: 32 },
    safeFor: ['gluten-free'],
    ingredients: [
      { name: 'Chicken breast', quantity: '700', unit: 'g', aisle: 'meat', estimatedCost: 6.30 },
      { name: 'Tomato purée', quantity: '400', unit: 'g', aisle: 'pantry', estimatedCost: 1.20 },
      { name: 'Heavy cream', quantity: '½', unit: 'cup', aisle: 'dairy', estimatedCost: 1.20 },
    ],
    steps: [
      'Marinate chicken in yogurt and spices for 30 min',
      'Grill or pan-fry chicken until charred and cooked through',
      'Sauté onion, garlic, ginger until golden',
      'Add tomato purée and cook 10 min, add cream',
      'Combine chicken with sauce, simmer 10 min, serve with rice',
    ],
  },
  {
    id: 'r4', name: 'Banana Oat Muffins', emoji: '🧁',
    description: 'Naturally sweetened muffins — great for lunchboxes',
    cuisine: 'Western', prepTime: 10, cookTime: 22, servings: 12, difficulty: 'easy',
    tags: ['vegetarian', 'kid-friendly', 'snack', 'peanut-free'],
    nutrition: { calories: 160, protein: 4, carbs: 28, fat: 4 },
    safeFor: ['vegetarian'],
    ingredients: [
      { name: 'Ripe bananas', quantity: '3', unit: 'large', aisle: 'produce', estimatedCost: 0.60 },
      { name: 'Rolled oats', quantity: '2', unit: 'cups', aisle: 'pantry', estimatedCost: 0.80 },
      { name: 'Eggs', quantity: '2', unit: 'large', aisle: 'dairy', estimatedCost: 0.50 },
    ],
    steps: [
      'Preheat oven to 180°C / 350°F',
      'Mash bananas until smooth',
      'Blend oats into flour, mix all ingredients',
      'Divide batter into 12 muffin cups',
      'Bake 20-22 min until golden and a toothpick comes out clean',
    ],
  },
  {
    id: 'r5', name: 'Shrimp Stir-fry', emoji: '🍤',
    description: 'Quick garlic-ginger shrimp with snap peas & sesame noodles',
    cuisine: 'Asian', prepTime: 10, cookTime: 10, servings: 4, difficulty: 'easy',
    tags: ['high-protein', 'under-20-min', 'dairy-free'],
    nutrition: { calories: 380, protein: 34, carbs: 36, fat: 10 },
    safeFor: ['dairy-free'],
    ingredients: [
      { name: 'Shrimp', quantity: '500', unit: 'g', aisle: 'meat', estimatedCost: 7.00 },
      { name: 'Snap peas', quantity: '200', unit: 'g', aisle: 'produce', estimatedCost: 2.20 },
      { name: 'Noodles', quantity: '300', unit: 'g', aisle: 'pantry', estimatedCost: 1.60 },
    ],
    steps: [
      'Cook noodles per package directions, drain and toss with sesame oil',
      'Heat wok over high heat, add vegetable oil',
      'Stir-fry shrimp 2-3 min until pink, set aside',
      'Add snap peas, garlic, ginger — stir-fry 2 min',
      'Return shrimp, add soy sauce, toss everything together',
    ],
  },
  {
    id: 'r6', name: 'Palak Paneer', emoji: '🌿',
    description: 'Creamy spinach curry with cubes of fresh cottage cheese',
    cuisine: 'Indian', prepTime: 15, cookTime: 25, servings: 4, difficulty: 'medium',
    tags: ['vegetarian', 'gluten-free', 'high-protein'],
    nutrition: { calories: 360, protein: 20, carbs: 18, fat: 22 },
    safeFor: ['vegetarian', 'gluten-free'],
    ingredients: [
      { name: 'Paneer', quantity: '300', unit: 'g', aisle: 'dairy', estimatedCost: 4.20 },
      { name: 'Baby spinach', quantity: '400', unit: 'g', aisle: 'produce', estimatedCost: 2.40 },
      { name: 'Heavy cream', quantity: '3', unit: 'tbsp', aisle: 'dairy', estimatedCost: 0.60 },
    ],
    steps: [
      'Blanch spinach in boiling water 2 min, blend to smooth purée',
      'Pan-fry paneer cubes until golden, set aside',
      'Sauté onion, garlic, ginger with spices',
      'Add spinach purée, simmer 8 min',
      'Add paneer and cream, simmer 5 more min, season to taste',
    ],
  },
]
