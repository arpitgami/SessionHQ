
import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
    try {
        // console.log("rotute was hit")
        const body = await req.json();
        // console.log(body);
        const timestamp = Math.round(Date.now() / 1000);

        const paramsToSign = {
            public_id: body.public_id,
            upload_preset: "sessionhq_image_upload",
            timestamp,
        };

        const signature = cloudinary.utils.api_sign_request(
            paramsToSign,
            process.env.CLOUDINARY_API_SECRET!
        );

        return NextResponse.json({
            status: true,
            signature,
            timestamp,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        });
    } catch (error) {
        return NextResponse.json({ status: false, error: error });
    }
}
