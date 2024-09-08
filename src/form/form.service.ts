import { Injectable } from "@nestjs/common"
import {DataService} from "../auth/db/data.service"

@Injectable()
class FormService {
    constructor(private readonly dataService: DataService) {}

    async createForm(
        form: {
            paragraph: {
                type: ParagraphType, 
                question: string, 
                answer: string[]
            }
        }
    ) {

    }
 //db connect 
    async renderAllParagraph() {
        await this.dataService.db.collection("forms").find()
    } 
}