import os
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, BatchNormalization
from tensorflow.keras.applications.efficientnet import EfficientNetB7, preprocess_input
from tensorflow.keras.preprocessing import image
import numpy as np

# =========================================================
# Inisialisasi Model (harus sama seperti saat training)
# =========================================================
classes = ['Anthracnose','Bacterial Canker','Cutting Weevil','Die Back',
           'Gall Midge','Healthy','Powdery Mildew','Sooty Mould']

base_model = EfficientNetB7(
    include_top=False,
    weights='imagenet',
    input_shape=(224,224,3),
    pooling='max'
)
base_model.trainable = False

model = Sequential([
    base_model,
    BatchNormalization(),
    Dense(128, activation='relu'),
    Dropout(0.45),
    Dense(len(classes), activation='softmax')
])

# =========================================================
# Load weights dari folder data/
# =========================================================
here = os.path.dirname(os.path.abspath(__file__))
weights_path = os.path.join(here, '..', 'data', 'my_model_weights-v1-final.h5')
model.load_weights(weights_path)

# =========================================================
# Fungsi prediksi
# =========================================================
def predict_and_return(image_path):
    img = image.load_img(image_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)

    prediction = model.predict(img_array)
    predicted_class_index = np.argmax(prediction)
    predicted_class_label = classes[predicted_class_index]
    confidence = float(np.max(prediction))

    return {
        "disease": predicted_class_label,
        "confidence": confidence
    }
