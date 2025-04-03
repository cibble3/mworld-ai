import axios from 'axios';
import { ApiProviders } from './constants'; // Assuming constants are moved
import { AWE_CONFIG, DEFAULT_LIMIT, AWE_FILTERS, AWE_SYNONYMS } from './config'; // Adjust path as needed

// Normalization function specific to AWE
export const normalizeAWEModel = (model) => ({
    id: model.id || model.username,
    slug: model.username,
    name: model.displayName,
    thumbnail: model.profilePictureUrl?.size320x180,
    preview: model.profilePictureUrl?.size800x600,
    age: model.persons?.[0]?.age,
    ethnicity: model.ethnicity,
    bodyType: null, // Extract if available in extendedDetails
    tags: model.details?.willingnesses || [],
    isOnline: true, // API only returns online
    viewerCount: model.viewerCount || 0,
    _provider: ApiProviders.AWE
});

// Parameter mapping function specific to AWE
export const mapParamsToAWE = (params) => {
    let aweCategory;
    if (params.category === 'trans') {
        aweCategory = 'transgender';
    } else if (params.category === 'fetish') {
        aweCategory = 'fetish';
    } else {
        aweCategory = 'girl';
    }

    const apiParams = {
        siteId: AWE_CONFIG.SITE_ID,
        psId: AWE_CONFIG.PS_ID,
        psTool: AWE_CONFIG.PS_TOOL,
        psProgram: AWE_CONFIG.PS_PROGRAM,
        campaignId: AWE_CONFIG.CAMPAIGN_ID,
        limit: params.limit || DEFAULT_LIMIT,
        offset: params.offset || 0,
        imageSizes: '320x180,800x600',
        imageType: 'ex',
        showOffline: 0,
        onlyFreeStatus: 1,
        extendedDetails: 1,
        responseFormat: 'json',
        accessKey: AWE_CONFIG.API_KEY,
        category: aweCategory,
        customOrder: params.filters?.customOrder || 'most_popular',
        legacyRedirect: 1
    };

    let aweFilters = [];
    if (['girls', 'trans'].includes(params.category) && params.subcategory) {
        const sub = params.subcategory.toLowerCase();
        const mappedSub = AWE_SYNONYMS[sub] || sub;
        let found = false;
        for (const filterType in AWE_FILTERS) {
            if (AWE_FILTERS[filterType].includes(mappedSub)) {
                aweFilters.push(mappedSub);
                found = true;
                break;
            }
        }
        if (!found) {
            console.warn(`[aweService] Subcategory '${params.subcategory}' for category '${params.category}' did not map to a known AWE filter.`);
        }
    }

    if (params.filters) {
        for(const filterKey in params.filters) {
            if (['customOrder', '_timestamp'].includes(filterKey)) continue;
            const filterValue = String(params.filters[filterKey]).toLowerCase();
            const mappedValue = AWE_SYNONYMS[filterValue] || filterValue;
            if (AWE_FILTERS[filterKey] && AWE_FILTERS[filterKey].includes(mappedValue)) {
                aweFilters.push(mappedValue);
            } else {
                let foundDirect = false;
                for (const type in AWE_FILTERS) {
                    if (AWE_FILTERS[type].includes(mappedValue)) {
                        aweFilters.push(mappedValue);
                        foundDirect = true;
                        break;
                    }
                }
                if (!foundDirect) {
                    console.warn(`[aweService] Filter '${filterKey}=${filterValue}' not mapped or invalid for AWE.`);
                }
            }
        }
    }

    if (aweFilters.length > 0) {
        apiParams.filters = [...new Set(aweFilters)].join(',');
    }

    console.log('[aweService] Mapped AWE Params:', apiParams);
    return apiParams;
};

// Add mock generator if needed for fallbacks
export const generateMockAweModels = (category, subcategory, limit, offset) => {
    // Simplified mock generation
    const items = [];
    const total = 50;
    for (let i = 0; i < limit; i++) {
        const index = offset + i;
        if (index >= total) break;
        items.push({
            id: `awe-mock-${category}-${index}`,
            slug: `mock-model-${index}`,
            name: `Mock AWE Model ${index + 1}`,
            thumbnail: `https://picsum.photos/id/${200 + index}/320/180`,
            preview: `https://picsum.photos/id/${200 + index}/800/600`,
            age: 25 + (index % 10),
            ethnicity: 'latin',
            tags: [category, subcategory, 'mock'].filter(Boolean),
            isOnline: true,
            viewerCount: 100 + (index * 5),
            _provider: ApiProviders.AWE
        });
    }
    return { items, total };
};


// Main fetch function for AWE models
export const fetchAweModels = async (params = {}) => {
    const {
        category = 'girls',
        subcategory,
        limit = DEFAULT_LIMIT,
        offset = 0,
        filters = {},
        useMock = false // Allow forcing mock
    } = params;

    console.log(`[aweService] fetchAweModels called with params:`, JSON.stringify(params, null, 2));

    const aweConfigured = AWE_CONFIG.BASE_URL && AWE_CONFIG.API_KEY;
    const shouldMock = useMock || (process.env.NODE_ENV === 'development' && !aweConfigured);

    if (shouldMock) {
         console.warn(`[aweService] Using mock data (Forced: ${useMock}, Configured: ${aweConfigured})`);
         const { items, total } = generateMockAweModels(category, subcategory, limit, offset);
         const hasMore = (offset + items.length) < total;
         const totalPages = Math.ceil(total / limit);
         const currentPage = Math.floor(offset / limit) + 1;
         return {
             success: true,
             data: {
                 items,
                 pagination: { total, limit, offset, currentPage, totalPages, hasMore }
             }
         };
    }

    try {
        const requestParams = mapParamsToAWE({ category, subcategory, limit, offset, filters });
        const baseUrl = AWE_CONFIG.BASE_URL;

        console.log(`[aweService] Fetching real models from AWE.`);
        console.log(`[aweService] Request URL: ${baseUrl}`);
        console.log(`[aweService] Request Params:`, requestParams);

        const startTime = Date.now();
        const apiResponse = await axios.get(baseUrl, {
            params: requestParams,
            timeout: 15000
        });
        const requestTime = Date.now() - startTime;
        console.log(`[aweService] Response received in ${requestTime}ms, status: ${apiResponse.status}`);


        if (apiResponse.status !== 200 || !apiResponse.data) {
            throw new Error(`AWE request failed with status ${apiResponse.status}`);
        }

         // Check for API-level errors if the structure includes it (adjust based on actual AWE response)
        if (apiResponse.data.status && apiResponse.data.status !== 'OK') {
             console.error('[aweService] AWE API returned error status:', apiResponse.data.status);
             throw new Error(`AWE API returned status: ${apiResponse.data.status}`);
        }

        // Use optional chaining for safety
        const items = (apiResponse.data?.data?.models || []).map(normalizeAWEModel);
        const paginationData = apiResponse.data?.data?.pagination || {}; // Adjust based on actual API response structure
        const total = parseInt(paginationData?.totalRecords || items.length, 10); // Adjust field name

        console.log(`[aweService] Normalized ${items.length} models. Total from API: ${total}`);

        const hasMore = (offset + items.length) < total;
        const totalPages = limit > 0 ? Math.ceil(total / limit) : 0;
        const currentPage = limit > 0 ? Math.floor(offset / limit) + 1 : 1;

        return {
            success: true,
            data: {
                items,
                pagination: { total, limit, offset, currentPage, totalPages, hasMore }
            }
        };

    } catch (error) {
        console.error('[aweService] Error fetching from AWE:', error.message);
        let errorMessage = 'Failed to fetch models from AWE.';
         if (error.response) {
             errorMessage = `AWE Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`;
             console.error('[aweService] Response Error Data:', error.response.data);
         } else if (error.request) {
             errorMessage = 'No response received from AWE.';
         } else if (error.code === 'ECONNABORTED') {
             errorMessage = 'AWE request timed out.';
         }

        // Fallback logic
        const useFallback = process.env.NODE_ENV !== 'production';
        if (useFallback) {
            console.warn('[aweService] AWE fetch failed. Returning mock fallback data.');
            const { items, total } = generateMockAweModels(category, subcategory, limit, offset);
             const hasMore = (offset + items.length) < total;
             const totalPages = Math.ceil(total / limit);
             const currentPage = Math.floor(offset / limit) + 1;
            return {
                success: false, // Indicate fetch failed but providing fallback
                error: errorMessage + ' (Using fallback data)',
                data: { items, pagination: { total, limit, offset, currentPage, totalPages, hasMore } }
            };
        } else {
            // Production error
            return {
                success: false,
                error: errorMessage,
                data: { items: [], pagination: { total: 0, limit, offset, currentPage: 1, totalPages: 0, hasMore: false } }
            };
        }
    }
}; 