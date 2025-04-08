import api from '@/services/api';

/**
 * API route for getting tag statistics and popularity data
 * This helps prioritize which tags to show based on active model count
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ 
      success: false, 
      error: 'Method Not Allowed'
    });
  }
  
  const { 
    skipCache = false,
    providers = '',
    category = ''
  } = req.query;
  
  const parsedSkipCache = skipCache === 'true' || skipCache === '1';
  
  // Get providers array from query param
  const providersArray = providers ? providers.split(',') : [];
  
  // Define tags based on category or use standard set
  let tags = [];
  
  if (category === 'girls' || !category) {
    tags = [
      'asian', 'ebony', 'latina', 'white', 'teen', 'milf',
      'bbw', 'mature', 'blonde', 'brunette', 'redhead',
      'petite', 'bigboobs', 'smallboobs', 'hairy', 'shaved',
      'anal', 'squirt', 'new', 'fetish', 'dominant', 'submissive',
      'roleplay', 'cosplay', 'pregnant', 'smoking'
    ];
  } else if (category === 'trans') {
    tags = [
      'asian', 'ebony', 'latina', 'white', 'teen', 'milf',
      'bigcock', 'bigboobs', 'petite', 'muscular', 'curvy',
      'fetish', 'dominant', 'submissive', 'new', 'anal',
      'top', 'bottom', 'switch', 'nonbinary', 'genderfluid'
    ];
  } else if (category === 'couples') {
    tags = [
      'straight', 'lesbian', 'bisexual', 'threesome', 'group',
      'anal', 'oral', 'roleplay', 'bdsm', 'toys', 'cosplay',
      'mature', 'young', 'interracial', 'fetish'
    ];
  }
  
  try {
    // Calculate tag statistics
    const tagStats = await api.calculateTagStats({
      skipCache: parsedSkipCache,
      tags,
      providers: providersArray.length > 0 ? providersArray : undefined
    });
    
    // Return tag statistics with success status
    return res.status(200).json({
      success: true,
      data: tagStats
    });
  } catch (error) {
    console.error('[API /tags/stats] Error:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to calculate tag statistics'
    });
  }
} 