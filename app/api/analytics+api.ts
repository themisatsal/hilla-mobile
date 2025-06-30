// Analytics API endpoint
import { 
  dailyLogDb, 
  userDb, 
  getDailyTargets,
  ensureInitialized 
} from '@/lib/database';
import { ApiResponse, AnalyticsData } from '@/types/api';

// Ensure sample data is initialized
ensureInitialized();

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const period = url.searchParams.get('period') as '7d' | '30d' | '3m' || '30d';
    const nutrient = url.searchParams.get('nutrient') || 'iron';

    if (!userId) {
      const response: ApiResponse = {
        success: false,
        error: 'User ID is required',
      };
      return Response.json(response, { status: 400 });
    }

    // Verify user exists
    const user = userDb.findById(userId);
    if (!user) {
      const response: ApiResponse = {
        success: false,
        error: 'User not found',
      };
      return Response.json(response, { status: 404 });
    }

    // Get period in days
    const periodDays = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    
    // Get daily logs for the period
    const allLogs = dailyLogDb.findByUserId(userId);
    const periodLogs = allLogs.slice(0, periodDays);
    
    // Get targets for user's stage
    const targets = getDailyTargets(user.selectedStage);
    const target = targets[nutrient as keyof typeof targets] || 1;

    // Calculate analytics
    const data = periodLogs.map(log => ({
      date: log.date,
      value: log.totalNutrients[nutrient as keyof typeof log.totalNutrients] || 0,
    })).reverse(); // Reverse to get chronological order

    // Calculate average for recent period vs previous period
    const recentData = data.slice(-7); // Last 7 days
    const previousData = data.slice(-14, -7); // Previous 7 days
    
    const currentAvg = recentData.length > 0 
      ? recentData.reduce((sum, day) => sum + day.value, 0) / recentData.length 
      : 0;
    
    const previousAvg = previousData.length > 0 
      ? previousData.reduce((sum, day) => sum + day.value, 0) / previousData.length 
      : currentAvg;
    
    const change = previousAvg > 0 ? ((currentAvg - previousAvg) / previousAvg) * 100 : 0;
    const targetPercentage = (currentAvg / target) * 100;
    
    // Calculate streak
    let streak = 0;
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].value >= target) {
        streak++;
      } else {
        break;
      }
    }

    // Generate insights
    const insights = [];
    
    if (streak >= 3) {
      insights.push({
        type: 'success' as const,
        title: `${streak}-day streak!`,
        description: `You've met your ${nutrient} target for ${streak} consecutive days.`,
        color: '#34C759'
      });
    }
    
    if (change > 10) {
      insights.push({
        type: 'improvement' as const,
        title: 'Great progress',
        description: `Your ${nutrient} intake improved by ${Math.round(change)}% this week.`,
        color: '#007AFF'
      });
    } else if (change < -10) {
      insights.push({
        type: 'attention' as const,
        title: 'Needs attention',
        description: `Your ${nutrient} intake decreased by ${Math.round(Math.abs(change))}% this week.`,
        color: '#FF9500'
      });
    }
    
    if (targetPercentage < 70) {
      insights.push({
        type: 'recommendation' as const,
        title: 'Boost your intake',
        description: `Consider adding more ${nutrient}-rich foods to reach your daily target.`,
        color: '#8A6DFF'
      });
    }

    const analyticsData: AnalyticsData = {
      userId,
      period,
      nutrient,
      data,
      average: Math.round(currentAvg * 100) / 100,
      target,
      targetPercentage: Math.round(targetPercentage),
      streak,
      change: Math.round(change * 10) / 10,
      insights: insights.slice(0, 3), // Limit to 3 insights
    };

    const response: ApiResponse<AnalyticsData> = {
      success: true,
      data: analyticsData,
    };
    return Response.json(response);
  } catch (error) {
    console.error('Analytics API error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Internal server error',
    };
    return Response.json(response, { status: 500 });
  }
}