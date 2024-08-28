import { Controller, Get, Query } from '@nestjs/common';
import { Neis } from 'neis.ts';
import { config } from 'dotenv'; config();

const env = process.env

@Controller('searchSchool')
export class MealsController {
  @Get('school')
  async getSchools(@Query('startsWith') startsWith) {
    
    const neis = new Neis({
      key: env.KEY,
      pSize: 50,
    });

    const schoolNames: [string, string][] = [];

    await neis
      .getSchool({
        SCHUL_NM: startsWith,
      })
      .then((res) => {
        for (const value of res.values()) {
            schoolNames.push([value.SCHUL_NM, value.ORG_RDNDA])
        }
      })
      .catch((err) => {
        schoolNames.push(err)
      });
    return schoolNames
  }
}