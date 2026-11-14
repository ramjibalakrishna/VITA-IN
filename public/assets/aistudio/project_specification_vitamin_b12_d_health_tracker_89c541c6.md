# Project Specification: VITA-IN (Indian Vitamin B12 & D Deficiency Calculator & Health Tracker)

## 1. Executive Summary & Core Problem
A significant majority of the Indian population suffers from sub-optimal levels or clinical deficiencies of **Vitamin B12** (largely driven by vegetarian/low-meat diets and gut absorption issues) and **Vitamin D** (driven by indoor lifestyles, darker skin melanin synthesis rates, and pollution/urban living). 

**Core Problem Statement:** Users struggle to know whether their daily Indian diet and lifestyle habits provide enough bioavailable nutrients to prevent or reverse Vitamin B12 and Vitamin D deficiencies.

**Solution:** A premium, glassmorphic web application featuring an interactive **Deficiency Risk & Daily Intake Calculator**, a **Real-Time Health & Absorption Tracker**, an **Indian Dietary Meal Planner** (highlighting vegetarian, eggetarian, and non-vegetarian bioavailable sources), and an **Optimal Sunlight & Exercise Absorption Engine** tailored to Indian latitudes and UV indexes.

---

## 2. Target Audience & Context
* **Primary Users:** Urban and semi-urban Indians (ages 18–55), including vegetarians, vegans, fitness enthusiasts, corporate professionals working indoors, and individuals managing fatigue or diagnosed deficiencies.
* **Tone & Aesthetic:** Clinical credibility meets modern luxury wellness. High-contrast **Glassmorphism** (`backdrop-filter: blur`), translucent frosted cards over deep, calming ambient gradients (e.g., warm solar amber/gold accents for Vitamin D paired with deep cobalt/cyan accents for Vitamin B12 on a sleek dark/slate canvas).

---

## 3. Core Functional Modules

### Module A: Interactive Deficiency Risk & Baseline Calculator
* **Demographic & Lifestyle Inputs:**
  * Age, Biological Sex, Skin Tone (Fitzpatrick Scale I–VI—crucial for Indian UV-B synthesis estimation).
  * Dietary Preference: Strict Vegetarian, Lacto-Vegetarian (Dairy), Eggetarian, Non-Vegetarian.
  * Sun Exposure Habits: Average daily minutes outdoors, time window (e.g., 7–9 AM vs. 11 AM–2 PM), clothing coverage (arms/legs exposed vs. covered).
  * Symptom Checker (Optional quick toggles): Chronic fatigue, tingling/numbness in extremities, bone/joint ache, brain fog, hair fall.
  * Optional Lab Input: Latest Serum 25(OH)D ($\text{ng/mL}$) and Serum Vitamin B12 ($\text{pg/mL}$) values.
* **Calculated Outputs:**
  * Daily Recommended Dietary Allowance (RDA) tailored to ICMR (Indian Council of Medical Research) guidelines:
    * Vitamin D: $600\text{ IU}$ ($15\ \mu\text{g}$) baseline, scaling up to $1000\text{–}2000\text{ IU}$ for deficiency recovery.
    * Vitamin B12: $2.2\ \mu\text{g}$ baseline for adults.
  * Current Estimated Daily Intake vs. Deficit Gap ($\%$).

### Module B: Landing Dashboard (Glassmorphic Command Center)
* **Hero Status Rings / Gauges:** Dual translucent radial progress rings showing today's **Vitamin D ($\text{IU}$)** and **Vitamin B12 ($\mu\text{g}$)** completion percentages.
* **Live Solar & Absorption Window Widget:**
  * Displays the optimal local sunlight window (e.g., **10:30 AM – 1:30 PM** in Indian cities for peak UV-B rays) with a countdown timer and UV Index indicator.
  * Calculates estimated IU synthesized based on logged outdoor exposure minutes and skin tone.
* **Quick-Log Action Bar:** One-tap logging for Indian meals, sunlight sessions, and supplements.

### Module C: Indian Food & Bioavailability Engine (Solving the Core Problem)
* **Curated Indian Food Database:**
  * **Vitamin B12 Sources:** Curd/Dahi, Paneer, Milk, Fortified Nutritional Yeast, Fermented foods (Idli/Dosa batter context), Eggs, Rohu/Pomfret fish, Chicken, Mutton liver.
  * **Vitamin D Sources:** Sun-exposed Mushrooms, Fortified Milk/Oil, Egg Yolk, Fatty Fish (Hilsa, Mackerel/Bangda), Cod Liver Oil.
* **Smart "Gap-Filler" Meal Recommender:** Dynamically suggests exact portions of Indian foods needed to close today's remaining deficit (e.g., *"Add 1 bowl of thick curd + 2 boiled eggs to hit 85% of your B12 goal"*).
* **Absorption Enhancers & Blockers Alerts:**
  * Alerts users to pair Vitamin D with **healthy fats** (Ghee, nuts, seeds) for fat-soluble absorption.
  * Warns against drinking **Chai/Coffee immediately after meals** (tannins/polyphenols inhibit nutrient absorption).

### Module D: Exercise & Sunlight Absorption Optimizer
* **Outdoor Exercise Sync:** Recommends specific outdoor workouts (brisk walking, Surya Namaskar on the terrace/balcony, jogging, outdoor yoga) timed with peak UV-B windows to combine mechanical bone-loading (which aids Vitamin D utilization) with direct skin synthesis.
* **Session Timer:** Built-in interactive timer for safe sun exposure (e.g., 15–20 minutes without sunscreen on forearms/face before applying SPF) to maximize synthesis without sunburn.

---

## 4. Technical Architecture (Post-Export to AI Studio)
* **Frontend Stack:** React (TypeScript), Tailwind CSS, Lucide Icons, Framer Motion (for fluid glassmorphic micro-interactions).
* **State & Persistence:** LocalStorage for immediate zero-friction tracking, structured cleanly for easy upgrade to Firebase/Supabase.
* **AI Integration (Gemini API):**
  * **Smart Meal Analyzer:** Users can type a natural-language Indian meal (e.g., *"2 masala dosas with sambar and a glass of buttermilk"*) and Gemini estimates the exact B12 ($\mu\text{g}$) and D ($\text{IU}$) content plus absorption tips.
  * **Personalized Weekly Protocol:** Generates a 7-day Indian vegetarian/non-vegetarian meal and sunlight schedule based on user deficits.

---

## 5. Success Metrics
1. User can calculate their personalized B12 & D gap in under **60 seconds**.
2. Zero-clutter, high-legibility glassmorphic UI that clearly distinguishes B12 (Cyan/Blue) and D (Solar Gold/Amber).
3. Actionable, culturally accurate Indian dietary recommendations that directly solve the core problem of food-first deficiency prevention.