# SwifttDrop Webhook Data Storage

This directory contains JSON files of all webhook data sent from the SwifttDrop landing page forms.

## Directory Structure

- `/delivery` - Delivery request data
- `/merchant` - Merchant registration data
- `/rider` - Rider application data
- `/tracking` - Tracking request data

## File Naming Convention

Files are named using the following format:
```
YYYY-MM-DDTHH-MM-SS.sssZ-[REQUEST_ID].json
```

For example:
```
2023-06-20T15-30-45.123Z-DEL-1687275045123-abc123def.json
```

## Data Format

Each JSON file contains the complete data submitted through the form, along with:
- `timestamp` - ISO timestamp of when the request was made
- `requestId` - Unique identifier for the request

## Usage

This data can be used for:
- Backup of all form submissions
- Debugging webhook issues
- Data recovery if external systems fail
- Auditing and analytics

## Note

This data storage is separate from the webhook submissions to external systems. All data is stored locally even if webhook submissions fail.