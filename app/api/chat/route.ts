import requests
import json

response = requests.post(
  url="https://openrouter.ai/api/v1/chat/completions",
  headers={
    "Authorization": "Bearer <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>",
    "Content-Type": "application/json",
    "HTTP-Referer": "<YOUR_SITE_URL>", # Optional. Site URL for rankings on openrouter.ai.
    "X-Title": "<YOUR_SITE_NAME>", # Optional. Site title for rankings on openrouter.ai.
  },
  data=json.dumps({
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [
      {
        "role": "user",
        "content": "What is the meaning of life?"
      }
    ],
