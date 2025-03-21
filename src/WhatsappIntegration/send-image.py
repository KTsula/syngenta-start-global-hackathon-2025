import requests

def send_whatsapp_image(phone_number, image_url, caption=""):
    """
    Send a WhatsApp image message to the specified phone number
    
    Parameters:
    - phone_number: The recipient's phone number in international format
    - image_url: URL of the image to send (must be publicly accessible)
    - caption: Optional caption for the image
    """
    # WhatsApp Business API credentials
    whatsapp_token = "EAAI8WipvEuUBO2tCPVl6iBoy8Q2n0GFd3BjhF9ZC2o8eVLSi77DPsmjUjFILZCdGZCk3gfZAVpjo43HwG6l1N6eaakVSKLW0AH3bvXxsLKv7sZC8IOsknh5cpUttEv6CCqAH0KT23dK1suDmRLh0uAVNdPnb3tmoUVCEs9JodhWjblUUY4BIaY40CzWdxL5LUa6zxlZCEq5iHFXKZCWgZC5kZBvoU6YhGNAZDZD"
    phone_number_id = "596553016876061"  # Phone number ID from screenshot
    
    url = f"https://graph.facebook.com/v18.0/{phone_number_id}/messages"
    
    headers = {
        "Authorization": f"Bearer {whatsapp_token}",
        "Content-Type": "application/json"
    }
    
    data = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": phone_number,
        "type": "image",
        "image": {
            "link": image_url,
            "caption": caption
        }
    }
    
    response = requests.post(url, headers=headers, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.json()

if __name__ == "__main__":
    # Replace this with the phone number you want to message
    recipient_phone = "+33788836775"  # Use the phone number from your successful test
    
    # Example image URL - make sure this is publicly accessible
    image_url = "https://i.imgur.com/TiFOUjI.png"  # Example: Groot image from Imgur
    
    # Optional caption
    caption = "I am Groot!"
    
    send_whatsapp_image(recipient_phone, image_url, caption)