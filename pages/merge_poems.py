import json
import os

caocao_path = '/Users/ygs/yuangs/pages/caocao.json'
songci_path = '/Users/ygs/yuangs/pages/songci.json'

def merge_files():
    # Read Cao Cao poems
    with open(caocao_path, 'r', encoding='utf-8') as f:
        caocao_data = json.load(f)
    
    # Read Song Ci poems
    with open(songci_path, 'r', encoding='utf-8') as f:
        songci_data = json.load(f)
    
    # Append Cao Cao poems to Song Ci
    merged_data = songci_data + caocao_data
    
    # Write back to songci.json
    with open(songci_path, 'w', encoding='utf-8') as f:
        json.dump(merged_data, f, ensure_ascii=False, indent=2)
    
    print(f"Merged {len(caocao_data)} poems from {caocao_path} into {songci_path}")
    print(f"Total poems in {songci_path}: {len(merged_data)}")

if __name__ == "__main__":
    merge_files()
