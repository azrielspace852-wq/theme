const https = require('https');

const query = process.argv[2] || 'Axion AI';
console.log(`[AXION SEARCH] Searching for: "${query}"`);

const searchDuckDuckGo = (q) => {
  return new Promise((resolve, reject) => {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(q)}`;
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const results = [];
        const regex = /<a class="result__url" href="([^"]+)"[^>]*>([^<]+)<\/a>/g;
        let match;
        while ((match = regex.exec(data)) !== null && results.length < 5) {
          results.push({ url: match[1], title: match[2].trim() });
        }
        resolve(results);
      });
    });
    req.on('error', reject);
  });
};

(async () => {
  try {
    const results = await searchDuckDuckGo(query);
    console.log(JSON.stringify({ query, results, timestamp: new Date().toISOString() }, null, 2));
  } catch (err) {
    console.error('[ERROR]', err.message);
    process.exit(1);
  }
})();
