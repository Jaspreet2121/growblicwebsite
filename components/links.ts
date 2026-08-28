/* Store links. SKIFI_URL points at the Growblic developer page until the
   "Growblic: Chat, Call, Meet" listing is approved on Google Play; swap in the
   direct play.google.com/store/apps/details?id=... URL then.

   The constant keeps its old name deliberately: it is imported in four files and
   names nothing a user reads. GROWBLIC_APP_URL is a DIFFERENT app (the earn-money
   one, listed as plain "Growblic"), which is why the chat app is always written out
   in full on this site — a bare "Growblic" would be ambiguous between the two. */

export const PLAY_DEV_URL =
  "https://play.google.com/store/apps/dev?id=8669955576470095918";

export const SKIFI_URL = PLAY_DEV_URL;

export const GROWBLIC_APP_URL =
  "https://play.google.com/store/apps/details?id=com.EarningFish.EarningFish";
