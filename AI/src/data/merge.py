import os
import shutil

# Data directories
original_folder = 'datasets/original/waste_dataset'
augmented_folder = 'datasets/augmented/waste_dataset_augmented'
final_folder = 'datasets/merged/dataset_final'

# Waste classes
classes = ['paper', 'plastic', 'metal']

# Create final folder structure
for cls in classes:
    os.makedirs(os.path.join(final_folder, cls), exist_ok=True)

# Function to copy images from source to destination
def copy_images(src_folder, dest_folder):
    for cls in classes:
        src_path = os.path.join(src_folder, cls)
        dest_path = os.path.join(dest_folder, cls)

        for img_file in os.listdir(src_path):
            shutil.copy(os.path.join(src_path, img_file),
                        os.path.join(dest_path, img_file))

# Copy original images
copy_images(original_folder, final_folder)

# Copy augmented images
copy_images(augmented_folder, final_folder)

print(" All images merged successfully into 'dataset_final'!")