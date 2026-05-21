import { Body, Controller, Get, Post } from "@nestjs/common";
import { CaptchaService } from "./captcha.service";

@Controller("captcha")
export class CaptchaController{

    constructor(
        private captchaService: CaptchaService
    ){}

    @Get("generate")
    getCaptcha(){
        return this.captchaService.generate();
    }

    @Post("verify")
    verifyCaptcha(@Body() userInput:{ code: string}){
        return this.captchaService.verify(userInput)
    }

}
