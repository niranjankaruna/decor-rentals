import os
import csv
import json
import requests

# --- Configuration ---
SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1E13tgTfM-iifKKJJJ_FAAiEJ3rpt3CAcFEbRcx7qU2A/export?format=csv'  # replace with your published CSV link
ASSETS_DIR = 'src/assets'
IMAGES_DIR = os.path.join(ASSETS_DIR, 'images')
OUTPUT_JSON = os.path.join(ASSETS_DIR, 'data.json')

# Ensure assets directory exists
os.makedirs(ASSETS_DIR, exist_ok=True)

# Ensure images directory exists
os.makedirs(IMAGES_DIR, exist_ok=True)

# Ensure data.json exists, create with empty array if it doesn't
if not os.path.exists(OUTPUT_JSON):
    print(f"Creating empty data.json file at {OUTPUT_JSON}")
    with open(OUTPUT_JSON, 'w') as f:
        json.dump([], f)

# Fetch CSV data from Google Sheet
response = requests.get(SHEET_CSV_URL)
response.raise_for_status()
csv_text = response.text.splitlines()
reader = csv.DictReader(csv_text)

data_list = []

for row_index, row in enumerate(reader):
    # --- Convert comma-separated columns into arrays ---
    row['Category'] = [c.strip() for c in row.get('Category', '').split(',') if c.strip()]
    row['Tags'] = [t.strip() for t in row.get('Tags', '').split(',') if t.strip()]
    row['Decor'] = [d.strip() for d in row.get('Decor', '').split(',') if d.strip()]

    # --- Process webContentLinks column ---
    web_links = row.get('webContentLinks', '').split('|')
    local_images = []

    for link_index, link in enumerate(web_links):
        link = link.strip()
        if not link:
            continue

        # Convert Google Drive shared link to direct download
        if 'drive.google.com' in link:
            try:
                file_id = link.split('/d/')[1].split('/')[0]
                direct_url = f'https://drive.google.com/uc?export=download&id={file_id}'
                filename = f"{file_id}.jpg"
            except IndexError:
                print(f"Invalid Drive URL: {link}")
                continue
        else:
            # For normal image URLs
            direct_url = link
            filename = f"{row_index}_{link_index}.jpg"

        img_path = os.path.join(IMAGES_DIR, filename)

        # Download image only if it doesn't exist
        if not os.path.exists(img_path):
            try:
                r = requests.get(direct_url, timeout=30)
                r.raise_for_status()
                with open(img_path, 'wb') as f:
                    f.write(r.content)
                print(f"Downloaded: {img_path}")
            except Exception as e:
                print(f"Failed to download {direct_url}: {e}")
                continue
        else:
            print(f"Already exists: {img_path}")

        local_images.append(f"{IMAGES_DIR}/{filename}")

    # --- Add local image paths to JSON object ---
    row['ImagesLocal'] = local_images

    # Optional: remove original webContentLinks if not needed
    # del row['webContentLinks']

    # Skip 'Image' column completely
    if 'Image' in row:
        del row['Image']

    data_list.append(row)

# --- Save final JSON ---
with open(OUTPUT_JSON, 'w') as f:
    json.dump(data_list, f, indent=2)

print(f"Processed {len(data_list)} rows and saved JSON to {OUTPUT_JSON}")
