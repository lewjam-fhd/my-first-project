/**
 * Slack Feedback Fetcher
 *
 * This script demonstrates how to fetch Usabilla feedback from Slack
 * using Claude Code's MCP integration.
 *
 * Usage: node fetch-slack-data.js
 */

const CHANNEL_ID = 'C09NBPMCVK2';

// This would typically connect to Claude Code's MCP server
// For now, this is a reference implementation showing the structure

function parseFeedbackFromSlackMessage(message) {
    // Check if it's a GetFeedback bot message
    if (message.bot_id !== 'B08DMHJ8YHM' || !message.attachments || message.attachments.length === 0) {
        return null;
    }

    const attachment = message.attachments[0];
    const blocks = attachment.blocks || [];

    let mood = null;
    let nps = null;
    let comment = '';
    let email = '';
    let url = '';
    let platform = '';
    let browser = '';

    // Parse the structured fields
    for (const block of blocks) {
        if (block.fields) {
            for (let i = 0; i < block.fields.length; i += 2) {
                const label = block.fields[i]?.text || '';
                const value = block.fields[i + 1]?.text || '';

                if (label.includes('Mood')) {
                    const match = value.match(/(\d+)\s*out of\s*(\d+)/);
                    if (match) mood = parseInt(match[1]);
                } else if (label.includes('Nps')) {
                    const match = value.match(/(\d+)\s*out of\s*(\d+)/);
                    if (match) nps = parseInt(match[1]);
                } else if (label.includes('Comment')) {
                    // Remove markdown links: <mailto:...> and <https://...>
                    comment = value.replace(/<mailto:[^|>]+\|([^>]+)>/g, '$1')
                                   .replace(/<([^>]+)>/g, '')
                                   .trim();
                } else if (label.includes('Email')) {
                    const emailMatch = value.match(/mailto:([^|>]+)/);
                    if (emailMatch) email = emailMatch[1];
                } else if (label.includes('Url')) {
                    const urlMatch = value.match(/<([^>]+)>/);
                    if (urlMatch) url = urlMatch[1];
                } else if (label.includes('Platform')) {
                    platform = value;
                } else if (label.includes('Browser')) {
                    browser = value;
                }
            }
        }
    }

    // Only return if we have the essential fields
    if (mood && nps && comment) {
        return {
            comment,
            mood,
            recommendationLikelihood: nps,
            email,
            url,
            platform,
            browser,
            timestamp: message.ts,
            date: new Date(parseFloat(message.ts) * 1000).toISOString()
        };
    }

    return null;
}

function analyzeThemes(feedbackItems) {
    const themes = [];

    // Upload/performance issues
    const uploadIssues = feedbackItems.filter(item =>
        item.comment.toLowerCase().includes('upload') ||
        item.comment.toLowerCase().includes('slow') ||
        item.comment.toLowerCase().includes('timeout') ||
        item.comment.toLowerCase().includes('performance')
    );
    if (uploadIssues.length > 0) {
        themes.push({
            title: 'Upload & Performance Issues',
            count: uploadIssues.length,
            priority: 'high',
            description: 'Users experiencing slow upload speeds, timeouts, or performance issues',
            samples: uploadIssues.slice(0, 3).map(f => f.comment)
        });
    }

    // Tagging/organization needs
    const taggingNeeds = feedbackItems.filter(item =>
        item.comment.toLowerCase().includes('tag') ||
        item.comment.toLowerCase().includes('organize') ||
        item.comment.toLowerCase().includes('album')
    );
    if (taggingNeeds.length > 0) {
        themes.push({
            title: 'Tagging & Organization',
            count: taggingNeeds.length,
            priority: 'medium',
            description: 'Users requesting better ways to organize and tag memories',
            samples: taggingNeeds.slice(0, 3).map(f => f.comment)
        });
    }

    // Mobile/app issues
    const mobileIssues = feedbackItems.filter(item =>
        item.comment.toLowerCase().includes('mobile') ||
        item.comment.toLowerCase().includes('app') ||
        item.comment.toLowerCase().includes('crash')
    );
    if (mobileIssues.length > 0) {
        themes.push({
            title: 'Mobile App Issues',
            count: mobileIssues.length,
            priority: 'high',
            description: 'Issues with mobile app stability and performance',
            samples: mobileIssues.slice(0, 3).map(f => f.comment)
        });
    }

    // Positive feedback
    const positiveItems = feedbackItems.filter(item => item.mood >= 4);
    if (positiveItems.length > 0) {
        themes.push({
            title: 'Positive Experiences',
            count: positiveItems.length,
            priority: 'insight',
            description: 'What users love about the product',
            samples: positiveItems.slice(0, 3).map(f => f.comment)
        });
    }

    return themes.sort((a, b) => b.count - a.count);
}

function calculateMetrics(feedbackItems) {
    if (feedbackItems.length === 0) {
        return {
            totalFeedback: 0,
            avgMood: 0,
            avgNPS: 0,
            promoters: 0,
            passives: 0,
            detractors: 0,
            npsScore: 0
        };
    }

    const avgMood = feedbackItems.reduce((sum, item) => sum + item.mood, 0) / feedbackItems.length;
    const avgNPS = feedbackItems.reduce((sum, item) => sum + item.recommendationLikelihood, 0) / feedbackItems.length;

    const promoters = feedbackItems.filter(item => item.recommendationLikelihood >= 9).length;
    const passives = feedbackItems.filter(item => item.recommendationLikelihood >= 7 && item.recommendationLikelihood <= 8).length;
    const detractors = feedbackItems.filter(item => item.recommendationLikelihood <= 6).length;

    const npsScore = ((promoters - detractors) / feedbackItems.length) * 100;

    return {
        totalFeedback: feedbackItems.length,
        avgMood: avgMood.toFixed(1),
        avgNPS: avgNPS.toFixed(1),
        promoters,
        passives,
        detractors,
        npsScore: npsScore.toFixed(1)
    };
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        parseFeedbackFromSlackMessage,
        analyzeThemes,
        calculateMetrics,
        CHANNEL_ID
    };
}

// Example usage output
console.log(`
Slack Feedback Integration Script
==================================

This script provides utilities to:
1. Parse Usabilla feedback from Slack GetFeedback bot messages
2. Analyze themes and patterns in the feedback
3. Calculate key metrics (NPS, mood scores, etc.)

To use with Claude Code MCP:
- The MCP server provides: mcp__slack__slack_get_channel_history
- Channel ID: ${CHANNEL_ID}
- Bot ID to filter: B08DMHJ8YHM (GetFeedback)

Integration approaches:
1. Direct: Use Claude Code to fetch and parse data, then save to JSON
2. API: Build a simple Express server that calls MCP and serves data
3. Static: Periodically export data to a JSON file for the frontend
`);
