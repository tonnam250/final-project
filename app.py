from flask import Flask, render_template, request
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import qrcode
import io
import base64
import json

app = Flask(__name__)

def generate_qrcode_with_style(data, role):
    background_path = r"C:\Users\Nawisa T\OneDrive\Senior_Project\Try_decorate_barcode(2)\static\images\Background.png"
    font_path = r"C:\Users\Nawisa T\OneDrive\Senior_Project\Try_decorate_barcode(2)\static\fonts\ARLRDBD.TTF"
    font_italic_path = r"C:\Users\Nawisa T\OneDrive\Senior_Project\Try_decorate_barcode(2)\static\fonts\BELLI.TTF"

    try:
        background = Image.open(background_path).convert("RGBA")
    except FileNotFoundError:
        print(f"Error: Background image not found at {background_path}")
        return None

    max_width = 350
    if background.width > max_width:
        new_width = max_width
        new_height = int(background.height * (new_width / background.width))
        background = background.resize((new_width, new_height), Image.Resampling.LANCZOS)
    canvas_width, canvas_height = background.size

    qr = qrcode.QRCode(
        version=4,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)
    qr_img = qr.make_image(fill_color="black", back_color=(255, 255, 255, 0)).convert("RGBA")

    frame_width = 350
    frame_height = 250
    qr_width = int(min(frame_width, frame_height) * 0.8)
    qr_img = qr_img.resize((qr_width, qr_width), Image.Resampling.LANCZOS)

    frame_x = int((canvas_width - frame_width) // 2)
    frame_y = int((canvas_height - frame_height) // 2)
    qr_y = int(frame_y + (frame_height - qr_width) // 0.68)
    qr_x = int(frame_x + (frame_width - qr_width) // 1.63)
    background.paste(qr_img, (qr_x, qr_y), qr_img)

    draw = ImageDraw.Draw(background)
    font_top = ImageFont.truetype(font_path, 22)

    if role in ["farmer"]:
        top_text = "Empowering with transparency.\nScan for quality insight!\nFrom soil to shelf."
    elif role in "factory":
        top_text = "Scan for quality assurance!\nTrack the farm-to-table journey.\nYour produce, our priority."
    elif role == "customer":
        top_text = "The information you need\n is at your fingertips.\nScan now!"
    else:
        top_text = "Scan for quality assurance!\nTrack the farm-to-table journey.\nYour produce, our priority."

    top_bbox = draw.multiline_textbbox((0, 0), top_text, font=font_top, align="center")
    top_width, top_height = top_bbox[2] - top_bbox[0], top_bbox[3] - top_bbox[1]
    center_x = canvas_width // 2
    top_center_y = frame_y - top_height // 2 - 10
    top_x = center_x - top_width // 2
    top_y = top_center_y - top_height // 0.5
    draw.multiline_text((top_x, top_y), top_text, fill="black", font=font_top, align="center", spacing=5)


    brand_text = "Purely Trace"
    slogan_text = "'Trace the Journey, Trust the Quality.'"

    # ใช้ฟอนต์แตกต่างกัน
    font_top = ImageFont.truetype(font_path, 22)
    brand_font = ImageFont.truetype(font_path, 20)
    slogan_font = ImageFont.truetype(font_italic_path, 18)  # ฟอนต์เอียง/บาง

    # คำนวณขนาดและตำแหน่ง
    brand_bbox = draw.textbbox((0, 0), brand_text, font=brand_font)
    slogan_bbox = draw.textbbox((0, 0), slogan_text, font=slogan_font)

    brand_width, brand_height = brand_bbox[2] - brand_bbox[0], brand_bbox[3] - brand_bbox[1]
    slogan_width, slogan_height = slogan_bbox[2] - slogan_bbox[0], slogan_bbox[3] - slogan_bbox[1]

    brand_x = (canvas_width - brand_width) // 2
    brand_y = int(frame_y + frame_height + 80)  # ระยะจากกรอบ

    slogan_x = (canvas_width - slogan_width) // 2
    slogan_y = brand_y + brand_height + 10  # เว้นระยะ 5px

    # วาดข้อความ
    draw.text((brand_x, brand_y), brand_text, fill="black", font=brand_font, align="center")
    draw.text((slogan_x, slogan_y), slogan_text, fill="black", font=slogan_font, align="center")


    buffer = io.BytesIO()
    background.save(buffer, format="PNG")
    return base64.b64encode(buffer.getvalue()).decode('utf-8')

def handle_qrcode_generation(form_data, role):
    data_string = json.dumps(form_data)
    qrcode_image = generate_qrcode_with_style(data_string, role)
    return qrcode_image

@app.route('/qrcode/farmer', methods=['GET', 'POST'])
def qrcode_farmer():
    if request.method == 'POST':
        try:
            form_data = {
                "tank_id": request.form.get('tank_id'),
                "production_date": request.form.get('production_date'),
                "farmer_id": request.form.get('farmer_id'),
                "destination_factory": request.form.get('destination_factory'),
                "signature": "dummy_signature"
            }
            qrcode_image = handle_qrcode_generation(form_data, "farmer")
            return render_template('qrcode_farmer.html', qrcode_image=qrcode_image)
        except Exception as e:
            return render_template('qrcode_farmer.html', error_message=f"เกิดข้อผิดพลาด: {e}")
    return render_template('qrcode_farmer.html')

@app.route('/qrcode/factory', methods=['GET', 'POST'])
def qrcode_factory():
    if request.method == 'POST':
        try:
            form_data = {
                "lot_id": request.form.get('lot_id'),
                "production_date": request.form.get('production_date'),
                "expiration_date": request.form.get('expiration_date'),
                "factory_id": request.form.get('factory_id'),
                "signature": "dummy_signature"
            }
            qrcode_image = handle_qrcode_generation(form_data, "factory")
            return render_template('qrcode_factory.html', qrcode_image=qrcode_image)
        except Exception as e:
            return render_template('qrcode_factory.html', error_message=f"เกิดข้อผิดพลาด: {e}")
    return render_template('qrcode_factory.html')

@app.route('/qrcode/customer', methods=['GET', 'POST'])
def qrcode_customer():
    if request.method == 'POST':
        try:
            form_data = {
                "lot_id": request.form.get('lot_id'),
                "product_name": request.form.get('product_name'),
                "url": request.form.get('url')
            }
            qrcode_image = handle_qrcode_generation(form_data, "customer")
            return render_template('qrcode_customer.html', qrcode_image=qrcode_image)
        except Exception as e:
            return render_template('qrcode_customer.html', error_message=f"เกิดข้อผิดพลาด: {e}")
    return render_template('qrcode_customer.html')

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
