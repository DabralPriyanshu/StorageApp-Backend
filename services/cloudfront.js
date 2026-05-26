import { getSignedUrl } from "@aws-sdk/cloudfront-signer";

const privateKey = process.env.CLOUDFRONT_PRIVATE_KEY;
const keyPairId = "K3K7KP5B0E0687";
const dateLessThan = new Date(Date.now() + 1000 * 60 * 60).toISOString();
const distributionName = `https://dcdfo6f4p6jx6.cloudfront.net`;

export async function createCloudFrontGetSignedUrl({ key, filename }) {
  const url = `${distributionName}/${key}`;
  const signedUrl = getSignedUrl({
    url,
    keyPairId,
    dateLessThan,
    privateKey,
  });
  console.log(signedUrl);
  return signedUrl;
}
