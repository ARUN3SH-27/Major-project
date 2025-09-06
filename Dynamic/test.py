import requests

BEARER_TOKEN = "twitter token here7"
API_ENDPOINT = "https://api.twitter.com/2/users/by/username/elonmusk"
headers = {"Authorization": f"Bearer {BEARER_TOKEN}"}
params = {"user.fields": "public_metrics,created_at,description,verified"}
response = requests.get(API_ENDPOINT, headers=headers, params=params)
print(response.json())

