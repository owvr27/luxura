import { logger } from '../utils/logger.js';
import prisma from '../prisma.js';
export class GamificationService {
    static instance;
    static getInstance() {
        if (!GamificationService.instance) {
            GamificationService.instance = new GamificationService();
        }
        return GamificationService.instance;
    }
    achievements = [
        {
            id: 'first_recycle',
            name: 'First Step',
            description: 'Complete your first recycling activity',
            icon: '🌱',
            points: 10,
            category: 'milestone',
            requirement: { type: 'items_recycled', value: 1 },
            reward: { type: 'title', value: 'Eco Beginner' }
        },
        {
            id: 'recycling_starter',
            name: 'Recycling Starter',
            description: 'Recycle 10 items',
            icon: '♻️',
            points: 50,
            category: 'recycling',
            requirement: { type: 'items_recycled', value: 10 },
            reward: { type: 'badge', value: 'Bronze Recycler' }
        },
        {
            id: 'week_streak',
            name: 'Week Warrior',
            description: 'Maintain a 7-day recycling streak',
            icon: '🔥',
            points: 100,
            category: 'streak',
            requirement: { type: 'recycling_streak', value: 7 },
            reward: { type: 'points', value: 50 }
        },
        {
            id: 'month_streak',
            name: 'Monthly Champion',
            description: 'Maintain a 30-day recycling streak',
            icon: '🏆',
            points: 500,
            category: 'streak',
            requirement: { type: 'recycling_streak', value: 30 },
            reward: { type: 'title', value: 'Streak Master' }
        },
        {
            id: 'century_club',
            name: 'Century Club',
            description: 'Recycle 100 items',
            icon: '💯',
            points: 200,
            category: 'milestone',
            requirement: { type: 'items_recycled', value: 100 },
            reward: { type: 'badge', value: 'Century Recycler' }
        },
        {
            id: 'points_master',
            name: 'Points Master',
            description: 'Earn 1000 points',
            icon: '⭐',
            points: 100,
            category: 'milestone',
            requirement: { type: 'total_points', value: 1000 },
            reward: { type: 'title', value: 'Points Master' }
        },
        {
            id: 'bin_explorer',
            name: 'Bin Explorer',
            description: 'Use 5 different recycling bins',
            icon: '🗺️',
            points: 75,
            category: 'social',
            requirement: { type: 'bins_used', value: 5 },
            reward: { type: 'badge', value: 'Explorer' }
        },
        {
            id: 'eco_warrior',
            name: 'Eco Warrior',
            description: 'Save 50kg of CO2 through recycling',
            icon: '🌍',
            points: 300,
            category: 'milestone',
            requirement: { type: 'total_points', value: 2500 }, // Approximate CO2 saved
            reward: { type: 'title', value: 'Eco Warrior' }
        }
    ];
    async getUserProgress(userId) {
        try {
            // Get user's total points and stats
            const transactions = await prisma.pointsTransaction.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' }
            });
            const totalPoints = transactions.reduce((sum, tx) => sum + tx.points, 0);
            const level = this.calculateLevel(totalPoints);
            const nextLevelPoints = this.getNextLevelPoints(totalPoints);
            const progressToNextLevel = nextLevelPoints ? (totalPoints / nextLevelPoints) * 100 : 100;
            // Calculate recycling streak (simplified - would need date tracking in production)
            const recyclingStreak = await this.calculateRecyclingStreak(userId);
            // Get total items recycled
            const totalRecycled = await prisma.operation.count({
                where: { redeemedByUserId: userId }
            });
            // Calculate CO2 saved (approximate: 1.5kg CO2 per recycling activity)
            const co2Saved = totalRecycled * 1.5;
            // Get unlocked achievements
            const unlockedAchievements = await this.getUnlockedAchievements(userId);
            // Get user rank
            const rank = await this.getUserRank(userId);
            return {
                userId,
                totalPoints,
                level,
                progressToNextLevel,
                nextLevelPoints,
                recyclingStreak,
                totalRecycled,
                co2Saved,
                achievementsUnlocked: unlockedAchievements,
                rank
            };
        }
        catch (error) {
            logger.error('Error getting user progress', { error, userId });
            throw error;
        }
    }
    async getLeaderboard(limit = 10, offset = 0) {
        try {
            // Get all users with their points
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    operations: {
                        select: { id: true }
                    },
                    transactions: {
                        select: { points: true }
                    }
                }
            });
            // Calculate leaderboard data
            const leaderboard = users.map(user => {
                const totalPoints = user.transactions.reduce((sum, tx) => sum + tx.points, 0);
                const totalRecycled = user.operations.length;
                const co2Saved = totalRecycled * 1.5;
                const level = this.calculateLevel(totalPoints);
                const achievements = this.achievements.filter(a => this.checkAchievementUnlocked(a, totalPoints, totalRecycled, 0)).length;
                return {
                    userId: user.id,
                    name: user.name,
                    email: user.email,
                    totalPoints,
                    rank: 0, // Will be set after sorting
                    level,
                    achievements,
                    recyclingStreak: 0, // Would need date tracking
                    co2Saved
                };
            });
            // Sort by points and assign ranks
            leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);
            leaderboard.forEach((entry, index) => {
                entry.rank = index + 1;
            });
            return leaderboard.slice(offset, offset + limit);
        }
        catch (error) {
            logger.error('Error getting leaderboard', { error });
            throw error;
        }
    }
    async checkAndUnlockAchievements(userId) {
        try {
            const progress = await this.getUserProgress(userId);
            const newlyUnlocked = [];
            for (const achievement of this.achievements) {
                if (progress.achievementsUnlocked.includes(achievement.id)) {
                    continue; // Already unlocked
                }
                if (this.checkAchievementUnlocked(achievement, progress.totalPoints, progress.totalRecycled, progress.recyclingStreak)) {
                    // Unlock achievement
                    await this.unlockAchievement(userId, achievement.id);
                    newlyUnlocked.push(achievement);
                    // Award achievement points
                    await this.awardPoints(userId, achievement.points, `Achievement: ${achievement.name}`);
                }
            }
            return newlyUnlocked;
        }
        catch (error) {
            logger.error('Error checking achievements', { error, userId });
            throw error;
        }
    }
    checkAchievementUnlocked(achievement, totalPoints, totalRecycled, recyclingStreak) {
        switch (achievement.requirement.type) {
            case 'total_points':
                return totalPoints >= achievement.requirement.value;
            case 'recycling_streak':
                return recyclingStreak >= achievement.requirement.value;
            case 'items_recycled':
                return totalRecycled >= achievement.requirement.value;
            case 'bins_used':
                // Would need to track unique bins used
                return false; // Simplified for now
            default:
                return false;
        }
    }
    async unlockAchievement(userId, achievementId) {
        // In a real implementation, this would store unlocked achievements in the database
        logger.info('Achievement unlocked', { userId, achievementId });
    }
    async getUnlockedAchievements(userId) {
        // In a real implementation, this would fetch from database
        // For now, return empty array
        return [];
    }
    async calculateRecyclingStreak(userId) {
        // Simplified implementation - would need date tracking
        const operations = await prisma.operation.findMany({
            where: { redeemedByUserId: userId },
            orderBy: { timestamp: 'desc' },
            take: 30
        });
        // Basic streak calculation (would be more sophisticated in production)
        return operations.length > 0 ? Math.min(operations.length, 30) : 0;
    }
    async getUserRank(userId) {
        const leaderboard = await this.getLeaderboard(1000); // Get more entries for accurate ranking
        const userEntry = leaderboard.find(entry => entry.userId === userId);
        return userEntry ? userEntry.rank : 0;
    }
    calculateLevel(points) {
        if (points < 100)
            return 'Eco Beginner';
        if (points < 500)
            return 'Green Enthusiast';
        if (points < 1000)
            return 'Recycling Pro';
        if (points < 2500)
            return 'Eco Warrior';
        if (points < 5000)
            return 'Sustainability Master';
        if (points < 10000)
            return 'Environmental Champion';
        return 'Green Legend';
    }
    getNextLevelPoints(currentPoints) {
        if (currentPoints < 100)
            return 100;
        if (currentPoints < 500)
            return 500;
        if (currentPoints < 1000)
            return 1000;
        if (currentPoints < 2500)
            return 2500;
        if (currentPoints < 5000)
            return 5000;
        if (currentPoints < 10000)
            return 10000;
        return 0; // Max level
    }
    async awardPoints(userId, points, reason) {
        await prisma.pointsTransaction.create({
            data: {
                userId,
                points,
                type: 'achievement',
                operationId: 'achievement-' + Date.now(), // Generate a dummy operationId for achievements
            }
        });
    }
    getAchievementsList() {
        return this.achievements;
    }
}
