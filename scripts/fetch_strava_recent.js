const https = require('https');
const fs = require('fs');
const path = require('path');

const CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.STRAVA_REFRESH_TOKEN;

const DATA_FILE = path.join(__dirname, '../data/recent_activities.json');

if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    console.error('Error: Missing Strava env variables.');
    process.exit(1);
}

// Helper for https requests
function request(options, postData) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        });
        req.on('error', reject);
        if (postData) req.write(postData);
        req.end();
    });
}

async function getAccessToken() {
    const postData = JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: REFRESH_TOKEN,
        grant_type: 'refresh_token'
    });

    const options = {
        hostname: 'www.strava.com',
        path: '/api/v3/oauth/token',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': postData.length
        }
    };

    console.log('Refreshing access token...');
    const data = await request(options, postData);
    if (data.access_token) return data.access_token;
    throw new Error('Failed to refresh token: ' + JSON.stringify(data));
}

async function getRecentActivities(accessToken) {
    const options = {
        hostname: 'www.strava.com',
        path: '/api/v3/athlete/activities?per_page=6',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    };

    console.log('Fetching activities...');
    return await request(options);
}

// Map Activity Type to FontAwesome Icon
function getIconForType(type) {
    const map = {
        'Run': 'fa-person-running',
        'Ride': 'fa-bicycle',
        'Hike': 'fa-person-hiking',
        'Walk': 'fa-person-walking',
        'AlpineSki': 'fa-person-skiing',
        'BackcountrySki': 'fa-person-skiing-nordic',
        'Swim': 'fa-person-swimming',
        'RockClimbing': 'fa-mountain' 
    };
    return map[type] || 'fa-stopwatch';
}

async function main() {
    try {
        const accessToken = await getAccessToken();
        const activities = await getRecentActivities(accessToken);

        if (!Array.isArray(activities)) {
            console.error('API Error Response:', JSON.stringify(activities, null, 2));
            throw new Error('Failed to fetch activities: Response is not an array.');
        }

        const simplified = activities.map(act => ({
            id: act.id,
            name: act.name,
            type: act.type,
            distance: (act.distance / 1609.34).toFixed(1), // Meters to Miles
            date: new Date(act.start_date).toLocaleDateString(),
            icon: getIconForType(act.type),
            link: `https://www.strava.com/activities/${act.id}`,
            // Strava API doesn't return full photos in summary, so we use a placeholder or Map image if available
            // For now, we'll rely on CSS/Icon styling rather than broken images
        }));

        // Ensure directory exists
        const dir = path.dirname(DATA_FILE);
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(DATA_FILE, JSON.stringify(simplified, null, 2));
        console.log(`Successfully saved ${simplified.length} activities to ${DATA_FILE}`);

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

main();
