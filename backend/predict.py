import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

# Load model
model = load_model("model/ai_detector.h5")

# Ask for image
img_path = input("Enter image path: ")

# Load image as 32x32
img = image.load_img(
    img_path,
    target_size=(32, 32)
)

# Convert image to array
img_array = image.img_to_array(img)

# Normalize
img_array = img_array / 255.0

# Add batch dimension
img_array = np.expand_dims(img_array, axis=0)

# Prediction
prediction = model.predict(
    img_array,
    verbose=0
)[0][0]

# FAKE = 0
# REAL = 1

if prediction >= 0.5:
    result = "REAL IMAGE"
    confidence = prediction * 100
else:
    result = "FAKE IMAGE"
    confidence = (1 - prediction) * 100

print("\n================================")
print("ORIGINCHECK RESULT")
print("================================")
print("Result :", result)
print("Confidence :", round(confidence, 2), "%")