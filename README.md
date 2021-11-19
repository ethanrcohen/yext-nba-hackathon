# yext-nba-hackathon

Unfortunately this API is being super flaky, with requests very frequently returning status 200 but with HTML saying that they were unable to process the request. This doesn't appear to be an IP-based rate limit, as it occurs at the same time when running locally and via connectors, nor is there an API key that would associate the two machines' requests.
