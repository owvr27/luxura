import { logger } from '../utils/logger.js';
export class WasteClassificationService {
    static instance;
    static getInstance() {
        if (!WasteClassificationService.instance) {
            WasteClassificationService.instance = new WasteClassificationService();
        }
        return WasteClassificationService.instance;
    }
    async classifyWaste(description, imageUrl) {
        logger.info('Classifying waste item', { description, hasImage: !!imageUrl });
        // For now, use rule-based classification based on keywords
        // In production, this would integrate with the TensorFlow model
        const result = this.ruleBasedClassification(description.toLowerCase());
        logger.info('Waste classified successfully', {
            category: result.category,
            confidence: result.confidence,
            points: result.points
        });
        return result;
    }
    ruleBasedClassification(description) {
        const plasticKeywords = ['plastic', 'bottle', 'bag', 'container', 'polyethylene', 'pet', 'hdpe'];
        const paperKeywords = ['paper', 'cardboard', 'newspaper', 'magazine', 'book', 'envelope'];
        const metalKeywords = ['metal', 'aluminum', 'steel', 'can', 'tin', 'foil', 'iron'];
        const glassKeywords = ['glass', 'bottle', 'jar', 'window', 'mirror'];
        const organicKeywords = ['food', 'organic', 'biodegradable', 'compost', 'vegetable', 'fruit', 'waste'];
        const electronicKeywords = ['electronic', 'battery', 'phone', 'computer', 'cable', 'wire', 'device'];
        const hazardousKeywords = ['chemical', 'paint', 'oil', 'pesticide', 'medical', 'sharp', 'toxic'];
        if (this.containsKeywords(description, hazardousKeywords)) {
            return {
                category: 'hazardous',
                confidence: 0.9,
                recyclable: false,
                points: 0,
                co2Saved: 0,
                disposalInstructions: [
                    'Take to designated hazardous waste facility',
                    'Never dispose of in regular trash',
                    'Keep in original container if possible',
                    'Contact local environmental authorities for disposal guidelines'
                ],
                recyclingTips: [
                    'Consider alternatives to hazardous products',
                    'Buy only what you need to avoid disposal',
                    'Share unused products with others if safe'
                ]
            };
        }
        if (this.containsKeywords(description, electronicKeywords)) {
            return {
                category: 'electronic',
                confidence: 0.85,
                recyclable: true,
                points: 50,
                co2Saved: 2.5,
                disposalInstructions: [
                    'Take to e-waste recycling center',
                    'Remove personal data before recycling',
                    'Do not put in regular recycling bins',
                    'Check for local e-waste collection events'
                ],
                recyclingTips: [
                    'Repair electronics when possible instead of replacing',
                    'Donate working electronics to charities',
                    'Buy refurbished electronics when available'
                ]
            };
        }
        if (this.containsKeywords(description, organicKeywords)) {
            return {
                category: 'organic',
                confidence: 0.9,
                recyclable: true,
                points: 10,
                co2Saved: 0.5,
                disposalInstructions: [
                    'Compost at home if possible',
                    'Use municipal organic waste collection',
                    'Keep separate from other waste types',
                    'Avoid plastic bags for organic waste'
                ],
                recyclingTips: [
                    'Start a home composting system',
                    'Reduce food waste by planning meals',
                    'Use food scraps for gardening or plant fertilizer'
                ]
            };
        }
        if (this.containsKeywords(description, glassKeywords)) {
            return {
                category: 'glass',
                confidence: 0.95,
                recyclable: true,
                points: 15,
                co2Saved: 1.2,
                disposalInstructions: [
                    'Rinse containers before recycling',
                    'Remove lids and caps (check local rules)',
                    'Sort by color if required locally',
                    'Never break glass - recycle whole'
                ],
                recyclingTips: [
                    'Reuse glass jars for storage',
                    'Choose products in glass over plastic when possible',
                    'Support businesses that use glass packaging'
                ]
            };
        }
        if (this.containsKeywords(description, metalKeywords)) {
            return {
                category: 'metal',
                confidence: 0.9,
                recyclable: true,
                points: 25,
                co2Saved: 2.0,
                disposalInstructions: [
                    'Clean and dry metal items',
                    'Flatten cans to save space',
                    'Check if scrap metal collection available',
                    'Remove non-metal parts when possible'
                ],
                recyclingTips: [
                    'Metal can be recycled infinitely without quality loss',
                    'Aluminum recycling saves 95% of energy needed for new production',
                    'Sell scrap metal to recycling centers for extra income'
                ]
            };
        }
        if (this.containsKeywords(description, paperKeywords)) {
            return {
                category: 'paper',
                confidence: 0.85,
                recyclable: true,
                points: 8,
                co2Saved: 0.8,
                disposalInstructions: [
                    'Keep paper dry and clean',
                    'Remove plastic windows from envelopes',
                    'Flatten cardboard boxes',
                    'Staples and small paper clips are usually acceptable'
                ],
                recyclingTips: [
                    'Print double-sided to reduce paper usage',
                    'Use digital alternatives when possible',
                    'Reuse paper for scratch notes before recycling'
                ]
            };
        }
        if (this.containsKeywords(description, plasticKeywords)) {
            return {
                category: 'plastic',
                confidence: 0.8,
                recyclable: true,
                points: 12,
                co2Saved: 1.5,
                disposalInstructions: [
                    'Check recycling number on plastic items',
                    'Rinse containers and remove caps',
                    'Flatten bottles to save space',
                    'Check local recycling guidelines for plastic types'
                ],
                recyclingTips: [
                    'Reduce single-use plastic consumption',
                    'Choose reusable alternatives',
                    'Support businesses with sustainable packaging'
                ]
            };
        }
        // Default classification
        return {
            category: 'plastic',
            confidence: 0.5,
            recyclable: true,
            points: 5,
            co2Saved: 0.5,
            disposalInstructions: [
                'Check with local recycling facility',
                'Clean the item before disposal',
                'Separate from other waste types'
            ],
            recyclingTips: [
                'When in doubt, check recycling guidelines',
                'Consider reducing consumption of similar items'
            ]
        };
    }
    containsKeywords(text, keywords) {
        return keywords.some(keyword => text.includes(keyword));
    }
    async getEnvironmentalImpact(userId) {
        // Mock implementation - would integrate with database
        return {
            totalCO2Saved: 45.2,
            totalPoints: 1250,
            recyclingStreak: 15,
            rank: 'Eco Warrior',
            nextMilestone: {
                name: 'Green Champion',
                pointsNeeded: 250,
                reward: 'Premium Partner Discount'
            }
        };
    }
    async getRecyclingRecommendations(userId) {
        return [
            {
                category: 'Plastic Reduction',
                recommendation: 'Switch to reusable water bottles and shopping bags',
                impact: 'Save up to 156 plastic bottles per year',
                difficulty: 'Easy'
            },
            {
                category: 'Paper Conservation',
                recommendation: 'Go paperless for bills and statements',
                impact: 'Save 24 trees worth of paper annually',
                difficulty: 'Easy'
            },
            {
                category: 'Composting',
                recommendation: 'Start composting food scraps at home',
                impact: 'Reduce household waste by 30%',
                difficulty: 'Medium'
            },
            {
                category: 'E-waste Management',
                recommendation: 'Properly recycle old electronics',
                impact: 'Prevent toxic materials from entering landfills',
                difficulty: 'Medium'
            }
        ];
    }
}
