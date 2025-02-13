import { ZendeskBotType } from '../providers/apiProvider';

export const bitsToGigabytes = (bits: bigint): number | bigint => {
  const gigabytes = bits / BigInt(1073741824);
  return gigabytes;
};

export const isJSON = (text: string) => {
  try {
    JSON.parse(text);
    return true;
  } catch (e) {
    return false;
  }
};

export const openZendeskChatbot = (botType: ZendeskBotType | '') => {
  if (typeof window !== 'undefined' && window.zE) {
    if (botType === ZendeskBotType.Classic) {
      window.zE('webWidget', 'show');
      window.zE('webWidget', 'open');
    }
    if (botType === ZendeskBotType.Messenger) {
      window.zE('messenger', 'open');
    }
  } else {
    console.warn('Zendesk API not loaded');
  }
};
