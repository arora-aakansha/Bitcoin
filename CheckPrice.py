import requests
from flask import Flask, jsonify, render_template

app = Flask(__name__)

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
    app.run(debug=True)


print(get_historical_data())