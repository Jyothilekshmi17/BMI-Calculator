from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/calculate", methods=["POST"])
def calculate():
    data = request.json
    age = data["age"]
    gender = data["gender"]
    height = data["height"]
    weight = data["weight"]

    height_m = height / 100
    bmi = round(weight / (height_m ** 2), 2)
    bmr = round(10 * weight + 6.25 * height - 5 * age + (5 if gender == 1 else -161), 2)
    ideal_weight = round(22 * height_m ** 2, 2)
    daily_calories = round(bmr * 1.375, 2)
    body_fat_percentage = round((1.2 * bmi + 0.23 * age - 10.8 * gender - 5.4), 2)
    lean_body_mass = round(weight * (1 - body_fat_percentage / 100), 2)
    fat_mass = round(weight - lean_body_mass, 2)
    bsa = round(0.007184 * (height ** 0.725) * (weight ** 0.425), 2)
    whtr = round((0.45 * height) / height, 2)  # Approx waist = 0.45 * height
    protein_intake = round(0.8 * weight, 2)

    return jsonify({
        "BMI": bmi,
        "BMR": bmr,
        "IdealWeight": ideal_weight,
        "DailyCalories": daily_calories,
        "BodyFatPercentage": body_fat_percentage,
        "LeanBodyMass": lean_body_mass,
        "FatMass": fat_mass,
        "BodySurfaceArea": bsa,
        "WaistToHeightRatio": whtr,
        "ProteinIntake": protein_intake
    })

if __name__ == "__main__":
    app.run(debug=True)
