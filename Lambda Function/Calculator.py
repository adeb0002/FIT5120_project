import pymysql
import json

# Connect setting for RDS
rds_host = "ecodb.cvae0yy0esj4.ap-southeast-2.rds.amazonaws.com"
username = "admin"
password = "FIT5120FIT5120"
db_name = "ecodb"

def lambda_handler(event, context):
    # Debugging: Print the raw event received
    print(f"Received event: {json.dumps(event)}")

    # Extract and parse the body from the event
    body = event.get('body')
    if body:
        # Try to parse the body as JSON
        try:
            body = json.loads(body)
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {e}")
            return {
                'statusCode': 400,
                'body': json.dumps('Invalid JSON format in body.')
            }

    # Get user input from the parsed body
    appliance_type = body.get('appliance_type')
    brand = body.get('brand')
    model = body.get('model')
    usage_days = body.get('usage_days', 1)  # Number of usage days, default is 1
    household_size = body.get('household_size', 1)  # Number of people in the household, default is 1

    # Debugging: Print the inputs received after parsing
    print(f"Received appliance_type: {appliance_type}")
    print(f"Received brand: {brand}")
    print(f"Received model: {model}")
    print(f"Received usage_days: {usage_days}")
    print(f"Received household_size: {household_size}")

    # Define table mapping based on the appliance type
    table_mapping = {
        "air_conditioner": "new_air_conditioner",
        "heater": "new_clothes_dryer",  # Example, adjust as needed
        "dishwasher": "dishwasher",
        "freezer": "new_freezer",
        "tv": "tv",
        "pool_pump": "pool_pump",
        # Add more appliance types and their corresponding tables
    }

    # Define column mapping for energy consumption based on the table
    column_mapping = {
        "new_air_conditioner": "C-Power_Inp_Rated",
        "new_clothes_dryer": "energy_consumption",
        "dishwasher": "energy_consumption",
        "new_freezer": "energy_consumption",
        "tv": "energy_consumption",
        "pool_pump": "Nameplate Input Power",
        # Add more tables and their energy consumption columns
    }

    # Determine the correct table and column name based on appliance type
    table_name = table_mapping.get(appliance_type)
    column_name = column_mapping.get(table_name)

    # Debugging: Print the resolved table and column names
    print(f"Resolved table_name: {table_name}")
    print(f"Resolved column_name: {column_name}")

    if not table_name or not column_name:
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps('Invalid appliance type or missing energy consumption column.')
        }

    # Connect to the RDS database
    conn = pymysql.connect(host=rds_host, user=username, passwd=password, db=db_name, connect_timeout=5)

    try:
        with conn.cursor() as cur:
            # Query the energy consumption data for the specified appliance
            query = f"""
                SELECT {column_name} 
                FROM {table_name} 
                WHERE Brand = %s AND Model = %s
            """
            print(f"Executing query: {query}")  # Debugging: Print the query
            cur.execute(query, (brand, model))
            result = cur.fetchone()

            if result:
                energy_consumption_value = result[0]
                print(f"Found energy_consumption_value: {energy_consumption_value}")  # Debugging: Print the result
            
                # Convert energy_consumption_value to a float or int
                energy_consumption_value = float(energy_consumption_value)
            
                # Calculate daily energy consumption and total energy consumption
                energy_consumption_per_day = energy_consumption_value / 365
                total_energy_consumption = energy_consumption_per_day * usage_days
                co2_emissions = total_energy_consumption * 0.233  # Example conversion factor (kg CO2/kWh)
                
                # Calculate per person consumption
                per_person_energy_consumption = total_energy_consumption / household_size
                per_person_co2_emissions = co2_emissions / household_size
            
                return {
                    'statusCode': 200,
                    'headers': {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    'body': json.dumps({
                        'total_energy_consumption': total_energy_consumption,
                        'co2_emissions': co2_emissions,
                        'per_person_energy_consumption': per_person_energy_consumption,
                        'per_person_co2_emissions': per_person_co2_emissions
                    })
                }

            else:
                print("No result found in the database.")  # Debugging: Print if no result is found
                return {
                    'statusCode': 404,
                    'headers': {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    'body': json.dumps('Appliance not found in the database.')
                }
    finally:
        conn.close()
