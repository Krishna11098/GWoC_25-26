import nodemailer from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
  console.log('Creating email transporter...');
  console.log('EMAIL_USER configured:', !!process.env.EMAIL_USER);
  console.log('EMAIL_PASSWORD configured:', !!process.env.EMAIL_PASSWORD);
  
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Generate Google Maps URL
export const generateMapsUrl = (location) => {
  if (!location) return '';
  const encoded = encodeURIComponent(location);
  return `https://www.google.com/maps/search/?api=1&query=${encoded}`;
};

// Order confirmation email template
export const generateOrderEmailHTML = (orderData) => {
  const { orderId, items, subtotal, shipping, tax, discount, finalAmount, coinsEarned, userEmail } = orderData;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { padding: 30px 20px; }
        .success-badge { background: #10b981; color: white; display: inline-block; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: bold; margin-bottom: 20px; }
        .order-id { background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
        .order-id strong { color: #667eea; }
        .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .items-table th { background: #f9fafb; padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb; font-weight: 600; }
        .items-table td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
        .summary { background: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 20px; }
        .summary-row { display: flex; justify-content: space-between; padding: 8px 0; }
        .summary-row.total { font-weight: bold; font-size: 18px; color: #667eea; border-top: 2px solid #e5e7eb; padding-top: 15px; margin-top: 10px; }
        .coins-earned { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Order Confirmed!</h1>
          <p style="margin: 10px 0 0 0;">Thank you for your purchase</p>
        </div>
        
        <div class="content">
          <div style="text-align: center;">
            <span class="success-badge">✓ Payment Successful</span>
          </div>
          
          <div class="order-id">
            <strong>Order ID:</strong> ${orderId}
          </div>
          
          <h2 style="color: #1f2937; margin-top: 30px;">Order Items</h2>
          <table class="items-table">
            <thead>
              <tr>
                <th>Product</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td>
                    <strong>${item.title || item.name}</strong>
                    ${item.category ? `<br><span style="color: #6b7280; font-size: 12px;">${item.category}</span>` : ''}
                  </td>
                  <td style="text-align: center;">${item.quantity || 1}</td>
                  <td style="text-align: right;">₹${(item.price || 0).toFixed(2)}</td>
                  <td style="text-align: right;">₹${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="summary">
            <h3 style="margin-top: 0; color: #1f2937;">Order Summary</h3>
            <div class="summary-row">
              <span>Subtotal:</span>
              <span>₹${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
              <span>Shipping:</span>
              <span>₹${shipping.toFixed(2)}</span>
            </div>
            <div class="summary-row">
              <span>Tax (GST 18%):</span>
              <span>₹${tax.toFixed(2)}</span>
            </div>
            ${discount > 0 ? `
              <div class="summary-row" style="color: #059669;">
                <span>Discount (Coins Used):</span>
                <span>-₹${discount.toFixed(2)}</span>
              </div>
            ` : ''}
            <div class="summary-row total">
              <span>Total Paid:</span>
              <span>₹${finalAmount.toFixed(2)}</span>
            </div>
          </div>
          
          ${coinsEarned > 0 ? `
            <div class="coins-earned">
              <strong>🎁 Cashback Earned!</strong><br>
              You've earned <strong>${coinsEarned} coins</strong> (10% cashback) on this order!
            </div>
          ` : ''}
          
          <p style="margin-top: 30px; color: #6b7280;">
            Your order is being processed and will be shipped soon. You'll receive another email with tracking details once your order is dispatched.
          </p>
        </div>
        
        <div class="footer">
          <p style="margin: 0;">Thank you for shopping with us!</p>
          <p style="margin: 10px 0 0 0;">Joy Juncture - Making Every Moment Special</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Event booking confirmation email template
export const generateEventEmailHTML = (eventData) => {
  const { bookingId, eventTitle, eventDescription, location, startTime, endTime, finalAmount, coinsEarned, coinsUsed } = eventData;
  const mapsUrl = generateMapsUrl(location);
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Event Booking Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); color: white; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { padding: 30px 20px; }
        .success-badge { background: #10b981; color: white; display: inline-block; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: bold; margin-bottom: 20px; }
        .booking-id { background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
        .booking-id strong { color: #f59e0b; }
        .event-details { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; align-items: start; margin-bottom: 15px; }
        .detail-row:last-child { margin-bottom: 0; }
        .detail-icon { width: 24px; margin-right: 12px; color: #f59e0b; }
        .detail-content { flex: 1; }
        .detail-label { font-weight: 600; color: #1f2937; margin-bottom: 4px; }
        .detail-value { color: #6b7280; }
        .map-button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px; font-weight: bold; }
        .map-button:hover { background: #059669; }
        .payment-summary { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .coins-info { background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Event Booked!</h1>
          <p style="margin: 10px 0 0 0;">Your spot is confirmed</p>
        </div>
        
        <div class="content">
          <div style="text-align: center;">
            <span class="success-badge">✓ Booking Confirmed</span>
          </div>
          
          <div class="booking-id">
            <strong>Booking ID:</strong> ${bookingId}
          </div>
          
          <h2 style="color: #1f2937; margin-top: 30px;">${eventTitle}</h2>
          ${eventDescription ? `<p style="color: #6b7280; margin-top: 10px;">${eventDescription}</p>` : ''}
          
          <div class="event-details">
            <div class="detail-row">
              <div class="detail-icon">📅</div>
              <div class="detail-content">
                <div class="detail-label">Date & Time</div>
                <div class="detail-value">
                  ${startTime ? new Date(startTime).toLocaleString('en-IN', { 
                    dateStyle: 'full', 
                    timeStyle: 'short' 
                  }) : 'TBD'}
                  ${endTime ? `<br>to ${new Date(endTime).toLocaleString('en-IN', { timeStyle: 'short' })}` : ''}
                </div>
              </div>
            </div>
            
            ${location ? `
              <div class="detail-row">
                <div class="detail-icon">📍</div>
                <div class="detail-content">
                  <div class="detail-label">Location</div>
                  <div class="detail-value">${location}</div>
                  ${mapsUrl ? `
                    <a href="${mapsUrl}" class="map-button" style="display: inline-block; margin-top: 10px;">
                      🗺️ View on Google Maps
                    </a>
                  ` : ''}
                </div>
              </div>
            ` : ''}
          </div>
          
          <div class="payment-summary">
            <strong>💰 Payment Details</strong><br>
            <div style="margin-top: 10px;">
              <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                <span>Amount Paid:</span>
                <strong>₹${finalAmount.toFixed(2)}</strong>
              </div>
              ${coinsUsed > 0 ? `
                <div style="display: flex; justify-content: space-between; margin: 5px 0; color: #059669;">
                  <span>Coins Used:</span>
                  <strong>${coinsUsed} coins</strong>
                </div>
              ` : ''}
            </div>
          </div>
          
          ${coinsEarned > 0 ? `
            <div class="coins-info">
              <strong>🎁 Coins Earned!</strong><br>
              You've earned <strong>${coinsEarned} coins</strong> for attending this event!
            </div>
          ` : ''}
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <strong>⚠️ Important Reminders:</strong>
            <ul style="margin: 10px 0 0 0; padding-left: 20px;">
              <li>Please arrive 15 minutes before the event starts</li>
              <li>Keep this confirmation email handy</li>
              <li>Check your email for any event updates</li>
            </ul>
          </div>
          
          <p style="margin-top: 30px; color: #6b7280; text-align: center;">
            We're excited to see you at the event!<br>
            For any queries, please contact the event organizer.
          </p>
        </div>
        
        <div class="footer">
          <p style="margin: 0;">Thank you for booking with us!</p>
          <p style="margin: 10px 0 0 0;">Joy Juncture - Creating Memorable Experiences</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (orderData) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Joy Juncture" <${process.env.EMAIL_USER}>`,
      to: orderData.userEmail,
      subject: `Order Confirmation - ${orderData.orderId}`,
      html: generateOrderEmailHTML(orderData),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// Send event booking confirmation email
export const sendEventConfirmationEmail = async (eventData) => {
  try {
    // Validate email
    if (!eventData.userEmail) {
      console.error('No user email provided for event confirmation');
      return { success: false, error: 'No user email provided' };
    }
    
    // Validate email credentials
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error('Email credentials not configured. EMAIL_USER:', !!process.env.EMAIL_USER, 'EMAIL_PASSWORD:', !!process.env.EMAIL_PASSWORD);
      return { success: false, error: 'Email credentials not configured' };
    }
    
    console.log('Creating transporter with user:', process.env.EMAIL_USER);
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Joy Juncture Events" <${process.env.EMAIL_USER}>`,
      to: eventData.userEmail,
      subject: `Event Booking Confirmed - ${eventData.eventTitle}`,
      html: generateEventEmailHTML(eventData),
    };

    console.log('Sending email to:', eventData.userEmail);
    const info = await transporter.sendMail(mailOptions);
    console.log('Event confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending event confirmation email:', error.message);
    console.error('Error details:', error);
    return { success: false, error: error.message };
  }
};
