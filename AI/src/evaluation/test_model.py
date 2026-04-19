#!/usr/bin/env python3
"""
Enhanced Model Testing and Accuracy Report Generator
"""

import os
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score, roc_curve
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
from tabulate import tabulate

class EnhancedModelTester:
    def __init__(self):
        self.model = None
        self.class_names = ['metal', 'paper', 'plastic']
        self.results = {}
        
    def load_models(self):
        """Load both original and enhanced models for comparison"""
        models = {}
        
        # Load original model
        try:
            models['original'] = load_model('models/best_model.h5')
            print("Original model loaded successfully")
        except:
            print("Original model not found at models/best_model.h5")
        
        # Load enhanced model
        try:
            models['enhanced'] = load_model('models/final_enhanced_model.h5')
            print("Enhanced model loaded successfully")
        except:
            print("Enhanced model not found at models/fest_enhanced_model.h5")
            try:
                models['enhanced'] = load_model('models/enhanced_model_stage1.h5')
                print("Stage 1 enhanced model loaded")
            except:
                print("No enhanced model found")
        
        return models
    
    def prepare_test_data(self):
        """Prepare test data generator"""
        test_datagen = ImageDataGenerator(rescale=1./255)
        
        try:
            test_gen = test_datagen.flow_from_directory(
                'datasets/split/dataset_split/test',
                target_size=(224,224),
                batch_size=32,
                class_mode='categorical',
                shuffle=False
            )
            return test_gen
        except Exception as e:
            print(f"Error loading test data: {e}")
            return None
    
    def evaluate_model(self, model, test_gen, model_name):
        """Comprehensive model evaluation"""
        print(f"\n{'='*50}")
        print(f"Evaluating {model_name} Model")
        print(f"{'='*50}")
        
        # Basic evaluation
        loss, accuracy = model.evaluate(test_gen, verbose=0)
        print(f"Test Loss: {loss:.4f}")
        print(f"Test Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
        
        # Get predictions
        test_gen.reset()
        predictions = model.predict(test_gen, verbose=0)
        y_pred = np.argmax(predictions, axis=1)
        y_true = test_gen.classes
        y_pred_proba = predictions
        
        # Classification report
        print("\nClassification Report:")
        report = classification_report(y_true, y_pred, 
                                    target_names=self.class_names,
                                    digits=4, output_dict=True)
        print(classification_report(y_true, y_pred, 
                                  target_names=self.class_names,
                                  digits=4))
        
        # Confusion matrix
        cm = confusion_matrix(y_true, y_pred)
        print("\nConfusion Matrix:")
        print(cm)
        
        # Per-class metrics
        per_class_metrics = {}
        for i, class_name in enumerate(self.class_names):
            class_mask = (y_true == i)
            if np.sum(class_mask) > 0:
                class_acc = np.sum(y_pred[class_mask] == i) / np.sum(class_mask)
                precision = report[class_name]['precision']
                recall = report[class_name]['recall']
                f1 = report[class_name]['f1-score']
                
                per_class_metrics[class_name] = {
                    'accuracy': class_acc,
                    'precision': precision,
                    'recall': recall,
                    'f1_score': f1
                }
        
        # Calculate ROC AUC for each class (one-vs-rest)
        roc_auc_scores = {}
        for i, class_name in enumerate(self.class_names):
            y_true_binary = (y_true == i).astype(int)
            y_score = y_pred_proba[:, i]
            if len(np.unique(y_true_binary)) > 1:  # Only if both classes present
                roc_auc = roc_auc_score(y_true_binary, y_score)
                roc_auc_scores[class_name] = roc_auc
        
        # Confidence analysis
        max_confidences = np.max(y_pred_proba, axis=1)
        avg_confidence = np.mean(max_confidences)
        confidence_std = np.std(max_confidences)
        
        results = {
            'model_name': model_name,
            'overall_accuracy': accuracy,
            'loss': loss,
            'per_class_metrics': per_class_metrics,
            'confusion_matrix': cm,
            'roc_auc_scores': roc_auc_scores,
            'avg_confidence': avg_confidence,
            'confidence_std': confidence_std,
            'predictions': y_pred,
            'true_labels': y_true,
            'prediction_probabilities': y_pred_proba
        }
        
        return results
    
    def compare_models(self, original_results, enhanced_results):
        """Compare original vs enhanced model"""
        print(f"\n{'='*60}")
        print("MODEL COMPARISON")
        print(f"{'='*60}")
        
        # Overall accuracy comparison
        orig_acc = original_results['overall_accuracy']
        enh_acc = enhanced_results['overall_accuracy']
        improvement = (enh_acc - orig_acc) * 100
        
        print(f"Overall Accuracy:")
        print(f"  Original: {orig_acc:.4f} ({orig_acc*100:.2f}%)")
        print(f"  Enhanced: {enh_acc:.4f} ({enh_acc*100:.2f}%)")
        print(f"  Improvement: +{improvement:.2f}%")
        
        # Per-class comparison
        print(f"\nPer-Class Accuracy Comparison:")
        comparison_data = []
        for class_name in self.class_names:
            orig_acc_class = original_results['per_class_metrics'][class_name]['accuracy']
            enh_acc_class = enhanced_results['per_class_metrics'][class_name]['accuracy']
            class_improvement = (enh_acc_class - orig_acc_class) * 100
            
            comparison_data.append([
                class_name,
                f"{orig_acc_class:.4f} ({orig_acc_class*100:.2f}%)",
                f"{enh_acc_class:.4f} ({enh_acc_class*100:.2f}%)",
                f"+{class_improvement:.2f}%"
            ])
        
        print(tabulate(comparison_data, 
                      headers=['Class', 'Original', 'Enhanced', 'Improvement'],
                      tablefmt='grid'))
        
        # Confidence comparison
        print(f"\nConfidence Analysis:")
        print(f"  Original - Avg: {original_results['avg_confidence']:.4f}, "
              f"Std: {original_results['confidence_std']:.4f}")
        print(f"  Enhanced - Avg: {enhanced_results['avg_confidence']:.4f}, "
              f"Std: {enhanced_results['confidence_std']:.4f}")
        
        return improvement
    
    def generate_visualizations(self, results, output_dir='model_evaluation'):
        """Generate evaluation visualizations"""
        os.makedirs(output_dir, exist_ok=True)
        
        # Confusion Matrix Heatmap
        plt.figure(figsize=(8, 6))
        cm = results['confusion_matrix']
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                   xticklabels=self.class_names, yticklabels=self.class_names)
        plt.title(f'Confusion Matrix - {results["model_name"]} Model')
        plt.ylabel('True Label')
        plt.xlabel('Predicted Label')
        plt.tight_layout()
        plt.savefig(f'{output_dir}/confusion_matrix_{results["model_name"]}.png', dpi=150)
        plt.close()
        
        # Per-class metrics bar chart
        plt.figure(figsize=(10, 6))
        metrics = ['accuracy', 'precision', 'recall', 'f1_score']
        x = np.arange(len(self.class_names))
        width = 0.2
        
        for i, metric in enumerate(metrics):
            values = [results['per_class_metrics'][cls][metric] for cls in self.class_names]
            plt.bar(x + i*width, values, width, label=metric.capitalize())
        
        plt.xlabel('Classes')
        plt.ylabel('Score')
        plt.title(f'Per-Class Metrics - {results["model_name"]} Model')
        plt.xticks(x + width*1.5, self.class_names)
        plt.legend()
        plt.ylim(0, 1)
        plt.tight_layout()
        plt.savefig(f'{output_dir}/per_class_metrics_{results["model_name"]}.png', dpi=150)
        plt.close()
        
        # Confidence distribution
        plt.figure(figsize=(8, 5))
        max_confs = np.max(results['prediction_probabilities'], axis=1)
        plt.hist(max_confs, bins=20, alpha=0.7, edgecolor='black')
        plt.xlabel('Prediction Confidence')
        plt.ylabel('Frequency')
        plt.title(f'Confidence Distribution - {results["model_name"]} Model')
        plt.axvline(np.mean(max_confs), color='red', linestyle='--', 
                   label=f'Mean: {np.mean(max_confs):.3f}')
        plt.legend()
        plt.tight_layout()
        plt.savefig(f'{output_dir}/confidence_distribution_{results["model_name"]}.png', dpi=150)
        plt.close()
    
    def generate_report(self, original_results=None, enhanced_results=None):
        """Generate comprehensive evaluation report"""
        print(f"\n{'='*60}")
        print("GENERATING COMPREHENSIVE REPORT")
        print(f"{'='*60}")
        
        report_lines = []
        report_lines.append("WASTE CLASSIFICATION MODEL EVALUATION REPORT")
        report_lines.append("="*60)
        report_lines.append("")
        
        if enhanced_results:
            report_lines.append("ENHANCED MODEL RESULTS:")
            report_lines.append("-"*30)
            report_lines.append(f"Overall Accuracy: {enhanced_results['overall_accuracy']:.4f} ({enhanced_results['overall_accuracy']*100:.2f}%)")
            report_lines.append(f"Loss: {enhanced_results['loss']:.4f}")
            report_lines.append(f"Average Confidence: {enhanced_results['avg_confidence']:.4f}")
            report_lines.append("")
            
            report_lines.append("Per-Class Performance:")
            for class_name, metrics in enhanced_results['per_class_metrics'].items():
                report_lines.append(f"  {class_name}:")
                report_lines.append(f"    Accuracy: {metrics['accuracy']:.4f} ({metrics['accuracy']*100:.2f}%)")
                report_lines.append(f"    Precision: {metrics['precision']:.4f}")
                report_lines.append(f"    Recall: {metrics['recall']:.4f}")
                report_lines.append(f"    F1-Score: {metrics['f1_score']:.4f}")
            report_lines.append("")
        
        if original_results and enhanced_results:
            improvement = (enhanced_results['overall_accuracy'] - original_results['overall_accuracy']) * 100
            report_lines.append("IMPROVEMENT ANALYSIS:")
            report_lines.append("-"*20)
            report_lines.append(f"Accuracy Improvement: +{improvement:.2f}%")
            report_lines.append(f"Original Accuracy: {original_results['overall_accuracy']*100:.2f}%")
            report_lines.append(f"Enhanced Accuracy: {enhanced_results['overall_accuracy']*100:.2f}%")
            report_lines.append("")
            
            report_lines.append("Per-Class Improvements:")
            for class_name in self.class_names:
                orig_acc = original_results['per_class_metrics'][class_name]['accuracy']
                enh_acc = enhanced_results['per_class_metrics'][class_name]['accuracy']
                class_improvement = (enh_acc - orig_acc) * 100
                report_lines.append(f"  {class_name}: +{class_improvement:.2f}%")
        
        # Save report
        report_text = '\n'.join(report_lines)
        with open('model_evaluation_report.txt', 'w') as f:
            f.write(report_text)
        
        print("Report saved to 'model_evaluation_report.txt'")
        print(report_text)
        
        return report_text

def main():
    tester = EnhancedModelTester()
    
    print("Enhanced Model Testing and Evaluation")
    print("="*50)
    
    # Load models
    models = tester.load_models()
    
    if not models:
        print("No models found for evaluation!")
        return
    
    # Prepare test data
    test_gen = tester.prepare_test_data()
    if test_gen is None:
        print("Cannot proceed without test data!")
        return
    
    original_results = None
    enhanced_results = None
    
    # Evaluate models
    if 'original' in models:
        original_results = tester.evaluate_model(models['original'], test_gen, 'Original')
        tester.generate_visualizations(original_results)
    
    if 'enhanced' in models:
        enhanced_results = tester.evaluate_model(models['enhanced'], test_gen, 'Enhanced')
        tester.generate_visualizations(enhanced_results)
    
    # Compare models if both available
    if original_results and enhanced_results:
        improvement = tester.compare_models(original_results, enhanced_results)
    
    # Generate final report
    tester.generate_report(original_results, enhanced_results)
    
    print(f"\n{'='*50}")
    print("EVALUATION COMPLETE!")
    print(f"{'='*50}")
    print("Files generated:")
    print("- model_evaluation_report.txt")
    print("- model_evaluation/ (visualizations)")

if __name__ == "__main__":
    main()
