
from google import genai

client = genai.Client(api_key="")

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Create a simple financial plan for a divorced mother earning $52,000 with two children."
)

print(response.text)