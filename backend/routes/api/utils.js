const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  uploadImages,
  createCheckout,
  verifyRecaptcha,
  uploadHomepageImages,
  deleteImagesInFolder,
  fetchHomepageImages,
  confirmationEmail,
  couponEmail,
  adminNotificationEmail,
} = require("../../services");
const { createRequest } = require("../../db");
const upload = multer();

router.post("/upload", upload.array("images"), async (req, res) => {
  try {
    const recaptchaToken = req.body.recaptchaToken;
    const isHuman = await verifyRecaptcha(recaptchaToken);

    if (!isHuman) {
      console.log("reCAPTCHA verification failed");
      return res.status(400).json({
        error: "reCAPTCHA verification failed. Please try again.",
      });
    }

    const customerData = {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      description: req.body.description,
    };

    const imageUrls = await uploadImages(
      req.files,
      customerData,
      Date.now().toString()
    );

    const createdRequest = await createRequest(customerData, imageUrls);

    // Send admin notification
    try {
      await adminNotificationEmail({
        ...customerData,
        image_urls: imageUrls,
      });
    } catch (emailError) {
      console.error("Failed to send admin notification:", emailError);
      // Don't fail the request if email fails
    }

    res.status(200).json({
      request: createdRequest,
      message: "Request submitted successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

router.post("/checkout", async (req, res) => {
  const { cartItems, discountApplied } = req.body;
  try {
    const checkoutLink = await createCheckout(cartItems, discountApplied);
    res.json({ checkoutLink });
  } catch (error) {
    console.error("Error during checkout:", error);
    const errorMessage = error.message;
    res.status(500).json({ error: errorMessage });
  }
});

router.post(
  "/upload-homepage-images",
  upload.array("images"),
  async (req, res) => {
    try {
      const imageNames = req.body.names; // Assuming names are sent as an array
      await deleteImagesInFolder("homepage/");

      const imageUrls = await uploadHomepageImages(req.files);

      const imagesWithNames = imageUrls.map((url, index) => ({
        url,
        name:
          imageNames && imageNames[index]
            ? imageNames[index]
            : `Image ${index + 1}`,
      }));

      res.status(200).json({
        message: "Images uploaded and replaced successfully",
        images: imagesWithNames,
      });
    } catch (error) {
      console.error("Error uploading homepage images:", error);
      res.status(500).json({ error: "Failed to upload images" });
    }
  }
);

router.post("/send-confirmation-email", async (req, res) => {
  const { email, name, trackingNumber } = req.body;

  try {
    await confirmationEmail(email, name, trackingNumber); // Adjust as necessary for cartItems
    res.status(200).json({ message: "Confirmation email sent successfully" });
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    res.status(500).json({ error: "Failed to send confirmation email" });
  }
});

router.post("/send-coupon-email", async (req, res) => {
  const { email, name, couponCode } = req.body;

  try {
    await couponEmail(email, name, couponCode);
    res.status(200).json({ message: "Coupon email sent successfully" });
  } catch (error) {
    console.error("Error sending coupon email:", error);
    res.status(500).json({ error: "Failed to send coupon email" });
  }
});

router.get("/homepage-images", async (req, res) => {
  try {
    const imageUrls = await fetchHomepageImages();
    res.status(200).json({ imageUrls });
  } catch (error) {
    console.error("Error fetching homepage images:", error);
    res.status(500).json({ error: "Failed to fetch homepage images" });
  }
});

module.exports = router;
