import { Platform } from "react-native";

export const deeplink = (post_id) => Platform.OS == "ios" ? `drytimeapp://posts/${post_id}` : `https://drytimeapp/posts/${post_id}`;