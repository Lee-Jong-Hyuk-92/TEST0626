from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai

app = Flask(__name__)
CORS(app)

# 최신 방식: Client 객체 직접 사용
client = genai.Client(api_key="MY_GOOGLE_API_KEY")

@app.route("/chat", methods=["POST"])
def chat():
    try:
        user_message = request.json.get("message", "")
        if not user_message:
            return jsonify({"error": "No message"}), 400

        print(f"📨 사용자 메시지: {user_message}")  # ✅ 추가된 로그 출력

        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=user_message
        )

        print("🔁 Gemini 응답:", response.text)
        return jsonify({"reply": response.text})

    except Exception as e:
        print("❌ 서버 에러:", str(e))
        return jsonify({"error": "Server Error", "detail": str(e)}), 500

if __name__ == "__main__":
    print("✅ Flask 서버 시작 중...")
    app.run(port=5000, debug=True)