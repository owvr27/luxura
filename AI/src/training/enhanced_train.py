# ===========================
# enhanced_train_model.py - Improved Waste Classification Model
# ===========================

import os
import numpy as np
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import GlobalAveragePooling2D, Dense, Dropout, BatchNormalization
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau, LearningRateScheduler
from tensorflow.keras.regularizers import l2
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.utils.class_weight import compute_class_weight
import matplotlib.pyplot as plt

def create_enhanced_model(input_shape=(224,224,3), num_classes=3):
    """Create enhanced model with regularization and complexity"""
    
    # Load base model
    base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=input_shape)
    
    # Add custom layers with regularization
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = BatchNormalization()(x)
    x = Dropout(0.4)(x)
    
    # First dense block
    x = Dense(256, activation='relu', kernel_regularizer=l2(0.01))(x)
    x = BatchNormalization()(x)
    x = Dropout(0.3)(x)
    
    # Second dense block
    x = Dense(128, activation='relu', kernel_regularizer=l2(0.01))(x)
    x = BatchNormalization()(x)
    x = Dropout(0.2)(x)
    
    # Output layer
    predictions = Dense(num_classes, activation='softmax')(x)
    
    model = Model(inputs=base_model.input, outputs=predictions)
    
    # Initially freeze base model layers
    for layer in base_model.layers:
        layer.trainable = False
    
    return model, base_model

def lr_scheduler(epoch, lr):
    """Learning rate scheduler"""
    if epoch < 10:
        return lr
    elif epoch < 20:
        return lr * 0.5
    else:
        return lr * 0.1

def get_class_weights(train_generator):
    """Calculate class weights for imbalanced dataset"""
    class_weights = compute_class_weight(
        class_weight='balanced',
        classes=np.unique(train_generator.classes),
        y=train_generator.classes
    )
    return dict(enumerate(class_weights))

# ---------------------------
# 1. Enhanced Data Generators
# ---------------------------
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=30,
    width_shift_range=0.2,
    height_shift_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    vertical_flip=False,  # Don't flip waste images vertically
    shear_range=0.2,
    brightness_range=[0.7,1.3],
    fill_mode='nearest'
)

val_test_datagen = ImageDataGenerator(rescale=1./255)

# ---------------------------
# 2. Load Data
# ---------------------------
try:
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
    
    print(f"Training samples: {train_gen.samples}")
    print(f"Validation samples: {val_gen.samples}")
    print(f"Test samples: {test_gen.samples}")
    
except Exception as e:
    print(f"Error loading data: {e}")
    exit(1)

# ---------------------------
# 3. Create Enhanced Model
# ---------------------------
model, base_model = create_enhanced_model()

# ---------------------------
# 4. Stage 1: Train with frozen base
# ---------------------------
print("\n" + "="*50)
print("STAGE 1: Training with frozen base model")
print("="*50)

# Calculate class weights
class_weights = get_class_weights(train_gen)
print(f"Class weights: {class_weights}")

# Compile for stage 1
model.compile(
    optimizer=Adam(learning_rate=1e-3), 
    loss='categorical_crossentropy', 
    metrics=['accuracy', 'top_k_categorical_accuracy']
)

# Callbacks for stage 1
callbacks_stage1 = [
    EarlyStopping(monitor='val_loss', patience=8, restore_best_weights=True, verbose=1),
    ModelCheckpoint('models/enhanced_model_stage1.h5', monitor='val_accuracy', save_best_only=True, verbose=1),
    ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=3, min_lr=1e-6, verbose=1),
    LearningRateScheduler(lr_scheduler, verbose=1)
]

# Train stage 1
history_stage1 = model.fit(
    train_gen,
    validation_data=val_gen,
    epochs=25,
    callbacks=callbacks_stage1,
    class_weight=class_weights,
    verbose=1
)

# Evaluate after stage 1
print("\nStage 1 Results:")
loss1, acc1, top_k1 = model.evaluate(test_gen, verbose=0)
print(f"Test Loss: {loss1:.4f}")
print(f"Test Accuracy: {acc1:.4f} ({acc1*100:.2f}%)")
print(f"Top-3 Accuracy: {top_k1:.4f} ({top_k1*100:.2f}%)")

# ---------------------------
# 5. Stage 2: Fine-tuning
# ---------------------------
print("\n" + "="*50)
print("STAGE 2: Fine-tuning top layers")
print("="*50)

# Unfreeze top layers of base model
for layer in base_model.layers[-30:]:  # Unfreeze last 30 layers
    layer.trainable = True

# Re-compile with lower learning rate for fine-tuning
model.compile(
    optimizer=Adam(learning_rate=1e-5),  # Lower learning rate for fine-tuning
    loss='categorical_crossentropy',
    metrics=['accuracy', 'top_k_categorical_accuracy']
)

# Callbacks for stage 2
callbacks_stage2 = [
    EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True, verbose=1),
    ModelCheckpoint('models/enhanced_model_final.h5', monitor='val_accuracy', save_best_only=True, verbose=1),
    ReduceLROnPlateau(monitor='val_loss', factor=0.3, patience=5, min_lr=1e-7, verbose=1)
]

# Train stage 2
history_stage2 = model.fit(
    train_gen,
    validation_data=val_gen,
    epochs=30,
    callbacks=callbacks_stage2,
    class_weight=class_weights,
    verbose=1
)

# ---------------------------
# 6. Final Evaluation
# ---------------------------
print("\n" + "="*50)
print("FINAL MODEL EVALUATION")
print("="*50)

# Final evaluation
loss, acc, top_k = model.evaluate(test_gen, verbose=0)
print(f"Final Test Loss: {loss:.4f}")
print(f"Final Test Accuracy: {acc:.4f} ({acc*100:.2f}%)")
print(f"Final Top-3 Accuracy: {top_k:.4f} ({top_k*100:.2f}%)")

# Detailed predictions
test_gen.reset()
predictions = model.predict(test_gen, verbose=0)
y_pred = np.argmax(predictions, axis=1)
y_true = test_gen.classes

# Classification report
print("\nDetailed Classification Report:")
print(classification_report(y_true, y_pred, 
                          target_names=list(test_gen.class_indices.keys()),
                          digits=4))

# Confusion matrix
cm = confusion_matrix(y_true, y_pred)
print("\nConfusion Matrix:")
print(cm)

# Per-class accuracy
print("\nPer-class Accuracy:")
for i, class_name in enumerate(test_gen.class_indices.keys()):
    class_mask = (y_true == i)
    if np.sum(class_mask) > 0:
        class_acc = np.sum(y_pred[class_mask] == i) / np.sum(class_mask)
        print(f"{class_name}: {class_acc:.4f} ({class_acc*100:.2f}%)")

# ---------------------------
# 7. Save Results
# ---------------------------
# Save training history
np.save('models/training_history_stage1.npy', history_stage1.history)
np.save('models/training_history_stage2.npy', history_stage2.history)

# Save final model
model.save('models/final_enhanced_model.h5')

print("\n" + "="*50)
print("TRAINING COMPLETE!")
print("="*50)
print("Models saved:")
print("- Stage 1: models/enhanced_model_stage1.h5")
print("- Final: models/final_enhanced_model.h5")
print("- Training history: models/training_history_*.npy")

# Calculate improvement
print(f"\nAccuracy Improvement:")
print(f"Stage 1: {acc1*100:.2f}%")
print(f"Final: {acc*100:.2f}%")
if acc > acc1:
    improvement = (acc - acc1) * 100
    print(f"Improvement from fine-tuning: +{improvement:.2f}%")
