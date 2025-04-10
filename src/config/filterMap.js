/**
 * Centralized filter mapping configuration for normalizing parameters across APIs
 * 
 * This configuration maps UI filter keys to the appropriate parameter names and values
 * for each supported API provider (AWE, VPAPI).
 * 
 * Structure:
 * - key: The filter name used in the UI and URL parameters
 * - param: The normalized parameter name
 * - providers: Provider-specific mappings
 *   - awe: How this filter maps to AWE API
 *   - vpapi: How this filter maps to VPAPI
 */

const FILTER_MAP = {
  "ageGroup": {
    "param": "age_range",
    "providers": {
      "awe": {
        "param": "age",
        "map": {
          "18-22": [18, 22],
          "23-29": [23, 29],
          "30-39": [30, 39],
          "40+": [40, 99]
        }
      },
      "vpapi": {
        "param": "ageRange",
        "map": {
          "18-22": "young",
          "23-29": "twenties",
          "30-39": "thirties",
          "40+": "mature"
        }
      }
    }
  },
  "ethnicity": {
    "param": "ethnicity",
    "providers": {
      "awe": {
        "param": "ethnicity",
        "map": {
          "asian": "asian",
          "latina": "latina",
          "white": "white",
          "ebony": "ebony",
          "middle_eastern": "middle_eastern",
          "indian": "indian"
        }
      },
      "vpapi": {
        "param": "race",
        "map": {
          "asian": "asian",
          "latina": "latina",
          "white": "white",
          "ebony": "black",
          "middle_eastern": "middle-eastern",
          "indian": "indian"
        }
      }
    }
  },
  "hair_color": {
    "param": "hair_color",
    "providers": {
      "awe": {
        "param": "hairColor",
        "map": {
          "blonde": "blonde",
          "black": "black",
          "red": "red",
          "brunette": "brunette",
          "blue": "blue",
          "pink": "pink",
          "other": "other"
        }
      },
      "vpapi": {
        "param": "hairColor",
        "map": {
          "blonde": "blonde",
          "black": "black",
          "red": "red",
          "brunette": "brunette",
          "blue": "colored",
          "pink": "colored",
          "other": "other"
        }
      }
    }
  },
  "tags": {
    "param": "tags",
    "providers": {
      "awe": {
        "param": "tags",
        "map": {
          "milf": "milf",
          "petite": "petite",
          "bdsm": "bdsm",
          "lingerie": "lingerie",
          "tattoos": "tattoos",
          "piercing": "piercing",
          "squirt": "squirt",
          "smoking": "smoking",
          "toys": "toys",
          "roleplay": "roleplay"
        }
      },
      "vpapi": {
        "param": "interests",
        "map": {
          "milf": "milf",
          "petite": "petite",
          "bdsm": "bdsm",
          "lingerie": "lingerie",
          "tattoos": "tattoos",
          "piercing": "piercing",
          "squirt": "squirting",
          "smoking": "smoking",
          "toys": "toys",
          "roleplay": "roleplay"
        }
      }
    }
  },
  "willingness": {
    "param": "willingness",
    "providers": {
      "awe": {
        "param": "willingnesses",
        "map": {
          "group": "group",
          "anal": "anal",
          "fetish": "fetish",
          "couple": "couples",
          "dildo": "dildo",
          "roleplay": "roleplay",
          "cumshow": "cumshow"
        }
      },
      "vpapi": {
        "param": "acts",
        "map": {
          "group": "group",
          "anal": "anal",
          "fetish": "fetish",
          "couple": "couples",
          "dildo": "toys",
          "roleplay": "roleplay",
          "cumshow": "cum"
        }
      }
    }
  },
  "height": {
    "param": "height",
    "providers": {
      "awe": {
        "param": "height",
        "map": {
          "short": "short",
          "average": "average",
          "tall": "tall",
          "very_tall": "very_tall"
        }
      },
      "vpapi": {
        "param": "height",
        "map": {
          "short": "petite",
          "average": "medium",
          "tall": "tall",
          "very_tall": "very-tall"
        }
      }
    }
  },
  "body_type": {
    "param": "body_type",
    "providers": {
      "awe": {
        "param": "bodyType",
        "map": {
          "slim": "slim",
          "athletic": "athletic",
          "curvy": "curvy",
          "bbw": "bbw",
          "muscular": "muscular",
          "petite": "petite",
          "average": "average"
        }
      },
      "vpapi": {
        "param": "bodyType",
        "map": {
          "slim": "slim",
          "athletic": "athletic",
          "curvy": "curvy",
          "bbw": "bbw",
          "muscular": "muscular",
          "petite": "petite",
          "average": "average"
        }
      }
    }
  },
  "breast_size": {
    "param": "breast_size",
    "providers": {
      "awe": {
        "param": "bustSize",
        "map": {
          "small": "small",
          "medium": "medium",
          "large": "large",
          "very_large": "very_large"
        }
      },
      "vpapi": {
        "param": "breastSize",
        "map": {
          "small": "small",
          "medium": "medium",
          "large": "large",
          "very_large": "extra-large"
        }
      }
    }
  },
  "language": {
    "param": "language",
    "providers": {
      "awe": {
        "param": "languages",
        "map": {
          "english": "english",
          "spanish": "spanish",
          "french": "french",
          "german": "german",
          "russian": "russian",
          "italian": "italian"
        }
      },
      "vpapi": {
        "param": "language",
        "map": {
          "english": "english",
          "spanish": "spanish",
          "french": "french",
          "german": "german",
          "russian": "russian",
          "italian": "italian"
        }
      }
    }
  },
  "experience": {
    "param": "experience",
    "providers": {
      "awe": {
        "param": "experience",
        "map": {
          "beginner": "beginner",
          "intermediate": "intermediate",
          "professional": "professional"
        }
      },
      "vpapi": {
        "param": "experience",
        "map": {
          "beginner": "beginner",
          "intermediate": "intermediate",
          "professional": "professional"
        }
      }
    }
  },
  "category": {
    "param": "category",
    "providers": {
      "awe": {
        "param": "category",
        "map": {
          "girls": "girl",
          "trans": "transgender",
          "fetish": "fetish"
        }
      },
      "vpapi": {
        "param": "category",
        "map": {
          "girls": "female",
          "trans": "trans",
          "fetish": "fetish"
        }
      }
    }
  }
};

/**
 * Helper function to normalize a filter value for a specific provider
 * @param {string} filterKey - The filter key (e.g., 'ethnicity', 'hair_color')
 * @param {string} value - The filter value (e.g., 'asian', 'blonde')
 * @param {string} provider - The API provider ('awe', 'vpapi')
 * @returns {Object} - The normalized parameter name and value
 */
export const normalizeFilterForProvider = (filterKey, value, provider) => {
  if (!FILTER_MAP[filterKey] || !FILTER_MAP[filterKey].providers[provider]) {
    return null;
  }

  const providerConfig = FILTER_MAP[filterKey].providers[provider];
  const mappedValue = providerConfig.map[value];

  if (mappedValue === undefined) {
    return null;
  }

  return {
    param: providerConfig.param,
    value: mappedValue
  };
};

/**
 * Maps all filters from a query to provider-specific parameters
 * @param {Object} filters - Key-value pairs of filters from the query
 * @param {string} provider - The API provider ('awe', 'vpapi')
 * @returns {Object} - Provider-specific parameters
 */
export const mapFiltersToProvider = (filters, provider) => {
  const result = {};
  
  for (const [key, value] of Object.entries(filters)) {
    if (!value) continue;
    
    const normalizedFilter = normalizeFilterForProvider(key, value, provider);
    if (normalizedFilter) {
      result[normalizedFilter.param] = normalizedFilter.value;
    }
  }
  
  return result;
};

export default FILTER_MAP; 