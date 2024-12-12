const { decrementInventory } = require("../../services");

const handlePaymentWebhook = async (req, res) => {
  try {
    const event = req.body;
    console.log("Received payment webhook event:", event.type);

    if (
      event.type === "payment.updated" &&
      event.data?.object?.payment?.status === "COMPLETED" &&
      !event.data?.object?.payment?.refunded
    ) {
      const orderId = event.data.object.payment.orderId;
      if (orderId) {
        await decrementInventory(orderId);
      }
    }

    res.status(200).send("Payment webhook processed successfully");
  } catch (error) {
    console.error("Error processing payment webhook:", error);
    res.status(500).send("Error processing payment webhook");
  }
};

module.exports = handlePaymentWebhook;
