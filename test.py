from google import genai

client = genai.Client(api_key="MY_GOOGLE_API_KEY")

response = client.models.generate_content(
    model="gemini-2.5-flash", contents="지금 뭐하는데?"
)
print(response.text)