const https = require('https');
const fs = require('fs');
const path = require('path');

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
           .on('error', reject)
           .once('close', () => resolve(filepath));
      } else {
        res.resume();
        reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
      }
    }).on('error', reject);
  });
};

const images = [
  // Images depuis un CDN public
  { 
    name: 'boat.jpg', 
    url: 'https://images.pexels.com/photos/273886/pexels-photo-273886.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  { 
    name: 'brother.jpg',
    url: 'https://images.pexels.com/photos/1374509/pexels-photo-1374509.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  { 
    name: 'bus.jpg',
    url: 'https://images.pexels.com/photos/385998/pexels-photo-385998.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  { 
    name: 'cat.jpg',
    url: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  { 
    name: 'door.jpg',
    url: 'https://images.pexels.com/photos/277559/pexels-photo-277559.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  { 
    name: 'father.jpg',
    url: 'https://images.pexels.com/photos/2253879/pexels-photo-2253879.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  { 
    name: 'milk.jpg',
    url: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  { 
    name: 'mother.jpg',
    url: 'https://images.pexels.com/photos/3662850/pexels-photo-3662850.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  { 
    name: 'pen.jpg',
    url: 'https://images.pexels.com/photos/45718/pexels-photo-45718.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  { 
    name: 'sister.jpg',
    url: 'https://images.pexels.com/photos/1741231/pexels-photo-1741231.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  { 
    name: 'table.jpg',
    url: 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  { 
    name: 'window.jpg',
    url: 'https://images.pexels.com/photos/129494/pexels-photo-129494.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
];

const downloadDir = path.join(__dirname, '..', 'public', 'images', 'english');

// Ensure the directory exists
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

// Download all images sequentially
async function downloadAllImages() {
  console.log('Starting downloads...');
  for (const img of images) {
    try {
      const filepath = path.join(downloadDir, img.name);
      await downloadImage(img.url, filepath);
      console.log(`Downloaded ${img.name}`);
      // Add a small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Error downloading ${img.name}:`, error.message);
    }
  }
  console.log('All downloads completed!');
}

downloadAllImages();
