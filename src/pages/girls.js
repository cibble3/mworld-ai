import React from 'react';
import ThemeLayout from '@/theme/layouts/ThemeLayout';
import ModelPage from '@/components/pages/ModelPage';
import { text as girlsTransContent } from '@/theme/content/girlsTransContent';
import { capitalizeString } from '@/utils/string-helpers';

const GirlsPage = () => {
  // Default content when no filters are applied
  const defaultContent = {
    title: "Live Cam Girls",
    desc: "Find the hottest live cam girls online. Watch sexy webcam girls perform live shows just for you.",
    meta_title: "Live Cam Girls | MistressWorld",
    meta_desc: "Find the hottest live cam girls online. Watch sexy webcam girls perform live shows just for you.",
    meta_keywords: "cam girls, webcam models, live cams, sex chat",
    about: []
  };

  // Get content map from the content file
  const contentMap = girlsTransContent?.girls || {};

  // Helper function to generate dynamic content based on ethnicity
  const generateDynamicContent = (ethnicity) => ({
    title: `${capitalizeString(ethnicity)} Cam Girls`,
    desc: `Experience the hottest ${ethnicity} cam girls online at MistressWorld.xxx. Connect with stunning ${ethnicity} models for a private chat experience you'll never forget.`,
    meta_title: `${capitalizeString(ethnicity)} Cam Girls - Live ${capitalizeString(ethnicity)} Sex Chat - MistressWorld`,
    meta_desc: `Chat live with sexy ${ethnicity} cam girls online now. MistressWorld features the hottest adult chat models for private shows.`,
    meta_keywords: `${ethnicity} cam girls, ${ethnicity} cams, ${ethnicity} sex chat`
  });

  // Ensure contentMap has entries for common ethnicities
  const ensuredContentMap = {
    ...contentMap,
    // Add default ethnicity entries if they don't exist
    asian: contentMap.asian || generateDynamicContent('asian'),
    ebony: contentMap.ebony || generateDynamicContent('ebony'),
    latina: contentMap.latina || generateDynamicContent('latina'),
    white: contentMap.white || generateDynamicContent('white')
  };

  const girlsPageContent = (
    <ModelPage
      category="girls"
      defaultContent={defaultContent}
      contentMap={ensuredContentMap}
      additionalParams={[]} // Girls page doesn't have additional parameters beyond the common ones
      pageRoute="/girls"
    />
  );

  return (
    <ThemeLayout>
      {girlsPageContent}
    </ThemeLayout>
  );
};

export default GirlsPage; 