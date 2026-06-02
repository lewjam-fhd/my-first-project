# Signal - FamilySearch Memories Feedback Dashboard

Real-time feedback analysis tool that pulls Usabilla feedback from Slack and transforms it into actionable product insights.

## 🎯 What We Built

This project connects your Usabilla feedback (from Slack channel `C09NBPMCVK2`) to a beautiful, interactive dashboard that analyzes user sentiment, identifies themes, and provides product recommendations.

## 📁 Files

### Live Dashboard
- **`data-view-live.html`** - Main dashboard showing real Slack feedback data
  - Displays mood scores, NPS ratings, and user comments
  - Filters by sentiment (positive/neutral/negative)
  - Filters by NPS category (promoters/passives/detractors)
  - Theme analysis with product recommendations
  - Mobile-responsive design

### Data Files
- **`slack-feedback-data.json`** - Real feedback data parsed from Slack
  - Contains mood scores, NPS ratings, comments, URLs, and metadata
  - Updated from Slack channel via Claude Code MCP integration

### Utilities
- **`fetch-slack-data.js`** - Helper functions for parsing Slack messages
  - Parses GetFeedback bot messages
  - Analyzes themes and patterns
  - Calculates metrics (NPS score, sentiment distribution)

- **`parse-slack-feedback.js`** - Script to extract feedback from Slack
  - Reads Slack channel history
  - Filters for Usabilla/GetFeedback messages
  - Outputs structured JSON

### Prototypes
- **`index.html`** - Original Signal prototype (manual input)
- **`data-view.html`** - Original dashboard with sample data
- **`slack-integration.html`** - Integration guide and reference

## 🚀 How to Use

### View the Dashboard

1. Open `data-view-live.html` in your browser
2. The dashboard will automatically load data from `slack-feedback-data.json`
3. Use filters to explore different segments of feedback
4. Review theme analysis for product insights

### Update the Data

To refresh with latest feedback from Slack:

```bash
# Using Claude Code with MCP integration
# This will fetch latest messages and update the JSON file
node parse-slack-feedback.js > slack-feedback-data.json
```

Or ask Claude Code to:
```
Fetch the latest feedback from Slack channel C09NBPMCVK2 and update slack-feedback-data.json
```

## 📊 Features

### Current Dashboard Capabilities

✅ **Real-time Feedback Display**
- Mood scores (1-5 stars)
- NPS ratings (0-10 scale)
- Full user comments
- Device/browser metadata
- Direct links to feedback pages

✅ **Advanced Filtering**
- Filter by sentiment (positive/neutral/negative)
- Filter by NPS category (promoters/passives/detractors)
- Sort by mood or NPS score

✅ **Theme Analysis**
- Automatic pattern detection
- Issue categorization
- Product recommendations
- Sample quotes for evidence

✅ **Analytics Overview**
- Average mood score
- Average NPS score
- Total feedback count
- Distribution by category

## 🔧 Technical Details

### Data Flow

```
Slack Channel (C09NBPMCVK2)
    ↓
GetFeedback Bot Messages
    ↓
Claude Code MCP (slack_get_channel_history)
    ↓
Parse Script (parse-slack-feedback.js)
    ↓
JSON Data File (slack-feedback-data.json)
    ↓
Dashboard (data-view-live.html)
```

### Slack Message Structure

The GetFeedback bot posts structured messages with:
- `bot_id`: B08DMHJ8YHM
- Attachments with blocks containing:
  - Mood score (1-5)
  - NPS score (0-10)
  - User comment
  - Email (optional)
  - Page URL
  - Platform/browser info

## 🎨 Customization

### Adding New Themes

Edit the `analyzeThemes()` function in `data-view-live.html`:

```javascript
// Example: Detect upload issues
const uploadIssues = feedbackData.filter(item =>
    item.comment.toLowerCase().includes('upload') ||
    item.comment.toLowerCase().includes('slow')
);
```

### Adjusting Filters

Modify the filter logic in `filterAndSortData()`:

```javascript
if (currentFilter === 'custom') {
    filtered = filtered.filter(item => /* your condition */);
}
```

## 📈 Future Enhancements

Potential additions:
- [ ] Automatic refresh on a schedule
- [ ] Export to PRD/Jira (already in index.html)
- [ ] Sentiment analysis with AI
- [ ] Trend visualization over time
- [ ] Email alerts for negative feedback
- [ ] Integration with product roadmap tools

## 🔗 Integration with Other Tools

The dashboard data can be exported to:
- **Jira** - Create epics from themes
- **PRD Documents** - Generate requirements docs
- **Analytics Tools** - Feed into BI dashboards
- **Slack** - Post summary reports

## 📝 Notes

- The dashboard works entirely client-side (no server needed)
- Data is stored in a static JSON file
- To update data, re-run the parse script
- Compatible with all modern browsers
- Mobile-responsive design

## 🤝 Contributing

To improve the dashboard:
1. Modify the HTML/CSS/JS in `data-view-live.html`
2. Update parsing logic in `fetch-slack-data.js`
3. Test with real data from `slack-feedback-data.json`

## 📞 Support

For questions or issues:
- Check the existing prototypes for reference
- Review the Slack message structure in the JSON file
- Test with sample data first before using production data
