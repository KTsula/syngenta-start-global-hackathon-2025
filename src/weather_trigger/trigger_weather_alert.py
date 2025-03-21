import os
import time
import requests
from dotenv import load_dotenv
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from webdriver_manager.chrome import ChromeDriverManager
from twilio.rest import Client
from supabase import create_client, Client

load_dotenv()

# ------------------------- CONFIG -------------------------
# 🟢 Twilio Credentials
ACCOUNT_SID = "AC945aceb03b288eef2af679b46a185c64"
AUTH_TOKEN = "a56cf66afa06cbfae088816350fdef57"
WHATSAPP_NUMBER = "whatsapp:+14155238886"  # Twilio Sandbox Number

# 🟢 Supabase Credentials, inside environment to run
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)

# ------------------------- OFFICIAL DISTRICT LIST ------------------------- to ensure district and scrape matches
IMD_DISTRICTS = [
    # Andaman and Nicobar Islands
    "NICOBARS", "NORTH AND MIDDLE ANDAMAN", "SOUTH ANDAMANS",
    # Andhra Pradesh
    "ANANTAPUR", "CHITTOOR", "EAST GODAVARI", "GUNTUR", "KRISHNA", "KURNOOL",
    "PRAKASAM", "SPSR NELLORE", "SRIKAKULAM", "VISAKHAPATNAM", "VIZIANAGARAM",
    "WEST GODAVARI", "Y.S.R.",
    # Arunachal Pradesh
    "ANJAW", "CHANGLANG", "DIBANG VALLEY", "EAST KAMENG", "EAST SIANG",
    "KRA DAADI", "KURUNG KUMEY", "LEPARADA", "LOHIT", "LONGDING", "LOWER DIBANG VALLEY",
    "LOWER SIANG", "LOWER SUBANSIRI", "NAMSAI", "PAKKE KESSANG", "PAPUM PARE",
    "SHI YOMI", "SIANG", "TAWANG", "TIRAP", "UPPER SIANG", "UPPER SUBANSIRI",
    "WEST KAMENG", "WEST SIANG",
    # Assam
    "BAKSA", "BARPETA", "BISWANATH", "BONGAIGAON", "CACHAR", "CHARAIDEO",
    "CHIRANG", "DARRANG", "DHEMAJI", "DHUBRI", "DIBRUGARH", "GOALPARA",
    "GOLAGHAT", "HAILAKANDI", "HOJAI", "JORHAT", "KAMRUP", "KAMRUP METROPOLITAN",
    "KARBI ANGLONG", "KARIMGANJ", "KOKRAJHAR", "LAKHIMPUR", "MAJULI", "MORIGAON",
    "NAGAON", "NALBARI", "SOUTH SALMARA-MANKACHAR", "SIVASAGAR", "SONITPUR",
    "TINSUKIA", "UDALGURI", "WEST KARBI ANGLONG",
    # Bihar
    "ARARIA", "ARWAL", "AURANGABAD", "BANKA", "BEGUSARAI", "BHAGALPUR",
    "BHOJPUR", "BUXAR", "DARBHANGA", "EAST CHAMPARAN", "GAYA", "GOPALGANJ",
    "JAMUI", "JEHANABAD", "KAIMUR", "KATIHAR", "KHAGARIA", "KISHANGANJ",
    "LAKHISARAI", "MADHEPURA", "MADHUBANI", "MUNGER", "MUZAFFARPUR", "NALANDA",
    "NAWADA", "PATNA", "PURNIA", "ROHTAS", "SAHARSA", "SAMASTIPUR", "SARAN",
    "SHEIKHPURA", "SHEOHAR", "SITAMARHI", "SIWAN", "SUPAUL", "VAISHALI",
    "WEST CHAMPARAN",
    # Chandigarh
    "CHANDIGARH",
    # Chhattisgarh
    "BALOD", "BALODA BAZAR", "BALRAMPUR", "BASTAR", "BEMETARA", "BIJAPUR",
    "BILASPUR", "DANTEWADA", "DHAMTARI", "DURG", "GARIYABAND", "GAURELA-PENDRA-MARWAHI",
    "JANJGIR-CHAMPA", "JASHPUR", "KABIRDHAM", "KANKER", "KONDAGAON", "KORBA",
    "KORIYA", "MAHASAMUND", "MUNGELI", "NARAYANPUR", "RAIGARH", "RAIPUR",
    "RAJNANDGAON", "SUKMA", "SURAJPUR", "SURGUJA",
    # Dadra and Nagar Haveli and Daman and Diu
    "DADRA AND NAGAR HAVELI", "DAMAN", "DIU",
    # Delhi
    "CENTRAL DELHI", "EAST DELHI", "NEW DELHI", "NORTH DELHI", "NORTH EAST DELHI",
    "NORTH WEST DELHI", "SHAHDARA", "SOUTH DELHI", "SOUTH EAST DELHI",
    "SOUTH WEST DELHI", "WEST DELHI",
    # Goa
    "NORTH GOA", "SOUTH GOA","KOLKATA",
    # Gujarat
    "AHMEDABAD", "AMRELI", "ANAND", "ARAVALLI", "BANASKANTHA", "BHARUCH",
    "BHAVNAGAR", "BOTAD", "CHHOTAUDEPUR", "DAHOD", "DANG", "DEVBHOOMI DWARKA",
    "GANDHINAGAR", "GIR SOMNATH", "JAMNAGAR", "JUNAGADH", "KACHCHH", "KHEDA",
    "MAHISAGAR", "MEHSANA", "MORBI", "NARMADA", "NAVSARI", "PANCHMAHAL",
    "PATAN", "PORBANDAR", "RAJKOT", "SABARKANTHA", "SURAT", "SURENDRANAGAR",
    "TAPI", "VADODARA", "VALSAD",
    # Haryana
    "AMBALA", "BHIWANI", "CHARKHI DADRI", "FARIDABAD", "FATEHABAD", "GURUGRAM",
    "HISAR", "JHAJJAR", "JIND", "KAITHAL", "KARNAL", "KURUKSHETRA", "MAHENDRAGARH",
    "MEWAT", "PALWAL", "PANCHKULA", "PANIPAT", "REWARI", "ROHTAK", "SIRSA",
    "SONIPAT", "YAMUNANAGAR",
    # Himachal Pradesh
    "BILASPUR", "CHAMBA", "HAMIRPUR", "KANGRA", "KINNAUR", "KULLU", "LAHAUL AND SPITI",
    "MANDI", "SHIMLA", "SIRMOUR", "SOLAN", "UNA",
    # Jammu and Kashmir
    "ANANTNAG", "BANDIPORA", "BARAMULLA", "BUDGAM", "DODA", "GANDERBAL", "JAMMU",
    "KATHUA", "KISHTWAR", "KULGAM", "KUPWARA", "POONCH", "PULWAMA",
    "RAJOURI", "RAMBAN", "REASI", "SAMBA", "SHOPIAN", "SRINAGAR",
    "UDHAMPUR",
    # Jharkhand
    "BOKARO", "CHATRA", "DEOGHAR", "DHANBAD", "DUMKA", "EAST SINGHBHUM",
    "GARHWA", "GIRIDIH", "GODDA", "GUMLA", "HAZARIBAGH", "JAMTARA",
    "KHUNTI", "KODERMA", "LATEHAR", "LOHARDAGA", "PAKUR", "PALAMU",
    "RAMGARH", "RANCHI", "SAHEBGANJ", "SARAIKELA KHARSAWAN", "SIMDEGA",
    "WEST SINGHBHUM",
    # Karnataka
    "BAGALKOT", "BALLARI", "BELAGAVI", "BENGALURU RURAL", "BENGALURU URBAN",
    "BIDAR", "CHAMARAJANAGAR", "CHIKBALLAPUR", "CHIKKAMAGALURU", "CHITRADURGA",
    "DAKSHINA KANNADA", "DAVANGERE", "DHARWAD", "GADAG", "HASSAN", "HAVERI",
    "KALABURAGI", "KODAGU", "KOLAR", "KOPPAL", "MANDYA", "MYSURU", "RAICHUR",
    "RAMANAGARA", "SHIVAMOGGA", "TUMAKURU", "UDUPI", "UTTARA KANNADA", "VIJAYAPURA",
    "YADGIR",
    # Kerala
    "ALAPPUZHA", "ERNAKULAM", "IDUKKI", "KANNUR", "KASARAGOD", "KOLLAM",
    "KOTTAYAM", "KOZHIKODE", "MALAPPURAM", "PALAKKAD", "PATHANAMTHITTA",
    "THIRUVANANTHAPURAM", "THRISSUR", "WAYANAD",
    # Ladakh
    "KARGIL", "LEH",
    # Lakshadweep
    "LAKSHADWEEP",
    # Madhya Pradesh
    "AGAR MALWA", "ALIRAJPUR", "ANUPPUR", "ASHOKNAGAR", "BALAGHAT", "BARWANI",
    "BETUL", "BHIND", "BHOPAL", "BURHANPUR", "CHHATARPUR", "CHHINDWARA",
    "DAMOH", "DATIA", "DEWAS", "DHAR", "DINDORI", "GUNA", "GWALIOR",
    "HARDA", "HOSHANGABAD", "INDORE", "JABALPUR", "JHABUA", "KATNI",
    "KHANDWA", "KHARGONE", "MANDLA", "MANDSAUR", "MORENA", "NARSINGHPUR",
    "NEEMUCH", "PANNA", "RAISEN", "RAJGARH", "RATLAM", "REWA", "SAGAR",
    "SATNA", "SEHORE", "SEONI", "SHAHDOL", "SHAJAPUR", "SHEOPUR",
    "SHIVPURI", "SIDHI", "SINGRAULI", "TIKAMGARH", "UJJAIN", "UMARIA",
    "VIDISHA",
    # Maharashtra
    "AHMEDNAGAR", "AKOLA", "AMRAVATI", "AURANGABAD", "BEED", "BHANDARA",
    "BULDHANA", "CHANDRAPUR", "DHULE", "GADCHIROLI", "GONDIA", "HINGOLI",
    "JALGAON", "JALNA", "KOLHAPUR", "LATUR", "MUMBAI CITY", "MUMBAI SUBURBAN",
    "NAGPUR", "NANDED", "NANDURBAR", "NASHIK", "OSMANABAD", "PALGHAR",
    "PARBHANI", "PUNE", "RAIGAD", "RATNAGIRI", "SANGLI", "SATARA",
    "SINDHUDURG", "SOLAPUR", "THANE", "WARDHA", "WASHIM", "YAVATMAL",
    # Manipur
    "BISHNUPUR", "CHANDEL", "CHURACHANDPUR", "IMPHAL EAST", "IMPHAL WEST",
    "JIRIBAM", "KAKCHING", "KAMJONG", "KANGPOKPI", "NONEY", "PHERZAWL",
    "SENAPATI", "TAMENGLONG", "TENGNOUPAL", "THOUBAL", "UKHRUL",
    # Meghalaya
    "EAST GARO HILLS", "EAST JAINTIA HILLS", "EAST KHASI HILLS",
    "NORTH GARO HILLS", "RI BHOI", "SOUTH GARO HILLS", "SOUTH WEST GARO HILLS",
    "SOUTH WEST KHASI HILLS", "WEST GARO HILLS", "WEST JAINTIA HILLS",
    "WEST KHASI HILLS",
    # Mizoram
    "AIZAWL", "CHAMPHAI", "KOLASIB", "LAWNGTLAI", "LUNGLEI",
    "MAMIT", "SAIHA", "SERCHHIP",
    # Nagaland
    "CHUMUKEDIMA", "DIMAPUR", "KIPHIRE", "KOHIMA", "LONGLENG",
    "MOKOKCHUNG", "MON", "NOKLAK", "PEREN", "PHEK", "TUENSANG",
    "WOKHA", "ZUNHEBOTO",
    # Odisha
    "ANGUL", "BALANGIR", "BALASORE", "BARGARH", "BHADRAK", "BOUDH",
    "CUTTACK", "DEOGARH", "DHENKANAL", "GAJAPATI", "GANJAM", "JAGATSINGHPUR",
    "JAJPUR", "JHARSUGUDA", "KALAHANDI", "KANDHAMAL", "KENDRAPARA",
    "KENDUJHAR", "KHORDHA", "KORAPUT", "MALKANGIRI", "MAYURBHANJ",
    "NABARANGPUR", "NAYAGARH", "NUAPADA", "PURI", "RAYAGADA", "SAMBALPUR",
    "SONEPUR", "SUNDARGARH",
    # Puducherry
    "KARAIKAL", "MAHE", "PONDICHERRY", "YANAM",
    # Punjab
    "AMRITSAR", "BARNALA", "BATHINDA", "FARIDKOT", "FATEHGARH SAHIB",
    "FAZILKA", "FIROZEPUR", "GURDASPUR", "HOSHIARPUR", "JALANDHAR",
    "KAPURTHALA", "LUDHIANA", "MANSA", "MOGA", "MUKTSAR", "NAWANSHAHR",
    "PATHANKOT", "PATIALA", "RUPNAGAR", "S.A.S. NAGAR", "SANGRUR",
    "TARN TARAN",
    # Rajasthan
    "AJMER", "ALWAR", "BANSWARA", "BARAN", "BARMER", "BHARATPUR",
    "BHILWARA", "BIKANER", "BUNDI", "CHITTORGARH", "CHURU",
    "DAUSA", "DHOLPUR", "DUNGARPUR", "HANUMANGARH", "JAIPUR",
    "JAISALMER", "JALORE", "JHALAWAR", "JHUNJHUNU", "JODHPUR",
    "KARAULI", "KOTA", "NAGAUR", "PALI", "PRATAPGARH", "RAJSAMAND",
    "SAWAI MADHOPUR", "SIKAR", "SIROHI", "SRI GANGANAGAR", "TONK",
    "UDAIPUR"
]


# -------------------- HELPER FUNCTIONS --------------------
def clean_district_name(district):
    """Standardize the district name by converting to uppercase and removing extra words."""
    if district:
        district = district.upper().strip()
        for suffix in [" DISTRICT", " CITY", " TEHSIL", " MUNICIPALITY"]:
            district = district.replace(suffix, "")
    return district


def find_best_match(district, official_list):
    """Find the closest match using difflib."""
    import difflib
    matches = difflib.get_close_matches(district, official_list, n=1, cutoff=0.8)
    return matches[0] if matches else None



def get_district_from_coords(lat, lon):
    """Fetch district info from Nominatim and try to match with the official list, using fallback mapping."""
    url = f"https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lon}&zoom=10&addressdetails=1"
    headers = {"User-Agent": "debug-farmer-weather-bot"}

    try:
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"\n📍 Full API response for ({lat}, {lon}):")
            print(data)

            possible_fields = ["county", "state_district", "city_district", "city"]
            possible_districts = []
            for field in possible_fields:
                value = data.get("address", {}).get(field)
                if value:
                    possible_districts.append(value)
            print("🔎 Possible district names from API:", possible_districts)

            for district in possible_districts:
                cleaned = clean_district_name(district)
                print(f"    Cleaned: {cleaned}")
                if cleaned in IMD_DISTRICTS:
                    print(f"✅ Exact match found: {cleaned}")
                    return cleaned

            # Use fallback mapping if available
            for district in possible_districts:
                cleaned = clean_district_name(district)

            # Try fuzzy matching if no exact match found
            for district in possible_districts:
                cleaned = clean_district_name(district)
                best_match = find_best_match(cleaned, IMD_DISTRICTS)
                if best_match:
                    print(f"🔄 Fuzzy matching: '{cleaned}' -> '{best_match}'")
                    return best_match

            print("⚠️ No exact match found for these possible names.")
        else:
            print(f"❌ API Error: Status {response.status_code} for ({lat}, {lon})")
    except Exception as e:
        print(f"❌ Exception: {e} for ({lat}, {lon})")

    return None


# -------------------- STEP 1: Load Farmers --------------------
print("🔍 Updating farmer districts from lat/lon...")

farmers_raw = supabase_client.table("Users").select("id", "name", "latitude", "longitude").execute()

farmers_list = []
for farmer in farmers_raw.data:
    lat, lon = farmer.get("latitude"), farmer.get("longitude")
    # Calculate district on the fly without updating DB (since the column was removed)
    district = get_district_from_coords(lat, lon)
    if district:
        farmers_list.append({
            "name": farmer["name"],
            "phone_number": farmer["id"],
            "district": district.upper().strip()
        })
    else:
        print(f"⚠️ No district found for farmer {farmer['name']} at ({lat}, {lon})")

print(f"\n✅ Loaded {len(farmers_list)} farmers with districts.\n")

# -------------------- STEP 2: Scrape IMD Warnings --------------------
print("🌐 Scraping IMD warnings...")

options = webdriver.ChromeOptions()
options.add_argument("--headless")
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

imd_url = "https://mausam.imd.gov.in/responsive/districtWiseWarningGIS.php?day=2"
driver.get(imd_url)
time.sleep(5)

map_elements = driver.find_elements(By.CLASS_NAME, "leaflet-interactive")

for element in map_elements:
    ActionChains(driver).move_to_element(element).click().perform()
    time.sleep(1)

    try:
        popup = driver.find_element(By.CLASS_NAME, "leaflet-popup-content")
        popup_text = popup.text.strip()

        lines = popup_text.split("\n")
        district = lines[0].replace("District Warning: ", "").strip().upper()
        warning_date = lines[1].replace("Date :", "").strip()
        updated_at = lines[3].replace("Updated at:", "").strip()
        warning = "\n".join(lines[2:-1])

        if "No Warning" not in warning:
            print(f"⚠️ ALERT for {district} on {warning_date}:\n{warning}\nUpdated at: {updated_at}\n")

            # Step 3: Send WhatsApp messages for affected farmers in this district
            affected_farmers = [f for f in farmers_list if f["district"] == district]


            # Initialize Twilio client once
            twilio_client = Client(ACCOUNT_SID, AUTH_TOKEN)

            for farmer in affected_farmers:
                name = farmer["name"]
                phone = farmer["phone_number"]
                recipient = f"whatsapp:+{phone}"  # Ensure correct format

                message_body = (
                    f"🚨 Weather Alert 🚨\n"
                    f"👨‍🌾 Hello {name},\n"
                    f"📍 District: {district}\n"
                    f"📅 Date: {warning_date}\n"
                    f"⚠️ Warning: {warning}\n"
                    f"🕒 Updated At: {updated_at}\n"
                    f"Please take precautions. Stay safe! 🌾"
                )

                try:
                    message = twilio_client.messages.create(
                        from_=WHATSAPP_NUMBER,
                        body=message_body,
                        to= recipient
                    )
                    print(f"📩 Sent to {name} ({phone}) | SID: {message.sid}")
                except Exception as e:
                    print(f"❌ Failed to send to {name} ({phone}): {e}")
    except Exception as e:
        print(f"⚠️ No warning or popup found, skipping... ({e})\n")

# -------------------- STEP 4: Clean Up --------------------
driver.quit()
print("\n✅ Script completed successfully.")



