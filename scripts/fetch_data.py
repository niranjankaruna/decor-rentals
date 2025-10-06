import os
import csv
import json
import requests

# ---- CONFIG ----
SPREADSHEET_ID = "1E13tgTfM-iifKKJJJ_FAAiEJ3rpt3CAcFEbRcx7qU2A"
SHEETS = ["Categories", "Products", "Decors", "Events"]
IMAGES_DIR = os.path.join("src", "assets", "images")
ASSETS_DIR = os.path.join("src", "assets")

# --- Helper: Get CSV export URL for a specific sheet ---
def get_sheet_csv_url(sheet_name):
    return f"https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet={sheet_name}"


def ensure_dir(path):
    """Ensure directory exists."""
    os.makedirs(path, exist_ok=True)


def extract_drive_file_id(url):
    """Extract file ID from Google Drive URL patterns."""
    if "id=" in url:
        return url.split("id=")[1].split("&")[0]
    elif "/d/" in url:
        return url.split("/d/")[1].split("/")[0]
    return None


def find_existing_file(save_dir, file_id):
    """Check if the file with this ID already exists (any supported extension)."""
    for ext in [".jpg", ".jpeg", ".png", ".mp4", ".webp", ".bin"]:
        path = os.path.join(save_dir, file_id + ext)
        if os.path.exists(path):
            return path
    return None


def download_drive_file(url, save_dir):
    """
    Download file from a public Google Drive link.
    If file already exists, skip download.
    Returns Angular asset path like 'assets/images/<fileid>.<ext>'.
    """
    ensure_dir(save_dir)
    file_id = extract_drive_file_id(url)
    if not file_id:
        print(f"⚠️ Unable to extract file ID from: {url}")
        return None

    existing_file = find_existing_file(save_dir, file_id)
    if existing_file:
        print(f"⏩ Skipped (already exists): {existing_file}")
        # Return Angular-friendly relative path
        return f"assets/images/{os.path.basename(existing_file)}"

    download_url = f"https://drive.google.com/uc?export=download&id={file_id}"

    try:
        response = requests.get(download_url, stream=True)
        response.raise_for_status()

        content_type = response.headers.get("content-type", "").lower()
        if "jpeg" in content_type:
            ext = ".jpg"
        elif "png" in content_type:
            ext = ".png"
        elif "mp4" in content_type or "video" in content_type:
            ext = ".mp4"
        elif "webp" in content_type:
            ext = ".webp"
        else:
            ext = ".bin"

        local_filename = os.path.join(save_dir, file_id + ext)

        with open(local_filename, "wb") as f:
            for chunk in response.iter_content(1024):
                f.write(chunk)

        print(f"✅ Downloaded: {local_filename}")
        return f"assets/images/{file_id + ext}"

    except Exception as e:
        print(f"❌ Failed to download {url}: {e}")
        return None


def fetch_sheet_data(sheet_name):
    """Fetch CSV data for a sheet and process rows."""
    url = get_sheet_csv_url(sheet_name)
    print(f"\n📥 Fetching CSV for sheet: {sheet_name}")
    response = requests.get(url)
    response.raise_for_status()

    lines = response.text.splitlines()
    reader = csv.DictReader(lines)

    processed = []
    ensure_dir(IMAGES_DIR)

    for row in reader:
        obj = dict(row)
        image_links = row.get("ImageLinks")

        if image_links:
            links = [link.strip() for link in image_links.split("|") if link.strip()]
            local_paths = []
            for link in links:
                angular_path = download_drive_file(link, IMAGES_DIR)
                if angular_path:
                    local_paths.append(angular_path)
            obj["ImageLocal"] = local_paths

        processed.append(obj)

    return processed


def main():
    all_data = {}
    ensure_dir(ASSETS_DIR)
    for sheet_name in SHEETS:
        try:
            all_data[sheet_name] = fetch_sheet_data(sheet_name)
        except Exception as e:
            print(f"❌ Failed to process sheet '{sheet_name}': {e}")

    output_path = os.path.join(ASSETS_DIR, "data.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(all_data, f, indent=4, ensure_ascii=False)

    print(f"\n🎉 All sheets processed and saved to {output_path}")


if __name__ == "__main__":
    main()
