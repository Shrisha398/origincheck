import os

try:
    from PIL import Image  # type: ignore[reportMissingImports]
except ImportError:  # pragma: no cover - handled at runtime for missing Pillow installs
    raise SystemExit("Pillow is required. Install it with: pip install pillow")

def resize_and_compress():
    print("--- 224x224 Image Resizer & Compressor ---")
    
    # 1. Ask for the input image
    input_path = input("Enter the path to your image: ").strip().strip("\"'")
    
    if not os.path.exists(input_path):
        print("Error: File not found.")
        return

    # 2. Ask WHERE to save the file
    save_dir = input("Enter the folder to save it in (Press Enter to save in the same folder as original): ").strip().strip("\"'")
    
    # If the user presses Enter, default to the folder where the original image lives
    if not save_dir:
        save_dir = os.path.dirname(os.path.abspath(input_path))
        
    # Create the folder if it doesn't exist
    os.makedirs(save_dir, exist_ok=True)

    # 3. Ask for the file name
    output_name = input("Enter the new file name (Press Enter for auto-name): ").strip().strip("\"'")
    
    if not output_name:
        base_name = os.path.basename(input_path)
        name_only, _ = os.path.splitext(base_name)
        output_name = f"{name_only}_224x224.jpg"
        
    if not output_name.lower().endswith(('.jpg', '.jpeg')):
        output_name += ".jpg"

    # Combine the folder path and the file name
    final_output_path = os.path.join(save_dir, output_name)

    try:
        with Image.open(input_path) as img:
            # Convert transparent PNGs to standard RGB for JPEG compression
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            
            # Resize and save
            resized_img = img.resize((224, 224), Image.Resampling.LANCZOS)
            resized_img.save(final_output_path, "JPEG", optimize=True, quality=85)
            
            # Calculate sizes
            original_size = os.path.getsize(input_path) / 1024
            new_size = os.path.getsize(final_output_path) / 1024
            
            print("\n✅ Success!")
            print(f"Saved exactly where you wanted: {final_output_path}")
            print(f"Original Size: {original_size:.1f} KB")
            print(f"Compressed Size: {new_size:.1f} KB")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    resize_and_compress()