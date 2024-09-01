import { Controller, Get, Query } from '@nestjs/common';
import { Neis, MealServiceDietInfoParam, SchoolInfoResponse } from 'neis.ts';
import { config } from 'dotenv'; import { SchoolService } from './school.service';
config();

const env = process.env

@Controller('school')
export class SchoolController {
    constructor(private readonly schoolService: SchoolService) { }
    @Get('getMyMeal') //본인 학교
    async getMeal(@Query('schoolCode') code, @Query('mealCode') mc) {

        const neis = new Neis({
            key: env.KEY,
            pSize: 50,
        });

        let schoolCode = "";
        let status = 0;

        await neis
            .getSchool({
                SD_SCHUL_CODE: code
            })
            .then((res) => {
                schoolCode = res.at(0).ATPT_OFCDC_SC_CODE;
                status = 200;
            })
            .catch((err) => {
                status = 404;
            });


        if (status == 404) {
            return { result: Result.fail };
        } else {
            const params: MealServiceDietInfoParam = {
                ATPT_OFCDC_SC_CODE: schoolCode,
                SD_SCHUL_CODE: code,
                MMEAL_SC_CODE: mc,
                MLSV_YMD: await this.schoolService.getTodayAsYYYYMMDD()
            };

            return await neis.getMeal(params);
        }
    }
}