import Razorpay from "razorpay";
import Subscription from "../models/subscriptionModel.js";
import User from "../models/userModel.js";

export const PLANS = {
  plan_Stp6nnVtI1TqBs: {
    storageQuotaBytes: 2 * 1024 ** 4,
  },
  plan_StpAa4eib3OLdX: {
    storageQuotaBytes: 2 * 1024 ** 4,
  },
  plan_Stp8p7fOhkRTia: {
    storageQuotaBytes: 5 * 1024 ** 4,
  },
  plan_StpBRsKBndPcjU: {
    storageQuotaBytes: 5 * 1024 ** 4,
  },
  plan_Stp9eCBZUwRtDf: {
    storageQuotaBytes: 10 * 1024 ** 4,
  },
  plan_StpBz0zeTTRaO6: {
    storageQuotaBytes: 10 * 1024 ** 4,
  },
};

export const handleRazorpayWebhook = async (req, res) => {
  const signature = req.headers["x-razorpay-signature"];
  const isSignatureValid = Razorpay.validateWebhookSignature(
    JSON.stringify(req.body),
    signature,
    process.env.RAZORPAY_WEBHOOK_SECRET,
  );
  if (isSignatureValid) {
    console.log("Signature verified");

    console.log(req.body);
    if (req.body.event === "subscription.activated") {
      const rzpSubscription = req.body.payload.subscription.entity;
      const planId = rzpSubscription.plan_id;
      const subscription = await Subscription.findOne({
        razorpaySubscriptionId: rzpSubscription.id,
      });
      subscription.status = rzpSubscription.status;
      await subscription.save();
      const storageQuotaBytes = PLANS[planId].storageQuotaBytes;
      const user = await User.findById(subscription.userId);
      user.maxStorageInBytes = storageQuotaBytes;
      await user.save();
      console.log("subscription activated");
    }
  } else {
    console.log("Signature not verified");
  }
  res.end("OK");
};
