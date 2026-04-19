import os
import shutil
import random

# Define source and destination directories
source = 'datasets/merged/dataset_final'
destination = 'datasets/split/dataset_split'

# Define waste classes
classes = ['paper', 'plastic', 'metal']

# Create subfolders for train, validation, and test sets
for split in ['train', 'val', 'test']:
    for cls in classes:
        os.makedirs(os.path.join(destination, split, cls), exist_ok=True)

# Split images into train/val/test sets
for cls in classes:
    class_folder = os.path.join(source, cls)
    images = os.listdir(class_folder)
    random.shuffle(images)

    total = len(images)
    train_end = int(0.7 * total)  # 70% for training
    val_end = train_end + int(0.15 * total)  # 15% for validation

    # Split images into three sets
    train_imgs = images[:train_end]
    val_imgs = images[train_end:val_end]
    test_imgs = images[val_end:]  # 15% for testing

    # Copy images to train folder
    for img in train_imgs:
        shutil.copy(os.path.join(class_folder, img),
                    os.path.join(destination, 'train', cls, img))

    # Copy images to validation folder
    for img in val_imgs:
        shutil.copy(os.path.join(class_folder, img),
                    os.path.join(destination, 'val', cls, img))

    # Copy images to test folder
    for img in test_imgs:
        shutil.copy(os.path.join(class_folder, img),
                    os.path.join(destination, 'test', cls, img))

print(" Data splitting completed successfully!")