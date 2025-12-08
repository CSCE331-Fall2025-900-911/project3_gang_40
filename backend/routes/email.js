// backend/email.js
import sgMail from "@sendgrid/mail";
import express from "express";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// --- Email sending functions ---
export async function sendOrderConfirmationEmailBackend(email, orderId, cart) {
  try {
    let itemsHtml = "";
    let totalAmount = 0;

    cart.forEach(item => {
      const drinkPrice = Number(item.drink.base_price) || 0;
      const sizeExtra = Number(item.modifications.size_extra_cost) || 0;
      const toppingExtra = Number(item.modifications.topping?.extra_cost) || 0;
      const quantity = Number(item.quantity) || 1;

      const itemTotal = (drinkPrice + sizeExtra + toppingExtra) * quantity;
      totalAmount += itemTotal;

      itemsHtml += `
        <tr>
          <td>${item.drink.drink_name}</td>
          <td>${item.modifications.size_name || "Standard"}</td>
          <td>${item.modifications.sweetness}</td>
          <td>${item.modifications.ice}</td>
          <td>${item.modifications.topping?.topping_name || "None"}</td>
          <td>${quantity}</td>
          <td>$${itemTotal.toFixed(2)}</td>
        </tr>
      `;
    });

    const msg = {
      to: email,
      from: process.env.EMAIL_FROM,
      subject: `✅ Order ${orderId} Confirmed!`,
      text: `Your order ${orderId} has been received. Total: $${totalAmount.toFixed(2)}`,
      html: `<h2>Thank you for your order!</h2>
             <p>Order ID: <strong>${orderId}</strong></p>
             <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
               <thead>
                 <tr>
                   <th>Drink</th>
                   <th>Size</th>
                   <th>Sweetness</th>
                   <th>Ice</th>
                   <th>Topping</th>
                   <th>Qty</th>
                   <th>Total</th>
                 </tr>
               </thead>
               <tbody>${itemsHtml}</tbody>
             </table>
             <p><strong>Order Total: $${totalAmount.toFixed(2)}</strong></p>
             <p>Your order is being prepared and will be ready soon!</p>`
    };

    await sgMail.send(msg);
    console.log(`Confirmation email sent to ${email}`);
  } catch (err) {
    console.error("SendGrid confirmation email error:", err);
    throw err;
  }
}

export async function sendOrderReadyEmailBackend(email, orderId) {
  try {
    const msg = {
      to: email,
      from: process.env.EMAIL_FROM,
      subject: `🎉 Order ${orderId} is Ready!`,
      text: `Your order ${orderId} is ready for pickup!`,
      html: `<strong>Your order ${orderId} is ready for pickup!</strong>`
    };

    await sgMail.send(msg);
    console.log(`Order ready email sent to ${email}`);
  } catch (err) {
    console.error("SendGrid order ready email error:", err);
    throw err;
  }
}

// --- Optional: routes for frontend fetch ---
const router = express.Router();

router.post("/send-email", async (req, res) => {
  try {
    const { email, orderId, cart } = req.body;
    await sendOrderConfirmationEmailBackend(email, orderId, cart);
    res.json({ success: true, message: `Email sent to ${email}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Email failed" });
  }
});

router.post("/send-order-ready", async (req, res) => {
  try {
    const { email, orderId } = req.body;
    await sendOrderReadyEmailBackend(email, orderId);
    res.json({ success: true, message: `Order ready email sent to ${email}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Email failed" });
  }
});

export default router;
