import json
import boto3
import csv
from io import StringIO


def lambda_handler(event, context):
    s3 = boto3.client('s3')
    bucket_name = 'ecoinsight'
    file_key = 'data/new_freezer.csv'

    # Fetch the CSV file from S3
    response = s3.get_object(Bucket=bucket_name, Key=file_key)
    csv_content = response['Body'].read().decode('utf-8')

    # Parse the CSV content
    csv_reader = csv.reader(StringIO(csv_content))
    brands = [row[0] for row in csv_reader]

    # Return the brand names in a JSON format
    return {
        'statusCode': 200,
        'body': json.dumps({'brands': brands})
    }