#!/usr/bin/env python3
"""
TrashNet Dataset Integration
Downloads and sets up TrashNet dataset for enhanced waste classification
"""

import os
import shutil
import random
from pathlib import Path
import numpy as np

def install_kagglehub():
    """Install kagglehub if not available"""
    try:
        import kagglehub
        print("kagglehub already installed")
        return True
    except ImportError:
        print("Installing kagglehub...")
        os.system("pip install kagglehub")
        try:
            import kagglehub
            print("kagglehub installed successfully")
            return True
        except ImportError:
            print("Failed to install kagglehub")
            return False

def download_trashnet_dataset():
    """Download TrashNet dataset using kagglehub"""
    print("Downloading TrashNet dataset...")
    
    try:
        import kagglehub
        
        # Try first dataset
        try:
            print("Trying dataset: vishwasmishra1234/trash-net")
            path = kagglehub.dataset_download("vishwasmishra1234/trash-net")
            print(f"Downloaded dataset to: {path}")
            return path
        except Exception as e:
            print(f"First dataset failed: {e}")
            
        # Try second dataset
        try:
            print("Trying dataset: feyzazkefe/trashnet")
            path = kagglehub.dataset_download("feyzazkefe/trashnet")
            print(f"Downloaded dataset to: {path}")
            return path
        except Exception as e:
            print(f"Second dataset failed: {e}")
            
        print("Both TrashNet datasets failed to download")
        return None
        
    except Exception as e:
        print(f"Error importing kagglehub: {e}")
        return None

def explore_dataset_structure(path):
    """Explore and understand the dataset structure"""
    print(f"\nExploring dataset structure at: {path}")
    
    dataset_path = Path(path)
    
    if not dataset_path.exists():
        print("Dataset path does not exist")
        return None
    
    # Find all directories and files
    print("\nDataset contents:")
    for item in dataset_path.iterdir():
        if item.is_dir():
            file_count = len(list(item.iterdir()))
            print(f"  Directory: {item.name} ({file_count} items)")
            
            # Check for subdirectories (likely classes)
            subdirs = [d for d in item.iterdir() if d.is_dir()]
            if subdirs:
                print(f"    Subdirectories:")
                for subdir in subdirs:
                    img_count = len(list(subdir.iterdir()))
                    print(f"      {subdir.name}: {img_count} images")
        else:
            print(f"  File: {item.name}")
    
    return dataset_path

def map_trashnet_to_waste_classes(dataset_path):
    """Map TrashNet classes to our waste categories (metal, paper, plastic)"""
    print("\nMapping TrashNet classes to waste categories...")
    
    # Common TrashNet classes and their mappings
    trashnet_mappings = {
        # Paper items
        'paper': 'paper',
        'cardboard': 'paper',
        'newspaper': 'paper',
        'magazine': 'paper',
        'book': 'paper',
        'office paper': 'paper',
        
        # Plastic items
        'plastic': 'plastic',
        'bottle': 'plastic',
        'plastic bottle': 'plastic',
        'plastic bag': 'plastic',
        'container': 'plastic',
        'plastic container': 'plastic',
        
        # Metal items
        'metal': 'metal',
        'can': 'metal',
        'aluminum can': 'metal',
        'tin can': 'metal',
        'metal can': 'metal',
        'aluminum': 'metal',
        'steel': 'metal',
        
        # Glass (map to closest or separate)
        'glass': 'plastic',  # Map glass to plastic for now
        'glass bottle': 'plastic',
        
        # Other items
        'trash': 'plastic',  # Default to plastic
        'garbage': 'plastic',
        'waste': 'plastic'
    }
    
    # Find actual class directories in the dataset
    dataset_path = Path(dataset_path)
    class_mappings = {}
    
    # Look for common dataset structures
    for root_dir in dataset_path.iterdir():
        if root_dir.is_dir():
            # Check if this directory contains class subdirectories
            subdirs = [d for d in root_dir.iterdir() if d.is_dir()]
            
            if subdirs:
                print(f"\nFound class directory: {root_dir.name}")
                for subdir in subdirs:
                    class_name = subdir.name.lower()
                    
                    # Map to our waste categories
                    mapped_class = None
                    for trashnet_class, waste_class in trashnet_mappings.items():
                        if trashnet_class in class_name or class_name in trashnet_class:
                            mapped_class = waste_class
                            break
                    
                    if not mapped_class:
                        # Default mapping based on keywords
                        if any(keyword in class_name for keyword in ['paper', 'cardboard', 'book', 'magazine']):
                            mapped_class = 'paper'
                        elif any(keyword in class_name for keyword in ['plastic', 'bottle', 'container']):
                            mapped_class = 'plastic'
                        elif any(keyword in class_name for keyword in ['metal', 'can', 'aluminum', 'steel', 'tin']):
                            mapped_class = 'metal'
                        else:
                            mapped_class = 'plastic'  # Default
                    
                    class_mappings[str(subdir)] = mapped_class
                    img_count = len(list(subdir.iterdir()))
                    print(f"  {subdir.name} -> {mapped_class} ({img_count} images)")
    
    return class_mappings

def create_waste_dataset(dataset_path, class_mappings, output_dir="datasets/trashnet_waste"):
    """Create organized waste dataset from TrashNet"""
    print(f"\nCreating organized waste dataset at: {output_dir}")
    
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    
    # Create class directories
    waste_classes = ['metal', 'paper', 'plastic']
    for waste_class in waste_classes:
        (output_path / waste_class).mkdir(exist_ok=True)
    
    total_images = 0
    class_counts = {waste_class: 0 for waste_class in waste_classes}
    
    # Copy and organize images
    for source_dir, target_class in class_mappings.items():
        source_path = Path(source_dir)
        
        if source_path.exists() and source_path.is_dir():
            print(f"\nProcessing {source_path.name} -> {target_class}")
            
            # Get all image files
            image_files = []
            for ext in ['*.jpg', '*.jpeg', '*.png', '*.JPG', '*.JPEG', '*.PNG']:
                image_files.extend(source_path.glob(ext))
            
            print(f"  Found {len(image_files)} images")
            
            # Copy images to target directory
            for img_file in image_files:
                target_dir = output_path / target_class
                target_file = target_dir / f"{source_path.name}_{img_file.name}"
                
                try:
                    shutil.copy2(img_file, target_file)
                    total_images += 1
                    class_counts[target_class] += 1
                except Exception as e:
                    print(f"    Error copying {img_file.name}: {e}")
    
    print(f"\nDataset creation complete!")
    print(f"Total images: {total_images}")
    for waste_class, count in class_counts.items():
        print(f"  {waste_class}: {count} images")
    
    return total_images, class_counts

def split_trashnet_dataset(source_dir="datasets/trashnet_waste", output_dir="datasets/trashnet_split"):
    """Split TrashNet dataset into train/val/test"""
    print(f"\nSplitting TrashNet dataset...")
    
    source_path = Path(source_dir)
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    
    waste_classes = ['metal', 'paper', 'plastic']
    
    # Create split directories
    for split in ['train', 'val', 'test']:
        for waste_class in waste_classes:
            (output_path / split / waste_class).mkdir(parents=True, exist_ok=True)
    
    total_images = 0
    split_counts = {'train': 0, 'val': 0, 'test': 0}
    
    for waste_class in waste_classes:
        class_dir = source_path / waste_class
        if class_dir.exists():
            images = list(class_dir.glob("*.jpg")) + list(class_dir.glob("*.png"))
            random.shuffle(images)
            
            total = len(images)
            train_end = int(0.7 * total)
            val_end = train_end + int(0.15 * total)
            
            train_imgs = images[:train_end]
            val_imgs = images[train_end:val_end]
            test_imgs = images[val_end:]
            
            # Copy images
            for img in train_imgs:
                shutil.copy2(img, output_path / 'train' / waste_class / img.name)
                split_counts['train'] += 1
            
            for img in val_imgs:
                shutil.copy2(img, output_path / 'val' / waste_class / img.name)
                split_counts['val'] += 1
            
            for img in test_imgs:
                shutil.copy2(img, output_path / 'test' / waste_class / img.name)
                split_counts['test'] += 1
            
            print(f"  {waste_class}: {len(train_imgs)} train, {len(val_imgs)} val, {len(test_imgs)} test")
    
    total_split = sum(split_counts.values())
    print(f"\nSplit totals: {split_counts}")
    print(f"Total split images: {total_split}")
    
    return total_split

def create_trashnet_training_script():
    """Create enhanced training script for TrashNet dataset"""
    script_content = '''#!/usr/bin/env python3
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
    print("\\nStage 1: Training with frozen base model")
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
    print("\\nStage 2: Fine-tuning top layers")
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
    print("\\nFinal TrashNet Model Evaluation:")
    loss, accuracy = model.evaluate(test_gen, verbose=0)
    print(f"Test Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
    
    # Detailed metrics
    test_gen.reset()
    predictions = model.predict(test_gen, verbose=0)
    y_pred = np.argmax(predictions, axis=1)
    y_true = test_gen.classes
    
    print("\\nClassification Report:")
    print(classification_report(y_true, y_pred, target_names=list(test_gen.class_indices.keys())))
    
    # Save final model
    model.save('models/trashnet_enhanced_final.h5')
    print("\\nTrashNet enhanced model saved successfully!")

if __name__ == "__main__":
    main()
'''
    
    with open("train_trashnet_model.py", "w") as f:
        f.write(script_content)
    
    print("Created TrashNet training script: train_trashnet_model.py")

def main():
    print("TRASHNET DATASET INTEGRATION")
    print("="*50)
    
    # Step 1: Install kagglehub
    if not install_kagglehub():
        print("Cannot proceed without kagglehub")
        return
    
    # Step 2: Download TrashNet dataset
    dataset_path = download_trashnet_dataset()
    if not dataset_path:
        print("Failed to download TrashNet dataset")
        return
    
    # Step 3: Explore dataset structure
    dataset_info = explore_dataset_structure(dataset_path)
    
    # Step 4: Map classes to waste categories
    class_mappings = map_trashnet_to_waste_classes(dataset_info)
    
    if not class_mappings:
        print("No class mappings found - cannot proceed")
        return
    
    # Step 5: Create organized waste dataset
    total_images, class_counts = create_waste_dataset(dataset_info, class_mappings)
    
    # Step 6: Split dataset
    split_count = split_trashnet_dataset()
    
    # Step 7: Create training script
    create_trashnet_training_script()
    
    print(f"\n" + "="*50)
    print("TRASHNET INTEGRATION COMPLETE!")
    print("="*50)
    print(f"Dataset Statistics:")
    print(f"  Total images: {total_images}")
    print(f"  Split images: {split_count}")
    print(f"  Class distribution: {class_counts}")
    
    print(f"\nNext steps:")
    print(f"1. python train_trashnet_model.py")
    print(f"2. Evaluate model performance")
    print(f"3. Compare with previous results")

if __name__ == "__main__":
    main()
