import os
import logging
from flask import Flask, render_template, request, flash, redirect, url_for
from flask_mail import Mail, Message
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# App configuration
app.config.update(
    SECRET_KEY=os.environ.get('SECRET_KEY', 'dev-secret-key'),
    DEBUG=os.environ.get('FLASK_DEBUG', 'False').lower() in ['true', '1', 'yes'],
    MAIL_SERVER=os.environ.get('MAIL_SERVER', 'smtp.gmail.com'),
    MAIL_PORT=int(os.environ.get('MAIL_PORT', 587)),
    MAIL_USE_TLS=os.environ.get('MAIL_USE_TLS', 'True').lower() in ['true', '1', 'yes'],
    MAIL_USERNAME=os.environ.get('MAIL_USERNAME'),
    MAIL_PASSWORD=os.environ.get('MAIL_PASSWORD'),
    MAIL_DEFAULT_SENDER=os.environ.get('MAIL_DEFAULT_SENDER', 'vickysha7121@gmail.com')
)

mail = Mail(app)

@app.route('/')
def home():
    """Render the main website page"""
    return render_template('index.html')

@app.route('/submit-form', methods=['POST'])
def submit_form():
    """Handle contact form submission"""
    try:
        # Get form data
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        subject = request.form.get('subject', '').strip()
        message = request.form.get('message', '').strip()

        # Validate required fields
        if not all([name, email, message]):
            flash('Name, email, and message are required fields.', 'error')
            return redirect(url_for('home') + '#contact')

        # Validate email format
        if '@' not in email or '.' not in email:
            flash('Please enter a valid email address.', 'error')
            return redirect(url_for('home') + '#contact')

        # Debug: Print form data and recipient
        print('Form data:', name, email, subject, message)
        print('Sending email from:', app.config['MAIL_DEFAULT_SENDER'])
        print('Sending email to:', os.environ.get('CONTACT_EMAIL', app.config['MAIL_USERNAME']))

        # Prepare email message
        msg = Message(
            subject=f'New Contact Form Submission: {subject or "No Subject"}',
            recipients=[os.environ.get('CONTACT_EMAIL', app.config['MAIL_USERNAME'])],
            sender=app.config['MAIL_DEFAULT_SENDER'],
            reply_to=email,
            body=f"""
            You have received a new contact form submission:

            Name: {name}
            Email: {email}
            Subject: {subject or "Not specified"}

            Message:
            {message}

            ---
            Visura Infotech Contact Form
            """
        )

        # Send email
        mail.send(msg)

        # Log successful submission
        logger.info(f"Contact form submitted by {name} ({email})")
        flash('Your message has been sent successfully! We will contact you soon.', 'success')

    except Exception as e:
        logger.error(f"Error processing contact form: {str(e)}")
        flash('An error occurred while sending your message. Please try again later.', 'error')

    return redirect(url_for('home') + '#contact')

if __name__ == '__main__':
    app.run( debug=True)