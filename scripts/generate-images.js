require('dotenv').config();
const fs = require('fs');
const path = require('path');
const https = require('https');
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const images = [
  {
    name: 'apple.jpg',
    prompt: 'A red apple with a happy face, cartoon style, child-friendly illustration'
  },
  {
    name: 'banana.jpg',
    prompt: 'A yellow banana with a cheerful face, cartoon style, child-friendly illustration'
  },
  {
    name: 'bed.jpg',
    prompt: 'A cozy bed with colorful blankets and pillows, cartoon style, child-friendly illustration'
  },
  {
    name: 'bike.jpg',
    prompt: 'A colorful bicycle with training wheels, cartoon style, child-friendly illustration'
  },
  {
    name: 'bird.jpg',
    prompt: 'A cute little bird sitting on a branch, bright colors, cartoon style, child-friendly illustration'
  },
  {
    name: 'book.jpg',
    prompt: 'An open colorful storybook with pictures, cartoon style, child-friendly illustration'
  },
  {
    name: 'bread.jpg',
    prompt: 'A fresh loaf of bread with a happy face, cartoon style, child-friendly illustration'
  },
  {
    name: 'car.jpg',
    prompt: 'A friendly red car with a smiling face, cartoon style, child-friendly illustration'
  },
  {
    name: 'chair.jpg',
    prompt: 'A comfortable wooden chair, cartoon style, child-friendly illustration'
  },
  {
    name: 'dog.jpg',
    prompt: 'A friendly puppy with a wagging tail, cartoon style, child-friendly illustration'
  },
  {
    name: 'fish.jpg',
    prompt: 'A colorful fish swimming in blue water, cartoon style, child-friendly illustration'
  },
  {
    name: 'house.jpg',
    prompt: 'A colorful house with a garden and flowers, cartoon style, child-friendly illustration'
  }
];

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

const generateAndSaveImage = async (prompt, filepath) => {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "natural"
    });

    const imageUrl = response.data[0].url;
    await downloadImage(imageUrl, filepath);
    console.log(`Generated and saved: ${path.basename(filepath)}`);
  } catch (error) {
    console.error(`Error generating image: ${error.message}`);
  }
};

const downloadDir = path.join(__dirname, '..', 'public', 'images', 'english');

// Ensure the directory exists
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

// Generate and download all images sequentially
async function generateAllImages() {
  console.log('Starting image generation...');
  for (const img of images) {
    try {
      const filepath = path.join(downloadDir, img.name);
      await generateAndSaveImage(img.prompt, filepath);
      // Add a small delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error processing ${img.name}:`, error.message);
    }
  }
  console.log('All images generated!');
}

generateAllImages();
