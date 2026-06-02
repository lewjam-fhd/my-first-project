const fs = require('fs');

// Read the HTML template
const html = fs.readFileSync('data-view-live.html', 'utf8');

// Read the JSON data
const jsonData = fs.readFileSync('slack-feedback-data.json', 'utf8');

// Replace the fetch call with embedded data
const updatedHtml = html.replace(
    /async function loadFeedback\(\) \{[\s\S]*?catch \(error\) \{[\s\S]*?\}\s*\}/,
    `async function loadFeedback() {
            try {
                // Embedded data - no fetch needed
                feedbackData = ${jsonData};
                displayDashboard(feedbackData);
                initializeFilters();
            } catch (error) {
                document.getElementById('content').innerHTML = \`
                    <div class="error">
                        <strong>Error:</strong> \${error.message}
                    </div>
                \`;
            }
        }`
);

// Write the standalone version
fs.writeFileSync('data-view-standalone.html', updatedHtml);
console.log('Created data-view-standalone.html with embedded data');
