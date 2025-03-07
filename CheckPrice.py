import requests
from flask import Flask, jsonify, render_template
from flask_cors import CORS
import time
import threading

app = Flask(__name__)
CORS(app)


def get_bitcoin_price():
    url = "https://api.coingecko.com/api/v3/simple/price"
    params = {
        "ids": "bitcoin",
        "vs_currencies": "usd"
    }
    response = requests.get(url, params=params)
    data = response.json()
    return data["bitcoin"]["usd"]

def get_historical_data():
    url = "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart"
    params = {
        "vs_currency": "usd",
        "days": "7"
    }
    response = requests.get(url, params=params)
    data = response.json()
    return data["prices"]

price_alert_threshold = 500
latest_price = get_bitcoin_price()

def priceCheck():
    global latest_price
    while True:
        current = get_bitcoin_price()
        if abs(current-latest_price) >= price_alert_threshold:
            print("ALERT !!! Significant change in price")
            latest_price = current
        time.sleep(30)

@app.route("/api/price")
def price():
    price = get_bitcoin_price()
    return jsonify({"bitcoin_price": price})

@app.route("/api/historical")
def historical():
    historical_data = get_historical_data()
    return jsonify(historical_data)

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    threading.Thread(target=priceCheck, daemon=True).start()
    app.run(debug=True)


print(get_historical_data())