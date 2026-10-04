const https = require('https');

const query = process.argv[2] || 'Axion AI';
console.log(`\n[AXION SEARCH] Query: "${query}"\n`);

const searchDuckDuckGo = (q) => {
  return new Promise((resolve, reject) => {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(q)}`;
    const req = https.get(url, { 
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      } 
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const results = [];
        const regex = /<a class="result__a"[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/g;
        let match;
        while ((match = regex.exec(data)) !== null && results.length < 5) {
          const title = match[2].replace(/<[^>]*>/g, '').trim();
          results.push({ url: match[1], title });
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
    
    if (results.length === 0) {
      console.log('Tidak ada hasil ditemukan.');
    } else {
      console.log(`[HASIL] ${results.length} item ditemukan:\n`);
      results.forEach((r, i) => {
        console.log(`${i + 1}. ${r.title}`);
        console.log(`   ${r.url}\n`);
      });
    }
    
    // Tampilkan JSON di akhir untuk kemudahan parsing
    console.log('\n[JSON DATA]');
    console.log(JSON.stringify({ query, results, timestamp: new Date().toISOString() }));
    
  } catch (err) {
    console.error('[ERROR]', err.message);
    process.exit(1);
  }
})();