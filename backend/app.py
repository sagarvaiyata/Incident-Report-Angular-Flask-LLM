from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain.llms import OpenAI
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize the LLM with OpenAI (or other provider)
llm = OpenAI(api_key=os.getenv('OPENAI_API_KEY'), max_tokens = 1500)

# 1. GET call to check LLM connection
@app.route('/check-llm', methods=['GET'])
def check_llm():
    try:
        # Test connection with a dummy prompt
        response = llm("Which AI are you? ")
        return jsonify({"status": "connected", "response": response}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# 2. POST call to query the LLM with text
@app.route('/query-llm', methods=['POST'])
def query_llm():
    data = request.json
    prompt = data.get('prompt')

    if not prompt:
        return jsonify({"error": "Prompt is missing"}), 400

    try:
        # Add specific instruction for concise formatting
        formatted_prompt = f"""
Act as a Professional Report Writer. Your task is to rewrite the incident details in a clear, concise, and grammatically correct 3rd-person report. Do not write anything random or unnecessary, and do not add any information that is not explicitly provided. If I do not provide anything in the incident report section, do not write anything. 
Do not mention the person's name, rather use "writer". Timings must be in HHMM format in 24h hours clock.
Follow the structure of the provided report closely and ensure that your output mirrors the format below. Please rewrite the following incident details into a professional, well-structured incident report:

{prompt}

Example format:

Store Name & Number: [Store Name]  
Store Address: [Store Address]  
Date: [Date]  
Time: [Time]  
Event Type: [Event Type]  
Item Value: $[Total Item Value]  
SKU #: [SKU]  
Police File (Occurrence Number): [Police File]  
Police Officer: [Police Officer]  

Description of Suspect: [Gender, Age, Height, Clothing]  

Incident Report:  

[First Paragraph Must Introduce the writer as given " On December 01, 2024, the writer (Sagar Vaiyata), employed by Blackbird Security, was scheduled to work as a ( Tactical Guard ) from 1200-2000 hours." ]
[Concise, 3rd-person report based on the provided incident details, in a professional tone.]

End of Report.

"""
        response = llm(formatted_prompt)
        return jsonify({"response": response}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
