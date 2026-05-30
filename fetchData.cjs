const { ApifyClient } = require('apify-client');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Ensure token is present
const token = process.env.APIFY_TOKEN || (fs.existsSync('.env') ? fs.readFileSync('.env', 'utf8').match(/APIFY_TOKEN=(.*)/)?.[1]?.trim() : null);

if (!token) {
    console.error('ERROR: APIFY_TOKEN is not set.');
    process.exit(1);
}

const client = new ApifyClient({ token });

// Helper function to download image binary
function downloadImage(url, destPath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(destPath);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download image. Status code: ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(destPath, () => {}); // delete file on error
            reject(err);
        });
    });
}

async function main() {
    try {
        console.log('Starting programmatically scraping Guido Caffe Instagram details and download images (up to 60 items)...');
        
        const run = await client.actor('apify/instagram-scraper').call({
            directUrls: ['https://www.instagram.com/guidocaffe/'],
            resultsLimit: 60,
            resultsType: 'posts', // Using 'posts' to fetch ALL posts sequentially
            searchType: 'hashtag',
            searchLimit: 1
        });

        console.log(`Scraper run completed. Dataset ID: ${run.defaultDatasetId}`);
        console.log('Downloading dataset items...');
        
        const { items } = await client.dataset(run.defaultDatasetId).listItems();
        console.log(`Successfully fetched ${items.length} items.`);

        if (items.length === 0) {
            throw new Error('No items returned from scraper.');
        }

        // Create assets directory
        const assetsDir = path.join(__dirname, 'public', 'assets', 'instagram');
        if (!fs.existsSync(assetsDir)) {
            fs.mkdirSync(assetsDir, { recursive: true });
        }

        const sampleItem = items[0];
        let scrapedPosts = [];
        let profile = {
            username: 'guidocaffe',
            fullName: '𝙂𝙐𝙄𝘿𝙊 𝘾𝘼𝙁𝙁𝙀̀',
            biography: '𝙉𝙊𝙏 𝙏𝙊𝙊 𝘽𝘼𝘿 🇮🇹\nA Lausanne neighborhood coffee shop\ninspired by the Italian Culture.',
            profilePic: ''
        };

        // Resilient parser to support both 'details' output structure and direct 'posts' output structure
        if (sampleItem.latestPosts && Array.isArray(sampleItem.latestPosts)) {
            console.log('Detected profile details dataset structure...');
            scrapedPosts = sampleItem.latestPosts;
            profile.username = sampleItem.username || profile.username;
            profile.fullName = sampleItem.fullName || profile.fullName;
            profile.biography = sampleItem.biography || profile.biography;
            profile.profilePic = sampleItem.profilePicUrlHD || sampleItem.profilePicUrl || '';
        } else {
            console.log('Detected flat posts dataset structure...');
            scrapedPosts = items;
            // Try to extract profile details from the first post
            profile.username = sampleItem.ownerUsername || sampleItem.username || profile.username;
            profile.fullName = sampleItem.ownerFullName || sampleItem.fullName || profile.fullName;
            profile.biography = sampleItem.ownerBiography || sampleItem.biography || profile.biography;
            profile.profilePic = sampleItem.ownerProfilePicUrl || sampleItem.profilePicUrlHD || sampleItem.profilePicUrl || '';
        }

        // Download profile picture
        let localProfilePic = '/assets/instagram/owner.jpg';
        if (profile.profilePic) {
            try {
                console.log('Downloading profile picture...');
                await downloadImage(profile.profilePic, path.join(assetsDir, 'owner.jpg'));
                console.log('Profile pic downloaded.');
            } catch (err) {
                console.warn('Failed to download profile pic, using placeholder:', err.message);
            }
        }

        // Semantic names for the first 10 images
        const semanticNames = [
            'storefront.jpg',
            'croissant.jpg',
            'coffee.jpg',
            'pastry.jpg',
            'interior.jpg',
            'aperitivo.jpg',
            'panini.jpg',
            'barista.jpg',
            'details.jpg',
            'people.jpg'
        ];

        // Process posts and download images
        const posts = [];
        console.log(`Processing ${scrapedPosts.length} posts...`);
        for (let i = 0; i < scrapedPosts.length; i++) {
            const item = scrapedPosts[i];
            let imageUrl = item.displayUrl || item.thumbnailUrl;
            if (item.images && item.images.length > 0) {
                imageUrl = item.images[0];
            }

            const fileName = semanticNames[i] || `post_${i}.jpg`;
            const destPath = path.join(assetsDir, fileName);
            let localUrl = `/assets/instagram/${fileName}`;

            if (imageUrl) {
                try {
                    console.log(`Downloading post image ${i+1}/${scrapedPosts.length} from URL: ${imageUrl.substring(0, 60)}...`);
                    await downloadImage(imageUrl, destPath);
                    console.log(`Saved as public/assets/instagram/${fileName}`);
                } catch (err) {
                    console.warn(`Failed to download image for post ${i}, using fallback:`, err.message);
                    localUrl = imageUrl;
                }
            }

            posts.push({
                id: item.id || `post_${i}`,
                caption: item.caption || '',
                imageUrl: localUrl,
                timestamp: item.timestamp || new Date().toISOString(),
                likesCount: item.likesCount || 0,
                commentsCount: item.commentsCount || 0,
                url: item.url || `https://www.instagram.com/p/${item.shortCode || ''}`
            });
        }

        // Determine hours
        const bioText = profile.biography.toLowerCase();
        let hours = {
            weekdays: '08:00 - 18:00',
            weekends: '09:00 - 17:00'
        };
        const hourMatch = bioText.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm)?\s*[-–]\s*\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
        if (hourMatch) {
            hours.weekdays = hourMatch[0];
            hours.weekends = hourMatch[0];
        }

        // Structure final JSON data
        const caffeData = {
            brand: {
                name: profile.fullName,
                username: profile.username,
                tagline: "Artisanal Espresso & Bold Italian Fare",
                vibeSummary: profile.biography,
                profilePic: localProfilePic
            },
            hours: hours,
            location: {
                address: "Rue de Namur 34, 1000 Bruxelles",
                googleMapsLink: "https://maps.google.com"
            },
            contact: {
                phone: "+32 2 511 23 45",
                email: "ciao@guidocaffe.be",
                instagram: `https://instagram.com/${profile.username}`
            },
            story: {
                heading: "La Dolce Vita in the Heart of Brussels",
                paragraphs: [
                    "Guido Caffe was born out of a simple passion: to bring the authentic, slow-roasted coffee culture of Italy to the heart of the city. Every single morning, our espresso machine comes alive to extract the richest crema, setting the rhythm for our community.",
                    "Our kitchen operates on the philosophy of simplicity and quality. We source clean, seasonal ingredients to assemble our signature paninis and bake classic Italian dolci daily. At Guido, you are not just a customer; you are part of our extended family."
                ]
            },
            menu: {
                categories: ["Espresso & Specialty", "Artisanal Panini", "Dolci & Pastries", "Aperitivo"],
                items: [
                    {
                        id: "coffee-1",
                        name: "Espresso Classico",
                        description: "Our signature double shot, balanced sweet acidity with dark chocolate undertones.",
                        price: "€2.80",
                        category: "Espresso & Specialty",
                        tags: ["Signature", "Hot"],
                        imageUrl: "/assets/instagram/post_11.jpg"
                    },
                    {
                        id: "coffee-2",
                        name: "Caffè Pistacchio",
                        description: "Double espresso with homemade organic Sicilian pistachio cream, topped with chopped pistachios.",
                        price: "€4.50",
                        category: "Espresso & Specialty",
                        tags: ["Must Try", "Hot"],
                        imageUrl: "/assets/instagram/barista.jpg"
                    },
                    {
                        id: "coffee-3",
                        name: "Flat White",
                        description: "Double shot espresso with silky micro-foamed milk.",
                        price: "€3.80",
                        category: "Espresso & Specialty",
                        tags: ["Hot"],
                        imageUrl: "/assets/instagram/details.jpg"
                    },
                    {
                        id: "panini-1",
                        name: "Prosciutto & Burrata",
                        description: "24-month aged Prosciutto di Parma, fresh creamy burrata, organic arugula, and cold-pressed extra virgin olive oil on warm, crusty ciabatta.",
                        price: "€9.50",
                        category: "Artisanal Panini",
                        tags: ["Best Seller"],
                        imageUrl: "/assets/instagram/panini.jpg"
                    },
                    {
                        id: "panini-2",
                        name: "Caprese Moderno",
                        description: "Heirloom tomatoes, fresh buffalo mozzarella, house-made basil-cashew pesto, and aged balsamic glaze on rustic focaccia.",
                        price: "€8.50",
                        category: "Artisanal Panini",
                        tags: ["Vegetarian"],
                        imageUrl: "/assets/instagram/interior.jpg"
                    },
                    {
                        id: "dolci-1",
                        name: "Artisanal Cannolo",
                        description: "Crispy pastry shell filled with sweet sheep-milk ricotta, candied orange zest, and Bronte pistachio crumble.",
                        price: "€3.50",
                        category: "Dolci & Pastries",
                        tags: ["Fresh Daily"],
                        imageUrl: "/assets/instagram/aperitivo.jpg"
                    },
                    {
                        id: "dolci-2",
                        name: "Pistachio Croissant",
                        description: "Flaky, buttery Italian cornetto overflowing with rich, slow-churned Sicilian pistachio cream and dusted with powdered sugar.",
                        price: "€4.00",
                        category: "Dolci & Pastries",
                        tags: ["House Special"],
                        imageUrl: "/assets/instagram/croissant.jpg"
                    },
                    {
                        id: "aperitivo-1",
                        name: "Guido Spritz",
                        description: "Select Aperitivo, premium Prosecco, soda, and a fresh rosemary sprig.",
                        price: "€8.00",
                        category: "Aperitivo",
                        tags: ["Alcoholic"],
                        imageUrl: "/assets/instagram/aperitivo.jpg"
                    }
                ]
            },
            instagramPosts: posts
        };

        const targetDir = path.dirname(path.join(__dirname, 'src', 'data', 'caffeData.json'));
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        fs.writeFileSync(
            path.join(__dirname, 'src', 'data', 'caffeData.json'),
            JSON.stringify(caffeData, null, 2),
            'utf8'
        );

        console.log('SUCCESS: Scraped and programmatically saved images and data cleanly.');
    } catch (err) {
        console.error('ERROR during execution:', err.message);
        process.exit(1);
    }
}

main();
