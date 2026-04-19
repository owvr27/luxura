import os
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import matplotlib.pyplot as plt
import pandas as pd
from tabulate import tabulate

# 1. Load the trained model
model = load_model('best_model.h5')
class_names = ['metal', 'paper', 'plastic']

# 2. Folder containing test images
test_folder = 'test_images'

# 3. Folders to save results
output_folder = 'predicted_images'
results_folder = 'test_results'
os.makedirs(output_folder, exist_ok=True)
os.makedirs(results_folder, exist_ok=True)

# Lists to store results for summary
all_results = []
confidences = []

print("Starting prediction on test images...")
print("=" * 50)

# 4. Loop through all images
for idx, img_name in enumerate(os.listdir(test_folder), 1):
    img_path = os.path.join(test_folder, img_name)
    
    # Load and preprocess image
    img = load_img(img_path, target_size=(224, 224))
    img_array = img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    
    # Predict class
    pred = model.predict(img_array, verbose=0)
    predicted_idx = np.argmax(pred)
    predicted_class = class_names[predicted_idx]
    confidence = pred[0][predicted_idx] * 100  # Convert to percentage
    
    # Store results
    all_results.append({
        'image': img_name,
        'predicted_class': predicted_class,
        'confidence': f"{confidence:.2f}%",
        'metal_prob': f"{pred[0][0]*100:.2f}%",
        'paper_prob': f"{pred[0][1]*100:.2f}%",
        'plastic_prob': f"{pred[0][2]*100:.2f}%"
    })
    confidences.append(confidence)
    
    # Display progress
    print(f"Image {idx}: {img_name}")
    print(f"   Predicted: {predicted_class}")
    print(f"   Confidence: {confidence:.2f}%")
    print(f"   Probabilities: Metal={pred[0][0]*100:.1f}%, "
          f"Paper={pred[0][1]*100:.1f}%, "
          f"Plastic={pred[0][2]*100:.1f}%")
    print("-" * 40)
    
    # Create visualization with more info
    fig, axes = plt.subplots(1, 2, figsize=(12, 5))
    
    # Left: Image with prediction
    axes[0].imshow(img)
    axes[0].set_title(f"Image: {img_name}", fontsize=14, fontweight='bold')
    axes[0].axis('off')
    
    # Right: Confidence bars
    colors = ['#FF6B6B', '#4ECDC4', '#45B7D1']
    y_pos = np.arange(len(class_names))
    axes[1].barh(y_pos, pred[0] * 100, color=colors)
    axes[1].set_yticks(y_pos)
    axes[1].set_yticklabels(class_names, fontsize=12)
    axes[1].set_xlabel('Probability (%)', fontsize=12)
    axes[1].set_title(f'Prediction Confidence: {confidence:.1f}%', 
                     fontsize=14, fontweight='bold')
    axes[1].invert_yaxis()
    
    # Add value labels on bars
    for i, v in enumerate(pred[0] * 100):
        axes[1].text(v + 1, i, f"{v:.1f}%", va='center', fontweight='bold')
    
    plt.suptitle(f'Predicted: {predicted_class}', fontsize=16, fontweight='bold', y=1.02)
    plt.tight_layout()
    
    # Save the figure
    save_path = os.path.join(output_folder, f"pred_{img_name}")
    plt.savefig(save_path, bbox_inches='tight', dpi=150)
    plt.close()

# 5. Generate Summary Report
print("\n" + "=" * 50)
print("PREDICTION SUMMARY")
print("=" * 50)

# Convert results to DataFrame
df = pd.DataFrame(all_results)

# Save detailed results to CSV
csv_path = os.path.join(results_folder, 'predictions_details.csv')
df.to_csv(csv_path, index=False)
print(f"Detailed results saved to: {csv_path}")

# Calculate statistics
avg_confidence = np.mean(confidences)
std_confidence = np.std(confidences)
class_distribution = df['predicted_class'].value_counts()

# Create summary table
summary_data = []
for cls in class_names:
    count = class_distribution.get(cls, 0)
    percentage = (count / len(all_results)) * 100
    summary_data.append([cls, count, f"{percentage:.1f}%"])

print("\nClass Distribution:")
print(tabulate(summary_data, 
               headers=['Class', 'Count', 'Percentage'], 
               tablefmt='grid'))

print(f"\nOverall Statistics:")
print(f"   Total images tested: {len(all_results)}")
print(f"   Average confidence: {avg_confidence:.2f}%")
print(f"   Confidence std dev: {std_confidence:.2f}%")
print(f"   Highest confidence: {max(confidences):.2f}%")
print(f"   Lowest confidence: {min(confidences):.2f}%")

# Save summary report
summary_path = os.path.join(results_folder, 'summary_report.txt')
with open(summary_path, 'w') as f:
    f.write("=" * 50 + "\n")
    f.write("PREDICTION SUMMARY REPORT\n")
    f.write("=" * 50 + "\n\n")
    f.write(f"Total images tested: {len(all_results)}\n")
    f.write(f"Average confidence: {avg_confidence:.2f}%\n")
    f.write(f"Confidence std dev: {std_confidence:.2f}%\n\n")
    
    f.write("Class Distribution:\n")
    f.write("-" * 30 + "\n")
    for row in summary_data:
        f.write(f"{row[0]}: {row[1]} images ({row[2]})\n")
    
    f.write("\nDetailed Predictions:\n")
    f.write("-" * 50 + "\n")
    for result in all_results:
        f.write(f"{result['image']}: {result['predicted_class']} "
                f"(Confidence: {result['confidence']})\n")

print(f"\nSummary report saved to: {summary_path}")
print(f"All visualized images saved in '{output_folder}'")
print(f"All results saved in '{results_folder}'")
print("\nPrediction completed successfully!")