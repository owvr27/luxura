# ===========================
# train_model.py - Waste Classification Model Training
# ===========================

import os
import numpy as np
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import GlobalAveragePooling2D, Dense
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
from sklearn.metrics import classification_report, confusion_matrix

# ---------------------------
# 1️ Prepare Data Generators
# ---------------------------
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    width_shift_range=0.1,
    height_shift_range=0.1,
    zoom_range=0.1,
    horizontal_flip=True
)

val_test_datagen = ImageDataGenerator(rescale=1./255)

# ---------------------------
# 2️ Read images from folders
# ---------------------------
train_gen = train_datagen.flow_from_directory(
    'datasets/split/dataset_split/train',
    target_size=(224,224),
    batch_size=32,
    class_mode='categorical'
)

val_gen = val_test_datagen.flow_from_directory(
    'datasets/split/dataset_split/val',
    target_size=(224,224),
    batch_size=32,
    class_mode='categorical'
)

test_gen = val_test_datagen.flow_from_directory(
    'datasets/split/dataset_split/test',
    target_size=(224,224),
    batch_size=32,
    class_mode='categorical',
    shuffle=False
)

# ---------------------------
# 3️ Load MobileNetV2 and add custom layers
# ---------------------------
base = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224,224,3))
x = base.output
x = GlobalAveragePooling2D()(x)
x = Dense(128, activation='relu')(x)
preds = Dense(3, activation='softmax')(x)

model = Model(inputs=base.input, outputs=preds)

# Freeze base model layers
for layer in base.layers:
    layer.trainable = False

# ---------------------------
# 4️ Compile the model
# ---------------------------
model.compile(optimizer=Adam(1e-4), loss='categorical_crossentropy', metrics=['accuracy'])

# ---------------------------
# 5️ Training callbacks
# ---------------------------
callbacks = [
    EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True),
    ModelCheckpoint('models/best_model.h5', monitor='val_loss', save_best_only=True)
]

# ---------------------------
# 6️ Train the model
# ---------------------------
history = model.fit(
    train_gen,
    validation_data=val_gen,
    epochs=15,
    callbacks=callbacks
)

# ---------------------------
# 7️ Evaluate model on Test Set
# ---------------------------
loss, acc = model.evaluate(test_gen)
print("Test accuracy:", acc)

test_gen.reset()
preds = model.predict(test_gen)
y_pred = np.argmax(preds, axis=1)
y_true = test_gen.classes

print(classification_report(y_true, y_pred, target_names=list(test_gen.class_indices.keys())))
print(confusion_matrix(y_true, y_pred))

print("Training and evaluation complete! Model saved in 'models/best_model.h5'")