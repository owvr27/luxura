# 1️ Import libraries
import os
import numpy as np
from tensorflow.keras.preprocessing.image import ImageDataGenerator, load_img, img_to_array

# 2️ Setup classes and folders
classes = ['metal', 'paper', 'plastic']
class_names = ['metal', 'paper', 'plastic']

original_folder = 'datasets/original/waste_dataset'          # Original images folder
augmented_folder = 'datasets/augmented/waste_dataset_augmented'  # Folder to save new augmented images

# Create folder for each class if it doesn't exist
for cls in classes:
    path = os.path.join(augmented_folder, cls)
    if not os.path.exists(path):
        os.makedirs(path)

# 3️ Setup Data Augmentation
datagen = ImageDataGenerator(
    rotation_range=20,          # Image rotation
    width_shift_range=0.1,      # Horizontal shift
    height_shift_range=0.1,     # Vertical shift
    zoom_range=0.1,             # Zoom in/out
    horizontal_flip=True,       # Horizontal flip
    brightness_range=[0.8,1.2]  # Brightness adjustment
)

# 4️ Generate new images for each image in each class
for cls in classes:
    class_folder = os.path.join(original_folder, cls)
    save_path = os.path.join(augmented_folder, cls)
    
    for img_file in os.listdir(class_folder):
        img_path = os.path.join(class_folder, img_file)
        img = load_img(img_path)               # Load image
        x = img_to_array(img)                  # Convert image to array
        x = np.expand_dims(x, axis=0)          # Add batch dimension

        i = 0
        for batch in datagen.flow(
            x, batch_size=1, save_to_dir=save_path,
            save_prefix=cls, save_format='jpg'
        ):
            i += 1
            if i > 20:  # Generate 20 new copies for each image
                break

print(" Data Augmentation complete! New images saved in 'waste_dataset_augmented'")