import * as parser from 'cron-parser';

interface CronOptions {
  currentDate?: string | Date;
  endDate?: string | Date;
  tz?: string;
}

async function getCronDates(cronExpression: string, numberOfDates: number, options: CronOptions = {}): Promise<string[]> {
  return new Promise((resolve, reject) => {
    try {
      const interval = parser.parseExpression(cronExpression, options);
      const dates: string[] = [];
      for (let i = 0; i < numberOfDates; i++) {
        dates.push(interval.next().toISOString());
      }
      resolve(dates);
    } catch (error) {
      reject(error);
    }
  });
}

export { getCronDates }