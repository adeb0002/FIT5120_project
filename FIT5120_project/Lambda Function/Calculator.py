import pymysql
import json

# Connect setting for RDS
rds_host = "ecodb.cvae0yy0esj4.ap-southeast-2.rds.amazonaws.com"
username = "admin"
password = "FIT5120FIT5120"
db_name = "ecodb"

# Mapping of user input to database table names and column names
input_to_db_mapping = {
    "appliances": {
        "television": {"table": "tv", "column": "energy_consumption"},
        "dishwasher": {"table": "dishwasher", "column": "energy_consumption"},
        # Update for clothes_washer to handle two columns
        "clothes_washer": {
            "table": "new_clothes_washer",
            "columns": ["Hot Wat Cons", "Cold Wat Cons"]  # Include both columns for hot and cold water consumption
        },
        "clothes_dryer": {"table": "new_clothes_dryer", "column": "energy_consumption"},
        "air_conditioner": {"table": "new_air_conditioner", "column": "C-Power_Inp_Rated"},
        "refrigerator": {"table": "new_freezer", "column": "energy_consumption"},
        "pool_pump": {"table": "pool_pump", "column": "Nameplate Input Power"},
    },
    "gas": {
        "instantaneous": {"table": "hot_water_heater_gas", "column": "energy_consumption", "type": "Instantaneous"},
        "storage": {"table": "hot_water_heater_gas", "column": "energy_consumption", "type": "Storage"},
    },
    "transport": {
        "bus": {"table": "carbon-footprint-travel-mode", "column": "Transport emissions per kilometer travelled", "entity": "Bus (average)"},
        "train": {"table": "carbon-footprint-travel-mode", "column": "Transport emissions per kilometer travelled", "entity": "National rail"},
        "tram": {"table": "carbon-footprint-travel-mode", "column": "Transport emissions per kilometer travelled", "entity": "Tram"},
        "private_vehicle": {"table": "carbon-footprint-travel-mode", "column": "Transport emissions per kilometer travelled", "entity": "Petrol car"}
    }
}

def process_single_request(body):
    request_type = body.get('type')

    # Route the request to the appropriate handler based on the type
    if request_type == 'personal':  
        return handle_personal_request(body)
    elif request_type == 'solar':
        return handle_solar_request(body)
    elif request_type == 'appliance':
        return handle_appliance_request(body)
    elif request_type == 'gas':
        return handle_gas_request(body)
    elif request_type == 'transportation':
        return handle_transportation_request(body)
    elif request_type == 'total':
        return calculate_total_emissions(body)  # New route for total calculation
    else:
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps('Invalid request type.')
        }


def lambda_handler(event, context):
    # Debugging: Print the raw event received
    print(f"Received event: {json.dumps(event)}")

    # Extract and parse the body from the event
    body = event.get('body')
    if body:
        try:
            body = json.loads(body)
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {e}")
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                'body': json.dumps('Invalid JSON format in body.')
            }

    # Check if body is a list and handle each item accordingly
    if isinstance(body, list):
        results = []
        for item in body:
            result = process_single_request(item)  # Process each individual request
            results.append(result)
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps(results)
        }
    elif isinstance(body, dict):
        # If body is a single dict, process it normally
        return process_single_request(body)
    else:
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps('Invalid request format.')
        }


def handle_appliance_request(body):
    appliance_type = body.get('appliance_type')
    hours = float(body.get('hours', 0))
    usage = 0

    mapping = input_to_db_mapping["appliances"].get(appliance_type)
    if not mapping:
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps('Invalid appliance type.')
        }

    try:
        conn = pymysql.connect(host=rds_host, user=username, passwd=password, db=db_name, connect_timeout=5)
        with conn.cursor() as cur:
            # Special handling for clothes washer to calculate the average of hot and cold water consumption
            if appliance_type == "clothes_washer":
                query = f"SELECT AVG(`{mapping['columns'][0]}`), AVG(`{mapping['columns'][1]}`) FROM `{mapping['table']}`"
                cur.execute(query)
                result = cur.fetchone()

                if result:
                    avg_hot_water_cons = float(result[0])
                    avg_cold_water_cons = float(result[1])
                    avg_energy_consumption = (avg_hot_water_cons + avg_cold_water_cons) / 2

                    # Calculate the usage emissions for clothes washer
                    usage = hours * avg_energy_consumption / 365
                else:
                    return {
                        'statusCode': 404,
                        'headers': {
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST',
                            'Access-Control-Allow-Headers': 'Content-Type'
                        },
                        'body': json.dumps('Clothes washer data not found in the database.')
                    }
            else:
                # General query for other appliances
                query = f"SELECT {mapping['column']} FROM {mapping['table']}"
                cur.execute(query)
                result = cur.fetchone()

                if result:
                    avg_energy_consumption = float(result[0])

                    # Calculate emissions based on appliance type
                    if appliance_type == "television":
                        usage = hours * avg_energy_consumption / 3650
                    elif appliance_type == "dishwasher":
                        usage = hours * avg_energy_consumption / 365
                    elif appliance_type == "clothes_dryer":
                        usage = hours * avg_energy_consumption / 52
                    elif appliance_type == "air_conditioner":
                        winter_hours = float(body.get('winter_hours', 0))
                        summer_hours = float(body.get('summer_hours', 0))
                        winter_emissions = winter_hours * avg_energy_consumption / 365
                        summer_emissions = summer_hours * avg_energy_consumption / 365
                        usage = (winter_emissions + summer_emissions) / 2 * 7
                    elif appliance_type == "refrigerator":
                        usage = avg_energy_consumption / 52
                else:
                    return {
                        'statusCode': 404,
                        'headers': {
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST',
                            'Access-Control-Allow-Headers': 'Content-Type'
                        },
                        'body': json.dumps('Appliance data not found in the database.')
                    }

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps({'appliance_emissions': usage})
        }

    except pymysql.MySQLError as e:
        print(f"Database error: {e}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps('Database query failed.')
        }
    finally:
        if conn:
            conn.close()

def handle_gas_request(body):
    heater_type = body.get('heater_type')

    # Handle the 'none' case
    if heater_type == 'none':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps({'gas_emissions': 0})  # Return 0 emissions for 'none' type
        }

    mapping = input_to_db_mapping["gas"].get(heater_type)

    if not mapping:
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps('Invalid gas heater type.')
        }

    try:
        conn = pymysql.connect(host=rds_host, user=username, passwd=password, db=db_name, connect_timeout=5)
        with conn.cursor() as cur:
            # Query to get average energy consumption based on the heater type (instantaneous or storage)
            query = f"SELECT AVG(`{mapping['column']}`) FROM `{mapping['table']}` WHERE `Water Heater Type` = %s"
            cur.execute(query, (mapping['type'],))
            result = cur.fetchone()

            if result and result[0]:
                avg_energy_consumption = float(result[0])
                gas_emissions = avg_energy_consumption / 52  # Average usage per week

                return {
                    'statusCode': 200,
                    'headers': {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    'body': json.dumps({'gas_emissions': gas_emissions})
                }
            else:
                return {
                    'statusCode': 404,
                    'headers': {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    'body': json.dumps('Gas heater data not found in the database.')
                }

    except pymysql.MySQLError as e:
        print(f"Database error: {e}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps('Database query failed.')
        }
    finally:
        if conn:
            conn.close()

def handle_solar_request(body):
    solar_panels = body.get('solar_panels', 'no').lower() == 'yes'
    grid_dependence = float(body.get('grid_dependence', 100)) / 100  # Convert percentage to fraction

    if solar_panels:
        total_emissions = calculate_total_emissions() * grid_dependence
    else:
        total_emissions = calculate_total_emissions()

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        'body': json.dumps({
            'total_emissions': total_emissions,
            'solar_panels': solar_panels,
            'grid_dependence': grid_dependence
        })
    }

def handle_transportation_request(body):
    transport_type = body.get('transport_type')
    mapping = input_to_db_mapping["transport"].get(transport_type)

    if not mapping:
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps('Invalid transportation type.')
        }

    try:
        conn = pymysql.connect(host=rds_host, user=username, passwd=password, db=db_name, connect_timeout=5)
        with conn.cursor() as cur:
            query = f"SELECT `{mapping['column']}` FROM `{mapping['table']}` WHERE Entity = %s"
            cur.execute(query, (mapping['entity'],))
            result = cur.fetchone()

            if result:
                emission_per_km = float(result[0])
                kms = float(body.get('kms', 0))
                transport_emissions = kms * emission_per_km

                return {
                    'statusCode': 200,
                    'headers': {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    'body': json.dumps({'transport_emissions': transport_emissions})
                }
            else:
                return {
                    'statusCode': 404,
                    'headers': {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    'body': json.dumps('Transportation data not found in the database.')
                }

    except pymysql.MySQLError as e:
        print(f"Database error: {e}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps('Database query failed.')
        }
    finally:
        if conn:
            conn.close()

def calculate_total_emissions(body):
    try:
        household_size = int(body.get('household_size', '1'))
        appliance_emissions = float(body.get('appliance_emissions', 0))
        solar_emissions = float(body.get('solar_emissions', 0))
        gas_emissions = float(body.get('gas_emissions', 0))
        transport_emissions = float(body.get('transport_emissions', 0))

        # Calculate the total emissions
        total_emissions = ((appliance_emissions * solar_emissions) + gas_emissions) / household_size + transport_emissions

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps({'total_emissions': total_emissions})
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps({
                'error': 'Internal Server Error',
                'message': str(e)
            })
        }
