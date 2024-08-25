import pymysql
import json

# Connect setting for RDS
rds_host = "ecodb.cvae0yy0esj4.ap-southeast-2.rds.amazonaws.com"
username = "admin"
password = "FIT5120FIT5120"
db_name = "ecodb"

def lambda_handler(event, context):
    # Get user input from the frontend
    appliance_type = event.get('appliance_type')
    brand = event.get('brand')
    model = event.get('model')
    usage_days = event.get('usage_days', 1)  # Number of usage days, default is 1

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

    if not table_name or not column_name:
        return {
            'statusCode': 400,
            'body': json.dumps('Invalid appliance type or missing energy consumption column.')
        }

    # Connect to the RDS database
    conn = pymysql.connect(host=rds_host, user=username, passwd=password, db=db_name, connect_timeout=5)

    try:
        with conn.cursor() as cur:
            # Query the energy consumption data for the specified appliance
            cur.execute(f"""
                SELECT {column_name} 
                FROM {table_name} 
                WHERE Brand = %s AND Model = %s
                """, (brand, model))
            result = cur.fetchone()

            if result:
                energy_consumption_value = result[0]

                # Calculate daily energy consumption and total energy consumption
                energy_consumption_per_day = energy_consumption_value / 365
                total_energy_consumption = energy_consumption_per_day * usage_days
                co2_emissions = total_energy_consumption * 0.233  # Example conversion factor (kg CO2/kWh)

                return {
                    'statusCode': 200,
                    'body': json.dumps({
                        'total_energy_consumption': total_energy_consumption,
                        'co2_emissions': co2_emissions
                    })
                }
            else:
                return {
                    'statusCode': 404,
                    'body': json.dumps('Appliance not found in the database.')
                }
    finally:
        conn.close()
