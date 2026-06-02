// Read the Slack data from Claude's cache and parse it
const fs = require('fs');

const slackDataPath = '/Users/lewisjam000/.claude/projects/-Users-lewisjam000/63eaa9f9-7da1-4bf0-ad3d-a2e94ed411ac/tool-results/toolu_bdrk_01MCZDyBD1iz8HrYDzfyjqzr.json';

const rawData = JSON.parse(fs.readFileSync(slackDataPath, 'utf8'));
const slackResponse = JSON.parse(rawData[0].text);
const messages = slackResponse.messages;

const feedbackItems = [];

for (const msg of messages) {
    if (msg.bot_id === 'B08DMHJ8YHM' && msg.attachments && msg.attachments.length > 0) {
        const attachment = msg.attachments[0];
        const blocks = attachment.blocks || [];

        let mood = null;
        let nps = null;
        let comment = '';
        let email = '';
        let url = '';
        let platform = '';
        let browser = '';

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

        if (mood && nps && comment) {
            feedbackItems.push({
                comment,
                mood,
                recommendationLikelihood: nps,
                email,
                url,
                platform,
                browser,
                timestamp: msg.ts,
                date: new Date(parseFloat(msg.ts) * 1000).toISOString()
            });
        }
    }
}

console.log(JSON.stringify(feedbackItems, null, 2));
