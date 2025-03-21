import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get credentials from environment variables
whatsapp_token = os.environ.get('WHATSAPP_TOKEN')
phone_number_id = os.environ.get('PHONE_NUMBER_ID')

def send_whatsapp_message(phone_number):
    """
    Send a WhatsApp message to the specified phone number
    """
    url = f"https://graph.facebook.com/v22.0/{phone_number_id}/messages"
    
    headers = {
        "Authorization": f"Bearer {whatsapp_token}",
        "Content-Type": "application/json"
    }
    
    data = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": phone_number,
        "type": "text",
        "text": {
            "body": "Hello from Groot's Bot! Send me any message and I will respond."
        }
    }
    
    response = requests.post(url, headers=headers, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

if __name__ == "__main__":
    # Replace this with the phone number you want to message
    recipient_phone = "+33788836775"
    send_whatsapp_message(recipient_phone)