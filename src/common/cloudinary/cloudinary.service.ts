import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
    /**
     * Upload a single image to Cloudinary
     */
    async uploadImage(
        file: Express.Multer.File,
        folder: string = 'zoura-products',
    ): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder,
                    resource_type: 'image',
                    transformation: [
                        { width: 800, height: 800, crop: 'limit' },
                        { quality: 'auto:good' },
                        { fetch_format: 'auto' },
                    ],
                },
                (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                    if (error) {
                        reject(new BadRequestException(`Image upload failed: ${error.message}`));
                    } else if (result) {
                        resolve(result.secure_url);
                    } else {
                        reject(new BadRequestException('Image upload failed: No result'));
                    }
                },
            );

            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }

    /**
     * Upload multiple images to Cloudinary
     */
    async uploadImages(
        files: Express.Multer.File[],
        folder: string = 'zoura-products',
    ): Promise<string[]> {
        const uploadPromises = files.map((file) => this.uploadImage(file, folder));
        return Promise.all(uploadPromises);
    }

    /**
     * Delete an image from Cloudinary by its public ID
     */
    async deleteImage(publicId: string): Promise<void> {
        await cloudinary.uploader.destroy(publicId);
    }

    /**
     * Extract public ID from Cloudinary URL
     */
    extractPublicId(url: string): string | null {
        const match = url.match(/\/v\d+\/(.+)\.\w+$/);
        return match ? match[1] : null;
    }
}
