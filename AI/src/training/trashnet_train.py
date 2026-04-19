#!/usr/bin/env python3
"""
Enhanced TrashNet Model Training
Uses real TrashNet dataset for waste classification
"""

import os
import numpy as np
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import GlobalAveragePooling2D, Dense, Dropout, BatchNormalization
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau
from tensorflow.keras.regularizers import l2
from sklearn.metrics import classification_report, confusion_matrix

def create_enhanced_model(input_shape=(224,224,3), num_classes=3):
    """Create enhanced model for TrashNet"""
    
    base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=input_shape)
    
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = BatchNormalization()(x)
    x = Dropout(0.4)(x)
    
    x = Dense(256, activation='relu', kernel_regularizer=l2(0.01))(x)
    x = BatchNormalization()(x)
    x = Dropout(0.3)(x)
    
    x = Dense(128, activation='relu', kernel_regularizer=l2(0.01))(x)
    x = BatchNormalization()(x)
    x = Dropout(0.2)(x)
    
    predictions = Dense(num_classes, activation='softmax')(x)
    
    model = Model(inputs=base_model.input, outputs=predictions)
    
    # Freeze base initially
    for layer in base_model.layers:
        layer.trainable = False
    
    return model, base_model

def main():
    print("TRASHNET ENHANCED MODEL TRAINING")
    print("="*50)
    
    # Enhanced data generators for TrashNet
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=30,
        width_shift_range=0.2,
        height_shift_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        shear_range=0.2,
        brightness_range=[0.7,1.3],
        fill_mode='nearest'
    )
    
    val_datagen = ImageDataGenerator(rescale=1./255)
    
    # Load TrashNet data
    try:
        train_gen = train_datagen.flow_from_directory(
            'datasets/trashnet_split/train',
            target_size=(224,224),
            batch_size=32,
            class_mode='categorical'
        )
        
        val_gen = val_datagen.flow_from_directory(
            'datasets/trashnet_split/val',
            target_size=(224,224),
            batch_size=32,
            class_mode='categorical'
        )
        
        test_gen = val_datagen.flow_from_directory(
            'datasets/trashnet_split/test',
            target_size=(224,224),
            batch_size=32,
            class_mode='categorical',
            shuffle=False
        )
        
        print(f"TrashNet dataset loaded:")
        print(f"  Training: {train_gen.samples} images")
        print(f"  Validation: {val_gen.samples} images")
        print(f"  Test: {test_gen.samples} images")
        
    except Exception as e:
        print(f"Error loading TrashNet data: {e}")
        return
    
    # Create enhanced model
    model, base_model = create_enhanced_model()
    
    # Stage 1: Train with frozen base
    print("\nStage 1: Training with frozen base model")
    model.compile(optimizer=Adam(learning_rate=1e-3), 
                  loss='categorical_crossentropy', 
                  metrics=['accuracy'])
    
    callbacks = [
        EarlyStopping(monitor='val_loss', patience=8, restore_best_weights=True),
        ModelCheckpoint('models/trashnet_model_stage1.h5', monitor='val_accuracy', save_best_only=True),
        ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=3, min_lr=1e-6)
    ]
    
    history1 = model.fit(train_gen, validation_data=val_gen, epochs=25, callbacks=callbacks)
    
    # Stage 2: Fine-tuning
    print("\nStage 2: Fine-tuning top layers")
    for layer in base_model.layers[-30:]:
        layer.trainable = True
    
    model.compile(optimizer=Adam(learning_rate=1e-5), 
                  loss='categorical_crossentropy', 
                  metrics=['accuracy'])
    
    callbacks2 = [
        EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True),
        ModelCheckpoint('models/trashnet_model_final.h5', monitor='val_accuracy', save_best_only=True),
        ReduceLROnPlateau(monitor='val_loss', factor=0.3, patience=5, min_lr=1e-7)
    ]
    
    history2 = model.fit(train_gen, validation_data=val_gen, epochs=30, callbacks=callbacks2)
    
    # Final evaluation
    print("\nFinal TrashNet Model Evaluation:")
    loss, accuracy = model.evaluate(test_gen, verbose=0)
    print(f"Test Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
    
    # Detailed metrics
    test_gen.reset()
    predictions = model.predict(test_gen, verbose=0)
    y_pred = np.argmax(predictions, axis=1)
    y_true = test_gen.classes
    
    print("\nClassification Report:")
    print(classification_report(y_true, y_pred, target_names=list(test_gen.class_indices.keys())))
    
    # Save final model
    model.save('models/trashnet_enhanced_final.h5')
    print("\nTrashNet enhanced model saved successfully!")

if __name__ == "__main__":
    main()
