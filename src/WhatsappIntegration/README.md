# WhatsApp Agricultural Advisory Bot 🌾

A WhatsApp bot that provides personalized agricultural advice to Indian rice farmers using weather-based predictions and Syngenta's biological portfolio.

## Features 🌟

- User registration with field location tracking
- Automated farm analysis based on stress values:
  - Yield risk assessment
  - Drought index monitoring
  - Daytime heat stress analysis
  - Nighttime heat stress analysis
- Personalized Syngenta biological product recommendations
- WhatsApp-friendly communication with emojis
- Field image visualization
- Real-time agricultural advice

## Prerequisites 📋

1. Python 3.7+
2. Meta WhatsApp Business API credentials
3. OpenAI API key
4. Supabase account and credentials
5. Ngrok (for local development)

## Environment Variables 🔑

Create a `.env` file in the root directory with the following:

```env
# OpenAI API Key
OPENAI_API_KEY='your_openai_api_key'

# WhatsApp API credentials
WHATSAPP_TOKEN='your_whatsapp_token'
PHONE_NUMBER_ID='your_phone_number_id'

# Supabase credentials
NEXT_PUBLIC_SUPABASE_URL='your_supabase_url'
NEXT_PUBLIC_SUPABASE_ANON_KEY='your_supabase_key'

# Server Config
PORT=5000
```

## Installation 🛠️

1. Clone the repository:
```bash
git clone <repository-url>
cd whatsapp-agricultural-bot
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up your database:
   - Create a new Supabase project
   - Create a 'Users' table with columns:
     - id (phone number)
     - Name
     - Latitude
     - Longitude
     - Field_ID

## Usage 🚀

1. Start the server:
```bash
python simple-whatsapp-bot.py
```

2. Use ngrok to expose your local server:
```bash
ngrok http 5000
```

3. Configure your WhatsApp webhook URL in the Meta Developer Console using the ngrok URL.

## User Flow 👤

1. New User Registration:
   - User sends first message
   - Bot requests name and field coordinates
   - User provides information
   - Bot confirms registration and shows field image

2. Regular Usage:
   - User can request farm analysis using keywords like "analyze", "check", or "advice"
   - Bot provides personalized recommendations based on field conditions
   - Users receive WhatsApp-friendly responses with emojis

## File Structure 📁

```
├── simple-whatsapp-bot.py    # Main application file
├── requirements.txt          # Python dependencies
├── .env                      # Environment variables
├── latlong_fieldid.csv      # Field ID mapping data
└── README.md                # Documentation
```

## API Integration 🔌

The bot integrates with multiple APIs:
- Meta WhatsApp Business API for messaging
- OpenAI API for natural language processing
- Supabase for user data storage

## Error Handling ⚠️

The bot includes comprehensive error handling for:
- Message processing
- User registration
- API communications
- Data parsing
- Database operations

## Contributing 🤝

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License 📄

[MIT License](LICENSE)

## Support 💬

For support, please open an issue in the repository or contact the development team. 