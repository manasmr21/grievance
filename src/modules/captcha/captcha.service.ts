import { HttpException, Injectable } from "@nestjs/common";
import svgCaptcha from "svg-captcha"
import { handleServiceError } from "src/utils/Error/errorHandler";

@Injectable()
export class CaptchaService {


    generate() {
        try {
            const captcha = svgCaptcha.create({
                size: 6,
                noise: 6,
                color: true,
                background: "#f4f4f4"
            })

            global.captchaText = captcha.text;

            return {
                success: true,
                message: 'Captcha generated successfully',
                data: {
                    image: captcha.data,
                }
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }

    verify(userInput: {code: string}) {
        try {
            const { code } = userInput;

            if (!code) {
                throw new HttpException('Captcha code is required', 400);
            }

            if (!global.captchaText) {
                throw new HttpException('Captcha not generated', 400);
            }

            const isValid = global.captchaText === code;

            if (!isValid) {
                throw new HttpException('Invalid captcha', 400);
            }

            // Clear captcha after successful verification
            global.captchaText = null;

            return {
                success: true,
                message: 'Captcha verified successfully',
            };
        } catch (error) {
            return handleServiceError(error);
        }
    }
}