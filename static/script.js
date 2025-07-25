document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("healthForm");
  const resultsDiv = document.getElementById("results");

  const explanations = {
    BMI: {
      meaning: "Body Mass Index: Indicates if your weight is healthy.",
      unit: "kg/m²",
      getIdeal: () => "18.5 – 24.9"
    },
    BMR: {
      meaning: "Calories burned at rest (Basal Metabolic Rate).",
      unit: "kcal/day",
      getIdeal: g => g === 1 ? "1600 – 1900" : "1400 – 1700"
    },
    IdealWeight: {
      meaning: "Ideal weight for your height.",
      unit: "kg",
      getIdeal: (_, __, val) => `${val} kg`
    },
    DailyCalories: {
      meaning: "Recommended daily calorie intake.",
      unit: "kcal/day",
      getIdeal: g => g === 1 ? "2500 – 2800" : "2000 – 2200"
    },
    BodyFatPercentage: {
      meaning: "Percentage of fat in your body.",
      unit: "%",
      getIdeal: g => g === 1 ? "10 – 20%" : "18 – 28%"
    },
    LeanBodyMass: {
      meaning: "Non-fat body mass.",
      unit: "kg",
      getIdeal: () => "Higher is better"
    },
    FatMass: {
      meaning: "Total fat in your body.",
      unit: "kg",
      getIdeal: () => "Keep under 25% of body weight"
    },
    BodySurfaceArea: {
      meaning: "External surface area of your body.",
      unit: "m²",
      getIdeal: () => "1.6 – 2.0 m²"
    },
    WaistToHeightRatio: {
      meaning: "Waist-to-Height Ratio: Keep < 0.5.",
      unit: "",
      getIdeal: () => "< 0.5"
    },
    ProteinIntake: {
      meaning: "Daily protein recommendation.",
      unit: "g/day",
      getIdeal: () => "0.8g/kg body weight"
    }
  };

  const categories = {
    "Body Composition": ["BMI", "BodyFatPercentage", "LeanBodyMass", "FatMass", "IdealWeight"],
    "Metabolic Health": ["BMR", "DailyCalories", "ProteinIntake"],
    "Surface & Ratios": ["BodySurfaceArea", "WaistToHeightRatio"]
  };

  // Step 1: Show result boxes initially with placeholders
  resultsDiv.innerHTML = "";

  for (const [category, keys] of Object.entries(categories)) {
    const section = document.createElement("div");
    section.className = "category-section";

    const heading = document.createElement("h3");
    heading.textContent = category;
    heading.className = "category-heading";
    section.appendChild(heading);

    const group = document.createElement("div");
    group.className = "result-group";

    keys.forEach(key => {
      const detail = explanations[key];
      const card = document.createElement("div");
      card.className = "result-card";
      card.id = `card-${key}`;

      card.innerHTML = `
        <div class="result-title">${key.replace(/([A-Z])/g, ' $1')}:</div>
        <div class="result-value" id="value-${key}">--</div>
        <div class="result-info">${detail.meaning}</div>
        <div class="result-ideal" id="ideal-${key}"><strong>Ideal:</strong> --</div>
      `;

      group.appendChild(card);
    });

    section.appendChild(group);
    resultsDiv.appendChild(section);
  }

  // Step 2: Fetch calculated values on form submit
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const age = parseInt(document.getElementById("age").value);
    const gender = parseInt(document.getElementById("gender").value);
    const height = parseFloat(document.getElementById("height").value);
    const weight = parseFloat(document.getElementById("weight").value);

    const data = { age, gender, height, weight };

    fetch("/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(results => {
      for (const [key, value] of Object.entries(results)) {
        const detail = explanations[key];
        const unit = detail?.unit || "";
        const idealText = typeof detail?.getIdeal === 'function'
          ? detail.getIdeal(gender, age, results.IdealWeight)
          : "--";

        const valueDiv = document.getElementById(`value-${key}`);
        const idealDiv = document.getElementById(`ideal-${key}`);

        if (valueDiv) valueDiv.textContent = `${value} ${unit}`;
        if (idealDiv) idealDiv.innerHTML = `<strong>Ideal:</strong> ${idealText}`;
      }
    })
    .catch(err => {
      alert("An error occurred. Please check your input and try again.");
      console.error("Error fetching results:", err);
    });
  });
});
