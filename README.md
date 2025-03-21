# Syngenta Start Global Hackathon 2025

## Competition Overview

This project was developed during the Syngenta Start Global Hackathon 2025, a competition focused on developing innovative solutions for sustainable agriculture. The hackathon brought together teams to create solutions that address key challenges in modern farming, with a particular focus on:

- Climate-smart agriculture
- Digital farming solutions
- Sustainable crop protection
- Data-driven decision making

Our team developed an integrated agricultural risk management system that combines weather monitoring, satellite imagery analysis, and predictive forecasting to help farmers make better decisions.

## Project Overview

This repository contains a comprehensive agricultural risk management system with the following components:

### 1. Weather Trigger System (`src/weather_trigger/`)

- Real-time weather monitoring and alerting
- Customizable trigger conditions for various weather parameters
- Multi-level alert system with warning and critical thresholds
- Historical analysis and pattern detection
- [Detailed Documentation](src/weather_trigger/README.md)

### 2. Satellite Imagery Analysis (`src/satellite/`)

- Integration with Sentinel Hub API for satellite data
- Vegetation index calculation (NDVI, EVI, NDRE, LAI)
- Field boundary analysis and monitoring
- Interactive field maps and visualizations
- [Detailed Documentation](src/satellite/README.md)

### 3. Agricultural Risk Forecasting (`src/forecast/`)

- Machine learning-based risk prediction
- Multiple risk indicators (yield risk, drought index, heat stress)
- Advanced feature engineering pipeline
- Rolling window cross-validation
- [Detailed Documentation](src/forecast/README.md)

### 4. Frontend Application (`frontend/`)

- Modern, responsive web interface
- Interactive dashboards
- Real-time data visualization
- Mobile-friendly design
- [Detailed Documentation](frontend/README.md)

## Project Structure

```
syngenta-start-global-hackathon-2025/
├── src/
│   ├── weather_trigger/    # Weather monitoring and alerts
│   ├── satellite/         # Satellite imagery analysis
│   ├── forecast/          # Risk prediction system
│   └── common/           # Shared utilities and configurations
├── frontend/             # Frontend application
├── api/                  # API documentation and examples
├── Model card/          # Algorithm specifications
├── Product card/        # Product documentation
├── UI resources/        # UI style guides and assets
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.11.8
- Conda (recommended) or pip
- Git

### Environment Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/syngenta-start-global-hackathon-2025.git
cd syngenta-start-global-hackathon-2025
```

2. Create and activate conda environment:

```bash
# Create conda environment with Python 3.11.8
conda create -n syngenta-hack python=3.11.8

# Activate the environment
conda activate syngenta-hack

# Install dependencies from requirements.txt
pip install -r requirements.txt
```

Alternatively, if you prefer using pip directly:

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

3. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your credentials
```

4. Run the application:

```bash
python src/main.py
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Sentinel Hub API Credentials
INSTANCEID='your-instance-id'
CLIENTID='your-client-id'
CLIENTSECRET='your-client-secret'

# Data Paths
CROPS_PATH='path/to/crops.json'
METER_BLUE_DATA_PATH='path/to/dataexport.csv'
METER_BLUE_STATIC_PATH='path/to/datastatic.csv'
IN_GOV_DATA_PATH='path/to/AVERAGE_YIELD_OF_PRINCIPAL_CROPS.xls'
```

### Obtaining API Credentials

1. Sign up for a Sentinel Hub account at [https://www.sentinel-hub.com/](https://www.sentinel-hub.com/)
2. Create a new OAuth client in your account settings
3. Copy the Instance ID, Client ID, and Client Secret to your `.env` file

### Data Files

- `CROPS_PATH`: Path to the crops configuration JSON file
- `METER_BLUE_DATA_PATH`: Path to the Meter Blue data export CSV
- `METER_BLUE_STATIC_PATH`: Path to the Meter Blue static data CSV
- `IN_GOV_DATA_PATH`: Path to the government data Excel file

## Documentation

Each component has its own detailed documentation in its respective directory. The main documentation sections are:

- **API Documentation**: `api/` directory
- **Model Specifications**: `Model card/` directory
- **Product Information**: `Product card/` directory
- **UI Guidelines**: `UI resources/` directory

## Resources

### CE Hub Resources

The following resources are provided by CE Hub:

- **`api/`**: Contains documents such as help documentation, video tutorials, and Postman collections with specifications on how to use CE Hub's API with examples of requests.
- **`Model card/`**: Contains documentation with specifications on various weather-based algorithms.
- **`Product card/`**: Contains documentation with specifications on various products offered by Syngenta.
- **`UI resources/`**: Contains documentation with specifications on branding and styles of Syngenta.

## Dependencies

The project requires Python 3.11.8 and several Python packages. See `requirements.txt` for a complete list of dependencies. Key dependencies include:

- pandas
- numpy
- scikit-learn
- xgboost
- lightgbm
- sentinelhub
- geopandas
- folium
- matplotlib
- requests
- pydantic
- geopy

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Syngenta for hosting the hackathon
- All team members who contributed to this project
- The open-source community for the tools and libraries used

## Authors

Our team consisted of:

- **Keti Sulamanidze** - IE University
- **Armand Hubler** - IE University
- **Jackson Ly** - Frankfurt School
- **Allan Stalker** - IE University
