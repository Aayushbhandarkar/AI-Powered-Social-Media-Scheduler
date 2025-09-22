// filename: scripts/scheduler.js
const cron = require('node-cron');
const Post = require('../models/Post');
const User = require('../models/User');

// ---------------- Mock social media posting functions ----------------
const postToTwitter = async (content, user) => {
  console.log(`Posting to Twitter: ${content}`);
  // TODO: Implement actual Twitter API integration here
  return { success: true, platform: 'twitter' };
};

const postToLinkedIn = async (content, user) => {
  console.log(`Posting to LinkedIn: ${content}`);
  // TODO: Implement actual LinkedIn API integration here
  return { success: true, platform: 'linkedin' };
};

const postToInstagram = async (content, user) => {
  console.log(`Posting to Instagram: ${content}`);
  // TODO: Implement actual Instagram API integration here
  return { success: true, platform: 'instagram' };
};

// ---------------- Check scheduled posts ----------------
const checkScheduledPosts = async () => {
  try {
    const now = new Date();
    const postsToPublish = await Post.find({
      scheduledDate: { $lte: now },
      status: 'scheduled',
    }).populate('userId');

    console.log(`[Scheduler] Found ${postsToPublish.length} posts to publish`);

    for (const post of postsToPublish) {
      try {
        console.log(`[Scheduler] Processing post: ${post._id}`);

        let allSuccess = true;
        const results = [];

        for (const platform of post.platforms) {
          try {
            // Check if user has connected the platform
            if (!post.userId || !post.userId[platform]) {
              throw new Error(`User not connected to ${platform}`);
            }

            let result;
            switch (platform) {
              case 'twitter':
                result = await postToTwitter(post.content.text, post.userId);
                break;
              case 'linkedin':
                result = await postToLinkedIn(post.content.text, post.userId);
                break;
              case 'instagram':
                result = await postToInstagram(post.content.text, post.userId);
                break;
              default:
                throw new Error(`Unknown platform: ${platform}`);
            }

            results.push(result);

            if (!result.success) {
              allSuccess = false;
              break; // Stop posting if one platform fails
            }
          } catch (error) {
            console.error(`[Scheduler] Error posting to ${platform}:`, error.message);
            results.push({ success: false, platform, error: error.message });
            allSuccess = false;
            break;
          }
        }

        // Update post status
        if (allSuccess) {
          post.status = 'published';
          post.publishedAt = new Date();
          post.failureReason = undefined;
          console.log(`[Scheduler] Post ${post._id} published successfully`);
        } else {
          post.status = 'failed';
          post.failureReason = results.find((r) => !r.success)?.error || 'Unknown error';
          console.log(`[Scheduler] Post ${post._id} failed: ${post.failureReason}`);
        }

        await post.save();
      } catch (error) {
        console.error(`[Scheduler] Error processing post ${post._id}:`, error.message);
        post.status = 'failed';
        post.failureReason = error.message;
        await post.save();
      }
    }
  } catch (error) {
    console.error('[Scheduler] Fatal error:', error.message);
  }
};

// ---------------- Cron job ----------------
// Runs every minute
cron.schedule('* * * * *', checkScheduledPosts);

console.log('✅ Scheduler started: checking for posts every minute');

// Export for testing or manual triggering
module.exports = { checkScheduledPosts };
