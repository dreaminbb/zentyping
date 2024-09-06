import random
import datetime


class SampleGenerater:

    def __init__(self):
        pass

    def active_calender(self, total_active_day):
        activity_data = []
        generated_dates = set()

        for _ in range(total_active_day):
            while True:
                try:
                    day = random.randint(1, 31)
                    month = random.randint(1, 12)
                    year = 2024
                    date_str = f'{year}-{month:02d}-{day:02d}'

                    if date_str in generated_dates:
                        continue

                    week_number = datetime.datetime.strptime(date_str, '%Y-%m-%d').isocalendar()[1]
                    day_of_week = datetime.datetime.strptime(date_str, '%Y-%m-%d').strftime('%a')
                    play_count_in_day = random.randint(1, 30)

                    activity_data.append({
                        'day': date_str,
                        'week_number': week_number,
                        'day_of_week': day_of_week,
                        'play_count_in_day': play_count_in_day
                    })
                    generated_dates.add(date_str)
                    break
                except ValueError:
                    continue

        return activity_data


print(SampleGenerater().active_calender(30))
