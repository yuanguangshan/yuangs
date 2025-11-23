import json
import os

def convert_and_append():
    guwen_path = '/Users/ygs/ygs/yuangs/pages/guwen.json'
    poetry_data_path = '/Users/ygs/ygs/yuangs/pages/poetry_data.json'

    # Read guwen.json
    with open(guwen_path, 'r', encoding='utf-8') as f:
        guwen_data = json.load(f)

    # Read poetry_data.json
    with open(poetry_data_path, 'r', encoding='utf-8') as f:
        poetry_data = json.load(f)

    # Create a set of (title, author) from guwen_data for duplicate checking
    guwen_keys = set()
    for item in guwen_data:
        title = item.get('title', 'Unknown')
        author = item.get('author', 'Unknown')
        guwen_keys.add((title, author))

    # Filter out existing items in poetry_data that match guwen items (to avoid duplicates from previous runs)
    # We assume rhythmic maps to title
    original_length = len(poetry_data)
    poetry_data = [item for item in poetry_data if (item.get('rhythmic'), item.get('author')) not in guwen_keys]
    print(f"Removed {original_length - len(poetry_data)} potential duplicate items from poetry_data.json")

    # Convert guwen data
    converted_items = []
    mapped_fields = {'content', 'title', 'author', 'tags'}

    for item in guwen_data:
        new_item = {}
        
        # Map content -> paragraphs
        if 'content' in item:
            new_item['paragraphs'] = item['content']
        else:
            new_item['paragraphs'] = []

        # Map title -> rhythmic
        if 'title' in item:
            new_item['rhythmic'] = item['title']
        else:
            new_item['rhythmic'] = "Unknown"

        # Map author -> author
        if 'author' in item:
            new_item['author'] = item['author']
        else:
            new_item['author'] = "Unknown"

        # Map tags -> tags (split by /)
        if 'tags' in item:
            if isinstance(item['tags'], str):
                new_item['tags'] = item['tags'].split('/')
            elif isinstance(item['tags'], list):
                new_item['tags'] = item['tags']
            else:
                 new_item['tags'] = []
        else:
            new_item['tags'] = []

        # Merge other fields into desc
        desc_parts = []
        for key, value in item.items():
            if key not in mapped_fields:
                # Format: 【Key】 Value
                # Ensure value is a string for display
                if isinstance(value, list):
                    val_str = ", ".join(map(str, value))
                else:
                    val_str = str(value)
                desc_parts.append(f"【{key}】 {val_str}")
        
        if desc_parts:
            new_item['desc'] = "\n".join(desc_parts)

        converted_items.append(new_item)

    # Append to poetry_data
    poetry_data.extend(converted_items)

    # Write back to poetry_data.json
    with open(poetry_data_path, 'w', encoding='utf-8') as f:
        json.dump(poetry_data, f, ensure_ascii=False, indent=2)

    print(f"Successfully appended {len(converted_items)} items from guwen.json to poetry_data.json with desc field")

if __name__ == "__main__":
    convert_and_append()
