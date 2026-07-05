from huggingface_hub import InferenceClient

from app.config.settings import settings

client = InferenceClient(
    api_key=settings.HF_TOKEN,
)

response = client.chat.completions.create(
    model=settings.HF_MODEL,
    messages=[
        {
            "role": "user",
            "content": "Hello! Reply in one sentence."
        }
    ],
)

print(response.choices[0].message.content)