import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";
  const daysAgo = parseInt(searchParams.get("daysAgo") || "100", 10);
  const minSubscribers = parseInt(searchParams.get("minSubscribers") || "0", 10);
  const maxSubscribers = parseInt(searchParams.get("maxSubscribers") || "Infinity", 10);
  const minViews = parseInt(searchParams.get("minViews") || "0", 10);
  const maxViews = parseInt(searchParams.get("maxViews") || "Infinity", 10);
  const region = searchParams.get("region") || "";
  const maxResults = Math.min(parseInt(searchParams.get("maxResults") || "49", 10), 500); //youtube tek seferde max 50 kanal getirir, 50 nin üstü için nextpagetoekn ile yeni sorgu atılır. daha fazla quota gider.

  const API_KEY = searchParams.get("apiKey");
  console.log("API KEY= ",API_KEY)
  const BASE_URL = "https://www.googleapis.com/youtube/v3/search";
  let channels = [];
  let nextPageToken = "";
  let fetchedResults = 0;

  try {
    while (fetchedResults < maxResults) {
      // 1. YouTube Search API çağrısı
      const response = await fetch(
        `${BASE_URL}?part=snippet&type=channel&q=${query}&regionCode=${region}&maxResults=${maxResults}&pageToken=${nextPageToken}&key=${API_KEY}`
      );
      const data = await response.json();
      console.log("Data:",data)
      if (!data.items) break;

      // 2. Kanal ID'lerini toplu alalım
      const channelIds = data.items.map((item) => item.id.channelId).join(",");

      // 3. Tek seferde kanal detaylarını çekelim
      const detailsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelIds}&key=${API_KEY}`
      );
      const detailsData = await detailsResponse.json();
      if (!detailsData.items) break;

      // 4. Filtreleme
      for (const details of detailsData.items) {
        const stats = details.statistics;
        const subscriberCount = parseInt(stats.subscriberCount || "0", 10);
        const viewCount = parseInt(stats.viewCount || "0", 10);
        const publishedAt = new Date(details.snippet.publishedAt);
        const daysSinceCreated = (new Date() - publishedAt) / (1000 * 60 * 60 * 24);

        if (
          subscriberCount >= minSubscribers &&
          subscriberCount <= maxSubscribers &&
          viewCount >= minViews &&
          viewCount <= maxViews &&
          daysSinceCreated <= daysAgo
        ) {
          channels.push({
            id: details.id,
            snippet: details.snippet,
            statistics: stats,
          });
          fetchedResults++;
        }
      }

      if (!data.nextPageToken || fetchedResults >= maxResults) break;
      nextPageToken = data.nextPageToken;
    }
    console.log("Filtered channels:",channels)

    return NextResponse.json({ channels });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to fetch YouTube channels" }, { status: 500 });
  }
}
