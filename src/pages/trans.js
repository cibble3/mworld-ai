import React from 'react';
import ThemeLayout from '@/theme/layouts/ThemeLayout';
import ModelPage from '@/components/pages/ModelPage';
import { text as girlsTransContent } from '@/theme/content/girlsTransContent';
import { capitalizeString } from '@/utils/string-helpers';

const TransPage = () => {
  // Default content when no filters are applied
  const defaultContent = {
    title: "Live Trans Cams",
    desc: "Explore the hottest live trans cam models online. Watch transgender webcam models perform live just for you.",
    meta_title: "Live Trans Cams | MistressWorld",
    meta_desc: "Explore the hottest live trans cam models online. Watch transgender webcam models perform live just for you.",
    meta_keywords: "trans models, transgender webcams, trans cams, transgender models",
    about: []
  };

  // Get content map from the content file
  const contentMap = girlsTransContent?.trans || {};

  // Helper function to generate dynamic content based on ethnicity
  const generateDynamicContent = (ethnicity) => ({
    title: `${capitalizeString(ethnicity)} Trans Models`,
    desc: `Experience the hottest ${ethnicity} trans models online at MistressWorld.xxx. Connect with stunning ${ethnicity} trans performers for a private chat experience you'll never forget.`,
    meta_title: `${capitalizeString(ethnicity)} Trans Models - Live ${capitalizeString(ethnicity)} Trans Cams - MistressWorld`,
    meta_desc: `Chat live with sexy ${ethnicity} trans models online now. MistressWorld features the hottest transgender webcam performers for private shows.`,
    meta_keywords: `${ethnicity} trans models, ${ethnicity} trans cams, ${ethnicity} transgender webcams`
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

  const transPageContent = (
    <ModelPage
      category="trans"
      defaultContent={defaultContent}
      contentMap={ensuredContentMap}
      additionalParams={['gender_identity', 'body_type']} // Trans page has these additional params
      pageRoute="/trans"
    />
  );

  return (
    <ThemeLayout>
      {transPageContent}
    </ThemeLayout>
  );
};

export default TransPage; 