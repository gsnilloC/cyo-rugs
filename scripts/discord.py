import requests
import json

def send_discord_message(order_details):
    # Replace with your actual Discord Webhook URL
    webhook_url = 'https://discord.com/api/webhooks/YOUR_WEBHOOK_URL'

    # Create the message payload
    message = {
        "content": f"New Order Placed! :package:\n\n{order_details}",
        "username": "CYO Rugs Bot",
        "avatar_url": "https://your-image-url.com/logo.png"  # Optional: URL to the bot avatar image
    }

    # Send the message to the Discord channel
    response = requests.post(
        webhook_url, data=json.dumps(message), headers={'Content-Type': 'application/json'}
    )

    # Check for successful response
    if response.status_code == 204:
        print("Message sent to Discord channel successfully!")
    else:
        print(f"Failed to send message to Discord. Status code: {response.status_code}")

# Example order details
order_details = """
Order ID: 12345
Customer: John Doe
Item: Custom Rug - 'Abstract Design'
Amount: $199.99
Status: Payment Confirmed
"""

# Trigger the Discord message
send_discord_message(order_details)