const express = require('express');
const router = express.Router();

// @route   GET api/leetcode/:username
// @desc    Fetch LeetCode user statistics from GraphQL API
// @access  Public
router.get('/:username', async (req, res) => {
  const { username } = req.params;
  
  const query = `
    query getUserProfile($username: String!) {
      allQuestionsCount {
        difficulty
        count
      }
      matchedUser(username: $username) {
        username
        profile {
          ranking
          userAvatar
        }
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
    }
  `;

  try {
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      },
      body: JSON.stringify({
        query,
        variables: { username }
      })
    });

    if (!response.ok) {
      return res.status(response.status).json({ message: 'Error communicating with LeetCode' });
    }

    const data = await response.json();

    if (data.errors || !data.data.matchedUser) {
      return res.status(404).json({ message: 'LeetCode user not found' });
    }

    const matchedUser = data.data.matchedUser;
    const allQuestions = data.data.allQuestionsCount;

    // Format the response nicely
    const submissionStats = matchedUser.submitStats.acSubmissionNum;
    const ranking = matchedUser.profile.ranking;
    
    const stats = {
      username: matchedUser.username,
      avatar: matchedUser.profile.userAvatar,
      ranking: ranking,
      solved: {
        All: submissionStats.find(s => s.difficulty === 'All')?.count || 0,
        Easy: submissionStats.find(s => s.difficulty === 'Easy')?.count || 0,
        Medium: submissionStats.find(s => s.difficulty === 'Medium')?.count || 0,
        Hard: submissionStats.find(s => s.difficulty === 'Hard')?.count || 0
      },
      total: {
        All: allQuestions.find(q => q.difficulty === 'All')?.count || 0,
        Easy: allQuestions.find(q => q.difficulty === 'Easy')?.count || 0,
        Medium: allQuestions.find(q => q.difficulty === 'Medium')?.count || 0,
        Hard: allQuestions.find(q => q.difficulty === 'Hard')?.count || 0
      }
    };

    res.json(stats);
  } catch (err) {
    console.error('LeetCode fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch LeetCode statistics' });
  }
});

module.exports = router;
