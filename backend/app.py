# This will handle requests from React and call Azure OpenAI.

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from openai import AzureOpenAI

# Telemetry imports
from opencensus.ext.azure.trace_exporter import AzureExporter
from opencensus.ext.flask.flask_middleware import FlaskMiddleware
from opencensus.trace.samplers import ProbabilitySampler

load_dotenv()

endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
api_key = os.getenv("AZURE_OPENAI_KEY")
api_version = os.getenv("AZURE_OPENAI_API_VERSION")
deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT")

# Application Insights connection string (from Azure Portal → Application Insights → Overview)
app_insights_conn_str = os.getenv("APPINSIGHTS_CONNECTION_STRING")

app = Flask(__name__)
CORS(app)

# Attach middleware to automatically track requests
middleware = FlaskMiddleware(
    app,
    exporter=AzureExporter(connection_string=app_insights_conn_str),
    sampler=ProbabilitySampler(1.0),
)

client = AzureOpenAI(
    api_version=api_version,
    azure_endpoint=endpoint,
    api_key=api_key,
)

@app.route("/ask", methods=["POST"])
def ask():
    user_question = request.json.get("question")

    response = client.chat.completions.create(
        model=deployment,
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": user_question}
        ],
        max_completion_tokens=1024,
        temperature=0.7
    )

    answer = response.choices[0].message.content
    return jsonify({"answer": answer})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
