from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def home():
    return render_template('base.html')

@app.route('/1')
def page_1():
	return render_template('base2.html')

@app.route('/activity')
def activitiy():
	return render_template('base3.html')

@app.route('/example')
def example():
	return render_template('example.html')