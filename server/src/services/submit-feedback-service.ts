import { MailAdapter } from "../adapters/mail-adapter";
import { FeedbacksRepository } from "../repositores/feedback-repository";

interface SubmitFeedbackServiceRequest {
    type: string
    comment: string
    screenshot?: string
}

export class SubmitFeedbackService {

    constructor(
        private feedbackRepository: FeedbacksRepository,
        private mailAdapter: MailAdapter
    ){}

    async execute(request: SubmitFeedbackServiceRequest){
        const {type, comment, screenshot} = request

        if(!type){
            throw new Error('Type is required.')
        }

        if(!comment){
            throw new Error('Comment is required.')
        }

        if(screenshot && !screenshot.startsWith('data:image/png;base64')){
            throw new Error('Invalid format')
        }

        await this.feedbackRepository.create({
            type,
            comment,
            screenshot,
        })

        await this.mailAdapter.sendMail({
            subject: 'Novo Feedback',
            body: [
                `<div style="font-family: sans-serif; font-size: 16px; color: #00000;">`,
                `<p>Tipo de feedback: ${type}<p>`,
                `<p>Comentário: ${comment}<p>`,
                `<div>`
            ].join('\n')
        })

    }
}