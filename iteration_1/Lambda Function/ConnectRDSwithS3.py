import boto3
import pymysql
import csv
import os

# connect setting for RDS and S3
s3 = boto3.client('s3')
rds_host = "ecodb.cvae0yy0esj4.ap-southeast-2.rds.amazonaws.com"
username = "admin"
password = "FIT5120FIT5120"
db_name = "ecodb"

def lambda_handler(event, context):
    # set S3 bucket name and folder prefix
    bucket_name = 'ecoinsight'
    folder_name = 'data/'

    # list all the files in the specified S3 folder
    response = s3.list_objects_v2(Bucket=bucket_name, Prefix=folder_name)
    if 'Contents' in response:
        for obj in response['Contents']:
            file_name = obj['Key']
            
            # Ensure that file_name is not empty and is valid
            if not file_name or file_name.endswith('/'):
                print(f"Skipping invalid or directory key: {file_name}")
                continue  # Skip invalid or directory keys
            
            table_name = file_name.split("/")[-1].split(".")[0]  # Assuming table name is the file name without extension
            download_path = f'/tmp/{file_name.split("/")[-1]}'  # Ensure download_path is a file path
            
            # download files directly to the destination path using download_fileobj
            with open(download_path, 'wb') as f:
                s3.download_fileobj(bucket_name, file_name, f)
            print(f"Downloaded file: {download_path}")
            
            # connect to RDS
            conn = pymysql.connect(host=rds_host, user=username, passwd=password, db=db_name, connect_timeout=5)
            
            try:
                with conn.cursor() as cur:
                    # Open the CSV file and create the table dynamically based on the headers
                    with open(download_path, 'r') as file:
                        csv_data = csv.reader(file)
                        headers = next(csv_data)  # Get column headers
                        
                        # Create table if not exists
                        create_table_sql = f"CREATE TABLE IF NOT EXISTS `{table_name}` ({', '.join([f'`{col}` VARCHAR(255)' for col in headers])})"
                        cur.execute(create_table_sql)
                        
                        # Insert data into the table
                        columns = ', '.join([f'`{col}`' for col in headers])
                        placeholders = ', '.join(['%s'] * len(headers))
                        sql = f"INSERT INTO `{table_name}` ({columns}) VALUES ({placeholders})"
                        
                        for row in csv_data:
                            cur.execute(sql, row)
                    conn.commit()
                    print(f"Data imported from {download_path} into RDS table {table_name} successfully")
            finally:
                conn.close()

    return "Data imported successfully"
