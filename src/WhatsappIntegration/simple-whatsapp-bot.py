from flask import Flask, request, jsonify
import requests
import os
from dotenv import load_dotenv
import openai
from supabase import create_client, Client
import json
import csv
import pandas as pd
import time

# Load environment variables
load_dotenv()

app = Flask(__name__)

# WhatsApp Business API credentials
WHATSAPP_TOKEN = os.environ.get('WHATSAPP_TOKEN')
PHONE_NUMBER_ID = os.environ.get('PHONE_NUMBER_ID')
VERIFY_TOKEN = "groot_verify_token"  # Create any string as your verify token

# OpenAI configuration
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
openai.api_key = OPENAI_API_KEY

# Supabase configuration
SUPABASE_URL = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.environ.get('NEXT_PUBLIC_SUPABASE_ANON_KEY')
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# User registration state tracking - Store in memory for now
# In production, this should be persisted in a database
user_registration_state = {}

# Message tracking to prevent duplicate processing
processed_messages = set()

def get_field_id(latitude, longitude):
    """
    Get the field ID based on latitude and longitude
    Returns: field ID if found, None otherwise
    """
    try:
        # Load the CSV file into a DataFrame
        csv_file = 'latlong_fieldid.csv'
        df = pd.read_csv(csv_file)
        
        for index, row in df.iterrows():
            # Convert latitude and longitude to strings and compare the first 5 characters
            lat_str = str(row['latitude'])[:5]
            long_str = str(row['longitude'])[:5]
            input_lat_str = str(latitude)[:5]
            input_long_str = str(longitude)[:5]
            
            if lat_str == input_lat_str and long_str == input_long_str:
                print(f"Match found for {latitude}, {longitude} -> {row['field_id']}")
                return row['field_id']
        
        print(f"No field ID match found for {latitude}, {longitude}")
        return "unknown_field"  # Default if no match found
    except Exception as e:
        print(f"Error getting field ID: {e}")
        return "unknown_field"  # Default on error

def check_user_exists(phone_number):
    """
    Check if a user exists in the database
    Returns: user data if exists, None if not
    """
    try:
        # Format phone number to ensure consistency
        # Remove any prefixed 'whatsapp:' if present
        if phone_number.startswith('whatsapp:'):
            phone_number = phone_number[9:]
        
        # Strip the '+' if present
        if phone_number.startswith('+'):
            phone_number = phone_number[1:]
        
        # Search for the user in the database
        response = supabase.table('Users').select('*').eq('id', phone_number).execute()
        
        # If user exists, return their data
        if response.data and len(response.data) > 0:
            print(f"Found existing user: {phone_number}")
            return response.data[0]
        
        # If user doesn't exist, return None
        else:
            print(f"User not found: {phone_number}")
            return None
    
    except Exception as e:
        print(f"Error checking user: {e}")
        return None

def create_user(phone_number, name, latitude, longitude):
    """
    Create a new user in the database
    Returns: True if successful, False otherwise
    """
    try:
        # Format phone number (remove '+' if present)
        if phone_number.startswith('+'):
            phone_number = phone_number[1:]


        field_id = get_field_id(latitude, longitude)

        # Send a message to the user with the field ID
        state_name = field_id.split('_')[0] if '_' in field_id else "unknown"
        send_message(phone_number, f"I see, you are from the state of {state_name}. Please wait while I set up your account...")
        
        # Prepare user data
        user_data = {
            'id': phone_number,
            'Name': name,
            'Latitude': latitude,
            'Longitude': longitude,
            'Field_ID': field_id
        }
        
        # Insert into Users table
        response = supabase.table('Users').insert(user_data).execute()
        
        print(f"User created: {user_data}")
        return True
    
    except Exception as e:
        print(f"Error creating user: {e}")
        return False

def get_ai_response(message_text, is_new_user=False):
    """Get a response from OpenAI's ChatGPT"""
    try:
        # Updated system prompt to provide normal responses, not "I am Groot"
        system_content = """
        You are a helpful farming assistant. Respond naturally to user queries about farming, 
        weather, crops, and related topics. Keep responses concise, friendly, and informative.
        """
        
        if is_new_user:
            system_content = """
            You are a helpful farming assistant welcoming a new user. Be warm, friendly, and 
            encouraging. Keep your response concise but make them feel welcome to use the service.
            """
        
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_content},
                {"role": "user", "content": message_text}
            ],
            max_tokens=150,
            temperature=0.7
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error getting AI response: {e}")
        return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again in a moment."

def parse_user_registration_data(user_response):
    """
    Use OpenAI to parse user registration data from their message
    Returns: Parsed data (name, latitude, longitude) or None if parsing failed
    """
    try:
        system_prompt = """
        You are a data extraction assistant. Extract the following information from the user's message:
        1. User's preferred name
        2. Latitude of their field (a number)
        3. Longitude of their field (a number)
        
        Return ONLY a JSON object with these three fields:
        {"name": "User's name", "latitude": latitude_value, "longitude": longitude_value}
        
        If any information is missing, use null for that field. Do not include any explanation, just return the JSON.
        """
        
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_response}
            ],
            max_tokens=100,
            temperature=0
        )
        
        # Parse the JSON response
        extracted_text = response.choices[0].message.content.strip()
        
        # Sometimes GPT might wrap the JSON in backticks or add explanation
        # Attempt to extract just the JSON portion
        try:
            if '```json' in extracted_text:
                json_str = extracted_text.split('```json')[1].split('```')[0].strip()
            elif '```' in extracted_text:
                json_str = extracted_text.split('```')[1].strip()
            else:
                json_str = extracted_text
                
            parsed_data = json.loads(json_str)
            
            # Validate required fields
            if 'name' not in parsed_data:
                parsed_data['name'] = None
            if 'latitude' not in parsed_data:
                parsed_data['latitude'] = None
            if 'longitude' not in parsed_data:
                parsed_data['longitude'] = None
                
            return parsed_data
        
        except json.JSONDecodeError:
            print(f"Failed to parse JSON from: {extracted_text}")
            return None
            
    except Exception as e:
        print(f"Error parsing registration data: {e}")
        return None

@app.route('/webhook', methods=['GET'])
def verify():
    """Handle the webhook verification from Meta"""
    if request.args.get('hub.mode') == 'subscribe' and request.args.get('hub.challenge'):
        # Make sure the verify token matches
        if request.args.get('hub.verify_token') == VERIFY_TOKEN:
            # Respond with the challenge token from the request
            print("WEBHOOK_VERIFIED")
            return request.args.get('hub.challenge'), 200
        return "Verification token mismatch", 403
    return "Hello world", 200

@app.route('/webhook', methods=['POST'])
def webhook():
    """Handle incoming messages from WhatsApp"""
    # Parse the request body from the POST
    body = request.json
    print(f"Received webhook data: {body}")
    
    # Check if this is an event from a WhatsApp message
    if body.get('object') == 'whatsapp_business_account':
        try:
            for entry in body['entry']:
                # Process each entry
                for change in entry.get('changes', []):
                    # Check if there are any new messages
                    if change.get('field') == 'messages':
                        value = change.get('value', {})
                        
                        for message in value.get('messages', []):
                            # CRITICAL: Check if we've already processed this message
                            message_id = message.get('id')
                            if message_id in processed_messages:
                                print(f"Skipping already processed message: {message_id}")
                                continue
                            
                            # Add this message to our processed set
                            processed_messages.add(message_id)
                            
                            # Limit the size of processed_messages to prevent memory issues
                            if len(processed_messages) > 1000:
                                # Keep only the most recent 500 messages
                                processed_messages.clear()
                                processed_messages.update(list(processed_messages)[-500:])
                            
                            # Get the phone number of the sender
                            sender = message['from']
                            print('Sender: ', sender)
                            
                            # Get the message type
                            message_type = message.get('type', '')
                            
                            # Only process text messages
                            if message_type == 'text':
                                message_text = message['text']['body']
                                print(f"Processing message: '{message_text}' from {sender}")
                                
                                # Check if user exists in database
                                user_data = check_user_exists(sender)
                                
                                # If user exists, handle normally
                                if user_data:
                                    handle_existing_user(sender, message_text, message_type)
                                else:
                                    # Handle new user registration
                                    handle_new_user(sender, message_text)
                            
            return jsonify({"status": "success"}), 200
        except Exception as e:
            print(f"Error processing webhook: {e}")
            return jsonify({"status": "error", "message": str(e)}), 500
    
    return jsonify({"status": "unknown"}), 200

def handle_existing_user(sender, message_text, message_type):
    """Handle messages from existing users"""
    # grab name of the user with id == sender
    user_data = supabase.table('Users').select('Name').eq('id', sender).execute()
    user_name = user_data.data[0]['Name']

    # Only handle farm analysis on explicit request
    if "analyze" in message_text.lower() or "check" in message_text.lower() or "advice" in message_text.lower():
        try:
            # Create the system prompt for the agricultural assistant
            system_prompt = """You are an expert agronomy assistant built to help Indian rice farmers make smart decisions using weather-based predictions. Your job is to analyze forecasted stress values from a JSON input and provide simple, accurate, product recommendations using Syngenta's biological portfolio.

            You MUST:
            - Interpret the JSON input for stress values
            - Map these values to optimal thresholds for rice
            - Recommend Syngenta biological products
            - Provide application timing and dosage
            - Output responses in WhatsApp-friendly tone with emojis
            - Include a short health summary of the farm
            - Only suggest products when values are outside the optimal range
            """

            # Sample JSON data
            farm_data = {
                "id": 0,
                "yield_risk": 15.5,
                "drought_index": 0.85,
                "daytime_heat_stress": 8.2,
                "nighttime_heat_stress": 5.3
            }

            # Get AI response
            response = openai.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Based on this farm data: {json.dumps(farm_data)}\nProvide agricultural advice in a clear, WhatsApp-friendly format."}
                ],
                max_tokens=500,
                temperature=0.7
            )

            
            # Wait a moment before sending analysis
            time.sleep(1)
            
            # Send the AI response to the user
            ai_response = response.choices[0].message.content.strip()
            send_message(sender, ai_response)
        except Exception as e:
            print(f"Error in farm analysis: {e}")
            error_message = "I apologize, but I'm having trouble analyzing your farm data right now. Please try again in a moment."
            send_message(sender, error_message)
    else:
        # For regular messages, just respond normally
        ai_response = get_ai_response(message_text, False)
        send_message(sender, ai_response)

def handle_new_user(sender, message_text):
    """Handle messages from new users, managing registration state"""
    # Check if this user is in the registration process
    if sender in user_registration_state:
        registration_stage = user_registration_state[sender]['stage']
        
        # If the user has provided their registration data
        if registration_stage == 'awaiting_info':
            # Parse the registration data from the message
            parsed_data = parse_user_registration_data(message_text)
            print('---------Parsed data: ', parsed_data)
            
            if parsed_data and parsed_data['name'] and parsed_data['latitude'] is not None and parsed_data['longitude'] is not None:
                # Create the user in the database
                success = create_user(
                    sender, 
                    parsed_data['name'], 
                    float(parsed_data['latitude']), 
                    float(parsed_data['longitude'])
                )
                
                if success:
                    # Send confirmation message
                    welcome_message = f"Welcome, {parsed_data['name']}! Your registration is complete."
                    send_message(sender, welcome_message)

                    # Send field image first
                    send_message(sender, "Here is the latest image of your rice field:")
                    send_image(sender, "https://i.ibb.co/NgDh8zyL/Whats-App-Image-2025-03-21-at-4-30-53-AM.jpg")

                    # Wait a moment before sending additional information
                    time.sleep(1)
                    
                    # Let user know they can request farm analysis
                    instructions = "You can request a farm analysis by sending 'analyze my farm' or simply 'check' at any time."
                    send_message(sender, instructions)
                    
                    # Clean up registration state
                    del user_registration_state[sender]  # Clear the state after successful registration
                else:
                    # Send error message
                    error_message = "There was a problem with your registration. Please try again."
                    send_message(sender, error_message)
            else:
                # If parsing failed or data is incomplete, ask user to provide complete info
                missing_info_message = (
                    "I couldn't understand all your information. Please provide your: "
                    "1. Name, "
                    "2. Latitude of your field (a number), and "
                    "3. Longitude of your field (a number)"
                )
                send_message(sender, missing_info_message)
        
    else:
        # First message from a new user - start registration
        registration_message = (
            "Welcome! I need some information to set up your account. "
            "Please provide your: "
            "1. Name, "
            "2. Latitude of your field, and "
            "3. Longitude of your field"
        )
        send_message(sender, registration_message)
        
        # Set up registration state
        user_registration_state[sender] = {
            'stage': 'awaiting_info'
        }

def send_message(recipient, message_text):
    """Send a text message to a WhatsApp user"""
    url = f"https://graph.facebook.com/v18.0/{PHONE_NUMBER_ID}/messages"
    
    headers = {
        "Authorization": f"Bearer {WHATSAPP_TOKEN}",
        "Content-Type": "application/json"
    }
    
    data = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": recipient,
        "type": "text",
        "text": {
            "body": message_text
        }
    }
    
    response = requests.post(url, headers=headers, json=data)
    print(f"Message sent to {recipient}: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.json()

def send_image(recipient, image_url, caption=""):
    """Send an image message to a WhatsApp user"""
    url = f"https://graph.facebook.com/v18.0/{PHONE_NUMBER_ID}/messages"
    
    headers = {
        "Authorization": f"Bearer {WHATSAPP_TOKEN}",
        "Content-Type": "application/json"
    }
    
    data = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": recipient,
        "type": "image",
        "image": {
            "link": image_url,
            "caption": caption
        }
    }
    
    response = requests.post(url, headers=headers, json=data)
    print(f"Image sent to {recipient}: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.json()

if __name__ == '__main__':
    app.run(debug=True, port=5000)