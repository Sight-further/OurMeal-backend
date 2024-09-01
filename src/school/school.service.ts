import { Injectable } from "@nestjs/common";

@Injectable()
export class SchoolService {
    async getTodayAsYYYYMMDD() {
        const today = new Date();
        const year = today.getFullYear().toString();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
    
        return `${year}${month}${day}`;
      }
}